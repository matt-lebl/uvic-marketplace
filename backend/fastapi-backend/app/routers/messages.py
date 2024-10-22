import time
from fastapi import APIRouter, Response

from core.schemas import Message, MessageBaseModel
from services.data_layer_connect import send_request_to_data_layer

messagesRouter = APIRouter(
    prefix="/api/messages",
    tags=["listings"],
    responses={404: {"description": "Not found"}},
)


@messagesRouter.get("/overview")
async def get_overview(
    authUserID: str, returnResponse: Response, num_items: int = 10, offset: int = 0
):
    path = "messages/overview/" + authUserID
    response = await send_request_to_data_layer(path, "GET")
    returnResponse.status_code = response.status_code
    return response.json()


@messagesRouter.get("/thread/{listing_id}/{receiver_id}")
async def get_thread(
    listing_id: str,
    receiver_id: str,
    authUserID: str,
    returnResponse: Response,
    num_items: int = 10,
    offset: int = 0,
):
    path = f"messages/thread/{listing_id}/{receiver_id}/{authUserID}"
    response = await send_request_to_data_layer(path, "GET")
    returnResponse.status_code = response.status_code
    return response.json()


@messagesRouter.post("")
async def create_message(
    message: MessageBaseModel, returnResponse: Response, authUserID: str
):
    message = message.model_dump()
    message["sent_at"] = int(time.time())
    path = "messages/" + authUserID
    response = await send_request_to_data_layer(path, "POST", message)
    returnResponse.status_code = response.status_code
    return response.json()
