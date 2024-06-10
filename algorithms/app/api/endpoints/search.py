from fastapi import APIRouter, Query, Header, HTTPException
from typing import List, Optional
from ...schemas import Listing, ErrorMessage
from elasticsearch import Elasticsearch
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

es = Elasticsearch("http://elasticsearch:9200")

# Load the E5 model and tokenizer
model_name = "intfloat/e5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Function to generate an embedding for a description
def generate_embedding(description: str) -> list:
    inputs = tokenizer(description, return_tensors='pt')
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
        return embedding.flatten().tolist()

# Function to find the n closest matches to a query
def find_closest_matches(query, embeddings, descriptions, n=5):
    inputs = tokenizer(query, return_tensors='pt')
    with torch.no_grad():
        outputs = model(**inputs)
        query_embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
    similarities = cosine_similarity(query_embedding, embeddings)[0]
    closest_indices = similarities.argsort()[-n:][::-1]
    return [descriptions[i] for i in closest_indices]

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


