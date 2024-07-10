from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import DB_Listing, DB_Interaction
from app.api.deps import get_db

router = APIRouter()


# Function used to address cold start problem for new users
def add_interactions_for_user(user_id: str, db: Session = Depends(get_db)):
    # Add interactions for user based on the average interactions of all existing users in the interactions database.
    try:
        # Get all unique listing IDs
        listings = db.query(DB_Listing.listing_id).all()
        listing_ids = [listing.listing_id for listing in listings]

        # Calculate the average number of interactions per listing
        avg_interactions_per_listing = {}
        for listing_id in listing_ids:
            result = db.execute(
                "SELECT AVG(interaction_count) FROM db_interaction WHERE listing_id = :listing_id",
                {"listing_id": listing_id}
            ).scalar()
            avg_interactions_per_listing[listing_id] = result if result else 0

        # Add interactions for the user based on the average interactions per listing
        for listing_id, avg_interactions in avg_interactions_per_listing.items():
            interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=avg_interactions)
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