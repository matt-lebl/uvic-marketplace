from typing import Annotated

from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/api/{path:path}")
async def index():
    return {"hello": "UVic Marketplace FB"}


if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8001)