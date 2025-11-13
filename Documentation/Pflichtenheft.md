# **Pflichtenheft – Projekt „Wetterstation“**
## 1. Einleitung

### 1.1 Ziel des Projekts

Ziel des Projekts ist die Entwicklung einer vernetzten Wetterstation, die Umweltdaten von verschiedenen Sensoren erfasst, über das MQTT-Protokoll überträgt, in einer Datenbank speichert und über eine API für ein Frontend zur Verfügung stellt. Zusätzlich sollen Aktoren auf bestimmte Sensorereignisse reagieren können.

### 1.2 Projektteam und Arbeitsverteilung

| Teammitglied | Aufgabe |
| ------ | ----- |
| Kilian Hornischer | Frontend, API| 
| Niklas Maderbacher | Schaltplan, MQTT |
| Sina Mandl | API, Backend |
| Iris Pichler | Sensor-Backend, Datenbank |

## 2. Systemübersicht

Die Wetterstation besteht aus:

* **Sensorik** zur Erfassung von Umweltparametern
* **Aktoren** zur Signalisierung
* **MQTT-Kommunikation** zur Datenübertragung
* **Server / Datenbank** zur Speicherung der Messdaten
* **API / Backend** zur Bereitstellung der Daten
* **Frontend** zur Visualisierung

## 3. Systemanforderungen

### 3.1 Funktionale Anforderungen

#### Sensorik

| Sensor                              | Funktion                                       | Messwert / Ereignis                 | Reaktionsverhalten                             |
| ----------------------------------- | ---------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| MQ-2 Gas-Sensor                     | Erfassung von Gasen (z. B. Rauch, CO)          | Gaskonzentration   | Bei Überschreitung eines Grenzwerts Warnsignal |
| Temperatur- und Feuchtigkeitssensor | Misst Temperatur und relative Luftfeuchtigkeit | Temperatur in °C, Feuchtigkeit in % | Werte werden regelmäßig erfasst und übertragen |
| Flammensensor                       | Erkennung von Flammen/Lichtintensität          | Temp, Infrarot                    | Bei Erkennung einer Flamme: Alarm              |

#### Aktoren

| Aktor             | Funktion                                   |
| ----------------- | ------------------------------------------ |
| Piezo-Speaker 16R | Gibt akustischen Alarm wenn Grenzwerte überschritten werden |
| LED               | Zeigt Systemstatus/Warnung an         |

#### Kommunikation

* Die Wetterstation sendet Sensordaten über **MQTT** an den Server.

#### Datenspeicherung

* Empfangene Daten werden in einer **Datenbank** gespeichert (Redis DB).

#### API / Backend

* Bereitstellung einer **API** für das Frontend.

#### Frontend

* Darstellung aktueller Sensordaten
* Anzeige von Warnungen bei überschrittenen Wertens

## 4. Systemarchitektur

```
[Sensoren] → [Mikrocontroller] → [MQTT-Broker] → [Datenbank/Backend] → [API] → [Frontend]
          ↑                                                ↓
       [Aktoren] <------------------ Ereignisse -----------
```
## 5. Abnahmekriterien

* Alle Sensoren liefern korrekte Daten über MQTT.
* Daten werden zuverlässig gespeichert und sind über API abrufbar.
* Frontend zeigt Daten korrekt an.
* Warnsystem reagiert zuverlässig.
