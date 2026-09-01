import os
from dotenv import load_dotenv

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")