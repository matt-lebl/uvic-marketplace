from fastapi import APIRouter
from ..schemas import NewListing, NewReview
from ..services.data_sync_kafka_producer import DataSyncKafkaProducer
from ..services.data_layer_connect import send_request_to_data_layer

# Development note: The DataSyncKafkaProducer class is used to send messages to Kafka.
# If you want to disable sending messages to Kafka, you can set disable=True when initializing the DataSyncKafkaProducer class.
dsKafkaProducer = DataSyncKafkaProducer(disable=True)

listingsRouter = APIRouter(
    prefix="/api/listing",
    tags=["listings"],
    responses={404: {"description": "Not found"}},
)


@listingsRouter.get("/{id}")
async def get_listing(id: str, authUserID: str):
    dsKafkaProducer.push_viewed_listing(id, authUserID)
    path = "listing/" + id
    response = await send_request_to_data_layer(path, "GET")
    return response.json()


@listingsRouter.post("/")
async def create_listing(listing: NewListing, authUserID: str):
    dsKafkaProducer.push_new_listing(listing)

    path = "listing/" + authUserID
    response = await send_request_to_data_layer(path, "POST", listing.model_dump())
    return response.json()


@listingsRouter.patch("/{id}")
async def update_listing(id: str, listing: NewListing, authUserID: str):
    dsKafkaProducer.push_updated_listing(id, listing)

    path = "listing/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", listing.model_dump())
    return response.json()


@listingsRouter.delete("/{id}")
async def delete_listing(id: str, authUserID: str):
    dsKafkaProducer.push_deleted_listing(id)

    path = "listing/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()


@listingsRouter.post("/review/")
async def create_review(review: NewReview, authUserID: str):
    dsKafkaProducer.push_new_review(review)

    path = "review/" + authUserID
    response = await send_request_to_data_layer(path, "POST", review.model_dump())
    return response.json()


@listingsRouter.patch("/review/{id}")
async def update_review(id: str, review: NewReview, authUserID: str):
    dsKafkaProducer.push_updated_review(review)

    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", review.model_dump())
    return response.json()


@listingsRouter.delete("/review/{id}")
async def delete_review(id: str, authUserID: str):
    dsKafkaProducer.push_deleted_review(id)

    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()
