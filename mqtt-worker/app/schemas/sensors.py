from pydantic import BaseModel

class Temperature(BaseModel):
    temperature: list[int]

class Humidity(BaseModel):
    humidity: list[int]

class Flame(BaseModel):
    flame_nearby: list[int]

class Gas(BaseModel):
    gas_amount: list[int]
