import uuid
from core.sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import MessageSchema, MessageThread
import logging

logging.basicConfig(format="%(asctime)s $(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)


@router.post("/", response_model=MessageSchema)
def create_message(message: MessageBase, session: Session = Depends(get_session)):
    message_data = message.model_dump()
    message_data["message_id"] = str(uuid.uuid4())
    new_message = Message.create(session=session, **message_data)
    logger.info(f"New Message Created{new_message}")
    return new_message


@router.get("/overview/{userID}", response_model=list[MessageThread])
def get_overview(userID: str, session: Session = Depends(get_session)):
    logger.info(f"Message overview requested for {userID}")
    try:
        return Message.get_overview(userID, session)
    except Exception as e:
        logger.error(f"get_overview error{str(e)}")
        raise e


@router.get("/thread/{listing_id}/{receiver_id}/{user_id}", response_model=list[MessageSchema])
def get_thread(listing_id: str, receiver_id: str, user_id: str, session: Session = Depends(get_session)):
    logger.info(f"thread requested for  sender: {user_id}, receiver: {receiver_id}, listing: {listing_id}")
    return Message.get_thread(listing_id, receiver_id, user_id, session)
