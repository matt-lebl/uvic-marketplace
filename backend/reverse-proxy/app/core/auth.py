import base64
import ssl
import time
import uuid
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict
import jwt
from decouple import config
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.env_vars import RP_ENV_VARS

import os.path

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

JWT_SECRET = config(RP_ENV_VARS.JWT_SECRET, default="developmentkey")
JWT_ALGORITHM = config(RP_ENV_VARS.JWT_ALGORITHM, default="HS256")
EXPIRY_TIME = config(RP_ENV_VARS.EXPIRY_TIME, default=600)
VALIDATION_EMAIL = config(RP_ENV_VARS.VALIDATION_EMAIL, default="no.reply.uvic.cybermarketplace@gmail.com")
API_URL = config(RP_ENV_VARS.API_URL, default="https://localhost:8000/api")
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
CLIENT_SECRET_FILE = "client_secret.json"


def sign_jwt(user_id: str) -> Dict[str, str]:
    payload = {"user_id": user_id, "expires": time.time() + int(EXPIRY_TIME)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt(token: str) -> dict | None:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if decoded_token["expires"] >= time.time():
            return decoded_token
        else:
            return None
    except Exception as e:
        print(e)
        # TODO Logging
        return None


def verify_jwt(jwtoken: str) -> bool:
    isTokenValid: bool = False

    try:
        payload = decode_jwt(jwtoken)
    except Exception as e:
        print(e)
        # TODO Logging
        payload = None
    if payload:
        isTokenValid = True

    return isTokenValid


def get_user_id_from_token(jwtoken: str) -> str | None:
    payload = decode_jwt(jwtoken)
    if payload is None:
        return None
    return payload["user_id"]


def validate_email_domain(email: str) -> bool:
    valid_domains = ["uvic.ca"]
    check_list = email.split("@")
    return check_list[-1] in valid_domains


class EmailValidator:

    def __init__(self):
        self.port = 587
        self.context = ssl.create_default_context()
        self.email = VALIDATION_EMAIL

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

    def send_validation_email(self, receiver_email: str):
        if not self.creds or not self.creds.valid:
            self.authenticate()

        unique_id = str(uuid.uuid4())
        subject = "Email Validation"
        body = f"{API_URL}/user/validate-email/{unique_id}/{str(receiver_email.encode())}"

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

class JWTBearer(HTTPBearer):

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        auth_cookie = request.cookies.get("authorization")

        if not auth_cookie:
            raise HTTPException(status_code=403, detail="No authorization provided.")

        if not verify_jwt(auth_cookie):
            raise HTTPException(
                status_code=403, detail="Invalid token or expired token."
            )

        return auth_cookie
