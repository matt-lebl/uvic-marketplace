from fastapi import APIRouter, Query, Header, HTTPException
from typing import List, Optional
from ...schemas import Listing, ErrorMessage
from ...elasticsearch_wrapper import ElasticsearchWrapper
import torch
import numpy as np
from .embedding import generate_embedding, find_closest_matches

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

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
        # Generate the query embedding
        query_embedding = generate_embedding(query)

        # Create an elastic search for searching listings
        search_body = {
            "query": {
                "bool": {
                    "should": [
                        {
                            "script_score": {
                                "query": {"match_all": {}},
                                "script": {
                                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                    "params": {"query_vector": query_embedding}
                                }
                            }
                        },
                        {
                            "multi_match": {
                                "query": query,
                                "fields": ["title", "description"]
                            }
                        }
                    ],
                    "filter": []
                }
            },
            "from": (page - 1) * limit,
            "size": limit
        }
        
        # Note: the order matters: running "lexical" first prioritizes exact textual matches, semantic prioritizes similar content then sorts lexically. 
        
        # Perform the search query
        response = es.search(index="listings_index", body=search_body)


        # Extract documents from the response
        listings = [] 
        for doc in response['hits']['hits']:
            listings.append(Listing(id=doc["_id"], title=doc["_source"]["title"], 
                                    description=doc["_source"].get("description"), 
                                    price=doc["_source"]["price"], 
                                    location=doc["_source"]["location"]))
            
        print("Listings; {}".format(listings))
        return listings
    else:
        return []  # What do we return if no query?


