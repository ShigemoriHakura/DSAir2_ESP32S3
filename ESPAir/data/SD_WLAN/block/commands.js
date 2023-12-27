/* Reply from DSair2 */
var g_RecvStatus = "";

/* Status Details */

var webapp_ver = "20200131";
var gStatus_ACCData;
var gStatus_Msg;
var gStatus_ACCData;
var gStatus_ACCData;
var gTextVolt;
var gTextCurrent;
var gTextPower;
var gTextFirmver;
var gTextError;
var gTextHardver;
var gTextSeqno;
var gTextS88Status;

/* Analog */
var ANA_Direction = 0;
var ANA_LocSpeed = 0;

/* CV */
var gReadCVNo = 0;
var gReadCVVal = 0;

/* S88 */
var gS88On = 0;
var gS88Max;
var gS88Data = [0,0,0,0];

/* etc */
var gIntervalTimeout = 0;
var IntervalUpdateLimit_ACC = 0;
var PowerStatus = 0;

/* Loco Information */
var LocAddr = 3;
var LocSpeed = [0, 0, 0, 0];
var LocDirReverse = [0, 0, 0, 0];
var LocProtocol = GetLocProtocol(1);
var AccProtocol = GetACCProtocol(1);
var LocSpeedStep = 2;
var LocFuncStatus = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var LocDir = ["FWD", "FWD", "FWD", "FWD"];

/* Accessory Information */
var AccStatus = new Array(2044, 0);

/* Deco */
var gDisplayDeco = 0;
var gDisplayDecoEx = 0;


function UpdateProtocol(inDCC)
{
	LocProtocol = GetLocProtocol(inDCC);
	AccProtocol = GetACCProtocol(inDCC);
}

function GetLocProtocol(inDCC) {
	if (inDCC == 1) {
			//DCC
			return 49152;
	} else {
			//MM2
			return 0;
	}
}

function GetACCProtocol(inDCC) {
	if (inDCC == 1) {
			//DCC
			return 14335;
	} else {
			//MM2
			return 12287;
	}
}

function GetUrl() {
	return "/command.cgi?op=131&ADDR=0&LEN=64&DATA=";
}

function GetSlotAdress(inSlotNo) {
	var aSlotNo = inSlotNo;

	if (inSlotNo > 3) {
		aSlotNo = 3;
	}

	return parseInt(dblLocArray[aSlotNo]);

}

function GetSlotSpeed(inSlotNo) {
	var aSlotNo = inSlotNo;

	if (inSlotNo > 3) {
		aSlotNo = 3;
	}

	return parseInt(LocSpeed[aSlotNo]);
}



function GetSlotFnc(inSlotNo, inFuncNo) {
	var aSlotNo = inSlotNo;
	var aFuncNo = inFuncNo;

	if (inSlotNo > 3) {
		aSlotNo = 3;
	}

	if (aFuncNo > 28) {
		aFuncNo = 28;
	}


	return parseInt(LocFuncStatus[aSlotNo][aFuncNo]);
}

function GetSlotFncW(inSlotNo, inFuncNo) {
	var aSlotNo = inSlotNo;

	if (inSlotNo > 3) {
		aSlotNo = 3;
	}

	var aFuncStatus = 0;

	for (var i = 0; i <= 28; i++) {
		aFuncStatus = aFuncStatus + (parseInt(LocFuncStatus[aSlotNo][i]) << i);
	}

	return aFuncStatus;
}

function CommandGetAccStatus(inAccAddr) {
	if (inAccAddr > 0) {
		return AccStatus[inAccAddr - 1];
	} else {
		return 0;
	}
}

function CommandGetAccStatusW(inAccAddr) {
	if (inAccAddr > 0) {
		var aStatus = 0;

		for (var i = 0; i < 16; i++) {
			aStatus = aStatus + (AccStatus[inAccAddr - 1 + i] << i);
		}

		return aStatus;
	} else {
		return 0;
	}
}

function CommandPower(inPon) {


	var url = GetUrl() + "PW(" + inPon + ")";

	$.get(url, function (data) {});
}

function CommandGetS88() {

	gS88On = 1;

	var url = GetUrl() + "gS8(1)";

	$.get(url, function (data) {});
}

function CommandGetS88Data(inNo) {

	var aNo = inNo - 1;

	if (inNo <= 0) {
		aNo = 1;
	}

	if (inNo > 16) {
		aNo = 16;
	}

	//inNo=0-15
	return (gS88Data[0] >> aNo) % 2;
}

function CommandGetS88Word(inNo) {

	var aNo = inNo;

	if (inNo <= 0) {
		aNo = 0;
	}

	if (inNo > 1) {
		aNo = 1;
	}

	//inNo=0-15
	return gS88Data[aNo];
}


function CommandLocFunction(inLocAddr, inFuncNo, inOnOff) {
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "FN(" + aLocAddr + "," + inFuncNo + "," + inOnOff + ")";


	$.get(url, function (data) {});
}

function CommandLocDirection(inLocAddr, inFwd) {
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "DI(" + aLocAddr + "," + inFwd + ")";

	$.get(url, function (data) {});
}

function CommandLocSpeed(inLocAddr, inSpeed) {
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var aSpeed = Math.trunc(inSpeed  * 1023 / 100);
	var url = GetUrl() + "SP(" + aLocAddr + "," + aSpeed + ",2)";

	$.get(url, function (data) {});
}

function CommandTurnout(inAccAddr, inOnOff) {
	var aAccAddr = parseInt(AccProtocol) + inAccAddr;
	var url = GetUrl() + "TO(" + aAccAddr + "," + inOnOff + ")";

	$.get(url, function (data) {});
}

function ANA_Speed(inSpeed) {
	
	ANA_LocSpeed = inSpeed;
	
	var url = GetUrl() + "DC(" + inSpeed + "," + ANA_Direction + ")";
	$.get(url, function (data) {});

}

function ANA_Fwd(inMode) {

	if (ANA_Direction != inMode) {
		ANA_LocSpeed = 0;
		ANA_Direction = inMode;
	}
}


function GetDSairStatus() {
	var url = "/command.cgi?op=130&ADDR=128&LEN=264";

	$.get(url, function (data) {
		g_RecvStatus = data;
	});
}

function DecoSay(inText)
{
	if( inText == "!")
	{
		//Show Deco
		DecoShow(1);
		
		//Deco talks
		$('#deco_excr').show();
		
		gDisplayDecoEx = 8;
	
	}
	else
	{
		//Show Deco
		DecoShow(1);
		
		//Deco talks
		$('#deco_talk').show();
		
		var canvas = document.getElementById('deco_talk');
		
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			
		    //Clear
			ctx.clearRect(0, 0, 200, 100);
			
			ctx.font = "bold 16px 'verdana'";
			
			//Position adjustment
			
			var x = 0;
			var y = 0;
			
			var metrics = ctx.measureText(inText);
			
			if( metrics.width < 120)
			{
				x = (200 - metrics.width) / 2;
				y = 45;
				ctx.fillText(inText, x, y);
			}
			else
			{
				x = 40;
				y = 40;
				
				var lineWidth = 0;	// 行の高さ (フォントサイズに対する倍率)			
				var lineHeight = 0;	// 行の高さ (フォントサイズに対する倍率)			
				
				// 1文字ずつ描画
				for( var i = 0; i < inText.length; i++ ) {
					
					metrics = ctx.measureText(inText[i]);
					
					if( (lineWidth + metrics.width) > 120)
					{
						lineHeight += 16;
						lineWidth = 0;
						
						if( lineHeight >= 32)
						{
							lineWidth = 32;
						}
						else if( lineHeight > 48)
						{
							break;
						}
					}
					
					ctx.fillText( inText[i], x + lineWidth, y + lineHeight );
					
					lineWidth += metrics.width;
				}
			}
			
			
			
		}
	
		gDisplayDeco = 5;
	}
	
}

function DecoSay_close()
{
	//Deco talks
	$('#deco_talk').hide();
	$('#deco_excr').hide();
	
	gDisplayDecoEx = 0;
	gDisplayDeco = 0;

}

function DecoShow(inShow)
{
	//Deco shown
	
	if( inShow == 0)
	{
		DecoSay_close();
		$('#deco').css('background-image', 'none');
		$('#deco').hide();
	}
	else
	{
		$('#deco').show();
		$('#deco').css('background-image', 'url(/SD_WLAN/block/img/deco.png)');
		$('#deco_talk').hide();
		$('#deco_talk').css('background-image', 'url(/SD_WLAN/block/img/deco_talk.png)');
		$('#deco_excr').hide();
		$('#deco_excr').css('background-image', 'url(/SD_WLAN/block/img/deco_excr.png)');
	}
}


$(function () {
	
	DecoShow(0);
	
	setInterval(function () {
		
		/* Deco showing */
		if( gDisplayDeco > 0)
		{
			
			if( gDisplayDeco == 1)
			{
				DecoSay_close();
				
				gDisplayDeco = 0;
			}
			else
			{
				if( (gDisplayDeco % 2) == 0)
				{
					$("#deco_talk").css("top", 72);
					$("#deco_talk").css("right", 225);
				}
				else
				{
					$("#deco_talk").css("top", 74);
					$("#deco_talk").css("right", 222);
				}
				
				gDisplayDeco--;
			}
		}
		
		/* Deco showing(! mark) */
		if( gDisplayDecoEx > 0)
		{
			
			if( gDisplayDecoEx == 1)
			{
				$('#deco_excr').hide();
				
				gDisplayDecoEx = 0;
			}
			else
			{
				if( (gDisplayDecoEx % 2) == 0)
				{
					$("#deco_excr").css("top", 72);
					$("#deco_excr").css("right", 225);
				}
				else
				{
					$("#deco_excr").css("top", 75);
					$("#deco_excr").css("right", 230);
				}
				
				gDisplayDecoEx--;
			}
		}		
		
		
		//get reply dsair2 message
		GetDSairStatus();

		var aReplyStrArray = g_RecvStatus.split(";");

		//DSair reply message
		if (aReplyStrArray.length <= 1) {
			return;
		}

		var aPrmStrArray = aReplyStrArray[0].split(",");

		if (aPrmStrArray.length == 0) {
			return;
		}

		if (gIntervalTimeout > 0) {
			gIntervalTimeout--;
		} else {
			var aPower = aPrmStrArray[0];

			if (aPower != "") {

				var aPower_Num = 0;

				if (aPower == "Y") {
					aPower_Num = 1;
				}

				if (aPower_Num != PowerStatus) {
					PowerStatus = aPower_Num;
					
					//Power On display
					DisplayStatus();
				}
			}
		}

		//N,2,0,0,043,06,0
		gTextVolt =  String(Number(aPrmStrArray[4]) / 10) + "[V]";
		gTextCurrent = String(Number(aPrmStrArray[5]) / 10) + "[A]";
		gTextPower = (aPrmStrArray[0] == "Y" ? "ON" : "OFF");
		gTextFirmver = aPrmStrArray[2] + " / " + webapp_ver;
		gTextError = DEVICE_ErrorString(Number(aPrmStrArray[1]));
		gTextHardver = DEVICE_HWnameString(Number(aPrmStrArray[6]));
		gTextSeqno = aPrmStrArray[7];


		if (gS88On == 1) {
			gS88Max = parseInt(aPrmStrArray[8].substr(0, 1));

			for (var k = 0; k < 2; k++) {
				var aWords = aPrmStrArray[8].substr(k * 4 + 1, 4);
				gS88Data[k] = parseInt(aWords[2] + aWords[3] + aWords[0] + aWords[1], 16);
			}

			//$(status_s88).text("S88 data: " + aPrmStrArray[8]);

			var strS88Data = "";

			for (var k = 0; k < 16; k++) {
				strS88Data = strS88Data + " " + ((gS88Data[0] >> k) % 2).toString();
			}

			gTextS88Status = strS88Data; //("S88 data: (1-> )" + strS88Data + "( <-16)");
			
			DisplayStatus();
			
		} else {
			gTextS88Status = "N/A";//$(status_s88).text("S88 data: (N/A. run s88start on BASIC)");
		}

		gStatus_Msg = aReplyStrArray[1];
		gStatus_ACCData = aReplyStrArray[2];


		//CV Information
		var aCvStrArray = aReplyStrArray[1].split(",");

		if ((Number(aCvStrArray[1]) != 0) && (aCvStrArray.length > 1)) {
			gReadCVNo = Number(aCvStrArray[1]);
			gReadCVVal = Number(aCvStrArray[2]);

		} else {

		}


		//���쒆�ő��삵������́A4���񂵂���

		if (IntervalUpdateLimit_ACC > 0) {
			IntervalUpdateLimit_ACC--;
		} else {
			var aAccIndex = 0;
			var aAccChangedCounter = 0;

			for (var k = 0; k < 32; k++) {
				var aWords = aReplyStrArray[2].substr(k * 2, 2);
				var aAccBits = parseInt(aWords[1] + aWords[0], 16);

				for (var l = 0; l < 8; l++) {
					if ((aAccBits % 2) == 1) {
						if (AccStatus[aAccIndex] != 1) {
							aAccChangedCounter++;
							AccStatus[aAccIndex] = 1;
						}
					} else {
						if (AccStatus[aAccIndex] != 0) {
							aAccChangedCounter++;
							AccStatus[aAccIndex] = 0;
						}
					}

					aAccBits = Math.floor(aAccBits / 2);
					aAccIndex++;
				}
			}

		}
		

		//console.log(g_RecvStatusRaw);

	}, 500);


});


DisplayStatus();

function DisplayStatus()
{
	var canvas = document.getElementById('statusview');
	if (canvas.getContext){
	    var ctx = canvas.getContext('2d');
	    
	    //Clear
		ctx.clearRect(0, 0, 50, 160);
		
		ctx.fillStyle = "rgba(50, 50, 50, 0.03)";
		ctx.fillRect(4, 0, 50, 160);
		
	    // パスをリセット
		ctx.beginPath () ;
		ctx.arc( 30, 12, 8, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
		
		if( PowerStatus == 1)
		{
			ctx.fillStyle = "rgba(255,0,0,0.8)" ;
		}
		else
		{
			ctx.fillStyle = "rgba(160,160,160,0.8)" ;
		}
		
		ctx.fill() ;
		ctx.fillStyle = "#000000";
		ctx.font = "bold 16px 'verdana'";
		
		//S88 Status
		ctx.font = "bold 8px 'verdana'";
		
		var w = 0;
		
		for( var k = 0; k < 16; k++)
		{
			
			ctx.beginPath () ;
			ctx.arc( 20, 30 + k * 8 , 3, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
			
			if (gS88On == 1) 
			{
				if( ((gS88Data[0] >> k) & 1) == 0)
				{
					ctx.fillStyle = "rgba(255,0,0,0.8)" ;
				}
				else
				{
					ctx.fillStyle = "rgba(60,200,60,0.8)" ;
				}
			}
			else
			{
				ctx.fillStyle = "rgba(160,160,160,0.8)" ;
			}
			
			
			ctx.fill() ;
			ctx.fillStyle = "#000000";
			ctx.fillText( (k + 1).toString(), 30, 33 + k * 8);
		}
		

	}
}
