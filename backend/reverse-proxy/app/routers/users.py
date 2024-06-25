from fastapi import APIRouter, HTTPException, Response
from schemas import NewUser, LoginRequest, ResetPassword, User
from auth import sign_jwt
from services.backend_connect import send_request_to_backend


usersRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)


## These endpoints can be interacted with without a valid JWT token
@usersRouter.post("/")
async def create_user(
    user: NewUser,
):
    response_backend = await send_request_to_backend(
        "user", "POST", user.model_dump()
    ).json()
    return response_backend


@usersRouter.post("/reset-password")
async def reset_password(resetPassword: ResetPassword):
    response_backend = await send_request_to_backend(
        "user/reset-password", "POST", resetPassword.model_dump()
    ).json()
    return response_backend


@usersRouter.post("/login")
async def login(loginRequest: LoginRequest, response: Response):

    response_backend = await send_request_to_backend(
        "user/login", "POST", loginRequest.model_dump()
    )

    user: User = response_backend.json()

    if response_backend.status_code == 200:
        response.set_cookie(
            key="jwt",
            value=sign_jwt(user["userID"]),
            httponly=True,
            samesite="strict",
        )
    return user
