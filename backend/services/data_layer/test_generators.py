import json
import random
import uuid
from datetime import timedelta
from faker import Faker


class DataFactory:
    def __init__(self):
        self.fake = Faker()

    def generate_users(self, num_users=10):
        users = []
        for _ in range(num_users):
            user_id = str(uuid.uuid4())
            username = self.fake.user_name()
            email = self.fake.email()
            password = self.fake.password()
            profile_picture_url = self.fake.image_url()
            location = json.dumps({"latitude": str(self.fake.latitude()), "longitude": str(self.fake.longitude())})
            joining_date = self.fake.date_time_this_decade()
            items_sold = json.dumps({"items": []})
            items_purchased = json.dumps({"items": []})
            bio = json.dumps({"bio": self.fake.text()})

            user = {
                "user_id": user_id,
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
            users.append(user)
        return users

    def generate_listings(self, users, num_listings=10):
        listings = []
        for _ in range(num_listings):
            listing_id = str(uuid.uuid4())
            seller_id = random.choice(users)["user_id"]
            title = self.fake.catch_phrase()
            description = self.fake.text()
            price = round(random.uniform(10, 1000), 2)
            location = json.dumps({"latitude": str(self.fake.latitude()), "longitude": str(self.fake.longitude())})
            status = random.choice(["active", "sold", "pending"])
            listed_at = self.fake.date_time_this_year()
            last_updated_at = listed_at + timedelta(days=random.randint(0, 30))
            image_urls = json.dumps([self.fake.image_url() for _ in range(random.randint(1, 5))])
            latitude = self.fake.latitude()
            longitude = self.fake.longitude()

            listing = {
                "listing_id": listing_id,
                "seller_id": seller_id,
                "title": title,
                "description": description,
                "price": price,
                "location": location,
                "status": status,
                "listed_at": listed_at,
                "last_updated_at": last_updated_at,
                "image_urls": image_urls,
                "latitude": latitude,
                "longitude": longitude
            }
            listings.append(listing)
        return listings

    def generate_messages(self, users, listings, num_messages=10):
        messages = []
        for _ in range(num_messages):
            message_id = str(uuid.uuid4())
            sender_id = random.choice(users)["user_id"]
            receiver_id = random.choice([user["user_id"] for user in users if user["user_id"] != sender_id])
            listing_id = random.choice(listings)["listing_id"]
            message_content = self.fake.text()
            timestamp = self.fake.date_time_this_year()

            message = {
                "message_id": message_id,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "listing_id": listing_id,
                "message_content": message_content,
                "timestamp": timestamp
            }
            messages.append(message)
        return messages

    def generate_listing_ratings(self, users, listings, num_ratings=10):
        ratings = []
        for _ in range(num_ratings):
            listing_rating_id = str(uuid.uuid4())
            rated_listing_id = random.choice(listings)["listing_id"]
            rating_user_id = random.choice(users)["user_id"]
            rating_value = random.randint(1, 5)
            timestamp = self.fake.date_time_this_year()

            rating = {
                "listing_rating_id": listing_rating_id,
                "rated_listing_id": rated_listing_id,
                "rating_user_id": rating_user_id,
                "rating_value": rating_value,
                "timestamp": timestamp
            }
            ratings.append(rating)
        return ratings

    def generate_listing_reviews(self, users, listings, num_reviews=10):
        reviews = []
        for _ in range(num_reviews):
            listing_review_id = str(uuid.uuid4())
            reviewed_listing_id = random.choice(listings)["listing_id"]
            review_user_id = random.choice(users)["user_id"]
            review_content = self.fake.text()
            timestamp = self.fake.date_time_this_year()

            review = {
                "listing_review_id": listing_review_id,
                "reviewed_listing_id": reviewed_listing_id,
                "review_user_id": review_user_id,
                "review_content": review_content,
                "timestamp": timestamp
            }
            reviews.append(review)
        return reviews
