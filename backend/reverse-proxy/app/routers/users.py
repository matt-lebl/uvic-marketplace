from fastapi import APIRouter, HTTPException, Response
from core.schemas import NewUser, LoginRequest, ResetPassword, User, UserBaseModel
from core.auth import sign_jwt
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
    response_backend = await send_request_to_backend("user/", "POST", user.model_dump())
    return response_backend.json()


@usersRouter.post("/reset-password")
async def reset_password(resetPassword: ResetPassword):
    response_backend = await send_request_to_backend(
        "user/reset-password", "POST", resetPassword.model_dump()
    )
    return response_backend.json()


@usersRouter.post("/login")
async def login(loginRequest: LoginRequest, response: Response):
    response_backend = await send_request_to_backend(
        "user/login", "POST", loginRequest.model_dump()
    )

    user = response_backend.json()

    if response_backend.status_code == 200:
        response.set_cookie(
            key="authorization",
            value=sign_jwt(user["userID"]),
            httponly=True,
            samesite="strict",
        )
    return user


@usersRouter.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="authorization")
    return {"message": "Successfully signed out"}


@usersRouter.get("/validate-email/{auth_code}")
async def validate_email(auth_code: str):
    print(auth_code)
    return {"message": auth_code}
