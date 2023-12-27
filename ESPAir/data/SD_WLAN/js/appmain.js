var webapp_ver = "r3.4(Mar,2022)";


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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

//レバー
let gLeverID_current = -990;

//安全関連
let LimitOutputCurrent = 99.0;


dblLocArray[0] = 3;

for( var i = 0; i< 2044; i++)
{
    AccTypes[i] = 0;
    AccStatus[i] = 0;
}

ClearMaps();


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
    $(".cbox").checkboxradio({});
    
    
    $('#checkbox_routedisable').click(function(){
        if( $(this).prop('checked') ){
            ROUTE_SetDisable(1);
        }else{
            ROUTE_SetDisable(0);
        }
    });    
    

    $( "#dialogAL" ).dialog({ autoOpen: false });
    $( "#dialogMsg" ).dialog({ autoOpen: false });
    $( "#dialogCVInfo" ).dialog({ autoOpen: false });
    $( "#dialogRoute" ).dialog({ autoOpen: false });

    /* jQuery �^�u�N���b�N�C�x���g */
    $("#tabcontrol li").click(function () {
        var num = $("#tabcontrol li").index(this);

        switch (num) {
            case 0:
                //onDraw(40);
                break;
            case 1:
                //DrawAccPanel();
                break;
            default:
                //�������Ȃ�	
                break;

        }



    });

});

$(function () {
    setVisibleItems(0);

    $( "#maxspeed_slider" ).selectmenu({
	    change: function (event, ui) {
	        onConfigMaxSpeed();
	    }
	});
    
    $( "#motionspeed_meter" ).selectmenu({
	    change: function (event, ui) {
	        onConfigMotionSpeed();
	    }
    });

    $( "#limitcurrent_slider" ).selectmenu({
	    change: function (event, ui) {
	        onConfigMaxCurrent();
	    }
	});

    onSelectProtocol_boot();
    $('#funcbox1').buttonset();
    $('#protcolset').buttonset();
    $("#protcolset_acc").buttonset();
    $('#addrselector').buttonset();

    $(radio_adr1_label).text("3");
    $(radio_adr2_label).text("-");
    $(radio_adr3_label).text("-");
    $(radio_adr4_label).text("-");

    $('input[type="checkbox"]').button();

	$("#tabcontrol" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	$("#tabcontrol li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	
    $("#tabcontrol").bind('tabsactivate', function(event, ui) {
	    gTabSelectedIndex = ui.newTab.index();
	    //console.log("TabIndex->" + gTabSelectedIndex);
    });    
    
    

    $(DblAddr).val("3");

    for (var i = 0; i < 512; i++) {
        AccStatus[i] = 0;
    }
    
    //Load from LocalStorage
    STORE_Init();
    
    
    
    //Background image drawing
    drawMeterBackground(40);


    $("#tabcontrol").bind('tabsactivate', function (event, ui) {

        switch (ui.newTab.index()) {
            case 0:
                onDrawMeter(40);
                break;
            case 1:
                DrawAccPanel();
                break;
            case 2:
                DrawLayoutTool();
                DrawLayoutPanel();
                break;
        }
    });
    
    
    onDrawMeter(40);
    
	toastr.options = {
	  "positionClass": "toast-bottom-center",
	  "timeOut": "3000",
	}; 
    

});

function OpenCVProgrammer()
{
	window.location.href = "/SD_WLAN/sp/bluebox.htm";
}

function OpenSPApp()
{
	window.location.href = "/SD_WLAN/sp/index.htm";
}

function OpenEduApp()
{
	window.location.href = "/SD_WLAN/block/index.html";
}

function OpenBasicApp()
{
	window.location.href = "/SD_WLAN/basic/index.htm";
}


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
    
    if( gS88On == 0)
    {
       $("#DSjoyCfg").text("Scanning S88");
       CommandGetS88(); 
    }
    else
    {

    }
        
}

function setVisibleItems(inOnSwitch) {

       $(function () {
    if (inOnSwitch == 0) {
        PowerStatus = 0;
        $("#powerOn").show('normal');
        $("#powerOff").hide('normal');
        $("#btnStop").attr('disabled', true);
        $("#btnRev").attr('disabled', true);
        $("#btnFwd").attr('disabled', true);
        $("#btnRobot").attr('disabled', true);

        
        //Analog
        $("#btnAnaFwd").removeAttr("disabled");
        $("#btnAnaRev").removeAttr("disabled");
        $("#AnaStopButton").removeAttr("disabled");
        $("#btnModeC1").removeAttr("disabled");
        $("#btnModeC2").removeAttr("disabled");
        $("#btnModeC3").removeAttr("disabled");
        
        
        
    } else {
        PowerStatus = 1;
        $("#powerOn").hide('normal');
        $("#powerOff").show('normal');
        $("#btnStop").removeAttr("disabled");
        $("#btnRev").removeAttr("disabled");
        $("#btnFwd").removeAttr("disabled");
        $("#btnRobot").removeAttr("disabled");
        
        //Analog
        $("#btnAnaFwd").attr('disabled', true);
        $("#btnAnaRev").attr('disabled', true);
        $("#AnaStopButton").attr('disabled', true);
        $("#btnModeC1").attr('disabled', true);
        $("#btnModeC2").attr('disabled', true);
        $("#btnModeC3").attr('disabled', true);
        ANA_Free();
        
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
    
    //Track commands
    ROBOT_LOG_FNC(0, inFuncNo, aOnOff);

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
	
	if( aFuncNo > 31)
	{
		aFuncNo = 31;
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
	
	for( var i = 0; i <= 36; i++)
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
    
    //Track commands
    ROBOT_LOG_FNC(0, inFuncNo, inOnOff);

	$.get(url, function (data) {});
}

function CommandLocDirection(inLocAddr, inFwd)
{
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "DI(" + aLocAddr + "," + inFwd + ")";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
    IntervalUpdateLimit = 8;
    
    //Track commands
    ROBOT_LOG_DIR(0, inFwd);    

	$.get(url, function (data) {});
}

function CommandLocSpeed(inLocAddr, inSpeed)
{
	var aLocAddr = parseInt(LocProtocol) + inLocAddr;
	var url = GetUrl() + "SP(" + aLocAddr + "," + inSpeed + ",2)";

	//�f�[�^�z�M�ɂ��A�b�v�f�[�g���ꎞ�}��
	IntervalUpdateLimit = 8;
    
    //Track commands
    ROBOT_LOG_SPD(0, inSpeed);    

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

    //Track commands
    ROBOT_LOG_DIR(0, inFwd);    

    //Cancel ROBOT mode
    if( inRobotControl == 0)
    {
        ROBOT_Cancel();
    }

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

    if( inSpeed < 0)
    {
        LocSpeed[modeLocIndex] = 0;
    }
    else if( inSpeed > 1023)
    {
        LocSpeed[modeLocIndex] = 1023;
    }
    else
    {
        LocSpeed[modeLocIndex] = inSpeed;
    }
    
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
    ROBOT_LOG_SPD(0, inSpeed);       

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

    //Teaching
    ROBOT_LOG_ACC(inNo, aOnOff); 
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

    //Cancel ROBOT mode
    ROBOT_Cancel();
    
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

function onLoad() {
    //�^�b�`�C�x���g�̒ǉ�
    var canvas = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", onClickCanvasDown);
    canvas.addEventListener("mousemove", onClickCanvasMove);
    canvas.addEventListener("mouseup", onClickCanvasUp);

    canvas.addEventListener("touchstart", onTouchCanvasDown);
    canvas.addEventListener("touchmove", onTouchCanvasMove);
    canvas.addEventListener("touchend", onTouchCanvasUp);


    onDrawMeter(40);
    DrawAccPanel();
    DrawLayoutTool();
    DrawLayoutPanel();
};


//Image Data register
var imageACC_LS = new Image();
imageACC_LS.src = "/SD_WLAN/c/acc/TURNOUT_LEFT_1.png";
var imageACC_LD = new Image();
imageACC_LD.src = "/SD_WLAN/c/acc/TURNOUT_LEFT_2.png";
var imageACC_RS = new Image();
imageACC_RS.src = "/SD_WLAN/c/acc/TURNOUT_RIGHT_1.png";
var imageACC_RD = new Image();
imageACC_RD.src = "/SD_WLAN/c/acc/TURNOUT_RIGHT_2.png";

var imageACC_DSSS = new Image();
imageACC_DSSS.src = "/SD_WLAN/c/acc/DBLSLIPSWITCH_1.png";
var imageACC_DSSD = new Image();
imageACC_DSSD.src = "/SD_WLAN/c/acc/DBLSLIPSWITCH_2.png";
var imageACC_371S = new Image();
imageACC_371S.src = "/SD_WLAN/c/acc/SIGNAL_76371_BLACK.png";
var imageACC_371D = new Image();
imageACC_371D.src = "/SD_WLAN/c/acc/SIGNAL_76371_RED.png";
var imageACC_391S = new Image();
imageACC_391S.src = "/SD_WLAN/c/acc/SIGNAL_76391_GREEN.png";
var imageACC_391D = new Image();
imageACC_391D.src = "/SD_WLAN/c/acc/SIGNAL_76391_RED.png";


function DrawAccPanel() {

    var canvas = document.getElementById("accCanvas");
    var cv = canvas.getContext("2d");

    canvas.addEventListener("mousedown", onClickAccCanvas);

    //cv.save();

    // ���[�^�[�w�i�̉~�`��
    cvSize = document.getElementById("accCanvas").getAttribute("width");
    cv.clearRect(0, 0, cvSize, cvSize);

    // Canvas�̐F�A�t�H���g
    cv.font = "16px 'arial'";

    // �|�C���g�\��
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 10; x++) {

            var xx = x * 90 + 1;
            var yy = y * 91 + 1;
            var index = (y + AccPageNo * 4) * 10 + x;

            cv.shadowBlur = 0;
            cv.fillStyle = '#EFEFEF';
            cv.strokeStyle = '#8F8F8F';
            cv.beginPath();
            cv.moveTo(xx, yy);
            cv.lineTo(xx + 80, yy);
            cv.lineTo(xx + 80, yy + 88);
            cv.lineTo(xx, yy + 88);
            cv.lineWidth = "1px";
            cv.lineCap = "round";
            cv.closePath();
            cv.fill();
            cv.stroke();

            // �O���f�[�V�����w��
            //
            //
            cv.shadowColor = '#9F9F9F';
            cv.shadowOffsetX = 0;
            cv.shadowOffsetY = 0;
            cv.shadowBlur = 8;


            var aImageNo = AccTypes[index] * 10 + AccStatus[index];

            //�ُ�n�̓f�t�H���g�\���ɂ���
            if (aImageNo > 51) {
                aImageNo = AccStatus[index];
            }

            switch (aImageNo) {
                case 0:
                    cv.beginPath();
                    cv.arc(xx + 40, yy + 55, 24, 0, Math.PI * 2, false);
                    cv.fillStyle = "red";
                    cv.fill();
                    break;

                case 1:
                    cv.beginPath();
                    cv.arc(xx + 40, yy + 55, 24, 0, Math.PI * 2, false);
                    cv.fillStyle = "green";
                    cv.fill();
                    break;
                case 10:
                    //left diverse
                    cv.drawImage(imageACC_LD, xx + 25, yy + 22, 32, 64);
                    break;
                case 11:
                    //left straight
                    cv.drawImage(imageACC_LS, xx + 25, yy + 22, 32, 64);
                    break;
                case 20:
                    //Right diverse
                    cv.drawImage(imageACC_RD, xx + 25, yy + 22, 32, 64);
                    break;
                case 21:
                    //Right straight
                    cv.drawImage(imageACC_RS, xx + 25, yy + 22, 32, 64);
                    break;
                case 30:
                    //Double slip diverse
                    cv.drawImage(imageACC_DSSD, xx + 25, yy + 22, 32, 64);
                    break;
                case 31:
                    //Double slip straight
                    cv.drawImage(imageACC_DSSS, xx + 25, yy + 22, 32, 64);
                    break;
                case 40:
                    //Signal diverse
                    cv.drawImage(imageACC_371D, xx + 25, yy + 22, 32, 64);
                    break;
                case 41:
                    //Signal straight
                    cv.drawImage(imageACC_371S, xx + 25, yy + 22, 32, 64);
                    break;
                case 50:
                    //Signal diverse
                    cv.drawImage(imageACC_391D, xx + 25, yy + 22, 32, 64);
                    break;
                case 51:
                    //Signal straight
                    cv.drawImage(imageACC_391S, xx + 25, yy + 22, 32, 64);
                    break;
            }

            cv.fillStyle = "#000000";
            cv.fillText(index + 1, xx + 5, yy + 20);
        }

    }




    //cv.restore();

};

function onClickAccPage(inPageCmd) {
    if (inPageCmd == 1) {
        AccPageNo++;
        if (AccPageNo > 50) {
        AccPageNo = 0;
    }

    } else {

        if( AccPageNo == 0)
        {
            AccPageNo = 50;
        }
        else
        {
            AccPageNo--;
        }
    }

    DrawAccPanel();

};

function onClickAccCanvas(e) {

    if ((PowerStatus == 0) && (modeAccEdit == 0)) {
        return;
    }

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xx = Math.floor(x / 90);
    var yy = Math.floor(y / 91);


    var index = (AccPageNo * 4 + yy) * 10 + xx;

    switch(modeAccEdit)
    {
        case 0:
           ChangeAcc(index);

           DrawLayoutPanel();
        break;

        case 1:
            if( AccTypes[index] < 5)
            {
                AccTypes[index] = AccTypes[index] + 1;
            }
            else
            {
                AccTypes[index] = 0;
            }
        break;
    }

    DrawAccPanel();


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

function onConfigMaxCurrent()
{
	LimitOutputCurrent = $("#limitcurrent_slider").val();
	
	STORE_Save_OutputCurentLimit();

}


function UpdateFunctionButtonsAll(inIndex)
{
    $("#check0").prop("checked", (LocFuncStatus[inIndex][0] == 1) ? true : false).change();
    $("#check1").prop("checked", (LocFuncStatus[inIndex][1] == 1) ? true : false).change();
    $("#check2").prop("checked", (LocFuncStatus[inIndex][2] == 1) ? true : false).change();
    $("#check3").prop("checked", (LocFuncStatus[inIndex][3] == 1) ? true : false).change();
    $("#check4").prop("checked", (LocFuncStatus[inIndex][4] == 1) ? true : false).change();
    $("#check5").prop("checked", (LocFuncStatus[inIndex][5] == 1) ? true : false).change();
    $("#check6").prop("checked", (LocFuncStatus[inIndex][6] == 1) ? true : false).change();
    $("#check7").prop("checked", (LocFuncStatus[inIndex][7] == 1) ? true : false).change();
    $("#check8").prop("checked", (LocFuncStatus[inIndex][8] == 1) ? true : false).change();
    $("#check9").prop("checked", (LocFuncStatus[inIndex][9] == 1) ? true : false).change();
    $("#check10").prop('checked', (LocFuncStatus[inIndex][10] == 1) ? true : false).change();
    $('#check11').prop('checked', (LocFuncStatus[inIndex][11] == 1) ? true : false).change();
    $('#check12').prop('checked', (LocFuncStatus[inIndex][12] == 1) ? true : false).change();
    $('#check13').prop('checked', (LocFuncStatus[inIndex][13] == 1) ? true : false).change();
    $('#check14').prop('checked', (LocFuncStatus[inIndex][14] == 1) ? true : false).change();
    $('#check15').prop('checked', (LocFuncStatus[inIndex][15] == 1) ? true : false).change();
    $('#check16').prop('checked', (LocFuncStatus[inIndex][16] == 1) ? true : false).change();
    $('#check17').prop('checked', (LocFuncStatus[inIndex][17] == 1) ? true : false).change();
    $('#check18').prop('checked', (LocFuncStatus[inIndex][18] == 1) ? true : false).change();
    $('#check19').prop('checked', (LocFuncStatus[inIndex][19] == 1) ? true : false).change();
    $('#check20').prop('checked', (LocFuncStatus[inIndex][20] == 1) ? true : false).change();
    $('#check21').prop('checked', (LocFuncStatus[inIndex][21] == 1) ? true : false).change();
    $('#check22').prop('checked', (LocFuncStatus[inIndex][22] == 1) ? true : false).change();
    $('#check23').prop('checked', (LocFuncStatus[inIndex][23] == 1) ? true : false).change();
    $('#check24').prop('checked', (LocFuncStatus[inIndex][24] == 1) ? true : false).change();
    $('#check25').prop('checked', (LocFuncStatus[inIndex][25] == 1) ? true : false).change();
    $('#check26').prop('checked', (LocFuncStatus[inIndex][26] == 1) ? true : false).change();
    $('#check27').prop('checked', (LocFuncStatus[inIndex][27] == 1) ? true : false).change();
    $('#check28').prop('checked', (LocFuncStatus[inIndex][28] == 1) ? true : false).change();
    $('#check29').prop('checked', (LocFuncStatus[inIndex][29] == 1) ? true : false).change();
    $('#check30').prop('checked', (LocFuncStatus[inIndex][30] == 1) ? true : false).change();
    $('#check31').prop('checked', (LocFuncStatus[inIndex][31] == 1) ? true : false).change();

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

    //Update Function button on off status
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

function onClickAddLoc() {

    //Set DblAddr to LocEditForm
    $(DblAddr).val(dblLocArray[modeLocIndex]);


    $(function () {
        $('p').css({
            'display': 'block'
        });
        $("#dialogAL").dialog({
            dialogClass: 'LocEditDlgClass',
            autoOpen: false,
            show: "fade",
            hide: "fade",
            width: 390,
            height: 470,
            modal: true,
            buttons: {
            }
        }).css("font-size", "1.5em");

        $("#dialogAL").dialog("open");
    });
}

$(function () {

    
    //アドレス編集画面のボタンイベント登録
    $("#NumEnter").click(function () {
        var aDblLocText = $(DblAddr).val();

        if (aDblLocText == "") {
            aDblLocText = "3";
        } else {

            let aNumLocAddr = Number(aDblLocText);

            if( aNumLocAddr > 10239)
            {
                aDblLocText = "10239";
            }
            else if(aNumLocAddr <= 0)
            {
                aDblLocText = "1";
            }
            else
            {
                aDblLocText = aNumLocAddr.toString();
            }
        }

        //�ϐ��ɃZ�b�g
        dblLocArray[modeLocIndex] = aDblLocText;
        
        if (modeLocIndex == 0) {
            $(radio_adr1_label).text(aDblLocText);
        }
        else if (modeLocIndex == 1) {
            $(radio_adr2_label).text(aDblLocText);
        }
        else if (modeLocIndex == 2) {
            $(radio_adr3_label).text(aDblLocText);
        }
        else if (modeLocIndex == 3) {
            $(radio_adr4_label).text(aDblLocText);
        }

        //�ۑ�
        STORE_Save_LocAddr();

        $("#dialogAL").dialog('close');          
    });

    $("#Num0").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "0");
    });

    $("#Num1").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "1");
    });
    
    $("#Num2").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "2");
    });

    $("#Num3").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "3");
    });        

    $("#Num4").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "4");
    });

    $("#Num5").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "5");
    });

    $("#Num6").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "6");
    });

    $("#Num7").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "7");
    });

    $("#Num8").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "8");
    });

    $("#Num9").click(function () {
        $("#DblAddr").val($("#DblAddr").val() + "9");
    });

    $("#NumBS").click(function () {
        let aAddr = $("#DblAddr").val();

        if( aAddr.length > 0)
        {
            $("#DblAddr").val(aAddr.substr(0,aAddr.length - 1 ));
        }            
    });

    $("#NumClear").click(function () {
        $("#DblAddr").val("");
    });
    



    //定周期実行
    setInterval(function () {

        let aUpdateLayout = 0;

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
        //DSair2 Status

        let aOutputCurrent = Number(aPrmStrArray[5]) / 10.0;
        let aDCVoltage = Number(aPrmStrArray[4]) / 10.0;



        $(status_volt).text("Track Voltage: " + String(aDCVoltage.toFixed(1))  + "[V]") ;
        $(status_current).text("Out Current: " + String(aOutputCurrent.toFixed(1)) + "[A]");
        $(status_power).text("Track Power: " + (aPrmStrArray[0] == "Y" ? "ON" : "OFF"));
        $(status_firmver).text("Firmware: ver." + aPrmStrArray[2] + " / " + webapp_ver);
        $(status_error).text("Error: " + DEVICE_ErrorString(Number(aPrmStrArray[1])));
        $(status_hardver).text("Hardware: " + DEVICE_HWnameString(Number(aPrmStrArray[6])));
        $(status_seqno).text("Alive Seq: " + aPrmStrArray[7]);
        $(status_locs).text("WLAN Status: N/A");

        $( "#status2_voltage" ).text(String(aDCVoltage.toFixed(1)));
        
        
 
        
        $("#status2_s88").text(gS88On == 1 ? "S88" : "");

        //Power on check
        if(PowerStatus == 1)
        {
            //Current
            $( "#status2_current" ).text(String(aOutputCurrent.toFixed(1)));       

            if(LimitOutputCurrent < aOutputCurrent)
            {
                //停止させる
                onClickPon(0);

                //停止のメッセージ
                toastr.info('SOC: Current limit protection ' + aOutputCurrent + 'A (max ' + LimitOutputCurrent + 'A)');
    
            }
            else if((LimitOutputCurrent * 0.9) < aOutputCurrent)
            {
                //まもなく保護が働くという警告
                
    
            }
            else
            {
                //何もない
            }

        }
        else
        {
            //Current
            $( "#status2_current" ).text("-");       
        }




        
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
        
        //Route変化
        if( ROUTE_UpdateRequired() > 0)
        {
            aUpdateLayout = 1;

            //S88を強制ON
            OnDSjoy();
        }


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

                aUpdateLayout = 1;

	        }
	        
        }

        //レイアウトを更新
        if( aUpdateLayout > 0)
        {
            DrawAccPanel();
            DrawLayoutPanel();
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
            		
            		for( var k = 0; k <= 36; k++)
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
    
    setInterval(function () {
       
        //Robot control
        ROBOT_main();

    }, 250);

});

function VisibleGamePadIcon(inOnOff)
{
	
	if( inOnOff == 0)
	{
		$( "#gamepadicon" ).hide();
	}
	else
	{
		$( "#gamepadicon" ).show();
	}
}


function SetGamePadIconInfo(inLeverID, inLeverIDText)
{
    $( "#gamepadicontext" ).text(inLeverIDText);

    //現在のレバー状態をこのモジュールでも受け取り
    gLeverID_current = inLeverID;

    if( inLeverID == -9)
    {
        //緊急停止
        onClickStop();
    }
   
}

function CalcSpeedRatio(inSpeed, inBorder)
{
    let aCalcSpeed = 1.0;

    if( inSpeed > inBorder)
    {
        aCalcSpeed = 1.0 - (inSpeed - inBorder) / (1024 - inBorder) / 4;
    }

    return aCalcSpeed;
}

//
setInterval(function () {

    if( (gLeverID_current != -990) && (PowerStatus == 1))
    {
        //定期更新
        let aCurrentSpeed = LocSpeed[modeLocIndex];

        switch(gLeverID_current)
        {
        case -9:
            aCurrentSpeed = 0;
            break;
        case -8:
            aCurrentSpeed = aCurrentSpeed - 36 * CalcSpeedRatio(aCurrentSpeed, 128);
            break;
        case -7:
            aCurrentSpeed = aCurrentSpeed - 32 * CalcSpeedRatio(aCurrentSpeed, 196);
            break;
        case -6:
            aCurrentSpeed = aCurrentSpeed - 28 * CalcSpeedRatio(aCurrentSpeed, 256);
            break;
        case -5:
            aCurrentSpeed = aCurrentSpeed - 24 * CalcSpeedRatio(aCurrentSpeed, 384);
            break;
        case -4:
            aCurrentSpeed = aCurrentSpeed - 20 * CalcSpeedRatio(aCurrentSpeed, 512);
            break;
        case -3:
            aCurrentSpeed = aCurrentSpeed - 16 * CalcSpeedRatio(aCurrentSpeed, 640);
            break;
        case -2:
            aCurrentSpeed = aCurrentSpeed - 10 * CalcSpeedRatio(aCurrentSpeed, 786);
            break;
        case -1:
            aCurrentSpeed = aCurrentSpeed - 6;
            break;
        case 0:
            break;                                        
        case 1:
            aCurrentSpeed = aCurrentSpeed + 4 * CalcSpeedRatio(aCurrentSpeed, 128);
            break;
        case 2:
            aCurrentSpeed = aCurrentSpeed + 12 * CalcSpeedRatio(aCurrentSpeed, 256);
            break;
        case 3:
            aCurrentSpeed = aCurrentSpeed + 16 * CalcSpeedRatio(aCurrentSpeed, 384);
            break;
        case 4:
            aCurrentSpeed = aCurrentSpeed + 20 * CalcSpeedRatio(aCurrentSpeed, 512);
            break;
        case 5:
            aCurrentSpeed = aCurrentSpeed + 20;
            break;
        }

        if( aCurrentSpeed < 0)
        {
            aCurrentSpeed = 0;
        }        

        if( aCurrentSpeed > 1023)
        {
            aCurrentSpeed = 1023;
        }

        if(aCurrentSpeed != LocSpeed[modeLocIndex])
        {
            LocSpeed[modeLocIndex] = Math.trunc(aCurrentSpeed);
            onChangeSpeed(LocSpeed[modeLocIndex]);
        }
    }


}, 1000);