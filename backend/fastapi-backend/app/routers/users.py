import uuid

from fastapi import APIRouter, HTTPException, Response
from core.schemas import (
    LoginRequest,
    NewUser,
    NewUserReq,
    UpdateUser,
    User,
    NewUserReq,
    ValidationRequest,
    SendEmailRequest,
)
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type
from services.auth import AuthHandler, EmailValidator, UserValidator
from services.data_sync_kafka_producer import DataSyncKafkaProducer

dsKafkaProducer = DataSyncKafkaProducer(disable=False)

userRouter = APIRouter(
    prefix="/api/user",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)

authHandler = AuthHandler()
email_validator = EmailValidator()


def data_layer_failed(response_from_data_layer, response_to_client):
    if response_from_data_layer.status_code != 200:
        response_to_client.status_code = response_from_data_layer.status_code
        return True
    return False


## Auth Not Required
@userRouter.post("/")
async def create_user(user: NewUserReq, returnResponse: Response):
    path = "user/"

    user = user.model_dump()

    if not UserValidator.validate_email(user["email"]):
        print("invalid email")
        raise HTTPException(status_code=400, detail="Invalid email domain")

    if not UserValidator.validate_password(user["password"]):
        print("invalid password")
        raise HTTPException(status_code=400, detail="Invalid password")

    if not UserValidator.validate_username(user["username"]):
        print("invalid username")
        raise HTTPException(status_code=400, detail="Invalid username")

    totp_secret, uri = AuthHandler.generate_otp(user["email"])
    user["password"] = AuthHandler.hash_password(user["password"])
    user["totp_secret"] = authHandler.encrypt_secret(totp_secret)
    user["validation_code"] = str(uuid.uuid4())

    response = await send_request_to_data_layer(path, "POST", user)

    if data_layer_failed(response, returnResponse):
        return response.json()

    response = response.json()
    response["totp_secret"] = totp_secret
    response["totp_uri"] = uri
    dsKafkaProducer.push_new_user(response)
    return response


@userRouter.get("/{id}", response_model=User)
async def get_user(id: str, authUserID: str):
    path = "user/" + id
    response = await send_request_to_data_layer(path, "GET")
    if response.status_code == 200:
        return convert_to_type(response.json(), User)
    print("Getting user failed")
    return response.json()


@userRouter.patch("/")
async def edit_user(user: UpdateUser, authUserID: str):
    user = user.model_dump()

    if not UserValidator.validate_password(user["password"]):
        print("invalid password")
        raise HTTPException(status_code=400, detail="Invalid password")

    if not UserValidator.validate_username(user["username"]):
        print("invalid username")
        raise HTTPException(status_code=400, detail="Invalid username")

    user["password"] = AuthHandler.hash_password(user["password"])
    path = "user/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", user.model_dump())
    dsKafkaProducer.push_updated_user(user, authUserID)
    if response.status_code == 200:
        return convert_to_type(response.json(), User)
    return response.json()


@userRouter.delete("/")
async def delete_user(authUserID: str):
    path = "user/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()


# Auth Not Required
@userRouter.post("/login")
async def login(loginRequest: LoginRequest, response: Response):
    path = "user/login"
    loginResponse = await send_request_to_data_layer(
        path, "POST", loginRequest.model_dump()
    )

    if data_layer_failed(loginResponse, response):
        return loginResponse.json()

    if "emailNotVerified" in loginResponse.json():
        return loginResponse.json()

    if authHandler.check_totp(
        loginRequest.totp_code, loginResponse.json()["totp_secret"]
    ):
        return convert_to_type(loginResponse.json(), User)
    else:
        raise HTTPException(status_code=403, detail="Invalid TOTP code")


# Logout need not be implemented, it is implemented in RP
@userRouter.post("/validate-email")
async def validate_email(request: ValidationRequest, returnResponse: Response):
    response = await send_request_to_data_layer(
        f"/user/validate-email", "POST", request.model_dump()
    )
    returnResponse.status_code = response.status_code
    return response.json()


@userRouter.post("/send-validation-link")
async def send_validation_link(req: SendEmailRequest):
    email = req.email
    if not UserValidator.validate_email(email):
        raise HTTPException(status_code=400, detail="Invalid email domain")

    response = await send_request_to_data_layer(f"/user/validation-code/{email}", "GET")
    validation_code = response.json()

    try:
        email_validator.send_validation_email(email, validation_code)
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Email could not be sent -- most likely smtp credentials are invalid",
        )

    return {"message": "Validation email sent"}


@userRouter.post("/reset-password/")
async def reset_password(req: SendEmailRequest):
    email = req.email
    if not UserValidator.validate_email(email):
        raise HTTPException(status_code=400, detail="Invalid email domain")

    code = str(uuid.uuid4())
    await send_request_to_data_layer(
        "/user/set-password-reset-code", "POST", {"email": email, "code": code}
    )

    try:
        email_validator.send_password_reset_email(email, code)
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Email could not be sent -- most likely smtp credentials are invalid",
        )
    return {"message": "Password reset email sent"}
