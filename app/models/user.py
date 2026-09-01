from sqlalchemy import Boolean, Column, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    google_sub = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True,
    )
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)