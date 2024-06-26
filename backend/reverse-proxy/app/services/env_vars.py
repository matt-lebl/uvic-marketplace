class RP_ENV_VARS:
    JWT_SECRET = "JWT_SECRET"  # the server secret used to create JWT tokens
    JWT_ALGORITHM = "JWT_ALGORITHM"  # the algorithm used to create the JWT tokens e.g. HS256
    EXPIRY_TIME = "EXPIRY_TIME"  # the expiry time of the tokens e.g. 600
    FB_URL = "FB_URL"  # url used to connect to the fastapi backend
