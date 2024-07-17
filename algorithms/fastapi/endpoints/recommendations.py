from fastapi import APIRouter, Query, Header, HTTPException, Depends
from typing import List
from util.schemas import ListingSummary, ErrorMessage
# import base64
# import json
from db.deps import get_db
from sqlalchemy.orm import Session
from db.models import DB_User, DB_Listing, DB_Interaction

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from util.elasticsearch_wrapper import ElasticsearchWrapper
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.get("/recommendations", response_model=List[ListingSummary], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def recommendations(page: int = Query(1),
                          limit: int = Query(20),
                          authorization: str = Header(...),
                          db: Session = Depends(get_db)):
   
    # SQL query logic here to fetch recommendations, I think sqlalchemy can be used to query the database
        # Requirements
        # - provides suggestion results for 'item' 
        #      - core (15) based on users' click/view on item listing
        #      - additional (15) based on user reviews, search reuslts, purchase history

    # TODO: get userID of the user who sent the request
    # try:
    #     # Assuming the token is a Bearer token
    #     token = authorization.split(" ")[1]  # Split the header to get the token part
    #     payload_base64 = token.split('.')[1]  # Get the payload part of the token
    #     payload_bytes = base64.urlsafe_b64decode(payload_base64 + '==')  # Decode Base64
    #     payload = json.loads(payload_bytes)  # Convert JSON string to dictionary
    #     user_id = payload['user_id']  # Extract user_id from the token payload
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Invalid token")

    # temp userID - without real token auth
    user_id = authorization if authorization in ["2", "3", "4", "5", "6", "7", "8", "9", "10"] else "1"

    # Check if the user_id exists in the database
    user_exists = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if not user_exists:
        raise HTTPException(status_code=404, detail="User ID not found")

    # Get the size of the item embeddings from the elastic search db
    try:
        first_entry = es.search(index="listings_index", size=1)['hits']['hits'][0]
        embedding_size = len(first_entry['_source']['embedding'])
    except Exception as e:
        raise HTTPException(status_code=404, detail="No embeddings found")

    # Create the user vector using all listings the user interacted with 
    user_vector = np.zeros(embedding_size)
    interactions = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.interaction_count > 0).all()
    for interaction in interactions:
        listing_id = interaction.listing_id
        interaction_count = interaction.interaction_count
        try:
            response = es.get(index="listings_index", id=listing_id)
            listing_embedding = np.array(response['_source']['embedding'])
            user_vector += interaction_count * listing_embedding
        except Exception as e:
            print(f"Error fetching embedding for listing {listing_id}: {e}")


    # Get all embeddings directly from Elasticsearch and compute cosine similarity with the user vector
    es_response = es.search(index="listings_index", body={"size": 10000, "query": {"match_all": {}}})
    similarities = []
    for hit in es_response['hits']['hits']:
        listing_id = hit['_id']
        listing_embedding = np.array(hit['_source']['embedding'])
        if listing_embedding is not None:
            similarity = cosine_similarity([user_vector], [listing_embedding])[0][0]
            similarities.append((listing_id, similarity))
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_listing_ids = [listing_id for listing_id, _ in similarities[:limit]]
    # Fetch the listing details from the database for the top listings
    recommendations = db.query(DB_Listing).filter(DB_Listing.listing_id.in_(top_listing_ids)).all()

    # Convert the top recommendations to the required format
    formatted_recommendations = []
    for listing in recommendations: 

        recommendation = {}
        recommendation["listingID"] = str(listing.listing_id) 

        es_listing = es.get(index="listings_index", id=listing.listing_id)
        recommendation["title"] = es_listing['_source']['title']
        recommendation["price"] = es_listing['_source']['price']
        recommendation["dateCreated"] = "2024-05-23T15:30:00Z" # TODO: add a way to get correct date

        #recommendation["sellerID"] =
        #recommendation["sellerName"] = 
        #recommendation["description"] = es_listing['_source'].get('description', None) # optional
        #recommendation["imageUrl"] = 
        
        formatted_recommendations.append(recommendation)


    # limit the number of recommendations to the limit
    final_recommendations = formatted_recommendations[:limit]

    return final_recommendations


