import threading
import sys

import paho.mqtt.client as mqtt
import json
import redis

from app.config.config import settings
from app.crud.data import add_data


def extract_payload(payload):
    sensor = payload.get("sensor")
    data = payload.get("data")

    add_data(sensor, data)

    return sensor, data

def on_connect(client, userdata, flags, rc):
    print(f"Connect with result code {rc}")

def on_message(client, userdata, msg):
    try:
        sensor, data = extract_payload(json.loads(msg.payload.decode("utf-8")))
        print(f"Received sensor: {sensor} and data: {data}")
    except json.JSONDecodeError:
        print("Received message is not valid JSON", file=sys.stdout)

def run_client():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(settings.MQTT_IP, settings.MQTT_PORT)
    client.subscribe(settings.MQTT_TOPIC)

    client.loop_forever()

def start_mqtt_worker():
    thread = threading.Thread(target=run_client, daemon=True)
    thread.start()
    print("[MQTT] Worker thread started")