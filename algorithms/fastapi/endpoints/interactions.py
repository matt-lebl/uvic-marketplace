from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Dict
from sqlalchemy.orm import Session
from db.models import DB_Interaction, DB_User
from db.deps import get_db
from sqlalchemy.exc import SQLAlchemyError
from .cold_start import add_interactions_for_user

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


@router.post("/interactions/review")
def record_review(data: Dict = Body(...), db: Session = Depends(get_db)):
    user_id = data['userID']
    stars = data['stars']
    listing_id = data['listingID']
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise HTTPException(status_code=401, detail="No listingID in request")
    if stars is None or not (0 <= stars <= 5):
        raise HTTPException(status_code=400, detail="Invalid stars rating")

    rating_weight = (stars - 3) * 10 # Covert the stars to a interation value

    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()
    if interaction:
        interaction.interaction_count += rating_weight  # Update interaction count with rating based on stars
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=rating_weight)

    try:
        db.add(interaction)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()

    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}


@router.post("/interactions/stop_recommending_item")
def stop_suggesting_item_type(data: Dict = Body(...), db: Session = Depends(get_db)):
    user_id = data['userID']
    listing_id = data['listingID']
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise HTTPException(status_code=401, detail="No listingID in request")
    
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()
    if interaction:
        interaction.interaction_count = -5  # Negative influence
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=-5)

    try:
        db.add(interaction)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()

    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}



# Create a temp add user endpoint for testing
@router.post("/interactions/add_user")
async def add_user(user_id: str, db: Session = Depends(get_db)):
    """
    Temporary API endpoint to add a user ID to the SQL user database.
    """

    # Check if the user already exists
    existing_user = db.query(DB_User).filter(DB_User.user_id == user_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Add new user to the database
    new_user = DB_User(user_id=user_id)
    db.add(new_user)
    db.commit()
    add_interactions_for_user(user_id, db) # Call cold start function
    return {"message": "User added successfully", "userID": user_id}