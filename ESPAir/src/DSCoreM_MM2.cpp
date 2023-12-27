#include "DSCoreM_Type.h"
#include <Arduino.h>
#include "DSCoreM_Common.h"
#include "DSCoreM_MM2.h"


/* MM2拡張アドレステーブル (LittleEndian)  */
/* ※計算できないのでテーブルとして置く */
const UC MM2_256ADDRESSMAP[256] = {
	/* 1-80(old address) */
	0b00000011,0b00000001,0b00001100,
	0b00001111,0b00001101,0b00000100,0b00000111,
	0b00000101,0b00110000,0b00110011,0b00110001,
	0b00111100,0b00111111,0b00111101,0b00110100,
	0b00110111,0b00110101,0b00010000,0b00010011,
	0b00010001,0b00011100,0b00011111,0b00011101,
	0b00010100,0b00010111,0b00010101,0b11000000,
	0b11000011,0b11000001,0b11001100,0b11001111,
	0b11001101,0b11000100,0b11000111,0b11000101,
	0b11110000,0b11110011,0b11110001,0b11111100,
	0b11111111,0b11111101,0b11010100,0b11010111,
	0b11010101,0b11010000,0b11010011,0b11010001,
	0b11011100,0b11011111,0b11011101,0b11110100,
	0b11110111,0b11110101,0b01000000,0b01000011,
	0b01000001,0b01001100,0b01001111,0b01001101,
	0b01000100,0b01000111,0b01000101,0b01110000,
	0b01110011,0b01110001,0b01111100,0b01111111,
	0b01111101,0b01110100,0b01110111,0b01110101,
	0b01010000,0b01010011,0b01010001,0b01011100,
	0b01011111,0b01011101,0b01010100,0b01010111,
	0b01010101,	
	/* 81-256(new address) */
	0b00000010,0b00000110,0b11101001,0b00001110,
	0b00010010,0b00010110,0b00011010,0b00011110,
	0b00100010,0b00100110,0b00101010,0b00101110,
	0b00110010,0b00110110,0b00111010,0b00111110,
	0b01000010,0b01000110,0b01001010,0b01001110,
	0b01010010,0b01010110,0b01011010,0b01011110,
	0b01100010,0b01100110,0b01101010,0b01101110,
	0b01110010,0b01110110,0b01111010,0b01111110,
	0b10000010,0b10000110,0b10001010,0b10001110,
	0b10010010,0b10010110,0b10011010,0b10011110,
	0b10100010,0b10100110,0b11111001,0b10101110,
	0b10110010,0b10110110,0b10111010,0b10111110,
	0b11000010,0b11000110,0b11001010,0b11001110,
	0b11010010,0b11010110,0b11011010,0b11011110,
	0b11100010,0b11100110,0b11101010,0b11101110,
	0b11110010,0b11110110,0b11111010,0b11111110,
	0b00001000,0b00011000,0b00101000,0b00111000,
	0b01001000,0b01011000,0b01101000,0b01111000,
	0b10001000,0b10011000,0b10101000,0b10111000,
	0b11001000,0b11011000,0b11101000,0b11111000,
	0b00001011,0b00011011,0b00101011,0b00111011,
	0b01001011,0b01011011,0b01101011,0b01111011,
	0b10001011,0b10011011,0b10101011,0b10111011,
	0b11001011,0b11011011,0b11101011,0b11111011,
	0b00001001,0b00011001,0b00101001,0b00111001,
	0b01001001,0b01011001,0b01101001,0b01111001,
	0b10001001,0b10011001,0b10101001,0b10111001,
	0b11001001,0b11011001,0b00001010,0b10101010,
	0b00100000,0b01100000,0b10100000,0b11100000,
	0b00100011,0b01100011,0b10100011,0b11100011,
	0b00100001,0b01100001,0b10100001,0b11100001,
	0b00101100,0b01101100,0b10101100,0b11101100,
	0b00101111,0b01101111,0b10101111,0b11101111,
	0b00101101,0b01101101,0b10101101,0b11101101,
	0b00100100,0b01100100,0b10100100,0b11100100,
	0b00100111,0b01100111,0b10100111,0b11100111,
	0b00100101,0b01100101,0b10100101,0b11100101,
	0b10000000,0b10000011,0b10000001,0b10001100,
	0b10001111,0b10001101,0b10000100,0b10000111,
	0b10000101,0b10110000,0b10110011,0b10110001,
	0b10111100,0b10111111,0b10111101,0b10110100,
	0b10110111,0b10110101,0b10010000,0b10010011,
	0b10010001,0b10011100,0b10011111,0b10011101,
	0b10010100,0b10010111,0b10010101 };

UC getTrinaryTrits(UC inPulseBit);

UC MM2_RewriteAddressPackets(UC inAddressByte, UC inFuncNo)
{
	UC aTempAddress;
	UC aAddress;
	
	//F5-16指令のときは、アドレスを強制書き換え
	if( inFuncNo >= 6)
	{
		//いったん数値に戻す
		aAddress = MM2_decodeAddress(inAddressByte);
		
		//オフセット分加算する
		aAddress = aAddress + ((inFuncNo - 2) >> 2);
		
		//またTrinaryAddressに戻す
		aTempAddress = MM2_encodeAddress(aAddress);

	}
	else
	{
		aTempAddress = inAddressByte;
	}
	
	//アドレス情報上書きデータを返す
	return aTempAddress;
}

UC MM2_RewriteFunctionPackets(UC inSpeedByte, UC inFuncNo, UL inFuncBuf)
{
	UC aFunction;
	
	//F5-16指令のときは、ファンクション番号を強制置き換え（アドレス書き換えと連動)
	//F1はヘッドライト専用で、この処理では対応できないので-2にしてオフセットさせる。実質はF0=F1とし、ずらす。
	if( inFuncNo >= 6)
	{
		//F5-, F9-, F13-
		aFunction = (inFuncNo - 2) % 4;

		//ファンクション情報上書きデータを返す
		return MM2_encodeLocFunction(aFunction, 0, inFuncBuf >> (inFuncNo - 1) & 0b1);

	}
	else
	{
		//F1-F4
		aFunction = (inFuncNo - 2);

		//ファンクション情報上書きデータを返す
		return (inSpeedByte) | MM2_encodeLocFunction(aFunction, inSpeedByte, inFuncBuf >> (inFuncNo - 1) & 0b1);

	}
		
}

void MM2_SendPackets(UC *inPackets, UC inLen, UC inFreqType, UC inFuncNo, UL inFuncBuf)
{
	UC aPackets[5];
	
	if( DS_IsPowerOn() != 1)
	{
		return;
	}
	
	/* パケット取得 */
	aPackets[0] = inPackets[0];
	aPackets[2] = inPackets[2];
	
	/* Function0(DesktopStationではF1)はここで指定 */
	aPackets[1] = ((inFuncBuf & 0b1) > 0) ? 0b11 : 0b00;
	
	
	/* 28step速度信号があるとき */
	if( inLen >= 4)
	{
		/* 二つ目の速度信号をそのまま出力(28Step用) */
		aPackets[2] = inPackets[3];
		
		/* 28Step時の特殊処理(f0) */
		if(inPackets[2] != inPackets[3])
		{
			aPackets[1] = ((inFuncBuf & 0b1) > 0) ? 0b10 : 0b01;
		}
	}

	/* ファンクション書き換えサイクルであるとき */
	if( inFuncNo > 1)
	{
		/* ファンクション用のアドレス置き換え処理を実施する */
		aPackets[0] = MM2_RewriteAddressPackets(aPackets[0], inFuncNo);
	
		/* ファンクション用の置き換え処理を実施する */
		//スピードパケットのみ渡す(HDGCFBEAのうち、_D_C_B_Aが該当。)
		aPackets[2] = MM2_RewriteFunctionPackets(aPackets[2] & 0b01010101, inFuncNo, inFuncBuf);
	}	
	
	/* 0: A1 A2 A3 A4 (8bit, LittleEndian) */
	MM2_SendData(aPackets[0], inFreqType, 8);

	/* 1: F (2bit, LittleEndian)*/
	MM2_SendData(aPackets[1], inFreqType, 2);
	
	/* 2:S1 S2 S3 S4 (8bit, LittleEndian) */
	MM2_SendData(aPackets[2], inFreqType, 8);
	
	/* Set 0 */
	DS_WriteBit(0);
	
}

void MM2_SendDoublePackets(UC *inPackets, UC inLen, UC inFreqType, UC inFuncNo, UL inFuncBuf)
{
	MM2_SendPackets(inPackets, inLen, inFreqType, inFuncNo, inFuncBuf);
	delayMicroseconds(1525);
	MM2_SendPackets(inPackets, inLen, inFreqType, inFuncNo, inFuncBuf);
}

void MM2_SendZeroPackets()
{
	
	if( DS_IsPowerOn() != 1)
	{
		return;
	}
	
	/* 0: A1 A2 A3 A4 (8bit, LittleEndian) */
	MM2_SendData(0, MODEMM2_BASE, 8);

	/* 1: F (2bit, LittleEndian)*/
	MM2_SendData(0, MODEMM2_BASE, 2);
	
	/* 2:S1 S2 S3 S4 (8bit, LittleEndian) */
	MM2_SendData(0, MODEMM2_BASE, 8);
	
	/* Set 0 */
	DS_WriteBit(0);
	
}

void MM2_WaitLong()
{
	//delay(4);	
	delayMicroseconds(4240);
}

void MM2_SendData(UC inData, UC inFreqType, UC inLen)
{	
	int i;
	
	for( i = 0; i < inLen; i++)
	{
		MM2_SendBit( (inData >> i) & 0b1, inFreqType);
	}
}

void MM2_SendBit(UC inBit, UC inFreqType)
{
	UC aBit = inBit + (inFreqType << 1);

	switch(aBit)
	{
		/* base rate */
		case 0b00:
		DS_WriteBit(1);
		delayMicroseconds(TIME_MM2_BASE_0);
		DS_WriteBit(0);
		delayMicroseconds(TIME_MM2_BASE_1);
		break;
		
		case 0b01:
		DS_WriteBit(1);
		delayMicroseconds(TIME_MM2_BASE_1);
		DS_WriteBit(0);
		delayMicroseconds(TIME_MM2_BASE_0);
		break;
		
		/* Half rate */
		case 0b10:
		DS_WriteBit(1);
		delayMicroseconds(TIME_MM2_HALF_0B);
		DS_WriteBit(0);
		delayMicroseconds(TIME_MM2_HALF_1B);
		break;
		
		case 0b11:
		DS_WriteBit(1);
		delayMicroseconds(TIME_MM2_HALF_1);
		DS_WriteBit(0);
		delayMicroseconds(TIME_MM2_HALF_0);
		break;
	}
}


UC MM2_encodeLocFunction( UC inFunctionNo, UC inSpeedPacket, UC inPower)
{
	UC aPower = 0;
	
	if( inPower > 0)
	{
		aPower = 0b10000000;
	}
	
	/* ファンクションパケットコードを返す(HDGCFBEA) */
	switch(inFunctionNo)
	{
		case 0:
			/* F1 */
			if( (inSpeedPacket == 0b00000101) && (inPower == 0)) //DCBA=0011
			{
				return 0b00100010;/* EFGH=1010 */
			}
			else if ((inSpeedPacket == 0b01010000) && (inPower == 1)) //DCBA=1100
			{
				return 0b10001000;/* EFGH=0101 */
			} 
			else
			{
				return 0b00001010 | aPower; // EFGH=110X
			}
			break;
		
		case 1:
			/* F2 */
			if( (inSpeedPacket == 0b00010000) && (inPower == 0)) //DCBA=0100
			{
				return 0b00100010;/* EFGH=1010 */
			}
			else if ((inSpeedPacket == 0b01010001) && (inPower == 1)) //DCBA=1101
			{
				return 0b10001000;/* EFGH=0101 */
			}
			else
			{
				return 0b00100000 | aPower; // EFGH=001X
			}
			break;
		
		case 2:
			/* F3 */
			if( (inSpeedPacket == 0b00010001) && (inPower == 0)) //DCBA=0101
			{
				return 0b00100010;/* EFGH=1010 */
			}
			else if ((inSpeedPacket == 0b01010100) && (inPower == 1))//DCBA=1110
			{
				return 0b10001000;/* EFGH=0101 */
			}
			else
			{
				return 0b00101000 | aPower; // EFGH=011X
			}
			break;
		
		case 3:
			/* F4 */
			if( (inSpeedPacket == 0b00010100) && (inPower == 0))//DCBA=0110
			{
				return 0b00100010;/* EFGH=1010 */
			}
			else if ((inSpeedPacket == 0b01010101) && (inPower == 1))//DCBA=1111
			{
				return 0b10001000;/* EFGH=0101 */
			}
			else
			{
				return 0b00101010 | aPower; // EFGH=111X
			}
			break;
		
		default:
		return 0;
		break;
	}
	
}

UC MM2_encodeAddress(US address)
{
	
	if( address <= 0)
	{
		return 0;
	}
	else
	{
		if( address <= 256)
		{

			/* MM2Old/Newアドレス(0-80, 81-256) */
				
			return (UC)pgm_read_byte(&(MM2_256ADDRESSMAP[(UC)(address - 1)]));
		}
		else
		{
			/* MM2範囲外アドレスのため0を返す */
			return 0;
		}
	}
}

UC extend4Bit8Bit(UC in4bitData)
{
	return (in4bitData & 0b1) + ((in4bitData & 0b1) << 1) +
	((in4bitData & 0b10) << 1) + ((in4bitData & 0b10) << 2) +
	((in4bitData & 0b100) << 2) + ((in4bitData & 0b100) << 3) +
	((in4bitData & 0b1000) << 3) + ((in4bitData & 0b1000) << 4) ;
	
}

UC MM2_encodeSpeed14Step(UC speed14, UC direction)
{
	UC aDirectionFlag = 0;
	UC aSpeed14;
	UC aDecodedAddress;
	
	aSpeed14 = speed14;
	
	switch( (aSpeed14 > 7 ? 10 : 0) + (direction == DIR_REV ? 1 : 2))
	{
		/*  HDGCFBEA*/
		case 01:
		//REV, 低速
		aDirectionFlag = 0b10100010;
		break;
		
		case 11:
		//REV, 高速
		aDirectionFlag = 0b00100010;
		break;

		case 02:
		//FWD, 低速
		aDirectionFlag = 0b10001000;
		break;
		
		case 12:
		//FWD, 高速
		aDirectionFlag = 0b00001000;
		break;

	}
	
	if(aSpeed14 > 0)
	{
		aSpeed14 = aSpeed14 + 1;
	}
	
	aDecodedAddress = (extend4Bit8Bit(aSpeed14) & 0b01010101) | aDirectionFlag;
	
	return aDecodedAddress;
	
}

UC MM2_generateSpeedDir()
{
	/* MM1用リバースパケット */
	return 0b00000011;
	
}


/************************************************************************/ /*!

 @brief サブアドレスエンコード関数

 @param inSubAddress パケットデータ(アクセサリ専用アドレスビット12-15,4bit部分)
  
 @return エンコードしたサブアドレス

 @note アクセサリのアドレスはサブアドレスを加味して演算する。

*/ /************************************************************************/

UC MM2_encodeAccSecondAddress(UC inSubAddress)
{
	UC aRetAddress;
	
	switch (inSubAddress)
	{
		case 0:
			aRetAddress = 0b00000000;
			break;
		case 1:
			aRetAddress = 0b00001100;
			break;			
		case 2:
			aRetAddress = 0b00110000;
			break;
		case 3:
			aRetAddress = 0b00111100;
			break;	
		default: 
			aRetAddress = 0;
			break;	
	}
	
	return aRetAddress;	
}

/************************************************************************/ /*!

 @brief アドレスデコード関数

 @param inAddressPacket パケットデータ(メインアドレスビット0-7, 8bit部分)
  
 @return なし

 @note メルクリンTrinary形式の8bitアドレスを1-80の形式に変換する。

*/ /************************************************************************/

UC MM2_decodeAddress(UC inAddressPacket)
{
	UC aAddress = 0;
	int i;
		
	for( i = 0; i < 255; i++)
	{
		if( inAddressPacket == (UC)pgm_read_byte(&(MM2_256ADDRESSMAP[(UC)i])) )
		{
			aAddress = i + 1;	
			break;
		}		
	}

	return aAddress;
	
}


/************************************************************************/ /*!

 @brief 3進→10進bit変換関数

 @param inPulseBit 3進ビット
 
 @return なし

 @note

*/ /************************************************************************/

UC getTrinaryTrits(UC inPulseBit)
{
	UC aTrits = 0;
	
	switch(inPulseBit)
	{
	case 0b00: aTrits = 0;break;
	case 0b11: aTrits = 1;break;
	case 0b01: aTrits = 2;break;
	}
	
	return aTrits;
	
}