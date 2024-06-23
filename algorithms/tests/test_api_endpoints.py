import httpx
import pytest
from app.schemas import Listing
from app.elasticsearch_wrapper import ElasticsearchWrapper

# Change to http://localhost:8000 for local testing on host
BASE_URL = "http://fastapi:80"
ELASTICSEARCH_BASE_URL = "http://elasticsearch:9200"

ElasticsearchWrapper.use_test_instance()

@pytest.mark.asyncio
async def test_create_listing_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        new_listing = {
            "listing": {
                "listingID": "randomID1234",
                "title": "golf clubs",
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

        # Delete the listing if it already exists
        delete_response = await client.delete(
            "/api/listing/randomID1234",
            headers={"authorization": "Bearer testtoken"}
        )

        # Send a POST request to create a new listing
        response = await client.post(
            "/api/listing",
            json=new_listing,
            headers={"authorization": "Bearer testtoken"}
        )
        
        # Print the response for debugging
        if response.headers["Content-Type"] == "application/json":
            print(response.json())
        else:
            print("Response is not in JSON format.")
            print("Response:", response.text)

        assert response.status_code == 201
    
# NOTE: To test if an item is in the SQL DB do the following:
# 1. Open the terminal for the 'db' docker container
# 2. Run `psql -U user -d mydatabase`
# 3. Run `SELECT * from listings` (or users or interactions)

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




### Test the API response fields ###

@pytest.mark.asyncio
async def test_add_listing_response():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Arrange - create a new item to list
        listing_data = {
            "listing": {
                "listingID": "A23F29039B23",
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

        # Delete the listing if it already exists
        delete_response = await client.delete(
            "/api/listing/A23F29039B23",
            headers={"authorization": "Bearer testtoken"}
        )
            
        # Act - POST the new item listing request
        response = await client.post(
            "/api/listing", 
            json=listing_data,
            headers={"authorization": "Bearer testtoken"}
        )
        
        # Assert - check all response fields
        assert response.status_code == 201
        response_data = response.json()
        assert response_data['listing']['listingID'] == listing_data['listing']['listingID']
        assert response_data['listing']['title'] == listing_data['listing']['title']
        assert response_data['listing']['description'] == listing_data['listing']['description']
        assert response_data['listing']['price'] == listing_data['listing']['price']
        assert response_data['listing']['location'] == listing_data['listing']['location']
       

@pytest.mark.asyncio
async def test_search_response():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Arrange - List new item & search query
        listing_data = {
            "listing": {
                "listingID": "unique123",
                "title": "Used Calculus Textbook",
                "description": "math textbook, no wear and tear.",
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

        # Delete the listing if it already exists
        delete_response = await client.delete(
            "/api/listing/unique123",
            headers={"authorization": "Bearer testtoken"}
        )

        post_response = await client.post(
            "/api/listing", 
            json=listing_data,
            headers={"authorization": "Bearer testtoken"}
        )
        assert post_response.status_code == 201 # insure that POST was successful 

        query_params = {
            "query": "Calculus Book",
            "latitude": 34.23551,
            "longitude": -104.54451
        }

        # Act - Get search info
        response = await client.get(
            "/api/search", 
            params=query_params,
            headers={"authorization": "Bearer testtoken"}
            )
        
        # Assert - Check all fields of search response
        assert response.status_code == 200
        listings = response.json()['items']
        print(listings)
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
async def test_search_invalid_request():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Arrange - Create incomplete query
        query_params = {
            # Missing required 'query' parameter
            "latitude": 34.23551,
            "longitude": -104.54451
        }
        
        # Act - Send incomplete query
        response = await client.get(
            "/api/search", 
            params=query_params,
            headers={"authorization": "Bearer testtoken"}
            )
        
        # Assert - Check status code (and error message)
        assert 400 <= response.status_code < 500

@pytest.mark.asyncio
async def test_recommendations_response():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Arrange - List new item & recommendation query
        listing_data = {
            "listing": {
                "listingID": "abc123",
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

        # Delete the listing if it already exists
        delete_response = await client.delete(
            "/api/listing/abc123",
            headers={"authorization": "Bearer testtoken"}
        )

        post_response = await client.post(
            "/api/listing", 
            json=listing_data,
            headers={"authorization": "Bearer testtoken"}
        )
        assert post_response.status_code == 201  # Ensure the listing was created successfully

        query_params = {
            "page": 1,
            "limit": 5
        }
        
        # Act - Get recommendations
        response = await client.get(
            "/api/recommendations", 
            params=query_params,
            headers={"authorization": "Bearer testtoken"}
            )
        

        # Assert - Check all fields of recommendation response
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
async def test_recommendations_invalid_request():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Arrange - Create incomplete query
        query_params = {
            # Missing required 'page' parameter
            "limit": 5
        }
        
        # Act - Send incomplete query
        response = await client.get("/api/recommendations", params=query_params)
        
        # Assert - Check status code (and error message)
        assert 400 <= response.status_code < 500
