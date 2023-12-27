/*
 * DS_Liste.c
 *
 * Created: 2014/08/10 5:54:29
 *  Author: Yaasan
 */ 


#include "DSCoreM_Type.h"
#include "DSCoreM_Common.h"
#include "DSCoreM_DCC.h"
#include "DSCoreM_MM2.h"
#include "DSCoreM_List.h"

UC gAliveChkCnt[ITEM_LISTSIZE]; /* 生死確認カウンタ */


UC DSList_AddItem(DS_ITEM *inList, DS_ITEM inItem)
{
	UC aNewItemNo = 0;
	int i;
	
	/**/
	for( i = 0; i < ITEM_LISTSIZE; i++)
	{
		
		if(inList[i].mType == 0)
		{
			aNewItemNo = i;
			break;
		}
	}
	
	/* 登録 */
	return DSList_SetItem(inList, aNewItemNo, inItem);
	
}

DS_ITEM DSList_GetItem(DS_ITEM *inList, UC inNo)
{
	return inList[inNo];
}

UC DSList_SetItem(DS_ITEM *inList, UC inNo, DS_ITEM inItem)
{
	int i;
	
	/* セット */
	inList[inNo].mType = inItem.mType;
	inList[inNo].mLen = inItem.mLen;
	inList[inNo].mCnt = inItem.mCnt;
	inList[inNo].mIncCnt = inItem.mIncCnt;
	inList[inNo].mFunctionBuf = inItem.mFunctionBuf;
	inList[inNo].mDirection = inItem.mDirection;
	inList[inNo].mCmd = inItem.mCmd;
	inList[inNo].mFuncNo = inItem.mFuncNo;
	inList[inNo].mFuncCounter = inItem.mFuncCounter;
	inList[inNo].mSpeedStep = inItem.mSpeedStep;
	inList[inNo].mReverse = inItem.mReverse;
	inList[inNo].mPriority = 0;
	
	for( i = 0; i < inItem.mLen; i++)
	{
		inList[inNo].mDatas[i] = inItem.mDatas[i];
	}
	
	return inNo;
	
}

UC DSList_NewItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC inDirection, UC *inDatas)
{
	int i;
	DS_ITEM aItem;
	aItem.mType = inType;
	aItem.mLen = inLen;
	aItem.mCnt = inCnt;
	aItem.mCmd = inCmd;
	aItem.mIncCnt = 0;
	aItem.mFunctionBuf = 0;
	aItem.mDirection = inDirection;
	aItem.mFuncNo = 0;
	aItem.mFuncCounter = 0;
	aItem.mSpeedStep = 0;
	aItem.mReverse = 0;
	aItem.mPriority = 0;

	
	for( i = 0; i < inLen; i++)
	{
		aItem.mDatas[i] = inDatas[i];
	}
	
	return DSList_AddItem(inList, aItem);
}

UC DSList_UpdateItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC *inDatas)
{
	int j;
	UC aUpdatedIndex;

	aUpdatedIndex = DSList_FindItem(inList, inType, inCmd, inLen, inCnt, inDatas);

	/* 登録されていないので新規登録 */
	if(aUpdatedIndex == 255)
	{
		return DSList_NewItem(inList, inType, inCmd, inLen, inCnt, DIR_FWD, inDatas);
	}
	
	/* コマンド書き換え */
	inList[aUpdatedIndex].mCmd = inCmd;
	
	switch(inType)
	{
		case ITEMTYPE_MM2BASE:
		case ITEMTYPE_MM2HALF:
		inList[aUpdatedIndex].mDatas[0] = inDatas[0];
		inList[aUpdatedIndex].mDatas[1] = inDatas[1];
		inList[aUpdatedIndex].mDatas[2] = inDatas[2];
		break;
		
		case ITEMTYPE_DCC:
		/* データ更新 */
		for( j = 0; j < 5; j++)
		{
			inList[aUpdatedIndex].mDatas[j] = inDatas[j];
		}
		
		/* 二回送信セット */
		inList[aUpdatedIndex].mPriority = ITEM_PRIORITY;
		
		break;
	}

	/* サイズは変わるかもしれないので更新 */
	inList[aUpdatedIndex].mLen = inLen;
	
	/* 生死カウンタ */
	inList[aUpdatedIndex].mIncCnt++;
	
	if(inList[aUpdatedIndex].mIncCnt >= 255)
	{
		inList[aUpdatedIndex].mIncCnt = 0;
	}
	
	return aUpdatedIndex;
	
}

UC DSList_FindItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC *inDatas)
{
	UC aUpdatedIndex = 255;
	UC aChkAnd = 0;
	int i;
	
	switch(inType)
	{
		case ITEMTYPE_MM2BASE:
		
		for( i = 0; i < ITEM_LISTSIZE; i++)
		{
			if( (inList[i].mDatas[0] == inDatas[0]) && (inList[i].mType == inType))
			{
				aUpdatedIndex = i;
				break;
			}
		}
		break;
		
		case ITEMTYPE_MM2HALF:
		
		for( i = 0; i < ITEM_LISTSIZE; i++)
		{
			if( (inList[i].mDatas[0] == inDatas[0]) && (inList[i].mType == inType) && ((inList[i].mDatas[2] & 0b1111) == (inDatas[2] & 0b1111)))
			{
				aUpdatedIndex = i;
				break;
			}
		}
		
		break;
		
		case ITEMTYPE_DCC:
		
		/* 拡張アドレスチェック */
		if( ((inDatas[0] >> 7) & 0b1) == 0b1)
		{
			aChkAnd = 0xFF;
		}
		else
		{
			aChkAnd = 0x00;
		}
		
		for( i = 0; i < ITEM_LISTSIZE; i++)
		{
			/* 拡張アドレス時は拡張アドレスの第二バイトも考慮してチェック */
			if( (inList[i].mCmd == inCmd) && (inList[i].mDatas[0] == inDatas[0]) && ((inList[i].mDatas[1] & aChkAnd) == (inDatas[1] & aChkAnd)) && (inList[i].mType == inType))
			{
				aUpdatedIndex = i;
				break;
			}
		}
		
		break;
	}

	return aUpdatedIndex;
	
}


UC DSList_UpdateItem_OWFunction(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, ULL inFuncBuf, UC inFuncNo, UC *inDatas)
{
	UC aUpdatedIndex;

	aUpdatedIndex = DSList_FindItem(inList, inType, inCmd, inLen, 0, inDatas);

	/* 登録されていないので新規登録 */
	if(aUpdatedIndex == 255)
	{
		aUpdatedIndex = DSList_NewItem(inList, inType, inCmd, inLen, 0, DIR_FWD, inDatas);
	}
	
	switch(inType)
	{
		case ITEMTYPE_MM2BASE:
		/* MM2ではファンクション書き換えは自動スキャンで行うので、アドレス・速度・パケットは一切更新しない */
		inList[aUpdatedIndex].mFunctionBuf = inFuncBuf;
		inList[aUpdatedIndex].mFuncNo = inFuncNo;	//ファンクション番号のセット
		inList[aUpdatedIndex].mFuncCounter = 4; // 4回、ファンクション信号を送る
		/* コマンド書き換え */
		inList[aUpdatedIndex].mCmd = inCmd;
		
		break;
		
		case ITEMTYPE_DCC:
		
		/* ファンクションバッファ書き換え */
		inList[aUpdatedIndex].mFunctionBuf = inFuncBuf;
		
		/* カウンタをリセット */
		inList[aUpdatedIndex].mFuncCounter = 0;
		
		/* 二回送信セット */
		inList[aUpdatedIndex].mPriority = ITEM_PRIORITY;
		break;
		
	}
	
	
	/* 生死カウンタ */
	inList[aUpdatedIndex].mIncCnt++;
	
	if(inList[aUpdatedIndex].mIncCnt >= 255)
	{
		inList[aUpdatedIndex].mIncCnt = 0;
	}
	
	return aUpdatedIndex;

}

UC DSList_DeleteItem(DS_ITEM *inList, UC inNo)
{
	DSList_ZeroItem(inList, inNo);
	DSList_ShiftItem(inList, inNo);
	
	return inNo;
}

UC DSList_ZeroItem(DS_ITEM *inList, UC inNo)
{
	int i;
	
	/* セット */
	inList[inNo].mType = ITEMTYPE_UNKNOWN;
	inList[inNo].mLen = 0;
	inList[inNo].mCnt = 0;
	inList[inNo].mIncCnt = 0;
	inList[inNo].mFunctionBuf = 0;
	inList[inNo].mDirection = DIR_FWD;
	inList[inNo].mCmd = 0;
	inList[inNo].mFuncNo = 0;
	inList[inNo].mFuncCounter = 0;
	inList[inNo].mSpeedStep = 0;
	inList[inNo].mReverse = 0;
	inList[inNo].mPriority = 0;
	
	for( i = 0; i < 5; i++)
	{
		inList[inNo].mDatas[i] = 0;
	}
	
	return inNo;
	
}

UC DSList_ShiftItem(DS_ITEM *inList, UC inNo)
{
	int i;
	
	for( i = inNo; i < ITEM_LISTSIZE - 1; i++)
	{
		if( inList[i + 1].mType != ITEMTYPE_UNKNOWN )
		{
			DSList_SetItem(inList, i, inList[i + 1]);
		}
		else
		{
			DSList_ZeroItem(inList, i);
			break;
		}
	}
	
	return inNo;
}

void DSList_Clear(DS_ITEM *inList)
{
	int i;
	
	for( i = 0; i < ITEM_LISTSIZE; i++)
	{
		DSList_ZeroItem(inList, i);
	}
	
}

