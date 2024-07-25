from fastapi import APIRouter, HTTPException
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type
from core.schemas import CharityRequest, CharityWithFundsAndListings

charityRouter = APIRouter(prefix="/api/charities", tags=["charities"])

@charityRouter.post("")
async def create_charity(charityRequest: CharityRequest):
    path = "charities/"
    response = await send_request_to_data_layer(path, "POST", charityRequest.model_dump())
    return convert_to_type(response.json(), CharityWithFundsAndListings)

@charityRouter.get("")
async def get_all():
    path = "charities/"
    response = await send_request_to_data_layer(path, "GET")

    ##TODO: Test performance impact of this
    list_of_charities = []
    for charity in response.json():
        list_of_charities.append(convert_to_type(charity, CharityWithFundsAndListings))
    return list_of_charities

@charityRouter.get("/current")
async def get_listing():
    path = "charities/current"
    response = await send_request_to_data_layer(path, "GET")
    return convert_to_type(response.json(), CharityWithFundsAndListings)

@charityRouter.delete("/{id}")
async def clear_by_id(id: str):
    path = "charities/" + id
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()

#Internal API 

@charityRouter.delete("/clear/")
async def clear_all():
    path = "charities/clear/"
    response = await send_request_to_data_layer(path, "POST")
    if response.status_code == 200:
        return {"message": "All charities deleted successfully"}







