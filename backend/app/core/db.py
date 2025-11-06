from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from app.database.session import engine

# models must be imported and registered from app.models to create the tables
from app.database.session import Base, engine



def init_db(session: Session) -> None:
  """
  Initialize the database by creating tables and a superuser if it doesn't exist.

  Args:
    session (Session): The database session used to interact with the database.
  """
  # Create tables
  Base.metadata.create_all(bind=engine) 
