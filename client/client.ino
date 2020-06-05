#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "DHT.h"

#include "setup.h"

WiFiUDP Udp;

DHT dht(DHTPIN, DHTTYPE);

char* msgBuffer = "";
boolean ledStatus = false;

void setup() {
  // put your setup code here, to run once:
  pinMode(DHT_UNREAD_LED, OUTPUT);
  digitalWrite(DHT_UNREAD_LED, HIGH);// idk why, high means unlight
  pinMode(WIFI_LED, OUTPUT);
 
  Serial.begin(115200);
  delay(100);

  WiFi.begin(ssid, password);

  Serial.println();
  Serial.println(F("Connecting..."));

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(WiFi.status());
    
    digitalWrite(WIFI_LED, ledStatus);
    ledStatus = !ledStatus;
  }
  ledStatus = true;
  digitalWrite(WIFI_LED, ledStatus);
  
  Serial.println();
  Serial.println(F("Connect Successfully."));

  Serial.print(F("IP Address: "));
  Serial.println(WiFi.localIP());

  Serial.print(F("MAC Address: "));
  Serial.println(WiFi.macAddress());

  Udp.begin(8888);

  dht.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(WiFi.status());
    
    digitalWrite(WIFI_LED, ledStatus);
    ledStatus = !ledStatus;
  }
  ledStatus = true;
  delay(9970);

  float humi = dht.readHumidity();
  float temp = dht.readTemperature();

  if(isnan(humi) || isnan(temp)){
    Serial.println(F("Failed to read from DHT11 sensor."));
    digitalWrite(DHT_UNREAD_LED, LOW);
    delay(100);
    digitalWrite(DHT_UNREAD_LED, HIGH);
    return;  
  }

  msgBuffer[0] = '\0';

  //Write device Id
  strcat(msgBuffer, deviceId);

  strcat(msgBuffer, ",");
  
  char tempChar[5];
  dtostrf(temp, 5, 2, tempChar);
  strcat(msgBuffer, tempChar);

  strcat(msgBuffer, ",");

  char humiChar[5];
  dtostrf(humi, 5, 2, humiChar);
  strcat(msgBuffer, humiChar);
  
  Udp.beginPacket(serverIP, serverPort);
  Udp.write(msgBuffer);
  Udp.endPacket();
}
