import time
import pyotp
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.auth import AuthHandler, UserValidator
from urllib.parse import unquote

client = TestClient(app)

userID = ""

@pytest.fixture()
def new_user():
    return {
        "username": "testuser",
        "name": "John Doe",
        "email": "testuser@uvic.ca",
        "password": "Testpassword123!"
    }


@pytest.fixture
def auth_handler():
    return AuthHandler()


def test_totp_secret_generation(new_user):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200

    response_data = response.json()
    totp_secret = response_data.get("totp_secret")
    totp_uri = response_data.get("totp_uri")
    userID = response_data.get("userID")

    # Delete the user
    response = client.delete(f"api/user/", params={"authUserID": userID})
    print(f"Cleanup response: {response.status_code}, {response.json()}")
    assert response.status_code == 200, f"Failed to cleanup user: {response.json()}"

    assert totp_secret is not None
    assert totp_uri is not None

def test_totp_validation(new_user, auth_handler):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200

    response_data = response.json()
    userID = response_data.get("userID")
    totp_secret = response_data.get("totp_secret")

    assert totp_secret is not None, "TOTP secret should not be None"

    # Encrypt the TOTP secret using the AuthHandler
    encrypted_totp_secret = auth_handler.encrypt_secret(totp_secret)

    # Generate a TOTP code using the encrypted secret
    totp_code = pyotp.TOTP(totp_secret).now()

    # Validate the TOTP code using the encrypted secret
    is_valid = auth_handler.check_totp(totp_code, encrypted_totp_secret)
    assert is_valid

    # Delete the user
    response = client.delete(f"/api/user/", params={"authUserID": userID})
    print(f"Cleanup response: {response.status_code}, {response.json()}")
    assert response.status_code == 200, f"Failed to cleanup user: {response.json()}"
    
def test_generate_otp(auth_handler):
    email = "testuser@uvic.ca"
    totp_secret, uri = AuthHandler.generate_otp(email)

    assert totp_secret is not None
    assert uri is not None
    decoded_uri = unquote(uri)
    assert email in decoded_uri


def test_encrypt_decrypt_totp_secret(auth_handler):
    email = "testuser@uvic.ca"
    totp_secret, _ = AuthHandler.generate_otp(email)

    encrypted_secret = auth_handler.encrypt_secret(totp_secret)
    assert encrypted_secret is not None
    assert encrypted_secret != totp_secret

    decrypted_secret = auth_handler.decrypt_secret(encrypted_secret)
    assert decrypted_secret == totp_secret


def test_validate_email():
    valid = "bob@uvic.ca"
    invalid = "bob@gmail.com"
    tricky_invalid = "bob@uvic.ca@gmail.com"
    trickier_invalid = "@uvic.ca"

    assert UserValidator.validate_email(valid)
    assert not UserValidator.validate_email(invalid)
    assert not UserValidator.validate_email(tricky_invalid)
    assert not UserValidator.validate_email(trickier_invalid)


def test_validate_password():
    valid = "Arealpassword1!"
    short = "Tos$ort"
    no_sp = "NoSpecialCharacter1"
    no_cap = "apa$$w0rdaa"
    all_cap = "APA$$W0RDAA"
    no_num = "aPassword%%a"

    assert UserValidator.validate_password(valid)
    assert not UserValidator.validate_password(short)
    assert not UserValidator.validate_password(no_sp)
    assert not UserValidator.validate_password(no_cap)
    assert not UserValidator.validate_password(all_cap)
    assert not UserValidator.validate_password(no_num)


def test_validate_username():
    valid = "avalidUsername_1"
    too_short = "_3aDa"
    too_long = "a5@Aa5@Aa5@Aa5@Aa5@Aa"
    wrong_char = "!aValidusername5"

    assert UserValidator.validate_username(valid)
    assert not UserValidator.validate_username(too_short)
    assert not UserValidator.validate_username(too_long)
    assert not UserValidator.validate_username(wrong_char)


def test_invalid_totp_code(new_user, auth_handler):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200

    response_data = response.json()
    userID = response_data.get("userID")
    totp_secret = response_data.get("totp_secret")

    assert totp_secret is not None, "TOTP secret should not be None"

    # Encrypt the TOTP secret using the AuthHandler
    encrypted_totp_secret = auth_handler.encrypt_secret(totp_secret)

    # Generate an invalid TOTP code
    invalid_totp_code = "123456"

    # Validate the invalid TOTP code using the encrypted secret
    is_valid = auth_handler.check_totp(invalid_totp_code, encrypted_totp_secret)
    assert not is_valid

    # Delete the user
    response = client.delete(f"/api/user/", params={"authUserID": userID})
    print(f"Cleanup response: {response.status_code}, {response.json()}")
    assert response.status_code == 200, f"Failed to cleanup user: {response.json()}"


def test_totp_secret_encryption_decryption(auth_handler):
    totp_secret = "JBSWY3DPEHPK3PXP"

    # Encrypt the TOTP secret
    encrypted_totp_secret = auth_handler.encrypt_secret(totp_secret)

    # Decrypt the TOTP secret
    decrypted_totp_secret = auth_handler.decrypt_secret(encrypted_totp_secret)

    # Ensure the decrypted secret matches the original secret
    assert decrypted_totp_secret == totp_secret


def test_expired_totp_code(new_user, auth_handler):
    # Create a new user and extract the TOTP secret
    response = client.post("/api/user/", json=new_user)
    assert response.status_code == 200

    response_data = response.json()
    userID = response_data.get("userID")
    totp_secret = response_data.get("totp_secret")

    assert totp_secret is not None, "TOTP secret should not be None"

    # Encrypt the TOTP secret using the AuthHandler
    encrypted_totp_secret = auth_handler.encrypt_secret(totp_secret)

    # Generate a TOTP code and wait for it to expire
    totp_code = pyotp.TOTP(totp_secret).now()
    time.sleep(31)  # Assuming the TOTP code expires in 30 seconds

    # Validate the expired TOTP code using the encrypted secret
    is_valid = auth_handler.check_totp(totp_code, encrypted_totp_secret)
    assert not is_valid

    # Delete the user
    response = client.delete(f"/api/user/", params={"authUserID": userID})
    print(f"Cleanup response: {response.status_code}, {response.json()}")
    assert response.status_code == 200, f"Failed to cleanup user: {response.json()}"



if __name__ == "__main__":
    pytest.main()