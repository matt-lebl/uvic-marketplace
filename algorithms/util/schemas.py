from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from enum import Enum


# Enum classes for sorting and status
class ItemSortEnum(str, Enum):
    """Enum for sorting items."""
    RELEVANCE = 'RELEVANCE'
    PRICE_ASC = 'PRICE_ASC'
    PRICE_DESC = 'PRICE_DESC'
    LISTED_TIME_ASC = 'LISTED_TIME_ASC'
    LISTED_TIME_DESC = 'LISTED_TIME_DESC'
    DISTANCE_ASC = 'DISTANCE_ASC'
    DISTANCE_DESC = 'DISTANCE_DESC'

class ItemStatusEnum(str, Enum):
    """Enum for item status."""
    AVAILABLE = 'AVAILABLE'
    SOLD = 'SOLD'


# All search and recommendation revelant openAPI schemas

class UserProfile(BaseModel): # used in Listing
    """Schema for user profile."""
    userID: str = Field(..., example="A12334B345") # left as required... OpenAPI says opt
    username: Optional[str] = Field(None, example="hubert123")
    name: Optional[str] = Field(None, example="Bartholomew Hubert")
    bio: Optional[str] = Field(None, example="I love stuff")
    profilePictureUrl: Optional[HttpUrl] = Field(None, example="https://example.com/image.png")

class Location(BaseModel): # used in Listing
    """Schema for location."""
    latitude: float = Field(..., example=34.23551)
    longitude: float = Field(..., example=-104.54451)

class Image(BaseModel): # used in Listing
    """Schema for image."""
    url: HttpUrl = Field(..., example="https://example.com/image")

class Review(BaseModel): # used in Listing
    """Schema for review."""
    listing_review_id: Optional[str] = Field(None, example="A23F29039B23")
    reviewerName: str = Field(..., example="John Doe")
    stars: Optional[int] = Field(None, example=5)
    comment: Optional[str] = Field(None, example="Great seller, the item was exactly as described and in perfect condition.")
    userID: Optional[str] = Field(None, example="A23434B090934")
    listingID: str = Field(..., example="A23F29039B23")
    dateCreated: Optional[str] = Field(None, example="2024-05-23T15:30:00Z")
    dateModified: Optional[str] = Field(None, example="2024-05-23T15:30:00Z")

class Listing(BaseModel):
    """Schema for listing."""
    listingID: Optional[str] = Field(None, example="A23F29039B23") # OpenAPI doesnt say required...
    seller_profile: Optional[UserProfile] = None
    title: str = Field(..., example="Used Calculus Textbook")
    description: Optional[str] = Field(None, example="No wear and tear, drop-off available.")
    price: float = Field(..., example=50.00)
    location: Optional[Location] = None
    status: ItemStatusEnum
    dateCreated: Optional[str] = Field(None, example="2024-05-23T15:30:00Z")
    dateModified: Optional[str] = Field(None, example="2024-05-23T15:30:00Z")
    reviews: Optional[List[Review]] = None
    images: Optional[List[Image]] = None
    distance: Optional[float] = Field(None, example=4.2)

class ListingSummary(BaseModel):
    """Schema for listing summary."""
    listingID: str = Field(..., example="A23F29039B23")
    sellerID: Optional[str] = Field(None, example="A23F29039B23")
    sellerName: Optional[str] = Field(None, example="A23F29039B23")
    title: str = Field(..., example="Used Calculus Textbook")
    description: Optional[str] = Field(None, example="No wear and tear, drop-off available.")
    price: float = Field(..., example=50.00)
    dateCreated: str = Field(..., example="2024-05-23T15:30:00Z")
    imageUrl: Optional[HttpUrl] = Field(None, example="image URL for first Image")

class Search(BaseModel):
    """Schema for search."""
    searchTerm: str = Field(..., example="Used Calculus Textbook")
    searchID: str = Field(..., example="A23F29039B23")

# non openAPI defined schemas 
# but all meet requirements of openAPI responses
class ListingResponse(BaseModel):
    """Schema for listing response."""
    listing: Listing

class SearchResponse(BaseModel):
    """Schema for search response."""
    items: List[ListingSummary]
    totalItems: int

class ErrorMessage(BaseModel):
    """Schema for error messages."""
    error: str
    details: Optional[str] = None