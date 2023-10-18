from django.shortcuts import render
from .models import User, Roles, Coffee, Catalogue, Status, Grade, Organization, Organization_type
from .serializers import UserSerializer, CoffeeSerializer, CatalogueSerializer, StatusSerializer, GradeSerializer, OrganizationSerializer, OrganizationTypeSerializer
from rest_framework import viewsets

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer


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