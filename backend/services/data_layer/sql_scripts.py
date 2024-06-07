class SqlScripts:

    USERS_TABLE = """CREATE TABLE users (
      user_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profile_picture_url TEXT,
      location JSONB,
      joining_date TIMESTAMP NOT NULL,
      items_sold JSONB,
      items_purchased JSONB,
      bio JSONB
      )"""

    LISTINGS_TABLE = """CREATE TABLE listings (
      listing_id TEXT PRIMARY KEY,
      seller_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price FLOAT,
      location JSONB,
      status TEXT,
      listed_at TIMESTAMP,
      last_updated_at TIMESTAMP,
      image_urls JSONB,
      latitude FLOAT,
      longitude FLOAT,
      FOREIGN KEY (seller_id) REFERENCES users(user_id)
      )"""

    MESSAGES_TABLE = """CREATE TABLE messages (
      message_id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      listing_id TEXT NOT NULL,
      message_content TEXT,
      timestamp TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(user_id),
      FOREIGN KEY (receiver_id) REFERENCES users(user_id),
      FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
      )"""

    LISTING_RATINGS_TABLE = """CREATE TABLE listing_ratings (
      listing_rating_id TEXT PRIMARY KEY,
      rated_listing_id TEXT NOT NULL,
      rating_user_id TEXT NOT NULL,
      rating_value INT,
      timestamp TIMESTAMP,
      FOREIGN KEY (rated_listing_id) REFERENCES listings(listing_id),
      FOREIGN KEY (rating_user_id) REFERENCES users(user_id)
      )"""

    LISTING_REVIEWS_TABLE = """CREATE TABLE listing_reviews (
      listing_review_id TEXT PRIMARY KEY,
      reviewed_listing_id TEXT NOT NULL,
      review_user_id TEXT NOT NULL,
      review_content TEXT,
      timestamp TIMESTAMP,
      FOREIGN KEY (reviewed_listing_id) REFERENCES listings(listing_id),
      FOREIGN KEY (review_user_id) REFERENCES users(user_id)
      )"""

    PROVISION_SCRIPTS = [USERS_TABLE, LISTINGS_TABLE, LISTING_RATINGS_TABLE, LISTING_REVIEWS_TABLE]
