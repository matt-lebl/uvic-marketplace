from pathlib import Path
from pydantic.v1 import BaseSettings
from sqlmodel import Session, create_engine
from decouple import config

class Settings:
    """
    The below fields are the names of the necessary env variables (except database_url ignore that)
    """

    def __init__(self):
        self.db_host: str = config("DB_HOST", default="localhost")
        self.db_port: int = config("DB_PORT", default=9999)
        self.postgres_db: str = config("POSTGRES_DB", default="my_database")
        self.postgres_user: str = config("POSTGRES_USER", default="my_username")
        self.postgres_password: str = config("POSTGRES_PASSWORD", default="my_password")

        self.database_url = \
            f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.db_host}:{self.db_port}/{self.postgres_db}"
