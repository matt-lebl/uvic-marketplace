from fastapi import APIRouter, Body, Header, Depends, HTTPException
from typing import Dict, Optional
from util.schemas import UserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
from util.cold_start import add_cold_start_interactions
from db.models import DB_User
from db.deps import get_db
from sqlalchemy.orm import Session

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

# Note that this function is only used for testing
@router.post("/user", responses={201: {"model": UserResponse}, 400: {"model": ErrorMessage}, 401: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_user(user_id: str, data: dict, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    user_data = data['user']
    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if existing_user:
        raise HTTPException(status_code=401, detail={"message": "User already exists", "userID": user_id})

    # Add the user to Elasticsearch
    response = es.index(index="users_index", id=user_id, body=user_data)
    print(f'Added/updated ES database: {response}')

    # Add new user to Postgres
    new_user = DB_User(user_id=user_id)
    db.add(new_user)
    db.commit()
    return {"message": "User added successfully", "userID": user_id}

@router.post("/user/{id}", responses={201: {"model": UserResponse}, 400: {"model": ErrorMessage}, 401: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
def edit_user(id: str, data: dict, db: Session = Depends(get_db)):
    if data["ignoreCharityListings"]:
        hide_charities(id, db)


def hide_charities(user_id: str, db: Session):
    if user_id is None:
        raise HTTPException(status_code=401, detail="No userID in request")

    user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if user:
        user.see_charity_items = False

    try:
        db.add(user)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding user to postgres: ", e)
        db.rollback()

    return {"userID": user_id}
