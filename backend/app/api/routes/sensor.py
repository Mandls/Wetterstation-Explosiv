from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.api.deps import SessionDep
import app.crud.sensor as crud_sensor
from app.schemas.sensor import SensorBase, SensorRead

router = APIRouter(prefix="/sensor", tags=["sensor"])

@router.get("/get_sensors/", response_model=List[SensorRead])
async def get_sensors(session: SessionDep):
    response = crud_sensor.get_sensors(session)
    if not response:
        raise HTTPException(status_code=404, detail="No sensor data found")
    return response

@router.post("/create_sensors/", response_model=SensorBase)
async def create_sensor(sensor: SensorBase, session: SessionDep):
    new_sensor = crud_sensor.create_sensor(session, sensor)
    if not new_sensor:
        raise HTTPException(status_code=400, detail="Error at adding new sensor data")
    return new_sensor