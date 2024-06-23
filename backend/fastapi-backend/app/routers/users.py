from fastapi import APIRouter
from schemas import LoginRequest, NewListing, NewReview, NewUser, User, UpdateUser

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
def get_user(id: int, authUserID: int):
    # TODO: Implement user retrieval
    return {"TODO": id, "Reqested by": authUserID}


@userRouter.patch("/")
def edit_user(user: UpdateUser, authUserID: int):
    # TODO: Implement user update
    return {"TODO": "User updated", "Reqested by": authUserID}


@userRouter.delete("/")
def delete_user(authUserID: int):
    # TODO: Implement user deletion
    return {"TODO": "User deleted", "Reqested by": authUserID}


## Auth Not Required
@userRouter.post("/reset-password")
def reset_password(email: str):
    # TODO: Implement password reset
    return {"TODO": "Password reset email sent"}


## Auth Not Required
@userRouter.post("/login")
def login(loginRequest: LoginRequest):
    # TODO: Implement user login
    return {"TODO": "User logged in"}


@userRouter.post("/logout")
def logout(authUserID: int):
    # TODO: Implement user logout
    return {"TODO": "User logged out", "Reqested by": authUserID}


@userRouter.post("/send-confirmation-email")
def send_confirmation_email(email: str, authUserID: int):
    # TODO: Implement sending confirmation email
    return {"TODO": "Confirmation email sent", "Reqested by": authUserID}


@userRouter.post("/confirm-email")
def confirm_email(token: str, authUserID: int):
    # TODO: Implement email confirmation
    return {"TODO": "Email confirmed", "Reqested by": authUserID}
