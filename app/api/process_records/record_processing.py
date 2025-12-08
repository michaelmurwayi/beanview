from rest_framework.response import Response
from ..models import Coffee, Mill, Warehouse, CoffeeStatus, Farmer
from ..coffee import read_file as read
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import math
import pandas as pd
import re

# ANSI color codes for logging
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"
BOLD = "\033[1m"

# ------------------- Fields Config ------------------- #
INT_FIELDS = ['BAGS', 'SALE', 'MILL']
FLOAT_FIELDS = [
    'POCKETS', 'KGS', 'PRICE', 'GROSS_VALUE', 'MILLING CHARGES',
    'NET_PAY', 'EXPORT_CHARGES', 'TRANSPORT_CHARGES',
    'WAREHOUSE_CHARGES', 'BROKERAGE_CHARGES'
]
NUMERIC_FIELDS = set(INT_FIELDS + FLOAT_FIELDS)

# ------------------- Utility Functions ------------------- #
def get_foreign_key_instance(model, field_name, value):
    if not value:
        return None
    try:
        return model.objects.get(name=value)
    except ObjectDoesNotExist:
        print(f"{field_name} '{value}' not found. Creating new instance.")
        return model.objects.create(name=value)

def safe_float(val):
    """Convert value to float safely for rounding."""
    try:
        if val is None or val == "" or (isinstance(val, float) and math.isnan(val)):
            return 0.0
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def safe_int(val):
    """Convert value to int safely."""
    try:
        if val is None or val == "" or (isinstance(val, float) and math.isnan(val)):
            return 0
        return int(float(val))
    except (ValueError, TypeError):
        return 0

def clean_nan_values(record):
    cleaned = {}
    for k, v in record.items():
        if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))) or \
           (isinstance(v, str) and v.strip().lower() in {"nan", "inf", "-inf"}):
            cleaned[k] = 0 if k.upper() in NUMERIC_FIELDS else ""
        else:
            cleaned[k] = v
    return cleaned

def clean_for_json(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    elif isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(v) for v in obj]
    return obj

def preprocess_record(record):
    record = {k.strip(): v for k, v in record.items()}
    for field in INT_FIELDS:
        record[field] = safe_int(record.get(field, 0))
    for field in FLOAT_FIELDS:
        record[field] = safe_float(record.get(field, 0.0))
    return record

def log_validation_error(record, errors, failed_records):
    print(f"{BOLD}{YELLOW}Validation error:{RESET} {record}")
    print(f"{RED}Errors: {errors}{RESET}")
    failed_records.append({"record": record, "errors": errors})

def log_exception_error(record, exception, failed_records):
    print(f"{BOLD}{YELLOW}Exception processing record:{RESET} {record}")
    print(f"{RED}Exception: {exception}{RESET}")
    failed_records.append({"record": record, "errors": {"error": str(exception)}})

# ------------------- Main Functions ------------------- #

def process_uploaded_files(view, data, sheets):
    data_df, file_name = read.read_xls_file(data, sheets)

    # Normalize column names
    for key, df in data_df.items():
        df.columns = [col.strip().upper() for col in df.columns]
        if 'W/H' in df.columns:
            df.rename(columns={'W/H': 'WAREHOUSE'}, inplace=True)

    if not data_df:
        return Response({
            "success": False,
            "message": "No sheets found in uploaded Excel file",
            "errors": []
        }, status=status.HTTP_400_BAD_REQUEST)

    first_sheet = list(data_df.keys())[0]
    data = data_df[first_sheet].to_dict(orient='records')

    existing_records = get_existing_records()
    new_records = filter_new_records(data, existing_records)

    if not new_records:
        return Response({
            "success": False,
            "message": "No new records to upload, all already exist",
            "errors": []
        }, status=status.HTTP_400_BAD_REQUEST)

    return process_records(view, new_records)

def get_existing_records():
    return set(Coffee.objects.values_list('outturn', 'grade'))

def filter_new_records(cleaned_data, existing_records):
    new_records = []
    for record in cleaned_data:
        key = (str(record.get('OUTTURN', '')), str(record.get('GRADE', '')))
        if key not in existing_records:
            new_records.append(record)
    return new_records

def process_records(view, records):
    created_records, failed_records = [], []
    headers = None

    for record in records:
        try:
            record = preprocess_record(record)
            record = clean_nan_values(record)

            # Map fields
            record['BULKOUTTURN'] = ""
            record["SALE"] = safe_int(record.pop("SALE NUMBER", 0))
            record["MILL"] = record.pop("MILLING COMPANY", "")
            record["WAREHOUSE_CHARGES"] = round(safe_float(record.pop("WAREHOUSE CHARGES", 0.0)), 1)
            record["BROKERAGE_CHARGES"] = round(safe_float(record.pop("BROKERAGE FEE + NCE FEE", 0.0)), 1)
            record["EXPORT_CHARGES"] = round(safe_float(record.pop("SALE OF EXPORT BAGS", 0.0)), 1)
            record["TRANSPORT_CHARGES"] = round(safe_float(record.pop("TRANSPORT +HANDLING CHARGES", 0.0)), 1)
            raw_mark = record.pop("MARKS", "").split('/')[0]
            record["MARK"] = re.sub(r'\s+', ' ', raw_mark.strip())
            record["GROSS_VALUE"] = round(safe_float(record.get("GROSS VALUE", 0.0)), 1)
            record["NET_VALUE"] = round(safe_float(record.pop("NET PAY", 0.0)), 1)

            # Foreign keys
            record["MILL_ID"] = get_foreign_key_instance(Mill, "Mill", record.get("MILL")).pk
            record['TYPE'] = ""
            record["WAREHOUSE_ID"] = ""
            record["STATUS"] = get_foreign_key_instance(CoffeeStatus, "CoffeeStatus", record.get("STATUS")).pk

            serializer = view.get_serializer(data={k.lower(): v for k, v in record.items()})
            if serializer.is_valid(raise_exception=False):
                view.perform_create(serializer)
                created_records.append(serializer.data)
                headers = view.get_success_headers(serializer.instance)
            else:
                log_validation_error(record, serializer.errors, failed_records)

        except Exception as e:
            log_exception_error(record, e, failed_records)

    response_data = {
        "success": bool(created_records),
        "message": "Some records processed successfully" if created_records else "No records were created",
        "created_records": created_records,
        "failed_records": failed_records
    }

    return Response(clean_for_json(response_data),
                    status=status.HTTP_201_CREATED if created_records else status.HTTP_400_BAD_REQUEST,
                    headers=headers or {})

def process_single_record(view, data):
    failed_records = []
    try:
        data = preprocess_record(data)
        data = clean_nan_values(data)
        mill = Mill.objects.filter(name=data.get("MILL", "")).values_list("id", flat=True).first()
        data["MILL_ID"] = mill

        serializer = view.get_serializer(data={k.lower(): v for k, v in data.items()})
        if serializer.is_valid(raise_exception=True):
            view.perform_create(serializer)
            created_records = [serializer.data]
            headers = view.get_success_headers(serializer.instance)
            return Response({
                "success": True,
                "message": "Record created successfully.",
                "created_records": created_records,
                "failed_records": []
            }, status=status.HTTP_201_CREATED, headers=headers)

    except Exception as e:
        log_exception_error(data, e, failed_records)

    return Response({
        "success": False,
        "message": "Failed to create record.",
        "created_records": [],
        "failed_records": failed_records
    }, status=status.HTTP_400_BAD_REQUEST)
