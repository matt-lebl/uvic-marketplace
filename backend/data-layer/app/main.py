<<<<<<< Updated upstream
=======
import uvicorn
>>>>>>> Stashed changes
from fastapi import FastAPI
from .routers import listings, messages, users


app = FastAPI()

app.include_router(listings.router)
app.include_router(messages.router)
app.include_router(users.router)


@app.get("/")
def index():
    return {"hello": "UVic Marketplace Data Layer"}
<<<<<<< Updated upstream
=======

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
>>>>>>> Stashed changes
