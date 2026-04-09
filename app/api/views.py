import logging
import os
from datetime import datetime
from copy import deepcopy
import math

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction, IntegrityError

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import User, Farmer, Coffee, Catalogue
from .serializers import UserSerializer, FarmerSerializer, CoffeeSerializer, CatalogueSerializer
from .services.sale_file import generate_sales_file
from .services.summary_file import generate_summary_files
from .services.upload_payout import upload_payout_file
from .process_records.record_processing import process_uploaded_files
from .process_records.record_processing import process_single_record

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@method_decorator(csrf_exempt, name='dispatch')
class FarmersViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def list(self, request, *args, **kwargs):
        farmers = Farmer.objects.all()
        serializer = self.get_serializer(farmers, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError:
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.exception("Error creating Farmer")
            return Response(
                {"error": "An unexpected error occurred", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def clean_nan_value(self, value):
        if value is None:
            return None

        if isinstance(value, float) and math.isnan(value):
            return None

        if isinstance(value, str):
            cleaned = value.strip()
            if cleaned == "" or cleaned.lower() in ["nan", "none", "null"]:
                return None
            return cleaned

        return value


    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /api/farmers/<id>/
        Allows updating farmer safely even when related Coffee records exist.
        Cleans NaN values from Excel/pandas imports.
        """
        farmer = self.get_object()
        old_code = farmer.code

        try:
            data = request.data.copy()

            # Clean optional fields that may come as NaN
            optional_fields = [
                "mark", "address", "phonenumber", "email",
                "county", "town", "bank", "branch",
                "account", "currency"
            ]

            for field in optional_fields:
                if field in data:
                    data[field] = self.clean_nan_value(data.get(field))

            # Clean and validate code
            new_code = data.get("code", old_code)
            if new_code is not None:
                new_code = str(new_code).strip()
                data["code"] = new_code

            # Check duplicate code manually
            if new_code != old_code:
                existing = Farmer.objects.filter(code=new_code).exclude(id=farmer.id).first()
                if existing:
                    return Response(
                        {
                            "error": "Validation failed",
                            "details": {
                                "code": [f"Farmer code '{new_code}' already exists."]
                            }
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            serializer = self.get_serializer(farmer, data=data, partial=True)
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError:
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        except IntegrityError as e:
            logger.exception("Integrity error updating Farmer")
            return Response(
                {"error": "Database integrity error", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.exception("Error updating Farmer")
            return Response(
                {"error": "An unexpected error occurred", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

@method_decorator(csrf_exempt, name='dispatch')
class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.dict() if hasattr(request.data, "dict") else request.data
        sheets = data.get("sheetnames", "").split(",") if data.get("sheetnames") else []
        if request.FILES and sheets:
            
            return process_uploaded_files(self, data, sheets)

        return process_single_record(self, data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=False, methods=["POST"])
    def generate_summary_file(self, request):
        return generate_summary_files(request)


class CatalogueViewSet(viewsets.ModelViewSet):
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer

    @action(detail=False, methods=["POST"])
    def generate_sale_file(self, request):
        return generate_sales_file(request)

    
    @action(detail=False, methods=["POST"])
    def upload_payout(self, request):
        return upload_payout_file(request)