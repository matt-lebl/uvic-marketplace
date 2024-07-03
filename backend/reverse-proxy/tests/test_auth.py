import pytest
import time
import jwt
from fastapi import Depends
from fastapi.testclient import TestClient
from app.core.auth import JWTBearer, sign_jwt, JWT_ALGORITHM, JWT_SECRET
from app.main import app

"""TO RUN
Need environment variables with the following
e.x.
JWT_SECRET=abigscarystring
JWT_ALGORITHM=HS256
EXPIRY_TIME=600
"""

@app.get("/protected-route", dependencies=[Depends(JWTBearer())])
async def protected_route():
    return {"message": "You are authenticated"}

client = TestClient(app)

def test_protected_route_no_token():
    response = client.get("/protected-route")
    assert response.status_code == 403

def test_protected_route_invalid_scheme():
    response = client.get("/protected-route", headers={"Authorization": "Basic invalidtoken"})
    assert response.status_code == 403

def test_protected_route_invalid_token():
    response = client.get("/protected-route", headers={"Authorization": "Bearer invalidtoken"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Invalid token or expired token."}

def test_protected_route_valid_token(monkeypatch):
    user_id = "testuser"
    valid_token = sign_jwt(user_id)["access_token"]
    response = client.get("/protected-route", headers={"Authorization": f"Bearer {valid_token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "You are authenticated"}

def test_protected_route_expired_token(monkeypatch):
    expired_token = jwt.encode({"user_id": "testuser", "expires": time.time() - 10}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    response = client.get("/protected-route", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Invalid token or expired token."}

if __name__ == "__main__":
    pytest.main()
