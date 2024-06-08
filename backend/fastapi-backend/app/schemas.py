from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, EmailStr

class Review(BaseModel):
    listing_review_id: str = Field(
        ..., 
        description="Unique identifier for the review", 
        example="A23F29039B23"
    )
    reviewerName: str = Field(
        ..., 
        description="Name of the reviewer", 
        example="John Doe"
    )
    stars: int = Field(
        ..., 
        description="Star rating given by the reviewer, from 1 to 5", 
        example=5,
        ge=1, le=5
    )
    comment: str | None = Field(
        None, 
        description="Review comment", 
        example="Great seller, the item was exactly as described and in perfect condition."
    )
    userID: str | None = Field(
        None, 
        description="Unique identifier for the user", 
        example="A23434B090934"
    )
    listingID: str = Field(
        ..., 
        description="Unique identifier for the listing", 
        example="A23F29039B23"
    )
    dateCreated: datetime | None = Field(
        None, 
        description="Date when the review was created", 
        example="2024-05-23T15:30:00Z"
    )
    dateModified: datetime | None = Field(
        None, 
        description="Date when the review was last modified", 
        example="2024-05-23T15:30:00Z"
    )

class Listing(BaseModel):
    listingID: str = Field(
        ..., 
        description="Unique identifier for the listing", 
        example="A23F29039B23"
    )
    title: str = Field(
        ..., 
        description="Title of the listing", 
        example="Vintage Chair"
    )
    description: str = Field(
        ..., 
        description="Detailed description of the listing", 
        example="A beautifully restored vintage chair from the 1950s."
    )
    price: float = Field(
        ..., 
        description="Price of the listing", 
        example=150.00,
        gt=0
    )
    dateCreated: datetime | None = Field(
        None, 
        description="Date when the listing was created", 
        example="2024-05-23T15:30:00Z"
    )
    dateModified: datetime | None = Field(
        None, 
        description="Date when the listing was last modified", 
        example="2024-05-23T15:30:00Z"
    )

class User(BaseModel):
    userID: str = Field(
        ..., 
        description="Unique identifier for the user", 
        example="A23434B090934"
    )
    username: str = Field(
        ..., 
        description="Username of the user", 
        example="john_doe"
    )
    email: EmailStr = Field(
        ..., 
        description="Email address of the user", 
        example="john.doe@example.com"
    )
    password: str = Field(
        ..., 
        description="Password of the user", 
        example="password123"
    ) # TODO: why do we need password ?
    dateJoined: datetime | None = Field(
        None, 
        description="Date when the user joined", 
        example="2024-05-23T15:30:00Z"
    )
    lastLogin: datetime | None = Field(
        None, 
        description="Date when the user last logged in", 
        example="2024-06-01T12:00:00Z"
    )

class ItemImage(BaseModel):
    imageID: str = Field(
        ..., 
        description="Unique identifier for the image", 
        example="IMG1234567890"
    )
    listingID: str = Field(
        ..., 
        description="Unique identifier for the listing the image is associated with", 
        example="A23F29039B23"
    )
    imageUrl: HttpUrl = Field(
        ..., 
        description="URL of the image", 
        example="http://example.com/images/item123.jpg"
    )
    dateUploaded: datetime | None = Field(
        None, 
        description="Date when the image was uploaded", 
        example="2024-05-23T15:30:00Z"
    )
    isPrimary: bool = Field(
        ..., 
        description="Indicates if the image is the primary image for the listing", 
        example=True
    )
