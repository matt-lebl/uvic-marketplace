from confluent_kafka import KafkaException 
from util.schemas import ItemStatusEnum
from sqlalchemy.orm import Session
from db.models import DB_Listing
from util.embedding import generate_embedding
from util.elasticsearch_wrapper import ElasticsearchWrapper
from sqlalchemy.exc import SQLAlchemyError

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

def create_listing(data: dict, db: Session):
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

    # Format seller for Elasticsearch
    listing_data['sellerID'] = listing_data['seller_profile']['userID']
    listing_data['sellerName'] = listing_data['seller_profile']['name']

    # Format charityID for Elasticsearch
    if 'charityId' in listing_data:
        listing_data['charityID'] = str(listing_data['charityId'])

    if 'images' in listing_data and len(listing_data['images']) > 0:
        listing_data['imageUrl'] = listing_data['images'][0]['url']

    listing_data["status"] = listing_data.get("status", ItemStatusEnum.AVAILABLE).value

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
        # Check if the record already exists
        existing_listing = db.query(DB_Listing).filter(DB_Listing.elasticsearch_id == listing_data['listingID']).first()
        
        if existing_listing:
            # Update the existing record
            existing_listing.listing_name = listing_data['title']
            print(f"Updated DB listing id: {existing_listing.listing_id}, ES listing id: {existing_listing.elasticsearch_id}")
        else:
            # Add a new record
            db_listing = DB_Listing(listing_id=listing_data['listingID'], listing_name=listing_data['title'], elasticsearch_id=listing_data['listingID'])
            db.add(db_listing)
            db.flush()  # Use flush to get the id before commit
            print(f"Added DB listing id: {db_listing.listing_id}, ES listing id: {db_listing.elasticsearch_id}")

        db.commit()
    except SQLAlchemyError as e:
        print("Error adding/updating listing to postgres: ", e)
        db.rollback()
        return HTTPException(status_code=501, detail="Error adding/updating listing to database")
    
    # Format listing into proper response 
    del listing_data['embedding']
    listing_data['status'] = ItemStatusEnum.AVAILABLE
    response = {"listing": listing_data}

    print("this is the response: ")
    print(response)

    return response

def delete_listing(data: dict, db: Session):
    listing_id = data["listingID"]
    # Delete from Elasticsearch
    try:
        es_response = es.delete(index="listings_index", id=listing_id)
        print(f"Deleted from ES: {es_response}")
    except Exception as e:
        print(f"Error deleting from Elasticsearch: {e}")
        raise KafkaException(e)

    # Delete from PostgreSQL
    try:
        db_listing = db.query(DB_Listing).filter(DB_Listing.elasticsearch_id == listing_id).first()
        if db_listing:
            db.delete(db_listing)
            db.commit()
            print(f"Deleted from DB: Listing ID {listing_id}")
        else:
            print("Listing not found in database")
            raise KafkaException()
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error deleting from database: {e}")
        raise KafkaException(e)

    return {"message": "Listing deleted successfully"}