from sqlalchemy import Column, ARRAY, String
from sqlmodel import SQLModel, Field, Relationship, Session, select
from typing import Optional, List
from datetime import datetime


class UserBase(SQLModel):
    user_id: str = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    password: str
    profile_picture_url: Optional[str] = None
    location: Optional[str] = None
    joining_date: datetime
    items_sold: list = Field(sa_column=Column(ARRAY(String)))
    items_purchased: list = Field(sa_column=Column(ARRAY(String)))
    bio: Optional[str] = None


class User(UserBase, table=True):
    listings: List["Listing"] | None = Relationship(back_populates="seller")
    sent_messages: List["Message"] | None = Relationship(back_populates="sender")
    received_messages: List["Message"] | None = Relationship(back_populates="receiver")
    ratings: List["ListingRating"] | None = Relationship(back_populates="rating_user")
    reviews: List["ListingReview"] | None = Relationship(back_populates="review_user")

    @classmethod
    def create(cls, session: Session, **kwargs):
        user = cls(**kwargs)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    @classmethod
    def get_by_id(cls, session: Session, user_id: str):
        statement = select(cls).where(cls.user_id == user_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()


class ListingBase(SQLModel):
    listing_id: str = Field(default=None, primary_key=True)
    seller_id: str = Field(foreign_key="user.user_id", index=True)
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = Field(index=True)
    listed_at: Optional[datetime] = Field(index=True)
    last_updated_at: Optional[datetime] = None
    image_urls: list = Field(sa_column=Column(ARRAY(String)))
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class Listing(ListingBase, table=True):
    seller: User = Relationship(back_populates="listings")
    messages: List["Message"] | None = Relationship(back_populates="listing")
    ratings: List["ListingRating"] | None = Relationship(back_populates="rated_listing")
    reviews: List["ListingReview"] | None = Relationship(back_populates="reviewed_listing")

    @classmethod
    def create(cls, session: Session, **kwargs):
        listing = cls(**kwargs)
        session.add(listing)
        session.commit()
        session.refresh(listing)
        return listing

    @classmethod
    def get_by_id(cls, session: Session, listing_id: str):
        statement = select(cls).where(cls.listing_id == listing_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()


class MessageBase(SQLModel):
    message_id: str = Field(default=None, primary_key=True)
    sender_id: str = Field(foreign_key="user.user_id", index=True)
    receiver_id: str = Field(index=True)
    listing_id: str = Field(foreign_key="listing.listing_id", index=True)
    message_content: Optional[str] = None
    timestamp: Optional[datetime] = Field(index=True)


class Message(MessageBase, table=True):
    sender: User = Relationship(back_populates="sent_messages")
    receiver: User = Relationship(back_populates="received_messages")
    listing: Listing = Relationship(back_populates="messages")

    @classmethod
    def create(cls, session: Session, **kwargs):
        message = cls(**kwargs)
        session.add(message)
        session.commit()
        session.refresh(message)
        return message

    @classmethod
    def get_by_id(cls, session: Session, message_id: str):
        statement = select(cls).where(cls.message_id == message_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()


class ListingRatingBase(SQLModel):
    listing_rating_id: str = Field(default=None, primary_key=True)
    rated_listing_id: str = Field(foreign_key="listing.listing_id", index=True)
    rating_user_id: str = Field(foreign_key="user.user_id", index=True)
    rating_value: Optional[int] = Field(index=True)
    timestamp: Optional[datetime] = Field(index=True)


class ListingRating(ListingRatingBase, table=True):
    rated_listing: Listing = Relationship(back_populates="ratings")
    rating_user: User = Relationship(back_populates="ratings")

    @classmethod
    def create(cls, session: Session, **kwargs):
        rating = cls(**kwargs)
        session.add(rating)
        session.commit()
        session.refresh(rating)
        return rating

    @classmethod
    def get_by_id(cls, session: Session, listing_rating_id: str):
        statement = select(cls).where(cls.listing_rating_id == listing_rating_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()


class ListingReviewBase(SQLModel):
    listing_review_id: str = Field(default=None, primary_key=True)
    reviewed_listing_id: str = Field(foreign_key="listing.listing_id", index=True)
    review_user_id: str = Field(foreign_key="user.user_id", index=True)
    review_content: Optional[str] = None
    timestamp: Optional[datetime] = Field(index=True)


class ListingReview(ListingReviewBase, table=True):
    reviewed_listing: Listing = Relationship(back_populates="reviews")
    review_user: User = Relationship(back_populates="reviews")

    @classmethod
    def create(cls, session: Session, **kwargs):
        review = cls(**kwargs)
        session.add(review)
        session.commit()
        session.refresh(review)
        return review

    @classmethod
    def get_by_id(cls, session: Session, listing_review_id: str):
        statement = select(cls).where(cls.listing_review_id == listing_review_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()
