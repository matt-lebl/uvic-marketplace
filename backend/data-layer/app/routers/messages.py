import uuid
<<<<<<< Updated upstream
from sql_models import *
=======
from app.routers.sql_models import *
>>>>>>> Stashed changes
from fastapi import APIRouter, Depends, HTTPException
from .dependencies import get_session

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)


@router.post("/", response_model=Message)
def create_message(message: MessageBase, session: Session = Depends(get_session)):
    message_data = message.dict()
    message_data["message_id"] = str(uuid.uuid4())
    new_message = Message.create(session=session, **message_data)
    return new_message


<<<<<<< Updated upstream
@router.get("/", response_model=List[Message])
=======
@router.get("/", response_model=list[Message])
>>>>>>> Stashed changes
def get_all_messages(session: Session = Depends(get_session)):
    return Message.get_all(session)


@router.get("/{message_id}", response_model=Message)
def get_message(message_id: str, session: Session = Depends(get_session)):
    message = Message.get_by_id(session, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
