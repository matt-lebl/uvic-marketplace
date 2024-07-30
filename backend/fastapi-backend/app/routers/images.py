from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

imagesRouter = APIRouter(prefix="/api/images", tags=["images"])

images_dir = Path("app/images")


@imagesRouter.post("/{filename}")
async def upload_image(filename: str, file: UploadFile = File(...)):
    file_location = images_dir / filename
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"info": f"file '{file.filename}' saved at '{file_location}'"}


@imagesRouter.get("/{filename}")
async def get_image(filename: str):
    file_location = images_dir / filename
    if not file_location.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_location)
