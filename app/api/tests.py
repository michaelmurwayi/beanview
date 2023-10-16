from django.test import TestCase
from .models import User, Roles, Coffee, Catalogue
import datetime

# Create your tests here.
# Test for models

class UserModelTest(TestCase):
    def create_user(self, id=1, firstname="john", lastname="doe", email="test@gmail.com", phonenumber="0720202020", country="Kenya", city="Nairobi",  is_active="False", is_admin="False", is_superuser="False", is_staff="False", created_at=datetime.datetime.now(), updated_at=datetime.datetime.now()):
        role = Roles.objects.create(id=1, name="accountant")
        return User.objects.create(id=id, first_name=firstname, last_name=lastname, email=email, phonenumber=phonenumber, country=country, city=city, role=role, is_active=is_active, is_admin=is_admin, is_superuser=is_superuser, is_staff=is_staff, created_at=created_at, updated_at=updated_at)
    
    def test_create_user(self):
        user = self.create_user()
        try:
            self.assertTrue(isinstance(user, User))
        except Exception as e:
            print(f"Error in user test function:{e}")

class CoffeeModelTest(TestCase):
    def create_coffee(self, outturn="", grade="AA", bags="2", pockets="10", net_weight="100", tare_weight="20", variance="10", ticket="A0243", location="" ):
        Users = UserModelTest()
        User = Users.create_user()
        
        return Coffee.objects.create(user=User, outturn=outturn, grade=grade, bags=bags, pockets=pockets, net_weight=net_weight, tare_weight=tare_weight, variance=variance, ticket=ticket, location=location)
    
    def test_create_coffee(self):
        coffee = self.create_coffee()
        try:
            self.assertTrue(isinstance(coffee, Coffee))
        except Exception as e:
            print(f"Errot in coffee test function: {e}")

class CatalogueModelTest(TestCase):
    def create_catalogue(self, lot="UID502",certificate="CAFE", price="4200", buyer="SomeGuy"):
        coffee = CoffeeModelTest()
        coffee = coffee.create_coffee()
        return Catalogue.objects.create(lot=lot, coffee=coffee, certificate=certificate, price=price, buyer=buyer)
        
    def test_create_catalogue(self):
        catalogue = self.create_catalogue()
        try:
            self.assertTrue(isinstance(catalogue, Catalogue))
        except Exception as e:
            print(f"Error in Catalogue test function: {e}")

 