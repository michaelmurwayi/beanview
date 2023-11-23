from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'password', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']
        

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['farmer','outturn','grade','bags','pockets','net_weight','tare_weight','variance', 'ticket', 'status', 'created_at', 'updated_at']

class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['lot','coffee','certificate','price','buyer','created_at','updated_at']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = [ 'status', 'created_at', 'updated_at']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = [ 'grade', 'created_at', 'updated_at']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['name',  'email', 'phonenumber', 'country', 'city',  'type', 'created_at', 'updated_at']


class OrganizationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization_type
        fields = [ 'type', 'created_at', 'updated_at']
