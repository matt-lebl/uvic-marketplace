from fastapi import APIRouter
from schemas import LoginRequest, NewUser, EmailModel, UpdateUser

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


## Auth Not Required
@userRouter.post("/")
def create_user(user: NewUser):
    # TODO: Implement user creation
    return {"TODO": "User Creation"}


@userRouter.get("/{id}")
def get_user(id: str, authUserID: str):
    # TODO: Implement user retrieval
    return {"TODO": id, "Reqested by": authUserID}


@userRouter.patch("/")
def edit_user(user: UpdateUser, authUserID: str):
    # TODO: Implement user update
    return {"TODO": "User updated", "Reqested by": authUserID}


@userRouter.delete("/")
def delete_user(authUserID: str):
    # TODO: Implement user deletion
    return {"TODO": "User deleted", "Reqested by": authUserID}


## Auth Not Required
@userRouter.post("/reset-password")
def reset_password(emailModel: EmailModel):
    # TODO: Implement password reset
    return {"TODO": "Password reset email sent to {}".format(emailModel.email)}


## Auth Not Required
@userRouter.post("/login")
def login(loginRequest: LoginRequest):
    # TODO: Implement user login
    return {
        "TODO": "Received login request from {}, with password {}".format(
            loginRequest.email, loginRequest.password
        )
    }


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
