import uuid
from core.sql_models import ListingReview
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import NewReview, ReviewSchema
from datetime import datetime, UTC
import logging

from sqlmodel import Session

logging.basicConfig(format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/review",
    tags=["review"]
)


@router.post("/{userID}", response_model=ListingReview)
def create_review(userID: str, review: NewReview, session: Session = Depends(get_session)):
    review_data = review.model_dump()
    review_data["listing_review_id"] = str(uuid.uuid4())
    review_data["dateCreated"] = datetime.now(UTC).astimezone(UTC)
    review_data["dateModified"] = review_data["dateCreated"]
    review_data["userID"] = userID
    logger.info(f"review creation {review}")
    try:
        new_review = ListingReview.create(session=session, **review_data)
        return new_review
    except Exception as e:
        logger.error(str(e))
        raise e


@router.get("/{listing_review_id}", response_model=ReviewSchema)
def get_review(listing_review_id: str, session: Session = Depends(get_session)):
    review = ListingReview.get_by_id(session, listing_review_id)
    logger.info(f"listing requested: {listing_review_id}")
    if not review:
        logger.error(f"listing not found {listing_review_id}")
        raise HTTPException(status_code=404, detail="Listing review not found")
    return review


@router.patch("/{listing_review_id}/{userID}", response_model=ListingReview)
def update_review(listing_review_id: str, userID: str, review: NewReview, session: Session = Depends(get_session)):
    review_data = review.model_dump()
    review_data["listing_review_id"] = listing_review_id
    review_data["dateModified"] = datetime.now(UTC).astimezone(UTC)
    review_data["userID"] = userID
    logger.info(f"listing updated: {listing_review_id}")
    updated_review = ListingReview.update(user_id=userID, session=session, **review_data)
    return updated_review


@router.delete("/{listing_review_id}/{userID}")
def delete_review(listing_review_id: str, userID: str, session: Session = Depends(get_session)):
    logger.info(f"listing delete: {listing_review_id}")
    try:
        return ListingReview.delete(listing_review_id, userID, session)
    except Exception as e:
        logger.error(str(e))
        raise e

