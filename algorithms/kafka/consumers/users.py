from confluent_kafka import KafkaException 
from util.schemas import ItemStatusEnum
from sqlalchemy.orm import Session
from db.models import DB_User
from util.embedding import generate_embedding
from util.elasticsearch_wrapper import ElasticsearchWrapper
from sqlalchemy.exc import SQLAlchemyError

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

def add_user(data: dict, db: Session):
    user_data = data['user']
    user_id = user_data['userID']

    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if existing_user:
        raise KafkaException(status_code=400, detail="User already exists")

    # Add the user to Elasticsearch
    response = es.index(index="users_index", id=user_id, body=user_data)
    print(f'Added/updated ES database: {response}')

    # Add new user to Postgres
    new_user = DB_User(user_id=user_id)
    db.add(new_user)
    db.commit()

    return {"message": "User added successfully", "userID": user_id}

def edit_user(data: dict, db: Session):
    # TODO implement edit user
    user_id = data['userID']

def delete_user(data: dict, db: Session):
    # TODO implement delete user
    user_id = data['userID']