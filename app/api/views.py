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




class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class FarmersViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

    def create(self, request):
        data = request.data.dict()
        # Serialize the combined data
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Save the instance if valid
        self.perform_create(serializer)
        # Use the saved instance for headers
        headers = self.get_success_headers(serializer.instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
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
            records = self.queryset.exclude(status="SOLD").values_list('net_weight', flat=True)
            total_net_weight = sum(records)
            return Response({"total_net_weight": total_net_weight})
        except Exception as e:
            return Response({"error": f"Error calculating total net weight: {str(e)}"}, status=400)

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

    @action(detail=False, methods=['POST'])
    def generate_summary_file(self, request, *args, **kwargs):
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'sale summary template.xlsx')
        START_ROW = 27

        try:
            summaries = request.data.get('summaries', [])

            if not summaries:
                raise ValidationError("'summaries' is required and must not be empty.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            # Collect all status IDs from all records
            all_status_ids = {
                record.get('status_id')
                for summary in summaries
                for record in summary.get('records', [])
                if record.get('status_id') is not None
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
                    continue  # skip invalid

                total_weight = sum(float(r.get('weight') or 0) for r in records)
                count = len(records)

                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active

                # Write summary data
               
                ws['B6'] = mark
               
                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset
                    status_id = record.get('status')
                    status_name = CoffeeStatus.objects.get(id=status_id).name

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
                generated_files.append({"mark": mark, "path": file_path})

            return Response({"message": "Files generated", "files": generated_files}, status=200)

        except ValidationError as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=400)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=500)

class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer

    @action(detail=False, methods=['POST'])
    def generate_auction_file(self, request):
        try:
            sale_number = request.data.get("sale")

            if not sale_number:
                return Response({"error": "Sale number is required"}, status=status.HTTP_400_BAD_REQUEST)

            records = request.data.get("records", [])

            if not records:
                return Response({"error": "No records found for this sale"}, status=status.HTTP_404_NOT_FOUND)

            # Convert records to DataFrame
            df = pd.DataFrame(records)
            # Define the required columns and rename mapping
            columns_to_export = {
                "mark": "MARKS",
                "grade": "GRADE",
                "bags": "BAGS",
                "pockets": "POCKETS",
                "weight": "WEIGHT",
                "sale": "SALENO",
                "season": "SEASON",
                "certificate": "CERTIFICATE",
                "agentCode": "AGENT CODE",
                "reserve": "RESERVE PRICE"
            }

            
            # Select and rename only the specified columns
            df_filtered = df[list(columns_to_export.keys())].rename(columns=columns_to_export)

            # Add empty "REMARKS" column
            df_filtered["REMARKS"] = ""
            # Directory path based on sale number
            subdir = str(sale_number)
            dir_path = os.path.join(settings.MEDIA_ROOT, "auction", subdir)
            os.makedirs(dir_path, exist_ok=True)

            # Save to Excel
            excel_filename = "auction_file.xlsx"
            excel_path = os.path.join(dir_path, excel_filename)
            df_filtered.to_excel(excel_path, index=False)

            file_url = settings.MEDIA_URL + f"auction/{subdir}/{excel_filename}"

            return Response(
                {
                    "message": f"Successfully generated auction file for sale {sale_number}.",
                    "excel_file_url": file_url
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'])
    def generate_catalogue_file(self, request):
        try:
            sale_number = request.data.get("sale")
            records = request.data.get("records")

            if not sale_number or not records:
                return Response({"error": "Sale number and records are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Desired columns
            expected_columns = [
                "MARKS", "GRADE", "BAGS", "POCKETS", "WEIGHT", "SALENO", "SEASON",
                "CERTIFICATION", "AGENT CODE", "RESERVE PRICE", "REMARKS"
            ]

            df = pd.DataFrame(records)

            # Keep only expected columns (drop others)
            df = df[[col for col in expected_columns if col in df.columns]]

            # Create directory and file path
            subdir = str(sale_number)
            dir_path = os.path.join(settings.MEDIA_ROOT, "catalogue", subdir)
            os.makedirs(dir_path, exist_ok=True)

            filename = "catalogue_file.xlsx"
            filepath = os.path.join(dir_path, filename)

            # Write to Excel
            df.to_excel(filepath, index=False)

            file_url = settings.MEDIA_URL + f"catalogue/{subdir}/{filename}"

            return Response({
                "message": f"Catalogue file created for sale {sale_number}.",
                "file_url": file_url
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

