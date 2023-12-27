var webapp_ver = "r3.1(Feb 20,2021)";


var UrlGateway = "";
var gIntervalTimeout = 0;

var gTabSelectedIndex = 0;

/* 機関車関係 */
var LocAddr = 3;
var LocSpeed = [0, 0, 0, 0];
var LocDirReverse = [0, 0, 0, 0];
var LocProtocol = 0;
var LocSpeedStep = 2;
var LocFuncStatus = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var LocDir = ["FWD", "FWD", "FWD", "FWD"];
var LastUpdateTime = 0;
var LastUpdateSpeed = 0;
var LastLocSpeed = [0, 0, 0, 0];
var LocMeterMaxSpeed = 240;
var LocMeterMotionSpeed = 1;
var gLastSpeed = 0;

//ATC Meter Function
var gATCSpeed = -1;// -1 is No displayed
var gATCSpeedLast = -1;
var gATCSpeedStop = -1;
var gATCStopTimer = 0;
var gATCStopTimerMax = 0;

var gReadCVNo = 0;
var gReadCVVal = 0;

/* S88 �Z���T */
var gS88Max = 0;
var gS88Data = [0,0,0,0];
var gS88On = 0;


//���[�^�[�֌W

var ATCSpeed = -1;

/* アクセサリ関係 */
var AccPageNo = 0;
var AccStatus = new Array(2044, 0);
var AccTypes = new Array(2044, 0); //�\���ݒ�
var Map_AccAddr = new Array(100 * 50);
var Map_Image = new Array(100 * 50);
var Map_Width = 100;
var Map_Height = 50;
var AccProtocol = 14335;
var PowerStatus = 0;
var CenterX = 0;
var CenterY = 0;
var modeAccEdit = 0;//0: ���샂�[�h, 1:�A�N�Z�T���A�C�R���ҏW���[�h

var stateMeterMoving = 0;

var modeLocIndex = 0;
var modeDblHeading = 0;
var IntervalUpdateLimit = 0;
var IntervalUpdateLimit_ACC = 0;

var imgObjArry = [];
var dblLocArray = [];
var DblAddrLabel = "3";

var gRaicomOn = 0;
var gDSjoyOn = 0;





dblLocArray[0] = 3;

for( var i = 0; i< 2044; i++)
{
    AccTypes[i] = 0;
    AccStatus[i] = 0;
}


$(function () {

    $("input[type=submit], a, button")
        .button()
        .click(function (event) {
            event.preventDefault();
        });
});

$(function () {

    $("#getvalue").click(function () {
        alert(spinner.spinner("value"));
    });
    $("#setvalue").click(function () {
        spinner.spinner("value", 5);
    });
    $("button").button();

    $( "#dialogMsg" ).dialog({ autoOpen: false });
    $( "#dialogCVInfo" ).dialog({ autoOpen: false });


});

$(function () {
    setVisibleItems(0);


    onSelectProtocol_boot();
    
    //Load from LocalStorage
    STORE_Init();
    
    

});


function OnRailcom()
{
    if( gRaicomOn == 0)
    {
       gRaicomOn = 1;
    }
    else
    {
       gRaicomOn = 0;
    }
    
    SendRailCom(gRaicomOn);
}

function SendRailCom(inRailComFlag)
{

    if( gRaicomOn == 1)
    {
       $("#RailcomCfg").text("Disable Railcom");
    }
    else
    {
       $("#RailcomCfg").text("Enable Railcom");
    }

    var url = GetUrl() + "CO(" + gRaicomOn + ")";
    $.get(url, function (data) {}); 

}

function OnDSjoy()
{
    
    if( gDSjoyOn == 0)
    {
       gDSjoyOn = 1;
       $("#DSjoyCfg").text("Scanning S88");

       var url = GetUrl() + "gS8(1)";
       $.get(url, function (data) {});       
    }
    else
    {

    }
        
}

function setVisibleItems(inOnSwitch) {

       $(function () {
    if (inOnSwitch == 0) {
        PowerStatus = 0;
      
        
        
    } else {
        PowerStatus = 1;
       
    }
      });

}

function onSelectProtocol_boot() {
    if ($("[name=radio_loc]:checked").val() == 1) {
        //DCC
        LocProtocol = 49152;
        LocSpeedStep = 2;
    } else {
        //MM2
        LocProtocol = 0;
        LocSpeedStep = 0;
    }
}


function onSelectProtocol() {

    onSelectProtocol_boot();

    STORE_Save_ProtcolLoc();

}

function onSelectAccProtocol() {
    if ($("[name=radio_acc]:checked").val() == 1) {
        //DCC
        AccProtocol = 14335;
    } else {
        //MM2
        AccProtocol = 12287;
    }

    STORE_Save_ProtcolAcc();

}

function GetUrl() {
    
    return "/command.cgi?op=131&ADDR=0&LEN=64&DATA=";

}


function onClickFunction(inFuncNo) {
    aOnOff = LocFuncStatus[modeLocIndex][inFuncNo];

    if (aOnOff == 1) {
        aOnOff = 0;
    } else {
        aOnOff = 1;
    }

    LocFuncStatus[modeLocIndex][inFuncNo] = aOnOff;


    var selectVal = modeLocIndex;

    if (selectVal >= dblLocArray.length) {
        selectVal = 0;
    }


    var aLocAddr = parseInt(LocProtocol) + parseInt(dblLocArray[parseInt(selectVal)]);
    
	var url = GetUrl() + "FN(" + aLocAddr + "," + inFuncNo + "," + aOnOff + ")";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

	$.get(url, function (data) {});
    
}

function GetSlotAdress(inSlotNo)
{
	var aSlotNo = inSlotNo;
	
	if( inSlotNo > 3)
	{
		aSlotNo = 3;
	}
	
	return parseInt(dblLocArray[aSlotNo]);
	
}

function GetSlotSpeed(inSlotNo)
{
	var aSlotNo = inSlotNo;
	
	if( inSlotNo > 3)
	{
		aSlotNo = 3;
	}
	
	return parseInt(LocSpeed[aSlotNo]);
}

function GetSlotFnc(inSlotNo,inFuncNo)
{
	var aSlotNo = inSlotNo;
	var aFuncNo = inFuncNo;
	
	if( inSlotNo > 3)
	{
		aSlotNo = 3;
	}
	
	if( aFuncNo > 28)
	{
		aFuncNo = 28;
	}
	
	
	return parseInt(LocFuncStatus[aSlotNo][aFuncNo]);
}

function GetSlotFncW(inSlotNo,inFuncNo)
{
	var aSlotNo = inSlotNo;
	
	if( inSlotNo > 3)
	{
		aSlotNo = 3;
	}
	
	var aFuncStatus = 0;
	
	for( var i = 0; i <= 28; i++)
	{
		aFuncStatus = aFuncStatus + (parseInt(LocFuncStatus[aSlotNo][i]) << i);
	}
	
	return aFuncStatus;
}

function CommandGetAccStatus(inAccAddr)
{
	if( inAccAddr > 0)
	{
		return AccStatus[inAccAddr - 1];
	}
	else
	{
		return 0;
	}
}

function CommandGetAccStatusW(inAccAddr)
{
	if( inAccAddr > 0)
	{
		var aStatus = 0;
		
		for( var i = 0; i < 16; i++)
		{
			aStatus = aStatus + (AccStatus[inAccAddr - 1 + i] << i);
		}
		
		return aStatus;
	}
	else
	{
		return 0;
	}
}

function CommandGetS88() {
    
    gS88On = 1;
    
    var url = GetUrl() + "gS8(1)";

    $.get(url, function (data) {});
}

function CommandGetS88Data(inNo) {
	
	var aNo = inNo - 1;
	
	if( inNo <= 0)
	{
		aNo = 1;
	}
	
	if( inNo > 16)
	{
		aNo = 16;
	}
	
	//inNo=0-15
	return (gS88Data[0] >> aNo) % 2;
}

function CommandGetS88Word(inNo) {
	
	var aNo = inNo;
	
	if( inNo <= 0)
	{
		aNo = 0;
	}
	
	if( inNo > 1)
	{
		aNo = 1;
	}
	
	//inNo=0-15
	return gS88Data[aNo];
}


function CommandLocFunction(inLocAddr, inFuncNo, inOnOff)
{
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "FN(" + aLocAddr + "," + inFuncNo + "," + inOnOff + ")";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

	$.get(url, function (data) {});
}

function CommandLocDirection(inLocAddr, inFwd)
{
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "DI(" + aLocAddr + "," + inFwd + ")";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

	$.get(url, function (data) {});
}

function CommandLocSpeed(inLocAddr, inSpeed)
{
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "SP(" + aLocAddr + "," + inSpeed + ",2)";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
	IntervalUpdateLimit = 8;

	$.get(url, function (data) {});
}

function CommandTurnout(inAccAddr, inOnOff)
{
	var aAccAddr = parseInt(AccProtocol) + inAccAddr;
	var url = GetUrl() + "TO(" + aAccAddr + "," + inOnOff + ")";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit_ACC = 8;

	$.get(url, function (data) {});
}



function onClickStop() {

	if( modeDblHeading == 1)
	{
	    //������~
	    LocSpeed[0] = 0;
	    LocSpeed[1] = 0;
	    LocSpeed[2] = 0;
	    LocSpeed[3] = 0;
    }

    ROBOT_Cancel();
	CAB_Free();
    onChangeSpeed(0);
    
    //�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

}

function onClickFwd(inFwd, inRobotControl) {

    var aLocAddr = "";
    var aLocAddr_rev = "";
    var aFWD = inFwd;
    var aFWD_rev = reverseDir(inFwd);

    if (modeDblHeading == 0) {
        //1
        aLocAddr = parseInt(LocProtocol) + parseInt(dblLocArray[modeLocIndex]);

        if (LocDirReverse[modeLocIndex] == 1) {
            aFWD = aFWD_rev;
        }

    } else {
        //�d�A
        for (var i = 0; i < dblLocArray.length; i++) {
            var aTempLocAddr = parseInt(LocProtocol) + parseInt(dblLocArray[i]);

            if (LocDirReverse[i] == 1) {
                aLocAddr_rev = aLocAddr_rev + aTempLocAddr;

                aLocAddr_rev = aLocAddr_rev + "/";
            } else {
                aLocAddr = aLocAddr + aTempLocAddr;

                if ((i + 1) < dblLocArray.length) {
                    aLocAddr = aLocAddr + "/";
                }
            }
        }
    }

    if ($.isNumeric(aLocAddr) == false) {
        if (aLocAddr.lastIndexOf("/") == 1) {
            aLocAddr = aLocAddr.substr(0, aLocAddr.length - 1);
        }
    }

    if ($.isNumeric(aLocAddr_rev) == false) {
        if (aLocAddr_rev.lastIndexOf("/") == 1) {
            aLocAddr_rev = aLocAddr_rev.substr(0, aLocAddr_rev.length - 1);
        }
    }

    //�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

    /*�[�����ɂ��Ă��瑗�M*/
    var url = GetUrl() + "DI(" + aLocAddr + "," + aFWD + ")";

    $.get(url, function (data) {});

    if (aLocAddr_rev != "") {
        setTimeout(function () {
            var url = GetUrl() + "DI(" + aLocAddr_rev + "," + aFWD_rev + ")";
            $.get(url, function (data) {});
        }, 500);
    }

    /* ���x������~���\���؂�ւ�*/
    if ((inFwd == 2) && (LocDir[modeLocIndex] == "FWD")) {
        LocDir[modeLocIndex] = "REV";
        LocSpeed[modeLocIndex] = 0;
        onDrawMeter(40);
    } else if ((inFwd == 1) && (LocDir[modeLocIndex] == "REV")) {
        LocDir[modeLocIndex] = "FWD";
        LocSpeed[modeLocIndex] = 0;
        onDrawMeter(40);
    }
}


function onChangeSpeed(inSpeed) {
    LocSpeed[modeLocIndex] = inSpeed;
    var aLocAddr = "";

    if (modeDblHeading == 0) {
        //1
        aLocAddr = parseInt(LocProtocol) + parseInt(dblLocArray[modeLocIndex]);

    } else {
        //�d�A
        for (var i = 0; i < dblLocArray.length; i++) {
            var aTempLocAddr = parseInt(LocProtocol) + parseInt(dblLocArray[i]);
            aLocAddr = aLocAddr + aTempLocAddr;

            if ((i + 1) < dblLocArray.length) {
                aLocAddr = aLocAddr + "/";
            }
        }
    }

    //�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;

    //Track commands

    var url = GetUrl() + "SP(" + aLocAddr + "," + inSpeed + "," + LocSpeedStep + ")";
    $.get(url, function (data) {});

    /*�\���؂�ւ�*/
    onDrawMeter(40);
    
    gLastSpeed = inSpeed;
}

function ChangeAcc(inNo) {

    var aOnOff = AccStatus[inNo];

    if (aOnOff == 1) {
        aOnOff = 0;
    } else {
        aOnOff = 1;
    }

    //�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit_ACC = 8;

    AccStatus[inNo] = aOnOff;
    var aAccAddr = parseInt(AccProtocol) + inNo + 1;
    var url = GetUrl() + "TO(" + aAccAddr + "," + aOnOff + ")";

    $.get(url, function (data) {});

}

function CommandAccControl(inAddr, inOnOff) {

    AccStatus[inAddr] = Number(inOnOff);

    let aAccAddr = inAddr + parseInt(AccProtocol) + 1;
    var url = GetUrl() + "TO(" + aAccAddr + "," + inOnOff + ")";

    $.get(url, function (data) {});
    
    //Draw
    DrawAccPanel();
    DrawLayoutPanel();

}


function writePing() {
    
    var url = GetUrl() + "PG()";
    console.log(url);

    $.get(url, function (data) {});
}

function onClickPon(inPon) {

    
    var url = GetUrl() + "PW(" + inPon + ")";

    $.get(url, function (data) {});

    gIntervalTimeout = 8;
    
    setVisibleItems(inPon);
    
    DEVICE_Vibrate();

}

// Canvas�`�揈��
function onDrawMeter(inScale) {

    drawMeter(LocSpeed[modeLocIndex], inScale);

}



// �j��[�̍��W�擾
var cPoint = function (center, hookLength, radian) {
    return {
        x: center.x + hookLength * Math.cos(radian),
        y: center.y + hookLength * Math.sin(radian)
    };
}

function onTouchCanvas(e) {

    e.preventDefault();

    var touchObject = e.changedTouches[0];
    var touchX = touchObject.pageX;
    var touchY = touchObject.pageY;

    // �v�f�̈ʒu���擾
    var clientRect = e.target.getBoundingClientRect();
    var positionX = clientRect.left + window.pageXOffset;
    var positionY = clientRect.top + window.pageYOffset;

    // �v�f���ɂ�����^�b�`�ʒu���v�Z
    var x = touchX - positionX;
    var y = touchY - positionY;

    var rx = x - CenterX;
    var ry = y - CenterY;

    var aTempSpeed = CalcSpeedMeter(rx, ry);
    
    CAB_UpdateSpeed(aTempSpeed);

}

function CAB_UpdateSpeed(inSpeed)
{
	
	if( inSpeed == null)
	{
		return;
	}
	
	//��񗈂�̂�h�~
	//�딽���h�~�̂��߂�������폜
	if(( inSpeed == LastUpdateSpeed) && ( CAB_SpeedDelayOn == 1))
	{
		return;
	}
	
	LastUpdateSpeed = inSpeed;
	
	//������
	if( CAB_SpeedDelayOn == 1)
	{
		//�X���[�ŏ㉺����
		if( CAB_SpeedDelayTime == 0)
		{
			CAB_LocSpeed = inSpeed;
			CAB_LocSpeedLast = LocSpeed[modeLocIndex];
			
			var aHofTime = 45000;
			
			switch(LocMeterMotionSpeed)
			{
				case '0':
					aHofTime = 30000;//30sec
					break;
				case '1':
					aHofTime = 45000;//45sec
					break;
				case '2':
					aHofTime = 60000;//60sec
					break;
				case '3':
					aHofTime = 90000;//90sec
					break;
			}
			
			
			//Speed Delay Start
			CAB_SpeedDelaySpeed2 = CAB_LocSpeed;
			CAB_SpeedDelaySpeed1 = CAB_LocSpeedLast;
			CAB_SpeedDelaySpeedTemp = CAB_LocSpeedLast;
			CAB_SpeedDelayTime = Math.abs(CAB_LocSpeed - CAB_LocSpeedLast) * aHofTime / 1023;//0->max speed == 30sec
			CAB_SpeedDelayDiff = (CAB_LocSpeed - CAB_LocSpeedLast)* 111 / CAB_SpeedDelayTime;
			CAB_DelayInterval = setInterval('CAB_DelaySpeedProgress()',111);
			CAB_SpeedDelaySpeedCnt = 1;
			
			ATCSpeed = CAB_LocSpeed;
		}
		else
		{
			//�������������̏ꍇ�͋�������
			CAB_Deactivate();
		}
	}
	else
	{
		var date = new Date();
		
		LocSpeed[modeLocIndex] = inSpeed;

		if (Math.abs(date.getTime() - LastUpdateTime) >= 333) {
		    if (LastLocSpeed[modeLocIndex] != LocSpeed[modeLocIndex]) {
		        //�O����500ms�o�ߎ�
		        onChangeSpeed(LocSpeed[modeLocIndex]);
		        LastLocSpeed[modeLocIndex] = LocSpeed[modeLocIndex];
		    }

		    LastUpdateTime = date.getTime();
		} else {
		    /*�\���̂݁i���x�𑗐M���Ȃ��j*/
		    onDrawMeter(40);
		}
	}
}



function onTouchCanvasDown(e) {

    if (PowerStatus == 0) {
        return;
    } else {
        LastUpdateTime = 0;
        LastLocSpeed[modeLocIndex] = -1;
        stateMeterMoving = 1;
        onTouchCanvas(e);
    }
}

function onTouchCanvasMove(e) {

    if (stateMeterMoving == 0) {
        return;
    } else {
        onTouchCanvas(e);
    }
}

function onTouchCanvasUp(e) {

    if (PowerStatus == 0) {
        return;
    } else {
        LastUpdateTime = 0;
        LastLocSpeed[modeLocIndex] = -1;
        stateMeterMoving = 0;
        onTouchCanvas(e);
        
        //�Ō�ɔ��f
        ROBOT_Cancel();
        onChangeSpeed(LocSpeed[modeLocIndex]);
        
    }
}


function onClickCanvas(e) {

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var rx = x - CenterX;
    var ry = y - CenterY;
    
    var aTempSpeed = CalcSpeedMeter(rx, ry);
    
    CAB_UpdateSpeed(aTempSpeed);

}

function onClickCanvasDown(e) {


    if (PowerStatus == 0) {
        return;
    } else {
        LastUpdateTime = 0;
        LastLocSpeed[modeLocIndex] = -1;
        stateMeterMoving = 1;
        onClickCanvas(e);
    }
}

function onClickCanvasMove(e) {

    if (stateMeterMoving == 0) {
        return;
    } else {
        onClickCanvas(e);
    }
}

function onClickCanvasUp(e) {

    if (PowerStatus == 0) {
        return;
    } else {
        LastUpdateTime = 0;
        LastLocSpeed[modeLocIndex] = -1;
        stateMeterMoving = 0;
        onClickCanvas(e);
        
        //�Ō�ɔ��f
        ROBOT_Cancel();
        onChangeSpeed(LocSpeed[modeLocIndex]);
    }
}




var isTouch = ('ontouchstart' in window);

$('#accCanvas').bind({
    'touchstart mousedown': function (e) {
        e.preventDefault();
        this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
        this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);


    },
    'touchmove mousemove': function (e) {
        e.preventDefault();
    },
    'touchend mouseup': function (e) {}
});


function onConfigMaxSpeed() {

    LocMeterMaxSpeed = $("#maxspeed_slider").val();

    STORE_Save_MaxSpeed();
    
    //Background readraw
    drawMeterBackground(40);
    
    // Pin readraw
    onDrawMeter(40);
}

function onConfigMotionSpeed() {
	
	LocMeterMotionSpeed = $("#motionspeed_meter").val();
	
	STORE_Save_MotionSpeed();
		
}


function onSelectLoc() {

    modeLocIndex = $("[name=radio_adr]:checked").val();
	
	//�������������̏ꍇ�͋�������
	if( CAB_SpeedDelayOn == 1)
	{
		CAB_Deactivate();
	}

    //Cancel ROBOT mode
    ROBOT_Cancel();    

    //�t�@���N�V�����{�^����S�ĕύX����
	UpdateFunctionButtonsAll(modeLocIndex);
	
    $('#checkDirReverse').prop('checked', (LocDirReverse[modeLocIndex] == 1) ? true : false).change();


    //���[�^�[�\�����X�V
    onChangeSpeed(LocSpeed[modeLocIndex]);
}

function onSetAccEdit(){
    if (modeAccEdit == 0) {
        modeAccEdit = 1;
    } else {
        modeAccEdit = 0;

        //���샂�[�h�ɖ߂��Ƃ��ɕۑ�
        STORE_Save_TypeImagesAcc();
    }
}

function onSetDoubleHeading() {
    if (modeDblHeading == 0) {
        modeDblHeading = 1;
    } else {
        modeDblHeading = 0;
    }
}


function onSetDirReverse() {

    if (LocDirReverse[modeLocIndex] == 0) {
        LocDirReverse[modeLocIndex] = 1;
    } else {
        LocDirReverse[modeLocIndex] = 0;
    }
}


function reverseDir(inDir) {
    if (inDir == 1) {
        return 2;
    } else {
        return 1;
    }
}


$(function () {
    
    setInterval(function () {

        //�������Ԋm�F
        SHRAM_getStatus();

        var aReplyStrArray = g_RecvStatusRaw.split(";");
        
        //DSair�̋��L�������E�����t���[���f�[�^
        if( aReplyStrArray.length <= 1)
        {
            return;
        }                  
        
        var aPrmStrArray = aReplyStrArray[0].split(",");

        if( aPrmStrArray.length == 0)
        {
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
                    setVisibleItems(parseInt(aPower_Num));
                }
            }
        }

        //N,2,0,0,043,06,0
        //��ʂɕ\��
        $(status_volt).text("Track Voltage: " + String(Number(aPrmStrArray[4]) / 10) + "[V]") ;
        $(status_current).text("Out Current: " + String(Number(aPrmStrArray[5]) / 10) + "[A]");
        $(status_power).text("Track Power: " + (aPrmStrArray[0] == "Y" ? "ON" : "OFF"));
        $(status_firmver).text("Firmware: ver." + aPrmStrArray[2] + " / " + webapp_ver);
        $(status_error).text("Error: " + DEVICE_ErrorString(Number(aPrmStrArray[1])));
        $(status_hardver).text("Hardware: " + DEVICE_HWnameString(Number(aPrmStrArray[6])));
        $(status_seqno).text("Alive Seq: " + aPrmStrArray[7]);
        $(status_locs).text("WLAN Status: N/A");

        
        
        
        if( gS88On == 1)
        {
	        gS88Max = parseInt(aPrmStrArray[8].substr(0, 1));
	        
	        for( var k = 0; k < 2; k++)
	        {
	        	var aWords = aPrmStrArray[8].substr(k * 4 + 1, 4);
	        	gS88Data[k] = parseInt(aWords[2] + aWords[3] + aWords[0] + aWords[1], 16);
	        }
	        
	        //$(status_s88).text("S88 data: " + aPrmStrArray[8]);
	        
	        var strS88Data = "";
	        
	        for( var k = 0; k < 16; k++)
	        {
	        	strS88Data = strS88Data + " " + ((gS88Data[0] >> k) % 2).toString();
	        }
	        
	        $(status_s88).text("S88 data: (1-> )" + strS88Data + "( <-16)");
        }
        else
        {
	        $(status_s88).text("S88 data: (N/A. Enable S88)");
        }
      
        $(status_replymsg).text("Reply Msg: " + aReplyStrArray[1]);
        $(status_replyacc).text("Acc Datas: " + aReplyStrArray[2]);
        
        
        //�ǂݏo����CV�l
        
        
        var aCvStrArray = aReplyStrArray[1].split(",");
       
        if( (Number(aCvStrArray[1]) != 0) && (aCvStrArray.length > 1))
        {
            gReadCVNo = Number(aCvStrArray[1]);
            gReadCVVal = Number(aCvStrArray[2]);
            
        }
        else
        {
        	
        }
        
        //�|�C���g�f�[�^�̔z�M(32x8=256�|�C���g�f�[�^�B�A�h���X�͈͂͂P�`�Q�T�U
        //RawData: bf00000000000000000000000000000000000000000000000000000000000000
        
		//���쒆�ő��삵������́A4���񂵂���
		
		if( IntervalUpdateLimit_ACC > 0)
		{
			IntervalUpdateLimit_ACC--;
		}
		else
		{
	        var aAccIndex = 0;
	        var aAccChangedCounter = 0;
	        
	        for( var k = 0; k < 32; k++)
	        {
	        	var aWords = aReplyStrArray[2].substr(k * 2, 2);
	        	var aAccBits = parseInt(aWords[1] + aWords[0], 16);
	        	
	        	for( var l = 0; l < 8; l++)
	        	{
	        		if( (aAccBits % 2) == 1)
	        		{
	        			if( AccStatus[aAccIndex] != 1)
	        			{
	        				aAccChangedCounter++;
	        				AccStatus[aAccIndex] = 1;
	        			}
	        		}
	        		else
	        		{
	        			if( AccStatus[aAccIndex] != 0)
	        			{
	        				aAccChangedCounter++;
	        				AccStatus[aAccIndex] = 0;
	        			}
	        		}
	        		
	        		aAccBits = Math.floor(aAccBits / 2);
	        		aAccIndex++;
	        	}
	        }
	        
	        
	        if( aAccChangedCounter > 0)
	        {
	        	//�ĕ`��
    			DrawAccPanel();
	        	DrawLayoutPanel();
	        }
	        
        }
        
        //�@�֎Ԃ̔z�M�f�[�^�擾
        
        var aLocDistArrayRaw = aReplyStrArray[3].split("/");
        
        for( var i = 0; i < 8; i++)
        {
        	var aLocDistArrayList = aLocDistArrayRaw[i].split(",");
        	var aLocAddr = parseInt("0x" + aLocDistArrayList[0]);
        	var aLocSpd = parseInt("0x" + aLocDistArrayList[1]);
        	var aLocDir = (aLocDistArrayList[2] == "0") ? "FWD" : "REV";
        	var aLocFunc = parseInt("0x" + aLocDistArrayList[3]);
        	
        	if( aLocAddr == 0)
        	{
        		break;
        	}
        	
        	for( var j = 0; j < 4; j++)
        	{
            	if( aLocAddr == parseInt(LocProtocol) + parseInt(dblLocArray[j]))
            	{
            		if( j == modeLocIndex)
            		{
            			//���쒆�ő��삵������́A4���񂵂���
            			
            			if( IntervalUpdateLimit > 0)
            			{
            				IntervalUpdateLimit--;
            				break;
            			}
            		}
            		
            		var aMeterChanged = 0;
            		var aFuncChanged = 0;
            		
            		if( LocDir[j] != aLocDir)
            		{
            			aMeterChanged = 1;
            			LocDir[j] = aLocDir;
            		}
            		
            		if( (LocSpeed[j] / 4) != aLocSpd)
            		{
            			aMeterChanged = 1;
            			LocSpeed[j] = aLocSpd * 4;
            		}
            		
            		for( var k = 0; k < 29; k++)
            		{
            			
            			if( LocFuncStatus[j][k] != (aLocFunc >> k) & 1)
            			{
            				LocFuncStatus[j][k] = (aLocFunc >> k) & 1;
            				aFuncChanged = 1;
            			}
            		}
            		
            		
            		//�\�����̏ꍇ�͍X�V
            		if( j == modeLocIndex)
            		{
	            		if( aFuncChanged == 1)
	            		{
	            			UpdateFunctionButtonsAll(modeLocIndex);
	            		}
	            		
	            		if( aMeterChanged == 1)
	            		{
							onDrawMeter(40);
	            		}
	            		
            		}
            		
            		break;
            	}
        	}
        	
        }
        
        
        console.log(g_RecvStatusRaw);
        
    }, 500);

});