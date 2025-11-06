from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.session import Base

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    sensor = Column(String, nullable=False)
    name = Column(String, nullable=False)
    typ = Column(String, nullable=False)
    description = Column(String, nullable=True)