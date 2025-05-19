from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .manage import UserManager

class County(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Role(models.Model):
    """User Roles"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Address(models.Model):
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True)
    country = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.country}"

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phonenumber = models.CharField(max_length=15, unique=True)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phonenumber']

    objects = UserManager()

    def __str__(self):
        return self.email

class Bank(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Branch(models.Model):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.bank.name}"

class Farmer(models.Model):
    cbk_number = models.CharField(max_length=100, unique=True, primary_key=True)
    farmer_name = models.CharField(max_length=255)
    national_id = models.CharField(max_length=10, unique=True)
    mark = models.CharField(max_length=100)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    phonenumber = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    town = models.CharField(max_length=100)
    bank_branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True)
    account = models.CharField(max_length=20)
    currency = models.CharField(max_length=3)

    def __str__(self):
        return self.farmer_name

class Buyer(models.Model):
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class Catalogue(models.Model):
    lot = models.CharField(max_length=100)
    certificate = models.CharField(max_length=100)
    price = models.IntegerField()
    buyer = models.ForeignKey(Buyer, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.lot

class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Mill(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class CoffeeStatus(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Coffee(models.Model):
    class Status(models.TextChoices):
        RECIEVED = "RECIEVED", "Received"
        CATALOGUED = "CATALOGUED", "Catalogued"
        SOLD = "SOLD", "Sold"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"
        PENDING = "PENDING", "Pending"
    lot = models.CharField(max_length=100, unique=False, default="")
    outturn = models.CharField(max_length=100)
    bulkoutturn = models.CharField(max_length=100, default="", blank=True)
    mark = models.CharField(max_length=100, default="")
    type = models.CharField(max_length=100, default="")
    grade = models.CharField(max_length=50, default="")
    bags = models.IntegerField(null=True, blank=True, default=0)
    pockets = models.IntegerField(null=True, blank=True, default=0)
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sale = models.CharField(max_length=52, null=True, blank=True, default="")
    season = models.CharField(max_length=100, default="2024/2025")
    mill = models.ForeignKey(Mill, on_delete=models.SET_NULL, null=True)
    milling_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True)
    warehouse_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    brokerage_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    export_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    transport_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    Net_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    gross_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    certificate = models.CharField(max_length=100, null=True, blank=True, default="")
    status = models.ForeignKey(CoffeeStatus, on_delete=models.SET_NULL, null=True, blank=True)
    catalogue = models.ForeignKey(Catalogue, on_delete=models.SET_NULL, null=True, blank=True)
    catalogue_type = models.CharField(max_length=100, null=True, blank=True, default="")
    reserve = models.IntegerField(null=True, blank=True, default=0)
    buyer = models.CharField(max_length=100, null=True, blank=True, default="")
    remarks = models.TextField(null=True, blank=True, default="")
    file = models.CharField(max_length=50, default="Master_Log.xlsx")
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="coffee_created_by") 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.outturn


class File(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
