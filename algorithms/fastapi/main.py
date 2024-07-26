from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from endpoints import search, recommendations, listings, interactions, users

app = FastAPI()

@app.middleware("http")
async def add_exception_handling(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception as e:
        print(f"Unhandled algorithms error: {e}")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
    return response

app.include_router(listings.router, prefix="/api", tags=["Listings"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(interactions.router, prefix="/api", tags=["Interactions"])
