import requests
from jose import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

AUTH0_DOMAIN = "dev-xyz123.us.auth0.com"
API_IDENTIFIER = "https://myapi.example.com/"
ALGORITHMS = ["RS256"]

class Auth0JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get("Authorization", None)
        if not auth:
            return None

        parts = auth.split()
        if parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed("Authorization header must start with Bearer")
        elif len(parts) == 1:
            raise exceptions.AuthenticationFailed("Token not found")
        elif len(parts) > 2:
            raise exceptions.AuthenticationFailed("Authorization header must be Bearer token")

        token = parts[1]
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        unverified_header = jwt.get_unverified_header(token)

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        if not rsa_key:
            raise exceptions.AuthenticationFailed("RSA key not found")

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_IDENTIFIER,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )
        except Exception:
            raise exceptions.AuthenticationFailed("Token is invalid")

        return (payload, None)
