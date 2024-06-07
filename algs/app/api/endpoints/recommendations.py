from fastapi import APIRouter, Query, Header, HTTPException
from typing import List
from ...schemas import Listing, ErrorMessage

router = APIRouter()

@router.get("/recommendations", response_model=List[Listing], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def recommendations(page: int = Query(1),
                          limit: int = Query(20),
                          authorization: str = Header(...)):
    # SQL query logic here to fetch recommendations, I think sqlalchemy can be used to query the database
    return []
