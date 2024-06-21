from fastapi import FastAPI
from .api.endpoints import search, recommendations

app = FastAPI()

app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])