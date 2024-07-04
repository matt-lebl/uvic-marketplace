from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, SQLModel, create_engine
from app.core.config import Settings
from tests.data_factory import DataFactory
from app.main import app
import argon2

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
    response = client.post("/user/", json=user)
    assert response.status_code == 200
    assert response.json()["username"] == user["username"]


@pytest.mark.asyncio
async def test_update_user():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]
    assert response.status_code == 200
    assert response.json()["username"] == user["username"]

    new_user = data_factory.generate_user_update()
    response = client.patch(f"/user/{userID}", json=new_user)
    assert response.status_code == 200
    assert response.json()["username"] == new_user["username"]


@pytest.mark.asyncio
async def test_delete_user():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]
    assert response.status_code == 200
    assert response.json()["username"] == user["username"]

    response = client.delete(f"/user/{userID}")
    assert response.status_code == 200

    response_get = client.get(f"/user/{userID}")
    assert response_get.status_code == 401

    resp_del = client.delete(f"/user/{userID}")
    assert resp_del.status_code == 401


@pytest.mark.asyncio
async def test_get_user():
    user = data_factory.generate_user()
    create_response = client.post("/user/", json=user)
    assert create_response.status_code == 200
    userID = create_response.json()["userID"]

    response = client.get(f"/user/{userID}")
    assert response.status_code == 200
    assert response.json()["userID"] == userID


@pytest.mark.asyncio
async def test_login():
    user = data_factory.generate_user()
    p1 = user["password"]
    user["password"] = argon2.hash_password(user["password"].encode()).decode()

    create_response = client.post("/user/", json=user)
    assert create_response.status_code == 200

    login_req = DataFactory.generate_login_request(user["email"], p1)
    response = client.post(f"/user/login", json=login_req)
    assert response.status_code == 200

    login_req2 = dict(login_req)
    login_req2["password"] = argon2.hash_password("asdlf[kj".encode()).decode()
    response = client.post(f"/user/login", json=login_req2)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_totp():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]
    assert response.status_code == 200
    assert response.json()["username"] == user["username"]

    enc_key = data_factory.generate_totp_secret_encrypted()
    response = client.post(f"/user/add-totp-secret/{enc_key}/{userID}")
    assert response.status_code == 200

    response = client.get(f"/user/totp-secret/{userID}")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_all_users():
    user = data_factory.generate_user()
    client.post("/user/", json=user)
    user2 = data_factory.generate_user()
    client.post("/user/", json=user2)
    response = client.get("/user/")
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_create_listing():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    listing = data_factory.generate_listing()
    seller_id = response.json()["userID"]
    response = client.post(f"/listing/{seller_id}", json=listing)
    assert response.status_code == 200
    assert response.json()["title"] == listing["title"]


@pytest.mark.asyncio
async def test_get_listing():
    user = data_factory.generate_user()
    user_response = client.post("/user/", json=user)
    seller_id = user_response.json()["userID"]
    listing = data_factory.generate_listing()
    create_response = client.post(f"/listing/{seller_id}", json=listing)
    listingID = create_response.json()["listingID"]
    response = client.get(f"/listing/{listingID}")
    assert response.status_code == 200
    assert response.json()["listingID"] == listingID


@pytest.mark.asyncio
async def test_delete_listing():
    # Create a user
    user = data_factory.generate_user()
    user_response = client.post("/user/", json=user)
    user_id = user_response.json()["userID"]

    listing = data_factory.generate_listing()
    create_response = client.post(f"/listing/{user_id}", json=listing)

    listing_id = create_response.json()["listingID"]

    get_response = client.get(f"/listing/{listing_id}")
    assert get_response.status_code == 200
    assert get_response.json()["listingID"] == listing_id

    delete_response = client.delete(f"/listing/{listing_id}/{user_id}")
    assert delete_response.status_code == 200

    get_response_after_delete = client.get(f"/listing/{listing_id}")
    assert get_response_after_delete.status_code == 404

    another_user = data_factory.generate_user()
    another_user_response = client.post("/user/", json=another_user)
    another_user_id = another_user_response.json()["userID"]

    another_listing = data_factory.generate_listing()
    create_response_another = client.post(f"/listing/{user_id}", json=another_listing)
    another_listing_id = create_response_another.json()["listingID"]

    invalid_response = client.delete(f"listing/{another_listing_id}/{another_user_id}")
    assert invalid_response.status_code == 403


@pytest.mark.asyncio
async def test_update_listing():
    user = data_factory.generate_user()
    user_response = client.post("/user/", json=user)

    seller_id = user_response.json()["userID"]
    listing = data_factory.generate_listing()
    create_response = client.post(f"/listing/{seller_id}", json=listing)

    listingID = create_response.json()["listingID"]
    client.get(f"/listing/{listingID}")
    listing2 = data_factory.generate_listing()

    response = client.patch(f"/listing/{listingID}/{seller_id}", json=listing2)

    assert response.status_code == 200
    assert response.json()["dateModified"] != response.json()["dateCreated"]


@pytest.mark.asyncio
async def test_create_message():
    user1 = data_factory.generate_user()
    response = client.post("/user/", json=user1)
    assert response.status_code == 200
    user1_id = response.json()["userID"]

    user2 = data_factory.generate_user()
    response = client.post("/user/", json=user2)
    assert response.status_code == 200
    user2_id = response.json()["userID"]

    listing = data_factory.generate_listing()
    response = client.post(f"/listing/{user1_id}", json=listing)
    assert response.status_code == 200
    listingID = response.json()["listingID"]

    message = data_factory.generate_message(listingID, user1_id, user2_id)
    response = client.post("/messages/", json=message)
    assert response.status_code == 200
    assert response.json()["content"] == message["content"]


@pytest.mark.asyncio
async def test_get_overview():
    users = []
    listings = []
    user_ids = []
    listing_ids = []
    for i in range(10):
        users.append(data_factory.generate_user())
        listings.append(data_factory.generate_listing())

    for u in users:
        response = client.post("/user/", json=u)
        assert response.status_code == 200
        user_ids.append(response.json()["userID"])

    for i in range(10):
        response = client.post(f"/listing/{user_ids[i]}", json=listings[i])
        assert response.status_code == 200
        listing_ids.append(response.json()["listingID"])

    for lst in range(len(listing_ids)):
        for usr in range(len(user_ids)):
            if lst == usr:
                continue
            for i in range(5):
                message = data_factory.generate_message(listing_ids[lst], user_ids[lst], user_ids[usr])
                msg_response = client.post("/messages/", json=message)
                assert msg_response.status_code == 200

    final_resp = client.get(f"/messages/overview/{user_ids[0]}")
    assert final_resp.status_code == 200


@pytest.mark.asyncio
async def test_get_thread():
    user1 = data_factory.generate_user()
    response = client.post("/user/", json=user1)
    assert response.status_code == 200
    user1_id = response.json()["userID"]

    user2 = data_factory.generate_user()
    response = client.post("/user/", json=user2)
    assert response.status_code == 200
    user2_id = response.json()["userID"]

    listing = data_factory.generate_listing()
    response = client.post(f"/listing/{user1_id}", json=listing)
    assert response.status_code == 200
    listingID = response.json()["listingID"]

    for i in range(10):
        message = data_factory.generate_message(listingID, user1_id, user2_id)
        response = client.post("/messages/", json=message)
        assert response.status_code == 200

    final_response = client.get(f"/messages/thread/{listingID}/{user2_id}/{user1_id}")
    assert final_response.status_code == 200
    assert len(final_response.json()) == 10


@pytest.mark.asyncio
async def test_create_listing_review():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]

    listing = data_factory.generate_listing()
    response = client.post(f"/listing/{userID}", json=listing)
    listingID = response.json()["listingID"]

    review = data_factory.generate_listing_review(listingID)
    response = client.post(f"/review/{userID}", json=review)
    assert response.status_code == 200
    assert response.json()["comment"] == review["comment"]


@pytest.mark.asyncio
async def test_get_listing_review():
    user = data_factory.generate_user()
    user_response = client.post("/user/", json=user)
    userID = user_response.json()["userID"]
    listing = data_factory.generate_listing()
    listing_response = client.post(f"/listing/{userID}", json=listing)
    review = data_factory.generate_listing_review(listing_response.json()["listingID"])
    create_response = client.post(f"/review/{userID}", json=review)
    listing_review_id = create_response.json()["listing_review_id"]
    response = client.get(f"/review/{listing_review_id}")
    assert response.status_code == 200
    assert response.json()["listing_review_id"] == listing_review_id


@pytest.mark.asyncio
async def test_update_review():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]

    listing = data_factory.generate_listing()
    response = client.post(f"/listing/{userID}", json=listing)
    listingID = response.json()["listingID"]

    review = data_factory.generate_listing_review(listingID)
    response = client.post(f"/review/{userID}", json=review)

    review_id = response.json()["listing_review_id"]

    review2 = data_factory.generate_listing_review(listingID)
    response = client.patch(f"/review/{review_id}/asdf", json=review2)
    assert response.status_code == 403

    response2 = client.patch(f"/review/{review_id}/{userID}", json=review2)

    assert response2.status_code == 200
    assert response2.json()["dateModified"] != response2.json()["dateCreated"]


@pytest.mark.asyncio
async def test_delete_review():
    user = data_factory.generate_user()
    response = client.post("/user/", json=user)
    userID = response.json()["userID"]

    listing = data_factory.generate_listing()
    response = client.post(f"/listing/{userID}", json=listing)
    listingID = response.json()["listingID"]

    review = data_factory.generate_listing_review(listingID)
    response = client.post(f"/review/{userID}", json=review)

    review_id = response.json()["listing_review_id"]
    response = client.delete(f"/review/{review_id}/asdf")
    assert response.status_code == 403

    response2 = client.delete(f"/review/{review_id}/{userID}")
    assert response2.status_code == 200

# Deprecated
# @pytest.mark.asyncio
# async def test_get_all_listings():
#     user = data_factory.generate_user()
#     user_response = client.post("/user/", json=user)
#     userID = user_response.json()["userID"]
#     listing = data_factory.generate_listing()
#     client.post(f"/listing/{userID}", json=listing)
#
#     response = client.get("/listing/")
#     assert response.status_code == 200
#     assert len(response.json()) > 0


# Deprecated

# @pytest.mark.asyncio
# async def test_get_all_messages():
#     user1 = data_factory.generate_user()
#     user1_response = client.post("/user/", json=user1)
#     user2 = data_factory.generate_user()
#     user2_response = client.post("/user/", json=user2)
#     user1ID = user1_response.json()["userID"]
#     listing = data_factory.generate_listing()
#     listing_response = client.post(f"/listing/{user1ID}", json=listing)
#     message = data_factory.generate_message(listing_response.json()["listingID"], user1_response.json()["userID"],
#                                             user2_response.json()["userID"])
#     client.post("/messages/", json=message)
#
#     response = client.get("/messages/")
#     assert response.status_code == 200
#     assert len(response.json()) > 0


# @pytest.mark.asyncio
# async def test_get_message():
#     user1 = data_factory.generate_user()
#     user1_response = client.post("/user/", json=user1)
#     user2 = data_factory.generate_user()
#     user2_response = client.post("/user/", json=user2)
#     user1ID = user1_response.json()["userID"]
#     listing = data_factory.generate_listing()
#     listing_response = client.post(f"/listing/{user1ID}", json=listing)
#     message = data_factory.generate_message(listing_response.json()["listingID"], user1_response.json()["userID"],
#                                             user2_response.json()["userID"])
#     create_response = client.post("/messages/", json=message)
#     message_id = create_response.json()["message_id"]
#
#     response = client.get(f"/messages/{message_id}")
#     assert response.status_code == 200
#     assert response.json()["message_id"] == message_id
