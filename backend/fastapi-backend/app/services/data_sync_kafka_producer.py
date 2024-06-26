from schemas import NewListing, NewReview, NewUser
from decouple import config
from confluent_kafka import Producer
from uuid import uuid4 as random_uuid
from env_vars import FB_ENV_VARS

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
            "bootstrap.servers": config(FB_ENV_VARS.KAFKA_BOOSTRAP_SERVERS),
            "client.id": random_uuid(),
        }
        self.producer = Producer(self.conf)

    def push_message(self, topic: str, message):
        if self.disabled:
            return
        self.producer.produce(
            topic,
            value=str(message),
            callback=(
                DataSyncKafkaProducer.delivery_report
                if DataSyncKafkaProducer.logError
                else None
            ),
        )
        self.producer.poll(1)

    # Listings
    # POST /api/listing/
    def push_new_listing(self, listing: NewListing):
        self.push_message("create-listing", listing)

    # PATCH /api/listing/{id}
    def push_updated_listing(self, listingID: int, listing: NewListing):
        # TODO
        pass

    # DELETE /api/listing/{id}
    def push_deleted_listing(self, listingID: int):
        # TODO
        pass

    # GET /api/listing/
    def push_viewed_listing(self, listingID: int, userID: int = 0):
        self.push_message("view-listing", {"listingID": listingID, "userID": userID})

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
    def push_deleted_review(self, reviewID: int):
        # TODO
        pass

    # Users
    # POST /api/user/
    def push_new_user(self, user: NewUser):
        # TODO
        pass

    # PATCH /api/user/{id}
    def push_updated_user(self, user: NewUser):
        # TODO
        pass

    # DELETE /api/user/{id}
    def push_deleted_user(self, userID: int):
        # TODO
        pass
