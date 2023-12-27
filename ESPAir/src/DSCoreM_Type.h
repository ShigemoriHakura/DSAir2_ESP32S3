/*
 * DS_Type.h
 *
 * Created: 2014/02/28 5:54:29
 *  Author: Administrator
 */


#ifndef DS_TYPE_H_
#define DS_TYPE_H_

extern void gpio_put(unsigned char gpio, bool value);
extern void adc_init();
extern void adc_gpio_init(unsigned char gpio);
extern void adc_select_input(unsigned char input);
extern unsigned short adc_read();

#define ABS(in) (((in) >= 0) ? (in) : -(in))


#define MODE_POWEROFF 0
#define MODE_POWERON 1
#define MODEMM2_BASE 0
#define MODEMM2_HALF 1

/* Arduinoとの通信用コマンド */
#define CMD_PWR_OFF 0x00
#define CMD_PWR_ON  0xF0

#define CMD_WAIT    0xD0
#define CMD_OK      0x80
#define CMD_CRCERR  0x90
#define CMD_CMDERR  0xA0
#define CMD_UNKERR  0xC0
#define CMD_DCC_IDLE    0xD0
#define CMD_SPEED       0x10
#define CMD_ACCESSORY   0x20
#define CMD_FUNCTION    0x30
#define CMD_CVWRITE     0x40
#define CMD_DIRECTION   0x50
#define CMD_CVREAD      0x60
#define CMD_EXTENTION   0x70

/* 特殊・拡張機能用 */
#define EXCMD_NONE		0



#define PROTCOL_UNKNOWN 0x00
#define PROTOCOL_MM2	0x10
#define PROTOCOL_MM2_ACC	0x11
#define PROTOCOL_DCC	0x20
#define PROTOCOL_DCC_ACC	0x21
#define PROTOCOL_MFX	0x30


#define DIR_FWD	0x00
#define DIR_REV 0x01

#define MAX_FUNCTION_MM2 4 /* MM2 Functionスキャン最大数をとりあえず4にセット */

/* 緊急停止ボタン管理 */
#define TRIGGER_NONE 0
#define TRIGGER_SPI 1

/* 二回送信の回数 */
#define ITEM_PRIORITY 5

/* 送信管理リスト関連 */
#define ITEM_LISTSIZE	 20
#define ITEMTYPE_UNKNOWN 0b00000000
#define ITEMTYPE_MM2BASE 0b00000010
#define ITEMTYPE_MM2HALF 0b00000110
#define ITEMTYPE_DCC	 0b00001000
#define ITEMTYPE_MM2TRX  0b00000111 /* Trix23951クレーン用特殊 */

#define DDR_SPI		DDRB
#define PORT_SPI	PORTB

/* センサ関連 */
//#define		SENSOR_CURRENT		A2
#define		SENSOR_VOLTAGE		A1
#define		OC_LEVEL			340		// 10.0A
#define		OV_LEVEL			768		// 25V
#define		LV_LEVEL			245		// 8V:


//型の定義
typedef char SC;
typedef unsigned char UC;
//typedef short SS;
typedef unsigned short US;
typedef long SL;
typedef unsigned long UL;
typedef long long SLL;
typedef unsigned long long ULL;


typedef struct {

	UC mType;		/**< 送信種別(MM2-Base or MM2-Half or DCC): 0-16(4bit) */
	UC mCmd;		/**< コマンド(DIRECTION, FUNCTION) */
	UC mLen;		/**< 長さ */
	UC mCnt;		/**< 自動消去カウンタ(0-8, 3bit) */
	UC mDatas[5];	/**< 受信した実データ */
	ULL mFunctionBuf;/**< ファンクションバッファ(64bit, F0-F60)  */
	UC mIncCnt;		/**< 生死判定用カウンタ */
	UC mFuncNo;	/**< ファンクションNo(MM2専用) */
	UC mFuncCounter; /**< ファンクションカウンタ(MM2専用)  */
	UC mReverse;	/**< MM2用進行方向切り替えフラグ */
	UC mDirection:2;	/**< 送信カウンタ, 0:FWD, 1:REV */
	UC mSpeedStep:2;	/**< 速度ステップ(0-2) */
	UC mPriority:4;	/**< 優先度決定カウンタ(0-5)*/
}DS_ITEM;


#endif /* DS_TYPE_H_ */
