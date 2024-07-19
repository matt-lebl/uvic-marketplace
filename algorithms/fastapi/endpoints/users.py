from fastapi import APIRouter, Body, Header
from typing import Dict, Optional
from util.schemas import UserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
from db.models import DB_User

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.post("/user", response_model=UserResponse, responses={201: {"model": UserResponse}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_user(data: Dict = Body(...), authorization: Optional[str] = Header(None)):
    
    print(data)
    user_data = data['user']
    user_id = user_data['userID']

    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Add the user to Elasticsearch
    response = es.index(index="users_index", id=user_id, body=user_data)
    print(f'Added/updated ES database: {response}')

    # Add new user to Postgres
    new_user = DB_User(user_id=user_id)
    db.add(new_user)
    db.commit()
    add_cold_start_interactions(user_id, db) # Call cold start function #TODO - move this to util
    
    return {"message": "User added successfully", "userID": user_id}
