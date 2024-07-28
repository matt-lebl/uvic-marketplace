from fastapi import APIRouter, Body, Header, Depends, HTTPException
from typing import Dict, Optional
from util.schemas import UserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
from util.cold_start import add_cold_start_interactions
from db.models import DB_User
from db.deps import get_db
from sqlalchemy.orm import Session
import logging

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')
logger = logging.getLogger(__name__)

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

# Note that this function is only used for testing
@router.post("/user", responses={201: {"model": UserResponse}, 400: {"model": ErrorMessage}, 401: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_user(user_id: str, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if existing_user:
        raise HTTPException(status_code=401, detail={"message": "User already exists", "userID": user_id})

    user_data = {
        "username": f"user{user_id}",
        "name": "FakeName",
        "bio": "bio",
        "profileUrl": 'https://example.com'
        }

    # Add the user to Elasticsearch
    response = es.index(index="users_index", id=user_id, body=user_data)
    logger.info(f'Added/updated ES database: {response}')

    # Add new user to Postgres
    new_user = DB_User(user_id=user_id)
    db.add(new_user)
    db.commit()
    add_cold_start_interactions(user_id, db)
    
    return {"message": "User added successfully", "userID": user_id}
