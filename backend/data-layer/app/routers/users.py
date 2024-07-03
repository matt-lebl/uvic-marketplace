import uuid
from core.sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import UserSchema, NewUser, LoginRequest, UpdateUser, NewUserReq
import argon2
import logging

logging.basicConfig(format="%(asctime)s $(message)s")
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
        hashed_password = User.get_password(session, request.email)
        password = request.password
        if not password:
            raise HTTPException(status_code=401)
        try:
            argon2.verify_password(hashed_password.encode(), password.encode())
        except Exception as e:
            print(e)
            raise HTTPException(status_code=401)
        user = User.login(session, request.email)
        if not user:
            raise HTTPException(status_code=401)
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
