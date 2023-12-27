
#include "DSCoreM_Type.h"
#include <Arduino.h>
#include <stdlib.h>
#include "DSCoreM_Common.h"
#include "DSCoreM_DCC.h"

const UC DCC_28SPEEDMAP[29] PROGMEM = {
0b00000,0b00010,0b10010,0b00011,
0b10011,0b00100,0b10100,0b00101,
0b10101,0b00110,0b10110,0b00111,
0b10111,0b01000,0b11000,0b01001,
0b11001,0b01010,0b11010,0b01011,
0b11011,0b01100,0b11100,0b01101,
0b11101,0b01110,0b11110,0b01111,0b11111};

const UC DCC_14SPEEDMAP[15] PROGMEM = {
	0b00000,0b00010,0b00011,0b00100,
	0b00101,0b00110,0b00111,0b01000,
	0b01001,0b01010,0b01011,0b01100,
	0b01101,0b01110,0b01111 };
	
UC gEndBitPattern = 0;


void DCC_Init()
{
	
	//Clear
	gEndBitPattern = 0;
	
	
	/* Initialization */	
	DS_GateOff();

}

void DCC_SendInitialPacket(UC inPreambleCnt)
{
	UC aPackets[5] = {0,0,0,0,0};
				
	/* DCC Resetパケット登録（初回のみ） */
	aPackets[0] = 0b00000000;
	aPackets[1] = 0b00000000;
	aPackets[2] = 0b00000000;
	
	DCC_SendPacketsEx(aPackets, 2, inPreambleCnt, 0);
	
}

void DCC_SendPackets(UC *inPackets, UC inLen, UC inCutOut)
{
	DCC_SendPacketsEx(inPackets, inLen, DCCPREAMBLE_DEFAULT, inCutOut);
}

void DCC_SendPacketsEx(UC *inPackets, UC inLen, UC inPreambleCnt, UC inCutOut)
{
	int i;
	
	if( DS_IsPowerOn() != 1)
	{
		return;
	}
	
	
	// Sent Half 0 Packet
	if(gEndBitPattern != 0)
	{
		DS_WriteBit(1);
		DS_WaitClkX(TIME_DCC_0BX);
	}
	 
	/* Set 0 */
	DCC_SendBit(0);

	/* Calculate CRC */
	UC aCRC = DS_CalculateCRC(inPackets, inLen);

	/* Send Preamble */
	DCC_SendPreamble(inPreambleCnt);
	
	for( i = 0; i < inLen; i++)
	{
		/* StartBit */		
		DCC_SendBit(0);
		
		/* Send data */
		DCC_SendByte( inPackets[i]);
	}

	/* StartBit */		
	DCC_SendBit(0);
	
	/* SendCRC */
	DCC_SendByte(aCRC);
		
	/* EndBit */		
	DCC_SendBit(1);
	
	if( inCutOut == 1)
	{
		//29us High
		DS_WriteBit(0);
		delayMicroseconds(TIME_DCC_BIDI_CUTOUTSTART);
		
		//454us BREAK MODE of TB664X
		DS_OutputBrake();
		//DS_OutputOff();
		delayMicroseconds(TIME_DCC_BIDI_ENDCUTOUTTIME);
		
		//End of Cutout
		DS_WriteBit(1);
		delayMicroseconds(20);//10us
	}
	
	
	/* Dammy */		
	DCC_SendBit(0);
	
	
	if( gEndBitPattern != 0)
	{
		//Sent 1
		gEndBitPattern = 0;
	}
	else
	{
		// Sent Half 0 Packet
		DS_WriteBit(0);
		DS_WaitClkX(TIME_DCC_0AX);
		
		//Sent 0
		gEndBitPattern = 1;
	}
	
}


void DCC_SendPreamble(UC inSize)
{
	int i;

	for( i = 0; i < inSize; i++)
	{
		DCC_SendBit(1);
	}
	
}

void DCC_SendByte(UC inData)
{
	int i;
	
	for( i = 0; i < 8; i++)
	{
		DCC_SendBit( (inData >> (7 - i)) & 0b1 );
	}
}

void DCC_SendBit(UC inBit)
{
	if( inBit == 0)
	{
		DS_WriteBit(0);
		DS_WaitClkX(TIME_DCC_0AX);
		
		DS_WriteBit(1);
		DS_WaitClkX(TIME_DCC_0BX);
	}
	else
	{
		DS_WriteBit(0);
		DS_WaitClkX(TIME_DCC_1AX);

		DS_WriteBit(1);
		DS_WaitClkX(TIME_DCC_1BX);
	}


}

UC DCC_decodeSpeedStep14(short speed, UC direction, UC aFunction)
{
	UC aDirectionFlag = 0;
	UC aSpeed14;
	short aConvertedSpeed;
	
	aConvertedSpeed = DS_CalcSpeedStep(speed, 14);
	
	aSpeed14 = (UC)pgm_read_byte(&DCC_14SPEEDMAP[(UC)(aConvertedSpeed)]);

	switch(direction)
	{
		case 1:
		aDirectionFlag = 0b01000000;
		break;
		
		case 0:
		aDirectionFlag = 0b01100000;
		break;
	}
	
	return aSpeed14 | aDirectionFlag | ((aFunction << 5) & 0b10000);
	
}


UC DCC_decodeSpeedStep28(short speed, UC direction)
{
	UC aDirectionFlag = 0;
	UC aSpeed28;
	short aConvertedSpeed;
	
	aConvertedSpeed = DS_CalcSpeedStep(speed, 28);
	
	aSpeed28 = (UC)pgm_read_byte(&DCC_28SPEEDMAP[(UC)(aConvertedSpeed)]);

	switch(direction)
	{
		case 1:
		aDirectionFlag = 0b01000000;
		break;
		
		case 0:
		aDirectionFlag = 0b01100000;
		break;
	}
	
	return aSpeed28 | aDirectionFlag;
	
}

UC DCC_decodeSpeedStep127(short speed, UC direction)
{
	UC aDirectionFlag = 0;
	UC aSpeed127;
	short aConvertedSpeed;
	
	aConvertedSpeed = DS_CalcSpeedStep(speed, 126);
	
	if( aConvertedSpeed == 0)
	{
		aSpeed127 = 0;
	}
	else if( aConvertedSpeed > 126)
	{
		aSpeed127 = 0b01111111;
	}	
	else
	{
		/* X0000001は緊急停止なので、除外する。X0000010-X1111111の126step分 */
		aSpeed127 = aConvertedSpeed + 1;			
	}

	switch(direction)
	{
		case 1:
		aDirectionFlag = 0b00000000;
		break;
		
		case 0:
		aDirectionFlag = 0b10000000;
		break;
	}
	
	return aSpeed127 | aDirectionFlag;
	
}


UC DCC_decodeFunction(UC function, UC power, ULL *inFuncBuf)
{
	
	if( (function == 0) || (function > 61))
	{
		return 0;
	}	
	
	/* バッファ更新 */

	if( power == 0)
	{
		*inFuncBuf = *inFuncBuf & ~(1ULL << (function - 1));
	}
	else
	{
		*inFuncBuf = *inFuncBuf | (1ULL << (function - 1));
	}
	
	return DCC_decodeFunctionRaw(function, inFuncBuf);
}

UC DCC_decodeFunctionRaw(UC function, ULL *inFuncBuf)
{
	UC aResult = 0;
	
	/* 出力値生成 */
	if( function <= 5)
	{
		/* F0(FL), F4,F3,F2.F1 */
		aResult = 0b10000000 | ((*inFuncBuf >> 1) & 0b1111) | ((*inFuncBuf & 0b1) << 4);
	}
	else if ( function <= 9)
	{
		aResult = 0b10110000 | ((*inFuncBuf >> 5) & 0b1111);
	}
	else if ( function <= 13)
	{
		aResult = 0b10100000 | ((*inFuncBuf >> 9) & 0b1111);
	}	
	else if ( function <= 21)
	{
		/* 拡張アドレス(F13-F20), 二番目のデータが全てファンクションに割り当て */
		aResult = 0b11011110;
	}
	else if ( function <= 29)
	{
		/* 拡張アドレス(F21-F28), 二番目のデータが全てファンクションに割り当て */
		aResult = 0b11011111;
	}	
	else if ( function <= 37)
	{
		/* 拡張アドレス(F29-F36) */
		aResult = 0b11011000;
	}
	else if ( function <= 45)
	{
		/* 拡張アドレス(F37-F44) */
		aResult = 0b11011001;
	}
	else if ( function <= 53)
	{
		/* 拡張アドレス(F45-F52) */
		aResult = 0b11011010;
	}
	else if ( function <= 61)
	{
		/* 拡張アドレス(F53-F60) */
		aResult = 0b11011011;
	}
	else if ( function <= 69)
	{
		//★64bit型の範囲外なので、ここは使わない
		/* 拡張アドレス(F61-F68) */
		aResult = 0b11011100;
	}
	
	// Functions F29 - F36		1101 1000
	// Functions F37 - F44		1101 1001
	// Functions F45 - F52		1101 1010
	// Functions F53 - F60		1101 1011
	// Functions F61 - F68		1101 1100
	
	
	return aResult;
}
