import uuid
from .sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session
from .schemas import NewListing, ListingSchema
from datetime import datetime

router = APIRouter(
    prefix="/listing",
    tags=["listings"]
)


@router.post("/{seller_id}")
def create_listing(seller_id: str, listing: NewListing, session: Session = Depends(get_session)):
    listing_data = listing.dict()
    listing_data = Listing.convert_to_db_object(listing_data, seller_id)
    listing_data["listingID"] = str(uuid.uuid4())
    listing_data["dateCreated"] = datetime.now()
    listing_data["dateModified"] = listing_data["dateCreated"]
    new_listing = Listing.create(session=session, **listing_data)
    return new_listing


@router.patch("/{listingID}/{seller_id}")
def update_listing(listingID: str, seller_id: str, listing: NewListing, session: Session = Depends(get_session)):
    listing_data = Listing.convert_to_db_object(listing.dict(), seller_id)
    listing_data["listingID"] = listingID
    listing_data["dateModified"] = datetime.now()
    updated_listing = Listing.update(seller_id=seller_id, session=session, **listing_data)
    return updated_listing


@router.get("/{listingID}", response_model=ListingSchema)
def get_listing(listingID: str, session: Session = Depends(get_session)):
    listing = Listing.get_by_id(session, listingID)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing.convert_to_schema(session)


@router.delete("/{listingID}/{seller_id}")
def delete_listing(listingID: str, seller_id: str, session: Session = Depends(get_session)):
    Listing.delete(listingID, seller_id, session)

# Deprecated
# @router.get("/", response_model=list[Listing])
# def get_all_listings(session: Session = Depends(get_session)):
#     listings = Listing.get_all(session)
#     return Listing.get_all(session)
