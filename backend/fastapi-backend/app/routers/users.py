import uuid

from fastapi import APIRouter, HTTPException
from core.schemas import (
    LoginRequest,
    NewUser,
    EmailModel,
    UpdateUser,
    User,
    UserBaseModel,
)
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type
from services.auth import AuthHandler, EmailValidator

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)

authHandler = AuthHandler()
email_validator = EmailValidator()


## Auth Not Required
@userRouter.post("/")
async def create_user(user: NewUser):
    path = "user/"

    user = user.model_dump()

    if not EmailValidator.validate_email_domain(user["email"]):
        raise HTTPException(status_code=401, detail="Invalid email domain")

    totp_secret, uri = AuthHandler.generate_otp(user["email"])
    user["password"] = AuthHandler.hash_password(user["password"])
    user["totp_secret"] = authHandler.encrypt_secret(totp_secret)
    user["validation_code"] = str(uuid.uuid4())

    response = await send_request_to_data_layer(path, "POST", user)
    response = response.json()
    response["totp_secret"] = totp_secret
    response["totp_uri"] = uri
    return response


@userRouter.get("/{id}")
async def get_user(id: str, authUserID: str):
    path = "user/" + id
    response = await send_request_to_data_layer(path, "GET")
    if response.status_code == 200:
        return convert_to_type(response.json(), UserBaseModel)
    print("Getting user failed")
    return response.json()


@userRouter.patch("/")
async def edit_user(user: UpdateUser, authUserID: str):
    path = "user/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", user.model_dump())
    if response.status_code == 200:
        return convert_to_type(response.json(), UserBaseModel)
    return response.json()


@userRouter.delete("/")
async def delete_user(authUserID: str):
    path = "user/" + authUserID
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
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if loginResponse.status_code == 200:
        if authHandler.check_totp(loginRequest.totp_code, loginResponse.totp_code):
            return convert_to_type(loginResponse.json(), UserBaseModel)
    else:
        # TODO: Check what the data layer sends back and send the correct error message.
        raise HTTPException(status_code=401, detail="Invalid credentials")


# Logout need not be implemented, it is implemented in RP
@userRouter.post("/validate-email/{validation_code}/{email}")
async def validate_email(validation_code: str, email: str):
    decrypted_email = authHandler.decrypt_secret(email)
    decrypted_validation_code = authHandler.decrypt_secret(validation_code)

    if not EmailValidator.validate_email_domain(decrypted_email):
        raise HTTPException(status_code=401, detail="Invalid email domain")

    response = await send_request_to_data_layer(f"/user/validate-email/{decrypted_validation_code}/{decrypted_email}",
                                                "POST")
    return response.json()


@userRouter.get("/send-validation-link/{email}")
async def send_validation_link(email: str):
    if not EmailValidator.validate_email_domain(email):
        raise HTTPException(status_code=401, detail="Invalid email domain")

    response = await send_request_to_data_layer(f"/user/validation-code/{email}", "GET")
    validation_code = response.json()

    email_validator.send_validation_email(email, validation_code)
    return {"message": "Validation email sent"}
