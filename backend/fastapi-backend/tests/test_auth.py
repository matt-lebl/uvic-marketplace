import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.auth import AuthHandler, UserValidator
from urllib.parse import unquote

client = TestClient(app)


@pytest.fixture
def new_user():
    return {
        "username": "testuser999919",
        "name": "John Doe",
        "email": "testuser12134506@uvic.ca",
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

    assert totp_secret is not None
    assert totp_uri is not None
    # TODO: use test db or delete user so next tests will not fail due to unique error


def test_totp_validation(new_user, auth_handler):
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


if __name__ == "__main__":
    pytest.main()
