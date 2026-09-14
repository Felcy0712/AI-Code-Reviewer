#Add evaluation API router
from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.project import Project
from app.models.review import Review
from app.models.evaluation import Evaluation

from app.schemas.evaluation import (
    EvaluationDashboardResponse,
)


router = APIRouter(
    prefix="/evaluations",
    tags=["Evaluations"],
)


@router.get(
    "/dashboard",
    response_model=EvaluationDashboardResponse,
)
def get_evaluation_dashboard(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    summary_row = (
        db.query(
            func.count(Evaluation.id),

            func.avg(
                Evaluation.correctness
            ),

            func.avg(
                Evaluation.relevance
            ),

            func.avg(
                Evaluation.completeness
            ),

            func.avg(
                Evaluation.severity_accuracy
            ),

            func.avg(
                Evaluation.groundedness
            ),

            func.avg(
                Evaluation.hallucination
            ),

            func.avg(
                Evaluation.latency
            ),

            func.sum(
                Evaluation.cost
            ),
        )
        .join(
            Review,
            Evaluation.review_id
            == Review.id,
        )
        .join(
            Project,
            Review.project_id
            == Project.id,
        )
        .filter(
            Project.user_id
            == current_user.id
        )
        .one()
    )

    (
        total_reviews,
        average_correctness,
        average_relevance,
        average_completeness,
        average_severity_accuracy,
        average_groundedness,
        average_hallucination,
        average_latency,
        total_cost,
    ) = summary_row


    evaluations = (
        db.query(Evaluation, Review)
        .join(
            Review,
            Evaluation.review_id
            == Review.id,
        )
        .join(
            Project,
            Review.project_id
            == Project.id,
        )
        .filter(
            Project.user_id
            == current_user.id
        )
        .order_by(
            Evaluation.id.desc()
        )
        .limit(50)
        .all()
    )


    evaluation_items = []

    for evaluation, review in evaluations:

        evaluation_items.append(
            {
                "id": evaluation.id,
                "review_id": evaluation.review_id,
                "project_id": review.project_id,

                "correctness":
                    evaluation.correctness,

                "relevance":
                    evaluation.relevance,

                "completeness":
                    evaluation.completeness,

                "severity_accuracy":
                    evaluation.severity_accuracy,

                "groundedness":
                    evaluation.groundedness,

                "hallucination":
                    evaluation.hallucination,

                "latency":
                    evaluation.latency,

                "cost":
                    evaluation.cost,

                "created_at":
                    evaluation.created_at,
            }
        )


    return {
        "summary": {
            "total_reviews":
                total_reviews,

            "average_correctness":
                average_correctness,

            "average_relevance":
                average_relevance,

            "average_completeness":
                average_completeness,

            "average_severity_accuracy":
                average_severity_accuracy,

            "average_groundedness":
                average_groundedness,

            "average_hallucination":
                average_hallucination,

            "average_latency":
                average_latency,

            "total_cost":
                total_cost,
        },

        "evaluations":
            evaluation_items,
    }