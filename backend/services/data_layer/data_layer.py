import uuid
from pathlib import Path
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from pydantic.v1 import BaseSettings
from sqlmodel import Session, create_engine
from sql_models import User, Listing, Message, ListingRating, ListingReview, UserBase, ListingBase, \
    MessageBase


class Settings(BaseSettings):
    db_host: str
    db_port: int
    postgres_db: str
    postgres_user: str
    postgres_password: str
    database_url: str = None

    class Config:
        env_file = Path(__file__).parent.parent / ".env"

    def __init__(self, **values):
        super().__init__(**values)
        self.database_url = \
            f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.db_host}:{self.db_port}/{self.postgres_db}"


app = FastAPI()
settings = Settings()
engine = create_engine(settings.database_url)


def get_session():
    with Session(engine) as session:
        yield session


