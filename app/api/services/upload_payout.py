# app/api/services/upload_payout.py

import logging
import pandas as pd
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from ..models import Coffee

logger = logging.getLogger(__name__)

def clean_mark(mark: str) -> str:
    """Remove spaces and special characters from a mark string."""
    if not mark:
        return ""
    return "".join(c for c in mark if c.isalnum() or c == '/').strip()

def extract_code_from_mark(mark: str) -> str:
    """
    Clean the MARKS string and extract the code after '/'
    """
    if not mark or '/' not in mark:
        return None
    cleaned_mark = clean_mark(mark)
    code_part = cleaned_mark.split('/')[-1]
    return "".join(c for c in code_part if c.isalnum())

def upload_payout_file(request):
    """
    Upload an Excel/CSV payout file and update Coffee records.
    Matches records using code (from MARKS), OUTTURN, and GRADE.
    Updates all matching records if multiple exist.
    """
    try:
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            raise ValidationError("No file uploaded. Please attach a CSV or Excel file.")

        # Save temporarily
        temp_path = default_storage.save(f"tmp/{uploaded_file.name}", uploaded_file)
        file_path = default_storage.path(temp_path)

        # Read file into DataFrame
        if uploaded_file.name.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file_path)
        elif uploaded_file.name.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            raise ValidationError("Unsupported file format. Only Excel or CSV allowed.")

        # Clean column names
        df.columns = [col.strip().replace(" ", "_").upper() for col in df.columns]

        required_columns = ["OUTTURN", "GRADE", "MARKS"]
        for col in required_columns:
            if col not in df.columns:
                raise ValidationError(f"Missing required column: {col}")

        update_fields = [
            "BAGS", "POCKETS", "WEIGHT", "PRICE", "GROSS_VALUE",
            "WAREHOUSE_CHARGES", "BROKERAGE_CHARGES", "MILLING_CHARGES",
            "MILLING_COMPANY", "SALE_OF_EXPORT_BAGS.", "TRANSPORT_+_HANDLING_CHARGES",
            "BROKERS_TRANSPORT", "NET_PAY"
        ]

        updated_count = 0
        unmatched_rows = []

        for idx, row in df.iterrows():
            code = extract_code_from_mark(row.get("MARKS"))
            outturn = row.get("OUTTURN")
            grade = row.get("GRADE")

            if not (code and outturn and grade):
                unmatched_rows.append({"row": idx + 2, "reason": "Missing key fields"})
                continue

            try:
                # Find all matching Coffee records
                coffees = Coffee.objects.filter(
                    code=code,
                    outturn=outturn,
                    grade=grade
                )

                if not coffees.exists():
                    unmatched_rows.append({"row": idx + 2, "reason": "Record not found"})
                    continue

                for coffee in coffees:
                    for field in update_fields:
                        value = row.get(field)
                        if pd.notna(value):
                            setattr(coffee, field.lower(), value)
                    coffee.save()
                    updated_count += 1
                    logger.info(f"Updated Coffee record: CODE={code}, OUTTURN={outturn}, GRADE={grade}, ID={coffee.id}")

            except Exception as e:
                unmatched_rows.append({"row": idx + 2, "reason": f"Error: {str(e)}"})
                logger.exception(f"Error updating row {idx+2}")

        # Delete temporary file
        default_storage.delete(temp_path)

        return Response(
            {
                "updated_records": updated_count,
                "unmatched_rows": unmatched_rows
            },
            status=status.HTTP_200_OK
        )

    except ValidationError as ve:
        logger.warning(f"Validation error: {ve}")
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception("Internal error during payout upload")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)