from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from db.models import DB_User

def should_view_charity_items(user_id: str, db: Session):

    # Query the database to check if the user wants to view charity items
    try:
        see_charity_item = db.query(DB_User.see_charity_items).filter(DB_User.user_id == user_id).scalar()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to query database for user charity item preference") from e

    return see_charity_item
    