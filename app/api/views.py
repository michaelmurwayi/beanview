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
        import ipdb;ipdb.set_trace()
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
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'Sale Summary template.xlsx')
        START_ROW = 27  # Change as needed for where to start writing records

        try:
            summary_data = request.data.get('summary', [])
            records_by_mark = request.data.get('recordsByMark', {})

            if not summary_data or not records_by_mark:
                raise ValidationError("Both 'summary' and 'recordsByMark' are required.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            # Collect all status IDs used in the records
            all_status_ids = {
                record.get('status_id')
                for records in records_by_mark.values()
                for record in records
                if record.get('status_id') is not None
            }

            # Map status IDs to names
            status_map = {
                status.id: status.name
                for status in CoffeeStatus.objects.filter(id__in=all_status_ids)
            }

            generated_files = []

            for summary_item in summary_data:
                mark = summary_item.get('mark')
                total_weight = summary_item.get('totalWeight')
                count = summary_item.get('count')

                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active

                # Write summary section before data table
                ws['A6'] = 'Mark'
                ws['B6'] = 'Total Weight (kg)'
                ws['C6'] = 'Number of Records'
                ws['A7'] = mark
                ws['B7'] = total_weight
                ws['C7'] = count

                # Header row
                headers = ['Outturn', 'Mark', 'Grade', 'Type', 'Bags', 'Pockets',
                           'Weight (kg)', 'Sale Number', 'Season', 'Certificate',
                           'Mill', 'Warehouse', 'Price', 'Buyer', 'Status']
                for col_index, header in enumerate(headers, start=1):
                    cell = ws.cell(row=START_ROW, column=col_index)
                    if isinstance(cell, MergedCell):
                        continue  # Skip writing to merged cells
                    cell.value = header

                # Records rows
                records = records_by_mark.get(mark, [])
                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset
                    status_id = record.get('status_id')
                    status_name = status_map.get(status_id, 'Unknown')

                    values = [
                        record.get('outturn'),
                        record.get('mark'),
                        record.get('grade'),
                        record.get('type'),
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

    def create(self, request):
        try:
            data = request.data.dict()  # needed if still using multipart/form-data

            # Parse stringified primitives
            sale_number = json.loads(data.get("saleNumber", "null"))
            catalogue_type = json.loads(data.get("catalogueType", "null"))
            records_raw = data.get("records")
            
            if sale_number is None:
                return Response({"error": "Sale number is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not records_raw:
                return Response({"error": "Records are required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                records = json.loads(records_raw)
            except json.JSONDecodeError:
                return Response({"error": "Invalid records JSON format"}, status=status.HTTP_400_BAD_REQUEST)

            if not isinstance(records, list):
                return Response({"error": "Records should be a list of objects"}, status=status.HTTP_400_BAD_REQUEST)

            updated_count = 0
            updated_records = []

            for record in records:
                outturn = record.get("outturn")
                grade = record.get("grade")

                if not outturn or not grade:
                    return Response(
                        {"error": f"Missing 'outturn' or 'grade' in record: {record}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                coffee = Coffee.objects.filter(outturn=outturn, grade=grade)
                update_result = coffee.update(
                    sale=sale_number,
                    status=3,
                )

                if update_result > 0:
                    updated_count += update_result
                    updated_records.append({
                        "outturn": outturn,
                        "mark": record.get("mark"),
                        "type": record.get("type"),
                        "grade": grade,
                        "bags": record.get("bags"),
                        "pockets": record.get("pockets"),
                        "weight": record.get("weight"),
                        "sale": sale_number,
                        "status": 3
                    })

            if updated_count == 0:
                return Response({"message": "No records were updated."}, status=status.HTTP_200_OK)

            # Save to Excel
            df = pd.DataFrame(updated_records)
            subdir = str(sale_number)  # directory name based on sale number
            dir_path = os.path.join(settings.MEDIA_ROOT, subdir)

            os.makedirs(dir_path, exist_ok=True)  # Create directory if it doesn't exist

            excel_filename = "updated_coffee_records.xlsx"
            excel_path = os.path.join(dir_path, excel_filename)
            df.to_excel(excel_path, index=False)

            file_url = settings.MEDIA_URL + f"{subdir}/{excel_filename}"

            return Response(
                {
                    "message": f"Successfully updated {updated_count} coffee records.",
                    "excel_file_url": file_url
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# @method_decorator(csrf_exempt, name='dispatch')
# class LotsViewSet(viewsets.ModelViewSet):
#     queryset = Lots.objects.all()
#     serializer_class = LotsSerializer



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

