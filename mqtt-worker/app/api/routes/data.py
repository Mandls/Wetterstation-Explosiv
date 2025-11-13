from fastapi import APIRouter, status, HTTPException

from app.schemas.sensors import Temperature, Humidity, Gas, Flame
from app.crud.data import get_data, delete_data
from app.exceptions.mac_not_found import MacNotFound


router = APIRouter(prefix="/sensor_data", tags=["Sensor Data"])

@router.delete("/{sensor}", response_model=None, status_code=status.HTTP_202_ACCEPTED)
def reset_esp_esp(sensor: str):
    delete_data(sensor)

    return None

@router.get("/temp", response_model=Temperature, status_code=status.HTTP_200_OK)
def get_temp_data():
    try:
        temp = get_data("temp")
    except MacNotFound as e:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data.")
            )
    
    return Temperature(temperature=temp)

@router.get("/hum", response_model=Humidity, status_code=status.HTTP_200_OK)
def get_hum_data():
    try:
        hum = get_data("hum")
    except MacNotFound as e:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data.")
            )
    
    return Humidity(humidity=hum)

@router.get("/gas", response_model=Gas, status_code=status.HTTP_200_OK)
def get_gas_data():
    try:
        gas = get_data("gas")
    except MacNotFound as e:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data.")
            )
    
    return Gas(gas_amount=gas)

@router.get("/flame", response_model=Flame, status_code=status.HTTP_200_OK)
def get_flame_data():
    try:
        flame = get_data("flame")
    except MacNotFound as e:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data.")
            )
    
    return Flame(flame_nearby=flame)

