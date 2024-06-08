from typing import Annotated

from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/")
def index():
    return {"hello": "UVic Marketplace FB"}
