
/*
 * DS_DCC.h
 *
 * Created: 2014/02/28 5:54:29
 *  Author: Yaasan
 */ 


#ifndef DS_DCC_H_
#define DS_DCC_H_


#define TIME_DCC_0AX 210 /* 10Xus, こちらは長くても問題なし */
#define TIME_DCC_0BX 210 /* 10Xus, こちらは長くても問題なし */
#define TIME_DCC_1AX 110 /* 58us - 2.6us(Deadtime) */
#define TIME_DCC_1BX 110 /* 58us - 2.6us(Deadtime) */
#define TIME_DCC_BIDI_CUTOUTSTART 57 /* 29us Railcom BiDi Cutout */
#define TIME_DCC_BIDI_ENDCUTOUTTIME  445 /* 454us */
#define TIME_DCC_BIDI_PREAMBLE 12

#define DCCPREAMBLE_DEFAULT		16		/**< 通常パケット用 */
#define DCCPREAMBLE_CV			24		/**< CVパケット用 */


extern UC gEndBitPattern;


void DCC_Init();

void DCC_SendInitialPacket(UC inPreambleCnt);
void DCC_SendPackets(UC* inPackets, UC inLen, UC inCutOut);
void DCC_SendPacketsEx(UC *inPackets, UC inLen, UC inPreambleCnt, UC inCutOut);
void DCC_SendPreamble(UC inSize);
void DCC_SendByte(UC inData);
void DCC_SendBit(UC inBit);

UC DCC_decodeSpeedStep28(short speed, UC direction);
UC DCC_decodeSpeedStep127(short speed, UC direction);
UC DCC_decodeSpeedStep14(short speed, UC direction, UC aFunction);
UC DCC_decodeFunction(UC function, UC power, ULL *inFuncBuf);
UC DCC_decodeFunctionRaw(UC function, ULL *inFuncBuf);

#endif /* DS_DCC_H_ */