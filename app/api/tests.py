from django.test import TestCase
from .models import User, Roles, Coffee
import datetime

# Create your tests here.
# Test for models

class UserModelTest(TestCase):
    def create_user(self, firstname="john", lastname="doe", email="test@gmail.com", phonenumber="0720202020", country="Kenya", city="Nairobi",  is_active="False", is_admin="False", is_superuser="False", is_staff="False", created_at=datetime.datetime.now(), updated_at=datetime.datetime.now()):
        role = Roles.objects.create(id=1, name="accountant")
        return User.objects.create(first_name=firstname, last_name=lastname, email=email, phonenumber=phonenumber, country=country, city=city, role=role, is_active=is_active, is_admin=is_admin, is_superuser=is_superuser, is_staff=is_staff, created_at=created_at, updated_at=updated_at)
    
    def test_create_user(self):
        user = self.create_user()
        self.assertTrue(isinstance(user, User))

class CoffeModelTest(TestCase):
    def create_coffee(self, Estate="", outturn="", grade="AA", bags="2", pockets="10", net_weight="100", tare_weight="20", variance, ticket, location ):

        return Coffee.object.create(Estate =Estate, outturn=outturn, grade=grade, bags=bags, pockets=pockets, net_weight=net_weight, tare_weight=tare_weight, variance=variance, ticket=ticket, location=location)