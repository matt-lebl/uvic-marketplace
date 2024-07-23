from fastapi import APIRouter, Header, HTTPException, Depends
from typing import List, Union
from util.schemas import ListingSummary, ErrorMessage
from db.deps import get_db
from sqlalchemy.orm import Session
from db.models import DB_User, DB_Listing, DB_Interaction

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from util.elasticsearch_wrapper import ElasticsearchWrapper
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from util.charity_item_view import should_view_charity_items

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.get("/recommendations", response_model=List[ListingSummary], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def recommendations(*,
                          page: int = 1,
                          limit: int = 20,
                          authUserID: Union[str, None] = None,
                          db: Session = Depends(get_db)):
    
    # Check if the user_id exists in the database
    user_exists = db.query(DB_User).filter(DB_User.user_id ==authUserID).first()
    if not user_exists:
        raise HTTPException(status_code=404, detail="User ID not found")

    embedding_size = 768

    # Create the user vector using all listings the user interacted with 
    user_vector = np.zeros(embedding_size)
    interactions = db.query(DB_Interaction).filter(DB_Interaction.user_id ==authUserID, DB_Interaction.interaction_count > 0).all()
    for interaction in interactions:
        listing_id = interaction.listing_id
        interaction_count = interaction.interaction_count
        try:
            response = es.get(index="listings_index", id=listing_id)
            listing_embedding = np.array(response['_source']['embedding'])
            user_vector += interaction_count * listing_embedding
        except Exception as e:
            print(f"Error fetching embedding for listing {listing_id}: {e}")


    # Check if the user wants to view charity items
    view_charity_items = await should_view_charity_items(user_id=authUserID, db=db)

    # Modify the Elasticsearch query based on the user's preference
    es_query = {"match_all": {}} if view_charity_items else {"bool": {"must_not": {"match": {"markedForCharity": True}}}}
    
    # Get all embeddings directly from Elasticsearch and compute cosine similarity with the user vector
    es_response = es.search(index="listings_index", body={"size": 10000, "query": es_query})
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
