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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer
    

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

@method_decorator(csrf_exempt, name='dispatch')
class LotsViewSet(viewsets.ModelViewSet):
    queryset = Lots.objects.all()
    serializer_class = LotsSerializer



def is_less_than_24_hours_ago(target_date):
    # Get the current date and time
    current_date = datetime.now()

    # Calculate the difference between the current date and the target date
    time_difference = current_date - target_date

    # Check if the difference is less than 24 hours
    return time_difference < timedelta(hours=24)
