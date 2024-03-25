from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'password', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']
        

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['id','estate','outturn','grade','bags','pockets','net_weight','tare_weight','variance', 'ticket', 'catalogue', 'status', 'created_at', 'updated_at']

class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['lot','certificate','price','buyer','created_at','updated_at']

class LotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lots
        fields = [ 'id', 'number', 'status', 'created_at', 'updated_at']

