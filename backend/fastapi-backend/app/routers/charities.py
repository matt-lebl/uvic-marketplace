from fastapi import APIRouter, HTTPException, Response
from services.data_layer_connect import send_request_to_data_layer
from services.utils import convert_to_type, data_layer_failed
from core.schemas import CharityRequest, CharityWithFundsAndListings

charityRouter = APIRouter(prefix="/api/charities", tags=["charities"])


@charityRouter.post("")
async def create_charity(charityRequest: CharityRequest, returnResponse: Response):
    path = "charities/"
    response = await send_request_to_data_layer(
        path, "POST", charityRequest.model_dump()
    )
    if data_layer_failed(response, returnResponse):
        return response.json()
    return convert_to_type(response.json(), CharityWithFundsAndListings)


@charityRouter.get("")
async def get_all(returnResponse: Response):
    path = "charities/"
    response = await send_request_to_data_layer(path, "GET")
    if data_layer_failed(response, returnResponse):
        return response.json()

    ##TODO: Test performance impact of this
    list_of_charities = []
    for charity in response.json():
        list_of_charities.append(convert_to_type(charity, CharityWithFundsAndListings))
    return list_of_charities


@charityRouter.get("/current")
async def get_listing(returnResponse: Response):
    path = "charities/current"
    response = await send_request_to_data_layer(path, "GET")
    if data_layer_failed(response, returnResponse):
        return response.json()
    return convert_to_type(response.json(), CharityWithFundsAndListings)


@charityRouter.delete("/{id}")
async def clear_by_id(id: str, returnResponse: Response):
    path = "charities/" + id
    response = await send_request_to_data_layer(path, "DELETE")
    if data_layer_failed(response, returnResponse):
        return response.json()
    return response.json()


# Internal API


@charityRouter.delete("/clear/")
async def clear_all(returnResponse: Response):
    path = "charities/clear/"
    response = await send_request_to_data_layer(path, "POST")
    if data_layer_failed(response, returnResponse):
        return response.json()
    return {"message": "All charities deleted successfully"}
