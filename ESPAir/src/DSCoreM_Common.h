/*
 * DS_Common.h
 *
 * Created: 2014/02/28 5:54:29
 *  Author: Yaasan
 */ 


#ifndef DS_COMMON_H_
#define DS_COMMON_H_

#define ADDR_MM2     0x0000 // MM2 locomotive
#define ADDR_SX1     0x0800 // Selectrix (old) locomotive
#define ADDR_MFX     0x4000 // MFX locomotive
#define ADDR_SX2     0x8000 // Selectrix (new) locomotive
#define ADDR_DCC     0xC000 // DCC locomotive
#define ADDR_ACC_SX1 0x2000 // Selectrix (old) magnetic accessory
#define ADDR_ACC_MM2 0x2FFF // MM2 magnetic accessory
#define ADDR_ACC_DCC 0x3800 // DCC magnetic accessory

#define SPEEDSTEP_DCC28 0
#define SPEEDSTEP_DCC14 1
#define SPEEDSTEP_DCC127 2
#define SPEEDSTEP_MM14 0
#define SPEEDSTEP_MM28 1

#define TIME_DEAD 1


void DS_GateOff(void);
void DS_OutputOff(void);
void DS_OutputBrake(void);
void DS_LEDRUN(UC inOnOff);
void DS_LEDERR(UC inOnOff);
void DS_Power(UC inMode);
UC DS_IsPowerOn(void);
void DS_WriteBit(UC inBit);
void DS_WaitSec(UC inSec);
UC DS_CalculateCRC(UC* inPackets, UC inLen);
UC DS_CalcSpeedStep(short inSpeed, UC inDiv);
UC DS_GetLocIDProtocol(UC address);
UC DS_ABSdiff(UC inUpper, UC inLower);
void DS_WaitClk(UC inTime4us);
void DS_InitWaitClkX(void);
void DS_WaitClkX(UC inWaitTime);

#endif /* DS_COMMON_H_ */