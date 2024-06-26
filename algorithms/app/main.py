from fastapi import FastAPI
from .api.endpoints import search, recommendations, listings, interactions

app = FastAPI()

app.include_router(listings.router, prefix="/api", tags=["Listings"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(interactions.router, prefix="/api", tags=["Interactions"])