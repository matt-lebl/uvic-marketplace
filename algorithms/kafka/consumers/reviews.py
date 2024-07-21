from confluent_kafka import KafkaException
from db.models import DB_Interaction, DB_User
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

def add_review(data: dict, db: Session):
    user_id = data['userID']
    stars = data['stars']
    listing_id = data['listingID']

    if user_id is None:
        raise KafkaException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise KafkaException(status_code=401, detail="No listingID in request")
    if stars is None or not (0 <= stars <= 5):
        raise KafkaException(status_code=400, detail="Invalid stars rating")

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

def edit_review(data: dict, db: Session):
    # TODO
    pass

def delete_review(data: dict, db: Session):
    # TODO
    pass
