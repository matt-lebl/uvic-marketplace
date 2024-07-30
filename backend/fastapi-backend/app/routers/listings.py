from fastapi import APIRouter, Response
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
from services.utils import convert_to_type, data_layer_failed

# Development note: The DataSyncKafkaProducer class is used to send messages to Kafka.
# If you want to disable sending messages to Kafka, you can set disable=True when initializing the DataSyncKafkaProducer class.
dsKafkaProducer = DataSyncKafkaProducer(disable=False)

listingsRouter = APIRouter(
    prefix="/api/listing",
    tags=["listings"],
    responses={404: {"description": "Not found"}},
)


@listingsRouter.get("")
async def get_user_listings(authUserID: str, returnResponse: Response):
    path = "listing/user/" + authUserID
    response = await send_request_to_data_layer(path, "GET")
    returnResponse.status_code = response.status_code
    return response.json()


@listingsRouter.get("/{id}")
async def get_listing(id: str, authUserID: str, returnResponse: Response):
    dsKafkaProducer.push_viewed_listing(id, authUserID)
    path = "listing/" + id
    response = await send_request_to_data_layer(path, "GET")
    if data_layer_failed(response, returnResponse):
        return response.json()
    return convert_to_type(response.json(), Listing)


@listingsRouter.post("")
async def create_listing(
    listing: NewListingWithWrapper, authUserID: str, returnResponse: Response
):
    path = "listing/" + authUserID

    response = await send_request_to_data_layer(path, "POST", listing.model_dump())
    if data_layer_failed(response, returnResponse):
        return response.json()

    listing = convert_to_type(response.json(), Listing)
    listing = ListingWithWrapper(listing=listing)
    dsKafkaProducer.push_new_listing(listing)
    return listing


@listingsRouter.patch("/{id}")
async def update_listing(
    id: str, listing: UpdateListing, authUserID: str, returnResponse: Response
):
    dsKafkaProducer.push_updated_listing(id, listing)
    path = "listing/" + id + "/" + authUserID

    response = await send_request_to_data_layer(path, "PATCH", listing.model_dump())
    if data_layer_failed(response, returnResponse):
        return response.json()

    return JSONResponse(
        status_code=200, content={"message": "Listing edited successfully"}
    )


@listingsRouter.delete("/{id}")
async def delete_listing(id: str, authUserID: str, returnResponse: Response):
    dsKafkaProducer.push_deleted_listing(id)

    path = "listing/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    if data_layer_failed(response, returnResponse):
        return response.json()

    return JSONResponse(
        status_code=200, content={"message": "Listing deleted successfully"}
    )
