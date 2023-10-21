from django.contrib.auth.models import BaseUserManager


# Custom user manager class
class UserManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, phonenumber, country, city, role,  password=None):
        if not email:
            raise ValueError("Please Provide valid email")
        if not first_name:
            raise ValueError("Please Provide valid first_name")
        if not last_name:
            raise ValueError("Please Provide valid last_name")
        
        user = self.model(
            first_name = first_name,
            last_name = last_name,
            email = self.normalize_email(email),
            phonenumber = phonenumber,
            country = country, 
            city = city,
            role = role,
        )

        user.set_password(password)
        user.save(using=self.db)
        return user
    

    def create_superuser(self, first_name, last_name, email, phonenumber, country, city, role, password):
        user = self.create_user(
            first_name = first_name,
            last_name = last_name,
            email = self.normalize_email(email),
            phonenumber = phonenumber,
            country = country, 
            city = city,
            role= role,
            
        )

        is_admin = True
        is_staff = True
        is_superuser = True

        user.save(using=self.db)
        return user
