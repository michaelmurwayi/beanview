from django.db import models

class Farmers(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=100)
    town = models.CharField(max_length=50)
    estate = models.CharField(max_length=100, unique=True)
    mark = models.CharField(max_length=100)
    location = models.CharField(max_length=50)
    division = models.CharField(max_length=50)
    district = models.CharField(max_length=50)