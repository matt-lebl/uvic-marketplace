# TODO: add dependecies https://fastapi.tiangolo.com/tutorial/dependencies/
from functools import lru_cache
from sqlmodel import Session, create_engine
from . import config


"""
Settings dependency: Use this for all settings (environment vars in .env)

example use for settings as a dependency:

@app.get("/info")
async def info(settings: Annotated[config.Settings, Depends(get_settings)]):
    return {
        "app_name": settings.app_name,
        "admin_email": settings.admin_email,
        "items_per_user": settings.items_per_user,
    }


"""
@lru_cache
def get_settings():
    return config.Settings()

def get_session():
    settings = get_settings()
    engine = create_engine(settings.database_url)
    return engine