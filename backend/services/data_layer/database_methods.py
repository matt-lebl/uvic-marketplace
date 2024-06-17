import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb


class DatabaseMethods:
    @staticmethod
    def insert_users(conn, users):
        result = {"status_code": 0, "error": ""}

        with conn.cursor(row_factory=dict_row) as cursor:
            for user in users:
                try:
                    cursor.execute("""
                        INSERT INTO users (user_id, username, email, password, profile_picture_url, location, 
                        joining_date, items_sold, items_purchased, bio)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        user['user_id'], user['username'], user['email'], user['password'], user['profile_picture_url'],
                        Jsonb(user['location']), user['joining_date'], Jsonb(user['items_sold']),
                        Jsonb(user['items_purchased']),
                        Jsonb(user['bio'])
                    ))
                    conn.commit()
                except psycopg.errors.UniqueViolation as e:
                    conn.rollback()
                    result = {"status_code": 1, "error": f"Error inserting user {user['user_id']}: {e}"}
                    break

        return result

    @staticmethod
    def insert_listings(conn, listings):
        result = {"status_code": 0, "error": ""}

        with conn.cursor() as cursor:
            for listing in listings:
                try:
                    cursor.execute("""
                        INSERT INTO listings (listing_id, seller_id, title, description, price, location, 
                        status, listed_at, last_updated_at, image_urls, latitude, longitude)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        listing['listing_id'], listing['seller_id'], listing['title'], listing['description'],
                        listing['price'],
                        Jsonb(listing['location']), listing['status'], listing['listed_at'], listing['last_updated_at'],
                        Jsonb(listing['image_urls']), listing['latitude'], listing['longitude']
                    ))
                    conn.commit()
                except psycopg.errors.UniqueViolation as e:
                    conn.rollback()
                    result = {"status_code": 1, "error": f"Error inserting listing {listing['listing_id']}: {e}"}
                    break

        return result

    @staticmethod
    def insert_messages(conn, messages):
        result = {"status_code": 0, "error": ""}

        with conn.cursor() as cursor:
            for message in messages:
                try:
                    cursor.execute("""
                        INSERT INTO messages (message_id, sender_id, receiver_id, listing_id, message_content, 
                        timestamp)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        message['message_id'], message['sender_id'], message['receiver_id'], message['listing_id'],
                        message['message_content'], message['timestamp']
                    ))
                    conn.commit()
                except psycopg.errors.UniqueViolation as e:
                    conn.rollback()
                    result = {"status_code": 1, "error": f"Error inserting message {message['message_id']}: {e}"}
                    break

        return result

    @staticmethod
    def insert_listing_ratings(conn, ratings):
        result = {"status_code": 0, "error": ""}

        with conn.cursor() as cursor:
            for rating in ratings:
                try:
                    cursor.execute("""
                        INSERT INTO listing_ratings (listing_rating_id, rated_listing_id, rating_user_id, rating_value, 
                        timestamp)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        rating['listing_rating_id'], rating['rated_listing_id'], rating['rating_user_id'],
                        rating['rating_value'],
                        rating['timestamp']
                    ))
                    conn.commit()
                except psycopg.errors.UniqueViolation as e:
                    conn.rollback()
                    result = {"status_code": 1, "error": f"Error inserting rating {rating['listing_rating_id']}: {e}"}
                    break

        return result

    @staticmethod
    def insert_listing_reviews(conn, reviews):
        result = {"status_code": 0, "error": ""}

        with conn.cursor() as cursor:
            for review in reviews:
                try:
                    cursor.execute("""
                        INSERT INTO listing_reviews (listing_review_id, reviewed_listing_id, review_user_id, 
                        review_content, timestamp)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        review['listing_review_id'], review['reviewed_listing_id'], review['review_user_id'],
                        review['review_content'],
                        review['timestamp']
                    ))
                    conn.commit()
                except psycopg.errors.UniqueViolation as e:
                    conn.rollback()
                    result = {"status_code": 1, "error": f"Error inserting review {review['listing_review_id']}: {e}"}
                    break

        return result
