'''Defines the response from:
GET /auth/me So React gets a predictable authentication response.'''
from pydantic import BaseModel


class UserResponse(BaseModel):
    authenticated: bool
    user_id: int
    email: str