from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewResponse


router = APIRouter()


@router.get(
    "/review/{review_id}",
    response_model=ReviewResponse,
    #We no longer manually build:{"id": ..., "project_id": ..., ...}Pydantic handles the response shape.
)
def get_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = (
        db.query(Review)
        .join(Review.project)
        .filter(
            Review.id == review_id,
            Review.project.has(
                user_id=current_user.id
            ),
        )
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )

    return review