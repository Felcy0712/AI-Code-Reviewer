from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

from authlib.integrations.starlette_client import OAuth

from app.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
)
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.config import FRONTEND_URL


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


oauth = OAuth()

oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url=(
        "https://accounts.google.com/.well-known/openid-configuration"
    ),
    client_kwargs={
        "scope": "openid profile email",
    },
)


@router.get("/google/login")
async def google_login(request: Request):
    google = oauth.create_client("google")

    redirect_uri = request.url_for(
        "google_callback"
    )

    return await google.authorize_redirect(
        request,
        redirect_uri,
    )


@router.get(
    "/google/callback",
    name="google_callback",
)
async def google_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    google = oauth.create_client("google")

    token = await google.authorize_access_token(request)

    userinfo = token["userinfo"]

    google_sub = userinfo["sub"]
    email = userinfo["email"]

    user = (
        db.query(User)
        .filter(User.google_sub == google_sub)
        .first()
    )

    if not user:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    if not user:
        user = User(
            email=email,
            google_sub=google_sub,
            password_hash=None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    elif not user.google_sub:
        user.google_sub = google_sub

        db.commit()
        db.refresh(user)

    request.session["user_id"] = user.id
    request.session["email"] = user.email

    return RedirectResponse(
        url=f"{FRONTEND_URL}/dashboard"
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user_info(
    request: Request,
):
    response = {
        "authenticated": False,
        "user_id": 0,
        "email": "",
    }
    user_id = request.session.get("user_id")
    email = request.session.get("email")

    if user_id:
        response = {
            "authenticated": True,
            "user_id": user_id,
            "email": email or "",
        }

    return JSONResponse(
        content=response,
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )

    """if not user_id:
        return {
            "authenticated": False,
            "user_id": 0,
            "email": "",
        }"""

    """return {
        "authenticated": True,
        "user_id": user_id,
        "email": email or "",
    }"""
    

@router.post("/logout")
def logout(request: Request):
    request.session.clear()

    return {
        "message": "Logged out successfully",
    }