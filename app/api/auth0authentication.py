import json
import requests
from jose import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth.models import AnonymousUser


class Auth0JSONWebTokenAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class to validate Auth0 JWT access tokens.
    """

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or auth_header[0].lower() != b"bearer":
            print("No authentication header found.")
            return None

        if len(auth_header) == 1:
            print("No credentials provided.")
            raise exceptions.AuthenticationFailed(
                "Invalid token header. No credentials provided."
            )
        elif len(auth_header) > 2:
            raise exceptions.AuthenticationFailed(
                "Invalid token header. Token string should not contain spaces."
            )

        token = auth_header[1].decode("utf-8")
        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        try:
            header = jwt.get_unverified_header(token)
        except jwt.JWTError:
            raise exceptions.AuthenticationFailed(
                "Invalid header. Use an RS256 signed JWT."
            )

        jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }

        if not rsa_key:
            raise exceptions.AuthenticationFailed("Unable to find appropriate key.")

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.AUTH0_API_IDENTIFIER,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired.")
        except jwt.JWTClaimsError:
            raise exceptions.AuthenticationFailed(
                "Invalid claims. Check audience and issuer."
            )
        except Exception:
            raise exceptions.AuthenticationFailed("Unable to parse authentication token.")

        # ✅ Extract user info from payload
        user_id = payload.get("sub")
        if not user_id:
            raise exceptions.AuthenticationFailed("Invalid payload: no subject claim.")

        # ✅ Define lightweight Auth0 user object
        class Auth0User(AnonymousUser):
            def __init__(self, payload):
                super().__init__()
                self.id = payload.get("sub")
                self.email = payload.get("email", "")
                self._payload = payload

            @property
            def is_authenticated(self):
                return True  # override property to always return True

        user = Auth0User(payload)

        # ✅ Must return (user, token)
        return (user, token)

    def authenticate_header(self, request):
        return "Bearer"
