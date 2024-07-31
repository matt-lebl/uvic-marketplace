from fastapi import APIRouter, Depends, HTTPException
from typing import Union

from requests import Session
from db.deps import get_db
from util.charity_item_view import should_view_charity_items
from util.schemas import ItemSortEnum, ListingSummary, UserProfile, SearchResponse, SearchUserResponse, ErrorMessage
from util.elasticsearch_wrapper import ElasticsearchWrapper
from util.embedding import generate_embedding

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
                 authUserID: Union[str, None] = None,
                 db: Session = Depends(get_db)):
    try:
        see_charity_items = True  # Default to showing charity items
        if authUserID:
            see_charity_items = should_view_charity_items(authUserID, db)
            
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

            filters = []
            if minPrice is not None:
                filters.append({"range": {"price": {"gte": minPrice}}})
            if maxPrice is not None:
                filters.append({"range": {"price": {"lte": maxPrice}}})

            print(status)
            filters.append({"match": {"status": status}})

            if filters:
                search_body['query']['bool']['filter'].extend(filters)

            if not see_charity_items:
                search_body['query']['bool']['filter'].append({
                    "bool": {
                        "must_not": {
                            "exists": {
                                "field": "charityId"
                            }
                        }
                    }
                })

            sort_orders = {
                ItemSortEnum.PRICE_ASC: {"price": {"order": "asc"}},
                ItemSortEnum.PRICE_DESC: {"price": {"order": "desc"}},
                ItemSortEnum.LISTED_TIME_ASC: {"dateCreated": {"order": "asc"}},
                ItemSortEnum.LISTED_TIME_DESC: {"dateCreated": {"order": "desc"}}
            }
            if sort != ItemSortEnum.RELEVANCE and sort in sort_orders:
                print("Sorting by: {}".format(sort))
                search_body['sort'] = [sort_orders[sort]]

            # Perform the search query
            response = es.search(index="listings_index", body=search_body)

            scores = [hit['_score'] for hit in response['hits']['hits']]
            print(scores)

            # Extract documents from the response
            listings = [] 
            for doc in response['hits']['hits']:
                listings.append(ListingSummary(
                    listingID=doc["_id"],
                    title=doc["_source"].get("title", "No title available"),
                    description=doc["_source"].get("description", "No description available"),
                    price=doc["_source"].get("price", 0.0),
                    location=doc["_source"].get("location", "No location available"),
                    dateCreated=doc["_source"].get("dateCreated", "No date available"),
                    sellerID=doc["_source"].get("sellerID", "No seller ID available"),
                    sellerName=doc["_source"].get("sellerName", "No seller name available"),
                    imageUrl=doc["_source"].get("imageUrl", "No image available"),
                    charityID=doc["_source"].get("charityId", None)
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
