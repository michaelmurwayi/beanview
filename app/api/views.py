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
        data = request.data.dict()
        files = request.FILES
        sheets = data.get("sheetnames", "").split(",")

        if files and sheets:
            return process_uploaded_files(self, data, sheets)
        
        return process_single_record(self, data)
    
    def update(self, request, *args, **kwargs):
        """Handle the PUT method for updating a Coffee record."""
        # Retrieve the object to be updated
        instance = self.get_object()
        # Deserialize and validate the incoming data
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Use `partial=True` for PATCH
        serializer.is_valid(raise_exception=True)

        # Save the updated instance
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        """Customize save logic during the update."""
        serializer.save()

    @action(detail=False, methods=['GET'], url_path='total_net_weight')
    def total_net_weight(self, request):
        weights = []
        try:
            records = self.queryset.values()
            for record in records:
                if record["status"] != "SOLD":
                    weights.append(record["net_weight"])
                total_net_weight = sum(weights)
            return Response({"total_net_weight": total_net_weight})
        except Exception as E:
            raise(f"Error calculating total net weight, {E}")
    
    @action(detail=False, methods=['GET'], url_path='total_tare_weight')
    def total_tare_weight(self, request):
        weights = []
        try:
            records = self.queryset.values()
            for record in records:
                if record["status"] != "SOLD":
                    weights.append(record["tare_weight"])
                total_tare_weight = sum(weights)
            return Response({"total_tare_weight": total_tare_weight})
        except Exception as E:
            raise(f"Error calculating total tare weight, {E}")
    
    @action(detail=False, methods=['GET'], url_path='total_number_bags')
    def total_number_bags(self, request):
        bags = []
        try:
            records = self.queryset.values()
            for record in records:
                if record["status"] != "SOLD":
                    bags.append(record["bags"])
                total_number_bags = sum(bags)
            return Response({"total_number_bags": total_number_bags})
        except Exception as E:
            raise(f"Error calculating total number of  bags, {E}")

    @action(detail=False, methods=['GET'], url_path='total_number_farmers')
    def total_number_farmers(self, request):
        try:
            total_number_farmers = self.queryset.values("estate").distinct().count()
            return Response({"total_number_farmers": total_number_farmers})
        except Exception as E:
            raise(f"Error calculating total number of  farmers, {E}")
            
    
    @action(detail=False, methods=['GET'], url_path='performance_per_grade')
    def perfomance_per_grade(self, request):
        performance_per_grade = []
        try:
            records = self.queryset.values("grade").distinct()
            for record in records:
                grade_record = records.filter(grade=record["grade"])
                total_weight = grade_record.aggregate(total_weight=Sum('net_weight'))['total_weight']
                data = {"grade": record["grade"],
                        "net_weight": total_weight }
                performance_per_grade.append(data)
            return Response({"Performance": performance_per_grade})
        except Exception as E:
            raise(f"Error calculating total number of  farmers, {{E}}")
    
    @action(detail=False, methods=['GET'], url_path='daily_delivery')
    def daily_delivery(self, request):
        deliveries = []
        try:
            records = self.queryset.values()
            for record in records:
                 # Get the current date and time
                target_date = record['created_at']
                if is_less_than_24_hours_ago(target_date):
                    deliveries.append(record)
            return Response({"deliveries": deliveries})        
        except Exception as E:
            raise(f"Error calculating total number of  farmers, {{E}}")
        
class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer


    def create(self, request):
        try:
            data = request.data.dict()
            
            # Validate sale_number
            sale_number = data.get("saleNumber")
            catalogue_type = data.get("catalogueType")

            if not sale_number:
                return Response({"error": "Sale number is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate records
            records_json = data.get("records")
            if not records_json:
                return Response({"error": "Records data is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                records = json.loads(records_json)
            except json.JSONDecodeError:
                return Response({"error": "Invalid records JSON format"}, status=status.HTTP_400_BAD_REQUEST)

            updated_count = 0
            for record in records:
                outturn = record.get("outturn")
                grade = record.get("grade")

                if not outturn or not grade:
                    return Response(
                        {"error": f"Missing 'outturn' or 'grade' in record: {record}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                coffee = Coffee.objects.filter(outturn=outturn, grade=grade)
                update_result = coffee.update(sale_number=sale_number, status=3, catalogue_type=catalogue_type)
                
                if update_result > 0:
                    updated_count += update_result
                    print(f"Updated coffee record: {record}")
                    
            if updated_count == 0:
                return Response({"message": "No records were updated."}, status=status.HTTP_200_OK)

            return Response(
                {"message": f"Successfully updated {updated_count} coffee records."},
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