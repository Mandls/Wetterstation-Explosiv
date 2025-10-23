from fastapi import APIRouter

# routes imports go here
from app.api.routes import health_check
from app.api.routes import data

api_router = APIRouter()

api_router.include_router(health_check.router)
api_router.include_router(data.router)