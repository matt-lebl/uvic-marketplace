import pytest
from httpx import AsyncClient
from sqlmodel import Session, SQLModel, create_engine
from data_layer import app, Settings
from data_factory import DataFactory

test_settings = Settings()
TEST_DATABASE_URL = test_settings.database_url
test_engine = create_engine(TEST_DATABASE_URL)

SQLModel.metadata.create_all(test_engine)


def override_get_session():
    with Session(test_engine) as session:
        yield session


app.dependency_overrides[Session] = override_get_session

data_factory = DataFactory()


@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user)
        assert response.status_code == 200
        assert response.json()["username"] == user["username"]


@pytest.mark.asyncio
async def test_create_listing():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(response.json()["user_id"])
        response = await ac.post("/create/listings/", json=listing)
        assert response.status_code == 200
        assert response.json()["title"] == listing["title"]


@pytest.mark.asyncio
async def test_create_message():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user1 = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user1)
        user1_id = response.json()["user_id"]

        user2 = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user2)
        user2_id = response.json()["user_id"]

        listing = data_factory.generate_listing(user1_id)
        response = await ac.post("/create/listings/", json=listing)
        listing_id = response.json()["listing_id"]

        message = data_factory.generate_message(listing_id, user1_id, user2_id)
        response = await ac.post("/create/messages/", json=message)
        assert response.status_code == 200
        assert response.json()["message_content"] == message["message_content"]


@pytest.mark.asyncio
async def test_create_listing_rating():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user)
        user_id = response.json()["user_id"]

        listing = data_factory.generate_listing(user_id)
        response = await ac.post("/create/listings/", json=listing)
        listing_id = response.json()["listing_id"]

        rating = data_factory.generate_listing_rating(listing_id, user_id)
        response = await ac.post("/create/listing_ratings/", json=rating)
        assert response.status_code == 200
        assert response.json()["rating_value"] == rating["rating_value"]


@pytest.mark.asyncio
async def test_create_listing_review():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        response = await ac.post("/create/users/", json=user)
        user_id = response.json()["user_id"]

        listing = data_factory.generate_listing(user_id)
        response = await ac.post("/create/listings/", json=listing)
        listing_id = response.json()["listing_id"]

        review = data_factory.generate_listing_review(listing_id, user_id)
        response = await ac.post("/create/listing_reviews/", json=review)
        assert response.status_code == 200
        assert response.json()["review_content"] == review["review_content"]


@pytest.mark.asyncio
async def test_get_all_users():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        await ac.post("/create/users/", json=user)

        response = await ac.get("/users/")
        assert response.status_code == 200
        assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        create_response = await ac.post("/create/users/", json=user)
        user_id = create_response.json()["user_id"]

        response = await ac.get(f"/users/{user_id}")
        assert response.status_code == 200
        assert response.json()["user_id"] == user_id


@pytest.mark.asyncio
async def test_get_all_listings():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        await ac.post("/create/listings/", json=listing)

        response = await ac.get("/listings/")
        assert response.status_code == 200
        assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        create_response = await ac.post("/create/listings/", json=listing)
        listing_id = create_response.json()["listing_id"]

        response = await ac.get(f"/listings/{listing_id}")
        assert response.status_code == 200
        assert response.json()["listing_id"] == listing_id


@pytest.mark.asyncio
async def test_get_all_messages():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user1 = data_factory.generate_user()
        user1_response = await ac.post("/create/users/", json=user1)
        user2 = data_factory.generate_user()
        user2_response = await ac.post("/create/users/", json=user2)
        listing = data_factory.generate_listing(user1_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        message = data_factory.generate_message(listing_response.json()["listing_id"], user1_response.json()["user_id"],
                                                user2_response.json()["user_id"])
        await ac.post("/create/messages/", json=message)

        response = await ac.get("/messages/")
        assert response.status_code == 200
        assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_message():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user1 = data_factory.generate_user()
        user1_response = await ac.post("/create/users/", json=user1)
        user2 = data_factory.generate_user()
        user2_response = await ac.post("/create/users/", json=user2)
        listing = data_factory.generate_listing(user1_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        message = data_factory.generate_message(listing_response.json()["listing_id"], user1_response.json()["user_id"],
                                                user2_response.json()["user_id"])
        create_response = await ac.post("/create/messages/", json=message)
        message_id = create_response.json()["message_id"]

        response = await ac.get(f"/messages/{message_id}")
        assert response.status_code == 200
        assert response.json()["message_id"] == message_id


@pytest.mark.asyncio
async def test_get_all_listing_ratings():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        rating = data_factory.generate_listing_rating(listing_response.json()["listing_id"],
                                                      user_response.json()["user_id"])
        await ac.post("/create/listing_ratings/", json=rating)

        response = await ac.get("/listing_ratings/")
        assert response.status_code == 200
        assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing_rating():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        rating = data_factory.generate_listing_rating(listing_response.json()["listing_id"],
                                                      user_response.json()["user_id"])
        create_response = await ac.post("/create/listing_ratings/", json=rating)
        listing_rating_id = create_response.json()["listing_rating_id"]

        response = await ac.get(f"/listing_ratings/{listing_rating_id}")
        assert response.status_code == 200
        assert response.json()["listing_rating_id"] == listing_rating_id


@pytest.mark.asyncio
async def test_get_all_listing_reviews():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        review = data_factory.generate_listing_review(listing_response.json()["listing_id"],
                                                      user_response.json()["user_id"])
        await ac.post("/create/listing_reviews/", json=review)

        response = await ac.get("/listing_reviews/")
        assert response.status_code == 200
        assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_listing_review():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        user = data_factory.generate_user()
        user_response = await ac.post("/create/users/", json=user)
        listing = data_factory.generate_listing(user_response.json()["user_id"])
        listing_response = await ac.post("/create/listings/", json=listing)
        review = data_factory.generate_listing_review(listing_response.json()["listing_id"],
                                                      user_response.json()["user_id"])
        create_response = await ac.post("/create/listing_reviews/", json=review)
        listing_review_id = create_response.json()["listing_review_id"]

        response = await ac.get(f"/listing_reviews/{listing_review_id}")
        assert response.status_code == 200
        assert response.json()["listing_review_id"] == listing_review_id
