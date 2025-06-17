from rest_framework.response import Response
from ..models import Coffee, Mill, Warehouse, CoffeeStatus, Farmer
from ..coffee import read_file as read
from ..coffee import clean_masterlog_df as clean
from ..coffee import check_pockets as pockets
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import math
import numpy as np
import pandas as pd
import re


def process_uploaded_files(view, data, sheets):

    data_df, file_name = read.read_xls_file(data, sheets)
    for key, df in data_df.items():
        if 'W/H' in df.columns:
            df.rename(columns={'W/H': 'WAREHOUSE'}, inplace=True)


    for key, df in data_df.items():
        if "SALE NO" in df.columns:
            # Ensure values are numeric
            df["SALE NO"] = pd.to_numeric(df["SALE NO"], errors='coerce')

            # Convert float .0 to int
            df["SALE NO"] = df["SALE NO"].apply(
                lambda x: int(x) if pd.notnull(x) and x.is_integer() else x
            )

            # Update the cleaned DataFrame back in the dictionary
            data_df[key] = df


    data =  data_df[sheets[0]].to_dict(orient='records')
    
    existing_records = get_existing_records()
    new_records = filter_new_records(data, existing_records)
    if not new_records:
        return Response({
            "success": False,
            "message": "No new records to upload, all records already exist in the database.",
            "errors": []
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return process_records(view, new_records)

def get_existing_records():
    return set(Coffee.objects.values_list('outturn', 'grade'))

def filter_new_records(cleaned_data, existing_records):
    new_records = []
    for record in cleaned_data:
        if isinstance(record, dict) and (str(record.get('outturn', '')), str(record.get('grade', ''))) not in existing_records:
            new_records.append(record)
    return new_records


def get_foreign_key_instance(model, field_name, value):
    if not value:
        return None
    try:
        return model.objects.get(name=value)
    except ObjectDoesNotExist:
        print(f"{field_name} '{value}' not found. Creating new instance.")
        return model.objects.create(name=value)

def clean_nan_values(record):
    cleaned = {}
    for key, value in record.items():
        if value is None:
            cleaned[key] = ""
        elif isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            cleaned[key] = ""
        elif isinstance(value, str) and value.strip().lower() in {"nan", "inf", "-inf"}:
            cleaned[key] = ""
        else:
            cleaned[key] = value
    return cleaned

import math

def preprocess_record(record):
    # Normalize column names (strip leading/trailing spaces)
    record = {k.strip(): v for k, v in record.items()}

    # Define which fields should be int and float
    int_fields = ['BAGS', 'SALE', 'MILL']
    float_fields = [
        'Pockets', 'pockets', 'KGS', 'KGS ', 'PRICE',
        'GROSS VALUE', 'MILLING CHARGES', 'NET PAY',
        'export_charges', 'EXPORT_CHARGES',
        'transport_charges', 'TRANSPORT_CHARGES',
        'WAREHOUSE_CHARGES', 'BROKERAGE_CHARGES'
    ]

    for field in int_fields:
        if field in record:
            val = record[field]
            try:
                record[field] = int(float(val))
            except (ValueError, TypeError):
                record[field] = 0

    for field in float_fields:
        if field in record:
            val = record[field]
            try:
                if val in [None, ''] or (isinstance(val, float) and math.isnan(val)):
                    record[field] = 0.0
                else:
                    record[field] = float(val)
            except (ValueError, TypeError):
                record[field] = 0.0

    return record

def clean_nans(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    elif isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(i) for i in obj]
    return obj

def clean_for_json(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    elif isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(v) for v in obj]
    return obj

def process_records(view, records):
    created_records, failed_records = [], []
    headers = None
    
    records = [preprocess_record(rec) for rec in records]


    for record in records:

        record['BULKOUTTURN'] = ""
        record["SALE"] = record.pop("SALE NUMBER")
        record["MILL"] = record.pop("MILLING COMPANY")
        # import ipdb; ipdb.set_trace()  # Set a breakpoint for debugging
        record["WAREHOUSE_CHARGES"] = round(record.pop("WAREHOUSE CHARGES"), 1)
        record["BROKERAGE_CHARGES"] = round(record.pop("BROKERAGE FEE + NCE FEE"), 1)
        record["EXPORT_CHARGES"] = round(record.pop("SALE OF EXPORT BAGS"), 1)
        record["TRANSPORT_CHARGES"] = round(record.pop("TRANSPORT +HANDLING CHARGES"), 1)
        raw_mark = record.pop("MARKS").split('/')[0]
        cleaned_mark = re.sub(r'\s+', ' ', raw_mark.strip())
        record["MARK"] = cleaned_mark
        

             
        try:

            # import ipdb; ipdb.set_trace()  # Set a breakpoint for debugging
            record["MILL"] = get_foreign_key_instance(Mill, "Mill", record.get("MILL")).pk
            record['TYPE'] = ""
            record["WAREHOUSE_ID"] = ""
            # Set a breakpoint for debugging
            record["STATUS"] = get_foreign_key_instance(CoffeeStatus, "CoffeeStatus", record.get("STATUS")).pk
            
            # Set a
             # Set a breakpoint for debugging
            lowercased_record = {k.lower(): v for k, v in record.items()}
            serializer = view.get_serializer(data=lowercased_record)
            if serializer.is_valid(raise_exception=False):
                view.perform_create(serializer)
                created_records.append(serializer.data)
                headers = view.get_success_headers(serializer.instance)
            else:
                log_validation_error(record, serializer.errors, failed_records)
                print(f"Validation errors for record: {record}")
        except Exception as e:
            print(e)
            log_exception_error(record, e, failed_records)
    response_data = {
        "success": bool(created_records),
        "message": "Some records were processed successfully." if created_records else "No records were created.",
        "created_records": created_records,
        "failed_records": failed_records
    }

    return Response(clean_for_json(response_data),status=status.HTTP_201_CREATED if created_records else status.HTTP_400_BAD_REQUEST,headers=headers or {})
def process_single_record(view, data):
    failed_records = []
    serializer = view.get_serializer(data=data)
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
    
    failed_records.append({"record": data, "errors": serializer.errors})
    return Response({
        "success": False,
        "message": "Failed to create record.",
        "created_records": [],
        "failed_records": failed_records
    }, status=status.HTTP_400_BAD_REQUEST)

# ANSI color codes
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"
BOLD = "\033[1m"

def log_validation_error(record, errors, failed_records):
    print(f"{BOLD}{YELLOW}Validation error for record:{RESET} {record}")
    print(f"{RED}Errors: {errors}{RESET}")
    failed_records.append({"record": record, "errors": errors})

def log_exception_error(record, exception, failed_records):
    print(f"{BOLD}{YELLOW}Error processing record:{RESET} {record}")
    print(f"{RED}Exception: {str(exception)}{RESET}")
    failed_records.append({"record": record, "errors": {"error": str(exception)}})

