from fastapi import APIRouter, Query, Header, HTTPException
from typing import List, Optional
from ...schemas import ListingSummary, SearchResponse, ErrorMessage
from ...elasticsearch_wrapper import ElasticsearchWrapper
import torch
import numpy as np
from .embedding import generate_embedding, find_closest_matches

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.get("/search", response_model=SearchResponse, responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def search(authorization: str = Header(...),
                 query: str = Query(...), # in the OpenAPI specs this is optional... 
                 minPrice: Optional[int] = Query(None),
                 maxPrice: Optional[int] = Query(None),
                 status: Optional[str] = Query(None),
                 searchType: Optional[str] = Query("LISTINGS"),
                 latitude: float = Query(...),
                 longitude: float = Query(...),
                 sort: Optional[str] = Query(None),
                 page: Optional[int] = Query(1),
                 limit: Optional[int] = Query(20)):
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
        #response = es.search(index="listings_index", body=search_body)

        # PLACE HOLDER ELASTICSEARCH RESPONSE
        response = {"hits": {"hits": []}}



        # Extract documents from the response
        listings = [] 
        for doc in response['hits']['hits']:
            listings.append(Listing(id=doc["_id"], title=doc["_source"]["title"], 
                                    description=doc["_source"].get("description"), 
                                    price=doc["_source"]["price"], 
                                    location=doc["_source"]["location"]))
            
        print("Listings; {}".format(listings))
        #return listings


        # PLACE HOLDER SEARCH RESPONSE
        items = []
        items.append(ListingSummary(
            listingID="A23F29039B23",
            sellerID="A23F29039B23",  # optional
            sellerName="A23F29039B23",  # optional
            title="Used Calculus Textbook",
            description="No wear and tear, drop-off available.",  # optional
            price=50,
            dateCreated="2024-05-23T15:30:00Z",
            imageUrl="https://example.com/image"  # optional
        ))
        totalItems = 1

        return SearchResponse(items=items, totalItems=totalItems)


    else:
        return []  # What do we return if no query?

