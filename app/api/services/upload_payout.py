import pandas as pd
import logging

from ..models import Coffee, Mill
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)


def upload_payout_file(request):
    """
    Production-level payout upload service.

    Matches Coffee records by code, outturn, grade.
    Updates fields: bags, pockets, weight, price, gross_value, warehouse_charges,
    brokerage_charges, milling_charges, mill, export_charges, handling_charges, transport_charges, net_value
    """

    try:
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            raise ValidationError("No file uploaded. Please attach a CSV or Excel file.")

        # Determine file type
        if uploaded_file.name.endswith(".csv"):
            df = pd.read_csv(uploaded_file)
        elif uploaded_file.name.endswith((".xls", ".xlsx")):
            df = pd.read_excel(uploaded_file)
        else:
            raise ValidationError("Unsupported file format. Only CSV or Excel allowed.")

        required_columns = {"code", "outturn", "grade"}
        missing_columns = required_columns - set(df.columns)
        if missing_columns:
            raise ValidationError(f"Missing required columns: {', '.join(missing_columns)}")

        # Fields allowed to update
        update_fields = [
            "bags", "pockets", "weight", "price", "gross_value", "warehouse_charges",
            "brokerage_charges", "milling_charges", "mill", "export_charges",
            "handling_charges", "transport_charges", "net_value"
        ]

        updated_count = 0
        unmatched_rows = []

        with transaction.atomic():
            for idx, row in df.iterrows():
                code = row.get("code")
                outturn = row.get("outturn")
                grade = row.get("grade")

                if not (code and outturn and grade):
                    logger.warning(f"Skipping row {idx+2} with missing code/outturn/grade")
                    unmatched_rows.append({"row": idx+2, "reason": "Missing code/outturn/grade"})
                    continue

                try:
                    coffee = Coffee.objects.get(code=code, outturn=outturn, grade=grade)

                    for field in update_fields:
                        if field in row and pd.notna(row[field]):
                            # Special case: if updating mill, convert from code/name to Mill object
                            if field == "mill":
                                mill_code_or_name = row[field]
                                mill_obj = Mill.objects.filter(name__iexact=str(mill_code_or_name).strip()).first()
                                if mill_obj:
                                    setattr(coffee, field, mill_obj)
                                else:
                                    logger.warning(f"Row {idx+2}: Mill '{mill_code_or_name}' not found, skipping mill update")
                                    unmatched_rows.append({"row": idx+2, "reason": f"Mill '{mill_code_or_name}' not found"})
                                    continue
                            else:
                                setattr(coffee, field, row[field])

                    coffee.save()
                    updated_count += 1

                except Coffee.DoesNotExist:
                    logger.warning(f"Row {idx+2}: No Coffee record found for code={code}, outturn={outturn}, grade={grade}")
                    unmatched_rows.append({"row": idx+2, "reason": "Record not found"})
                    continue

        feedback = {
            "updated_records": updated_count,
            "unmatched_rows": unmatched_rows
        }

        logger.info(f"Payout upload completed: {updated_count} records updated, {len(unmatched_rows)} unmatched rows.")

        return Response(feedback, status=status.HTTP_200_OK)

    except ValidationError as ve:
        logger.warning(str(ve))
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception("Error uploading payout file")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)