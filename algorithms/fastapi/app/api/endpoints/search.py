from fastapi import APIRouter, Query, Header, HTTPException
from typing import List, Optional
from ..schemas import ListingSummary, SearchResponse, ErrorMessage
from ...util.elasticsearch_wrapper import ElasticsearchWrapper
import torch
import numpy as np
from ...util.embedding import generate_embedding, find_closest_matches

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
        query_embedding = generate_embedding(query)

        # Adjust the weight given to the lexical search and set a minimum score for result relevance
        min_score_threshold = 0.76

        search_body = {
            "min_score": min_score_threshold,
            "query": {
                "bool": {
                    "should": [
                        {
                            "script_score": {
                                "query": {"match_all": {}},
                                "script": {
                                    "source": "cosineSimilarity(params.query_vector, 'embedding')",
                                    "params": {"query_vector": query_embedding}
                                }
                            }
                        },
                        {
                            "multi_match": {
                                "query": query,
                                "fields": ["title^3", "description^2"],  # Boost factors added
                                "type": "best_fields"
                            }
                        }
                    ],
                    "filter": []
                }
            },
            "from": (page - 1) * limit,
            "size": limit
        }

        # Perform the search query
        response = es.search(index="listings_index", body=search_body)

        scores = [hit['_score'] for hit in response['hits']['hits']]
        print(scores)

        # Extract documents from the response
        listings = [] 
        for doc in response['hits']['hits']:
            listings.append(ListingSummary(listingID=doc["_id"], title=doc["_source"]["title"], 
                                    description=doc["_source"].get("description"), 
                                    price=doc["_source"]["price"], 
                                    location=doc["_source"]["location"],
                                    dateCreated="2024-05-23T15:30:00Z"))
            
        print("Listings; {}".format(listings))
        return SearchResponse(items=listings, totalItems=len(listings))


    else:
        return []  # What do we return if no query?

