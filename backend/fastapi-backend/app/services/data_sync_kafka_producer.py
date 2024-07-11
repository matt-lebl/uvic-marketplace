import json
from core.schemas import Listing, NewListing, NewReview, NewUser
from decouple import config
from confluent_kafka import Producer
from uuid import uuid4 as random_uuid
from .env_vars import FB_ENV_VARS


class DataSyncKafkaProducer:

    logError = False

    @staticmethod
    def delivery_report(err, msg):
        if err is not None:
            print(f"Failed to deliver message: {msg.value()}: {err.str()}")

    def __init__(self, logError=False, disable=False):
        DataSyncKafkaProducer.logError = logError

        self.disabled = disable

        if disable:
            return

        self.conf = {
            "bootstrap.servers": config(FB_ENV_VARS.KAFKA_BOOTSTRAP_SERVERS),
            "client.id": random_uuid(),
        }
        self.producer = Producer(self.conf)

    def push_message(self, topic: str, message: str):
        if self.disabled:
            return
        self.producer.produce(
            topic,
            value=message.encode("utf-8"),
            callback=(
                DataSyncKafkaProducer.delivery_report
                if DataSyncKafkaProducer.logError
                else None
            ),
        )
        self.producer.poll(1)

    # Listings
    # POST /api/listing/
    def push_new_listing(self, listing):
        self.push_message(
            "create-listing", json.dumps(listing.model_dump(), default=str)
        )

    # PATCH /api/listing/{id}
    # TODO
    def push_updated_listing(self, listingID: str, listing: NewListing):
        # TODO
        pass

    # DELETE /api/listing/{id}
    def push_deleted_listing(self, listingID: str):
        # TODO
        pass

    # GET /api/listing/
    def push_viewed_listing(self, listingID: str, userID: str = 0):
        viewObject = {"listingID": listingID, "userID": userID}
        self.push_message("view-listing", json.dumps(viewObject))

    # Reviews
    # POST /api/listing/review/
    def push_new_review(self, review: NewReview):
        # TODO
        pass

    # PATCH /api/listing/review/{id}
    def push_updated_review(self, review: NewReview):
        # TODO
        pass

    # DELETE /api/listing/review/{id}
    def push_deleted_review(self, reviewID: str):
        # TODO
        pass

    # Users
    # POST /api/user/
    # TODO {userID: str}
    def push_new_user(self, user: NewUser):
        # TODO
        pass

    # PATCH /api/user/{id}
    def push_updated_user(self, user: NewUser):
        # TODO
        pass

    # DELETE /api/user/{id}
    def push_deleted_user(self, userID: str):
        # TODO
        pass
