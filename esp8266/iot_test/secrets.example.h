#include <pgmspace.h>
 
#define SECRET
 
const char WIFI_SSID[] = "";        
const char WIFI_PASSWORD[] = "";
 
#define THINGNAME "esp8266_office"
 
int8_t TIME_ZONE = 0;
 
const char MQTT_HOST[] = "";
 
 
static const char cacert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----

)EOF";
 
 
// Copy contents from XXXXXXXX-certificate.pem.crt here ▼
static const char client_cert[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
 
)KEY";
 
 
// Copy contents from  XXXXXXXX-private.pem.key here ▼
static const char privkey[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----

 
)KEY";