from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
)

from app.database import Base
from sqlalchemy.orm import relationship


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    review_id = Column(
        Integer,
        ForeignKey(
            "reviews.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    correctness = Column(Float, nullable=True)
    relevance = Column(Float, nullable=True)
    completeness = Column(Float, nullable=True)
    severity_accuracy = Column(Float, nullable=True)
    groundedness = Column(Float, nullable=True)
    hallucination = Column(Float, nullable=True)

    latency = Column(Float, nullable=True)
    cost = Column(Float, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )
    review = relationship(
    "Review",
    back_populates="evaluation",
)