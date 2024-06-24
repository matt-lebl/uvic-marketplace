import uuid
from .sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session
from .schemas import NewReview, ReviewSchema
from datetime import datetime

router = APIRouter(
    prefix="/review",
    tags=["review"]
)


@router.post("/{userID}", response_model=ListingReview)
def create_review(userID: str, review: NewReview, session: Session = Depends(get_session)):
    review_data = review.model_dump()
    review_data["listing_review_id"] = str(uuid.uuid4())
    review_data["dateCreated"] = datetime.now()
    review_data["dateModified"] = review_data["dateCreated"]
    review_data["userID"] = userID
    new_review = ListingReview.create(session=session, **review_data)
    return new_review


@router.get("/{listing_review_id}", response_model=ReviewSchema)
def get_review(listing_review_id: str, session: Session = Depends(get_session)):
    review = ListingReview.get_by_id(session, listing_review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Listing review not found")
    return review


@router.patch("/{listing_review_id}/{userID}", response_model=ListingReview)
def update_review(listing_review_id: str, userID: str, review: NewReview, session: Session = Depends(get_session)):
    review_data = review.model_dump()
    review_data["listing_review_id"] = listing_review_id
    review_data["dateModified"] = datetime.now()
    review_data["userID"] = userID
    updated_review = ListingReview.update(user_id=userID, session=session, **review_data)
    return updated_review


@router.delete("/{listing_review_id}/{userID}")
def delete_review(listing_review_id: str, userID: str, session: Session = Depends(get_session)):
    return ListingReview.delete(listing_review_id, userID, session)

# Deprecated
# @router.get("/", response_model=list[ListingReview])
# def get_all_listing(session: Session = Depends(get_session)):
#     return ListingReview.get_all(session)
