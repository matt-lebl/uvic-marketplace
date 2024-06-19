from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, SQLModel, create_engine
from app.routers.dependencies import Settings
from tests.data_factory import DataFactory
from app.main import app

test_settings = Settings()
TEST_DATABASE_URL = test_settings.database_url
test_engine = create_engine(TEST_DATABASE_URL)

SQLModel.metadata.create_all(test_engine)


def override_get_session():
    with Session(test_engine) as session:
        yield session


app.dependency_overrides[Session] = override_get_session
client = TestClient(app)
data_factory = DataFactory()


@pytest.mark.asyncio
async def test_create_user():
    user = data_factory.generate_user()
    response = client.post("/users/", json=user)
    assert response.status_code == 200
    assert response.json()["username"] == user["username"]


@pytest.mark.asyncio
async def test_create_listing():
    user = data_factory.generate_user()
    response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(response.json()["user_id"])
    response = client.post("/listings/", json=listing)
    assert response.status_code == 200
    assert response.json()["title"] == listing["title"]


@pytest.mark.asyncio
async def test_create_message():
    user1 = data_factory.generate_user()
    response = client.post("users/", json=user1)
    user1_id = response.json()["user_id"]

    user2 = data_factory.generate_user()
    response = client.post("/users/", json=user2)
    user2_id = response.json()["user_id"]

    listing = data_factory.generate_listing(user1_id)
    response = client.post("/listings/", json=listing)
    listing_id = response.json()["listing_id"]

    message = data_factory.generate_message(listing_id, user1_id, user2_id)
    response = client.post("/messages/", json=message)
    assert response.status_code == 200
    assert response.json()["message_content"] == message["message_content"]


@pytest.mark.asyncio
async def test_create_listing_rating():
    user = data_factory.generate_user()
    response = client.post("/users/", json=user)
    user_id = response.json()["user_id"]

    listing = data_factory.generate_listing(user_id)
    response = client.post("/listings/", json=listing)
    listing_id = response.json()["listing_id"]

    rating = data_factory.generate_listing_rating(listing_id, user_id)
    response = client.post("/listings/ratings/", json=rating)
    assert response.status_code == 200
    assert response.json()["rating_value"] == rating["rating_value"]


@pytest.mark.asyncio
async def test_create_listing_review():
    user = data_factory.generate_user()
    response = client.post("/users/", json=user)
    user_id = response.json()["user_id"]

    listing = data_factory.generate_listing(user_id)
    response = client.post("/listings/", json=listing)
    listing_id = response.json()["listing_id"]

    review = data_factory.generate_listing_review(listing_id, user_id)
    response = client.post("/listings/reviews/", json=review)
    assert response.status_code == 200
    assert response.json()["review_content"] == review["review_content"]


@pytest.mark.asyncio
async def test_get_all_users():
    user = data_factory.generate_user()
    client.post("/users/", json=user)

    response = client.get("/users/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_user():
    user = data_factory.generate_user()
    create_response = client.post("/users/", json=user)
    user_id = create_response.json()["user_id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["user_id"] == user_id


@pytest.mark.asyncio
async def test_get_all_listings():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    client.post("/listings/", json=listing)

    response = client.get("/listings/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    create_response = client.post("/listings/", json=listing)
    listing_id = create_response.json()["listing_id"]

    response = client.get(f"/listings/{listing_id}")
    assert response.status_code == 200
    assert response.json()["listing_id"] == listing_id


@pytest.mark.asyncio
async def test_get_all_messages():
    user1 = data_factory.generate_user()
    user1_response = client.post("/users/", json=user1)
    user2 = data_factory.generate_user()
    user2_response = client.post("/users/", json=user2)
    listing = data_factory.generate_listing(user1_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    message = data_factory.generate_message(listing_response.json()["listing_id"], user1_response.json()["user_id"],
                                            user2_response.json()["user_id"])
    client.post("/messages/", json=message)

    response = client.get("/messages/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_message():
    user1 = data_factory.generate_user()
    user1_response = client.post("/users/", json=user1)
    user2 = data_factory.generate_user()
    user2_response = client.post("/users/", json=user2)
    listing = data_factory.generate_listing(user1_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    message = data_factory.generate_message(listing_response.json()["listing_id"], user1_response.json()["user_id"],
                                            user2_response.json()["user_id"])
    create_response = client.post("/messages/", json=message)
    message_id = create_response.json()["message_id"]

    response = client.get(f"/messages/{message_id}")
    assert response.status_code == 200
    assert response.json()["message_id"] == message_id


@pytest.mark.asyncio
async def test_get_all_listing_ratings():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    rating = data_factory.generate_listing_rating(listing_response.json()["listing_id"],
                                                  user_response.json()["user_id"])
    client.post("/listings/ratings/", json=rating)

    response = client.get("/listings/ratings/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing_rating():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    rating = data_factory.generate_listing_rating(listing_response.json()["listing_id"],
                                                  user_response.json()["user_id"])
    create_response = client.post("/listings/ratings/", json=rating)
    listing_rating_id = create_response.json()["listing_rating_id"]

    response = client.get(f"/listings/ratings/{listing_rating_id}")
    assert response.status_code == 200
    assert response.json()["listing_rating_id"] == listing_rating_id


@pytest.mark.asyncio
async def test_get_all_listing_reviews():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    review = data_factory.generate_listing_review(listing_response.json()["listing_id"],
                                                  user_response.json()["user_id"])
    client.post("/listings/reviews/", json=review)

    response = client.get("/listings/reviews/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing_review():
    user = data_factory.generate_user()
    user_response = client.post("/users/", json=user)
    listing = data_factory.generate_listing(user_response.json()["user_id"])
    listing_response = client.post("/listings/", json=listing)
    review = data_factory.generate_listing_review(listing_response.json()["listing_id"],
                                                  user_response.json()["user_id"])
    create_response = client.post("/listings/reviews/", json=review)
    listing_review_id = create_response.json()["listing_review_id"]

    response = client.get(f"/listings/reviews/{listing_review_id}")
    assert response.status_code == 200
    assert response.json()["listing_review_id"] == listing_review_id
