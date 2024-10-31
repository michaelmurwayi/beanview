from rest_framework import serializers
from .models import *
from rest_framework import status
from rest_framework.response import Response


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
    def create(self, request, *args, **kwargs):
        # Combine both form data and file data
        data = request.data.copy()  # Copy the form data
        files = request.FILES       # Capture the files

        # Create serializer instance with both form and file data
        serializer = self.get_serializer(data=data, files=files)
        serializer.is_valid(raise_exception=True)  # Validate combined data

        # Save the instance if valid
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['lot','certificate','price','buyer','created_at','updated_at']

# class LotsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lots
#         fields = [ 'id', 'number', 'status', 'created_at', 'updated_at']

