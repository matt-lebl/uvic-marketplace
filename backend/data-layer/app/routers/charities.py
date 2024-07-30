import uuid
from core.sql_models import CharityTable
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import CharityRequest, Charity, CharityWithFundsAndListings
import logging
from sqlmodel import Session

logging.basicConfig(format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/charities", tags=["charities"])


@router.get("/", response_model=list[CharityWithFundsAndListings])
def get_all(session: Session = Depends(get_session)):
    charities = CharityTable.get_all(session)
    charity_schemas = []
    for c in charities:
        charity_schemas.append(c.convert_to_schema(session))
    return charity_schemas


@router.post("/", response_model=Charity)
def create_charity(charity: CharityRequest, session: Session = Depends(get_session)):
    charity_data = charity.model_dump()
    uuids = [str(uuid.uuid4()) for _ in charity_data["organizations"]]
    charity_data = CharityTable.add_orgs_to_db(charity_data, uuids, session)
    charity_data["id"] = str(uuid.uuid4())
    new_charity = CharityTable.create(session=session, **charity_data)
    logger.info(f"New Charity Created{new_charity}")
    return new_charity.convert_to_schema(session)


@router.get("/current", response_model=CharityWithFundsAndListings)
def get_current_charity(session: Session = Depends(get_session)):
    charity = CharityTable.get_current_charity(session)
    logger.info(f"Current charity requested")
    if not charity:
        logger.error(f"No current charity")
        raise HTTPException(status_code=404, detail="There is no current charity")
    return charity.convert_to_schema(session)


@router.post("/clear/")
def clear_all(session: Session = Depends(get_session)):
    CharityTable.clear(session)
    return {"message": "cleared successfully"}


@router.delete("/{id}")
def delete_charity(id: str, session: Session = Depends(get_session)):
    try:
        return CharityTable.delete(id, session)
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=400,
            detail="Error deleting charity -- make sure the charity exists",
        )
