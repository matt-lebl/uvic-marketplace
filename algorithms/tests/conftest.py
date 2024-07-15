# Run tests from /algorithms directory with command: pytest -s tests/
from fastapi.testclient import TestClient
from pytest import fixture
import app 

@fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
