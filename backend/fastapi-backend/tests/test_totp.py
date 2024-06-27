import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.auth import Auth_Handler
from app.schemas import NewUser
import pyotp
from urllib.parse import unquote

client = TestClient(app)
auth_handler = Auth_Handler()

@pytest.fixture
def new_user():
    return {
        "username": "testuser999919",
        "name": "John Doe",
        "email": "testuser12134506@uvic.ca",
        "password": "testpassword123"
    }

def test_totp_secret_generation(new_user):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200
    
    response_data = response.json()
    totp_secret = response_data.get("totp_secret")
    totp_uri = response_data.get("totp_uri")
    
    assert totp_secret is not None
    assert totp_uri is not None
    # TODO: use test db or delete user so next tests will not fail due to unique error

def test_totp_validation(new_user):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200
    
    response_data = response.json()
    totp_secret = response_data.get("totp_secret")
    
    # Generate a TOTP code
    totp_code = auth_handler.generate_otp(totp_secret)
    
    # Validate the TOTP code
    is_valid = auth_handler.check_totp(totp_code, totp_secret)
    assert is_valid

@pytest.fixture
def auth_handler():
    return Auth_Handler()

def test_generate_otp(auth_handler):
    email = "testuser@uvic.ca"
    totp_secret, uri = Auth_Handler.generate_otp(email)
    
    assert totp_secret is not None
    assert uri is not None
    decoded_uri = unquote(uri)
    assert email in decoded_uri

def test_encrypt_decrypt_totp_secret(auth_handler):
    email = "testuser@uvic.ca"
    totp_secret, _ = Auth_Handler.generate_otp(email)
    
    encrypted_secret = auth_handler.encrypt_totp_secret(totp_secret)
    assert encrypted_secret is not None
    assert encrypted_secret != totp_secret
    
    decrypted_secret = auth_handler.fernet.decrypt(encrypted_secret.encode()).decode()
    assert decrypted_secret == totp_secret

def test_totp_validation(auth_handler):
    email = "testuser@uvic.ca"
    totp_secret, _ = Auth_Handler.generate_otp(email)
    encrypted_secret = auth_handler.encrypt_totp_secret(totp_secret)
    
    totp_code = pyotp.TOTP(totp_secret).now()
    is_valid = auth_handler.check_totp(totp_code, encrypted_secret)
    
    assert is_valid

if __name__ == "__main__":
    pytest.main()

