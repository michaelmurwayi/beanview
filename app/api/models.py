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

class Farmer(models.Model):
    ref_no = models.CharField(max_length=100, unique=True,primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    estate_name = models.CharField(max_length=100)
    mark = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    division = models.CharField(max_length=100)
    district = models.CharField(max_length=100)


    def __str__(self):
        return str(self.ref_no)

class Catalogue(models.Model):
    id = models.AutoField(primary_key=True)
    lot = models.CharField(max_length=100)
    certificate = models.CharField(max_length=100)
    price = models.IntegerField()
    buyer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.lot

class Coffee(models.Model):

    class Status(models.TextChoices):
        # define status of coffee
        RECIEVED = "RECIEVED", "recieved"
        CUPPED = "CUPPED", "cupped"
        PENDING = "PENDING", "pending"
        SOLD = "SOLD", "sold"

    outturn = models.CharField(max_length=100)
    mark = models.CharField(max_length=100)
    season = models.CharField(max_length=100)
    certificate = models.CharField(max_length=100)
    bags = models.IntegerField(null=True, blank=True)  # Make bags nullable
    pockets = models.IntegerField(null=True, blank=True)  # Make pockets nullable
    grade = models.CharField(max_length=50)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    mill = models.CharField(max_length=100)
    warehouse = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    catalogue = models.CharField(max_length=100, null=True, blank=True)
    reserve = models.IntegerField(null=True, blank=True)
    buyer = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.outturn

# class Lots(models.Model):
#     class LotStatus(models.TextChoices):
#         # define status of coffee
#         OPEN = "OPEN", "open"
#         CUPPED = "CLOSSED", "closed"
#         PENDING = "PENDING", "pending"
        
#     id = models.AutoField(primary_key=True)
#     number = models.CharField(max_length=15)
#     status = models.CharField(max_length=50, choices=LotStatus.choices, default="RECIEVED")
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.status
