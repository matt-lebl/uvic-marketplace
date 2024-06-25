from urllib.parse import urljoin
import httpx
from fastapi import HTTPException
from auth import get_user_id_from_token

FASTAPI_BACKEND_URL = "http://localhost:8001"
USER_ID_FIELD = "authUserID"


async def perform_http_request(method: str, url: str, data: dict | None = None):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(method, url, json=data)
            response.raise_for_status()
            return response
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail="Error in the backend request",
            )


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
