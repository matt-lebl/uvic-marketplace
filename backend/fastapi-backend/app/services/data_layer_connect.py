from urllib.parse import urljoin
import httpx
from fastapi import HTTPException
from decouple import config
from .env_vars import FB_ENV_VARS

DATA_LAYER_URL = config(FB_ENV_VARS.DATA_LAYER_URL, default="http://localhost:8002")


async def perform_http_request(method: str, url: str, data: dict | None = None):
    async with httpx.AsyncClient() as client:
        print(url)
        return await client.request(method, url, json=data)


async def send_request_to_data_layer(path: str, method: str, data: dict | None = None):
    url = urljoin(DATA_LAYER_URL, f"{path}")
    return await perform_http_request(method, url, data)
