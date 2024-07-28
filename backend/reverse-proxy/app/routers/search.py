from fastapi import APIRouter, Depends, Request
from core.dependencies import require_jwt
from services.backend_connect import send_request_to_backend_with_user_id
from services.algorithms_connect import send_request_to_algorithms_with_user_id

searchRouter = APIRouter(
    prefix="/api/search",
    tags=["users"],
    responses={404: {"description": "Not found"}, 401: {"description": "Unauthorized"}},
)


@searchRouter.get("", dependencies=[Depends(require_jwt())])
async def search(request: Request, token=Depends(require_jwt())):
    # add search history
    path = "api/search-history/"
    await send_request_to_backend_with_user_id(
        path, "POST", token, data={"searchTerm": request.query_params["query"]}
    )

    response = await send_request_to_algorithms_with_user_id(
        path, "GET", token, params=request.query_params
    )
    return response.json()
