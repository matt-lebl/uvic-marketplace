from fastapi import APIRouter
from services.data_layer_connect import send_request_to_data_layer
from core.schemas import NewReview

reviewsRouter = APIRouter(
    prefix="/api/review",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@reviewsRouter.post("")
async def add_review(review: NewReview, authUserID: str):
    path = "review/" + authUserID
    response = await send_request_to_data_layer(path, "POST", review.model_dump())
    return response.json()


@reviewsRouter.patch("/{id}")
async def edit_review(id: str, review: NewReview, authUserID: str):
    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "PATCH", review.model_dump())
    return response.json()


@reviewsRouter.delete("/{id}")
async def delete_review(id: str, authUserID: str):
    path = "review/" + id + "/" + authUserID
    response = await send_request_to_data_layer(path, "DELETE")
    return response.json()
