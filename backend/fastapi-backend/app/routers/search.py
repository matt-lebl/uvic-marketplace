from fastapi import APIRouter, Response
from core.schemas import SearchTerm
from services.data_layer_connect import send_request_to_data_layer

searchRouter = APIRouter(
    prefix="/api/user/search-history",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)


@searchRouter.post("/")
async def add_search_history(
    searchTerm: SearchTerm, authUserID: str, returnResponse: Response
):
    path = "search-history/" + authUserID

    if searchTerm.searchTerm.strip() == "":
        returnResponse.status_code = 400
        return {"error": "Search term cannot be empty"}

    response = await send_request_to_data_layer(
        path, "POST", data=searchTerm.model_dump()
    )

    returnResponse.status_code = response.status_code
    return response.json()


@searchRouter.get("")
async def get_search_history(authUserID: str, returnResponse: Response):
    path = "search-history/" + authUserID
    response = await send_request_to_data_layer(path, "GET")
    returnResponse.status_code = response.status_code
    return response.json()


@searchRouter.delete("")
async def delete_search_history(authUserID: str, returnResponse: Response):
    path = "search-history/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    returnResponse.status_code = response.status_code
    return response.json()
