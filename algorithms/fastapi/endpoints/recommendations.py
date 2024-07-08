from fastapi import APIRouter, Query, Header, HTTPException
from typing import List
from util.schemas import ListingSummary, ErrorMessage

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
            "listingID": "testing",
            "sellerID": "seller456",
            "sellerName": "John Doe",
            "title": "Used Calculus Textbook",
            "description": "No wear and tear, drop-off available.",
            "price": 50,
            "dateCreated": "2024-05-23T15:30:00Z",
            "imageUrl": "https://example.com/image",
        }
    ]