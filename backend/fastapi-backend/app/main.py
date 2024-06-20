"""
fastapi-backend\main.py

>> Recieves traffic from REVERSE-PROXY, does everything other than DATA-LAYER or websocket connections, sends traffic to DATA-LAYER. >>
"""
from typing import Annotated
from fastapi import FastAPI, Path, Query
import routers.listings

app = FastAPI()
app.include_router(routers.listings.listingsRouter)


@app.get("/api/")
async def index():
    return {"hello": "UVic Marketplace FB"}


if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8001)
