from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Get the enviroment variables that make up the database URL
postgres_scheme = os.environ["POSTGRES_SCHEME"]
postgres_user = os.environ["POSTGRES_USER"]
postgres_password = os.environ["POSTGRES_PASSWORD"]
postgres_host = os.environ["POSTGRES_HOST"] 
postgres_port = os.environ["POSTGRES_PORT"]
postgres_name = os.environ["POSTGRES_NAME"]

SQLALCHEMY_DATABASE_URL = f"{postgres_scheme}{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_name}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
