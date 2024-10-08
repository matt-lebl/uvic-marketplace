from urllib.parse import urljoin
import httpx
from fastapi import HTTPException
from core.auth import get_user_id_from_token
from decouple import config
from .env_vars import RP_ENV_VARS

FASTAPI_BACKEND_URL = config(RP_ENV_VARS.FB_URL, default="http://localhost:8001")
USER_ID_FIELD = "authUserID"


async def perform_http_request(method: str, url: str, data: dict | None = None):
    async with httpx.AsyncClient() as client:
        print(f"REVERSE-PROXY: Sending to backend URL: {url}")
        return await client.request(method, url, json=data)


async def send_request_to_backend(path: str, method: str, data: dict | None = None):
    url = urljoin(FASTAPI_BACKEND_URL, f"/api/{path}")
    return await perform_http_request(method, url, data)


async def send_request_to_backend_with_user_id(
    path: str, method: str, token: str, data: dict | None = None
):
    user_id = get_user_id_from_token(token)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    url = urljoin(FASTAPI_BACKEND_URL, f"/api/{path}?{USER_ID_FIELD}={user_id}")
    return await perform_http_request(method, url, data)
