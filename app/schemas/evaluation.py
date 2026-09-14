#The evaluation response schemas define the structure and data types 
# of the JSON that your FastAPI evaluation API sends to the React frontend.
from datetime import datetime

from pydantic import BaseModel


class EvaluationItem(BaseModel):

    id: int
    review_id: int
    project_id: int

    correctness: float | None
    relevance: float | None
    completeness: float | None
    severity_accuracy: float | None
    groundedness: float | None
    hallucination: float | None

    latency: float | None
    cost: float | None

    created_at: datetime


class EvaluationSummary(BaseModel):

    total_reviews: int

    average_correctness: float | None
    average_relevance: float | None
    average_completeness: float | None
    average_severity_accuracy: float | None
    average_groundedness: float | None
    average_hallucination: float | None

    average_latency: float | None
    total_cost: float | None


class EvaluationDashboardResponse(BaseModel):

    summary: EvaluationSummary
    evaluations: list[EvaluationItem]