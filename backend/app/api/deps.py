from collections.abc import Generator
from typing import Annotated

from sqlalchemy.orm import Session

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.database.session import engine
from app.core import security
from app.core.config import settings

from app.schemas.token import TokenData

# Database Session
def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a SQLAlchemy session.

    This function is a generator that yields a SQLAlchemy session object.
    It ensures that the session is properly closed after use.

    Yields:
        Session: A SQLAlchemy session object.
    """
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_db)]

# Security
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login"
)

TokenDep = Annotated[str, Depends(reusable_oauth2)]
