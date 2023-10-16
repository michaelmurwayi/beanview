from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .manage import UserManager

# creating model for system roles
class Roles(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)



# Creating custom user model 
class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phonenumber = models.IntegerField()
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    id_no = models.IntegerField(null=True)
    reg_no = models.IntegerField(null=True)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','phonenumber','country','city','role',]

    objects = UserManager()

    def user_name (self) :
        return self.first_name + " " +  self.last_name
    
class Coffee(models.Model):
    id = models.AutoField(primary_key=True)
    estate = models.ForeignKey(User, on_delete=models.CASCADE)
    outturn = models.CharField(max_length=100)
    grade = models.CharField(max_length=10)
    bags = models.IntegerField()
    pockets = models.IntegerField()
    net_weight = models.IntegerField()
    tare_weight = models.IntegerField()
    variance = models.IntegerField()
    ticket = models.IntegerField()
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Catalogue(models.Model):
    id = models.AutoField(primary_key=True)
    lot = models.CharField(max_length=100)
    coffee = models.ForeignKey('Coffee', on_delete=models.PROTECT)
    certificate = models.CharField(max_length=100)
    price = models.IntegerField()
    buyer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Status(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

