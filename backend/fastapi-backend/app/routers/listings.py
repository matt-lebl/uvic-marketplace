from fastapi import APIRouter
from schemas import NewListing, NewReview
from services.data_sync_kafka_producer import DataSyncKafkaProducer

# Development note: The DataSyncKafkaProducer class is used to send messages to Kafka.
# If you want to disable sending messages to Kafka, you can set disable=True when initializing the DataSyncKafkaProducer class.
dsKafkaProducer = DataSyncKafkaProducer(disable=True)

listingsRouter = APIRouter(
    prefix="/api/listing",
    tags=["listings"],
    responses={404: {"description": "Not found"}},
)


@listingsRouter.get("/{id}")
async def get_listing(id: int):
    dsKafkaProducer.push_viewed_listing(id, 22)
    # TODO
    return {"id": id}


@listingsRouter.post("/")
async def create_listing(listing: NewListing):
    dsKafkaProducer.push_new_listing(listing)
    # TODO
    return {"listingID": listing.listingID}


@listingsRouter.patch("/{id}")
async def update_listing(id: int, listing: NewListing):
    dsKafkaProducer.push_updated_listing(id, listing)
    # TODO
    return {"id": id, "listingID": listing.listingID}


@listingsRouter.delete("/{id}")
async def delete_listing(id: int):
    dsKafkaProducer.push_deleted_listing(id)
    # TODO
    return {"id": id}


@listingsRouter.post("/review/")
async def create_review(review: NewReview):
    dsKafkaProducer.push_new_review(review)
    # TODO
    return {"reviewID": review.reviewID}


@listingsRouter.patch("/review/{id}")
async def update_review(id: int, review: NewReview):
    dsKafkaProducer.push_updated_review(review)
    # TODO
    return {"id": id, "reviewID": review.reviewID}


@listingsRouter.delete("/review/{id}")
async def delete_review(id: int):
    dsKafkaProducer.push_deleted_review(id)
    # TODO
    return {"id": id}
