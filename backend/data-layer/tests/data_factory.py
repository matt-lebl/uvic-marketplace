import random
import uuid
import argon2
from faker import Faker
import pyotp
from cryptography.fernet import Fernet
from datetime import datetime

class DataFactory:
    def __init__(self):
        self.fake = Faker()
        self.fernet = Fernet(Fernet.generate_key())
        self.hasher = argon2.PasswordHasher()

    def generate_user(self, need_password=False):
        password = self.fake.password()
        user_data = {
            "username": self.fake.user_name(),
            "name": self.fake.name(),
            "email": self.fake.email(),
            "password": self.hasher.hash(password),
            "totp_secret": pyotp.random_base32(),
            "validation_code": self.fake.uuid4()
        }
        if need_password:
            return user_data, password
        return user_data

    def generate_user_update(self):
        return {
            "username": self.fake.user_name(),
            "name": self.fake.name(),
            "bio": self.fake.text(),
            "profilePictureUrl": self.fake.image_url(),
            "ignoreCharityListings": random.choice([True, False])
        }

    def generate_listing(self):
        title = self.fake.catch_phrase()
        description = self.fake.text()
        price = float(round(random.uniform(10, 1000), 2))
        image_urls = [{"url": self.fake.image_url()} for _ in range(random.randint(1, 5))]
        latitude = float(self.fake.latitude())
        longitude = float(self.fake.longitude())

        listing = {
            "listing": {
                "title": title,
                "price": price,
                "description": description,
                "images": image_urls,
                "location": {"latitude": latitude, "longitude": longitude},
                "markedForCharity": True
            }
        }
        return listing

    def generate_message(self, listing, sender, receiver):
        sender_id = sender
        receiver_id = receiver
        listing_id = listing
        message_content = self.fake.text()
        sent_at = int(datetime.timestamp(self.fake.date_time_this_year()))

        message = {
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
            "reviewerName": self.fake.name(),
            "listingID": reviewed_listing_id,
            "comment": review_content,
            "stars": stars,
            "userID": str(uuid.uuid4()),
            "dateCreated": self.fake.date_time_this_year().isoformat(),
            "dateModified": self.fake.date_time_this_year().isoformat()
        }
        return review

    def generate_totp_secret_encrypted(self):
        key = pyotp.random_base32()
        encrypted_key = self.fernet.encrypt(key.encode()).decode()
        return encrypted_key

    @classmethod
    def generate_login_request(cls, email, password):
        return {
            "email": email,
            "password": password,
            "totp_code": pyotp.TOTP(pyotp.random_base32()).now()
        }
