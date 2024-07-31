# https://fastapi.tiangolo.com/tutorial/dependencies/

from core.auth import JWTBearer


def require_jwt():
    return JWTBearer()