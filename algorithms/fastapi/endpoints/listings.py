from fastapi import APIRouter, Body, Header, HTTPException, status, Depends
from typing import Dict, Optional
from util.schemas import ListingResponse, ErrorMessage, ItemStatusEnum
from sqlalchemy.orm import Session
from db.models import DB_Listing
from db.deps import get_db
from util.embedding import generate_embedding
from util.elasticsearch_wrapper import ElasticsearchWrapper
from sqlalchemy.exc import SQLAlchemyError
import logging

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')
logger = logging.getLogger(__name__)
es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.post("/listing", response_model=ListingResponse, responses={201: {"model": ListingResponse}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_listing(data: Dict = Body(...), authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    
    logger.info(data)
    # Save the listing to Elasticsearch
    listing_data = data['listing']

    # Generate embedding for the listing
    embedding = generate_embedding(listing_data['title'] + ' ' + listing_data['description']) 
    listing_data['embedding'] = embedding

    # Format location for Elasticsearch
    listing_data['location'] = {
        "lat": listing_data['location']['latitude'],
        "lon": listing_data['location']['longitude']
    }

    # Format charityID for Elasticsearch
    if 'charityID' in listing_data:
        listing_data['charityID'] = str(listing_data['charityID'])

    # Add the listing to Elasticsearch
    response = es.index(index="listings_index", id=listing_data['listingID'], body=listing_data)
    logger.info(f'Added/updated ES database: {response}')

    # undo elasiticsearch Location formatting
    listing_data['location'] = {
        "latitude": listing_data['location']['lat'],
        "longitude": listing_data['location']['lon']
    }
    
    # Add the listing to postgres
    try:
        # Check if the record already exists
        existing_listing = db.query(DB_Listing).filter(DB_Listing.elasticsearch_id == listing_data['listingID']).first()
        
        if existing_listing:
            # Update the existing record
            existing_listing.listing_name = listing_data['title']
            logger.info(f"Updated DB listing id: {existing_listing.listing_id}, ES listing id: {existing_listing.elasticsearch_id}")
        else:
            # Add a new record
            db_listing = DB_Listing(listing_id=listing_data['listingID'], listing_name=listing_data['title'], elasticsearch_id=listing_data['listingID'])
            db.add(db_listing)
            db.flush()  # Use flush to get the id before commit
            logger.info(f"Added DB listing id: {db_listing.listing_id}, ES listing id: {db_listing.elasticsearch_id}")

        db.commit()
    except SQLAlchemyError as e:
        logger.error("Error adding/updating listing to postgres: ", e)
        db.rollback()
        return HTTPException(status_code=501, detail="Error adding/updating listing to database")
        
    # Format listing into proper response 
    del listing_data['embedding']
    listing_data['status'] = ItemStatusEnum.AVAILABLE
    response = {"listing": listing_data}

    return response



@router.delete("/listing/{listing_id}", responses={200: {"description": "Listing deleted successfully"}, 404: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=200)
async def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    # Delete from Elasticsearch
    try:
        es_response = es.delete(index="listings_index", id=listing_id)
        logger.info(f"Deleted from ES: {es_response}")
    except Exception as e:
        logger.error(f"Error deleting from Elasticsearch: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete listing from Elasticsearch")

    # Delete from PostgreSQL
    try:
        db_listing = db.query(DB_Listing).filter(DB_Listing.elasticsearch_id == listing_id).first()
        if db_listing:
            db.delete(db_listing)
            db.commit()
            logger.info(f"Deleted from DB: Listing ID {listing_id}")
        else:
            raise HTTPException(status_code=404, detail="Listing not found in database")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error deleting from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete listing from database")

    return {"message": "Listing deleted successfully"}