import uuid
from .sql_models import *
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session
from .schemas import MessageSchema, MessageThread

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)


@router.post("/", response_model=MessageSchema)
def create_message(message: MessageBase, session: Session = Depends(get_session)):
    message_data = message.dict()
    message_data["message_id"] = str(uuid.uuid4())
    new_message = Message.create(session=session, **message_data)
    return new_message


@router.get("/", response_model=list[MessageSchema])
def get_all_messages(session: Session = Depends(get_session)):
    return Message.get_all(session)


@router.get("/{message_id}", response_model=MessageSchema)
def get_message(message_id: str, session: Session = Depends(get_session)):
    message = Message.get_by_id(session, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@router.get("/overview/{userID}", response_model=list[MessageThread])
def get_overview(userID: str, session: Session = Depends(get_session)):
    return Message.get_overview(userID, session)


@router.get("/thread/{listing_id}/{receiver_id}/{user_id}", response_model=list[MessageSchema])
def get_thread(listing_id: str, receiver_id: str, user_id: str, session: Session = Depends(get_session)):
    return Message.get_thread(listing_id, receiver_id, user_id, session)
