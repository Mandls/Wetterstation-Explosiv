### Programmprotokoll: Live-Sensor-Dashboard

**Zweck:**
Das Programm zeigt Live-Daten von Umgebungs- und Sicherheitssensoren an (Temperatur, Luftfeuchtigkeit, Gas, Flamme) und bewertet deren Status anhand definierter Grenzwerte.

**Technologien:**

* React (Next.js Client Component)
* TypeScript
* TailwindCSS (UI Styling)

**Datenquelle:**

* API-Endpunkte unter `http://172.31.183.174:8000/api/v1/sensor_data`
* Endpunkte pro Sensortyp: `/temp`, `/hum`, `/gas`, `/flame`

**Funktionalität:**

1. **Datenabruf:**

   * Beim Laden wird die API abgefragt (`fetchSensorData`).
   * Prüft zuerst mit einer HEAD-Anfrage, ob der Server erreichbar ist.
   * Ruft die neuesten Sensordaten ab, verarbeitet sie und aktualisiert die Anzeige.

2. **Datenverarbeitung:**

   * Sensorwerte werden auf Status geprüft: `normal`, `warning`, `critical`.
   * Grenzwerte:

     * Temperatur: 15–40 °C
     * Luftfeuchtigkeit: 10–80 %
     * Gas (MQ-2): 0–2500 ppm
     * Flamme: 0–3000

3. **Anzeige:**

   * Jeder Sensor wird in einer `Card` mit Wert, Einheit, Status-Badge und Beschreibung angezeigt.
   * Farbcode für Status: Grün (normal), Gelb (warning), Rot (critical).
   * Aktualisierung alle 10 Sekunden.

4. **Fehlerbehandlung:**

   * Verbindungsausfall wird angezeigt.
   * Benutzer kann manuell erneut abrufen (`Try Again` Button).

5. **UI-Elemente:**

   * Kopfbereich, Statusinformationen, Grid-Layout für Sensor-Cards.
   * Zeigt Zeit der letzten Aktualisierung und Grenzwerte der Sensoren an.

