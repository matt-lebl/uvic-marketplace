import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re
import pyotp
from decouple import config
from cryptography.fernet import Fernet
import argon2
from .env_vars import FB_ENV_VARS

VALIDATION_EMAIL = config(FB_ENV_VARS.VALIDATION_EMAIL, default="no.reply.uvic.cybermarketplace@gmail.com")
VALIDATION_EMAIL_ENCRYPTION_KEY = config(FB_ENV_VARS.VALIDATION_EMAIL_ENCRYPTION_KEY,
                                         default="xlCv7LmY28UfIoIXajSBcRvGnTQvNENdu_N3NKUQyS8=")
API_URL = config(FB_ENV_VARS.FRONTEND_URL, default="http://localhost:8080")
SMTP_SERVER = "smtp.gmail.com"
VALIDATION_EMAIL_PASSWORD = config(FB_ENV_VARS.VALIDATION_EMAIL_PASSWORD, default="afakepassword")


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
        self.port = 465
        self.context = ssl.create_default_context()
        self.email = VALIDATION_EMAIL
        self.password = VALIDATION_EMAIL_PASSWORD
        self.smtp_server = SMTP_SERVER

        self.encrypter = AuthHandler(key=VALIDATION_EMAIL_ENCRYPTION_KEY)

    def send_validation_email(self, receiver_email: str, unique_id: str):
        try:
            subject = "Email Validation"
            body = f"{API_URL}/validate-email/?code={unique_id}&email={receiver_email}"

            message = MIMEMultipart()
            message["From"] = self.email
            message["To"] = receiver_email
            message["Subject"] = subject
            message.attach(MIMEText(body, "plain"))

            with smtplib.SMTP_SSL(self.smtp_server, self.port, context=self.context) as server:
                server.login(self.email, self.password)
                server.sendmail(self.email, receiver_email, message.as_string())
            return unique_id
        except Exception as error:
            print(str(error))
            raise error


class UserValidator:

    @classmethod
    def validate_email(cls, email: str):
        valid_domains = ["uvic.ca"]
        check_list = email.split("@")
        check_list = [x for x in check_list if x]
        return len(check_list) == 2 and check_list[-1] in valid_domains

    @classmethod
    def validate_password(cls, password: str):
        password_pattern = \
            r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!"#$%&\'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$'
        regex = re.compile(password_pattern)
        return bool(regex.fullmatch(password))

    @classmethod
    def validate_username(cls, username: str):
        username_pattern = r'^[a-zA-Z@_\d]{6,20}$'
        regex = re.compile(username_pattern)
        return bool(regex.fullmatch(username))
