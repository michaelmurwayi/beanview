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
    cbk_number = models.CharField(max_length=100, unique=True,primary_key=True)
    farmer_name = models.CharField(max_length=255)
    national_id = models.CharField(max_length=10)
    mark = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=10)
    email = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    bank = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    account = models.CharField(max_length=20)
    currency = models.CharField(max_length=3)

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
        CATALOGUES = "CATALOGUED", "catalogued"
        SOLD = "SOLD", "sold"
        WITHDRAWN = "WITHDRAWN", "withdrawn"
        PENDING = "PENDING", "pending"

    outturn = models.CharField(max_length=100)
    mark = models.CharField(max_length=100)
    bags = models.IntegerField(null=True, blank=True)  # Make bags nullable
    pockets = models.IntegerField(null=True, blank=True)  # Make pockets nullable
    grade = models.CharField(max_length=50)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    mill = models.CharField(max_length=100)
    warehouse = models.CharField(max_length=100)
    certificate = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    catalogue = models.CharField(max_length=100, null=True, blank=True)
    season = models.CharField(max_length=100)
    reserve = models.IntegerField(null=True, blank=True)
    buyer = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    file = models.CharField(max_length=50, default="Master_Log.xlsx")
    sale_number = models.CharField(max_length=52, null=True, blank=True)
    created_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="user"
    ) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.outturn

class File(models.Model):
    file_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
