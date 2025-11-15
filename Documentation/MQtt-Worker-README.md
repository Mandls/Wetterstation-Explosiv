# MQtt Broker

- Accepts data on port `1883`
- Sensor data should be published in `Wetterstation/Explosiv`

# MQtt Worker

- Data available under <ip-address>:8000/api/v1/<sensor>
    - `</temp>` for the temperature of the sensor station
    - `</hum>` for the humidity of the sensor station
    - `</gas>` for the gas concentration of the sensor station
    - `</flame>` for the flame value of the sensor station

## Return values of API

| Temperature | Humidity | Gas | Flame |
|-------------|----------|-----|-------|
| /temp | /hum | /gas | /flame |
| Integer | Integer | Integer | Integer |

for further information please read the data sheat of the sensor

