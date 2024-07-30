from fastapi import APIRouter
from services.data_layer_connect import send_request_to_data_layer
from core.schemas import NewReview

reviewsRouter = APIRouter(
    prefix="/api/review",
    tags=["reviews"],
    responses={404: {"description": "Not found"}},
)


@reviewsRouter.post("")
def add_review(review: NewReview, authUserID: str):
    path = "review/" + authUserID
    response = send_request_to_data_layer(path, "POST", review)
    return response.json()


@reviewsRouter.patch("/{id}")
def edit_review(id: str, review: NewReview, authUserID: str):
    path = "review/" + id + "/" + authUserID
    response = send_request_to_data_layer(path, "PATCH", review)
    return response.json()


@reviewsRouter.delete("/{id}")
def delete_review(id: str, authUserID: str):
    path = "review/" + authUserID + "/" + authUserID
    response = send_request_to_data_layer(path, "DELETE")
    return response.json()
