from fastapi import APIRouter
from schemas import LoginRequest, NewUser, EmailModel, UpdateUser
from services.data_layer_connect import send_request_to_data_layer

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


## Auth Not Required
@userRouter.post("/")
def create_user(user: NewUser):

    path = "users/"
    return send_request_to_data_layer(path, "POST", user.model_dump())


@userRouter.get("/{id}")
def get_user(id: str, authUserID: str):

    path = "users/" + id
    return send_request_to_data_layer(path, "GET")


@userRouter.patch("/")
def edit_user(user: UpdateUser, authUserID: str):

    path = "users/" + authUserID
    return send_request_to_data_layer(path, "PATCH", user.model_dump())


@userRouter.delete("/")
def delete_user(authUserID: str):

    path = "users/" + authUserID
    return send_request_to_data_layer(path, "DELETE")


## Auth Not Required
@userRouter.post("/reset-password")
def reset_password(emailModel: EmailModel):
    # TODO: Implement password reset
    return {"TODO": "Password reset email sent to {}".format(emailModel.email)}


## Auth Not Required
@userRouter.post("/login")
def login(loginRequest: LoginRequest):

    path = "users/login"
    return send_request_to_data_layer(path, "POST", loginRequest.model_dump())


@userRouter.post("/logout")
def logout(authUserID: str):
    # TODO: Implement user logout
    return {"TODO": "User logged out", "Reqested by": authUserID}


@userRouter.post("/send-confirmation-email")
def send_confirmation_email(emailModel: EmailModel, authUserID: str):
    # TODO: Implement sending confirmation email
    return {
        "TODO": "Confirmation email sent to {}".format(emailModel.email),
        "Reqested by": authUserID,
    }


@userRouter.post("/confirm-email")
def confirm_email(token: str, authUserID: str):
    # TODO: Implement email confirmation
    return {"TODO": "Email confirmed", "Reqested by": authUserID}
