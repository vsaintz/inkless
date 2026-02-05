import jwt
import json
import requests
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from django.conf import settings
from functools import lru_cache


User = get_user_model()


@lru_cache(maxsize=1)
def get_supabase_jwks():
    """Fetch JWKS from Supabase with API key"""
    supabase_url = settings.SUPABASE_URL
    anon_key = settings.SUPABASE_ANON_KEY
    jwks_url = f"{supabase_url}/auth/v1/.well-known/jwks.json"

    headers = {
        "apikey": anon_key,
    }

    response = requests.get(jwks_url, headers=headers)
    response.raise_for_status()
    return response.json()


def get_public_key_from_jwks(token):
    """Extract public key from JWKS based on token's kid"""
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")

    if not kid:
        raise exceptions.AuthenticationFailed("Token missing 'kid' in header")

    jwks = get_supabase_jwks()

    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            from jwt.algorithms import ECAlgorithm

            public_key = ECAlgorithm.from_jwk(json.dumps(key))
            return public_key

    raise exceptions.AuthenticationFailed(f"No matching key found for kid: {kid}")


class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            raise exceptions.AuthenticationFailed("Token format: Bearer <token>")

        try:
            public_key = get_public_key_from_jwks(token)
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["ES256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}")
        except Exception as e:
            raise exceptions.AuthenticationFailed(f"Authentication error: {str(e)}")

        user_id = payload.get("sub")
        email = payload.get("email")
        user_metadata = payload.get("user_metadata", {})
        app_metadata = payload.get("app_metadata", {})

        is_verified = bool(
            user_metadata.get("email_verified")
            or app_metadata.get("email_verified")
            or payload.get("email_confirmed_at")
        )

        if not user_id or not email:
            raise exceptions.AuthenticationFailed("Invalid token payload")

        first_name = user_metadata.get("first_name", "") or user_metadata.get(
            "firstName", ""
        )
        last_name = user_metadata.get("last_name", "") or user_metadata.get(
            "lastName", ""
        )

        if not first_name and not last_name:
            full_name = user_metadata.get("full_name", "") or user_metadata.get(
                "display_name", ""
            )
            if full_name:
                name_parts = full_name.split(" ", 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ""

        user, created = User.objects.get_or_create(
            id=user_id,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "is_verified": is_verified,
            },
        )

        if not created:
            updated = False
            if user.email != email:
                user.email = email
                updated = True
            if user.first_name != first_name:
                user.first_name = first_name
                updated = True
            if user.last_name != last_name:
                user.last_name = last_name
                updated = True
            if user.is_verified != is_verified:
                user.is_verified = is_verified
                updated = True
            if updated:
                user.save()

        return (user, None)
