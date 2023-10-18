from django.shortcuts import render
from .models import User, Roles, Coffee, Catalogue, Status, Grade, Organization, Organization_type
from .serializers import UserSerializer, CoffeeSerializer, CatalogueSerializer
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