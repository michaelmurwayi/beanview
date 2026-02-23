import logging
import os
from datetime import datetime

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

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


@method_decorator(csrf_exempt, name='dispatch')
class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.dict() if hasattr(request.data, "dict") else request.data
        sheets = data.get("sheetnames", "").split(",") if data.get("sheetnames") else []
        if request.FILES and sheets:
            from .process_records.record_processing import process_uploaded_files
            return process_uploaded_files(self, data, sheets)

        from .process_records.record_processing import process_single_record
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