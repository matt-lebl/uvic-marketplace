
# # TODO: Ask Algos what the heck they were doing here and if we need to as well. 
# from pydantic import BaseModel, Field
# from typing import Optional, List
# from enum import Enum

# class ItemStatus(str, Enum):
#     """Enum for item status."""
#     ACTIVE = 'active'
#     INACTIVE = 'inactive'
#     SOLD = 'sold'

# class ItemSort(str, Enum):
#     """Enum for sorting items."""
#     PRICE_ASC = 'price_asc'
#     PRICE_DESC = 'price_desc'
#     NEWEST = 'newest'
#     OLDEST = 'oldest'

# class Listing(BaseModel):
#     """Schema for listing summary."""
#     id: int
#     title: str
#     description: Optional[str] = None
#     price: float
#     #status: ItemStatus
#     location: str

# class ErrorMessage(BaseModel):
#     """Schema for error messages."""
#     message: str
#     details: Optional[str] = None