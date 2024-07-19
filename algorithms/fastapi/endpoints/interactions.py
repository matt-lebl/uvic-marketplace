from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Dict
from sqlalchemy.orm import Session
from db.models import DB_Interaction
from db.deps import get_db
from sqlalchemy.exc import SQLAlchemyError
from util.cold_start import add_cold_start_interactions

router = APIRouter()

@router.post("/interactions/click")
def record_click(data: Dict = Body(...), db: Session = Depends(get_db)):
    user_id = data['userID']
    listing_id = data['listingID']
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise HTTPException(status_code=401, detail="No listingID in request")
    
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()
    if interaction:
        interaction.interaction_count += 1
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=1)

    try:
        db.add(interaction)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()

    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}

# Endpoint to handle cold start for new users
@router.post("/cold_start")
async def cold_start(user_id: str, db: Session = Depends(get_db)):
    """
    API endpoint to handle cold start problem for new users by adding interactions.
    """
    try:
        result = add_cold_start_interactions(user_id, db)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to handle cold start: {str(e)}")
        