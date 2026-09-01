from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.project import Project
from app.models.user import User

from app.schemas.project import (
    DashboardStatsResponse,
    ProjectResponse,
)


router = APIRouter()


@router.get(
    "/projects",
    response_model=list[ProjectResponse],
)
def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc())
        .all()
    )


@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    projects = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .all()
    )

    return {
        "projects": len(projects),
        "reviews": sum(
            len(project.reviews)
            for project in projects
        ),
        "completed": sum(
            project.status == "completed"
            for project in projects
        ),
        "processing": sum(
            project.status == "processing"
            for project in projects
        ),
        "failed": sum(
            project.status == "failed"
            for project in projects
        ),
    }