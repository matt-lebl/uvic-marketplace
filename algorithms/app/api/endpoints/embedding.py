from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import torch


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