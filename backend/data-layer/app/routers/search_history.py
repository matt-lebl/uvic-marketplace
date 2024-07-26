import uuid
from core.sql_models import SearchHistoryTable
from core.config import PST_TZ
from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_session
from core.schemas import Search, SearchHistory, SearchRequest
from datetime import datetime
import logging

from sqlmodel import Session

logging.basicConfig(format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/search-history",
    tags=["review"]
)


@router.post("/{userID}")
def add_history_item(userID: str, search: SearchRequest, session: Session = Depends(get_session)):

    search_data = {"userID": userID, "timestamp": datetime.now(PST_TZ),
                   "searchID": str(uuid.uuid4()), "searchTerm": search.model_dump()["searchTerm"]}

    logger.info(f"search performed {search_data}")
    try:
        SearchHistoryTable.create(session=session, **search_data)
    except Exception as e:
        logger.error(str(e))
        raise e


@router.get("/{userID}", response_model=SearchHistory)
def get_history(userID: str, session: Session = Depends(get_session)):
    search_history = SearchHistoryTable.get_history(userID, session)
    logger.info(f"search history requested: {search_history}")
    if not search_history:
        logger.error(f"search history not found {userID}")
    return search_history


@router.delete("/{userID}")
def delete_history(userID: str, session: Session = Depends(get_session)):
    logger.info(f"history delete for: {userID}")
    try:
        return SearchHistoryTable.delete(userID, session)
    except Exception as e:
        logger.error(str(e))
        raise e
