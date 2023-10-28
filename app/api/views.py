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