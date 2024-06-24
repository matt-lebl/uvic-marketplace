import json
from sqlmodel import (
    SQLModel,
    Field,
    Relationship,
    Session,
    select,
    and_,
    func,
    Column,
    ARRAY,
    String,
    or_,
)
from datetime import datetime
from .schemas import ListingSchema, UserProfile
from fastapi import HTTPException


class UserBase(SQLModel):
    userID: str = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    name: str
    password: str
    bio: str | None = None
    profileUrl: str | None = None
    email: str = Field(unique=True, index=True)
    totp_secret: str | None
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
    def update(cls, userID: str, session: Session, **kwargs):
        statement = select(cls).where(cls.userID == userID)
        user = session.exec(statement).first()
        for key, value in kwargs.items():
            setattr(user, key, value)
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @classmethod
    def delete(cls, userID: str, session: Session):
        statement = select(cls).where(cls.userID == userID)
        user = session.exec(statement).first()

        if not user:
            raise HTTPException(status_code=400, detail="Invalid request")

        session.delete(user)
        session.commit()

        return {"message": "Listing deleted successfully"}

    @classmethod
    def get_by_id(cls, session: Session, userID: str):
        statement = select(cls).where(cls.userID == userID)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()

    @classmethod
    def login(cls, session: Session, **kwargs):
        email = kwargs["email"]
        password = kwargs["password"]
        statement = select(cls).where(
            and_(cls.email == email, cls.password == password)
        )
        return session.exec(statement).first()

    @classmethod
    def get_totp_secret(cls, userID: str, session: Session):
        statement = select(cls.totp_secret).where(cls.userID == userID)
        return session.exec(statement).first()

    @classmethod
    def add_totp_secret(cls, totp_secret: str, userID: str, session: Session):
        statement = select(cls).where(cls.userID == userID)
        sec = session.exec(statement).first()
        if not sec:
            raise HTTPException(status_code=400, detail="Invalid request")
        setattr(sec, "totp_secret", totp_secret)
        session.add(sec)
        session.commit()

        return {"message": "totp added successfully"}


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
    reviews: list["ListingReview"] | None = Relationship(
        back_populates="reviewed_listing"
    )

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
        review_statement = select(ListingReview).where(
            ListingReview.listingID == self.listingID
        )
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

    @classmethod
    def get_overview(cls, userID: str, session: Session):
        subquery = (
            session.query(
                Message.sender_id,
                Message.receiver_id,
                func.max(Message.sent_at).label("max_timestamp"),
            )
            .filter(or_(Message.sender_id == userID, Message.receiver_id == userID))
            .group_by(Message.sender_id, Message.receiver_id)
            .subquery()
        )

        query = (
            session.query(
                Message, User.userID.label("other_user_id"), User.name, User.profileUrl
            )
            .join(
                subquery,
                and_(
                    Message.sender_id == subquery.c.sender_id,
                    Message.receiver_id == subquery.c.receiver_id,
                    Message.sent_at == subquery.c.max_timestamp,
                ),
            )
            .join(
                User,
                or_(
                    and_(
                        User.userID == Message.sender_id, Message.receiver_id == userID
                    ),
                    and_(
                        User.userID == Message.receiver_id, Message.sender_id == userID
                    ),
                ),
            )
        )

        messages = query.all()

        overview = []
        for message, other_user_id, name, profileUrl in messages:
            overview.append(
                {
                    "listing_id": message.listing_id,
                    "other_participant": {
                        "user_id": other_user_id,
                        "name": name,
                        "profilePicture": profileUrl,
                    },
                    "last_message": message,
                }
            )
        return overview

    @classmethod
    def get_thread(
        cls, listing_id: str, receiver_id: str, user_id: str, session: Session
    ):
        statement = (
            select(cls)
            .where(
                and_(
                    cls.listing_id == listing_id,
                    or_(
                        and_(cls.sender_id == user_id, cls.receiver_id == receiver_id),
                        and_(cls.sender_id == receiver_id, cls.receiver_id == user_id),
                    ),
                )
            )
            .order_by(cls.sent_at)
        )

        return session.exec(statement)
