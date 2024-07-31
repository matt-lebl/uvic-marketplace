import uuid
from core.sql_models import Listing
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import NewListing, ListingSchema, UpdateListing
from datetime import datetime, UTC
import logging

from sqlmodel import Session

logging.basicConfig(format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/listing", tags=["listings"])


@router.post("/{seller_id}", response_model=ListingSchema)
def create_listing(
    seller_id: str, listing: NewListing, session: Session = Depends(get_session)
):
    listing_data = listing.model_dump()["listing"]
    listing_data = Listing.convert_to_db_object(listing_data, seller_id, session)
    listing_data["listingID"] = str(uuid.uuid4())
    listing_data["dateCreated"] = datetime.now(UTC).astimezone(UTC)
    listing_data["dateModified"] = listing_data["dateCreated"]
    new_listing = Listing.create(session=session, **listing_data)
    logger.info(f"New Listing Created{new_listing}")
    new_listing = new_listing.convert_to_schema(session)
    return new_listing


@router.patch("/{listingID}/{seller_id}", response_model=ListingSchema)
def update_listing(
    listingID: str,
    seller_id: str,
    listing: UpdateListing,
    session: Session = Depends(get_session),
):
    listing_data = Listing.convert_to_db_object(
        listing.listing.model_dump(), seller_id, session
    )
    status = listing.status
    listing_data["listingID"] = listingID
    listing_data["dateModified"] = datetime.now(UTC).astimezone()
    updated_listing = Listing.update(
        seller_id=seller_id, session=session, status=status, **listing_data
    )
    logger.info(f"Updated listing{updated_listing}")
    updated_listing = updated_listing.convert_to_schema(session)
    return updated_listing


@router.get("/user/{seller_id}", response_model=list[ListingSchema])
def get_user_listings(seller_id: str, session: Session = Depends(get_session)):
    listings = Listing.get_by_seller_id(session, seller_id)
    if len(listings) > 0:
        user_profile = listings[0].get_user_profile(session)
        return [
            listing.convert_to_schema(session, user_profile) for listing in listings
        ]
    return []


@router.get("/{listingID}", response_model=ListingSchema)
def get_listing(listingID: str, session: Session = Depends(get_session)):
    listing = Listing.get_by_id(session, listingID)
    logger.info(f"Listing requested{listingID}")
    if not listing:
        logger.error(f"Listing not found {listingID}")
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing.convert_to_schema(session)


@router.delete("/{listingID}/{seller_id}")
def delete_listing(
    listingID: str, seller_id: str, session: Session = Depends(get_session)
):
    logger.info(f"Listing deleted{listingID}")
    try:
        result = Listing.delete(listingID, seller_id, session)
        return result
    except Exception as e:
        logger.error(str(e))
        raise e


# Deprecated
# @router.get("/", response_model=list[Listing])
# def get_all_listings(session: Session = Depends(get_session)):
#     listings = Listing.get_all(session)
#     return Listing.get_all(session)
