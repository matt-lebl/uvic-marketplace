
# TODO: Add actual schemas for the API 
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class ItemStatus(str, Enum):
    """Enum for item status."""
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    SOLD = 'sold'

class ItemSort(str, Enum):
    """Enum for sorting items."""
    PRICE_ASC = 'price_asc'
    PRICE_DESC = 'price_desc'
    NEWEST = 'newest'
    OLDEST = 'oldest'
    
class Location(BaseModel):
    lat: float
    lon: float

class Listing(BaseModel):
    """Schema for listing summary."""
    listingID: str
    title: str
    description: Optional[str] = None
    price: float
    #status: ItemStatus
    location: Location

class ErrorMessage(BaseModel):
    """Schema for error messages."""
    message: str
    details: Optional[str] = None