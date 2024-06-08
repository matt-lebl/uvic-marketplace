from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
import httpx


app = FastAPI()

# Define the URL of your backend FastAPI server
backend_url = "http://localhost:8001"

# Proxy API requests to the backend for specific paths
# TODO: should we handle path validation here or in fb-backend?
@app.get("/api/{path:path}")
async def proxy_api_request(path: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(backend_url + f"/api/{path}")
            return response.text
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)


# Catch-all route to handle requests to other paths
@app.get("/{path:path}")
async def proxy_other_request(path: str):
    raise HTTPException(status_code=404, detail="Path not found")