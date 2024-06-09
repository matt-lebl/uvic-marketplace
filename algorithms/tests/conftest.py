# Run tests from /algs directory with command: pytest -s tests/
from fastapi.testclient import TestClient
from pytest import fixture
from app.main import app 

@fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c