r"""
data-layer\main.py

>> Recieves traffic from FASTAPI-BACKEND, handles all data interactions. 
"""
from fastapi import FastAPI, HTTPException, Body, Depends
from routers import listings, messages, users, reviews
from sqlmodel import SQLModel, create_engine
from core.dependencies import get_engine

app = FastAPI()

app.include_router(listings.router)
app.include_router(messages.router)
app.include_router(users.router)
app.include_router(reviews.router)


@app.get("/api/{path:path}")
def index():
    return {"hello": "UVic Marketplace Data Layer."}

# Catch-all route to handle requests to other paths
# TODO: change detail
@app.get("/{path:path}")
async def data_layer_other_request(path: str | None):
    raise HTTPException(status_code=404, detail="Path not found DATA-LAYER")

if __name__ == "__main__":
    import uvicorn

    # Creates all tables, TODO: this will need to be removed for production
    engine = get_engine()
    SQLModel.metadata.create_all(engine)

    uvicorn.run("main:app", host="0.0.0.0", port=8002)
