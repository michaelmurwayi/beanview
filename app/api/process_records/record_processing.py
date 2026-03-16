from rest_framework.response import Response
from ..models import Coffee, Mill, Warehouse, CoffeeStatus, Farmer
from ..coffee import read_file as read
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import math
import pandas as pd
import re
import logging

logger = logging.getLogger(__name__)

RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"
BOLD = "\033[1m"


# ------------------- Fields Config ------------------- #

INT_FIELDS = ['BAGS', 'SALE', 'MILL']

FLOAT_FIELDS = [
    'POCKETS', 'KGS', 'PRICE', 'GROSS_VALUE',
    'MILLING CHARGES', 'NET_PAY', 'EXPORT_CHARGES',
    'TRANSPORT_CHARGES', 'WAREHOUSE_CHARGES',
    'BROKERAGE_CHARGES'
]

NUMERIC_FIELDS = set(INT_FIELDS + FLOAT_FIELDS)


# ------------------- FIXED FK FUNCTION ------------------- #

def get_foreign_key_instance(model, field_name, value):

    try:

        if value is None:
            value = ""

        value = str(value).strip()

        # prevent blank
        if value in ["", "0", "nan", "None"]:

            value = "UNKNOWN"


        instance = model.objects.filter(name=value).first()

        if instance:
            return instance


        logger.warning(f"{field_name} '{value}' not found. Creating new.")

        instance = model.objects.create(name=value)

        return instance


    except Exception as e:

        logger.error(f"{field_name} FK Error: {e}")

        instance, created = model.objects.get_or_create(name="UNKNOWN")

        return instance


# ------------------- Extract Mill ------------------- #

def extract_mill_from_outturn(outturn):

    if not outturn:
        return "UNKNOWN"

    match = re.match(r"(\d+)([A-Za-z]+)", str(outturn))

    if match:
        return match.group(2)

    return "UNKNOWN"


# ------------------- Safe Converters ------------------- #

def safe_float(val):

    try:

        if val is None or val == "" or pd.isna(val):

            return 0.0

        return float(val)

    except:

        return 0.0


def safe_int(val):

    try:

        if val is None or val == "" or pd.isna(val):

            return 0

        return int(float(val))

    except:

        return 0


# ------------------- Cleaners ------------------- #

def clean_nan_values(record):

    cleaned = {}

    for k, v in record.items():

        if pd.isna(v) or v in ["nan", "None", None]:

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

    record = {k.strip().upper(): v for k, v in record.items()}

    for field in INT_FIELDS:

        record[field] = safe_int(record.get(field))

    for field in FLOAT_FIELDS:

        record[field] = safe_float(record.get(field))

    return record


# ------------------- Logging ------------------- #

def log_validation_error(record, errors, failed_records):

    print(f"{BOLD}{YELLOW}Validation error:{RESET} {record}")

    print(f"{RED}Errors: {errors}{RESET}")

    failed_records.append({"record": record, "errors": errors})


def log_exception_error(record, exception, failed_records):

    print(f"{BOLD}{YELLOW}Exception processing record:{RESET} {record}")

    print(f"{RED}Exception: {exception}{RESET}")

    failed_records.append({"record": record, "errors": str(exception)})


# ------------------- MAIN ------------------- #

def process_uploaded_files(view, data, sheets):

    data_df, file_name = read.read_xls_file(data, sheets)

    for key, df in data_df.items():

        df.columns = [col.strip().upper() for col in df.columns]

        if 'W/H' in df.columns:

            df.rename(columns={'W/H': 'WAREHOUSE'}, inplace=True)


    if not data_df:

        return Response({

            "success": False,

            "message": "No sheets found",

            "errors": []

        }, status=status.HTTP_400_BAD_REQUEST)


    first_sheet = list(data_df.keys())[0]

    data = data_df[first_sheet].to_dict(orient='records')


    existing_records = get_existing_records()

    new_records = filter_new_records(data, existing_records)


    if not new_records:

        return Response({

            "success": False,

            "message": "No new records",

            "errors": []

        }, status=status.HTTP_400_BAD_REQUEST)


    return process_records(view, new_records)


def get_existing_records():

    return set(Coffee.objects.values_list('outturn', 'grade'))


def filter_new_records(cleaned_data, existing_records):

    new_records = []

    for record in cleaned_data:

        key = (str(record.get('OUTTURN')), str(record.get('GRADE')))

        if key not in existing_records:

            new_records.append(record)

    return new_records


def clean_grower_code(mark):

    if not mark:
        return "UNKNOWN"

    return re.sub(r'[^A-Za-z0-9]', '', str(mark))


# ------------------- PROCESS RECORDS ------------------- #

def process_records(view, records):

    created_records = []

    failed_records = []

    headers = None


    for record in records:

        try:

            record = preprocess_record(record)

            record = clean_nan_values(record)


            record['BULKOUTTURN'] = ""


            record["CODE"] = clean_grower_code(

                record.get("CODE")

            )

            
            record["SALE"] = safe_int(

                record.get("SALE NUMBER")

            )


            record["SEASON"] = record.get("SEASON", "")


            outturn = record.get("OUTTURN")


            mill_name = record.get("MILL")

            if not mill_name:

                mill_name = extract_mill_from_outturn(outturn)


            mill_instance = get_foreign_key_instance(

                Mill,

                "Mill",

                mill_name

            )


            warehouse_instance = get_foreign_key_instance(

                Warehouse,

                "Warehouse",

                record.get("WAREHOUSE")

            )


            status_instance = get_foreign_key_instance(

                CoffeeStatus,

                "CoffeeStatus",

                record.get("STATUS")

            )


            record["MILL_ID"] = mill_instance.pk

            record["WAREHOUSE_ID"] = warehouse_instance.pk

            record["STATUS"] = status_instance.pk


            raw_mark = str(

                record.get("MARK", "")

            ).split('/')[0]


            record["MARK"] = raw_mark.strip()


            serializer = view.get_serializer(

                data={k.lower(): v for k, v in record.items()}

            )


            if serializer.is_valid():

                view.perform_create(serializer)

                created_records.append(serializer.data)

                headers = view.get_success_headers(

                    serializer.instance

                )

            else:

                log_validation_error(

                    record,

                    serializer.errors,

                    failed_records

                )


        except Exception as e:

            log_exception_error(

                record,

                e,

                failed_records

            )


    return Response(

        clean_for_json({

            "success": bool(created_records),

            "created_records": created_records,

            "failed_records": failed_records

        }),

        status=status.HTTP_201_CREATED

        if created_records

        else status.HTTP_400_BAD_REQUEST,

        headers=headers or {}

    )


# ------------------- SINGLE RECORD ------------------- #

def process_single_record(view, data):

    failed_records = []

    try:

        data = preprocess_record(data)

        data = clean_nan_values(data)


        mill_name = data.get("MILL")

        if not mill_name:

            mill_name = extract_mill_from_outturn(

                data.get("OUTTURN")

            )


        mill_instance = get_foreign_key_instance(

            Mill,

            "Mill",

            mill_name

        )


        data["MILL_ID"] = mill_instance.pk


        serializer = view.get_serializer(

            data={k.lower(): v for k, v in data.items()}

        )


        if serializer.is_valid():

            view.perform_create(serializer)

            return Response({

                "success": True,

                "created_records": [serializer.data]

            }, status=status.HTTP_201_CREATED)


        else:

            return Response({

                "success": False,

                "errors": serializer.errors

            }, status=status.HTTP_400_BAD_REQUEST)


    except Exception as e:

        log_exception_error(

            data,

            e,

            failed_records

        )


        return Response({

            "success": False,

            "failed_records": failed_records

        }, status=status.HTTP_400_BAD_REQUEST)