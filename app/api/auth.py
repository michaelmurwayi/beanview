from django.contrib.auth.backends import BaseBackend
from .models import User

class CustomBackend(BaseBackend):
    def authenticate(self, request, **kwargs):
        # Implement your custom authentication logic here
        email = kwargs.get('username')
        password = kwargs.get('password')
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None