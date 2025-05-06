from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'password', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ['cbk_number', 'farmer_name', 'national_id', 'mark', 'address', 'phonenumber', 'email', 'county', 'town', 'bank', 'branch', 'account', 'currency']

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['id','outturn', 'grade', 'mark', 'type', 'bags', 'pockets', 'weight', 'mill', 'warehouse', 'season', 'status_id', 'file', 'sale_number', 'catalogue_type','created_at', 'updated_at']
        extra_kwargs = {
                'catalogue': {'required': False},
                'reserve': {'required': False},
                'buyer': {'required': False}
            }
    
    def update(self, instance, validated_data):

        instance.sale_number = validated_data.get('sale_number', instance.sale_number)
        instance.status_id = validated_data.get('status_id', instance.status_id)  # Ensure this is updated
        instance.save()

        return instance

class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['lot','certificate','price','buyer','created_at','updated_at']

# class LotsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lots
#         fields = [ 'id', 'number', 'status', 'created_at', 'updated_at']

