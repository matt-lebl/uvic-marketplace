import os
from pathlib import Path
import psycopg
from dotenv import load_dotenv
from database_methods import DatabaseMethods as dbm
from test_generators import DataFactory

from unittest import TestCase
import unittest


class TestDBFunctions(TestCase):

    def test_populate_database(self):
        env_path = Path('..') / '.env'
        load_dotenv(dotenv_path=env_path)
        dbname = os.getenv("POSTGRES_DB")
        postgres_user = os.getenv("POSTGRES_USER")
        postgres_password = os.getenv("POSTGRES_PASSWORD")
        host = os.getenv("DB_HOST")
        port = os.getenv("DB_PORT")
        c_string = f'dbname={dbname} user={postgres_user} password={postgres_password} host={host} port={port}'
        factory = DataFactory()
        num_tests = 10
        users = factory.generate_users(num_users=num_tests)
        listings = factory.generate_listings(users, num_listings=num_tests)
        messages = factory.generate_messages(users, listings, num_messages=num_tests)
        ratings = factory.generate_listing_ratings(users, listings, num_ratings=num_tests)
        reviews = factory.generate_listing_reviews(users, listings, num_reviews=num_tests)

        with psycopg.connect(c_string) as conn:
            user_result = dbm.insert_users(conn, users)
            self.assertEqual(user_result["status_code"], 0)
            listing_result = dbm.insert_listings(conn, listings)
            self.assertEqual(listing_result["status_code"], 0)
            message_result = dbm.insert_messages(conn, messages)
            self.assertEqual(message_result["status_code"], 0)
            rating_result = dbm.insert_listing_ratings(conn, ratings)
            self.assertEqual(rating_result["status_code"], 0)
            review_result = dbm.insert_listing_reviews(conn, reviews)
            self.assertEqual(review_result["status_code"], 0)


if __name__ == "__main__":
    unittest.main()
