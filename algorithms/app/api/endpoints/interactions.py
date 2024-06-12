from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Dict
from sqlalchemy.orm import Session
from app.db.models import DB_Interaction
from app.api.deps import get_db
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

@router.post("/interactions/click")
def record_click(data: Dict = Body(...), db: Session = Depends(get_db)):
    user_id = data['user_id']
    listing_id = data['listing_id']
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="No user_id in request")
    if listing_id is None:
        raise HTTPException(status_code=401, detail="No listing_id in request")
    
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == data['user_id'], DB_Interaction.listing_id == data['listing_id']).first()
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

    return {"user_id": user_id, "listing_id": listing_id, "interaction_count": interaction.interaction_count}
