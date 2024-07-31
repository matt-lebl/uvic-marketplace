from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from db.models import DB_Listing, DB_Interaction, DB_User
from db.deps import get_db

router = APIRouter()

# Function used to address cold start problem for new users
def add_cold_start_interactions(user_id: str, db: Session = Depends(get_db)):
    # Confirm user_id is not None
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if not existing_user:
        new_user = DB_User(user_id=user_id)
        db.add(new_user)

    # Add interactions for user based on the average interactions of all existing users in the interactions database.
    try:
        # Get all unique listing IDs
        listings = db.query(DB_Listing.listing_id).all()
        listing_ids = [listing.listing_id for listing in listings]

        # Low number of listings in the database
        if not listing_ids:
            return {"message": "No Interactions added, no listings found", "userID": user_id}

        if len(listing_ids) < 4:
            return {"message": "No Interactions added, too few listings", "userID": user_id}
            
        # Calculate the average number of interactions per listing
        avg_interactions_per_listing = {}
        for index, listing_id in enumerate(listing_ids):
            # query DB
            avg_interaction_count = db.query(func.avg(DB_Interaction.interaction_count)).filter(DB_Interaction.listing_id == listing_id).scalar()

            # Check if avg_interaction_count is not None before using it
            if avg_interaction_count is not None:
                avg_interaction_count = float(avg_interaction_count)
            else:
                avg_interaction_count = 0.0

            avg_interactions_per_listing[listing_id] = avg_interaction_count

        # Select the top x listings based on the number of interactions
        x = 3
        top_interaction_listings = sorted(avg_interactions_per_listing.items(), key=lambda x: x[1], reverse=True)[:x]

        # Select y listings from the end of the list (proxy for more recently added)
        y = 1
        recent_listings = sorted(avg_interactions_per_listing.items(), key=lambda x: x[1])[-y:]

        # Add interactions for the user based top avg interactions and recent listings
        cold_start_listings = top_interaction_listings + recent_listings

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
        