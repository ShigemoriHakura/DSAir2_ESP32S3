
/*
  DSair Wi-Fi Specification
  Send Command: http://flashair/command.cgi?op=131&ADDR=0&LEN=64&DATA=DSairCommand
  Get Status  : http://flashair/command.cgi?op=130&ADDR=128&LEN=264
    Power     : PW(PowerFlag)                 PowerFlag 0:OFF, 1:ON
    Direction : DI(LocoAddr,Direction)        Direction 1:FWD, 2:REV
    Function  : FN(LocoAddr,FuncNo,FuncVal)   FuncNo 0-28:F0-F28 / FuncVal 0:OFF, 1:ON
    LocSpeed  : SP(LocoAddr,Speed,Speedstep)  Speed 0-1023, Speedstep 2:128Step
    Turnout   : TO(AccAddr,AccDirection)      AccDirection 0:DIV, 1:STR
                                              LocoAddr 0:49152(0xC000) - 9999:59151(0xE70F)
                                              AccAddr 1:14336(0x3800 - 2044:16380(0x3FFC)
*/
//#define DEBUG
//#define WIFI_MODE
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>
#include <detail/mimetable.h>
#include <FlashAirSharedMem.h>
#include "FFat.h"

const char* wlan_ssid = "FlashAir";
const char* wlan_pass = "12345678";

DNSServer dns;
WebServer server(80);

volatile uint8_t shared_memory[512] = {};
portMUX_TYPE shared_mutex = portMUX_INITIALIZER_UNLOCKED;

#ifdef DEBUG
void listDir(fs::FS &fs, const char * dirname, uint8_t levels){
    Serial.printf("Listing directory: %s\r\n", dirname);

    File root = fs.open(dirname);
    if(!root){
        Serial.println("- failed to open directory");
        return;
    }
    if(!root.isDirectory()){
        Serial.println(" - not a directory");
        return;
    }

    File file = root.openNextFile();
    while(file){
        if(file.isDirectory()){
            Serial.print("  DIR : ");
            Serial.println(file.name());
            if(levels){
                listDir(fs, file.name(), levels -1);
            }
        } else {
            Serial.print("  FILE: ");
            Serial.print(file.name());
            Serial.print("\tSIZE: ");
            Serial.println(file.size());
        }
	file.close();
        file = root.openNextFile();
    }
}
#endif

String getContentType(String filename) {
    if (server.hasArg("download")) {
        return "application/octet-stream";
    } else if (filename.endsWith(".htm")) {
        return "text/html";
    } else if (filename.endsWith(".html")) {
        return "text/html";
    } else if (filename.endsWith(".css")) {
        return "text/css";
    } else if (filename.endsWith(".js")) {
        return "application/javascript";
    } else if (filename.endsWith(".png")) {
        return "image/png";
    } else if (filename.endsWith(".gif")) {
        return "image/gif";
    } else if (filename.endsWith(".jpg")) {
        return "image/jpeg";
    } else if (filename.endsWith(".ico")) {
        return "image/x-icon";
    } else if (filename.endsWith(".xml")) {
        return "text/xml";
    } else if (filename.endsWith(".pdf")) {
        return "application/x-pdf";
    } else if (filename.endsWith(".zip")) {
        return "application/x-zip";
    } else if (filename.endsWith(".gz")) {
        return "application/x-gzip";
    }
    return "text/plain";
}

static void server_task(void *pvParameters) {
#ifdef WIFI_MODE
    WiFi.mode(WIFI_STA);
    WiFi.begin(wlan_ssid, wlan_pass);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
    dns.start(53, "flashair", WiFi.localIP());
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
#else
    WiFi.softAP(wlan_ssid, wlan_pass);
    dns.start(53, "flashair", WiFi.softAPIP());
#endif

    if(!FFat.begin(true)){
        Serial.println("An Error has occurred while mounting FFat");
        return;
    }

#ifdef DEBUG
    Serial.printf("FFAT Started\n");
    Serial.printf("Total space: %10u\n", FFat.totalBytes());
    Serial.printf("Free space: %10u\n", FFat.freeBytes());
    listDir(FFat, "/", 5);
#endif

    server.on("/", []() {
        server.sendHeader("Location", "/SD_WLAN/List.htm");
        server.send(302); // 302 Found
    });
    server.on("/dir", []() {
        String path = server.arg("dir");
#ifdef DEBUG
        Serial.println("handleFileList: " + path);
#endif
        File root = FFat.open(path);
        path = String();

        String output = "[";
        if(root.isDirectory()){
            File file = root.openNextFile();
            while(file){
                if (output != "[") {
                    output += ',';
                }
                output += "{\"type\":\"";
                output += (file.isDirectory()) ? "dir" : "file";
                output += "\",\"name\":\"";
                output += String(file.path()).substring(1);
                output += "\"}";
                file = root.openNextFile();
            }
        }
        output += "]";
        server.send(200, "text/json", output);
    });
    server.on("/command.cgi", []() {
        String arg_msg = server.uri() + " ";
        for (int i = 0; i < server.args(); i++) {
            arg_msg += "&" + server.argName(i) + "=" + server.arg(i);
        }

#ifdef DEBUG
        Serial.println(arg_msg);
#endif
        bool sent = false;
        int power = ((shared_memory[0x80] == 'Y') ? 0x008000 : 0); // Rail Power
        uint16_t arg_addr = server.arg("ADDR").toInt();
        uint16_t arg_len = server.arg("LEN").toInt();
        switch (server.arg("op").toInt()) {
            case 100:{
                server.send(200, "text/plain", ""); // 200 OK
                break;
            }
            case 104:{
                server.send(200, "text/plain", wlan_ssid); // 200 OK
                break;
            }
            case 105:{
                server.send(200, "text/plain", wlan_pass); // 200 OK
                break;
            }
            case 106:{
                server.send(200, "text/plain", "a41731f4d880"); // 200 OK
                break;
            }
            case 130: {
                // READ_SHARED_MEMORY
                uint8_t buffer[sizeof(shared_memory) + 1] = {};
                if (SharedMemRead(arg_addr, arg_len, buffer) == 0) {
                    server.setContentLength(arg_len);
                    server.send(200, "text/plain", ""); // 200 OK
                    server.sendContent((char *)buffer, arg_len);
                    //Serial.println((char *)buffer);
                    sent = true;
                }
                break;
            }
            case 131: {
                // WRITE_SHARED_MEMORY
                String arg_data = server.arg("DATA");
                if (SharedMemWrite(arg_addr, arg_data.length(), (uint8_t *)arg_data.c_str()) == 0) {
                    server.send(200, "text/plain", "SUCCESS"); // 200 OK
                    sent = true;
                }
                break;
            }
        }
        if (!sent) {
            server.send(400); // 400 Bad Request
        }
    });

    server.onNotFound([]() {
        if (server.method() != HTTP_GET) {
            server.send(405); // 405 Method Not Allowed
            return;
        }
        String contentType = getContentType(server.uri());

#ifdef DEBUG
        Serial.println(server.uri() + " (" + contentType + ")");
#endif

        if ( FFat.exists( server.uri() ) )
        {
#ifdef DEBUG
            Serial.println( "file exists");
#endif
            File fileToRead = FFat.open(server.uri());
            server.streamFile(fileToRead, contentType, 200);
            return;
        }else{
#ifdef DEBUG
            Serial.println( "file not found!");
#endif

        }
        server.send(404); // 404 Not Found
    });
    server.begin();
    while (1) {
        dns.processNextRequest();
        server.handleClient();
        delay(1);
    }
}

int8_t SharedMemInit(int _cs) {
    portENTER_CRITICAL(&shared_mutex);
    memset((void *)shared_memory, 0, sizeof(shared_memory));
    portEXIT_CRITICAL(&shared_mutex);
    xTaskCreateUniversal(server_task, "task", 8192, NULL, 3, NULL, PRO_CPU_NUM);
    return 0;
}

int8_t SharedMemWrite(uint16_t adr, uint16_t len, uint8_t buf[]) {
    if ((adr + len) > sizeof(shared_memory)) {
        return -1;
    }
    portENTER_CRITICAL(&shared_mutex);
    memcpy((void *)shared_memory + adr, buf, len);
    portEXIT_CRITICAL(&shared_mutex);
    return 0;
}

int8_t SharedMemRead(uint16_t adr, uint16_t len, uint8_t buf[]) {
    if ((adr + len) > sizeof(shared_memory)) {
        return -1;
    }
    portENTER_CRITICAL(&shared_mutex);
    memcpy(buf, (void *)shared_memory + adr, len);
    portEXIT_CRITICAL(&shared_mutex);
    return 0;
}
