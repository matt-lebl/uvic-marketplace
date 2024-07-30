from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class Image(BaseModel):
    url: str


class ReviewSchema(BaseModel):
    listing_review_id: str | None = Field(None, example='1')
    reviewerName: str = Field(..., example='John Doe')
    stars: int | None = Field(None, example=5)
    comment: str | None = Field(
        None,
        example='Great seller, the item was exactly as described and in perfect condition.',
    )
    userID: str | None = Field(None, example='1')
    listingID: str = Field(..., example='A23F29039B23')
    dateCreated: datetime | None = Field(None, example='2024-05-23T15:30:00Z')
    dateModified: datetime | None = Field(None, example='2024-05-23T15:30:00Z')


class NewReview(BaseModel):
    stars: int = Field(..., example=5)
    comment: str | None = Field(
        None,
        example='Great seller, the item was exactly as described and in perfect condition.',
    )
    listingID: str = Field(..., example='1')


class UserProfile(BaseModel):
    userID: str | None = Field(None, example='A12334B345')
    username: str | None = Field(None, example='hubert123')
    name: str | None = Field(None, example='Bartholomew Hubert')
    bio: str | None = Field(None, example='I love stuff')
    profilePictureUrl: str | None = Field(
        None, example='https://example.com/image.png'
    )


class ListingSchema(BaseModel):
    listingID: str | None = Field(None, example='A23F29039B23')
    seller_profile: UserProfile | None = None
    title: str = Field(..., example='Used Calculus Textbook')
    description: str | None = Field(
        None, example='No wear and tear, drop-off available.'
    )
    price: float = Field(..., example=50.0)
    location: Location | None = None
    status: ItemStatus
    dateCreated: datetime | None = Field(None, example='2024-05-23T15:30:00Z')
    dateModified: datetime | None = Field(None, example='2024-05-23T15:30:00Z')
    reviews: list[ReviewSchema] | None = None
    images: list[Image] | None = None
    distance: float | None = Field(None, example=4.2)
    charityId: str | None = Field(None, example='1')


class NewListingBaseModel(BaseModel):
    title: str = Field(..., example='Used Calculus Textbook')
    description: str | None = Field(
        None, example='No wear and tear, drop-off available.'
    )
    price: float = Field(..., example=50.0)
    location: Location
    images: list[Image] | None = None
    markedForCharity: bool | None = Field(None, example=False)


class NewListing(BaseModel):
    """
    The NewListing schema is used when creating a new listing.
    """

    listing: NewListingBaseModel = Field(None, description="TODO", example="TODO")


class UpdateListing(NewListing):
    """
    The UpdateListing schema is used when updating a listing.
    """

    status: str = Field(None, description="TODO", example="TODO")


class ListingSummary(BaseModel):
    listingID: str = Field(..., example='A23F29039B23')
    sellerID: str | None = Field(None, example='A23F29039B23')
    sellerName: str | None = Field(None, example='A23F29039B23')
    title: str = Field(..., example='Used Calculus Textbook')
    description: str | None = Field(
        None, example='No wear and tear, drop-off available.'
    )
    price: float = Field(..., example=50.0)
    dateCreated: datetime = Field(..., example='2024-05-23T15:30:00Z')
    imageUrl: str | None = Field(None, example='image URL for first Image')
    charityID: str | None = Field(None, example='1')


class LoginRequest(BaseModel):
    email: str = Field(..., example='hubert@gmail.com')
    password: str = Field(..., example='securepassword123')
    totp_code: str = Field(..., example='123456')


class NewUser(BaseModel):
    userID: str | None = Field(None, example='A12334B345')
    username: str | None = Field(None, example='hubert123')
    name: str | None = Field(None, example='Bartholomew Hubert')
    bio: str | None = Field(
        None, example="I wish my parents didn't name me Bartholomew Hubert"
    )
    profileUrl: str | None = Field(None, example='https://example.com/image.png')
    email: str = Field(..., example='A23434B090934')
    totp_secret: str | None = Field(None, example='60b725f10c9c85c70d97880dfe8191b3')


class NewUserReq(BaseModel):
    username: str = Field(..., example='hubert123')
    name: str = Field(..., example='Bartholomew Hubert')
    email: str = Field(..., example='A23434B090934')
    password: str = Field(..., example='securepassword123')
    totp_secret: str
    validation_code: str


class UpdateUser(BaseModel):
    username: str = Field(..., example='hubert123')
    name: str = Field(..., example='Bartholomew Hubert')
    bio: str = Field(..., example='I love stuff')
    profilePictureUrl: str = Field(..., example='https://example.com/image.png')
    ignoreCharityListings: bool | None = Field(None, example=False)


class UserSchema(BaseModel):
    userID: str | None = Field(None, example='A12334B345')
    username: str | None = Field(None, example='hubert123')
    name: str | None = Field(None, example='Bartholomew Hubert')
    bio: str | None = Field(
        None, example="I wish my parents didn't name me Bartholomew Hubert"
    )
    profileUrl: str | None = Field(None, example='https://example.com/image.png')
    email: str = Field(..., example='A23434B090934')
    ignoreCharityListings: bool | None = Field(None, example=False)
    totp_secret: str


class Search(BaseModel):
    searchTerm: str | None = Field(None, example='athletic shorts')
    searchID: str | None = Field(None, example='A12334B345')


class SearchHistory(BaseModel):
    searches: list[Search] | None = None


class Location(BaseModel):
    latitude: float | None = Field(None, example=34.23551)
    longitude: float | None = Field(None, example=-104.54451)


class ItemStatus(Enum):
    AVAILABLE = 'AVAILABLE'
    SOLD = 'SOLD'


class ItemSort(Enum):
    RELEVANCE = 'RELEVANCE'
    PRICE_ASC = 'PRICE_ASC'
    PRICE_DESC = 'PRICE_DESC'
    LISTED_TIME_ASC = 'LISTED_TIME_ASC'
    LISTED_TIME_DESC = 'LISTED_TIME_DESC'
    DISTANCE_ASC = 'DISTANCE_ASC'
    DISTANCE_DESC = 'DISTANCE_DESC'


class UserPreferencesPayload(BaseModel):
    itemID: str | None = Field(None, example='B2309342A23')


class MessageSchema(BaseModel):
    sender_id: str | None = Field(
        None, description='ID of the sender', example='A23434B090934'
    )
    receiver_id: str | None = Field(
        None, description='ID of the receiver', example='A23434B090936'
    )
    listing_id: str | None = Field(
        None, description='ID of the listing', example='L23434B090934'
    )
    content: str | None = Field(
        None,
        description='Content of the message',
        example='Hello, is this still available?',
    )
    sent_at: int | None = Field(
        None,
        description='Unix timestamp of when the message was sent',
        example=1625247600,
    )


class MessageParticipant(BaseModel):
    user_id: str | None = Field(
        None, description='ID of the user', example='A23434B090934'
    )
    name: str | None = Field(
        None, description='Display Name of the user', example='John Doe'
    )
    profilePicture: str | None = Field(None, example='https://example.com/image.png')


class MessageThread(BaseModel):
    listing_id: str | None = Field(
        None, description='ID of the listing', example='L23434B090934'
    )
    other_participant: MessageParticipant | None = None
    last_message: MessageSchema | None = None


class SendMessage(BaseModel):
    receiver_id: str | None = Field(
        None, description='ID of the receiver', example='A23434B090936'
    )
    listing_id: str | None = Field(
        None, description='ID of the listing', example='L23434B090934'
    )
    content: str | None = Field(
        None,
        description='Content of the message',
        example='Hello, is this still available?',
    )


class Organization(BaseModel):
    name: str | None = Field(None, description='Name of the organization')
    logoUrl: str | None = Field(None, description="URL of the organization's logo")
    donated: float | None = Field(
        None, description='Amount the organization has donated'
    )
    receiving: bool | None = Field(
        None, description='Indicates if the organization is receiving donations'
    )


class Charity(BaseModel):
    id: str | None = Field(None, description='Unique identifier for the charity')
    name: str | None = Field(None, description='Name of the charity')
    description: str | None = Field(None, description='Description of the charity')
    startDate: datetime | None = Field(
        None, description='Start date of the charity event'
    )
    endDate: datetime | None = Field(
        None, description='End date of the charity event'
    )
    imageUrl: str | None = Field(None, description="URL of the charity's image")
    organizations: list[Organization] | None = Field(
        None, description='list of organizations associated with the charity'
    )


class CharityRequest(BaseModel):
    name: str | None = Field(None, description='Name of the charity')
    description: str | None = Field(None, description='Description of the charity')
    startDate: datetime | None = Field(
        None, description='Start date of the charity event'
    )
    endDate: datetime | None = Field(
        None, description='End date of the charity event'
    )
    imageUrl: str | None = Field(None, description="URL of the charity's image")
    organizations: list[Organization] | None = Field(
        None, description='list of organizations associated with the charity'
    )


class CharityWithFundsAndListings(Charity):
    funds: float | None = Field(None, description='Funds raised for the charity')
    listingsCount: float | None = Field(
        None, description='Number of listings associated with the charity'
    )


class InvalidEmailNotification(BaseModel):
    email: str
    emailNotVerified: bool


class ValidationRequest(BaseModel):
    code: str


class PasswordResetRequest(BaseModel):
    code: str
    email: str
