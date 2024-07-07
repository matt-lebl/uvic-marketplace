from fastapi import HTTPException
from app.api.schemas import ItemStatusEnum
from sqlalchemy.orm import Session
from app.db.models import DB_Listing
from app.util.embedding import generate_embedding
from app.util.elasticsearch_wrapper import ElasticsearchWrapper
from sqlalchemy.exc import SQLAlchemyError

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

async def create_listing(data: dict, db: Session):
    print(data)
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

    # Add the listing to Elasticsearch
    response = es.index(index="listings_index", id=listing_data['listingID'], body=listing_data)
    print(f'Added/updated ES database: {response}')

    # undo elasiticsearch Location formatting
    listing_data['location'] = {
        "latitude": listing_data['location']['lat'],
        "longitude": listing_data['location']['lon']
    }
    
    # Add the listing to postgres
    try:
        db_listing = DB_Listing(listing_name=listing_data['title'], elasticsearch_id=listing_data['listingID'])
        db.add(db_listing)
        db.commit()
        db.refresh(db_listing)
        print(f"DB listing id: {db_listing.listing_id}, ES listing id: {db_listing.elasticsearch_id}")
    except SQLAlchemyError as e:
        print("Error adding listing to postgres: ", e)
        db.rollback()
        return HTTPException(status_code=501, detail="Error adding listing to database")
    
    # Format listing into proper response 
    del listing_data['embedding']
    listing_data['status'] = ItemStatusEnum.AVAILABLE
    response = {"listing": listing_data}

    print("this is the response: ")
    print(response)

    return response

async def delete_listing(data: dict, db: Session):
    listing_id = data["listingID"]
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