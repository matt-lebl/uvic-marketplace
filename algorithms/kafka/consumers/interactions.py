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
