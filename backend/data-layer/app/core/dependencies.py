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


class Dependencies:
    settings = config.Settings()
    engine = create_engine(settings.database_url)


@lru_cache
def get_settings():
    return Dependencies.settings


def get_engine():
    return Dependencies.engine


def get_session():
    with Session(Dependencies.engine) as session:
        yield session
