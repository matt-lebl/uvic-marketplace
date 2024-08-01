import json
from core.schemas import NewListing, NewReview, UpdateUser
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
            "bootstrap.servers": config(
                FB_ENV_VARS.KAFKA_BOOTSTRAP_SERVERS, default=""
            ),
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
    def push_updated_listing(self, listingID: str, listing: NewListing):
        listing_dict = listing.model_dump()
        listing_dict["listing"]["listingID"] = listingID
        self.push_message("update-listing", json.dumps(listing_dict, default=str))

    # DELETE /api/listing/{id}
    def push_deleted_listing(self, listingID: str):
        obj = {"listingID": listingID}
        self.push_message("delete-listing", json.dumps(obj))

    # GET /api/listing/
    def push_viewed_listing(self, listingID: str, userID: str = 0):
        viewObject = {"listingID": listingID, "userID": userID}
        self.push_message("view-listing", json.dumps(viewObject))

    # Reviews
    # POST /api/listing/review/
    def push_new_review(self, review: NewReview, userID: str):
        review_dict = {
            "userID": userID,
            "stars": review.stars,
            "listingID": review.listingID,
        }
        self.push_message("create-review", json.dumps(review_dict, default=str))

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
    def push_new_user(self, user: dict):
        user_dict = {
            "username": user["username"],
            "userID": user["userID"],
            "name": user["name"],
            "bio": user["bio"],
        }
        self.push_message("create-user", json.dumps({"user": user_dict}))

    # PATCH /api/user/{id}
    def push_updated_user(self, user: UpdateUser, userID: str):
        user_dict = {
            "username": user.username,
            "userID": userID,
            "name": user.name,
            "bio": user.bio,
            "ignoreCharityListings": user.ignoreCharityListings,
        }
        self.push_message("edit-user", json.dumps(user_dict))

    # DELETE /api/user/{id}
    def push_deleted_user(self, userID: str):
        # TODO
        pass


dsKafkaProducer = DataSyncKafkaProducer()
