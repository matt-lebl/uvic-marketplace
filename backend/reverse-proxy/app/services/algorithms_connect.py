from urllib.parse import urljoin
import httpx
import traceback
from fastapi import HTTPException
from core.auth import get_user_id_from_token
from decouple import config
from .env_vars import RP_ENV_VARS

FASTAPI_ALGORITHMS_URL = config(RP_ENV_VARS.FA_URL, default="http://localhost:8004")
USER_ID_FIELD = "authUserID"


async def perform_http_request(method: str, url: str, params: dict | None = None, data: dict | None = None):
    async with httpx.AsyncClient() as client:
        try:
            print(f"REVERSE-PROXY: Sending to algorithms URL: {url}")
            response = await client.request(method, url, params=params, json=data)
            response.raise_for_status()
            return response
        except httpx.HTTPError as exc:
            error_message = "Error in the algorithms request:\n" + str(exc)
            error_message += "  \n  " + ''.join(traceback.format_exception(type(exc), exc, exc.__traceback__))
            raise HTTPException(
                status_code=500,
                detail=error_message,
            )


async def send_request_to_algorithms(path: str, method: str, params: dict | None = None, data: dict | None = None):
    url = urljoin(FASTAPI_ALGORITHMS_URL, f"/api/{path}")
    return await perform_http_request(method, url, params, data)


async def send_request_to_algorithms_with_user_id(
        path: str, method: str, token: str, params: dict | None = None, data: dict | None = None
):
    user_id = get_user_id_from_token(token)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    url = urljoin(FASTAPI_ALGORITHMS_URL, f"/api/{path}?{USER_ID_FIELD}={user_id}")
    return await perform_http_request(method, url, params, data)
