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
            'id','code', 'name', 'mark', 'address',
            'phonenumber', 'email', 'county', 'town',
            'bank', 'branch', 'account', 'currency'
        ]


class CoffeeSerializer(serializers.ModelSerializer):
    farmer = serializers.SerializerMethodField()
    mark = serializers.SlugRelatedField(slug_field='mark', queryset=Farmer.objects.all())

    # Write-only input for updates
    status_id = serializers.PrimaryKeyRelatedField(
        queryset=CoffeeStatus.objects.all(),
        source='status',
        write_only=True,
        required=False
    )
    # Read-only display for output
    status = serializers.StringRelatedField(read_only=True)

    mill_id = serializers.StringRelatedField()
    warehouse = serializers.StringRelatedField()
    catalogue = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()

    lot = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Coffee
        fields = '__all__'
        extra_kwargs = {
            'catalogue': {'required': False, 'allow_null': True},
            'reserve': {'required': False},
            'buyer': {'required': False},
            'remarks': {'required': False},
            'sale': {'required': False, 'allow_blank': True},
        }

    def get_farmer(self, obj):
        return {
            "name": obj.mark.name,
            "mark": obj.mark.mark,
            "code": obj.mark.code,
            "County": obj.mark.county if obj.mark.county else None,
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
