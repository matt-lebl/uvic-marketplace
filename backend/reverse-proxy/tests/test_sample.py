from fastapi import FastAPI
from fastapi.testclient import TestClient

# This is an example from https://fastapi.tiangolo.com/tutorial/testing/
# we will use fastapis built in test functionality

app = FastAPI()


@app.get("/")
async def read_main():
    return {"msg": "Hello World"}


client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
