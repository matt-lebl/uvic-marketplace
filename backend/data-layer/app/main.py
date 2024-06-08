from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def index():
    return {"hello": "UVic Marketplace Data Layer"}
