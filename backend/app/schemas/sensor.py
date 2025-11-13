from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class SensorBase(BaseModel):
    sensor: str = Field(..., min_length=3, max_length=60)
    name: str = Field(..., min_length=1)
    typ: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=255)
    
class SensorRead(SensorBase):
    id: int
