from fastapi import APIRouter
from schemas import LoginRequest, NewListing, NewReview, NewUser, User, UpdateUser

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@userRouter.post("/")
def create_user(user: NewUser):
    # TODO: Implement user creation
    return {"TODO": "User Creation"}


@userRouter.get("/{id}")
def get_user(id: int):
    # TODO: Implement user retrieval
    return {"TODO": id}


@userRouter.patch("/")
def edit_user(user: UpdateUser):
    # TODO: Implement user update
    return {"TODO": "User updated"}


@userRouter.delete("/")
def delete_user():
    # TODO: Implement user deletion
    return {"TODO": "User deleted"}


@userRouter.post("/reset-password")
def reset_password(email: str):
    # TODO: Implement password reset
    return {"TODO": "Password reset email sent"}


@userRouter.post("/login")
def login(loginRequest: LoginRequest):
    # TODO: Implement user login
    return {"TODO": "User logged in"}


@userRouter.post("/logout")
def logout():
    # TODO: Implement user logout
    return {"TODO": "User logged out"}


@userRouter.post("/send-confirmation-email")
def send_confirmation_email(email: str):
    # TODO: Implement sending confirmation email
    return {"TODO": "Confirmation email sent"}


@userRouter.post("/confirm-email")
def confirm_email(token: str):
    # TODO: Implement email confirmation
    return {"TODO": "Email confirmed"}
