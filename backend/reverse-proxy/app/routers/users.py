from fastapi import APIRouter
from schemas import NewUser, LoginRequest, ResetPassword
from services.backend_connect import sendRequestToBackend


usersRouter = APIRouter(
    prefix="/api/user", tags=["users"], responses={404: {"description": "Not found"}}
)


## These endpoints can be interacted with without a valid JWT token
@usersRouter.post("/")
async def create_user(user: NewUser):
    return await sendRequestToBackend("user", "POST", user.model_dump_json())


@usersRouter.get("/reset-password")
async def reset_password(resetPassword: ResetPassword):
    return await sendRequestToBackend(
        "user/reset-password", "POST", resetPassword.model_dump_json()
    )


@usersRouter.get("/login")
async def login(loginRequest: LoginRequest):
    return await sendRequestToBackend(
        "user/login", "POST", loginRequest.model_dump_json()
    )
