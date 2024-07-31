import time
from typing import Dict
import jwt
from decouple import config
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer
from services.env_vars import RP_ENV_VARS

JWT_SECRET = config(RP_ENV_VARS.JWT_SECRET, default="developmentkey")
JWT_ALGORITHM = config(RP_ENV_VARS.JWT_ALGORITHM, default="HS256")
EXPIRY_TIME = config(RP_ENV_VARS.EXPIRY_TIME, default=600)


def sign_jwt(user_id: str) -> Dict[str, str]:
    payload = {"user_id": user_id, "expires": time.time() + int(EXPIRY_TIME)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def sign_validation_jwt(email: str) -> Dict[str, str]:
    payload = {"email": email, "expires": time.time() + int(EXPIRY_TIME)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt(token: str) -> dict | None:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if decoded_token["expires"] >= time.time():
            return decoded_token
        else:
            return None
    except Exception as e:
        print(e)
        # TODO Logging
        return None


def verify_jwt(jwtoken: str) -> bool:
    isTokenValid: bool = False

    try:
        payload = decode_jwt(jwtoken)
    except Exception as e:
        print(e)
        # TODO Logging
        payload = None
    if payload:
        isTokenValid = True

    return isTokenValid


def get_user_id_from_token(jwtoken: str) -> str | None:
    payload = decode_jwt(jwtoken)
    if payload is None:
        return None
    return payload["user_id"]


class JWTBearer(HTTPBearer):

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        auth_cookie = request.cookies.get("authorization")

        if not auth_cookie:
            raise HTTPException(status_code=401, detail="No authorization provided.")

        if not verify_jwt(auth_cookie):
            raise HTTPException(
                status_code=403, detail="Invalid token or expired token."
            )

        return auth_cookie