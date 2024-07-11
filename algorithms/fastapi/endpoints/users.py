from fastapi import APIRouter, Body, Header
from typing import Dict, Optional
from util.schemas import UserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.post("/user", response_model=UserResponse, responses={201: {"model": UserResponse}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_user(data: Dict = Body(...), authorization: Optional[str] = Header(None)):
    
    print(data)
    user_data = data['user']

    # Add the user to Elasticsearch
    response = es.index(index="users_index", id=user_data['userID'], body=user_data)
    print(f'Added/updated ES database: {response}')
    
    response = {"user": user_data}

    print("this is the response: ")
    print(response)

    return response