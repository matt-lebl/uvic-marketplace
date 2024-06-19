import uuid
from sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session

router = APIRouter(
    prefix="/listings",
    tags=["listings", "reviews", "ratings"]
)


@router.post("/", response_model=Listing)
def create_listing(listing: ListingBase, session: Session = Depends(get_session)):
    listing_data = listing.dict()
    listing_data["listing_id"] = str(uuid.uuid4())
    new_listing = Listing.create(session=session, **listing_data)
    return new_listing


@router.post("/ratings/", response_model=ListingRating)
def create_listing_rating(rating: ListingRating, session: Session = Depends(get_session)):
    rating_data = rating.dict()
    rating_data["listing_rating_id"] = str(uuid.uuid4())
    new_rating = ListingRating.create(session=session, **rating_data)
    return new_rating


@router.post("/reviews/", response_model=ListingReview)
def create_listing_review(review: ListingReview, session: Session = Depends(get_session)):
    review_data = review.dict()
    review_data["listing_review_id"] = str(uuid.uuid4())
    new_review = ListingReview.create(session=session, **review_data)
    return new_review


@router.get("/", response_model=list[Listing])
def get_all_listings(session: Session = Depends(get_session)):
    return Listing.get_all(session)


@router.get("/ratings/", response_model=list[ListingRating])
def get_all_listing_ratings(session: Session = Depends(get_session)):
    return ListingRating.get_all(session)


@router.get("/reviews/", response_model=list[ListingReview])
def get_all_listing_reviews(session: Session = Depends(get_session)):
    return ListingReview.get_all(session)


@router.get("/{listing_id}", response_model=Listing)
def get_listing(listing_id: str, session: Session = Depends(get_session)):
    listing = Listing.get_by_id(session, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.get("/ratings/{listing_rating_id}", response_model=ListingRating)
def get_listing_rating(listing_rating_id: str, session: Session = Depends(get_session)):
    rating = ListingRating.get_by_id(session, listing_rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Listing rating not found")
    return rating


@router.get("/reviews/{listing_review_id}", response_model=ListingReview)
def get_listing_review(listing_review_id: str, session: Session = Depends(get_session)):
    review = ListingReview.get_by_id(session, listing_review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Listing review not found")
    return review
