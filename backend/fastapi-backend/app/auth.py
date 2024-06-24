import pyotp
from decouple import config
from cryptography.fernet import Fernet

enc_key = config("TOTP_KEY")
fernet = Fernet(enc_key)


def encrypt_totp_secret(totp_secret: str):
    return fernet.encrypt(totp_secret.encode())


def check_totp(external_totp: str, internal_totp_secret: str):
    decrypted_totp_secret = fernet.decrypt(internal_totp_secret).decode()
    totp = pyotp.TOTP(decrypted_totp_secret)
    return totp.verify(external_totp)


def generate_otp(email: str):
    key = pyotp.random_base32()

    totp = pyotp.TOTP(key)
    uri = totp.provisioning_uri(name=email)

    return key, uri
