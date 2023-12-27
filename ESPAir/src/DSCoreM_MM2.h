
#define TIME_MM2_BASE_0	25	/* 26usから1us分オフセット調整 */
#define TIME_MM2_BASE_1	176 /* 182usから6us分オフセット調整 */
#define TIME_MM2_HALF_0	7	/* 13usのまま */
#define TIME_MM2_HALF_1	89	/* 91usから3us分オフセット調整 */
#define TIME_MM2_HALF_0B	12	/* 13usのまま */
#define TIME_MM2_HALF_1B	84	/* 91usから3us分オフセット調整 */

UC MM2_RewriteAddressPackets(UC inAddressByte, UC inFuncCnt);
UC MM2_RewriteFunctionPackets(UC inSpeedByte, UC inFuncCnt, UL inFuncBuf);

void MM2_SendPackets(UC *inPackets, UC inLen, UC inFreqType, UC inFuncCnt, UL inFuncBuf);
void MM2_SendZeroPackets();
void MM2_SendDoublePackets(UC *inPackets, UC inLen, UC inFreqType, UC inFuncNo, UL inFuncBuf);
void MM2_SendData(UC inData, UC inFreqType, UC inLen);
void MM2_SendBit(UC inBit, UC inFreqType);
void MM2_WaitLong();

UC MM2_encodeLocFunction( UC inFunctionNo, UC inSpeedPacket, UC inPower);
UC MM2_encodeSpeed14Step(UC speed14, UC direction);
UC MM2_encodeAddress(US address);
UC MM2_encodeAccSecondAddress(UC inSubAddress);
UC MM2_decodeAddress(UC inPacket);
UC MM2_generateSpeedDir();
