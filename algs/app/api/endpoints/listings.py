from fastapi import APIRouter, Body, Header, HTTPException, status
from typing import Optional
from ...schemas import Listing, ErrorMessage
from elasticsearch import Elasticsearch
from typing import Dict, Optional


router = APIRouter()

es = Elasticsearch("http://elasticsearch:9200")

@router.post("/listing", response_model=Listing, responses={201: {"model": Listing}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_listing(listing: Dict = Body(...), authorization: Optional[str] = Header(None)):
    try:
        # Save the listing to Elasticsearch
        print("here1")
        print(listing)
        response = es.index(index="listings", id=listing['id'], body=listing)
        print("Here")
        print(response)
        if response.get('result') != 'created':
            raise HTTPException(status_code=500, detail="Failed to create listing in Elasticsearch")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Construct the response object by converting the dict back to a Pydantic model
    return listing
