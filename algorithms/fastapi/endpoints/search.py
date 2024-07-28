from fastapi import APIRouter, HTTPException
from typing import List, Union
from util.schemas import ListingSummary, UserProfile, SearchResponse, SearchUserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
import torch
import numpy as np
from util.embedding import generate_embedding, find_closest_matches

es_wrapper = ElasticsearchWrapper()
es = es_wrapper.es

router = APIRouter()

@router.get("/search", response_model=SearchResponse, responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def search(*,
                 latitude: float,
                 longitude: float,
                 query: Union[str, None] = None,
                 minPrice: Union[float, None] = None,
                 maxPrice: Union[float, None] = None,
                 status: Union[str, None] = "AVAILABLE",
                 searchType: Union[str, None] = "LISTINGS",
                 sort: Union[str, None] = None,
                 page: int = 1,
                 limit: int = 20,
                 authUserID: Union[str, None] = None):
    try:
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
                                        dateCreated=doc["_source"]["dateCreated"],
                                        sellerID=doc['_source']["sellerID"],
                                        sellerName=doc['_source']["sellerName"],
                                        imageUrl=doc['_source'].get('imageUrl'),
                                        **({"charityID": doc["_source"]["charityID"]} if "charityID" in doc["_source"] else {})
                                        ))
                
            print("Listings; {}".format(listings))
            return SearchResponse(items=listings, totalItems=len(listings))

        else:
            return SearchResponse(items=[], totalItems=0)
    except HTTPException:
        return SearchResponse(items=[], totalItems=0)
    

@router.get("/search-users", response_model=SearchUserResponse, responses={400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}})
async def search_users(*,
                       query: Union[str, None] = None,
                       page: int = 1,
                       limit: int = 20,
                       authUserID: str = ""):
    search_body = {
        "from": (page - 1) * limit,
        "size": limit,
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["username", "name"],  # Search across both username and name
                "type": "best_fields",
                "fuzziness": "AUTO"  # Add some tolerance for misspellings
            }
        }
    }

    # Perform the search query
    response = es.search(index="users_index", body=search_body)

    # Extract users from the response
    users = []
    for doc in response['hits']['hits']:
        users.append(UserProfile(userID=doc["_id"],
                                  username=doc["_source"]["username"],
                                  name=doc["_source"]["name"],
                                  bio=doc["_source"].get("bio"),
                                  profileUrl=doc["_source"].get("profileUrl")))

    print("Users: {}".format(users))
    return SearchUserResponse(items=users, totalItems=response['hits']['total']['value'])
