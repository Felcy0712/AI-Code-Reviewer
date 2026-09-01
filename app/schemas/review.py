#GET /review/{review_id}
#Defines the shape of one review returned by the API.
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReviewResponse(BaseModel):
    id: int
    project_id: int
    review_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) 
    #It allows Pydantic to create the response from our SQLAlchemy Review object.
