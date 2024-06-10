from fastapi import APIRouter, Body, Header, HTTPException, status
from typing import Optional
from ...schemas import Listing, ErrorMessage
from elasticsearch import Elasticsearch
from typing import Dict, Optional
from transformers import AutoTokenizer, AutoModel
import torch

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

@router.post("/listing", response_model=Listing, responses={201: {"model": Listing}, 400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}}, status_code=201)
async def create_listing(data: Dict = Body(...), authorization: Optional[str] = Header(None)):
    
    # Save the listing to Elasticsearch
    listing = data['listing']

    # Generate embedding for the listing
    embedding = generate_embedding(listing['description'])
    listing['embedding'] = embedding

    response = es.index(index="listings", id=listing['id'], body=listing)
    print(response)
    # if response.get('result') != 'created':
    #     raise HTTPException(status_code=500, detail="Failed to create listing in Elasticsearch")
    
    # Construct the response object by converting the dict back to a Pydantic model
    return listing
