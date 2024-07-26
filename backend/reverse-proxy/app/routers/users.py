from fastapi import APIRouter, Response
from core.schemas import NewUser, LoginRequest, NewUserReq, User
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
    user: NewUserReq,
):
    print(user.model_dump())
    response_backend = await send_request_to_backend("user/", "POST", user.model_dump())
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


@usersRouter.get("/validate-email/{validation_code}/{email}")
async def validate_email(validation_code: str, email: str):
    response = await send_request_to_backend(
        f"user/validate-email/{validation_code}", "POST"
    )
    return response.json()


@usersRouter.get("/send-validation-link/{email}")
async def send_validation_link(email: str):
    response = await send_request_to_backend(
        f"user/send-validation-link/{email}", "GET"
    )
    return response.json()

# @usersRouter.get("/send-confirmation-email")
# async def send_validation_link(email: str):
#     response = await send_request_to_backend(
#         f"user/send-validation-link/{email}", "GET"
#     )
#     return response.json()

# @usersRouter.post("/confirm-email")
# async def validate_email(request: dict):
#     code = request["code"]
#     response = await send_request_to_backend(
#         f"user/validate-email/{code}", "POST"
#     )
#     return response.json()
