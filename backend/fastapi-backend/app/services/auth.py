import pyotp
from decouple import config
from cryptography.fernet import Fernet
import argon2
from env_vars import FB_ENV_VARS

class Auth_Handler():
    def __init__(self):
        enc_key = config(FB_ENV_VARS.TOTP_KEY)
        self.fernet = Fernet(enc_key)

    def encrypt_totp_secret(self, totp_secret: str):
        return self.fernet.encrypt(totp_secret.encode()).decode()

    def check_totp(self, external_totp: str, internal_totp_secret: str):
        decrypted_totp_secret = self.fernet.decrypt(internal_totp_secret).decode()
        totp = pyotp.TOTP(decrypted_totp_secret)
        return totp.verify(external_totp)

    @classmethod
    def generate_otp(cls, email: str):
        key = pyotp.random_base32()
        totp = pyotp.TOTP(key)
        uri = totp.provisioning_uri(name=email)
        return key, uri

    @classmethod
    def hash_password(cls, password: str):
        hashed = argon2.hash_password(password.encode())
        return hashed.decode()
