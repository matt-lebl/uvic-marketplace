from app.services.auth import AuthHandler
import argon2
from cryptography.fernet import Fernet


def test_auth():
    key = Fernet.generate_key()
    auth_handler = AuthHandler(key)
    password = "password1"
    p1 = auth_handler.hash_password(password).encode()
    assert argon2.verify_password(p1, password.encode())
