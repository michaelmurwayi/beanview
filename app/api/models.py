from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .manage import UserManager


# Creating custom user model 
class User(AbstractBaseUser, PermissionsMixin):
    class Roles(models.TextChoices):
        """define the user roles"""

        ADMIN = "ADMIN", "Admin"
        QUALITY = "QUALITY", "Quality"
        SECRETARY = "SECRETARY", "Secretary"
        ACCOUNTANT = "ACCOUNTANT", "Accountant"
        SYSTEM = "SYSTEM", "System"
        
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phonenumber = models.IntegerField()
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    role = models.CharField(max_length=50, choices=Roles.choices)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','phonenumber','country','city','role','password']

    objects = UserManager()

    def user_name (self) :
        return self.first_name + " " +  self.last_name
    
    def __str__(self):
        return self.email
    
class Coffee(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    outturn = models.CharField(max_length=100)
    grade = models.CharField(max_length=10)
    bags = models.IntegerField(null=True)
    pockets = models.IntegerField()
    net_weight = models.IntegerField()
    tare_weight = models.IntegerField()
    variance = models.IntegerField()
    ticket = models.CharField(max_length=50)
    location = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.outturn

class Catalogue(models.Model):
    id = models.AutoField(primary_key=True)
    lot = models.CharField(max_length=100)
    coffee = models.ForeignKey('Coffee', on_delete=models.PROTECT)
    certificate = models.CharField(max_length=100)
    price = models.IntegerField()
    buyer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.lot

class Status(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.status

class Grade(models.Model):
    id = models.AutoField(primary_key=True)
    grade = models.CharField(max_length=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.grade


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phonenumber = models.IntegerField()
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    reg_no = models.IntegerField(null=True)
    type = models.ForeignKey("organization_type", on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Organization_type(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type

class Farmers(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=100)
    town = models.CharField(max_length=50)
    estate = models.CharField(max_length=100)
    mark = models.CharField(max_length=100)
    location = models.CharField(max_length=50)
    division = models.CharField(max_length=50)
    district = models.CharField(max_length=50)