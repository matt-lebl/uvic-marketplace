from datetime import time
from fastapi import APIRouter

from core.schemas import Message, MessageBaseModel
from services.data_layer_connect import send_request_to_data_layer

messagesRouter = APIRouter(
    prefix="/api/messages",
    tags=["listings"],
    responses={404: {"description": "Not found"}},
)


@messagesRouter.get("/overview/")
async def get_overview(num_items: int, offset: int, authUserID: str):
    path = "messages/overview/" + authUserID
    response = await send_request_to_data_layer(path, "GET")
    return response.json()


@messagesRouter.get("/thread/{listing_id}/{receiver_id}")
def get_thread(
    listing_id: str, receiver_id: str, num_items: int, offset: int, authUserID: str
):
    path = f"messages/thread/{listing_id}/{receiver_id}/{authUserID}"
    response = send_request_to_data_layer(path, "GET")
    return response.json()


@messagesRouter.post("")
def create_message(message: MessageBaseModel, authUserID: str):
    message = message.model_dump()
    message["sent_at"] = int(time.time())
    path = "messages/"
    response = send_request_to_data_layer(path, "POST", message)
    return response.json()
