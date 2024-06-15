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
