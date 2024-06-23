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
        name = self.fake.name()
        password = self.fake.password()
        profile_picture_url = self.fake.image_url()
        location = json.dumps({"latitude": str(self.fake.latitude()), "longitude": str(self.fake.longitude())})
        joining_date = self.fake.date_time_this_decade().isoformat()
        items_sold = [self.fake.uuid4() for _ in range(random.randint(1, 5))]
        items_purchased = [self.fake.uuid4() for _ in range(random.randint(1, 5))]
        bio = json.dumps({"bio": self.fake.text()})

        user = {
            "username": username,
            "name": name,
            "email": email,
            "password": password,
            "profilePictureUrl": profile_picture_url,
            "location": location,
            "joining_date": joining_date,
            "items_sold": items_sold,
            "items_purchased": items_purchased,
            "bio": bio
        }
        return user

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
        timestamp = self.fake.date_time_this_year().isoformat()

        message = {
            "message_id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "listing_id": listing_id,
            "content": message_content,
            "sent_at": timestamp
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
