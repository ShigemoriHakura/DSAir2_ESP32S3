
/*********************************************************************
 * Desktop Station air Sketch for DSair Hardware Platform
 *
 * Copyright (C) 2018 DesktopStation Co.,Ltd. / Yaasan
 * https://desktopstation.net/
 */

#define DEBUG
// include the library code:
#include <Arduino.h>
#include <SPI.h>
//#include <avr/wdt.h>
//#include <avr/io.h>
//#include <util/delay.h>
//#include <avr/interrupt.h>
//#include <avr/pgmspace.h>
#include "DSCoreM_Type.h"
#include "DSCoreM_Common.h"
#include "DSCoreM_List.h"
#include "DSCoreM_DCC.h"
#include "DSCoreM_MM2.h"
#include "DSCoreM.h"
#include "Functions.h"
#include "FlashAirSharedMem.h"
#include "TrackReporterS88_DS.h"

#define PIN_PWMA 9      // G19 (IN1)
#define PIN_PWMB 10     // G23 (IN2)
#define PIN_EDC  11     // G33 (VIN/10)
#define PIN_RUNLED 12   // dummy
#define PIN_ALERT 6     // G22 (nFAULT)
#define PIN_S88CHK 0,1  // dummy
#define PIN_SPICS 0     // dummy
#define PIN_CURRENT 5   // G25 (IPROPI)
#define SENSOR_CURRENT PIN_CURRENT

#define THRESHOLD_EDC 1117  //  9V/10/3.3V*4096
#define THRESHOLD_EDC_DSA 1117  //  9V/10/3.3V*4096
#define THRESHOLD_OV  2978  // 24V/10/3.3V*4096
#define THRESHOLD_OV_DSA  2978  // 24V/10/3.3V*4096

//#define THRESHOLD_EDC 276  // 1024d * (1.2 / 8) * 9V / 5V
//#define THRESHOLD_EDC_DSA 375  // 1024d * (1.2 / 5.9) * 9V / 5V
//#define THRESHOLD_OV  553  // 1024d * (1.2 / 8) * 20V / 5V
//#define THRESHOLD_OV_DSA  999  // 1024d * (1.2 / 5.9) * 20V / 5V

void pinMode(uint8_t flag, uint8_t pin, uint8_t mode) { switch (pin) {
    case 22: pinMode(pin, mode); break;
    case 33: pinMode(pin, mode); break;
}}
void digitalWrite(uint8_t flag, uint8_t pin, uint8_t val) { switch (pin) {
    case 0: digitalWrite(PIN_RUNLED, val); break;
}}
int digitalRead(uint8_t flag, uint8_t pin) { switch (pin) {
    case 22: return ((digitalRead(pin) == LOW) ? HIGH : LOW);
    default: return 0;
}}
void analogWrite(uint8_t pin, int value) {}
uint16_t analogRead(uint8_t flag, uint8_t pin) { switch (pin) {
    case 33: return (analogRead(pin) * 11 / 32);
    default: return 0;
}}
void gpio_put(unsigned char gpio, bool value) { switch (gpio) {
    case 21: digitalWrite(PIN_PWMA, value); break;
    case 20: digitalWrite(PIN_PWMB, value); break;
}}
unsigned char g_adc_input = 0;
void adc_init() {
    //M5.begin(false, false, true);
    pinMode(PIN_PWMA, OUTPUT);
    pinMode(PIN_PWMB, OUTPUT);
}
void adc_gpio_init(unsigned char gpio) {}
void adc_select_input(unsigned char input) {
    g_adc_input = input;
}
unsigned short adc_read() { switch (g_adc_input) {
    case 2: return analogRead(PIN_CURRENT) >> 3;
    default: return 0;
}}
void wdt_enable(unsigned char value) {}
void wdt_reset() {}
unsigned char TCCR1B = 0;
int8_t SharedMemRead2(uint16_t adr, uint16_t len, uint8_t buf[]) {
    return SharedMemRead(adr, len, buf); }
int8_t SharedMemWrite2(uint16_t adr, uint16_t len, uint8_t buf[]) {
    return SharedMemWrite(adr, len, buf); }

#define FIRMWARE_VER   '7' /* 0-9, a-z, A-Z*/

#define MAX_S88DECODER 1

#define LEDSTATE_STOP 0
#define LEDSTATE_RUN 1
#define LEDSTATE_ERR 2
#define LEDSTATE_NOSD 3
#define LEDSTATE_ANALOG 4
/*#define PIN_PWMA 9
#define PIN_PWMB 10
#define PIN_EDC A1
#define PIN_RUNLED	2
#define PIN_ALERT 3
#define PIN_S88CHK A0
#define PIN_SPICS 4
#define PIN_CURRENT A2*/

#define ENABLE_RAILCOM 1	//0: Disable, 1: Enable

#define SMEM_POWER		0
#define SMEM_ERROR		1
#define SMEM_EDC		2
#define SMEM_CUR		3
#define SMEM_SEQ		4
#define SMEM_S88_1		5
#define SMEM_S88_2		6
#define SMEM_S88_3		7
#define SMEM_S88_4		8

#define SHAREMEM_SIZE 48
#define SHAREMEM_STATUS_SIZE 264 //32 + 16 + 32x2 + 19 * 8= 112 + 144=264
#define SHAREMEM_ACCSIZE 32

//#define THRESHOLD_EDC 276  // 1024d * (1.2 / 8) * 9V / 5V
//#define THRESHOLD_EDC_DSA 375  // 1024d * (1.2 / 5.9) * 9V / 5V
//#define THRESHOLD_OV  553  // 1024d * (1.2 / 8) * 20V / 5V
//#define THRESHOLD_OV_DSA  999  // 1024d * (1.2 / 5.9) * 20V / 5V

#define HW_DSS1		0
#define HW_DSAIR1	1
#define HW_DSAIR2	2

#define CMDMODE_WIFI 0
#define CMDMODE_SERIAL 1

#define TIMEOUT_SERIAL 30

#define MAX_LOCSTATUS_WEB	8

#ifdef __LGT8FX8P__
#define ADC_SHIFT 2
#else
#define ADC_SHIFT 0
#endif


typedef struct {
	byte mOV:1;
	byte mOC:1;
	byte mLV:1;
	byte mUnk1:1;
	byte mUnk2:1;
	byte reserved:3;
} DATA_STATUS;

typedef struct {
	word mAddress;//Marklin Address Format
	byte mSpeed;//(1/4 Data)
	byte mDir;
	word mFuncBuf1;
	word mFuncBuf2;
	word mFuncBuf3;
	word mFuncBuf4;
	word mFuncBuf5;
} DATA_LOC;


byte gHardware = HW_DSS1;
byte gCMDMode = CMDMODE_WIFI;
uint8_t buffer_sharedStatusMem[SHAREMEM_STATUS_SIZE + 1];
uint8_t buffer_sharedMem[SHAREMEM_SIZE];
uint8_t buffer_lastcmd[SHAREMEM_SIZE];
uint8_t buffer_accessories[SHAREMEM_ACCSIZE];

/* 機関車データ確認 */
DATA_LOC gLocStatus[MAX_LOCSTATUS_WEB];

/* FlashAir接続確認 */
byte gFlag_FlashAir;
byte gFlag_Serial = TIMEOUT_SERIAL;
uint8_t gFlashAirAccess = 0;

/* Decralation classes */
DSCoreLib DSCore;
TrackReporterS88_DS reporter(MAX_S88DECODER);


/* LED functions */
byte gLED_State = LEDSTATE_STOP;
byte gLED_Toggle = 0;
byte gLED_Counter = 0;

/* Sensor */
short gOffset_Current = 0;
word gEdc_data = 0;
short gCur_data = 0;
uint8_t gSwSensor = 0;
uint8_t gMaxS88Num = 0;

/* Error Threshold */
word gThreshold_OV = 0;
word gThreshold_LV = 0;
byte gLastErrorNo = 0;
uint8_t gAliveSeq = 0;

/* Parser */
String gRequest;
String function;
word arguments[4];
byte numOfArguments;
word gLocAddresses[4] = {0,0,0,0};
byte numOfLocAddr = 0;
boolean result;

DATA_STATUS gStatus;


//Task Schedule
unsigned long gPreviousL7 = 0; // 1000ms interval(Packet Task)
unsigned long gPreviousL5 = 0; //   50ms interval
unsigned long gPreviousL8 = 0; // 1000ms interval


void SetAnalogSpeed(word inSpeed, byte inDir);
void printString(const char *s, int x, int y);
void ReplyPowerPacket(byte inPower);
boolean SDIO_ReadSharedMem();
boolean SDIO_WriteSharedMem_Status();
boolean SDIO_WriteSharedMem_CVReply(word inCVNo, uint8_t inValue);
void SDIO_ClearSharedMem();
int8_t SharedMemRead2(uint16_t adr, uint16_t len, uint8_t buf[]);
int8_t SharedMemWrite2(uint16_t adr, uint16_t len, uint8_t buf[]);


void LOCMNG_Clear(void);
byte LOCMNG_SetLocoSpeed(word inAddr, word inSpd);
byte LOCMNG_SetLocoDir(word inAddr, byte inDir);
byte LOCMNG_SetLocoFunc(word inAddr, byte inNo, byte inPower);
void LOCMNG_UpdateAcc(word inNo);

/***********************************************************************
*
* Boot setup
*
*
************************************************************************/

void setup()
{
	/* Debug message for PC */
	Serial.begin(115200);
	while (!Serial);

	Serial.println("Desktop Station air");

	//初期化
	LOCMNG_Clear();

	for( int i = 0; i < SHAREMEM_ACCSIZE; i++)
	{
		buffer_accessories[i] = 0;
	}

	//Pin mode
	pinMode(PIN_EDC, INPUT);//Edc
	pinMode(SENSOR_CURRENT, INPUT);
	pinMode(PIN_RUNLED, OUTPUT);
	pinMode(PIN_ALERT, INPUT_PULLUP);
	digitalWrite(PIN_ALERT, HIGH);

	pinMode(PIN_S88CHK, INPUT);
	digitalWrite(PIN_S88CHK, HIGH);

	/* DSCore初期化 */
	DSCore.Init();
	DSCore.gCutOut = ENABLE_RAILCOM;

	/* 線路に電源遮断 */
	DS_Power(0);

	/* Dammy sleep */
	CalcCurrentOffset();


	//Hardware seriesのチェック

	gHardware = HW_DSAIR2;
	gThreshold_OV = THRESHOLD_OV_DSA;
	gThreshold_LV = THRESHOLD_EDC_DSA;

	/* PULLUPを解除 */
	digitalWrite(PIN_S88CHK, LOW);

	/* 共有メモリクリア */
	ClearShareMem();

	switch(gHardware)
	{
	case HW_DSS1:
		Serial.println(F("HW: DSshield"));
		break;
	case HW_DSAIR1:
		Serial.println(F("HW: DSair1"));
		break;
	case HW_DSAIR2:
		Serial.println(F("HW: DSair2"));
		break;
	}
	Serial.println(F("-------------"));

	// Initialize SD card.
	Serial.print(F("Init SD card..."));

	if (SharedMemInit(PIN_SPICS) >= 0)
	{
		Serial.println(F("OK"));
		gFlag_FlashAir = 1;

		//共有メモリをクリア
		SDIO_ClearSharedMem();
		SDIO_WriteSharedMem_Status();

	} else {

		Serial.println(F("Retry"));

		/* Retry */
		delay(500);

		if (SharedMemInit(PIN_SPICS) >= 0)
		{
			Serial.println(F("OK"));
			gFlag_FlashAir = 1;

			//共有メモリをクリア
			SDIO_ClearSharedMem();
			SDIO_WriteSharedMem_Status();
		}
		else
		{
			/* 失敗 */
			Serial.println(F("NG"));
			gFlag_FlashAir = 0;
			gLED_State = LEDSTATE_NOSD;
		}


	}

	/* LED turn on */
	changeLED();

	Serial.println(F("100 Ready"));

	//Reset task
	gPreviousL5 = millis();
	gPreviousL8 = millis();
	gPreviousL7 = millis();

#if defined(__AVR_ATmega4809__)

	/*
	TCA1.SINGLE.PER = 256;

	// CMP sets the duty cycle of the PWM signal -> CT = CMP0 / PER
	// DUTY CYCLE is approximately 50% when CMP0 is PER / 2
	TCA1.SINGLE.CMP0 = 200;

	// Counter starts at 0
	TCA1.SINGLE.CNT = 0x00;

	// Configuring CTRLB register
	// Compare 0 Enabled: Output WO0 (PB0) is enabled
	// Single slope PWM mode is selected
	TCA1.SINGLE.CTRLB = TCA_SINGLE_CMP0EN_bm | TCA_SINGLE_WGMODE_SINGLESLOPE_gc;

	// Using system clock (no frequency division, the timer clock frequency is Fclk_per)
	// Enable the timer peripheral
	TCA1.SINGLE.CTRLA = TCA_SINGLE_CLKSEL_DIV1_gc | TCA_SINGLE_ENABLE_bm;
	*/

#else
	//Timer1 490Hz -> 31.4kHz
	TCCR1B &= B11111000;
	TCCR1B |= B00000001;
#endif

	sei();    //ENABLE INTERRUPTION

	/* ウォッチドッグ有効(1sec) */
	wdt_enable(9); // WDT reset


}


boolean parse()
{
	int aPosSlash = -1;

	char aTemp[SHAREMEM_SIZE];
	gRequest.toCharArray(aTemp, SHAREMEM_SIZE);

	int lpar = gRequest.indexOf('(');
	if (lpar == -1)
	{
		return false;
	}

	function = String(gRequest.substring(0, lpar));
	function.trim();

	int offset = lpar + 1;
	int aAdddrOffset = 0;
	int comma = gRequest.indexOf(',', offset);
	numOfArguments = 0;
	numOfLocAddr = 0;

	while (comma != -1)
	{
		String tmp = gRequest.substring(offset, comma);
		tmp.trim();

		/* スラッシュを探索する */
		aPosSlash = tmp.indexOf('/', 0);

		if( aPosSlash > 0)
		{
			tmp = tmp + "/";

			//Dammy値を指定
			arguments[numOfArguments++] = 0;
			aAdddrOffset = 0;

			//スラッシュはアドレス部だけに許可
			while( aPosSlash != -1)
			{
				String tmp2 = tmp.substring(aAdddrOffset, aPosSlash);
				tmp2.trim();

				if( numOfLocAddr < 4)
				{
					gLocAddresses[numOfLocAddr] = stringToWord(tmp2);
					numOfLocAddr++;
				}

				aAdddrOffset = aPosSlash + 1;
				aPosSlash = tmp.indexOf('/', aAdddrOffset);
			}

			offset = comma + 1;
			comma = gRequest.indexOf(',', offset);
		}
		else
		{
			arguments[numOfArguments++] = stringToWord(tmp);
			offset = comma + 1;
			comma = gRequest.indexOf(',', offset);
		}
	}

	int rpar = gRequest.indexOf(')', offset);
	while (rpar == -1)
	{
		return false;
	}

	if (rpar > offset)
	{
		String tmp = gRequest.substring(offset, rpar);
		tmp.trim();
		arguments[numOfArguments++] = stringToWord(tmp);
	}

	return true;
}

boolean dispatch()
{
	byte aValue;
	boolean aResult;
	byte aDir = 0;

	if ((function == "setLocoDirection") || ((function == "DI")))
	{

		if( arguments[1] > 0)
		{
			//FWD=1,REV=2を FWD=0,REV=1に変換
			aDir = arguments[1] - 1;

			//異常値はREV固定
			if(aDir > 1)
			{
				aDir = 1;
			}
		}
		else
		{
			//FWD固定
			aDir = 0;
		}

		if( numOfLocAddr > 0)
		{
			//重連対応
			for( int i = 0; i < numOfLocAddr; i++)
			{
				LOCMNG_SetLocoDir(gLocAddresses[i], aDir);
				aResult =  DSCore.SetLocoDirection(gLocAddresses[i], aDir);
			}

			aResult = true;
		}
		else
		{
			//非重連
			LOCMNG_SetLocoDir(arguments[0], aDir);
			aResult =  DSCore.SetLocoDirection(arguments[0], aDir);
		}

		return aResult;
	}
	else if ((function == "setLocoFunction") || ((function == "FN")))
	{
		LOCMNG_SetLocoFunc(arguments[0], arguments[1], arguments[2]);

		return DSCore.SetLocoFunction(arguments[0], arguments[1] + 1, arguments[2]);

	}
	else if ((function == "setTurnout") || ((function == "TO")))
	{
		//テーブル更新
		//MM2: 1(0x3000) - 320(0x3140)
		//DCC: 1(0x3800) - 2044(0x3FFC)

		word aAccAddr = 0;

		if( (arguments[0] >= 0x3000) && (arguments[0] <= 0x3140))
		{
			aAccAddr = arguments[0] - 0x3000;
		}
		else if( (arguments[0] >= 0x3800) && (arguments[0] <= 0x3FFC))
		{
			aAccAddr = arguments[0] - 0x3800;
		}

		if( (aAccAddr >> 3) <= 31)
		{
			if( arguments[1] == 0)
			{
				buffer_accessories[aAccAddr >> 3] = buffer_accessories[aAccAddr >> 3] & ~(1UL << (aAccAddr & 0x07));
			}
			else
			{
				buffer_accessories[aAccAddr >> 3] = buffer_accessories[aAccAddr >> 3] | (1UL << (aAccAddr & 0x07));
			}

			LOCMNG_UpdateAcc(aAccAddr >> 3);
		}

		//ポイントパケット出力登録

		return DSCore.SetTurnout(arguments[0], (byte)arguments[1]);

	}
	else if ((function == "setPower") || ((function == "PW")))
	{

		if( arguments[0] == 1)
		{
			//端子を解放
			FreeAnalogSpeed();

			//電流オフセット計測
			CalcCurrentOffset();

			/* 状態変更 */
			gLED_State = LEDSTATE_RUN;

			//FlashAirのバッファにセット
			RegisterShareMem(SMEM_POWER, 1);
			RegisterShareMem(SMEM_ERROR, 1);

		}
		else
		{
			/* 状態変更 */
			gLED_State = LEDSTATE_STOP;
			RegisterShareMem(SMEM_POWER, 0);
		}


		/* LED状態の変更 */
		gLED_Counter = 0;
		changeLED();

		return DSCore.SetPower(arguments[0]);

	}
	else if ((function == "setLocoSpeed") || ((function == "SP")))
	{
		if( numOfLocAddr > 0)
		{
			//重連対応
			for( int i = 0; i < numOfLocAddr; i++)
			{
				LOCMNG_SetLocoSpeed(gLocAddresses[i], arguments[1]);
				aResult =  DSCore.SetLocoSpeedEx(gLocAddresses[i], arguments[1], arguments[2]);
			}
			aResult = true;
		}
		else
		{
			//非重連
			LOCMNG_SetLocoSpeed(arguments[0], arguments[1]);
			aResult =  DSCore.SetLocoSpeedEx(arguments[0], arguments[1], arguments[2]);
		}

		return aResult;
	}
	else if (function == "DC")
	{
		//PRM0=Speed(0-1023), PRM1=Dir(0,1=FWD, 2=REV)
		if( (gLED_State == LEDSTATE_STOP) || (gLED_State == LEDSTATE_ANALOG))
		{

			if( arguments[0] > 0)
			{
				gLED_State = LEDSTATE_ANALOG;

				SetAnalogSpeed(arguments[0], arguments[1]);
			}
			else
			{
				SetAnalogSpeed(0, 0);
				gLED_State = LEDSTATE_STOP;
			}
		}

		return true;
	}
	else if ((function == "reset") || ((function == "RS")))
	{
		#ifdef DEBUG
		Serial.println(F("100 Ready"));
		#endif

		/* リセットパケットを投げる */
		if( gLED_State == LEDSTATE_RUN)
		{
			//内部のデータバッファを削除する
			DSCore.Clear();

			//リセット
			DSCore.SendReset();

		}

		return true;
	}
	/* reset */
	else if ((function == "setPing") || ((function == "PG")))
	{
		/* Type(2bytes), Version(2bytes), UID(4bytes) */
		Serial.println(F("@DSG,00,03,00,02,00,00,00,00"));

		if( gFlag_FlashAir == 0)
		{
			/* DSair2互換 */
			Serial.print("@DSS,");

			for( word i = 0; i <= 264; i++)
			{
				Serial.print(char(buffer_sharedStatusMem[i]));
			}

			Serial.println("");
		}

		return true;
	}
	else if ((function == "getLocoConfig") || ((function == "GV")))
	{

		/* Clear Share Mem*/
		//SDIO_ClearSharedMem();

		//Clear last CV data
		SDIO_WriteSharedMem_CVReply(0, 0);

		//Send to FlashAir Shared Memory
		SDIO_WriteSharedMem_Status();

		/* LED turn on */
		digitalWrite(PIN_RUNLED, HIGH);

		/* Reset watchdog timer. */
		wdt_reset();

		aValue = 0;
		aResult = DSCore.ReadConfig( arguments[1], &aValue, 0, 0);


		//Send to Serial
		Serial.print("@CV,");
		Serial.print(arguments[0]);
		Serial.print(",");
		Serial.print(arguments[1]);
		Serial.print(",");

		if( aResult == true)
		{
			Serial.print(aValue);

			//Write to FlashAir
			SDIO_WriteSharedMem_CVReply(arguments[1], aValue);
			SDIO_WriteSharedMem_Status();
		}
		else
		{
			Serial.print(0xFFFF);

			//Write to FlashAir
			SDIO_WriteSharedMem_CVReply(0, 255);//255 is error no (Read. but not found)
			SDIO_WriteSharedMem_Status();
		}

		Serial.println(",");
		/* LED turn off */
		changeLED();

		//FlashAir 共有メモリSPI送信
		SDIO_WriteSharedMem_Status();


		return true;
	}
	else if (function == "gS8")
	{
		int aMaxS88Num = MAX_S88DECODER;

		//S88 Normal mode
		if( arguments[0] > 0)
		{
			aMaxS88Num = arguments[0];
		}

		if( aMaxS88Num > 2)
		{
			aMaxS88Num = 2;
		}

		gMaxS88Num = aMaxS88Num;

		char aStrTemp[2];
		sprintf(aStrTemp, "%d", gMaxS88Num);
		buffer_sharedStatusMem[20] = aStrTemp[0];

		return true;

	} /* getS88 for Wi-Fi */
	else if (function == "getS88")
	{
		int aMaxS88Num = MAX_S88DECODER;

		if( arguments[0] > 0)
		{
			aMaxS88Num = arguments[0];
		}

		//Send a S88 sensor reply
		Serial.print("@S88,");

		reporter.refresh(aMaxS88Num);

		word aFlags = 0;

		for( int j = 0; j < aMaxS88Num; j++)
		{
		  aFlags = (reporter.getByte((j << 1) + 1) << 8) + reporter.getByte(j << 1);

		  Serial.print((word)aFlags, HEX);
		  Serial.print(",");
		}

		Serial.println("");

		return true;

	} /* getS88 */
	else if ((function == "setLocoConfig") || ((function == "SV")))
	{

		Serial.print("@CVWrite,");
		Serial.print(arguments[1]);
		Serial.print(",");
		Serial.print(arguments[2]);
		Serial.println("");


		//Clear last CV data
		SDIO_WriteSharedMem_CVReply(0, 0);

		//Send to FlashAir Shared Memory
		SDIO_WriteSharedMem_Status();

		/* LED turn on */
		digitalWrite(PIN_RUNLED, HIGH);

		/* Reset watchdog timer. */
		wdt_reset();

		DSCore.WriteConfig_Dir( arguments[1], arguments[2]);

		//Write to FlashAir
		SDIO_WriteSharedMem_CVReply(arguments[1], arguments[2]);
		SDIO_WriteSharedMem_Status();


		/* LED turn off */
		changeLED();

		return true;
	}
	else if ((function == "cutout") || ((function == "CO")))
	{
		/* Railcom CutOut */
		DSCore.gCutOut = (arguments[0] == 1) ? 1: 0;

		return true;
	}

	else
	{
		return false;
	}
}

/***********************************************************************
*
* Timer Interval
*
************************************************************************/

void loop()
{
	long aEdc;
	signed long aCur;
	uint8_t aErrNo = 1;


	//パルスジェネレータのスキャン
	DSCore.Scan();

	if( (millis() - gPreviousL5) >= 200)
	{
		//Reset task
		gPreviousL5 = millis();

		//LED Control
		taskLED();

		/* Reset watchdog timer. */
		wdt_reset();
	}

	if( (millis() - gPreviousL8) >= 500)
	{

		//Reset task
		gPreviousL8 = millis();

		//S88 Scan
		ScanS88();

		/* Sensor check */
		if( gSwSensor == 0)
		{
			gSwSensor = 1;
			gEdc_data = analogRead(PIN_EDC) >> ADC_SHIFT;

			/* OV check */
			if( gEdc_data > gThreshold_OV )
			{
				aErrNo = 4;
			}

			/* LV check */
			if( gEdc_data < gThreshold_LV )
			{
				aErrNo = 2;

			}

			// 1024d * (1.2 / 5.9) * Y[V] / 5[V] = X
			// xV / 10 / 3.3V * 4096 = gEdc_data
			// xV = gEdc_data / 4096 * 3.3 * 10 * 10
			// ->
			//aEdc = (((long)gEdc_data * 246) >> 10);
			aEdc = (long)gEdc_data * 0.085;

			if( aEdc > 255)
			{
				aEdc = 255;
			}
			//Sensor Write
			RegisterShareMem(SMEM_EDC, aEdc);

		}
		else
		{
			gSwSensor = 0;
			gCur_data = analogRead(PIN_CURRENT) >> ADC_SHIFT;

			Serial.print("Cur:");
			Serial.println(gCur_data);

			/* 電流の向きを正規化 */
			if( gCur_data >= gOffset_Current)
			{
				gCur_data = gCur_data - gOffset_Current;
			}
			else
			{
				gCur_data = gOffset_Current - gCur_data;
			}

			aCur = ((long)gCur_data * 651) / 213;

			if( aCur > 1250)
			{
				aCur = 1250;
			}

			RegisterShareMem(SMEM_CUR, aCur);

		}


		/* DSairR2 HW  */
		if( (digitalRead(PIN_ALERT) == 0) && (gHardware == HW_DSAIR2))
		{
			//Falut happened at DRV8876
			aErrNo = 8;
		}


		/* エラー処理 */
		if( aErrNo > 1)
		{

#ifdef DEBUG
		Serial.print("Error:");
		Serial.println(aErrNo);
#endif
			if( DSCore.IsPower() == 1)
			{
				PowerOffByErr(aErrNo);
				//Serial.println(aErrNo);
			}

			//FlashAirのバッファにセット
			RegisterShareMem(SMEM_ERROR, aErrNo);

		}

		/* USB-PCモード切替 */
		if( gFlag_Serial > 0)
		{
			gFlag_Serial--;
		}

		//送信回数
		RegisterShareMem(SMEM_SEQ, gAliveSeq);

		if( gAliveSeq >= 99)
		{
			gAliveSeq = 0;
		}
		else
		{
			gAliveSeq++;
		}

		//パルスジェネレータのスキャン
		DSCore.Scan();

		//FlashAir 共有メモリSPI送信
		SDIO_WriteSharedMem_Status();
	}

	//FlashAir 有り無しの処理分岐
	if( gFlag_FlashAir != 0)
	{
		gFlashAirAccess++;

		if( gFlashAirAccess > 4)
		{
			gFlashAirAccess = 0;
		}

		if( gFlashAirAccess == 0)
		{

			/* コマンド受信＆処理 */
			boolean aRecvShareMem= SDIO_ReadSharedMem();

			if( aRecvShareMem == true)
			{
				//データをシリアルに流し込む
				gRequest = "";

				for( int i = 0; i < SHAREMEM_SIZE; i++)
				{
					if( buffer_sharedMem[i] != ')' )
					{
						char aWord = (char)(buffer_sharedMem[i]);

						gRequest = gRequest + aWord;
					}
					else
					{
						gRequest = gRequest + ")";
						break;
					}
				}

				if (parse())
				{
					#ifdef DEBUG
					Serial.println(gRequest);
					#endif

					if (dispatch())
					{
						#ifdef DEBUG
						Reply200();
						#endif
					}
					else
					{
						#ifdef DEBUG
						Reply300();
						#endif
					}
				}
				else
				{
					#ifdef DEBUG
					Reply301();
					#endif
				}

			}
			else
			{
				/* Nothing to do */


			}
		}
	}


	if( (gFlag_Serial > 0) || (gFlag_FlashAir == 0))
	{

		int aReceived = receiveRequest();

		if( aReceived > 0)
		{
			gFlag_FlashAir = 0;

	  		if (parse()) {

	  			#ifdef DEBUG
				Serial.println(gRequest);
				#endif

				if (dispatch()) {
					Reply200();
				} else {
					Reply300();
				}

			} else {
				Reply301();
			}

			/* Reply to Desktop Station */
		}
		else
		{
			/* Nothing to do */

		}

	}

}

void Reply200(void)
{
	Serial.println(F("200 Ok"));
}

void Reply300(void)
{
	Serial.println(F("300 Cmd err"));
}

void Reply301(void)
{
	Serial.println(F("301 Stx err"));
}

void Reply302(void)
{
	Serial.println(F("302 Timeout"));
}

void Reply303(void)
{
	Serial.println(F("303 Unkn err"));
}

void Reply304(void)
{
	Serial.println(F("304 Ser err"));
}


void ScanS88(void)
{

	if( gFlag_FlashAir == 0)
	{
		return;
	}

	if( gMaxS88Num > 0)
	{
		reporter.refresh(gMaxS88Num);

		for( int j = 0; j < gMaxS88Num; j++)
		{
			RegisterShareMem(SMEM_S88_1 + j * 2, reporter.getByte(j << 1));
			RegisterShareMem(SMEM_S88_2 + j * 2, reporter.getByte((j << 1) + 1));

		}


	}
}



void PowerOffByErr(uint8_t inErrNo)
{
	DSCore.SetPower(0);
	delay(10);
	ReplyPowerPacket(0);
	DSCore.SetPower(0);

	/* 状態変更 */
	gLED_State = LEDSTATE_ERR;
	gLED_Counter =0;
	gLastErrorNo = inErrNo;

	/* FlashAirにも反映 */
	RegisterShareMem(SMEM_POWER, 0);

}

void ReplyPowerPacket(byte inPower)
{
	#ifdef DEBUG
	/* Power */
	Serial.print("@PWR,");
	Serial.print(inPower);
	Serial.println(",");
	#endif
}


void changeLED(void)
{

	switch( gLED_State)
	{
	case LEDSTATE_STOP:
		digitalWrite(PIN_RUNLED, LOW);
		break;

	case LEDSTATE_RUN:
		digitalWrite(PIN_RUNLED, HIGH);
		break;

	case LEDSTATE_ANALOG:
		break;

	case LEDSTATE_ERR:
		break;

	case LEDSTATE_NOSD:
		break;
	}
}

void taskLED(void)
{

	/* カウンタを回す(200msで1カウント) */
	gLED_Counter++;
	gLED_Counter = gLED_Counter & 0b1111;

	//LED操作
	switch( gLED_State)
	{
	case LEDSTATE_STOP:

		if( gLED_Counter <= 3)
		{
			digitalWrite(PIN_RUNLED, HIGH);
		}
		else
		{
			digitalWrite(PIN_RUNLED, LOW);
		}
		break;

	case LEDSTATE_RUN:
		break;

	case LEDSTATE_ERR:

		if( gLED_Toggle == 0)
		{
			digitalWrite(PIN_RUNLED, LOW);
		}
		else
		{
			digitalWrite(PIN_RUNLED, HIGH);
		}

		gLED_Toggle = (~gLED_Toggle) & 1;
		break;

	case LEDSTATE_ANALOG:
		if( (gLED_Counter == 0) || (gLED_Counter == 8))
		{
			digitalWrite(PIN_RUNLED, LOW);
		}
		else
		{
			digitalWrite(PIN_RUNLED, HIGH);
		}

		break;

	case LEDSTATE_NOSD:

		if( gLED_Counter <= 0)
		{
			digitalWrite(PIN_RUNLED, HIGH);
		}
		else if(gLED_Counter == 2)
		{
			digitalWrite(PIN_RUNLED, HIGH);
		}
		else
		{
			digitalWrite(PIN_RUNLED, LOW);
		}

		break;
	}
}

void SetAnalogSpeed(word inSpeed, byte inDir)
{

	word aSpeed = inSpeed >> 2;

	if( aSpeed > 255)
	{
		aSpeed = 255;
	}

	if( inSpeed == 0)
	{
		FreeAnalogSpeed();
	}
	else
	{
		if( inDir == 2)
		{
			//REV
			analogWrite(PIN_PWMA, 255 - aSpeed);
			analogWrite(PIN_PWMB, 255);
		}
		else
		{
			//FWD
			analogWrite(PIN_PWMB, 255 - aSpeed);
			analogWrite(PIN_PWMA, 255);
		}
	}
}

void FreeAnalogSpeed()
{
	analogWrite(PIN_PWMB, 0);
	analogWrite(PIN_PWMA, 0);
}

void SDIO_ClearSharedMem()
{
	//Clear Buffer
	memset(buffer_sharedMem, 0, SHAREMEM_SIZE);

	if( SharedMemWrite2( 0, SHAREMEM_SIZE, buffer_sharedMem))
	{
		Serial.println(F("\nwrite err"));
		return;
	}

	//Update LastCommandBuffer
	for( byte i = 0; i < SHAREMEM_SIZE; i++)
	{
		buffer_lastcmd[i] = 0;
	}

}

boolean SDIO_ReadSharedMem()
{
	boolean aResultFnc = false;
	uint8_t aChk = 0;

	if( gFlag_FlashAir == 0)
	{
		return aResultFnc;
	}

	//Clear Buffer
	//memset(buffer_sharedMem, 0, SHAREMEM_SIZE);

	if( SharedMemRead2(0, SHAREMEM_SIZE, buffer_sharedMem))
	{
		Serial.println("\nread err");
		return false;
	}

	//Check between received command and last one.
	for( byte i = 0; i < SHAREMEM_SIZE; i++)
	{
		if( buffer_sharedMem[i] == 0x00)
		{
			break;
		}

		if( buffer_lastcmd[i] != buffer_sharedMem[i])
		{
			aChk++;
			break;
		}
	}

	if( buffer_sharedMem[0] == 0x00)
	{
		//Shared memory is empty
		aResultFnc = false;
	}
	else if( aChk == 0)
	{
		//Same command received.
		aResultFnc = false;
	}
	else
	{
		aResultFnc = true;

		//Update LastCommandBuffer
		for( byte i = 0; i < SHAREMEM_SIZE; i++)
		{
			buffer_lastcmd[i] = buffer_sharedMem[i];
		}

	}

	return aResultFnc;
}


boolean SDIO_WriteSharedMem_Status()
{

	if( gFlag_FlashAir == 0)
	{
		return false;
	}

	if( SharedMemWrite2( 0x80, SHAREMEM_STATUS_SIZE, buffer_sharedStatusMem))
	{
		Serial.println(F("\nwrite err"));

		return false;
	}
	else
	{
		return true;
	}
}

void ClearShareMem()
{

	buffer_sharedStatusMem[0] = 0x4e;//PWR
	buffer_sharedStatusMem[1] = 0x2c;//カンマ
	buffer_sharedStatusMem[2] = 0x30;//ERR
	buffer_sharedStatusMem[3] = 0x2c;//カンマ
	buffer_sharedStatusMem[4] = FIRMWARE_VER;//VER
	buffer_sharedStatusMem[5] = 0x2c;//カンマ
	buffer_sharedStatusMem[6] = 0x30;//制御車両数(0-15, 16進数)
	buffer_sharedStatusMem[7] = 0x2c;//カンマ
	buffer_sharedStatusMem[8] = 0x30;//電圧
	buffer_sharedStatusMem[9] = 0x30;
	buffer_sharedStatusMem[10] = 0x30;
	buffer_sharedStatusMem[11] = 0x2c;//カンマ
	buffer_sharedStatusMem[12] = 0x30;//電流
	buffer_sharedStatusMem[13] = 0x30;
	buffer_sharedStatusMem[14] = 0x2c;//カンマ
	buffer_sharedStatusMem[15] = 0x30 + gHardware;//HW version
	buffer_sharedStatusMem[16] = 0x2c;//カンマ
	buffer_sharedStatusMem[17] = 0x30;//送信回数
	buffer_sharedStatusMem[18] = 0x30;//送信回数（生存チェック)
	buffer_sharedStatusMem[19] = 0x2c;//カンマ
	buffer_sharedStatusMem[20] = 0x30;//S88 MAX
	buffer_sharedStatusMem[21] = 0x30;//S88 1L
	buffer_sharedStatusMem[22] = 0x30;//S88 1H
	buffer_sharedStatusMem[23] = 0x30;//S88 2L
	buffer_sharedStatusMem[24] = 0x30;//S88 2H
	buffer_sharedStatusMem[25] = 0x30;//S88 3L
	buffer_sharedStatusMem[26] = 0x30;//S88 3H
	buffer_sharedStatusMem[27] = 0x30;//S88 4L
	buffer_sharedStatusMem[28] = 0x30;//S88 4H
	buffer_sharedStatusMem[29] = 0x30;//S88 reserved
	buffer_sharedStatusMem[30] = 0x30;//S88 reserved
	buffer_sharedStatusMem[31] = 0x3b;

	//CV
	for(int i = 0; i < 15; i++)
	{
		buffer_sharedStatusMem[32 + i] = 0x30;
	}

	buffer_sharedStatusMem[47] = 0x3b;


	//ポイント

	for(int i = 0; i < SHAREMEM_ACCSIZE; i++)
	{
		buffer_sharedStatusMem[48 + i * 2] = 0x30;
		buffer_sharedStatusMem[48 + i * 2 + 1] = 0x30;
	}

		buffer_sharedStatusMem[112] = 0x3b;	//;


	//アクティブな車両データ(最新5つ)

	for(int i = 0; i < MAX_LOCSTATUS_WEB; i++)
	{
		buffer_sharedStatusMem[113 + i * 19] = 0x30;	//LocAddr
		buffer_sharedStatusMem[113 + i * 19 + 1] = 0x30;//LocAddr
		buffer_sharedStatusMem[113 + i * 19 + 2] = 0x30;//LocAddr
		buffer_sharedStatusMem[113 + i * 19 + 3] = 0x30;//LocAddr
		buffer_sharedStatusMem[113 + i * 19 + 4] = 0x2C;//,
		buffer_sharedStatusMem[113 + i * 19 + 5] = 0x30;//Spd
		buffer_sharedStatusMem[113 + i * 19 + 6] = 0x30;//Spd
		buffer_sharedStatusMem[113 + i * 19 + 7] = 0x2C;//,
		buffer_sharedStatusMem[113 + i * 19 + 8] = 0x30;//Dir
		buffer_sharedStatusMem[113 + i * 19 + 9] = 0x2C;//,
		buffer_sharedStatusMem[113 + i * 19 + 10] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 11] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 12] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 13] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 14] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 15] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 16] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 17] = 0x30;//Fnc
		buffer_sharedStatusMem[113 + i * 19 + 18] = 0x2f;///
	}


}

void RegisterShareMem(uint8_t inNumber, uint16_t inValue)
{
	/*
	0x1000-0x107F FlashAir→Arduino コマンド
	0x1080-0x10AF ステータス
	0x10B0-0x10C0 CV Reply
	*/

	char aTxtBuf[5];



	switch(inNumber)
	{
	case SMEM_POWER:
		//Power
		buffer_sharedStatusMem[0] = (inValue == 1) ? 0x59 : 0x4e;
		break;

	case SMEM_ERROR:
		//ErrorCode
		sprintf(aTxtBuf,"%d",inValue);//0x00は無効
		buffer_sharedStatusMem[2] = aTxtBuf[0];
		break;

	case SMEM_EDC:
		//電圧
		sprintf(aTxtBuf,"%03d",inValue);//0x00は無効
		buffer_sharedStatusMem[8] = aTxtBuf[0];
		buffer_sharedStatusMem[9] = aTxtBuf[1];
		buffer_sharedStatusMem[10] = aTxtBuf[2];

		break;

	case SMEM_CUR:
		//電流
		sprintf(aTxtBuf,"%03d",inValue);//0x00は無効
		buffer_sharedStatusMem[12] = aTxtBuf[0];
		buffer_sharedStatusMem[13] = aTxtBuf[1];
		break;

	case SMEM_SEQ:
		sprintf(aTxtBuf,"%02d",inValue);//0x00は無効
		buffer_sharedStatusMem[17] = aTxtBuf[0];
		buffer_sharedStatusMem[18] = aTxtBuf[1];
		break;
	case SMEM_S88_1:
		sprintf(aTxtBuf,"%02X",inValue);//0x00は無効
		buffer_sharedStatusMem[21] = aTxtBuf[0];
		buffer_sharedStatusMem[22] = aTxtBuf[1];
		break;
	case SMEM_S88_2:
		sprintf(aTxtBuf,"%02X",inValue);//0x00は無効
		buffer_sharedStatusMem[23] = aTxtBuf[0];
		buffer_sharedStatusMem[24] = aTxtBuf[1];
		break;
	case SMEM_S88_3:
		sprintf(aTxtBuf,"%02X",inValue);//0x00は無効
		buffer_sharedStatusMem[25] = aTxtBuf[0];
		buffer_sharedStatusMem[26] = aTxtBuf[1];
		break;
	case SMEM_S88_4:
		sprintf(aTxtBuf,"%02X",inValue);//0x00は無効
		buffer_sharedStatusMem[27] = aTxtBuf[0];
		buffer_sharedStatusMem[28] = aTxtBuf[1];
		break;

	}
}

boolean SDIO_WriteSharedMem_CVReply(word inCVNo, uint8_t inValue)
{
	byte i;

	if( gFlag_FlashAir == 0)
	{
		return false;
	}

	char aBufCVReply[16];

	if( (inCVNo == 0) && (inValue == 0) )
	{
		for( i = 0; i < 15; i++)
		{
			buffer_sharedStatusMem[32 + i] = 0x30;
		}
	}
	else
	{

		//@CV,9999,255, (13文字)
		sprintf(aBufCVReply, "@CV,%04d,%03d,  ", inCVNo, inValue);

		for( i = 0; i < 15; i++)
		{
			buffer_sharedStatusMem[32 + i] = aBufCVReply[i];
		}
	}


	return true;
}


void LOCMNG_UpdateAcc(word inNo)
{
	char aBuf2[2];

	sprintf(aBuf2, "%02x", buffer_accessories[inNo]);

	buffer_sharedStatusMem[48 + inNo * 2] = aBuf2[1];
	buffer_sharedStatusMem[48 + inNo * 2 + 1] = aBuf2[0];

}

//FFFF,1,FFFFFFFF



void CalcCurrentOffset()
{
	unsigned short aCurrentSum = 0;

#ifdef DEBUG
	Serial.print("ADC:");
	Serial.println(analogRead(PIN_EDC));
#endif

	if( gOffset_Current == 0)
	{
		/* 直流中間に電圧が印加されてないと、実際の動作時のADCのオフセット誤差が異なる */
		if( analogRead(PIN_EDC) >= THRESHOLD_EDC)
		{

			for( int i = 0; i < 4; i++)
			{
				aCurrentSum = aCurrentSum + (analogRead(PIN_CURRENT) >> ADC_SHIFT);
				delay(10);
			}

			//平均値を算出
			gOffset_Current = aCurrentSum >> 2;
		}
	}

	/* 検出できない場合は512をオフセット値にセット */
	if( gOffset_Current == 0)
	{
		gOffset_Current = 512;
	}
}

void LOCMNG_Clear(void)
{
	for( int i = 0; i < MAX_LOCSTATUS_WEB; i++)
	{
		gLocStatus[i].mAddress = 0;
		gLocStatus[i].mSpeed = 0;
		gLocStatus[i].mDir = 0;
		gLocStatus[i].mFuncBuf1 = 0;
		gLocStatus[i].mFuncBuf2 = 0;
		gLocStatus[i].mFuncBuf3 = 0;//未使用
		gLocStatus[i].mFuncBuf4 = 0;//未使用
		gLocStatus[i].mFuncBuf5 = 0;//未使用
	}
}


byte LOCMNG_SetLocoSpeed(word inAddr, word inSpd)
{
	byte aIndex = 255;
	word aSpeed = 0;

	for( int i = 0; i < MAX_LOCSTATUS_WEB; i++)
	{
		if( (gLocStatus[i].mAddress == inAddr) || ( gLocStatus[i].mAddress == 0 ))
		{
			aIndex = i;
			break;
		}
	}

	if( aIndex != 255)
	{
		gLocStatus[aIndex].mAddress = inAddr;
		aSpeed = inSpd >> 2;

		if( aSpeed > 255)
		{
			aSpeed = 255;
		}

		char aStrAddr[5];
		char aStrSpd[3];

		sprintf(aStrAddr, "%04X", gLocStatus[aIndex].mAddress);
		sprintf(aStrSpd, "%02X", aSpeed);

		/* FlashAir共有メモリ書き換え */
		buffer_sharedStatusMem[113 + aIndex * 19	] = aStrAddr[0];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 1] = aStrAddr[1];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 2] = aStrAddr[2];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 3] = aStrAddr[3];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 5] = aStrSpd[0];//Spd
		buffer_sharedStatusMem[113 + aIndex * 19 + 6] = aStrSpd[1];//Spd

	}

	return 0;
}

byte LOCMNG_SetLocoDir(word inAddr, byte inDir)
{
	byte aIndex = 255;

	for( int i = 0; i < MAX_LOCSTATUS_WEB; i++)
	{
		if( (gLocStatus[i].mAddress == inAddr) || ( gLocStatus[i].mAddress == 0 ))
		{
			aIndex = i;
			break;
		}
	}

	if( aIndex != 255)
	{
		gLocStatus[aIndex].mAddress = inAddr;

		if( gLocStatus[aIndex].mDir != inDir)
		{
			gLocStatus[aIndex].mDir = inDir;

			buffer_sharedStatusMem[113 + aIndex * 19 + 5] = 0x30;//Spd
			buffer_sharedStatusMem[113 + aIndex * 19 + 6] = 0x30;//Spd
		}

		char aStrAddr[5];
		char aStrDir;

		sprintf(aStrAddr, "%04X", gLocStatus[aIndex].mAddress);
		aStrDir = (gLocStatus[aIndex].mDir == 0) ? '0' : '1';

		/* FlashAir共有メモリ書き換え */
		buffer_sharedStatusMem[113 + aIndex * 19	] = aStrAddr[0];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 1] = aStrAddr[1];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 2] = aStrAddr[2];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 3] = aStrAddr[3];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 8] = aStrDir;//Dir
	}

	return 0;
}

byte LOCMNG_SetLocoFunc(word inAddr, byte inNo, byte inPower)
{
	char aStrAddr[5];
	char aStrFunc1[5];
	char aStrFunc2[5];
	byte aIndex = 255;

	for( int i = 0; i < MAX_LOCSTATUS_WEB; i++)
	{
		if( (gLocStatus[i].mAddress == inAddr) || ( gLocStatus[i].mAddress == 0 ))
		{
			aIndex = i;
			break;
		}
	}

	if( aIndex != 255)
	{
		gLocStatus[aIndex].mAddress = inAddr;
		sprintf(aStrAddr, "%04X", gLocStatus[aIndex].mAddress);

		buffer_sharedStatusMem[113 + aIndex * 19	] = aStrAddr[0];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 1] = aStrAddr[1];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 2] = aStrAddr[2];//LocAddr
		buffer_sharedStatusMem[113 + aIndex * 19 + 3] = aStrAddr[3];//LocAddr


		if( inPower == 0)
		{
			if( inNo < 16)
			{
				gLocStatus[aIndex].mFuncBuf1 = gLocStatus[aIndex].mFuncBuf1 & ~(1 << inNo);
			}
			else if( inNo < 32)
			{
				gLocStatus[aIndex].mFuncBuf2 = gLocStatus[aIndex].mFuncBuf2 & ~(1 << (inNo - 16));
			}
			else if( inNo < 48)
			{
				gLocStatus[aIndex].mFuncBuf3 = gLocStatus[aIndex].mFuncBuf3 & ~(1 << (inNo - 32));
			}
			else if( inNo < 64)
			{
				gLocStatus[aIndex].mFuncBuf4 = gLocStatus[aIndex].mFuncBuf4 & ~(1 << (inNo - 48));
			}
			else
			{
				gLocStatus[aIndex].mFuncBuf5 = gLocStatus[aIndex].mFuncBuf5 & ~(1 << (inNo - 64));
			}
		}
		else
		{
			if( inNo < 16)
			{
				gLocStatus[aIndex].mFuncBuf1 = gLocStatus[aIndex].mFuncBuf1 | (1 << inNo);
			}
			else if( inNo < 32)
			{
				gLocStatus[aIndex].mFuncBuf2 = gLocStatus[aIndex].mFuncBuf2 | (1 << (inNo - 16));
			}
			else if( inNo < 48)
			{
				gLocStatus[aIndex].mFuncBuf3 = gLocStatus[aIndex].mFuncBuf3 | (1 << (inNo - 32));
			}
			else if( inNo < 64)
			{
				gLocStatus[aIndex].mFuncBuf4 = gLocStatus[aIndex].mFuncBuf4 | (1 << (inNo - 48));
			}
			else
			{
				gLocStatus[aIndex].mFuncBuf5 = gLocStatus[aIndex].mFuncBuf5 | (1 << (inNo - 64));
			}
		}


		sprintf(aStrFunc1, "%04X", gLocStatus[aIndex].mFuncBuf1);
		sprintf(aStrFunc2, "%04X", gLocStatus[aIndex].mFuncBuf2);


		/* FlashAir共有メモリ書き換え */


		buffer_sharedStatusMem[113 + aIndex * 19 + 10] = aStrFunc2[0];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 11] = aStrFunc2[1];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 12] = aStrFunc2[2];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 13] = aStrFunc2[3];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 14] = aStrFunc1[0];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 15] = aStrFunc1[1];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 16] = aStrFunc1[2];//Fnc
		buffer_sharedStatusMem[113 + aIndex * 19 + 17] = aStrFunc1[3];//Fnc
	}

	return 0;
}


int receiveRequest() {
	char buffer[64];
	int i = 0;
	char aByte;
	int aResult = -1;

	unsigned long time = millis();

	/* Check serial buffer */
	if (Serial.available() > 0) {

		while (1) {

			if (Serial.available() > 0) {

				aByte = Serial.read();

				// Write to text buf.
				buffer[i] = aByte;

				// check last identification of text end.
				if (aByte == '\n') {
					aResult = i;
					break;
				}

				// increment
				i = i + 1;

				// buf over check
				if( i > 64)
				{
					break;
				}
			}
			else
			{
				/* Check timeout. */
				if( millis() > time + 300)
				{
					aResult = -1;
					break;
				}
			}
		}
	}
	else
	{
		/* Not received. */
		aResult = 0;
	}

	if( aResult > 0)
	{

		buffer[i] = '\0';

		gRequest = String(buffer);
	}
	else
	{
		gRequest = "";
	}

	return aResult;
}

void changedTargetSpeed(const word inAddr, const word inSpeed, const bool inUpdate)
{
	byte aProtocol = 2;

	if( inAddr <= 255)
	{
		aProtocol = 0;
	}

	if( inUpdate == true)
	{
		DSCore.SetLocoSpeedEx(inAddr, inSpeed, aProtocol);
	}
}

void changedTargetFunc(const word inAddr, const byte inFuncNo, const byte inFuncPower, const bool inUpdate)
{
	if( inUpdate == true)
	{
		DSCore.SetLocoFunction(inAddr, inFuncNo, inFuncPower);
	}

}

void changedTargetDir(const word inAddr, const byte inDir, const bool inUpdate)
{

	if( inUpdate == true)
	{
		DSCore.SetLocoDirection(inAddr, inDir);
	}
}

void changedTurnout(const word inAddr, const byte inDir, const bool inUpdate)
{
	if( inUpdate == true)
	{
		DSCore.SetTurnout(inAddr, inDir);
	}

}


void changedPowerStatus(const byte inPower)
{

	DSCore.SetPower(inPower);

}
