from fastapi import APIRouter, Response
from services.data_layer_connect import send_request_to_data_layer
from core.schemas import NewReview
from services.data_sync_kafka_producer import DataSyncKafkaProducer

# Development note: The DataSyncKafkaProducer class is used to send messages to Kafka.
# If you want to disable sending messages to Kafka, you can set disable=True when initializing the DataSyncKafkaProducer class.
dsKafkaProducer = DataSyncKafkaProducer(disable=False)

reviewsRouter = APIRouter(
    prefix="/api/review",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@reviewsRouter.post("")
async def add_review(review: NewReview, authUserID: str, returnResponse: Response):
    path = "review/" + authUserID
    response = await send_request_to_data_layer(path, "POST", review.model_dump())
    returnResponse.status_code = response.status_code
    dsKafkaProducer.push_new_review(review, authUserID)
    return response.json()


@reviewsRouter.patch("/{id}")
async def edit_review(
    id: str, review: NewReview, authUserID: str, returnResponse: Response
):
    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", review.model_dump())
    returnResponse.status_code = response.status_code
    return response.json()


@reviewsRouter.delete("/{id}")
async def delete_review(id: str, authUserID: str, returnResponse: Response):
    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    returnResponse.status_code = response.status_code
    return response.json()
