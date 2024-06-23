import json
from sqlalchemy import Column, ARRAY, String
from sqlmodel import SQLModel, Field, Relationship, Session, select
from datetime import datetime
from .schemas import ListingSchema, UserProfile
from fastapi import HTTPException


class UserBase(SQLModel):
    userID: str = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    name: str
    bio: str | None = None
    profileUrl: str | None = None
    email: str = Field(unique=True, index=True)
    totp_secret: str
    items_sold: list | None = Field(sa_column=Column(ARRAY(String)))
    items_purchased: list | None = Field(sa_column=Column(ARRAY(String)))


class User(UserBase, table=True):
    listings: list["Listing"] | None = Relationship(back_populates="seller")
    sent_messages: list["Message"] | None = Relationship(back_populates="sender")
    received_messages: list["Message"] | None = Relationship(back_populates="receiver")

    @classmethod
    def create(cls, session: Session, **kwargs):
        user = cls(**kwargs)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    @classmethod
    def get_by_id(cls, session: Session, userID: str):
        statement = select(cls).where(cls.userID == userID)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()


class ListingBase(SQLModel):
    listingID: str = Field(default=None, primary_key=True)
    sellerId: str = Field(foreign_key="user.userID", index=True)
    title: str
    description: str | None = None
    price: float | None = None
    status: str | None = Field(default="AVAILABLE", index=True)
    dateCreated: datetime | None = Field(index=True)
    dateModified: datetime | None = None
    images: str | None
    latitude: float | None = None
    longitude: float | None = None


class Listing(ListingBase, table=True):
    seller: User = Relationship(back_populates="listings")
    messages: list["Message"] | None = Relationship(back_populates="listing")
    reviews: list["ListingReview"] | None = Relationship(back_populates="reviewed_listing")

    @classmethod
    def create(cls, session: Session, **kwargs):
        listing = cls(**kwargs)
        session.add(listing)
        session.commit()
        session.refresh(listing)
        return listing

    @classmethod
    def update(cls, seller_id: str, listingID: str, session: Session, **kwargs):
        statement = select(cls).where(cls.listingID == listingID)
        listing = session.exec(statement).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if listing.sellerId != seller_id:
            raise HTTPException(status_code=403, detail="Permissions error")
        for key, value in kwargs.items():
            setattr(listing, key, value)
        session.add(listing)
        session.commit()
        session.refresh(listing)

        return listing

    @classmethod
    def delete(cls, listingID: str, userId: str, session: Session):
        statement = select(cls).where(cls.listingID == listingID)
        listing = session.exec(statement).first()

        if not listing:
            raise HTTPException(status_code=400, detail="Invalid request")

        if listing.sellerId != userId:
            raise HTTPException(status_code=403, detail="Permissions error")

        session.delete(listing)
        session.commit()

        return {"message": "Listing deleted successfully"}

    @classmethod
    def get_by_id(cls, session: Session, listingID: str):
        statement = select(cls).where(cls.listingID == listingID)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()

    @classmethod
    def convert_to_db_object(cls, listing_data: dict, seller_id: str):
        listing_data["sellerId"] = seller_id
        listing_data["latitude"] = float(listing_data["location"]["latitude"])
        listing_data["longitude"] = float(listing_data["location"]["longitude"])
        listing_data["images"] = json.dumps(listing_data["images"])
        del listing_data["location"]
        return listing_data

    def convert_to_schema(self, session: Session, user_profile: dict = None):
        data = self.dict()
        data["location"] = {"longitude": self.longitude, "latitude": self.latitude}
        data["images"] = json.loads(data["images"])
        if not user_profile:
            user_profile = self.get_user_profile(session)
        reviews = self.get_reviews(session)
        data["seller_profile"] = user_profile
        data["reviews"] = reviews
        return ListingSchema(**data)

    def get_user_profile(self, session: Session):
        user_statement = select(User).where(User.userID == self.sellerId)
        user = session.exec(user_statement).first()
        user_profile = UserProfile(**user.dict())
        user_profile.userID = self.sellerId
        return user_profile.dict()

    def get_reviews(self, session: Session):
        review_statement = select(ListingReview).where(ListingReview.listingID == self.listingID)
        reviews = session.exec(review_statement).all()
        return [r.dict() for r in reviews]


class ListingReviewBase(SQLModel):
    listing_review_id: str = Field(default=None, primary_key=True)
    listingID: str = Field(foreign_key="listing.listingID", index=True)
    userID: str
    reviewerName: str
    stars: int
    comment: str | None = None
    dateCreated: datetime
    dateModified: datetime = Field(index=True)


class ListingReview(ListingReviewBase, table=True):
    reviewed_listing: Listing = Relationship(back_populates="reviews")

    @classmethod
    def create(cls, session: Session, **kwargs):
        kwargs["reviewerName"] = cls.get_reviewer_name(kwargs["userID"], session)
        review = cls(**kwargs)
        session.add(review)
        session.commit()
        session.refresh(review)
        return review

    @classmethod
    def update(cls, user_id: str, listing_review_id: str, session: Session, **kwargs):
        statement = select(cls).where(cls.listing_review_id == listing_review_id)
        review = session.exec(statement).first()
        if not review:
            raise HTTPException(status_code=404, detail="Listing not found")
        if review.userID != user_id:
            raise HTTPException(status_code=403, detail="Permissions error")
        for key, value in kwargs.items():
            setattr(review, key, value)
        session.add(review)
        session.commit()
        session.refresh(review)

        return review

    @classmethod
    def delete(cls, listing_review_id: str, userID: str, session: Session):
        statement = select(cls).where(cls.listing_review_id == listing_review_id)
        review = session.exec(statement).first()

        if not review:
            raise HTTPException(status_code=400, detail="Invalid request")

        if review.userID != userID:
            raise HTTPException(status_code=403, detail="Permissions error")

        session.delete(review)
        session.commit()

        return {"message": "Listing deleted successfully"}

    @classmethod
    def get_by_id(cls, session: Session, listing_review_id: str):
        statement = select(cls).where(cls.listing_review_id == listing_review_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()

    @classmethod
    def get_reviewer_name(cls, userID: str, session: Session):
        statement = select(User.name).where(User.userID == userID)
        return session.exec(statement).first()


class MessageBase(SQLModel):
    message_id: str = Field(default=None, primary_key=True)
    sender_id: str = Field(foreign_key="user.userID", index=True)
    receiver_id: str = Field(index=True)
    listing_id: str = Field(foreign_key="listing.listingID", index=True)
    content: str | None = None
    sent_at: datetime | None = Field(index=True)


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
