from rest_framework import serializers
from .models import User, Roles, Coffee, Catalogue, Status, Grade, Organization, Organization_type

# Model based serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['user','outturn','grade','bags','pockets','net_weight','tare_weight','variance', 'ticket', 'location', 'created_at', 'updated_at']
