from fastapi import APIRouter
from schemas import NewUser, LoginRequest, ResetPassword
from services.backend_connect import send_request_to_backend


usersRouter = APIRouter(
    prefix="/api/user", tags=["users"], responses={404: {"description": "Not found"}}
)


## These endpoints can be interacted with without a valid JWT token
@usersRouter.post("/")
async def create_user(user: NewUser):
    return await send_request_to_backend("user", "POST", user.model_dump_json())


@usersRouter.get("/reset-password")
async def reset_password(resetPassword: ResetPassword):
    return await send_request_to_backend(
        "user/reset-password", "POST", resetPassword.model_dump_json()
    )


@usersRouter.get("/login")
async def login(loginRequest: LoginRequest):
    return await send_request_to_backend(
        "user/login", "POST", loginRequest.model_dump_json()
    )
