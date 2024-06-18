from fastapi import APIRouter, Body, Header, HTTPException, status, Depends
from typing import Dict, Optional
from ...schemas import Listing, ErrorMessage
from sqlalchemy.orm import Session
from app.db.models import DB_Listing
from app.api.deps import get_db
from .embedding import generate_embedding
from ...elasticsearch_wrapper import ElasticsearchWrapper
from sqlalchemy.exc import SQLAlchemyError

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.post("/listing", response_model=Listing, responses={201: {"model": Listing}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_listing(data: Dict = Body(...), authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    
    print(data)
    # Save the listing to Elasticsearch
    listing = data['listing']

    # Generate embedding for the listing
    embedding = generate_embedding(listing['description']) 
    listing['embedding'] = embedding

    response = es.index(index="listings_index", id=listing['listingID'], body=listing)
    print(f'Added/updated ES database: {response}')
    
    # Add the listing to postgres
    try:
        db_listing = DB_Listing(listing_name=listing['title'], elasticsearch_id=listing['listingID'])
        db.add(db_listing)
        db.commit()
        db.refresh(db_listing)
        print(f"DB listing id: {db_listing.listing_id}, ES listing id: {db_listing.elasticsearch_id}")
    except SQLAlchemyError as e:
        print("Error adding listing to postgres: ", e)
        db.rollback()
        return HTTPException(status_code=501, detail="Error adding listing to database")

    # Construct the response object by converting the dict back to a Pydantic model
    return listing



@router.delete("/listing/{listing_id}", responses={200: {"description": "Listing deleted successfully"}, 404: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=200)
async def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    # Delete from Elasticsearch
    try:
        es_response = es.delete(index="listings_index", id=listing_id)
        print(f"Deleted from ES: {es_response}")
    except Exception as e:
        print(f"Error deleting from Elasticsearch: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete listing from Elasticsearch")

    # Delete from PostgreSQL
    try:
        db_listing = db.query(DB_Listing).filter(DB_Listing.elasticsearch_id == listing_id).first()
        if db_listing:
            db.delete(db_listing)
            db.commit()
            print(f"Deleted from DB: Listing ID {listing_id}")
        else:
            raise HTTPException(status_code=404, detail="Listing not found in database")
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error deleting from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete listing from database")

    return {"message": "Listing deleted successfully"}