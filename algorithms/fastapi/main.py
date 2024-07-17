from fastapi import FastAPI
from endpoints import search, recommendations, listings, interactions, cold_start

app = FastAPI()

app.include_router(listings.router, prefix="/api", tags=["Listings"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(interactions.router, prefix="/api", tags=["Interactions"])
app.include_router(cold_start.router, prefix="/api", tags=["Cold Start"])
