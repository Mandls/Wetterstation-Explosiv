from pydantic import BaseModel

class Temperature(BaseModel):
    temperature: float

class Humidity(BaseModel):
    humidity: float

class Flame(BaseModel):
    flame_nearby: bool

class Gas(BaseModel):
    gas_amount: float
