from django.contrib.auth.models import BaseUserManager

# Custom user manager class
class UserManager(BaseUserManager):
    def create_user(self, id, firstname, lastname, email, number, country, city, id_no, reg_no, created_at, updated_at, password=None):
        if not email:
            raise ValueError("Please Provide valid email")
        if not firstname:
            raise ValueError("Please Provide valid firstname")
        if not lastname:
            raise ValueError("Please Provide valid lastname")
        
        user = self.model(
            id = id,
            firstname = firstname,
            lastname = lastname,
            email = self.normalize_email(email),
            number = number,
            country = country, 
            city = city,
            id_no = id_no,
            reg_no = reg_no,
            created_at = created_at,
            updated_at = updated_at
        )

        user.set_password(password)
        user.save(using=self.db)
        return user
    

    def create_superuser(self, id, firstname, lastname, email, number, country, city, id_no, reg_no, created_at, updated_at, password):
        user = self.create_user(
            id = id,
            firstname = firstname,
            lastname = lastname,
            email = self.normalize_email(email),
            number = number,
            country = country, 
            city = city,
            id_no = id_no,
            reg_no = reg_no,
            created_at = created_at,
            updated_at = updated_at
        )

        is_admin = True
        is_staff = True
        is_superuser = True

        user.save(using=self.db)
        return user
