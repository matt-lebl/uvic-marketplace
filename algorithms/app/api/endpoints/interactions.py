from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import DB_Interaction, DB_User, DB_Listing
from app.api.deps import get_db

router = APIRouter()

@router.post("/interactions/")
def record_interaction(user_name: str, listing_name: str, db: Session = Depends(get_db)):
    # Get or create user
    user = db.query(DB_User).filter(DB_User.user_name == user_name).first()
    if not user:
        user = DB_User(user_name=user_name)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Get listing
    listing = db.query(DB_Listing).filter(DB_Listing.listing_name == listing_name).first()
    if not listing:
        raise HTTPException(status_code=404, detail="DB_Listing not found")

    # Get or create interaction
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user.user_id, DB_Interaction.listing_id == listing.listing_id).first()
    if interaction:
        interaction.interaction_count += 1
    else:
        interaction = DB_Interaction(user_id=user.user_id, listing_id=listing.listing_id, interaction_count=1)

    db.add(interaction)
    db.commit()
    return {"user_id": user.user_id, "listing_id": listing.listing_id, "interaction_count": interaction.interaction_count}
