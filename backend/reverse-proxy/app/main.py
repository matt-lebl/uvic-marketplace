"""
reverse-proxy\main.py

>> Entry point for the overall backend. <<
"""
from urllib.parse import urljoin
from fastapi import FastAPI, HTTPException
import httpx


app = FastAPI()

# TODO: Update for prod
fastapi_backend_url = "http://localhost:8001"

"""
TODO:

- Reject all paths not used for:
    - fastapi-backend
    - data-layer
    - TODO: other services

- Websockets for live chat (if we continue to implement it)
""" 

@app.get("/api/{path:path}")
async def proxy_api_request(path: str | None):
    async with httpx.AsyncClient() as client:
        try:
            url = urljoin(fastapi_backend_url, f"/api/{path}")
            response = await client.get(url)
            return response.text
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exec))


# Catch-all route to handle requests to other paths
@app.get("/{path:path}")
async def proxy_other_request(path: str | None):
    raise HTTPException(status_code=404, detail="Path not found")

if __name__ == "__main__":
    import uvicorn

    # Run the server using UVicorn with specified host and port
    uvicorn.run("main:app", host="0.0.0.0", port=8000)