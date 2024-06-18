import json
import random
import uuid
from datetime import timedelta
from faker import Faker


class DataFactory:
    def __init__(self):
        self.fake = Faker()

    def generate_user(self):
        username = self.fake.user_name()
        email = self.fake.email()
        password = self.fake.password()
        profile_picture_url = self.fake.image_url()
        location = json.dumps({"latitude": str(self.fake.latitude()), "longitude": str(self.fake.longitude())})
        joining_date = self.fake.date_time_this_decade().isoformat()
        items_sold = [self.fake.uuid4() for _ in range(random.randint(1, 5))]
        items_purchased = [self.fake.uuid4() for _ in range(random.randint(1, 5))]
        bio = json.dumps({"bio": self.fake.text()})

        user = {
            "username": username,
            "email": email,
            "password": password,
            "profile_picture_url": profile_picture_url,
            "location": location,
            "joining_date": joining_date,
            "items_sold": items_sold,
            "items_purchased": items_purchased,
            "bio": bio
        }
        return user

    def generate_listing(self, user_id):
        seller_id = user_id
        title = self.fake.catch_phrase()
        description = self.fake.text()
        price = float(round(random.uniform(10, 1000), 2))
        status = random.choice(["active", "sold", "pending"])
        listed_at = self.fake.date_time_this_year()
        last_updated_at = listed_at + timedelta(days=random.randint(0, 30))
        image_urls = [self.fake.image_url() for _ in range(random.randint(1, 5))]
        latitude = float(self.fake.latitude())
        longitude = float(self.fake.longitude())

        listing = {
            "seller_id": seller_id,
            "title": title,
            "description": description,
            "price": price,
            "status": status,
            "listed_at": listed_at.isoformat(),
            "last_updated_at": last_updated_at.isoformat(),
            "image_urls": image_urls,
            "latitude": latitude,
            "longitude": longitude
        }
        return listing

    def generate_message(self, listing, sender, receiver):
        message_id = str(uuid.uuid4())
        sender_id = sender
        receiver_id = receiver
        listing_id = listing
        message_content = self.fake.text()
        timestamp = self.fake.date_time_this_year().isoformat()

        message = {
            "message_id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "listing_id": listing_id,
            "message_content": message_content,
            "timestamp": timestamp
        }
        return message

    def generate_listing_rating(self, listing, user):
        listing_rating_id = str(uuid.uuid4())
        rated_listing_id = listing
        rating_user_id = user
        rating_value = random.randint(1, 5)
        timestamp = self.fake.date_time_this_year().isoformat()

        rating = {
            "listing_rating_id": listing_rating_id,
            "rated_listing_id": rated_listing_id,
            "rating_user_id": rating_user_id,
            "rating_value": rating_value,
            "timestamp": timestamp
        }
        return rating

    def generate_listing_review(self, listing, user_id):
        listing_review_id = str(uuid.uuid4())
        reviewed_listing_id = listing
        review_user_id = user_id
        review_content = self.fake.text()
        timestamp = self.fake.date_time_this_year().isoformat()

        review = {
            "listing_review_id": listing_review_id,
            "reviewed_listing_id": reviewed_listing_id,
            "review_user_id": review_user_id,
            "review_content": review_content,
            "timestamp": timestamp
        }
        return review
