from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, EmailStr

# TODO: check schemas and add additional validation, for example ge=1, le=5 limits
# stars to be a value between 1 and 5 inclusive
# TODO: add Annotated to improve type hints
# https://docs.pydantic.dev/1.10/usage/schema/


class UserProfile(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class UpdateUser(BaseModel):
    """
    TODO: add description
    """

    username: str = Field(None, description="Username of the user", example="john_doe")
    name: str = Field(None, description="Name of the user", example="John Doe")
    bio: str = Field(None, description="TODO", example="TODO")
    profilePictureUrl: str = Field(
        None,
        description="URL of the user's profile picture",
        example="https://image.com/2202",
    )


class ResetPassword(BaseModel):
    """
    The ResetPassword schema is used when resetting a user's password.
    """

    email: str = Field(
        None, description="Email address of the user", example="dd@uvic.ca"
    )


class EmailModel(BaseModel):
    """
    The Email schema is used when sending an email.
    """

    email: str = Field(
        None, description="Email address of the user", example="dd@uvic.ca"
    )


class Location(BaseModel):
    """
    TODO: add description
    """

    latitude: float
    longitude: float


# TODO: validate url
class Image(BaseModel):
    """
    TODO: add description
    """

    url: str = Field(
        None, description="URL of the Image", example="https://image.com/2202"
    )


class Review(BaseModel):
    """
    TODO: add description
    """

    # TODO: this is not a required field based on http://market.lebl.ca/openapi/ check if this can be optional
    listing_review_id: str = Field(
        None, description="Unique identifier for the review", example="A23F29039B23"
    )
    reviewerName: str = Field(
        ..., description="Name of the reviewer", example="John Doe"
    )
    stars: int = Field(
        None,
        description="Star rating given by the reviewer, from 1 to 5",
        example=5,
        ge=1,
        le=5,
    )
    comment: str | None = Field(
        None,
        description="Review comment",
        example="Great seller, the item was exactly as described and in perfect condition.",
    )
    userID: str | None = Field(
        None, description="Unique identifier for the user", example="A23434B090934"
    )
    listingID: str = Field(
        ..., description="Unique identifier for the listing", example="A23F29039B23"
    )
    dateCreated: datetime | None = Field(
        None,
        description="Date when the review was created",
        example="2024-05-23T15:30:00Z",
    )
    dateModified: datetime | None = Field(
        None,
        description="Date when the review was last modified",
        example="2024-05-23T15:30:00Z",
    )


class NewReview(BaseModel):
    """
    TODO: add description
    """

    # TODO: this is not a required field based on http://market.lebl.ca/openapi/ check if this can be optional
    listing_review_id: str = Field(
        None, description="Unique identifier for the review", example="A23F29039B23"
    )
    stars: int = Field(
        ...,
        description="Star rating given by the reviewer, from 1 to 5",
        example=5,
        ge=1,
        le=5,
    )
    comment: str | None = Field(
        None,
        description="Review comment",
        example="Great seller, the item was exactly as described and in perfect condition.",
    )
    listingID: str = Field(
        ..., description="Unique identifier for the listing", example="A23F29039B23"
    )


class Listing(BaseModel):
    """
    TODO: add description
    """

    listingID: str = Field(
        None, description="Unique identifier for the listing", example="A23F29039B23"
    )
    seller_profile: UserProfile = Field(
        None, description="User profile of the seller", example="TODO"
    )
    title: str = Field(..., description="Title of the listing", example="Vintage Chair")
    description: str = Field(
        ...,
        description="Detailed description of the listing",
        example="A beautifully restored vintage chair from the 1950s.",
    )
    price: float = Field(..., description="Price of the listing", example=150.00, gt=0)
    location: Location = Field(None, description="TODO", example="TODO")
    dateCreated: datetime | None = Field(
        None,
        description="Date when the listing was created",
        example="2024-05-23T15:30:00Z",
    )
    dateModified: datetime | None = Field(
        None,
        description="Date when the listing was last modified",
        example="2024-05-23T15:30:00Z",
    )
    reviews: list[Review] = Field(None, description="TODO", example="TODO")
    images: list[Image] = Field(None, description="TODO", example="TODO")


class NewListingBaseModel(BaseModel):
    title: str = Field(..., description="Title of the listing", example="Vintage Chair")
    description: str = Field(
        ...,
        description="Detailed description of the listing",
        example="A beautifully restored vintage chair from the 1950s.",
    )
    price: float = Field(..., description="Price of the listing", example=150.00, gt=0)
    location: Location = Field(None, description="TODO", example="TODO")
    images: list[Image] = Field(None, description="TODO", example="TODO")


class NewListing(BaseModel):
    """
    The NewListing schema is used when creating a new listing.
    """

    listing: NewListingBaseModel = Field(None, description="TODO", example="TODO")


class ListingSummary(BaseModel):
    """
    TODO: add description
    """

    listingID: str = Field(
        ..., description="Unique identifier for the listing", example="A23F29039B23"
    )
    sellerID: str = Field(
        ..., description="Unique identifier for the seller", example="A23F29039B23"
    )
    seller_Name: str = Field(None, description="TODO", example="TODO")
    title: str = Field(..., description="Title of the listing", example="Vintage Chair")
    description: str = Field(
        None,
        description="Detailed description of the listing",
        example="A beautifully restored vintage chair from the 1950s.",
    )
    price: float = Field(..., description="Price of the listing", example=150.00, gt=0)
    dateCreated: datetime = Field(
        ...,
        description="Date when the listing was created",
        example="2024-05-23T15:30:00Z",
    )
    # TODO: validate url
    imageUrl: str = Field(None, description="TODO", examples="TODO")


class LoginRequest(BaseModel):
    """
    The LoginRequest schema is used when logging in a user.
    """

    email: str = Field(
        None, description="Email address of the user", example="hubert@gmail.com"
    )
    password: str = Field(
        None, description="Hashed? password of the user", example="securepassword123"
    )
    totp_code: str = Field(
        None,
        description="Temporary One Time Password(TOTP) from an MFA application",
        example="123456",
    )


class NewUser(BaseModel):
    """
    The NewUser schema is used when signing up a new user.
    """

    username: str = Field(None, description="Username of the user", example="john_doe")
    name: str = Field(None, description="Name of the user", example="John Doe")
    email: EmailStr = Field(
        None, description="Email address of the user", example="Jdoe@uvic.ca"
    )
    password: str = Field(
        None, description="Hashed? password of the user", example="securepassword123"
    )


class User(BaseModel):
    userID: str = Field(
        None, description="Unique identifier for the user", example="A23434B090934"
    )
    username: str = Field(None, description="Username of the user", example="john_doe")
    name: str = Field(None, description="TODO", example="TODO")
    bio: str = Field(None, description="TODO", example="TODO")
    # TODO: validate url
    profileUrl: str = Field(None, description="TODO", example="TODO")
    # TODO: validate email
    email: str = Field(
        None, description="Email address of the user", example="john.doe@example.com"
    )
    totp_secret: str = Field(None, description="TODO", example="TODO")


class Search(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class SearchHistory(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class ItemStatus(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class ItemSort(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class UserPreferencesPayload(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class MessageThread(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class Message(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class SendMessage(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass


class MessageParticipant(BaseModel):
    """
    TODO: add description
    """

    # TODO
    pass
