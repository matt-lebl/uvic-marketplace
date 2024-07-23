from fastapi import APIRouter, HTTPException
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type
from app.core.schemas import CharityWithFundsAndListings

charityRouter = APIRouter(prefix="/charities", tags=["charities"])


@charityRouter.post("/")
def create_charity():
    raise HTTPException(status_code=401, detail="Forbidden")


@charityRouter.post("/clear")
def clear_all():
    raise HTTPException(status_code=401, detail="Forbidden")


@charityRouter.get("/current")
async def get_listing():
    path = "charities/current"
    response = await send_request_to_data_layer(path, "GET")
    return convert_to_type(response.json(), CharityWithFundsAndListings)


@charityRouter.get("/")
async def get_listing():
    path = "charities"
    response = await send_request_to_data_layer(path, "GET")
    return convert_to_type(response.json(), CharityWithFundsAndListings)
