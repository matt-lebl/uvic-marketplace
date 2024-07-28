import uuid
from core.sql_models import User
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import UserSchema, NewUser, LoginRequest, UpdateUser, NewUserReq
import argon2
import logging

from sqlmodel import Session

logging.basicConfig(format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/user",
    tags=["users"]
)


@router.post("/", response_model=NewUser)
def create_user(user: NewUserReq, session: Session = Depends(get_session)):
    user_data = user.model_dump()
    user_data["userID"] = str(uuid.uuid4())
    logger.info(f"new user creation: {user_data["userID"]}")
    try:
        new_user = User.create(session=session, **user_data)
        return new_user
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error creating user")


@router.patch("/{userID}", response_model=UserSchema)
def update_user(userID: str, user: UpdateUser, session: Session = Depends(get_session)):
    user_data = user.model_dump()
    user_data["profileUrl"] = user_data["profilePictureUrl"]
    del user_data["profilePictureUrl"]
    logger.info(f"user update: {userID}")
    try:
        new_user = User.update(userID=userID, session=session, **user_data)
        return new_user
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error updating user")


@router.delete("/{userID}")
def delete_user(userID: str, session: Session = Depends(get_session)):
    logger.info(f"Deleting user {userID}")
    try:
        return User.delete(userID, session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error deleting user")


@router.get("/", response_model=list[UserSchema])
def get_all_users(session: Session = Depends(get_session)):
    try:
        return User.get_all(session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error getting users")


@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: str, session: Session = Depends(get_session)):
    try:
        logger.info(f"Getting user {user_id}")
        user = User.get_by_id(session, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error creating user")


@router.post("/login", response_model=UserSchema)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    logger.info("Login request")
    try:
        if not User.is_validated(request.email, session):
            raise HTTPException(status_code=401, detail="Email is not validated")
        hashed_password = User.get_password(session, request.email)
        password = request.password
        if not password:
            raise HTTPException(status_code=401, detail="Invalid request, no password")
        try:
            argon2.PasswordHasher().verify(hashed_password, password)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(status_code=401, detail="Error comparing password")
        user = User.login(session, request.email)
        if not user:
            raise HTTPException(status_code=401, detail="Error retrieving user info")
        return user
    except Exception as e:
        logger.error(str(e))
        raise e


@router.get("/totp-secret/{userID}")
def get_totp_secret(userID: str, session: Session = Depends(get_session)):
    logger.info(f"Retrieve TOTP secret for {userID}")
    try:
        return User.get_totp_secret(userID, session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error retrieving TOTP secret")


@router.post("/add-totp-secret/{totp_secret}/{userID}")
def add_totp_secret(totp_secret: str, userID: str, session: Session = Depends(get_session)):
    logger.info(f"adding totp secret for {userID}")
    try:
        return User.add_totp_secret(totp_secret, userID, session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error adding TOTP Secret")


@router.get("/validation-code/{email}")
def get_validation_code(email: str, session: Session = Depends(get_session)):
    logger.info(f"getting email validation code for {email}")
    try:
        validation_code = User.get_validation_code(email, session)
        if not validation_code:
            raise HTTPException(status_code=404, detail=f"User not found {email}")
        return validation_code
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail="Error retrieving validation code")


@router.post("/validate-email/{validation_code}")
def validate_email(validation_code: str, session: Session = Depends(get_session)):
    logger.info(f"attempting to validate email with code {validation_code}")
    try:
        return User.validate_email(validation_code, session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error validating email")


@router.get("/is-validated/{userID}")
def is_validated(userID: str, session: Session = Depends(get_session)):
    logger.info(f"Checking if email validated for {userID}")
    try:
        return User.is_validated(userID, session)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=401, detail="Error checking account validation")
