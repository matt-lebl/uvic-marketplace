from fastapi import APIRouter, Query, Header, HTTPException
from typing import List, Optional
from ...schemas import Listing, ErrorMessage
from elasticsearch import Elasticsearch
import torch
import numpy as np
from .embedding import generate_embedding, find_closest_matches

router = APIRouter()

es = Elasticsearch("http://elasticsearch:9200")

@router.get("/search", response_model=List[Listing], responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def search(authorization: str = Header(...),
                 query: Optional[str] = Query(None),
                 minPrice: Optional[int] = Query(None),
                 maxPrice: Optional[int] = Query(None),
                 status: Optional[str] = Query(None),
                 searchType: str = Query("LISTINGS"),
                 latitude: float = Query(...),
                 longitude: float = Query(...),
                 sort: Optional[str] = Query(None),
                 page: int = Query(1),
                 limit: int = Query(20)):
    if query:
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title", "description"]  # Adjust fields based on Elasticsearch structure


                    #####CHNAGE THIS
                }
            },
        }
        
        # Perform the search query
        response = es.search(index="listings", body=search_body)

        # Extract descriptions and embeddings from listings
        descriptions = [doc["_source"]["description"] for doc in response['hits']['hits']]
        embeddings = np.array([doc["_source"]["embedding"] for doc in response['hits']['hits']])
        
        # Find the closest matches
        closest_descriptions = find_closest_matches(query, embeddings, descriptions, n=limit)


        # Extract documents from the response
        listings = [] 
        for description in closest_descriptions:
            for doc in response['hits']['hits']:
                if doc["_source"]["description"] == description:
                    listings.append(Listing(id=doc["_id"], title=doc["_source"]["title"], 
                                            description=doc["_source"].get("description"), 
                                            price=doc["_source"]["price"], 
                                            location=doc["_source"]["location"]))
                    break
            
        print("Listings; {}".format(listings))
        return listings
    else:
        return []  # What do we return if no query?


