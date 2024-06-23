import uuid
from .sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session
from .schemas import UserSchema, NewUser

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/", response_model=UserSchema)
def create_user(user: NewUser, session: Session = Depends(get_session)):
    user_data = user.dict()
    user_data["userID"] = str(uuid.uuid4())
    new_user = User.create(session=session, **user_data)
    return new_user


@router.get("/", response_model=list[UserSchema])
def get_all_users(session: Session = Depends(get_session)):
    return User.get_all(session)


@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: str, session: Session = Depends(get_session)):
    user = User.get_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


