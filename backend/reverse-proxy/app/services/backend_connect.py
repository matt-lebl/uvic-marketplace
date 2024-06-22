from types import coroutine
from urllib.parse import urljoin
import httpx
from fastapi import HTTPException

fastapi_backend_url = "http://localhost:8001"


async def sendRequestToBackend(path: str, method: str, data: dict | None = None):
    url = urljoin(fastapi_backend_url, f"/api/{path}")
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url)
            elif method == "POST":
                response = await client.post(url, data=data)
            return response.json()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail="Error in the backend request",
            )
