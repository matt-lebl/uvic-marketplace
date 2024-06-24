import uuid
from .sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session
from .schemas import UserSchema, NewUser, LoginRequest, UpdateUser, NewUserReq

router = APIRouter(
    prefix="/user",
    tags=["users"]
)


@router.post("/", response_model=NewUser)
def create_user(user: NewUserReq, session: Session = Depends(get_session)):
    user_data = user.dict()
    user_data["userID"] = str(uuid.uuid4())
    new_user = User.create(session=session, **user_data)
    return new_user


@router.patch("/{userID}", response_model=UserSchema)
def update_user(userID: str, user: UpdateUser, session: Session = Depends(get_session)):
    user_data = user.dict()
    user_data["profileUrl"] = user_data["profilePictureUrl"]
    del user_data["profilePictureUrl"]
    new_user = User.update(userID=userID, session=session, **user_data)
    return new_user


@router.delete("/{userID}")
def delete_user(userID: str, session: Session = Depends(get_session)):
    return User.delete(userID, session)


@router.get("/", response_model=list[UserSchema])
def get_all_users(session: Session = Depends(get_session)):
    return User.get_all(session)


@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: str, session: Session = Depends(get_session)):
    user = User.get_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/login", response_model=UserSchema)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = User.login(session, **request.dict())
    if not user:
        raise HTTPException(status_code=401)
    return user


@router.get("/totp-secret/{userID}")
def get_totp_secret(userID: str, session: Session = Depends(get_session)):
    return User.get_totp_secret(userID, session)


@router.post("/add-totp-secret/{totp_secret}/{userID}")
def add_totp_secret(totp_secret: str, userID: str, session: Session = Depends(get_session)):
    User.add_totp_secret(totp_secret, userID, session)
