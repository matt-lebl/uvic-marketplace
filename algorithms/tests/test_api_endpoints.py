import httpx
import pytest
from app.schemas import Listing

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_create_listing_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        new_listing = {
            "id": 123456,
            "title": "Brand New Golf Clubs",
            "description": "A set of top quality golf clubs.",
            "price": 300.00,
            #"status": "available",
            "location": "San Francisco"
        }

        # Send a POST request to create a new listing
        response = await client.post(
            "/api/listing",
            json={"listing": new_listing},
            headers={"authorization": "Bearer testtoken"}
        )
        
        # Print the response for debugging
        print(response.json())

        # Assert the response status code and check if the listing is returned with an ID
        assert response.status_code == 201
        #assert "id" in response.json()['listing']  # Ensure the listing in the response has an ID
        #assert response.json()['listing']['title'] == new_listing['title']

@pytest.mark.asyncio
async def test_search_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.get(
            "/api/search",
            params={"query": "golf clubs", "latitude": 34.2331, "longitude": -124.2323},
            headers={"authorization": "Bearer testtoken"}
        )
        print(response)
        assert response.status_code == 200
        #assert "listings" in response.json()

@pytest.mark.asyncio
async def test_recommendations_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.get(
            "/api/recommendations",
            headers={"authorization": "Bearer testtoken"}
        )
        assert response.status_code == 200
        #assert isinstance(response.json(), list)



# Start of Async tests 
@pytest.fixture
async def async_client():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        yield client

@pytest.mark.asyncio
async def test_add_listing(async_client):
    # Arrange
    listing_data = {
        "listing": {
            "title": "Used Calculus Textbook",
            "description": "No wear and tear, drop-off available.",
            "price": 50,
            "location": {
                "latitude": 34.23551,
                "longitude": -104.54451
            },
            "images": [
                {
                    "url": "https://example.com/image"
                }
            ]
        }
    }
    
    # Act
    response = await async_client.post("/api/listing", json=listing_data)
    
    # Assert
    assert response.status_code == 201
    response_data = response.json()
    assert response_data['title'] == listing_data['listing']['title']
    assert response_data['description'] == listing_data['listing']['description']
    assert response_data['price'] == listing_data['listing']['price']
    assert response_data['location'] == listing_data['listing']['location']
    assert response_data['images'] == listing_data['listing']['images']

@pytest.mark.asyncio
async def test_search(async_client):
    # Arrange
    query_params = {
        "query": "Calculus",
        "latitude": 34.23551,
        "longitude": -104.54451
    }
    
    # Act
    response = await async_client.get("/api/search", params=query_params)
    
    # Assert
    assert response.status_code == 200
    listings = response.json()
    assert isinstance(listings, list)
    assert len(listings) > 0
    for listing in listings:
        assert "listingID" in listing
        assert "sellerID" in listing
        assert "sellerName" in listing
        assert "title" in listing
        assert "description" in listing
        assert "price" in listing
        assert "dateCreated" in listing
        assert "imageUrl" in listing

@pytest.mark.asyncio
async def test_search_invalid_request(async_client):
    # Arrange
    query_params = {
        # Missing required 'query' parameter
        "latitude": 34.23551,
        "longitude": -104.54451
    }
    
    # Act
    response = await async_client.get("/api/search", params=query_params)
    
    # Assert
    assert response.status_code == 400
    error_response = response.json()
    assert "error" in error_response
    assert error_response["error"] == "missing parameter in request"

@pytest.mark.asyncio
async def test_recommendations(async_client):
    # Arrange
    query_params = {
        "page": 1,
        "limit": 5
    }
    
    # Act
    response = await async_client.get("/api/recommendations", params=query_params)
    
    # Assert
    assert response.status_code == 200
    recommendations = response.json()
    assert isinstance(recommendations, list)
    for recommendation in recommendations:
        assert "listingID" in recommendation
        assert "sellerID" in recommendation
        assert "sellerName" in recommendation
        assert "title" in recommendation
        assert "description" in recommendation
        assert "price" in recommendation
        assert "dateCreated" in recommendation
        assert "imageUrl" in recommendation

@pytest.mark.asyncio
async def test_recommendations_invalid_request(async_client):
    # Arrange
    query_params = {
        # Missing required 'page' parameter
        "limit": 5
    }
    
    # Act
    response = await async_client.get("/api/recommendations", params=query_params)
    
    # Assert
    assert response.status_code == 400
    error_response = response.json()
    assert "error" in error_response
    assert error_response["error"] == "missing parameter in request"