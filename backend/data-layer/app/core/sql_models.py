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
from core.schemas import ListingSchema, UserProfile, ItemStatus
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
    email_validated: bool = Field(default=True)
    validation_code: str
    ignoreCharityListings: bool | None


class User(UserBase, table=True):
    listings: list["Listing"] | None = Relationship(back_populates="seller")
    sent_messages: list["Message"] = Relationship(back_populates="sender",
                                                  sa_relationship_kwargs={"foreign_keys": "[Message.sender_id]"})
    received_messages: list["Message"] = Relationship(back_populates="receiver",
                                                      sa_relationship_kwargs={"foreign_keys": "[Message.receiver_id]"})

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
    def get_password(cls, session: Session, email: str):
        statement = select(cls.password).where(cls.email == email)
        return session.exec(statement).first()

    @classmethod
    def login(cls, session: Session, email: str):
        statement = select(cls).where(cls.email == email)
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

    @classmethod
    def get_validation_code(cls, email: str, session: Session):
        statement = select(cls.validation_code).where(cls.email == email)
        return session.exec(statement).first()

    @classmethod
    def validate_email(cls, validation_code: str, email: str, session: Session):
        statement = select(cls).where(and_(cls.email == email, cls.validation_code == validation_code))
        user = session.exec(statement).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or validation code")
        else:
            setattr(user, "email_validated", True)
            session.add(user)
            session.commit()
        return {"message": "Email validated successfully"}

    @classmethod
    def is_validated(cls, email: str, session: Session):
        statement = select(cls).where(cls.email == email)
        user = session.exec(statement).first()
        if not user:
            raise HTTPException(status_code=401, detail="User ID not found")
        else:
            return user.email_validated


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
    charityId: str | None = None


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
    def update(
        cls, seller_id: str, listingID: str, status: str, session: Session, **kwargs
    ):
        statement = select(cls).where(cls.listingID == listingID)
        listing = session.exec(statement).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if listing.sellerId != seller_id:
            raise HTTPException(status_code=403, detail="Permissions error")
        for key, value in kwargs.items():
            setattr(listing, key, value)
        if "status" in kwargs.keys():
            if kwargs["status"] == ItemStatus.SOLD and kwargs["charityId"]:
                charity = CharityTable.get_current_charity(session)
                price = kwargs["price"]
                OrganizationTable.update_donated(charity.organizations, price, session)
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
    def convert_to_db_object(cls, listing_data: dict, seller_id: str, session: Session):
        listing_data["sellerId"] = seller_id
        listing_data["latitude"] = float(listing_data["location"]["latitude"])
        listing_data["longitude"] = float(listing_data["location"]["longitude"])
        listing_data["images"] = json.dumps(listing_data["images"])
        if listing_data["markedForCharity"]:
            listing_data["charityId"] = CharityTable.get_current_charity_id(session)
        del listing_data["markedForCharity"]
        del listing_data["location"]
        return listing_data

    def convert_to_schema(self, session: Session, user_profile: dict = None):
        data = self.model_dump()
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
        user_profile = UserProfile(**user.model_dump())
        user_profile.userID = self.sellerId
        return user_profile.model_dump()

    def get_reviews(self, session: Session):
        review_statement = select(ListingReview).where(
            ListingReview.listingID == self.listingID
        )
        reviews = session.exec(review_statement).all()
        return [r.model_dump() for r in reviews]


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
    receiver_id: str = Field(foreign_key="user.userID", index=True)
    listing_id: str = Field(foreign_key="listing.listingID", index=True)
    content: str | None = None
    sent_at: int = Field(index=True)


class Message(MessageBase, table=True):
    sender: User | None = Relationship(back_populates="sent_messages",
                                       sa_relationship_kwargs={"foreign_keys": "[Message.sender_id]"})
    receiver: User | None = Relationship(back_populates="received_messages",
                                         sa_relationship_kwargs={"foreign_keys": "[Message.receiver_id]"})
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
            select(
                Message.sender_id,
                Message.receiver_id,
                func.max(Message.sent_at).label("max_timestamp"),
            )
            .filter(or_(Message.sender_id == userID, Message.receiver_id == userID))
            .group_by(Message.sender_id, Message.receiver_id)
            .subquery()
        )

        query = (
            select(
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

        messages = session.exec(query).all()

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


class OrganizationTable(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    donated: float = Field(default=0.0)
    receiving: bool = Field(default=False)

    @classmethod
    def create(cls, session: Session, **kwargs):
        organization = cls(**kwargs)
        session.add(organization)
        session.commit()
        session.refresh(organization)
        return organization

    @classmethod
    def get_by_id(cls, session: Session, org_id: str):
        statement = select(cls).where(cls.id == org_id)
        return session.exec(statement).first()

    @classmethod
    def update_donated(cls, orgs: list[str], amount: float, session: Session):
        statement = select(cls).where(and_(cls.id in orgs, cls.receiving))
        org = session.exec(statement).first()
        donated = org.donated + amount
        setattr(org, "donated", donated)
        session.add(org)
        session.commit()
        session.refresh(org)


class CharityTable(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    description: str
    startDate: datetime
    endDate: datetime
    imageUrl: str | None
    organizations: list[str] = Field(sa_column=Column(ARRAY(String)))

    @classmethod
    def create(cls, session: Session, **kwargs):
        charity = cls(**kwargs)
        session.add(charity)
        session.commit()
        session.refresh(charity)
        return charity

    @classmethod
    def get_by_id(cls, session: Session, charity_id: str):
        statement = select(cls).where(cls.id == charity_id)
        return session.exec(statement).first()

    @classmethod
    def get_all(cls, session: Session):
        statement = select(cls)
        return session.exec(statement).all()

    @classmethod
    def get_current_charity_id(cls, session: Session):
        now = datetime.now()
        statement = select(cls.id).where(and_(cls.startDate <= now, cls.endDate >= now))
        return session.exec(statement).first()

    @classmethod
    def get_current_charity(cls, session: Session):
        now = datetime.now()
        statement = select(cls).where(and_(cls.startDate <= now, cls.endDate >= now))
        return session.exec(statement).first()
