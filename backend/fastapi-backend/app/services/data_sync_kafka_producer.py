from schemas import NewListing, NewReview, NewUser
from confluent_kafka import Producer
from uuid import uuid4 as random_uuid


class DataSyncKafkaProducer:

    logError = False

    @staticmethod
    def delivery_report(err, msg):
        if err is not None:
            print(f"Failed to deliver message: {msg.value()}: {err.str()}")

    def __init__(self, logError=False, disable=False):
        DataSyncKafkaProducer.logError = logError

        if disable:
            self.disabled = True
            return

        self.conf = {
            "bootstrap.servers": "localhost:29092, localhost:39092, localhost:49092",
            "client.id": random_uuid(),
        }
        self.producer = Producer(self.conf)

    def push_message(self, topic: str, message):
        if self.disabled:
            return
        self.producer.produce(
            topic,
            value=message,
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
        self.push_message("test1", listing)

    # PATCH /api/listing/{id}
    def push_updated_listing(self, listingID: int, listing: NewListing):
        # TODO
        pass

    # DELETE /api/listing/{id}
    def push_deleted_listing(self, listingID: int):
        # TODO
        pass

    # GET /api/listing/
    def push_viewed_listing(self, listingID: int, userID: int):
        self.push_message("test2", {"listingID": listingID, "userID": userID})

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
