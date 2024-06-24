import json
import random
import uuid
from datetime import timedelta
from faker import Faker


class DataFactory:
    def __init__(self):
        self.fake = Faker()

    def generate_user(self):
        user_data = {
            "username": self.fake.user_name(),
            "name": self.fake.name(),
            "email": self.fake.email(),
            "password": self.fake.password()
        }
        return user_data

    def generate_user_update(self):
        return {
            "username": self.fake.user_name(),
            "name": self.fake.name(),
            "bio": self.fake.text(),
            "profilePictureUrl": self.fake.image_url()
        }

    def generate_listing(self):
        title = self.fake.catch_phrase()
        description = self.fake.text()
        price = float(round(random.uniform(10, 1000), 2))
        image_urls = [{"url": self.fake.image_url()} for _ in range(random.randint(1, 5))]
        latitude = float(self.fake.latitude())
        longitude = float(self.fake.longitude())

        listing = {
            "title": title,
            "price": price,
            "description": description,
            "images": image_urls,
            "location": {"latitude": latitude, "longitude": longitude}
        }
        return listing

    def generate_message(self, listing, sender, receiver):
        message_id = str(uuid.uuid4())
        sender_id = sender
        receiver_id = receiver
        listing_id = listing
        message_content = self.fake.text()
        sent_at = self.fake.date_time_this_year().isoformat()

        message = {
            "message_id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "listing_id": listing_id,
            "content": message_content,
            "sent_at": sent_at
        }
        return message

    def generate_listing_review(self, listing):
        listing_review_id = str(uuid.uuid4())
        reviewed_listing_id = listing
        review_content = self.fake.text()
        stars = random.randint(1, 5)

        review = {
            "listing_review_id": listing_review_id,
            "listingID": reviewed_listing_id,
            "comment": review_content,
            "stars": stars
        }
        return review

    @classmethod
    def generate_login_request(cls, email, password):
        return {
            "email": email,
            "password": password,
        }
