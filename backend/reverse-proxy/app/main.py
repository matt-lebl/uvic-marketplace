r"""
reverse-proxy\main.py

>> Entry point for the overall backend. <<
"""

from fastapi import FastAPI, Depends, Request, Response
import httpx
from core.dependencies import require_jwt
from services.backend_connect import send_request_to_backend_with_user_id
from services.algorithms_connect import send_request_to_algorithms_with_user_id
from services.env_vars import RP_ENV_VARS
from decouple import config
from routers import users, search, images
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Catch All routes that don't require authentication
app.include_router(users.usersRouter)
app.include_router(images.imagesRouter)
app.include_router(search.searchRouter)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # TODO: Remove localhost from production environment
        "https://localhost:8080",
        "http://localhost",
        "https://localhost",
        "http://market.lebl.ca",
        "https://market.lebl.ca",
        "http://market.rahuln.ca",
        "https://market.rahuln.ca",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALGORITHMS_PATHS = ["search", "recommendations"]

fastapi_backend_url = config(RP_ENV_VARS.FB_URL, default="http://localhost:8001")
fastapi_algorithms_url = config(RP_ENV_VARS.FA_URL, default="http://localhost:8004")

"""
TODO:

- Reject all paths not used for:
    - fastapi-backend
    - TODO: other services

- Websockets for live chat (if we continue to implement it)
"""


# Helper funtion to get a JWT token to test the endpoints
# @app.get("/get-token/")
# async def get_token():
#     return sign_jwt("1")


async def forward_request(
    path: str,
    method: str,
    token: str,
    params: dict | None = None,
    data: dict | None = None,
):
    if path.split("/")[0] in ALGORITHMS_PATHS:
        response = await send_request_to_algorithms_with_user_id(
            path, method, token, params, data
        )
    else:
        response = await send_request_to_backend_with_user_id(path, method, token, data)
    return response


@app.get("/api/{path:path}", dependencies=[Depends(require_jwt())])
async def proxy_api_get_request(
    path: str | None,
    request: Request,
    returnResponse: Response,
    token=Depends(require_jwt()),
):
    response = await forward_request(path, "GET", token, params=request.query_params)
    returnResponse.status_code = response.status_code
    return response.json()


@app.post("/api/{path:path}", dependencies=[Depends(require_jwt())])
async def proxy_api_post_request(
    path: str | None,
    request: Request,
    returnResponse: Response,
    token=Depends(require_jwt()),
):
    data = await request.json()
    response = await forward_request(path, "POST", token, data=data)
    returnResponse.status_code = response.status_code
    return response.json()


@app.patch("/api/{path:path}", dependencies=[Depends(require_jwt())])
async def proxy_api_patch_request(
    path: str | None,
    request: Request,
    returnResponse: Response,
    token=Depends(require_jwt()),
):
    data = await request.json()
    response = await forward_request(path, "PATCH", token, data=data)
    returnResponse.status_code = response.status_code
    return response.json()


@app.delete("/api/{path:path}", dependencies=[Depends(require_jwt())])
async def proxy_api_patch_request(
    path: str | None, returnResponse: Response, token=Depends(require_jwt())
):
    response = await forward_request(path, "DELETE", token)
    returnResponse.status_code = response.status_code
    return response.json()


if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
