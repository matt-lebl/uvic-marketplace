from fastapi import FastAPI
from .routers import listings, messages, users


app = FastAPI()

app.include_router(listings.router)
app.include_router(messages.router)
app.include_router(users.router)


@app.get("/")
def index():
    return {"hello": "UVic Marketplace Data Layer"}
