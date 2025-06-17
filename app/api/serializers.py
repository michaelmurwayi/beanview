from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    address = serializers.StringRelatedField()
    role = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phonenumber',
            'address', 'role', 'password',
            'is_active', 'is_staff', 'is_superuser',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class FarmerSerializer(serializers.ModelSerializer):
    county = serializers.StringRelatedField()
    bank = serializers.StringRelatedField()

    class Meta:
        model = Farmer
        fields = [
            'code', 'name', 'national_id', 'mark', 'address',
            'phonenumber', 'email', 'county', 'town',
            'bank', 'branch', 'account', 'currency'
        ]


class CoffeeSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer(source='mark', read_only=True)
    mark = serializers.SlugRelatedField(slug_field='mark', queryset=Farmer.objects.all())
    mill_id = serializers.StringRelatedField()
    warehouse = serializers.StringRelatedField()
    status = serializers.StringRelatedField()
    catalogue = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Coffee
        fields = [
            'id', 'lot', 'outturn', 'bulkoutturn', 'mark', 'farmer', 'type', 'grade',
            'bags', 'pockets', 'weight', 'price', 'sale', 'season', 'mill_id',
            'milling_charges', 'warehouse', 'warehouse_charges',
            'brokerage_charges', 'export_charges', 'transport_charges',
            'buyer', 'status', 'catalogue', 'catalogue_type', 'reserve',
            'file', 'certificate', 'remarks', 'created_by',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'catalogue': {'required': False, 'allow_null': True},
            'reserve': {'required': False},
            'buyer': {'required': False},
            'remarks': {'required': False}
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CatalogueSerializer(serializers.ModelSerializer):
    buyer = serializers.StringRelatedField()

    class Meta:
        model = Catalogue
        fields = ['lot', 'certificate', 'price', 'buyer', 'created_at', 'updated_at']
