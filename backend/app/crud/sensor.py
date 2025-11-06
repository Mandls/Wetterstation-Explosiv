from sqlalchemy.orm import Session
from app.models.sensor import Sensor
from app.schemas.sensor import SensorBase, SensorRead
from sqlalchemy.exc import IntegrityError
from datetime import datetime

def get_sensors(db: Session):
    return db.query(Sensor).all()

def create_sensor(db: Session, sensor: SensorBase):
    db_sensor = Sensor(
        sensor=sensor.sensor,
        name=sensor.name,
        typ=sensor.typ,
        description=sensor.description
    )
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor
