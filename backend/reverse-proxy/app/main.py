"""
reverse-proxy\main.py

>> Entry point for the overall backend. <<
"""

from fastapi import FastAPI, Depends
import httpx
from auth import JWTBearer
from services.backend_connect import send_request_to_backend_with_user_id

from routers import users

app = FastAPI()

# Catch All routes that don't require authentication
app.include_router(users.usersRouter)


# TODO: Update for prod
fastapi_backend_url = "http://localhost:8001"

"""
TODO:

- Reject all paths not used for:
    - fastapi-backend
    - TODO: other services

- Websockets for live chat (if we continue to implement it)
"""


@app.get("/api/{path:path}", dependencies=[Depends(JWTBearer())])
async def proxy_api_get_request(path: str | None, token=Depends(JWTBearer())):
    return await send_request_to_backend_with_user_id(path, "GET", token)


@app.post("/api/{path:path}", dependencies=[Depends(JWTBearer())])
async def proxy_api_post_request(path: str | None, token=Depends(JWTBearer())):
    return await send_request_to_backend_with_user_id(path, "POST", token)


@app.patch("/api/{path:path}", dependencies=[Depends(JWTBearer())])
async def proxy_api_patch_request(path: str | None, token=Depends(JWTBearer())):
    return await send_request_to_backend_with_user_id(path, "PATCH", token)


@app.delete("/api/{path:path}", dependencies=[Depends(JWTBearer())])
async def proxy_api_patch_request(path: str | None, token=Depends(JWTBearer())):
    return await send_request_to_backend_with_user_id(path, "DELETE", token)


if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
