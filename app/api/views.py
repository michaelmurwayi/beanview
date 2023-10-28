from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
            records = self.queryset.values("farmer_id")
            total_number_farmers = records.distinct().count()
            return Response({"total_number_farmers": total_number_farmers})
        except Exception as E:
            raise(f"Error calculating total number of  farmers, {E}")
            
            

class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class OrganizationTypeViewSet(viewsets.ModelViewSet):
    queryset = Organization_type.objects.all()
    serializer_class = OrganizationTypeSerializer