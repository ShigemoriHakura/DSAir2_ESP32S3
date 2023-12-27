/*********************************************************************
 * Desktop Station Core Library for Arduino
 *
 * Copyright (C) 2014 Yaasan
 * Not use for commercial use
 */

#ifndef DSCORELIB_H
#define DSCORELIB_H


#include <Arduino.h>



#define DSGATEWAY_VERSION 0x03
//#define DEBUG false
#define SIZE_PACKET 8
#define TIME_REPLY 200

#define SPEEDSTEP_DCC28 0
#define SPEEDSTEP_DCC14 1
#define SPEEDSTEP_DCC127 2
#define SPEEDSTEP_MM14 0
#define SPEEDSTEP_MM28 1


#define GO_FWD	0x01
#define GO_REV	0x02


/* 特殊・拡張機能用 */
#define EXCMD_NONE		0


/* Defined functions */
class DSCoreLib
{
  private:
	
	UC MAIN_scanList(DS_ITEM *inList, UC inScanIndex);
	UC Main_scanFunction(DS_ITEM *inList, UC inScanIndex);
	UC Main_generateDCCFncPacket(DS_ITEM *inList, UC inScanIndex, UC inSendTwice);
	UC Main_decodeLocDirection(DS_ITEM *inList, US address, UC direction, UC *outType, UC *outPackets, UC *outLen);
	void Main_decodeLocFunction(DS_ITEM *inList, US address, UC function, UC power, UC *outType, UC *outPackets, UC *outLen, ULL *ioFuncBuf);
	void Main_decodeAccessory(US address, UC power, UC *outType, UC *outPackets, UC *outLen);
	void Main_decodeLocSpeed(DS_ITEM *inList, US address, short speed, UC *outType, UC *outPackets, UC *outLen, UC inSpeedStep);
	void Main_decodeAddress( US address, UC *outpType, UC *outpAddr1, UC *outpAddr2, UC *outpLen);
	void Main_registerDCCPoweronSequence();
	byte convertAcc_MMDCC(word address, byte inSwitch);
	void TIMER2_stop(void);
	void TIMER2_start(void);
	US TIMER2_getcnt(void);
	US GetCurrent(US inAvg);
	US GetCurrentAvg();
	bool GetCVValueFromMap(UC *inCntData, UC *outpValue, UC *outpHighByte, UC *outpLowByte);
	void getCVData(word inAddress, US *inMaxData, US *inMinData, byte inD, byte inK, byte inWaitTime, byte inCntReset, byte inCntCV, word inAdcOffset);

  public:
	DSCoreLib();
	//~DSCoreLib();
	
	word gThresholdCurrent;
	byte gRetryCount;
	byte gCutOut;

	
	void Init();
	void Scan();
	void Clear();
	void SendReset();
	
	boolean IsPower();
	boolean SetPower(boolean power);
	boolean SetPowerEx(boolean power);
	boolean SetLocoSpeed(word address, int inSpeed);
	boolean SetLocoSpeedEx(word address, int inSpeed, int inProtcol);
	boolean SetLocoFunction(word address, unsigned char inFunction, unsigned char inPower);
	boolean SetLocoFunctionRaw(word address, unsigned long inFunctions);
	boolean SetLocoDirection(word address, unsigned char inDirection);
	boolean SetTurnout(word address, byte inSwitch);
	boolean WriteConfig_Ops(word address, word number, byte value);
	boolean WriteConfig_Dir( word number, byte value);
	boolean ReadConfig( word number, byte *value, byte inSpeed, byte inPowerFlag);
	boolean ReadConfigEx( word number, byte *value, byte inSpeed);
	word GetLocIDProtocol(byte address);
	void TogglePulse();

};

#endif
