
/*
 * DS_List.h
 *
 * Created: 2014/08/10 5:54:29
 *  Author: Yaasan
 */ 


#ifndef DS_LIST_H_
#define DS_LIST_H_


UC DSList_AddItem(DS_ITEM *inList, DS_ITEM inItem);
DS_ITEM DSList_GetItem(DS_ITEM *inList, UC inNo);
UC DSList_SetItem(DS_ITEM *inList, UC inNo, DS_ITEM inItem);
UC DSList_ZeroItem(DS_ITEM *inList, UC inNo);
UC DSList_ShiftItem(DS_ITEM *inList, UC inNo);
UC DSList_NewItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC inDirection, UC *inDatas);
UC DSList_FindItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC *inDatas);
UC DSList_UpdateItem(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, UC inCnt, UC *inDatas);
UC DSList_UpdateItem_OWFunction(DS_ITEM *inList, UC inType, UC inCmd, UC inLen, ULL inFuncBuf, UC inCnt, UC *inDatas);
UC DSList_DeleteItem(DS_ITEM *inList, UC inNo);
void DSList_Clear(DS_ITEM *inList);

#endif /* DS_LIST_H_ */