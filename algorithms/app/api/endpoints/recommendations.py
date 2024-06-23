from fastapi import APIRouter, Query, Header, HTTPException
from typing import List
from ...schemas import ListingSummary, ErrorMessage
# import base64
# import json

router = APIRouter()

@router.get("/recommendations", response_model=List[ListingSummary], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def recommendations(page: int = Query(1),
                          limit: int = Query(20),
                          authorization: str = Header(...)):
   
    # SQL query logic here to fetch recommendations, I think sqlalchemy can be used to query the database
        # Requirements
        # - provides suggestion results for 'item' 
        #      - core (15) based on users' click/view on item listing
        #      - additional (15) based on user reviews, search reuslts, purchase history

    # TODO: get userID of who is looking for recommendations
    # try:
    #     # Assuming the token is a Bearer token
    #     token = authorization.split(" ")[1]  # Split the header to get the token part
    #     payload_base64 = token.split('.')[1]  # Get the payload part of the token
    #     payload_bytes = base64.urlsafe_b64decode(payload_base64 + '==')  # Decode Base64
    #     payload = json.loads(payload_bytes)  # Convert JSON string to dictionary
    #     user_id = payload['user_id']  # Extract user_id from the token payload
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Invalid token")

    # temp userID - without real token auth
    user_id = "user123"


    # TODO: get recommendations based on userID
    # TODO: return recommendations

    #TEST

    # Hardcoded response data
    return [
        {
            "listingID": "testing",
            "sellerID": "seller456",
            "sellerName": "Guy Random",
            "title": "Used Calculus Textbook",
            "description": "No wear and tear, drop-off available.",
            "price": 50,
            "dateCreated": "2024-05-23T15:30:00Z",
            "imageUrl": "https://example.com/image",
        }
    ]