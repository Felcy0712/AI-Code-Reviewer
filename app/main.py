from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api import auth
from app.api import upload
from app.api import project
from app.api import review
from app.config import SESSION_SECRET_KEY
from app.config import FRONTEND_URL


app = FastAPI(
    title="AI Code Reviewer API",
    description="Upload a project and review code using AI",
    version="1.0.0",
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY,
    https_only=True,   # True when deployed with HTTPS
    same_site="lax",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(project.router)
app.include_router(review.router)

@app.get("/")
def home():
    return {
        "message": "AI Code Reviewer API is Running"
    }
@app.get("/health")
def health():
    return {
        "status": "ok"
    }