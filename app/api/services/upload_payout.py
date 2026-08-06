# app/api/services/upload_payout.py

import logging
import pandas as pd
from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from ..models import Coffee, Farmer

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
    Matches records using farmer code (from MARKS), OUTTURN, and GRADE.
    Updates all matching records if multiple exist.
    If no matching record exists, inserts a new Coffee record.
    Also updates the `sale` field from SALE_NUMBER if present.
    Logs rows that failed to insert.
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

        # Map Excel columns to Coffee model fields
        FIELD_MAPPING = {
            "BAGS": "bags",
            "POCKETS": "pockets",
            "WEIGHT": "weight",
            "PRICE": "price",
            "GROSS_VALUE": "gross_value",
            "WAREHOUSE_CHARGES": "warehouse_charges",
            "BROKERAGE_CHARGES": "brokerage_charges",
            "MILLING_CHARGES": "milling_charges",
            "HANDLING_CHARGES": "transport_charges",
            "BROKERS_TRANSPORT": "broker_transport",   # ensure this field exists in Coffee model
            "SALE_OF_EXPORT_BAGS.": "export_charges",
            "NET_PAY": "net_value",
            "SALE_NUMBER": "sale",
            "BUYER": "buyer"
            # Add any other mappings needed here
        }

        updated_count = 0
        inserted_count = 0
        unmatched_rows = []
        not_inserted_rows = []

        for idx, row in df.iterrows():
            code = extract_code_from_mark(row.get("MARKS"))
            outturn = row.get("OUTTURN")
            grade = row.get("GRADE")

            if not (code and pd.notna(outturn) and pd.notna(grade)):
                unmatched_rows.append({"row": idx + 2, "reason": "Missing key fields"})
                logger.warning(f"Row {idx + 2}: Missing key fields (code={code}, outturn={outturn}, grade={grade})")
                continue

            try:
                # Find farmer by code
                farmer = Farmer.objects.filter(code=code).first()
                if not farmer:
                    unmatched_rows.append({
                        "row": idx + 2,
                        "reason": f"Farmer with code '{code}' not found"
                    })
                    logger.warning(f"Row {idx + 2}: Farmer with code '{code}' not found")
                    continue

                # Find all matching Coffee records using farmer__code
                coffees = Coffee.objects.filter(
                    farmer__code=code,
                    outturn=outturn,
                    grade=grade
                )

                # -------------------------
                # UPDATE existing records
                # -------------------------
                if coffees.exists():
                    for coffee in coffees:
                        for col_name, model_field in FIELD_MAPPING.items():
                            value = row.get(col_name)

                            if pd.notna(value):
                                # Normalize sale field
                                if model_field == "sale":
                                    if str(value).strip() == "":
                                        value = ""
                                    else:
                                        try:
                                            value = str(int(float(value)))
                                        except (ValueError, TypeError):
                                            value = ""

                                setattr(coffee, model_field, value)

                        coffee.save()
                        updated_count += 1
                        logger.info(
                            f"Updated Coffee record: FARMER_CODE={code}, OUTTURN={outturn}, GRADE={grade}, ID={coffee.id}, SALE={coffee.sale}"
                        )

                # -------------------------
                # INSERT new record if missing
                # -------------------------
                else:
                    try:
                        new_record_data = {
                            "farmer": farmer,
                            "outturn": outturn,
                            "grade": grade,
                        }

                        for col_name, model_field in FIELD_MAPPING.items():
                            value = row.get(col_name)

                            if pd.notna(value):
                                # Normalize sale field
                                if model_field == "sale":
                                    if str(value).strip() == "":
                                        value = ""
                                    else:
                                        try:
                                            value = str(int(float(value)))
                                        except (ValueError, TypeError):
                                            value = ""

                                new_record_data[model_field] = value

                        # Create new Coffee record
                        new_coffee = Coffee.objects.create(**new_record_data)
                        inserted_count += 1

                        logger.info(
                            f"Inserted Coffee record: FARMER_CODE={code}, OUTTURN={outturn}, GRADE={grade}, ID={new_coffee.id}, SALE={new_coffee.sale}"
                        )

                    except Exception as insert_error:
                        not_inserted_rows.append({
                            "row": idx + 2,
                            "reason": f"Insert failed: {str(insert_error)}",
                            "farmer_code": code,
                            "outturn": outturn,
                            "grade": grade
                        })
                        logger.exception(
                            f"Insert failed for row {idx + 2}: FARMER_CODE={code}, OUTTURN={outturn}, GRADE={grade}"
                        )

            except Exception as e:
                unmatched_rows.append({"row": idx + 2, "reason": f"Error: {str(e)}"})
                logger.exception(f"Error updating row {idx + 2}")

        # Delete temporary file
        default_storage.delete(temp_path)

        return Response(
            {
                "updated_records": updated_count,
                "inserted_records": inserted_count,
                "unmatched_rows": unmatched_rows,
                "not_inserted_rows": not_inserted_rows
            },
            status=status.HTTP_200_OK
        )

    except ValidationError as ve:
        logger.warning(f"Validation error: {ve}")
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception("Internal error during payout upload")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)