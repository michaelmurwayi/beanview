from rest_framework import serializers
from .models import User, Roles, Coffee, Catalogue, Status, Grade, Organization, Organization_type

# Model based serializers
class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id', 'name', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['id','user','outturn','grade','bags','pockets','net_weight','tare_weight','variance', 'ticket', 'location', 'created_at', 'updated_at']

class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['id','lot','coffee','certificate','price','buyer','created_at','updated_at']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'status', 'created_at', 'updated_at']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'grade', 'created_at', 'updated_at']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id','name',  'email', 'phonenumber', 'country', 'city',  'type', 'created_at', 'updated_at']


class OrganizationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization_type
        fields = ['id', 'type', 'created_at', 'updated_at']
