from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phonenumber', 'country', 'city',  'role', 'password', 'is_active', 'is_admin', 'is_staff', 'is_superuser', 'created_at', 'updated_at']
        

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = ['outturn', 'mark', 'season', 'certificate', 'bags','pockets', 'grade','weight','mill','warehouse', 'status']
        extra_kwargs = {
                'catalogue': {'required': False},
                'reserve': {'required': False},
                'buyer': {'required': False}
            }
    
class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['lot','certificate','price','buyer','created_at','updated_at']

# class LotsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lots
#         fields = [ 'id', 'number', 'status', 'created_at', 'updated_at']

