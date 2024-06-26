from fastapi import APIRouter, Query, Header, HTTPException
from typing import List
from ..schemas import ListingSummary, ErrorMessage

router = APIRouter()

@router.get("/recommendations", response_model=List[ListingSummary], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def recommendations(page: int = Query(1),
                          limit: int = Query(20),
                          authorization: str = Header(...)):
    # SQL query logic here to fetch recommendations, I think sqlalchemy can be used to query the database
   # return []

    # TODO: get userID of who is looking for recommendations
    # TODO: generate recommendations based on userID
    # TODO: return recommendations

    #TEST

    # Hardcoded response data
    return [
        {
            "listingID": "example1",
            "sellerID": "seller456",
            "sellerName": "John Doe",
            "title": "Used Calculus Textbook",
            "description": "No wear and tear, drop-off available.",
            "price": 50,
            "dateCreated": "2024-05-23T15:30:00Z",
            "imageUrl": "https://example.com/image",
        },
        {
            "listingID": "example2",
            "sellerID": "seller789",
            "sellerName": "Jane Smith",
            "title": "Soccer Ball",
            "description": "Slightly used, but still good",
            "price": 70,
            "dateCreated": "2024-06-01T10:00:00Z",
            "imageUrl": "https://example.com/image2",
        },
        {
            "listingID": "example3",
            "sellerID": "seller123",
            "sellerName": "Alice Johnson",
            "title": "Mountain Bike",
            "description": "Barely used, excellent condition.",
            "price": 300,
            "dateCreated": "2024-07-15T08:45:00Z",
            "imageUrl": "https://example.com/image3",
        },
        {
            "listingID": "example4",
            "sellerID": "seller321",
            "sellerName": "Bob Brown",
            "title": "Electric Guitar",
            "description": "Comes with amplifier, great sound.",
            "price": 150,
            "dateCreated": "2024-08-10T12:00:00Z",
            "imageUrl": "https://example.com/image4",
        },
        {
            "listingID": "example5",
            "sellerID": "seller654",
            "sellerName": "Charlie Davis",
            "title": "Gaming Laptop",
            "description": "High performance, like new.",
            "price": 1200,
            "dateCreated": "2024-09-05T14:20:00Z",
            "imageUrl": "https://example.com/image5",
        }
    ]