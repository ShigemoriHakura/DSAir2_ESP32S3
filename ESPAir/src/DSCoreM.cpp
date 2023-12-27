/*********************************************************************
   Desktop Station Core Library for Arduino

   Copyright (C) 2014 Yaasan
   Not use for commercial use
*/

#define DEBUG

#include <arduino.h>
#include "DSCoreM_Type.h"
#include "DSCoreM_Common.h"
#include "DSCoreM_List.h"
#include "DSCoreM_DCC.h"
#include "DSCoreM_MM2.h"
#include "DSCoreM.h"
#include "hardware/adc.h" 

#define THRESHOLD_CVREAD 2
#define DCC_CV_INITPACKET_COUNT 160
#define DCC_INITPACKET_COUNT 40
#define THRESHOLD_CURRENT 9  /* 20A:5d, 12A:10d ,5A:20d */
#define COUNT_RETRY		2
#define TIME_WAIT		100		/* [us] */
#define RETRY_WAIT        6
#define SIZE_CVBITS   16

#ifdef __LGT8FX8P__
#define ADC_SHIFT2 1
#else
#define ADC_SHIFT2 0
#endif


static DS_ITEM gList[ITEM_LISTSIZE];/**< 送信管理用リスト */
static UC gScanIndex = 0;		/**< スキャンインデックス（リスト走査） */
static UC gPriorityIndex = 0;		/**< 優先度インデックス */
static UC gSwitchScan = 0;
static boolean gPoweron = false;
unsigned long gToggleTime = 0;
unsigned long gPreviousTimeRC = 0;
UC gCutOutOnOff = 0;

DSCoreLib::DSCoreLib()
{

	gPoweron = false;
	gPriorityIndex = 0;
	gSwitchScan = 0;
	
	gThresholdCurrent = THRESHOLD_CURRENT << ADC_SHIFT2;
	
	gRetryCount = COUNT_RETRY;
	
	gCutOut = 0;

}


UC DSCoreLib::MAIN_scanList(DS_ITEM *inList, UC inScanIndex)
{
	UC aRetIndex = inScanIndex;
	UC aMM2_Len;

	if ( inScanIndex >= ITEM_LISTSIZE)
	{
		return 255;
	}

	/* パケットを送信する */
	if ( inList[inScanIndex].mType == ITEMTYPE_MM2BASE )
	{
		/* 前回のパケットと区別するためにウェイト期間 */
		delay(6);
		
		/* 拡張ファンクションかどうかチェックする */
		if(inList[inScanIndex].mFuncNo > 5 )
		{
			/* 拡張ファンクション信号(F5-F16)を送る。Double Packet x3 (6回)単位。速度はゼロ。 */
			MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, inList[inScanIndex].mFuncNo, inList[inScanIndex].mFunctionBuf);
			MM2_WaitLong();
			MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, inList[inScanIndex].mFuncNo, inList[inScanIndex].mFunctionBuf);
			MM2_WaitLong();
			MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, inList[inScanIndex].mFuncNo, inList[inScanIndex].mFunctionBuf);
			
		}
		else
		{
			
			/* リバースパルスを送っていた場合は、速度ゼロに戻す */
			if( inList[inScanIndex].mReverse > 0)
			{
				inList[inScanIndex].mDatas[2] = MM2_generateSpeedDir();
				
				for( byte i = 0; i < 4; i++)
				{
					MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, 0);
					MM2_WaitLong();
					MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, 0);
					delay(6);
				}
				
				MM2_SendZeroPackets();
				delay(6);
				MM2_SendZeroPackets();
				delay(6);
				MM2_SendZeroPackets();
				
				delay(6);
				
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, 0);
				MM2_WaitLong();
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, 0);
				
				inList[inScanIndex].mDatas[2] = inList[inScanIndex].mReverse;
				inList[inScanIndex].mReverse = 0;
			}
			else
			{
				/* 速度信号のみ送る(2x double packet) */
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, inList[inScanIndex].mFunctionBuf);
				MM2_WaitLong();
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, 3, MODEMM2_BASE, 0, inList[inScanIndex].mFunctionBuf);
			}
			
			
			if((inList[inScanIndex].mLen > 3) || (inList[inScanIndex].mFuncNo > 0) )
			{
				aMM2_Len = inList[inScanIndex].mLen > 3 ? 4 : 3;
			
				/* 10ms待つ */
				delay(10);
				
				/* ファンクション信号、28Step信号、ファンクション＆28Step信号を送る */
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, aMM2_Len, MODEMM2_BASE, inList[inScanIndex].mFuncNo, inList[inScanIndex].mFunctionBuf);
				MM2_WaitLong();
				MM2_SendDoublePackets(inList[inScanIndex].mDatas, aMM2_Len, MODEMM2_BASE, inList[inScanIndex].mFuncNo, inList[inScanIndex].mFunctionBuf);
		
			}
		
		}
				
		/* カウンタをデクリメントする */
		if( inList[inScanIndex].mFuncCounter > 0)
		{
			inList[inScanIndex].mFuncCounter--;
		}
		
		/* ファンクション出力を停止 */
		if((inList[inScanIndex].mFuncCounter == 0) && (inList[inScanIndex].mFuncNo > 0))
		{
			inList[inScanIndex].mFuncNo = 0;
		}

  }
  else if ( inList[inScanIndex].mType == ITEMTYPE_MM2HALF )
  {
    /* 前回のパケットと区別するためにウェイト期間 */
    delay(6);

    /* 二回目は、解除信号（ソレノイドへの励磁を完了させる）*/
    if ( inList[inScanIndex].mCnt <= 1 )
    {
      inList[inScanIndex].mDatas[2] = 0x00;
    }

    /* 合計8パケット(ダブルパケットx4)を送る。間隔は762us、1.5ms。 */
    for ( byte i = 0; i < 4; i++)
    {
      MM2_SendPackets(inList[inScanIndex].mDatas, 3, MODEMM2_HALF, 0, 0);
      delayMicroseconds(762);
      MM2_SendPackets(inList[inScanIndex].mDatas, 3, MODEMM2_HALF, 0, 0);
      delayMicroseconds(1500);
    }

  }
  else if ( inList[inScanIndex].mType == ITEMTYPE_DCC )
  {

	//Send DCC pulse
	DCC_SendPackets(inList[inScanIndex].mDatas, inList[inScanIndex].mLen, gCutOutOnOff);

	
	/* 高優先度・回数制限のあるパケットは二回送る */
	if ((inList[inScanIndex].mPriority  > 0 ) || ( inList[inScanIndex].mCnt > 0))
	{
		DCC_SendPackets(inList[inScanIndex].mDatas, inList[inScanIndex].mLen, gCutOutOnOff);
	}

    if ( inList[inScanIndex].mPriority > 0)
    {

      inList[inScanIndex].mPriority--;
    }

  }

  else if ( inList[inScanIndex].mType == ITEMTYPE_UNKNOWN )
  {
    aRetIndex = 255;
  }
  else
  {
    aRetIndex = 255;
  }

  /* カウント値が入っている指令は時間が来たら削除する */
  if ( (inList[inScanIndex].mCnt > 0) & (aRetIndex != 255))
  {
    inList[inScanIndex].mCnt--;
    if ( inList[inScanIndex].mCnt <= 0)
    {
      DSList_DeleteItem(inList, inScanIndex);
    }
  }

  return aRetIndex;
}

UC DSCoreLib::Main_scanFunction(DS_ITEM *inList, UC inScanIndex)
{
	UC aRetIndex = inScanIndex;

	if ( inScanIndex >= ITEM_LISTSIZE)
	{
		return 255;
	}

	if ( inList[inScanIndex].mType == ITEMTYPE_DCC )
	{
		Main_generateDCCFncPacket(inList, inScanIndex, (inList[inScanIndex].mPriority > 0) ? 1 : 0);
	}
	
	return aRetIndex;
}


UC DSCoreLib::Main_generateDCCFncPacket(DS_ITEM *inList, UC inScanIndex, UC inSendTwice)
{

  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aOutputLen = 0;
  ULL aFunctionBuf;
  UC aOffset;


  /* パケットのアドレス部分は確定するのでセットする */
  aPackets[0] = inList[inScanIndex].mDatas[0];

  if ( aPackets[0] == 0xFF)
  {
    /* アイドルor停止パケットなので終了する */
    return 0;
  }
  else if ( aPackets[0] == 0x00)
  {
  	if( (inList[inScanIndex].mDatas[1] == 0))
  	{
		/* リセットパケットなので終了する */
		return 0;
  	}
  }
  else if ((aPackets[0] >= 128) && (aPackets[0] <= 191))
  {
    /* ポイント・信号・アクセサリ用なので終了する */
    return 0;
  }
  else if ((aPackets[0] >= 232) && (aPackets[0] <= 254))
  {
    /* リザーブ領域なので終了する */
    return 0;
  }
  else if ( (aPackets[0] >= 192) && (aPackets[0] <= 231))
  {
    /* 拡張ロコパケット */
    aPackets[1] = inList[inScanIndex].mDatas[1];
    aOffset = 1;
  }
  else if ((aPackets[0] >= 1) && (aPackets[0] <= 127))
  {
    /* ベーシックロコパケット */
    aOffset = 0;
  }
  else
  {
    /* 不明なパケット */
    return 2;
  }

  /* decode function  */

  aFunctionBuf = inList[inScanIndex].mFunctionBuf;


  /* ファンクションの書き換えとDCCのパケット生成 */
  aPackets[1 + aOffset] = DCC_decodeFunctionRaw(inList[inScanIndex].mFuncCounter, &aFunctionBuf);

  /* F13-F20, F21-28の拡張ファンクション用（ファンクション用にサイズが増える） */
  switch (aPackets[1 + aOffset])
  {
    case 0b11011110:
      aPackets[2 + aOffset] = ((aFunctionBuf >> 13) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;

    case 0b11011111:
      aPackets[2 + aOffset] = ((aFunctionBuf >> 21) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;

    case 0b11011000:/* 拡張アドレス(F29-F36) */
      aPackets[2 + aOffset] = ((aFunctionBuf >> 29) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;

    case 0b11011001:/* 拡張アドレス(F37-F44) */
      aPackets[2 + aOffset] = ((aFunctionBuf >> 37) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;
  	
    case 0b11011010:/* 拡張アドレス(F45-F52) */
      aPackets[2 + aOffset] = ((aFunctionBuf >> 45) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;
  	
    case 0b11011011:/* 拡張アドレス(F53-F60) */
      aPackets[2 + aOffset] = ((aFunctionBuf >> 53) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;

  	case 0b11011100:/* 拡張アドレス(F61-F68) */
      aPackets[2 + aOffset] = ((aFunctionBuf >> 61) & 0xFF);
      aOutputLen = 3 + aOffset;
      break;

  	
    default:
      aOutputLen = 2 + aOffset;
      break;
  }

	/* Output Packet */
	DCC_SendPackets(aPackets, aOutputLen, gCutOutOnOff);

	/* Send 2 packets */
	if( inSendTwice > 0)
	{
		DCC_SendPackets(aPackets, aOutputLen, gCutOutOnOff);
	}

  /* Increment for next packet generation */
  inList[inScanIndex].mFuncCounter = inList[inScanIndex].mFuncCounter + 6;

  if ( inList[inScanIndex].mFuncCounter > 36)
  {
    inList[inScanIndex].mFuncCounter = 0;
  }

  return 1;
}


UC DSCoreLib::Main_decodeLocDirection(DS_ITEM *inList, US address, UC direction, UC *outType, UC *outPackets, UC *outLen)
{
  UC aAddr1, aAddr2;
  UC aLen;
  UC aType;
  UC aDirection; /* 0:FWD, 1:REV */
  UC aIndex;
  UC aSpeedRecoveryPacket;
  UC aSpeed;

  /* decode loc address */
  Main_decodeAddress( address, &aType, &aAddr1, &aAddr2, &aLen);

  if( aLen == 0)
  {
  	return 0;
  }


  /* パケットのアドレス部分は確定するのでセットする */
  outPackets[0] = aAddr1;

  if ( aLen >= 2)
  {
    outPackets[1] = aAddr2;
  }

  *outType = aType;

  /* 前回のファンクションデータが必要なため同じアドレスを探索 */
  aIndex = DSList_FindItem(inList, aType, CMD_SPEED, aLen, 0, outPackets);

  if ( aIndex != 255)
  {
    aDirection = inList[aIndex].mDirection;
  }
  else
  {
    return 255;
  }

  if ( aDirection != direction)
  {

  	
    /* Marklin Motorola 1対応 */
    switch ( aType)
    {
      case ITEMTYPE_MM2BASE:
        outPackets[1] = 0b00;

        /* 14 step speed */
        aSpeed = DS_CalcSpeedStep(0, 14);
        aSpeedRecoveryPacket = MM2_encodeSpeed14Step(aSpeed, direction);
        outPackets[2] = MM2_generateSpeedDir();
        *outLen = 3;

        break;
    default:
    	aSpeedRecoveryPacket = 0;
    	break;
    }

    /* 異なる場合はリスト側を書き換える */
    inList[aIndex].mDirection = direction;
    inList[aIndex].mReverse = aSpeedRecoveryPacket;

    return 1;
  }
  else
  {
    /* 同じ場合は書き換える必要なし */
    return 0;
  }

}

void DSCoreLib::Main_decodeLocFunction(DS_ITEM *inList, US address, UC function, UC power, UC *outType, UC *outPackets, UC *outLen, ULL *ioFuncBuf)
{
  UC aAddr1, aAddr2;
  UC aLen;
  UC aType;
  ULL aFunctionBuf;
  UC aIndex;
  UC aOffset = 0;

  /* decode loc address */
  Main_decodeAddress( address, &aType, &aAddr1, &aAddr2, &aLen);

  if( aLen == 0)
  {
  	return;
  }

  /* パケットのアドレス部分は確定するのでセットする */
  *outType = aType;
  outPackets[0] = aAddr1;

  if ( aLen >= 2)
  {
    outPackets[1] = aAddr2;
    aOffset = 1;
  }
  else
  {
    aOffset = 0;
  }

  /* 前回のファンクションデータが必要なため同じアドレスを探索 */
  aIndex = DSList_FindItem(inList, aType, CMD_SPEED, aLen, 0, outPackets);


	
  if ( aIndex != 255)
  {
    aFunctionBuf = inList[aIndex].mFunctionBuf;
  }
  else
  {
    aFunctionBuf = 0;
  }

  /* Function buffer update  */
	if( (function > 0) && ( function <= 61))
	{
		if ( power == 0)
		{
			*ioFuncBuf = aFunctionBuf & (~(1ULL << (function - 1)));
		}
		else
		{
			*ioFuncBuf = aFunctionBuf | (1ULL << (function - 1));
		}
	}

	/* Generate dammy packet for initial registration */
	if( aIndex == 255)
	{
		switch ( aType)
		{
		case ITEMTYPE_MM2BASE:
		  outPackets[1] = 0x00;
		  outPackets[2] = 0x00;/* ダミー */
		  outPackets[3] = 0x00;
		  *outLen = 3;
		  break;

		case ITEMTYPE_DCC:
		  /* 速度ゼロのダミー */
		  outPackets[1 + aOffset] = 0b01100000;
		  *outLen = 2 + aOffset;
		  break;
		}
	}

}

void DSCoreLib::Main_decodeLocSpeed(DS_ITEM *inList, US address, short speed, UC *outType, UC *outPackets, UC *outLen, UC inSpeedStep)
{
  UC aAddr1, aAddr2;
  UC aLen;
  UC aType;
  UC aDirection;
  UC aIndex;
  UC aSpeed;
  UC aOffset;

  /* decode loc address */
  Main_decodeAddress( address, &aType, &aAddr1, &aAddr2, &aLen);

  if( aLen == 0)
  {
  	return;
  }
	
  /* パケットのアドレス部分は確定するのでセットする */
  *outType = aType;
  outPackets[0] = aAddr1;

  if ( aLen >= 2)
  {
    outPackets[1] = aAddr2;
  }

  /* 前回のファンクションデータが必要なため同じアドレスを探索 */
  aIndex = DSList_FindItem(inList, aType, CMD_SPEED, aLen, 0, outPackets);

  if ( aIndex != 255)
  {
    aDirection = inList[aIndex].mDirection;
  }
  else
  {
    aDirection = 0;
  }


	
  /* Speedstepのセット */
  if ( inSpeedStep != 0xFF)
  {
    inList[aIndex].mSpeedStep = inSpeedStep;
  }

  /* decode speed  */

  switch ( aType)
  {
    case ITEMTYPE_MM2BASE:
      outPackets[1] = 0b00;

      if (inList[aIndex].mSpeedStep == SPEEDSTEP_MM28)
      {
        /* 28 step speed */
        UC aRawSpeed = DS_CalcSpeedStep(speed, 28);
        UC aSecondSpeed = aRawSpeed >> 1;

        if ( aRawSpeed > (aSecondSpeed << 1))
        {
          aSpeed = aSecondSpeed + 1;
        }
        else
        {
          if ( aRawSpeed > 0)
          {
            aSpeed = aSecondSpeed - 1;
          }
          else
          {
            aSpeed = 0;
          }
        }


        outPackets[2] = MM2_encodeSpeed14Step(aSpeed, aDirection);
        outPackets[3] = MM2_encodeSpeed14Step(aSecondSpeed, aDirection);
        *outLen = 4;
      }
      	else
      	{
        /* 14 step speed */
        aSpeed = DS_CalcSpeedStep(speed, 14);
				
		if( aSpeed >= 14)
		{
			aSpeed = 13;
		}
		
        outPackets[2] = MM2_encodeSpeed14Step(aSpeed, aDirection);
        *outLen = 3;
      }


      break;

    case ITEMTYPE_DCC:

      aOffset = (aLen >= 2) ? 1 : 0;


      if (inList[aIndex].mSpeedStep == SPEEDSTEP_DCC28)
      {
        /* 28step速度 */
        outPackets[1 + aOffset] = DCC_decodeSpeedStep28(speed, aDirection);
        *outLen = 2 + aOffset;
      }
      else if (inList[aIndex].mSpeedStep == SPEEDSTEP_DCC127)
      {
        /* 拡張127step速度 */
        outPackets[1 + aOffset] = 0b00111111;
        outPackets[2 + aOffset] = DCC_decodeSpeedStep127(speed, aDirection);
        *outLen = 3 + aOffset;
      }
      else if (inList[aIndex].mSpeedStep == SPEEDSTEP_DCC14)
      {
        /* 14step速度 */
        outPackets[1 + aOffset] = DCC_decodeSpeedStep14(speed, aDirection, (UC)(inList[aIndex].mFunctionBuf & 0b1));
        *outLen = 2 + aOffset;
      }
      else
      {
        outPackets[1 + aOffset] = 0;
        *outLen = 2 + aOffset;
      }

      break;
  }


}

void DSCoreLib::Main_decodeAccessory(US address, UC power, UC *outType, UC *outPackets, UC *outLen)
{
  UC aAddr1, aAddr2;
  UC aLen;
  UC aType;
  UC aPower;
  UC aProtocolType = DS_GetLocIDProtocol((UC)(address >> 8));

  /* decode position  */

  switch ( aProtocolType)
  {
    case PROTOCOL_DCC_ACC:
      /* decode acc address (basic 9bit accessory mode) */
      Main_decodeAddress( address, &aType, &aAddr1, &aAddr2, &aLen);

      /* Power: 0 Straight(Green), 1 Diverging(Red) */

      *outType = ITEMTYPE_DCC;
      outPackets[0] = aAddr1;
      outPackets[1] = aAddr2 | 0b1000 | (power & 0b1) | ((((address - ADDR_ACC_DCC) % 4) & 0b11)  << 1);//1AAACDDD
      *outLen = 2;

      break;

    case PROTOCOL_MM2_ACC:
      /* decode acc address */
      Main_decodeAddress( address, &aType, &aAddr1, &aAddr2, &aLen);

      if ( power == 0)
      {
        /* RED(1) */
        aPower = 0b11000000; //8,7bit目はActive信号
      }
      else
      {
        /* GREEN(0) */
        aPower = 0b11000011; //8,7bit目はActive信号
      }

      *outType = ITEMTYPE_MM2HALF;
      outPackets[0] = aAddr1;
      outPackets[1] = 0b00;
      outPackets[2] = MM2_encodeAccSecondAddress((address - 0x3000) % 4) | aPower;
      *outLen = 3;
      break;
  }


}


void DSCoreLib::Main_decodeAddress( US address, UC *outpType, UC *outpAddr1, UC *outpAddr2, UC *outpLen)
{
  US aTempAddr;
  UC aType = DS_GetLocIDProtocol((UC)(address >> 8));

  switch (aType)
  {
    case PROTOCOL_MM2:
      aTempAddr = address;

      if ( aTempAddr <= 256)
      {
        *outpType = ITEMTYPE_MM2BASE;
        *outpAddr1 = MM2_encodeAddress(aTempAddr);
        *outpAddr2 = 0;
        *outpLen = 1;
      }
      else
      {
        *outpLen = 0;
      }
      break;

    case PROTOCOL_MM2_ACC:

      aTempAddr = ((address - 0x3000) >> 2) + 1;

      if ( aTempAddr <= 80)
      {
        *outpType = ITEMTYPE_MM2HALF;
        *outpAddr1 = MM2_encodeAddress(aTempAddr);
        *outpAddr2 = 0;
        *outpLen = 1;
      }
      else
      {
        *outpLen = 0;
      }
      break;

    case PROTOCOL_DCC:
      *outpType = ITEMTYPE_DCC;

      /* offset DCC address to convert CAN address to DCC address */
      aTempAddr = address - 0xC000;

      if (( aTempAddr > 0) && ( aTempAddr <= 127))
      {
        /* 0-127 address */
        *outpAddr1 = (UC)(aTempAddr & 0b01111111);
        *outpAddr2 = 0;
        *outpLen = 1;
      }
      else if (( aTempAddr > 127) && ( aTempAddr < 10239))
      {
        /* DCC 14bit address range is 0b11000000-0b00000000(49152, addr.0) to 0b11100111-0b11111111(59391) */
        /* 128-10239 address, but 0-127 long address doesn't use */
        aTempAddr = aTempAddr + 49152;
        *outpAddr1 = (UC)((aTempAddr >> 8) & 0xFF);
        *outpAddr2 = (UC)(aTempAddr & 0xFF);
        *outpLen = 2;
      }
      else if (aTempAddr == 10240)
	{
		//address=59392d(0xE800)
		/* Short Address Broadcast */
        *outpAddr1 = 0;//Broadcast
        *outpAddr2 = 0;
        *outpLen = 1;
	}
      else
      {
        /* out of 9bit/14bit locomotive address range */
        *outpLen = 0;

      }

      break;

    case PROTOCOL_DCC_ACC:
      *outpType = ITEMTYPE_DCC;

      /* offset DCC address to convert CAN address to DCC address */
      aTempAddr = ((address - ADDR_ACC_DCC) >> 2) + 1;

      if ( aTempAddr < 512)
      {
        *outpAddr1 = (UC)(0b10000000 | (aTempAddr & 0b00111111));//10AAAAAA
        *outpAddr2 = (UC)(0b10000000 | ((((~aTempAddr) & 0b111000000) >> 2) & 0xFF));//1AAACDDD
        *outpLen = 2;
      }
      else
      {
        /* out of 9bit accessory address range */
        //Extended Accessory Decoder Control Packet Format
        *outpLen = 0;

      }

      break;
    default:
      *outpLen = 0;
      break;
  }

}



void DSCoreLib::Main_registerDCCPoweronSequence()
{

  /* 全DCCデコーダリセット処理 */
	SendReset();
	
	/* DCC 0パルスをwait 20usで打ち込む */
	for( byte i = 0; i < 128; i++)
	{
		DS_WriteBit(0);
		DS_WaitClkX(TIME_DCC_0AX);
		DS_OutputOff();
		delayMicroseconds(20);
		DS_WriteBit(1);
		DS_WaitClkX(TIME_DCC_0BX);
		DS_OutputOff();
		delayMicroseconds(20);
	}
	
	
  /* DCC仕様上、20ms以上待つ。設定モードに移行させないため。 */
  //delay(21);

}

void DSCoreLib::SendReset()
{

  /* 全DCCデコーダリセット処理 */
	for( byte i = 0; i < DCC_INITPACKET_COUNT; i++)
	{
		DCC_SendInitialPacket(DCCPREAMBLE_DEFAULT);
		
		DS_OutputOff();
		delayMicroseconds(100);
	}
}


void DSCoreLib::Init()
{
	adc_init();
	adc_gpio_init(28);
	adc_select_input(2);
	
	/* ウェイト処理用 */
	DS_InitWaitClkX();
	
	/* 初期化 */
	DCC_Init();
	Clear();
	
	/* Loc3だけダミーでセット */
	SetLocoSpeedEx(ADDR_DCC + 3, 0, SPEEDSTEP_DCC127);
	SetLocoFunctionRaw(ADDR_DCC + 3, 0x00000000);
	
	
	
}

void DSCoreLib::Clear()
{
	/* リストスキャンを初期化 */
	gScanIndex = 0;
	gSwitchScan = 0;
	DSList_Clear(gList);
}

void DSCoreLib::TogglePulse()
{
	/* 出力パルスのトグル */
	
	if( DS_IsPowerOn() == 1)
	{
		
		if( (micros() - gToggleTime) > 100)
		{
			gToggleTime = micros();
			
			switch(gEndBitPattern)
			{
			case 0:
				DS_WriteBit(0);
				gEndBitPattern = 1;
				break;
			case 1:
				DS_WriteBit(1);
				gEndBitPattern = 0;
				break;
			}
		}
	
	}
}


void DSCoreLib::Scan()
{
	UC aIdlePacket[2];

	if ( gSwitchScan == 0)
	{
		/* リストのスキャン */
		if ( MAIN_scanList(gList, gScanIndex) != 255)
		{
			/* 次のパケットへ */
			gScanIndex++;
		}
		else
		{
			/* リセット */
			gScanIndex = 0;

			/* ファンクション送信用にスイッチ */
			gSwitchScan = 1;
			
			/* DCC Idle */
			aIdlePacket[0] = 0b11111111;
			aIdlePacket[1] = 0b00000000;
			
			//Send DCC pulse
			DCC_SendPackets(aIdlePacket, 2, gCutOutOnOff);
		}
	}
	else
	{
		if ( Main_scanFunction(gList, gScanIndex) != 255)
		{
			/* 次のパケットへ */
			gScanIndex++;
		}
		else
		{
			/* リセット */
			gScanIndex = 0;

			gSwitchScan = 0;
		}
	}
	
	//RailCom CutOut Interval
	if( gCutOut >= 32)
	{
		gCutOut = 0;
		gCutOutOnOff = 0;
	}
	else
	{
		gCutOutOnOff = (gCutOut < 5) ? 1 : 0;
		gCutOut++;
	}
	

}




boolean DSCoreLib::IsPower()
{
  return gPoweron;
}

boolean DSCoreLib::SetPower(boolean power)
{

  if (power)
  {
    /* 線路に電源投入 */
    DS_Power(1);

    /* デコーダ側の電源が安定するまで待つ */
    //delay(10);
	
    /* リストをクリアする */
    //DSList_Clear(gList);

    Main_registerDCCPoweronSequence();

    gPoweron = true;
  }
  else
  {
    DS_Power(0);

    gPoweron = false;
  }

  return true;
}


boolean DSCoreLib::SetLocoSpeed(word address, int inSpeed)
{
  return SetLocoSpeedEx( address, inSpeed, 0xFF);
}


boolean DSCoreLib::SetLocoSpeedEx(word address, int inSpeed, int inProtcol)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen = 0;
  UC aType = 0;

  /* アドレスデコード処理 */
  Main_decodeLocSpeed(gList, address, inSpeed, &aType, aPackets, &aLen, inProtcol);

  /* 管理リストをアップデート */
  DSList_UpdateItem(gList, aType, CMD_SPEED, aLen, 0, aPackets);

  return true;
}

boolean DSCoreLib::SetLocoFunction(word address, unsigned char inFunction, unsigned char inPower)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen = 0;
  UC aType = 0;
  ULL aFuncBuf = 0;
  
	if(inFunction > 61)
	{
		return false;
	}

  /* ファンクション指令デコード */
  Main_decodeLocFunction(gList, address, inFunction, inPower, &aType, aPackets, &aLen, &aFuncBuf);

  /* ファンクションはバッファのみ上書き(ファンクションパケットはスキャン時に自動生成) */
  DSList_UpdateItem_OWFunction(gList, aType, CMD_SPEED, aLen, aFuncBuf, inFunction, aPackets);

  return true;
}

boolean DSCoreLib::SetLocoFunctionRaw(word address, unsigned long inFunctions)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen = 0;
  UC aType = 0;
  ULL aFuncBuf = 0;


  /* ファンクション指令デコード */
  Main_decodeLocFunction(gList, address, 0, inFunctions & 1, &aType, aPackets, &aLen, &aFuncBuf);

  /* ファンクションはバッファのみ上書き(ファンクションパケットはスキャン時に自動生成) */
  DSList_UpdateItem_OWFunction(gList, aType, CMD_SPEED, aLen, inFunctions, 0, aPackets);

  return true;
}


boolean DSCoreLib::SetLocoDirection(word address, unsigned char inDirection)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen = 0;
  UC aType = 0;
  UC aDir = inDirection;

  /* アドレスデコード処理,リストと指令が異なる場合は停止させる */
  switch ( Main_decodeLocDirection(gList, address, aDir, &aType, aPackets, &aLen) )
  {
    case 1:
      /* 速度をゼロにして止める */
      Main_decodeLocSpeed(gList, address, 0, &aType, aPackets, &aLen, 0xFF);
      DSList_UpdateItem(gList, aType, CMD_SPEED, aLen, 0, aPackets);
      break;

    case 255:
      /* 新規登録処理 */
      Main_decodeLocSpeed(gList, address, 0, &aType, aPackets, &aLen, 0xFF);
      /* 登録リストに入っていないものは、リストに新規登録（進行方向を格納するため） */
      DSList_NewItem(gList, aType, CMD_SPEED, aLen, 0, aDir, aPackets);
      break;

    default:
      break;
  }

  return true;
}


boolean DSCoreLib::SetTurnout(word address, byte inSwitch)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen = 0;
  UC aType = 0;

  /* アクセサリ指令デコード */
  Main_decodeAccessory(address, inSwitch, &aType, aPackets, &aLen);
	
  if( aLen == 0)
  {
  	return true;
  }


  /* 管理リストをアップデート */
  DSList_UpdateItem(gList, aType, CMD_ACCESSORY, aLen, 2, aPackets);

  return true;
}

byte DSCoreLib::convertAcc_MMDCC(word address, byte inSwitch)
{

  switch ( GetLocIDProtocol(address >> 8))
  {
    case ADDR_ACC_MM2:
      /* 0:Straight, 1: diverging */
      return (inSwitch == 0) ? 1 : 0;
      break;

    case ADDR_ACC_DCC:
      /* 1:Straight, 0: diverging */
      return inSwitch;
      break;

    default:
      return inSwitch;
      break;
  }

}

word DSCoreLib::GetLocIDProtocol(byte address)
{
  if ( address < 0x04)
  {
    return ADDR_MM2;
  }
  else if ( (address >= 0x30) && (address <= 0x33))
  {
    return ADDR_ACC_MM2;
  }
  else if ( (address >= 0x38) && (address <= 0x3F))
  {
    return ADDR_ACC_DCC;
  }
  else if ( (address >= 0x40) && (address <= 0x70))
  {
    return ADDR_MFX;
  }
  else if ( (address >= 0xC0) && (address <= 0xFF))
  {
    return ADDR_DCC;
  }
  else
  {
    return 0;
  }
}

//DCC専用
boolean DSCoreLib::WriteConfig_Ops(word address, word number, byte value)
{
  UC aPackets[5] = {0, 0, 0, 0, 0};
  UC aLen;
  UC aType;
  UC aDecodedAddr1;
  UC aDecodedAddr2;
  US aAddress;
  UC aCVValue;
  UC aPowerOnEnd;

  /* Address decode */

  Main_decodeAddress(address, &aType, &aDecodedAddr1, &aDecodedAddr2, &aLen);

  //Marklin Motorola 2は除外
  if ( (aType == ITEMTYPE_MM2BASE) || (aType == ITEMTYPE_MM2HALF))
  {
    return false;
  }


  /* CV書き込み */
  aAddress = number - 1; /* 1-1024を、0-1023に変換 */
  aCVValue = value;


  aPowerOnEnd = DS_IsPowerOn();

  //電源供給（電源OFF時）
  if ( aPowerOnEnd == 0)
  {
    delay(800);
    /* 線路に電源投入 */
    DS_Power(1);
  }


  /* CVパケット生成(書き込み指令) */
  if ( aLen == 2)
  {
    aPackets[0] = aDecodedAddr1;
    aPackets[1] = aDecodedAddr2;

    // 1110CCVV 0 VVVVVVVV 0 DDDDDDDD

    aPackets[2] = 0b11100000 | 0b00001100 | ((aAddress >> 8) & 0b11);
    aPackets[3] = aAddress & 0b11111111;
    aPackets[4] = aCVValue;
    aLen = 5;
  }
  else
  {
    aPackets[0] = aDecodedAddr1;
    aPackets[1] = 0b11100000 | 0b00001100 | ((aAddress >> 8) & 0b11);
    aPackets[2] = aAddress & 0b11111111;
    aPackets[3] = aCVValue;
    aLen = 4;
  }

  /* CV指令(Ops)を2回以上送る */
  for ( byte i = 0; i < 8; i++)
  {
    DCC_SendPackets(aPackets, aLen, 0);
    delayMicroseconds(150);
  }

  /* 電源遮断(最初から電源が入っていないときのみオフ) */
  if ( aPowerOnEnd == 0)
  {
    delay(1000);
    DS_Power(0);
  }



  return true;
}

//DCC専用
boolean DSCoreLib::WriteConfig_Dir( word number, byte value)
{
	UC aPackets[5] = {0,0,0,0,0};
	US aAddress;
	UC aCVValue;
	bool aRet = false;
	US aTempVal;
	US aMaxVal;
	US aMinVal;
	UL aBaseTime;
	US aCurrentOffset; //電流センサオフセット
	
	/* CV書き込み */
	aAddress = number;
	aCVValue = value;
	
	//オフセット調整用
	aCurrentOffset = GetCurrentAvg();
	
	/* 線路に電源投入 */
	DS_Power(1);
		
	/*DCC*/
	aAddress = aAddress - 1;/* 1-1024を、0-1023に変換 */
	
	
	/* Power-on-cycle */
	for( byte i = 0; i < 20; i++)
	{
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
	}
	
	/* リセットパルスを3回以上送る */
	for( byte i = 0; i < 6; i++)
	{
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
	}
		
	/* CVパケット生成(書き込み指令) */
	aPackets[0] = 0b01110000 | 0b00001100 | ((aAddress >> 8) & 0b11);
	aPackets[1] = aAddress & 0b11111111;
	aPackets[2] = aCVValue;
	
	/* CV指令を5回以上送る */
	for( byte i = 0; i < 10; i++)
	{
		DCC_SendPacketsEx(aPackets, 3, DCCPREAMBLE_CV, 0);
		
		aBaseTime = millis();
		while( (millis() - aBaseTime) < 6)
		{
			
			aTempVal = GetCurrent(aCurrentOffset);
			
			if( aMaxVal < aTempVal)
			{
				aMaxVal = aTempVal;
			}
			
			if( aMinVal > aTempVal)
			{
				aMinVal = aTempVal;
			}
		}
		
		if(( aMaxVal >= gThresholdCurrent) && (i > 5))
		{
			break;
		}		
	}
		
	/* リセットパルスを6回以上送る */
	for( byte i = 0; i < 32; i++)
	{
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
	}

	aRet = true;

	/* 電源を切る */
	DS_Power(0);

	return aRet;
}


//DCC専用, Direct mode
boolean DSCoreLib::ReadConfig(word number, byte *value, byte inSpeed, byte inPowerFlag)
{
	boolean aRet = false;
	
	/*
	   inPowerFlag==0  線路電源ON/OFF有効
	   inPowerFlag==1  線路電源ONのみ有効
	   inPowerFlag==2  線路電源OFFのみ有効
	   inPowerFlag==3  線路電源操作なし
	*/
	
	
	if( (inPowerFlag == 0) || (inPowerFlag == 1))
	{
		/* 線路に電源投入 */
		DS_Power(1);
		
		
		/* Power-on-cycle */
		Main_registerDCCPoweronSequence();
		
		/* パケット20回送る */
		for( byte i = 0; i < 20; i++)
		{
			DCC_SendInitialPacket(DCCPREAMBLE_CV);
		}
	}
	else
	{
		/* パケット3回送る */
		for( byte i = 0; i < 3; i++)
		{
			DCC_SendInitialPacket(DCCPREAMBLE_CV);
		}
	}
	
	/* 詳細関数を呼び出す */
	aRet = ReadConfigEx(number, value, inSpeed);
	
	if( (inPowerFlag == 0) || (inPowerFlag == 2))
	{
		/* いったん電源を切る */
		DS_Power(0);
	}
	
	return aRet;
}

/* 電源再投入処理を省いたCV読み込み処理本体 */
boolean DSCoreLib::ReadConfigEx(word number, byte *value, byte inSpeed)
{
	UC aDetectedCnt[16];
	long aData = 0;
	UC aData_Count = 0;
	US aCurrentOffset; //電流センサオフセット
	US aMaxVal;
	US aMinVal;
	boolean aRet = false;
	
	int aCntReset = 3 + (inSpeed * 2);
	int aCntCV = 3 + (inSpeed * 2);
	int aWaitTime = 40;
	
	//オフセット調整用
	aCurrentOffset = GetCurrentAvg();

	for( byte d = 0; d < 2; d++)
	{
		
		for( byte k = 0; k < 8; k++)
		{
			
			getCVData(number, &aMaxVal, &aMinVal, d, k, aWaitTime, aCntReset, aCntCV, aCurrentOffset);
			
			/* 配列に保存する */
			aDetectedCnt[aData_Count] = aMaxVal;
			
			//検出できたビットを立てていく(合計16回)
			if( aMaxVal >= gThresholdCurrent)
			{
				
				//データを立てる
				aData = aData + (1 << aData_Count);
			}
			
			aData_Count++;
			
		}
	}
	

	/* upper and lower byte calculation */
	UC aData_high = (aData >> 8 ) & 0xFF;
	UC aData_low = aData & 0xFF;
	UC aData_low_not = (~(UC)aData_low) & 0xFF;

	/* データチェック */
#ifdef DEBUG
	Serial.println("");
	
	Serial.print(F("Ioffset="));
	Serial.println(aCurrentOffset);
	Serial.print(F("Data(BIN)="));
	Serial.println(aData & 0xFFFF, BIN);

		
	Serial.print(F("AddressCheck: 0bit="));
	Serial.print(aData_low_not, DEC);
	Serial.print(F(", 1bit="));
	Serial.println(aData_high, DEC);
#endif
	
	
	if( aData_high == aData_low_not)
	{
#ifdef DEBUG
		Serial.println(F("CV read Successed!"));
#endif
		
		*value = aData_low_not;
		
		aRet = true;
	}
	else
	{
		//リベンジ
		if( GetCVValueFromMap(aDetectedCnt, value, &aData_high, &aData_low) == true)
		{
#ifdef DEBUG
			Serial.println(F("CV read recovery Successed!"));
#endif
			
			aRet = true;
		}
		else
		{
			
#ifdef DEBUG
			Serial.println(F("CV read retry"));
#endif
			
			for( byte e = 0; e < gRetryCount; e++)
			{
				/* エラー箇所だけ読み取りし直し */
				
				aWaitTime++;
				aCntCV++;
				aCntReset++;
				
				for( byte d = 0; d < 8; d++)
				{
					if( ((aData_high >> d) & 1) == ((aData_low >> d) & 1))
					{
						
						/* Bitが異なるものを取り直す */
						
						getCVData(number, &aMaxVal, &aMinVal, 0, d, aWaitTime, aCntReset, aCntCV, aCurrentOffset);
						aDetectedCnt[d] = aMaxVal;
						
#ifdef DEBUG
						Serial.print(aMaxVal);
#endif
						delay(RETRY_WAIT);
						
						getCVData(number, &aMaxVal, &aMinVal, 1, d, aWaitTime, aCntReset, aCntCV, aCurrentOffset);
						aDetectedCnt[d + 8] = aMaxVal;
						
#ifdef DEBUG
						Serial.print("=");
						Serial.print(aMaxVal);
						Serial.print(", ");
						Serial.println("");
#endif
						delay(RETRY_WAIT);
						
					}
				}
				
				/* 再度、読み直し */
				if( GetCVValueFromMap(aDetectedCnt, value, &aData_high, &aData_low) == true)
				{
#ifdef DEBUG
					Serial.println(F("CV read retry Successed!"));
#endif
					
					aRet = true;
					
					break;
				}
			}
			
			
			if( aRet == false)
			{
#ifdef DEBUG
				Serial.println(F("CV read Failed!"));
#endif
				*value = 0;
				
				aRet = false;
			}
		}
	}

	
	return aRet;

}

void DSCoreLib::getCVData(word inAddress, US *inMaxData, US *inMinData, byte inD, byte inK, byte inWaitTime, byte inCntReset, byte inCntCV, word inAdcOffset)
{
	
	UC aPackets[5] = {0,0,0,0,0};
	US aAddress;
	UL aBaseTime;
	US aTempVal;
	US aMaxVal;
	US aMinVal;
	byte aWaitTime = inWaitTime; /* CV Ack待ち時間 */
	
	/*DCC*/
	aAddress = inAddress - 1;/* 1-1024を、0-1023に変換 */
	
	/* CVパケット生成(書き込み指令) */
	aPackets[0] = 0b01110000 | 0b00001000 | ((aAddress >> 8) & 0b11);
	aPackets[1] = aAddress & 0b11111111;

	/* リセットパルスを3回以上送る */
	for( byte i = 0; i < inCntReset; i++)
	{
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
		
		//delayMicroseconds(TIME_WAIT);
	}
	
	/* CVパケット生成(書き込み指令) */
	aPackets[2] = 0b11100000 | 0b00000000 | (inD == 0 ? 0 : 0b1000)  | inK;// 111KDBBB: K=0(BitVerify),D= 0 or 1, BBB=bit番号 
		
	//初期化
	aTempVal = 0;
	aMaxVal = 0;
	aMinVal = GetCurrent(inAdcOffset);

	//Packet send (1回目～)
	DCC_SendPacketsEx(aPackets, 3, DCCPREAMBLE_CV, 0);
	DCC_SendPacketsEx(aPackets, 3, DCCPREAMBLE_CV, 0);
		
	aBaseTime = millis();
		
	while( (millis() - aBaseTime) <= aWaitTime)
	{
		
		aTempVal = GetCurrent(inAdcOffset);
		
		if( aMaxVal < aTempVal)
		{
			aMaxVal = aTempVal;
		}
		
		if( aMinVal > aTempVal)
		{
			aMinVal = aTempVal;
		}
		
		TogglePulse();
	}
	
	if( aMaxVal >= gThresholdCurrent)
	{
		//1回目 Ack応答のレスポンス
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
		//2回目 Ack応答のレスポンス
		DCC_SendInitialPacket(DCCPREAMBLE_CV);
	}

	
	*inMaxData = aMaxVal;
	*inMinData = aMinVal;
	
	
}





bool DSCoreLib::GetCVValueFromMap(UC *inCntData, UC *outpValue, UC *outpHighByte, UC *outpLowByte)
{
	
	word aSum = 0;
	word aMax = 0;
	word aMin = 9999;
  word aCenter = 0;
	word aData = 0;
	word aThreshold = 0;
	byte i, j;
  byte aTemp = 0;
  byte aDataTemp[SIZE_CVBITS];
	
#ifdef DEBUG
	Serial.print(F("Bits->"));
#endif

  //バブルソート(そのうち違うソートにする)

  for (i = 0; i < SIZE_CVBITS - 1; i++)
  {
    aDataTemp[i] = inCntData[i];
  }

  for (i = 0; i < SIZE_CVBITS - 1; i++)
  {
    for (j = SIZE_CVBITS - 1; j >= i + 1; j--)
    {
      if (aDataTemp[j] < aDataTemp[j - 1])
      {
         
         aTemp = aDataTemp[j];
         aDataTemp[j] = aDataTemp[j - 1];
         aDataTemp[j - 1] = aTemp;
      
      }
    }
  }

  //最小値、最大値、中央値を求める
  aMax = aDataTemp[0];
  aMin = aDataTemp[SIZE_CVBITS - 1];
  aCenter = (aDataTemp[7] + aDataTemp[8])>> 1; //７個目と８個目を足して二で割る

  // 0, 1, 2, 3, 4, 5, 6, 7,
  // 8, 9,10,11,12,13,14,15,
	
	for( i = 0; i < SIZE_CVBITS; i++)
	{
		aSum = aSum + (word)inCntData[i];
		
		if( inCntData[i] > aMax)
		{
			aMax = inCntData[i];
		}
		
		if( inCntData[i] < aMin)
		{
			aMin = inCntData[i];
		}
		
#ifdef DEBUG
		Serial.print(inCntData[i]);
		Serial.print(",");
#endif
		
	}
	
#ifdef DEBUG
	Serial.println("");
#endif
	
	aThreshold = aCenter;//中央値にする
	
	for( i = 0; i < SIZE_CVBITS; i++)
	{
		if( inCntData[i] < aThreshold)
		{
			//データを立てる
			aData = aData + (1 << i);
		}
	}
	
	UC aData_high = (aData >> 8 ) & 0xFF;
	UC aData_low = aData & 0xFF;
	UC aData_low_not = (~(UC)aData_low) & 0xFF;
	
#ifdef DEBUG
	Serial.print("DataB(BIN)=");
	Serial.println(aData & 0xFFFF, BIN);
	//Serial.print("Recovered Value =");
	//Serial.println(aData_low);
#endif
	
	if( aData_high == aData_low_not)
	{
		*outpValue = aData_low;
		return true;
	}
	else
	{
		return false;
	}

}

US DSCoreLib::GetCurrent(US inAvg)
{
	//この関数は100us程度かかる
	adc_select_input(2);
	long aCurrent = (long)(adc_read() >> 2);
	
	if( aCurrent >= inAvg)
	{
		aCurrent = aCurrent - inAvg;
	}
	else
	{
		aCurrent = inAvg - aCurrent;
	}
	
	return aCurrent;
}
	
US DSCoreLib::GetCurrentAvg()
{
	//この関数は100us程度かかる
	long aCurrent = 0;
	
	for( byte i = 0; i < 16; i++)
	{
		adc_select_input(2);
		aCurrent = aCurrent + (long)(adc_read() >> 2);
	}
	
	return aCurrent >> 4;
}
	
	