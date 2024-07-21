from fastapi import APIRouter
from fastapi.responses import JSONResponse
from core.schemas import (
    Listing,
    ListingWithWrapper,
    Location,
    NewListing,
    NewListingWithWrapper,
    NewReview,
    UpdateListing,
)
from services.data_sync_kafka_producer import DataSyncKafkaProducer
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type

# Development note: The DataSyncKafkaProducer class is used to send messages to Kafka.
# If you want to disable sending messages to Kafka, you can set disable=True when initializing the DataSyncKafkaProducer class.
dsKafkaProducer = DataSyncKafkaProducer(disable=False)

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
    return convert_to_type(response.json(), Listing)


@listingsRouter.post("/")
async def create_listing(listing: NewListingWithWrapper, authUserID: str):
    path = "listing/" + authUserID
    response = await send_request_to_data_layer(path, "POST", listing.model_dump())

    listing = convert_to_type(response.json(), Listing)
    listing = ListingWithWrapper(listing=listing)
    dsKafkaProducer.push_new_listing(listing)
    return listing


@listingsRouter.patch("/{id}")
async def update_listing(id: str, listing: UpdateListing, authUserID: str):
    dsKafkaProducer.push_updated_listing(id, listing)
    path = "listing/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", listing.model_dump())
    if response.status_code == 200:
        return JSONResponse(
            status_code=200, content={"message": "Listing edited successfully"}
        )
    return response.json()


@listingsRouter.delete("/{id}")
async def delete_listing(id: str, authUserID: str):
    dsKafkaProducer.push_deleted_listing(id)

    path = "listing/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")

    if response.status_code == 200:
        return JSONResponse(
            status_code=200, content={"message": "Listing deleted successfully"}
        )
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
