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
