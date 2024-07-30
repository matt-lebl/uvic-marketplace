r"""
fastapi-backend\main.py

>> Recieves traffic from REVERSE-PROXY, does everything other than DATA-LAYER or websocket connections, sends traffic to DATA-LAYER. >>
"""

from urllib.parse import urljoin
from fastapi import FastAPI, HTTPException
import httpx
from decouple import config
from routers import listings, users, charities, images
from services.env_vars import FB_ENV_VARS

app = FastAPI()
app.include_router(listings.listingsRouter)
app.include_router(users.userRouter)
app.include_router(charities.charityRouter)
app.include_router(images.imagesRouter)

data_layer_url = config(FB_ENV_VARS.DATA_LAYER_URL, default="http://localhost:8002")
"""
TODO:

- Reject all paths not used for:
    - data-layer
    - TODO: other services
"""


# Routes for data-layer
@app.get("/api/{path:path}")
async def data_layer_request(path: str | None):
    async with httpx.AsyncClient() as client:
        try:
            url = urljoin(data_layer_url, f"/api/{path}")
            response = await client.get(url)
            return response.text
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=500, detail=str(exc))


# Catch-all route to handle requests to other paths
# TODO: change detail
@app.get("/{path:path}")
async def other_request(path: str | None):
    raise HTTPException(status_code=404, detail="Path not found BACKEND")


if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8001)
