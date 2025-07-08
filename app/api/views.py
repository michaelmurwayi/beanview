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
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'stock summary template.xlsx')
        START_ROW = 27

        try:
            summaries = request.data.get('summaries', [])

            if not summaries:
                raise ValidationError("'summaries' is required and must not be empty.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            # Collect all status IDs for mapping
            all_status_ids = {
                record.get('status')
                for summary in summaries
                for record in summary.get('records', [])
                if record.get('status') is not None
            }

            status_map = {
                status.id: status.name
                for status in CoffeeStatus.objects.filter(id__in=all_status_ids)
            }

            generated_files = []

            for summary in summaries:
                mark = summary.get('mark')
                records = summary.get('records', [])

                if not mark or not records:
                    continue

                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active

                # Set mark name in cell B6
                ws['B6'] = mark

                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset
                    status_id = record.get('status')
                    status_name = status_map.get(status_id, "")

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
                        status_name,
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

def write_grade_summary(ws, summary, start_row=19, start_col=8):
    row = start_row
    for grade, bags in summary.items():
        # Write the grade in the specified column
        cell_grade = ws.cell(row=row, column=start_col)
        # Write the bags in the column to the right
        cell_bags = ws.cell(row=row, column=start_col + 1)
        cell_grade.value = grade
        cell_bags.value = bags
        row += 1  # Move to the next row for the next pair


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

def write_milled_by(ws, records, start_row=12, column_letter="A"):
    # Get unique mill IDs from the records
    mill_ids = {record.get("mill") for record in records if record.get("mill")}
    
    # Query the Mill model for names and codes
    mills = Mill.objects.filter(id__in=mill_ids).values_list("name", "full_name")

    # Clean, deduplicate, and sort
    unique_mills = sorted({(name.strip(), code.strip()) for name, code in mills if name and code})

    # Write each mill on its own line starting from `start_row`
    for i, (name, code) in enumerate(unique_mills):
        text = f"Milled BY({name} Coffee Mill Denoted as {code})"
        cell = f"{column_letter}{start_row + i}"
        ws[cell] = text

def replace_mill_ids_with_names(df):
    if "mill" not in df.columns:
        return df  # nothing to do

    # Get unique mill IDs from the DataFrame
    mill_ids = df["mill"].dropna().unique().tolist()

    # Fetch mill names from the database
    mill_map = dict(Mill.objects.filter(id__in=mill_ids).values_list("id", "name"))

    # Replace the IDs with mill names in the DataFrame
    df["mill"] = df["mill"].map(mill_map).fillna("")

    return df
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


def is_less_than_24_hours_ago(target_date):
    # Get the current date and time
    current_date = datetime.now()

    # Calculate the difference between the current date and the target date
    time_difference = current_date - target_date

    # Check if the difference is less than 24 hours
    return time_difference < timedelta(hours=24)

def read_data_from_pdf_file(mill,file,requests):
    data = []
    import ipdb;ipdb.set_trace()

    return data

