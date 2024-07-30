from confluent_kafka import KafkaException
from db.models import DB_Interaction
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

def record_click(data: dict, db: Session):
    user_id = data['userID']
    listing_id = data['listingID']
    
    if user_id is None:
        print("No userID in request")
        raise KafkaException(401)
    if listing_id is None:
        print("No listingID in request")
        raise KafkaException()
    
    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()

    interaction_weight = 10
    if interaction:
        interaction.interaction_count += interaction_weight
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=interaction_weight)

    try:
        db.add(interaction)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()

    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}


def stop_suggesting_item_type(data: dict, db: Session):
    user_id = data['userID']
    listing_id = data['listingID']

    if user_id is None:
        raise KafkaException(status_code=401, detail="No userID in request")
    if listing_id is None:
        raise KafkaException(status_code=401, detail="No listingID in request")

    interaction = db.query(DB_Interaction).filter(DB_Interaction.user_id == user_id, DB_Interaction.listing_id == listing_id).first()
    interaction_weight = -100 # Negative influence
    if interaction:
        interaction.interaction_count = interaction_weight
    else:
        interaction = DB_Interaction(user_id=user_id, listing_id=listing_id, interaction_count=interaction_weight)

    try:
        db.add(interaction)
        db.commit()
    except SQLAlchemyError as e:
        print("Error adding interaction to postgres: ", e)
        db.rollback()

    return {"userID": user_id, "listingID": listing_id, "interactionCount": interaction.interaction_count}
