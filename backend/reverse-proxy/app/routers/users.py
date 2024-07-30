from fastapi import APIRouter, Response, Request, HTTPException
from core.schemas import (
    NewUser,
    LoginRequest,
    NewUserReq,
    User,
    ValidationRequest,
    SendEmailRequest,
)
from core.auth import sign_jwt, verify_jwt, decode_jwt, sign_validation_jwt
from services.backend_connect import send_request_to_backend

usersRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)


## These endpoints can be interacted with without a valid JWT token
@usersRouter.post("/")
async def create_user(user: NewUserReq, response: Response):
    response_backend = await send_request_to_backend("user/", "POST", user.model_dump())
    response.status_code = response_backend.status_code
    if response_backend.status_code == 200:
        response.set_cookie(
            key="validation",
            value=sign_validation_jwt(user.email),
            httponly=True,
            samesite="strict",
        )
    return response_backend.json()


@usersRouter.post("/login")
async def login(loginRequest: LoginRequest, response: Response):
    response_backend = await send_request_to_backend(
        "user/login", "POST", loginRequest.model_dump()
    )
    response_json = response_backend.json()
    response.status_code = response_backend.status_code

    if response_backend.status_code == 200:
        if "emailNotVerified" in response_json:
            response.set_cookie(
                key="validation",
                value=sign_validation_jwt(response_json["email"]),
                httponly=True,
                samesite="strict",
            )
            return {}

        else:
            response.set_cookie(
                key="authorization",
                value=sign_jwt(response_json["userID"]),
                httponly=True,
                samesite="strict",
            )

    return response_json


@usersRouter.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="authorization")
    response.delete_cookie(key="validation")
    return {"message": "Successfully signed out"}


@usersRouter.post("/send-confirmation-email")
async def send_validation_link(request: Request, response: Response):
    validation_cookie = request.cookies.get("validation")
    if not validation_cookie:
        raise HTTPException(
            status_code=400, detail="No authorization provided for email validation"
        )
    payload = decode_jwt(validation_cookie)

    if not payload:
        raise HTTPException(status_code=403, detail="Invalid token or expired token.")
    email = payload["email"]
    response_backend = await send_request_to_backend(
        f"user/send-validation-link", "POST", {"email": email}
    )
    response.status_code = response_backend.status_code
    return response_backend.json()


@usersRouter.post("/confirm-email")
async def validate_email(request: ValidationRequest, response: Response):
    response_backend = await send_request_to_backend(
        f"user/validate-email", "POST", request.model_dump()
    )
    response.status_code = response.status_code
    return response_backend.json()


@usersRouter.post("/reset-password")
async def reset_password(request: SendEmailRequest, response: Response):
    response_backend = await send_request_to_backend(
        f"user/reset-password/", "POST", request.model_dump()
    )
    response.status_code = response_backend.status_code
    return response_backend.json()
