from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime, timedelta
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.response import Response
from .process_mill_statements import DataCleaner
from .coffee.read_file import read_xls_file
from .coffee.clean_masterlog_df import clean_outturns
from .coffee.check_pockets import check_for_pockets
import os
import json 
from .process_records.record_processing import process_uploaded_files, process_single_record
import csv
from io import StringIO
from rest_framework.exceptions import ValidationError
from django.conf import settings
from openpyxl import load_workbook
import traceback
from openpyxl.cell.cell import MergedCell
import pandas as pd
from copy import copy
from openpyxl import Workbook
import zipfile
from io import BytesIO
from django.http import FileResponse
from django.http import HttpResponse
import tempfile
from openpyxl.worksheet.worksheet import Worksheet
from collections import defaultdict






class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class FarmersViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

    def list(self, request, *args, **kwargs):
        farmers = Farmer.objects.all()
        serializer = self.get_serializer(farmers, many=True)
        
        return Response(serializer.data)  
    
    def create(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as e:
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
     
@method_decorator(csrf_exempt, name='dispatch')
class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer

    def create(self, request, *args, **kwargs):
        
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        # import ipdb;ipdb.set_trace()
        files = request.FILES
        sheets = data.get("sheetnames", "").split(",") if data.get("sheetnames") else []
        if files and sheets:
            
            return process_uploaded_files(self, data, sheets)
        
        return process_single_record(self, data)
        
    def update(self, request, *args, **kwargs):
        """Handle the PUT method for updating a Coffee record."""
        
        instance = self.get_object()
        
        # PUT should usually update entire resource, so partial=False
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=False, methods=['GET'], url_path='total_net_weight')
    def total_net_weight(self, request):
        try:
            # Exclude coffee with status 'SOLD' (compare via related CoffeeStatus.name)
            records = self.queryset.exclude(status_id=1).values_list('weight', flat=True)
            total_net_weight = sum(records)
            return Response({"total_net_weight": total_net_weight})
        except Exception as e:
            return Response(
                {"error": f"Error calculating total net weight: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=False, methods=['GET'], url_path='total_tare_weight')
    def total_tare_weight(self, request):
        try:
            records = self.queryset.exclude(status="SOLD").values_list('tare_weight', flat=True)
            total_tare_weight = sum(records)
            return Response({"total_tare_weight": total_tare_weight})
        except Exception as e:
            return Response({"error": f"Error calculating total tare weight: {str(e)}"}, status=400)

    @action(detail=False, methods=['GET'], url_path='total_number_bags')
    def total_number_bags(self, request):
        try:
            records = self.queryset.exclude(status="SOLD").values_list('bags', flat=True)
            total_number_bags = sum(records)
            return Response({"total_number_bags": total_number_bags})
        except Exception as e:
            return Response({"error": f"Error calculating total number of bags: {str(e)}"}, status=400)

    @action(detail=False, methods=['GET'], url_path='total_number_farmers')
    def total_number_farmers(self, request):
        try:
            total_number_farmers = self.queryset.values("estate").distinct().count()
            return Response({"total_number_farmers": total_number_farmers})
        except Exception as e:
            return Response({"error": f"Error calculating total number of farmers: {str(e)}"}, status=400)

    @action(detail=False, methods=['GET'], url_path='performance_per_grade')
    def performance_per_grade(self, request):
        try:
            performance_per_grade = []
            distinct_grades = self.queryset.values("grade").distinct()
            for record in distinct_grades:
                grade = record["grade"]
                grade_records = self.queryset.filter(grade=grade)
                total_weight = grade_records.aggregate(total_weight=Sum('net_weight'))['total_weight'] or 0
                performance_per_grade.append({"grade": grade, "net_weight": total_weight})
            return Response({"Performance": performance_per_grade})
        except Exception as e:
            return Response({"error": f"Error calculating performance per grade: {str(e)}"}, status=400)

    @action(detail=False, methods=['GET'], url_path='daily_delivery')
    def daily_delivery(self, request):
        try:
            deliveries = []
            records = self.queryset.values()
            for record in records:
                target_date = record.get('created_at')
                if target_date and is_less_than_24_hours_ago(target_date):
                    deliveries.append(record)
            return Response({"deliveries": deliveries})
        except Exception as e:
            return Response({"error": f"Error fetching daily deliveries: {str(e)}"}, status=400)

    # generate stock summary from farmer records
        
    @action(detail=False, methods=['POST'])
    def generate_summary_file(self, request, *args, **kwargs):
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'stock_summary_template.xlsx')
        START_ROW = 32

        try:
            summaries = request.data.get('summaries', [])

            if not summaries:
                raise ValidationError("'summaries' is required and must not be empty.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            generated_files = []

            for summary in summaries:
                mark = summary.get('mark')
                records = summary.get('records', [])
                code = summary.get("records")[0]['farmer']['code']

                if not mark or not records:
                    continue

                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active

                # Set mark name in cell B6
                ws['B3'] = code
                ws['B4'] = mark
                
                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset

                    values = [
                        record.get('outturn'),
                        record.get('bulkoutturn'),
                        record.get('mark'),
                        record.get('type'),
                        record.get('grade'),
                        record.get('bags'),
                        record.get('pockets'),
                        record.get('weight'),
                        record.get('sale_number'),
                        record.get('season'),
                        record.get('certificate'),
                        record.get('mill'),
                        record.get('warehouse'),
                        record.get('price'),
                        record.get('buyer'),
                        record.get('status'),
                    ]

                    for col_index, value in enumerate(values, start=1):
                        cell = ws.cell(row=row, column=col_index)
                        if isinstance(cell, MergedCell):
                            continue
                        cell.value = value

                wb.save(file_path)
                generated_files.append(file_path)

            # ✅ Create ZIP in memory
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                for file_path in generated_files:
                    arcname = os.path.basename(file_path)
                    zip_file.write(file_path, arcname=arcname)

            zip_buffer.seek(0)

            # ✅ Return as downloadable file
            return FileResponse(
                zip_buffer,
                as_attachment=True,
                filename=f"stock_summaries_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
                content_type='application/zip'
            )

        except ValidationError as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def assign_lots(df, start_lot=7301):
    df = df.copy()
    df["LOT"] = list(range(start_lot, start_lot + len(df)))
    return df, len(df)


def summarize_grades(df):
    summary = df.groupby("grade")["bags"].sum().to_dict()
    total_bags = df["bags"].sum()
    return summary, total_bags

def write_grade_summary(ws: Worksheet, summary: dict, start_row: int = 19, start_col: int = 8):
    """
    Write grade summary data to an Excel worksheet starting from a specific row and column.

    Args:
        ws (Worksheet): An openpyxl Worksheet object.
        summary (dict): A dictionary with grade names as keys and bag counts as values.
        start_row (int): The starting row index (1-based).
        start_col (int): The starting column index (1-based).
    """
    for idx, (grade, bags) in enumerate(summary.items()):
        row = start_row + idx  # Calculate the current row for this item

        # Write the grade to the first column
        ws.cell(row=row, column=start_col, value=grade)

        # Write the bags to the column right next to it
        ws.cell(row=row, column=start_col + 1, value=bags)


def write_summary_to_excel(ws, num_bags, num_lots):
    summary_text = f"{num_bags} bags of Kenya Coffee In {num_lots} Lots"
    ws["I9"] = summary_text

def write_warehouse_location(ws, records):
    # Extract unique warehouse IDs from records
    warehouse_ids = {record.get("warehouse") for record in records if record.get("warehouse")}
    
    # Get warehouse names from DB
    warehouses = Warehouse.objects.filter(id__in=warehouse_ids).values_list("name", flat=True)
    warehouses = sorted({w.strip().upper() for w in warehouses if w})
    
    # Format location string
    if not warehouses:
        location_text = "Located at (No warehouse info)"
    elif len(warehouses) == 1:
        location_text = f"Located at ({warehouses[0]} warehouse)"
    else:
        location_text = f"Located at ({' & '.join(warehouses)} warehouse)"

    ws["I10"] = location_text

def write_milled_by(ws: Worksheet, records: list, start_row: int = 46, start_col: int = 5):
    """
    Write unique mills into the Excel worksheet starting from given row and column.

    Args:
        ws (Worksheet): openpyxl Worksheet to write into.
        records (list): List of record dicts with a "mill" field (mill ID).
        start_row (int): Row to start writing from (default is 10).
        start_col (int): Column index (1-based, e.g., 9 = column I).
    """
    # Mapping of mill codes to mill names
    mill_map = {
        "HC": "Hema",
        "BU": "Bungoma",
        "GR": "",
        "ICM": "",
        "LE": "Lower Eastern Millers",
        "KF": "Kofinaf",
        "KP": "NKPCU",
        "KM": "Komothai",
        "KK": "Kipkeleon",
        "TY": "Othaya Millers",
        "USCM": "Umoja Millers",
        "RF": "",
        "TK": "",
        "TCM": "",
        "HM": "Hema",
        "US": "Umoja Millers",
        "ED": "Eda Millers",
        "FH": ""
    }

    # Extract unique mill codes from the records
    unique_mill_codes = sorted({record.get("mill") for record in records if record.get("mill")})
    for i, code in enumerate(unique_mill_codes):
        name = mill_map.get(code, "")
        row = start_row + i
        # Write code in the first cell
        ws.cell(row=row, column=start_col, value=code)
        # Write name in the next cell
        ws.cell(row=row, column=start_col + 1, value=name)

def replace_mill_ids_with_names(records):
    if not records or not isinstance(records, list):
        return records  # nothing to do

    # Collect unique mill IDs from the records
    mill_ids = list({rec.get("mill") for rec in records if rec.get("mill") is not None})

    # Fetch mill names from the database
    mill_map = dict(Mill.objects.filter(id__in=mill_ids).values_list("id", "name"))

    # Replace the IDs with mill names
    for rec in records:
        mill_id = rec.get("mill")
        rec["mill"] = mill_map.get(mill_id, "") if mill_id is not None else ""

    return records

def replace_warehouse_ids_with_names(df):
    if "warehouse" not in df.columns:
        return df
    # Get unique warehouse IDs from the DataFrame
    warehouse_ids = df["warehouse"].dropna().unique().tolist()
    # Fetch warehouse names from the database
    warehouse_map = dict(Warehouse.objects.filter(id__in=warehouse_ids).values_list("id", "name"))
    # Replace the IDs with warehouse names in the DataFrame
    df["warehouse"] = df["warehouse"].map(warehouse_map).fillna("")

    return df

class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer

    
    @action(detail=False, methods=['POST'])     
    def generate_auction_file(self, request, *args, **kwargs):
        try:
            sale_number = request.data.get("sale")
            records = request.data.get("records", [])
            
            if not sale_number or not records:
                raise ValidationError("Both 'sale' and 'records' are required and must not be empty.")

            # Create directory for this sale
            sale_dir = os.path.join(settings.MEDIA_ROOT, 'auctions', str(sale_number))
            os.makedirs(sale_dir, exist_ok=True)

            # Get all status IDs
            status_ids = {record.get("status") for record in records if record.get("status") is not None}
            status_map = {
                status.id: status.name
                for status in CoffeeStatus.objects.filter(id__in=status_ids)
            }


            # Prepare file path
            filename = f"auction_{sale_number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            file_path = os.path.join(sale_dir, filename)

            # Create new workbook and worksheet
            wb = Workbook()
            ws = wb.active
            ws.title = "Auction File"

            
            # Header
            headers = [
                'Lot', 'Mark', 'Grade', 'Bags',
                'Pockets', 'Weight', 'Sale Number', 'Season', 'Certificate',
                'Agent Code','Remarks'
            ]
            ws.append(headers)

            for record in records:
        
                status_id = record.get("status")
                status_name = status_map.get(status_id, "")
                Agent_Code = "049"
                remarks = ""
                
                values = [
                    record.get("lot"),
                    record.get("mark"),
                    record.get("grade"),
                    record.get("bags"),
                    record.get("pockets"),
                    record.get("weight"),
                    record.get("sale"),
                    record.get("season"),
                    record.get("certificate"),
                    Agent_Code,
                    remarks,
                ]
                ws.append(values)

            wb.save(file_path)

            return Response({
                "message": "Auction file generated",
                "file": file_path
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['POST'])
    def generate_sale_file(self, request, *args, **kwargs):
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'sale_summary_template.xlsx')
        START_ROW = 17

        try:
            sale_number = request.data.get('saleNumber')
            if not sale_number:
                raise ValidationError("'saleNumber' is required and must not be empty.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            generated_files = []

            # ✅ Step 1: Get coffees for this sale
            coffees = Coffee.objects.filter(sale=sale_number).select_related("mark")
            serializer = CoffeeSerializer(coffees, many=True)
            coffees_data = serializer.data

            # ✅ Step 2: Group coffees by mark
            
            grouped = {}
            for coffee in coffees_data:
                mark = coffee.get("mark")
                if mark not in grouped:
                    grouped[mark] = []
                grouped[mark].append(coffee)

            # ✅ Step 3: Generate Excel per mark
            for mark, records in grouped.items():
                if not records:
                    continue

                farmer = records[0].get("farmer")
                code = farmer.get("code")
                
                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active

                # Set mark + code
                ws['B3'] = mark
                ws['B2'] = code

                # Fill rows
                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset

                    values = [
                        record.get('outturn'),
                        record.get('bags'),
                        record.get('pockets'),
                        record.get('weight'),
                        record.get('grade'),
                        record.get('price'),
                        record.get('gross_value'),
                        record.get('warehouse_charges'),
                        record.get('broker_charges'),
                        record.get('milling_charges'),
                        record.get('mill'),
                        record.get('export_charges'),
                        record.get('transport_charges'),
                        record.get('net_pay'),
                        record.get('buyer'),
                        
                    ]

                    for col_index, value in enumerate(values, start=1):
                        cell = ws.cell(row=row, column=col_index)
                        if isinstance(cell, MergedCell):
                            continue
                        cell.value = value

                wb.save(file_path)
                generated_files.append(file_path)

            # ✅ Step 4: Create ZIP in memory
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                for file_path in generated_files:
                    arcname = os.path.basename(file_path)
                    zip_file.write(file_path, arcname=arcname)

            zip_buffer.seek(0)

            # ✅ Step 5: Return as downloadable ZIP
            return FileResponse(
                zip_buffer,
                as_attachment=True,
                filename=f"stock_summaries_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
                content_type='application/zip'
            )

        except ValidationError as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'])
    def generate_catalogue_file(self, request):
        catalogue_data = request.data  # Expecting a list of records

        if not isinstance(catalogue_data, list) or not catalogue_data:
            return Response({"error": "Invalid or empty catalogue data."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'catalogue_template.xlsx')
            wb = load_workbook(TEMPLATE_PATH)
            ws = wb.active  # Assuming writing to the first worksheet
            

            # Start writing at row 2 (assuming row 1 is headers)
            
            START_ROW = 84

            for idx, item in enumerate(catalogue_data, start=START_ROW):
                ws.cell(row=idx, column=1).value = item.get('lot', '')
                ws.cell(row=idx, column=2).value = item.get('outturn', '')
                ws.cell(row=idx, column=3).value = item.get('mark', '')
                ws.cell(row=idx, column=4).value = item.get('grade', '')
                ws.cell(row=idx, column=5).value = item.get('bags', '')
                ws.cell(row=idx, column=6).value = item.get('pockets', '')
                ws.cell(row=idx, column=7).value = item.get('weight', '')
                ws.cell(row=idx, column=8).value = item.get('sale', '')
                ws.cell(row=idx, column=9).value = item.get('season', '')
                ws.cell(row=idx, column=10).value = item.get('certificate', '')
                ws.cell(row=idx, column=11).value = item.get('mill', '')
                ws.cell(row=idx, column=12).value = item.get('warehouse', '')
                ws.cell(row=idx, column=13).value = "49"
                
                # Add more columns if needed

            # Save the workbook to a temporary file and return as response
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
                wb.save(tmp.name)
                tmp.seek(0)
                filename = "generated_catalogue.xlsx"
                response = HttpResponse(
                    tmp.read(),
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename={filename}'
                return response

        except Exception as e:
            print(f"Failed to generate file: {e}")
            return Response(
                {"error": f"Failed to generate file: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )