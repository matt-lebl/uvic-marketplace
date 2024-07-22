from fastapi import APIRouter, HTTPException

charity_router = APIRouter(prefix="/charities", tags=["charities"])


@router.post("/")
def create_charity():
    raise HTTPException(status_code=401, detail="Forbidden")


@router.post("/clear")
def clear_all():
    raise HTTPException(status_code=401, detail="Forbidden")
