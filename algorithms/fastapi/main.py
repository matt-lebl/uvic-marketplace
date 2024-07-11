from fastapi import FastAPI
from endpoints import search, recommendations, listings, interactions, users

app = FastAPI()

app.include_router(listings.router, prefix="/api", tags=["Listings"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(interactions.router, prefix="/api", tags=["Interactions"])