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


@app.post("/create/users/", response_model=User)
def create_user(user: UserBase, session: Session = Depends(get_session)):
    user_data = user.dict()
    user_data["user_id"] = str(uuid.uuid4())
    new_user = User.create(session=session, **user_data)
    return new_user


@app.post("/create/listings/", response_model=Listing)
def create_listing(listing: ListingBase, session: Session = Depends(get_session)):
    listing_data = listing.dict()
    listing_data["listing_id"] = str(uuid.uuid4())
    new_listing = Listing.create(session=session, **listing_data)
    return new_listing


@app.post("/create/messages/", response_model=Message)
def create_message(message: MessageBase, session: Session = Depends(get_session)):
    message_data = message.dict()
    message_data["message_id"] = str(uuid.uuid4())
    new_message = Message.create(session=session, **message_data)
    return new_message


@app.post("/create/listing_ratings/", response_model=ListingRating)
def create_listing_rating(rating: ListingRating, session: Session = Depends(get_session)):
    rating_data = rating.dict()
    rating_data["listing_rating_id"] = str(uuid.uuid4())
    new_rating = ListingRating.create(session=session, **rating_data)
    return new_rating


@app.post("/create/listing_reviews/", response_model=ListingReview)
def create_listing_review(review: ListingReview, session: Session = Depends(get_session)):
    review_data = review.dict()
    review_data["listing_review_id"] = str(uuid.uuid4())
    new_review = ListingReview.create(session=session, **review_data)
    return new_review


@app.get("/users/", response_model=List[User])
def get_all_users(session: Session = Depends(get_session)):
    return User.get_all(session)


@app.get("/listings/", response_model=List[Listing])
def get_all_listings(session: Session = Depends(get_session)):
    return Listing.get_all(session)


@app.get("/messages/", response_model=List[Message])
def get_all_messages(session: Session = Depends(get_session)):
    return Message.get_all(session)


@app.get("/listing_ratings/", response_model=List[ListingRating])
def get_all_listing_ratings(session: Session = Depends(get_session)):
    return ListingRating.get_all(session)


@app.get("/listing_reviews/", response_model=List[ListingReview])
def get_all_listing_reviews(session: Session = Depends(get_session)):
    return ListingReview.get_all(session)


@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str, session: Session = Depends(get_session)):
    user = User.get_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/listings/{listing_id}", response_model=Listing)
def get_listing(listing_id: str, session: Session = Depends(get_session)):
    listing = Listing.get_by_id(session, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@app.get("/messages/{message_id}", response_model=Message)
def get_message(message_id: str, session: Session = Depends(get_session)):
    message = Message.get_by_id(session, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@app.get("/listing_ratings/{listing_rating_id}", response_model=ListingRating)
def get_listing_rating(listing_rating_id: str, session: Session = Depends(get_session)):
    rating = ListingRating.get_by_id(session, listing_rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Listing rating not found")
    return rating


@app.get("/listing_reviews/{listing_review_id}", response_model=ListingReview)
def get_listing_review(listing_review_id: str, session: Session = Depends(get_session)):
    review = ListingReview.get_by_id(session, listing_review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Listing review not found")
    return review
