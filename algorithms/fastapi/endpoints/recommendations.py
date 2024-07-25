from fastapi import APIRouter, Header, HTTPException, Depends
from typing import List, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from db.deps import get_db
from db.models import DB_User, DB_Listing, DB_Interaction
from util.schemas import ListingSummary, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
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
    view_charity_items = should_view_charity_items(user_id=authUserID, db=db)

    # Modify the Elasticsearch query based on charity item preference and blacklisted items
    es_query = {"match_all": {}} if view_charity_items else {"bool": {"must_not": {"match": {"markedForCharity": True}}}}

    # Get all embeddings directly from Elasticsearch and compute cosine similarity with the user vector
    es_response = es.search(index="listings_index", body={"size": 10000, "query": es_query})

    # Filter out blacklisted items
    blacklisted_items = db.query(DB_User.blacklisted_items).filter(DB_User.user_id == authUserID).first()
    if blacklisted_items and blacklisted_items.blacklisted_items:
        blacklisted_item_ids = blacklisted_items.blacklisted_items
    else:
        blacklisted_item_ids = []

    es_response['hits']['hits'] = [hit for hit in es_response['hits']['hits'] if hit['_id'] not in blacklisted_item_ids]

    # Compute cosine similarity between user vector and listing embeddings
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
        recommendation["dateCreated"] = es_listing["_source"]["dateCreated"]
        recommendation["sellerID"] = es_listing['_source']["sellerID"]
        recommendation["sellerName"] = es_listing['_source']["sellerName"]
        recommendation["description"] = es_listing['_source'].get("description")
        recommendation["imageUrl"] = es_listing['_source'].get("imageUrl")

        formatted_recommendations.append(recommendation)


    # limit the number of recommendations to the limit
    final_recommendations = formatted_recommendations[:limit]

    return final_recommendations

@router.post("/recommendations/stop/{listing_id}")
def stop_suggesting_item_type(*,
                            listing_id: str,
                            authUserID: Union[str, None] = None,
                            db: Session = Depends(get_db)):

    user_id = authUserID
    if user_id is None:
        raise HTTPException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise HTTPException(status_code=401, detail="No listingID in request")

    # Fetch the user
    user = db.query(DB_User).filter(DB_User.user_id == user_id).first()

    if user:
        # Ensure blacklisted_items is not None
        if user.blacklisted_items is None:
            user.blacklisted_items = []

        # Append listing_id if not already in the list
        if listing_id not in user.blacklisted_items:
            user.blacklisted_items.append(listing_id)
            try:
                db.flush()
                db.commit()
            except SQLAlchemyError as e:
                print(f"Error updating: {e}")
                db.rollback()
                raise HTTPException(status_code=500, detail="Failed to update user's blacklisted items")


    # Decrease item interaction score
    negative_influence = -30
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()
    if interaction:
        interaction.interaction_count = negative_influence
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=negative_influence)

    try:
        db.add(interaction)
        db.flush()
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user's interactions")
    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}
