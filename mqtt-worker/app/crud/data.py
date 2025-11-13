from app.config.config import settings
from app.redis.redis import redis_connection, redis_lock
from app.exceptions.mac_not_found import MacNotFound

def add_data(sensor: str, data: str):
    with redis_lock:
        # Store data in Redis list
        redis_connection.rpush(sensor, data)


def get_data(sensor: str):
    with redis_lock:

        # Check if the key exists in Redis
        if not redis_connection.exists(sensor):
            raise MacNotFound(
                message=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data."),
                error_code=404
            )

        # Only get newest timestamp
        return redis_connection.lrange(sensor, -10, -1)

def delete_data(sensor: str):
    with redis_lock:
        # Check if the key exists
        if not redis_connection.exists(sensor):
            raise MacNotFound(
                message=("No Sensor with this name exists or no data yet exist. "
                    "If you think it should exist, please send new MQTT data."),
                error_code=404,
            )

        # Delete all timestamps for this MAC
        return redis_connection.ltrim(sensor, 1, 0)