 CREATE TABLE users (
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
  );

CREATE TABLE listings (
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
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    message_content TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
);

CREATE TABLE listing_ratings (
    listing_rating_id TEXT PRIMARY KEY,
    rated_listing_id TEXT NOT NULL,
    rating_user_id TEXT NOT NULL,
    rating_value INT,
    timestamp TIMESTAMP,
    FOREIGN KEY (rated_listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (rating_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE listing_reviews (
  listing_review_id TEXT PRIMARY KEY,
  reviewed_listing_id TEXT NOT NULL,
  review_user_id TEXT NOT NULL,
  review_content TEXT,
  timestamp TIMESTAMP,
  FOREIGN KEY (reviewed_listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
  FOREIGN KEY (review_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_listings_seller_id ON listings (seller_id);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_listings_listed_at ON listings (listed_at);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_listing_id ON messages (listing_id);
CREATE INDEX idx_messages_timestamp ON messages (timestamp);
CREATE INDEX idx_listing_ratings_rated_listing_id ON listing_ratings (rated_listing_id);
CREATE INDEX idx_listing_ratings_rating_user_id ON listing_ratings (rating_user_id);
CREATE INDEX idx_listing_ratings_rating_value ON listing_ratings (rating_value);
CREATE INDEX idx_listing_ratings_timestamp ON listing_ratings (timestamp);
CREATE INDEX idx_listing_reviews_reviewed_listing_id ON listing_reviews (reviewed_listing_id);
CREATE INDEX idx_listing_reviews_review_user_id ON listing_reviews (review_user_id);
CREATE INDEX idx_listing_reviews_timestamp ON listing_reviews (timestamp);
