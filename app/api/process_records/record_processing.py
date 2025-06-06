from rest_framework.response import Response
from ..models import Coffee, Mill, Warehouse, CoffeeStatus, File
from ..coffee import read_file as read
from ..coffee import clean_masterlog_df as clean
from ..coffee import check_pockets as pockets
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import math
import numpy as np


def process_uploaded_files(view, data, sheets):

    data_df, file_name = read.read_xls_file(data, sheets)

    for key, df in data_df.items():
        if 'W/H' in df.columns:
            df.rename(columns={'W/H': 'WAREHOUSE'}, inplace=True)

    
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

def process_records(view, records):
    created_records, failed_records = [], []
    headers = None
    
    for record in records:
        
        if "SALE NO" in record:
            record['BULKOUTTURN'] = record.pop("BULK_OUTTURN")
            record["SALE"] = record.pop("SALE NO")
        try:
            
            # Clean NaNs
            record = clean_nan_values(record)
            
            print(f"Processing record: {record}")

            record["MILL"] = get_foreign_key_instance(Mill, "Mill", record.get("MILL")).pk
            record['TYPE'] = record.pop("COFFEE TYPE")
            record["WAREHOUSE"] = get_foreign_key_instance(Warehouse, "Warehouse", record.get("WAREHOUSE")).pk
            record["STATUS"] = get_foreign_key_instance(CoffeeStatus, "CoffeeStatus", record.get("STATUS")).pk
            
            
            lowercased_record = {k.lower(): v for k, v in record.items()}

            serializer = view.get_serializer(data=lowercased_record)
            if serializer.is_valid(raise_exception=False):
                view.perform_create(serializer)
                created_records.append(serializer.data)
                headers = view.get_success_headers(serializer.instance)
            else:
                log_validation_error(record, serializer.errors, failed_records)
        except Exception as e:
            log_exception_error(record, e, failed_records)
    
    return Response({
        "success": True if created_records else False,
        "message": "Some records were processed successfully." if created_records else "No records were created.",
        "created_records": created_records,
        "failed_records": failed_records
    }, status=status.HTTP_201_CREATED if created_records else status.HTTP_400_BAD_REQUEST, headers=headers or {})

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

def log_validation_error(record, errors, failed_records):
    print(f"Validation error for record: {record}")
    print(f"Errors: {errors}")
    failed_records.append({"record": record, "errors": errors})

def log_exception_error(record, exception, failed_records):
    print(f"Error processing record: {record}")
    print(f"Exception: {str(exception)}")
    failed_records.append({"record": record, "errors": {"error": str(exception)}})
