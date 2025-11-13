#include <DHT.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
 
// WiFi credentials
const char* wifi_ssid = "HTL-Weiz";        
const char* wifi_password = "HTL-Weiz";    
 
// MQTT server configuration
const char* mqtt_server = "172.31.183.174";
const uint16_t mqtt_port = 1883;
const char* topic_data = "Wetterstation/Explosiv";
 
WiFiClient espClient;
PubSubClient mqtt_client(espClient);
 
// --- Pinbelegung ---
#define FLAME_PIN   35
#define MQ2_PIN     34
#define DHT_PIN     15
#define DHTTYPE     DHT11
 
#define LED_R_PIN   23
#define LED_G_PIN   22
#define LED_B_PIN   21
#define PIEZO_PIN   14
 
// --- DHT Sensor Objekt ---
DHT dht(DHT_PIN, DHTTYPE);
 
// --- Schwellenwerte ---
#define GAS_WARN    2500  
#define GAS_ALARM   1800  
 
// --- NEU: Angepasste Schwellenwerte für Flammensensor ---
// "Normal" (keine Flamme) ist ein NIEDRIGER Wert (z.B. 100)
// "Alarm" (Flamme) ist ein HOHER Wert (z.B. > 2000)
//
// !!! BITTE KALIBRIEREN !!!
// Teste mit einem Feuerzeug, wie hoch der Wert steigt!
#define FLAME_WARN  1500  // Beispiel: Warnung, wenn Wert ÜBER 1500 steigt
#define FLAME_ALARM 3000  // Beispiel: Alarm, wenn Wert ÜBER 3000 steigt
 
#define TEMP_MIN    15.0
#define TEMP_MAX    40.0
#define HUM_MIN     10.0
#define HUM_MAX     80.0
 
String clientName;
 
void reconnect_mqtt() {
  while (!mqtt_client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (mqtt_client.connect(clientName.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqtt_client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
 
void setup() {
  Serial.begin(115200);
  Serial.println("=== ESP32 Sensor Status-Test startet ===");
 
  pinMode(FLAME_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);
  pinMode(PIEZO_PIN, OUTPUT);
 
  dht.begin();
 
  WiFi.begin(wifi_ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Verbinde mit WiFi...");
  }
  Serial.println("WiFi verbunden!");
 
  clientName = "ESP32-" + WiFi.macAddress();
  Serial.println("Client Name: " + clientName);
 
  mqtt_client.setServer(mqtt_server, mqtt_port);
  mqtt_client.setBufferSize(1024);
 
  reconnect_mqtt();
}
 
void loop() {
  if (!mqtt_client.connected()) {
    reconnect_mqtt();
  }
  mqtt_client.loop();
 
  // --- Sensorwerte ---
  int flameValue = analogRead(FLAME_PIN);
  int gasValue   = analogRead(MQ2_PIN);
  float temp     = dht.readTemperature();
  float hum      = dht.readHumidity();
 
  Serial.printf("Flame: %d | Gas: %d | Temp: %.1f °C | Hum: %.1f %%\n",
                flameValue, gasValue, temp, hum);
 
  // --- Status bestimmen ---
  // NEU: Logik für Flammensensor umgedreht (Alarm bei HOHEN Werten)
  bool flame_alarm = flameValue > FLAME_ALARM;
  bool flame_warn  = flameValue > FLAME_WARN && flameValue <= FLAME_ALARM;
 
  // Gas-Logik (Alarm bei NIEDRIGEN Werten) - Diese Logik beibehalten oder anpassen?
  // Falls Gas auch umgekehrt funktioniert, musst du dies auch anpassen.
  bool gas_alarm   = gasValue < GAS_ALARM;
  bool gas_warn    = gasValue >= GAS_ALARM && gasValue < GAS_WARN;
 
  bool temp_ok     = !isnan(temp) && temp >= TEMP_MIN && temp <= TEMP_MAX;
  bool hum_ok      = !isnan(hum)  && hum >= HUM_MIN && hum <= HUM_MAX;
  bool dht_alarm   = isnan(temp) || isnan(hum);
 
  // --- LED & Piezo Ausgabe ---
  if (flame_alarm || gas_alarm || dht_alarm) {
    digitalWrite(LED_R_PIN, HIGH);
    digitalWrite(LED_G_PIN, LOW);
    digitalWrite(LED_B_PIN, LOW);
    tone(PIEZO_PIN, 1200, 500);
  }
  else if (flame_warn || gas_warn || !temp_ok || !hum_ok) {
    digitalWrite(LED_R_PIN, LOW);
    digitalWrite(LED_G_PIN, LOW);
    digitalWrite(LED_B_PIN, HIGH);
    noTone(PIEZO_PIN);
  }
  else {
    digitalWrite(LED_R_PIN, LOW);
    digitalWrite(LED_G_PIN, HIGH);
    digitalWrite(LED_B_PIN, LOW);
    noTone(PIEZO_PIN);
  }
 
  // --- JSON Daten senden ---
  DynamicJsonDocument doc(256);
  doc["temp"] = isnan(temp) ? 0 : temp;
  doc["hum"]    = isnan(hum) ? 0 : hum;
  doc["gas"]      = gasValue;
  doc["flame"]    = flameValue;
 
  String jsonStr;
  serializeJson(doc, jsonStr);
 
  mqtt_client.publish(topic_data, jsonStr.c_str());
 
  delay(2000);
}
