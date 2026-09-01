#Defines the project data returned to React, including dashboard statistics.
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectReviewSummary(BaseModel):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectResponse(BaseModel):
    id: int
    name: str
    filename: str | None
    status: str
    created_at: datetime
    reviews: list[ProjectReviewSummary] = []

    model_config = ConfigDict(from_attributes=True)


class DashboardStatsResponse(BaseModel):
    projects: int
    reviews: int
    completed: int
    processing: int
    failed: int