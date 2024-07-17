from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from db.models import DB_Listing, DB_Interaction
from db.deps import get_db

router = APIRouter()


# Function used to address cold start problem for new users
def add_interactions_for_user(user_id: str, db: Session = Depends(get_db)):
    # Add interactions for user based on the average interactions of all existing users in the interactions database.
    try:
        # Get all unique listing IDs
        listings = db.query(DB_Listing.listing_id).all()
        listing_ids = [listing.listing_id for listing in listings]

        # Listing Error Handling
        if not listing_ids:
            raise Exception("No listings found in the database. Cannot calculate average interactions.")
        
        if len(listing_ids) < 10:
            raise Exception("There are less than 10 listings in the database. Cannot produce cold start.")
        
        print("These are the listings" + str(listings))
        print("These are the listing IDs" + str(listing_ids))

        # Calculate the average number of interactions per listing
        avg_interactions_per_listing = {}
        for index, listing_id in enumerate(listing_ids):
            
            # query DB
            listing_id_int = int(listing_id)
            avg_interaction_count = db.query(func.avg(DB_Interaction.interaction_count)).filter(cast(DB_Interaction.listing_id, Integer) == listing_id_int).scalar()

            # Check if avg_interaction_count is not None before using it
            if avg_interaction_count is not None:
                avg_interaction_count = float(avg_interaction_count)
            else:
                avg_interaction_count = 0.0

            avg_interactions_per_listing[listing_id_int] = avg_interaction_count

        # Select the top x listings based on the number of interactions
        x = 10
        top_interaction_listings = sorted(avg_interactions_per_listing.items(), key=lambda x: x[1], reverse=True)[:x]

        # Select y listings from the end of the list (proxy for more recently added)
        y = 5
        recent_listings = sorted(avg_interactions_per_listing.items(), key=lambda x: x[1])[-y:]

        # Add interactions for the user based top avg interactions and recent listings
        cold_start_listings = top_interaction_listings + recent_listings

        print("cold start interactions " + str(cold_start_listings))

        # Update interaction count for existing interactions in the database
        for listing_tuple in cold_start_listings:
            # Query the existing interaction based on user_id and listing_id
            existing_interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == str(listing_tuple[0])).first()
            
            if existing_interaction:
                # Increase the interaction count for the existing interaction
                existing_interaction.interaction_count += 1
            else:
                # If the interaction does not exist, create a new one with interaction_count = 1
                interaction = DB_Interaction(user_id=user_id, listing_id=str(listing_tuple[0]), interaction_count=1)
                db.add(interaction)

            db.commit()
            
        return {"message": "Interactions added successfully", "userID": user_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add interactions: {str(e)}")

# Endpoint to handle cold start for new users
@router.post("/cold_start")
async def cold_start(user_id: str, db: Session = Depends(get_db)):
    """
    API endpoint to handle cold start problem for new users by adding interactions.
    """
    try:
        result = add_interactions_for_user(user_id, db)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to handle cold start: {str(e)}")