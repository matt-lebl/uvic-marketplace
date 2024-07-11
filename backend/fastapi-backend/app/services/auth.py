import base64
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import pyotp
from decouple import config
from cryptography.fernet import Fernet
import argon2

from .env_vars import FB_ENV_VARS

import os.path

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

VALIDATION_EMAIL = config(FB_ENV_VARS.VALIDATION_EMAIL, default="no.reply.uvic.cybermarketplace@gmail.com")
VALIDATION_EMAIL_KEY = config(FB_ENV_VARS.VALIDATION_EMAIL_KEY, default="xlCv7LmY28UfIoIXajSBcRvGnTQvNENdu_N3NKUQyS8=")
API_URL = config(FB_ENV_VARS.API_URL, default="https://localhost:8000/api")
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
CLIENT_SECRET_FILE = "client_secret.json"


class AuthHandler:
    def __init__(self, key=None):
        enc_key = ""
        if not key:
            enc_key = config(FB_ENV_VARS.TOTP_KEY, default="xlCv7LmY28UfIoIXajSBcRvGnTQvNENdu_N3NKUQyS8=")
        else:
            enc_key = key
        self.fernet = Fernet(enc_key)

    def encrypt_secret(self, secret: str):
        return self.fernet.encrypt(secret.encode()).decode()

    def decrypt_secret(self, secret: str):
        return self.fernet.decrypt(secret).decode()

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
        hasher = argon2.PasswordHasher()
        return hasher.hash(password)


class EmailValidator:

    def __init__(self):
        self.port = 587
        self.context = ssl.create_default_context()
        self.email = VALIDATION_EMAIL

        self.encrypter = AuthHandler(key=VALIDATION_EMAIL_KEY)

        self.creds = None
        if os.path.exists("token.json"):
            self.creds = Credentials.from_authorized_user_file("token.json", SCOPES)

        if not self.creds or not self.creds.valid:
            self.authenticate()

    def authenticate(self):
        flow = InstalledAppFlow.from_client_secrets_file(
            CLIENT_SECRET_FILE, SCOPES
        )
        self.creds = flow.run_local_server(port=0)

        with open("token.json", "w") as token:
            token.write(self.creds.to_json())

    def send_validation_email(self, receiver_email: str, unique_id: str):
        if not self.creds or not self.creds.valid:
            self.authenticate()

        subject = "Email Validation"
        encrypted_email = self.encrypter.encrypt_secret(receiver_email)
        encrypted_unique_id = self.encrypter.encrypt_secret(unique_id)
        body = f"{API_URL}/user/validate-email/{encrypted_unique_id}/{encrypted_email}"

        message = MIMEMultipart()
        message["From"] = self.email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        try:
            service = build('gmail', 'v1', credentials=self.creds)
            message = {'raw': raw_message}
            send_message = service.users().messages().send(userId='me', body=message).execute()
            return unique_id, send_message
        except HttpError as error:
            print(str(error))
            raise error

    @classmethod
    def validate_email_domain(cls, email: str) -> bool:
        valid_domains = ["uvic.ca"]
        check_list = email.split("@")
        return check_list[-1] in valid_domains
