from fastapi import APIRouter, HTTPException
from schemas import LoginRequest, NewUser, EmailModel, UpdateUser, User
from services.data_layer_connect import send_request_to_data_layer

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)


## Auth Not Required
@userRouter.post("/")
async def create_user(user: NewUser):

    path = "users/"
    response = await send_request_to_data_layer(path, "POST", user.model_dump())
    return response.json()


@userRouter.get("/{id}")
async def get_user(id: str, authUserID: str):

    path = "users/" + id
    response = await send_request_to_data_layer(path, "GET")
    return response.json()


@userRouter.patch("/")
async def edit_user(user: UpdateUser, authUserID: str):

    path = "users/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", user.model_dump())
    return response.json()


@userRouter.delete("/")
async def delete_user(authUserID: str):

    path = "users/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()


## Auth Not Required
@userRouter.post("/reset-password")
async def reset_password(emailModel: EmailModel):
    # TODO: Implement password reset
    return {"TODO": "Password reset email sent to {}".format(emailModel.email)}


## Auth Not Required
@userRouter.post("/login")
async def login(loginRequest: LoginRequest):
    path = "user/login"
    email_password = {"email": loginRequest.email, "password": loginRequest.password}
    try:
        loginResponse = await send_request_to_data_layer(path, "POST", email_password)
        if loginResponse.status_code == 200:
            return loginResponse.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@userRouter.post("/logout")
async def logout(authUserID: str):
    # TODO: Implement user logout
    return {"TODO": "User logged out", "Reqested by": authUserID}


@userRouter.post("/send-confirmation-email")
async def send_confirmation_email(emailModel: EmailModel, authUserID: str):
    # TODO: Implement sending confirmation email
    return {
        "TODO": "Confirmation email sent to {}".format(emailModel.email),
        "Reqested by": authUserID,
    }


@userRouter.post("/confirm-email")
async def confirm_email(token: str, authUserID: str):
    # TODO: Implement email confirmation
    return {"TODO": "Email confirmed", "Reqested by": authUserID}
