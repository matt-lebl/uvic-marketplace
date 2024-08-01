from datetime import datetime, UTC, timedelta

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from core.config import Settings
from main import app

settings = Settings()
DATABASE_URL = settings.database_url
engine = create_engine(DATABASE_URL)

SQLModel.metadata.create_all(engine)


def override_get_session():
    with Session(engine) as session:
        yield session


app.dependency_overrides[Session] = override_get_session
client = TestClient(app)


def generate_charity_request(name: str, description: str, start_date: str, end_date: str, image_url: str,
                             organizations: list[dict]):
    return {
        "name": name,
        "description": description,
        "startDate": start_date,
        "endDate": end_date,
        "imageUrl": image_url,
        "organizations": organizations
    }


def generate_organization(name: str, logo_url: str, receiving: bool):
    return {
        "name": name,
        "logoUrl": logo_url,
        "donated": 0,
        "receiving": receiving
    }


def main():
    """
    To use, add the organization data in the org_data list of tuples, can add any number of tuples, but one of them
    should have receiving=True.
    To create the charity add the name and description into the charity_request_data
    :return:
    """
    org_data = [
        ("ORG1_NAME", "LOGO_URL", False),
        ("ORG2_NAME", "LOGO_URL", False),
        ("ORG3_NAME", "LOGO_URL", False),
        ("ORG4_NAME", "LOGO_URL", True)  # This true value indicates that this org is the one receiving donations
    ]

    orgs = [generate_organization(org[0], org[1], org[2]) for org in org_data]

    charity_request_data = ("CHARITY_NAME", "CHARITY_DESCRIPTION",
                            "START_DATE",
                            "END_DATE",
                            "LOGO_URL",
                            orgs)

    charity_request = generate_charity_request(charity_request_data[0], charity_request_data[1],
                                               charity_request_data[2], charity_request_data[3],
                                               charity_request_data[4], charity_request_data[5])

    response = client.post("/charities/", json=charity_request)
    assert response.status_code == 200


if __name__ == "__main__":
    main()
