# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

import time
import board
import adafruit_dht
from datetime import datetime
from influxdb import InfluxDBClient

# Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT22(board.D4)

# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
# dhtDevice = adafruit_dht.DHT22(board.D18, use_pulseio=False)

client = InfluxDBClient(
    host="localhost", port=8086, username="username", password="password"
)
client.switch_database("temperature")

while True:
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity
        print(
            "{:%Y-%m-%d %H:%M} - Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(
                datetime.now(), temperature_f, temperature_c, humidity
            )
        )

        json_body = [
            {
                "measurement": "temperature_humidity",
                "tags": {
                    "source": "raspberry_pi",
                },
                "time": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                "fields": {"temperature": temperature_c, "humidity": humidity},
            }
        ]

        client.write_points(json_body)

    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        print(error.args[0])
    except Exception as error:
        dhtDevice.exit()
        raise error

        # username: username
        # password: password

    time.sleep(60.0)
