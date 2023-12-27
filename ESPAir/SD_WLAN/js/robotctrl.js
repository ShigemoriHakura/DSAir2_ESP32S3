
var gROBOT_StateLast = 0;
var gROBOT_State = 0;
var gROBOT_Line = 0;
var gROBOT_LineMax = 0;
var gROBOT_Script = "END;";
var gROBOT_GenCode;
var gROBOT_WaitCount = 0;
var gROBOT_WaitState = 0;
var gROBOT_WaitCountMax = 0;
var gROBOT_LocAddr = 0;

//Speed
var gROBOT_SpeedTargetEnd = 0;
var gROBOT_SpeedTargetStart = 0;
var gROBOT_SpeedLast = 0;

//Time param
var gROBOT_TimeDiv = 4; // // 0.25sec * 4 = 1sec

//ATC bell
var audioATC;
var audioSTART;

//Record Function
var gROBOT_RecordMode = 0;
var gROBOT_RecordTimer = 0;//0.1sec
var gROBOT_RecordData = "";


//Document Ready
$(function () {

    // �I�[�f�B�I
    audioATC = new Audio();
    audioSTART = new Audio();
    
    //Original, Yaasan, Keio, 20190918
    audioSTART.src = "/SD_WLAN/sound/startbeep.mp3";

    audioATC.src = "/SD_WLAN/block/locmedia/atc_bell.mp3";
    

});

function ROBOT_OpenMenu()
{


    if( gROBOT_RecordMode == 1)
    {
        $("#robot_btn_stoprun").hide('normal');
        $("#robot_btn_normalrun").hide('normal');
        $("#robot_btn_runrecord").hide('normal');
        $("#robot_btn_stoptrack").show('normal');
        $("#robot_btn_track").hide('normal');
    }
    else
    {
        $("#robot_btn_stoptrack").hide('normal');

        switch(gROBOT_State)
        {
            case 0:
                //Not working robot script
                $("#robot_btn_stoprun").hide('normal');
                $("#robot_btn_normalrun").show('normal');
                $("#robot_btn_runrecord").show('normal');
                $("#robot_btn_track").show('normal');
                break;
    
            case 1:
                $("#robot_btn_stoprun").show('normal');
                $("#robot_btn_normalrun").hide('normal');
                $("#robot_btn_runrecord").hide('normal');
                $("#robot_btn_track").hide('normal');
                 break;
        }
    }


	$('.robotpopup').addClass('.robot_show').fadeIn();
}

function ROBOT_Cancel()
{
    if( gROBOT_State == 1)
    {
        //Deactivate automatic control
        gROBOT_State = 0;

        //Clear robot script
        gROBOT_WaitCount = 0;

        //ATC meter Off
        gATCSpeed = -1;

        //Background image drawing
        onDrawMeter(40);

        toastr.info('ROBOT OFF.');
        //Not Checked
        $('#btnRobot').prop('checked', false).change();
    }
}

function ROBOT_CurrentState()
{
    var aRet = 0;

    if( gROBOT_State == 1)
    {
        //Robot run mode
        aRet = 1;
    }
    else if (gROBOT_RecordMode == 1)
    {
        //Record mode
        aRet = 2;
    }



    return aRet;
}

function ROBOT_click(inMode)
{
    $('.robotpopup').fadeOut();


    switch(inMode)
    {
        case 0:
            if( gROBOT_State == 0)
            {
        
                //Activate automatic control
        
                gROBOT_LocAddr = parseInt(dblLocArray[modeLocIndex]);
        
                //Generate robot script
                ROBOT_GenerateScript(1);
        
                //State changes to RUN
                gROBOT_State = 1;

                //Background image drawing
                onDrawMeter(40);
        
                toastr.info('ROBOT ON.');
            }
            else
            {
                //Deactivate automatic control
                ROBOT_Cancel();
            }

        break;

        case 1:
            //Run Tracked
            if( gROBOT_State == 0)
            {
        
                //Activate automatic control
        
                gROBOT_LocAddr = parseInt(dblLocArray[modeLocIndex]);
        
                //Generate robot script
                ROBOT_GenerateScript(2);
        
                //State changes to RUN
                gROBOT_State = 1;
        
                //Background image drawing
                onDrawMeter(40);
        
                toastr.info('ROBOT ON.');
            }
            else
            {
                //Deactivate automatic control
                ROBOT_Cancel();
            }
        break;

        case 2:
            ROBOT_QuestTeachMode();
        break;
        
        case 3:
            //Stop Tracking
            gROBOT_RecordMode = 0;

            //Cleaning
            gROBOT_RecordData = ROBOT_cleanLog(gROBOT_RecordData);

            //Save
            STORE_Save_ROBOTUserScript();

            //Background image drawing
            onDrawMeter(40);

            //Not Checked
            $('#btnRobot').prop('checked', false).change();

            toastr.info('Finish teaching.');

        break;

        case 4:
            //Stop Running
            ROBOT_Cancel();
        break;

        case 99:
            //Cancel
            //Nothing to do

            //Not Checked
            $('#btnRobot').prop('checked', false).change();
        break;



    }
 



}

function ROBOT_main()
{

    var aReDraw = 0;

    if( gROBOT_RecordMode == 1 )
    {
        //Progress timer
        gROBOT_RecordTimer = gROBOT_RecordTimer + 1;
    }

    switch(gROBOT_State)
    {
        case 0:
            //Not working robot script
        break;

        case 1:
            //Interpret robot script

            if( gROBOT_WaitCount <= 0)
            {
                //If wait count equals 0, Interpret script
                ROBOT_Interpret();

                gROBOT_Line = gROBOT_Line + 1;

                if( gROBOT_Line >= gROBOT_LineMax)
                {
                    //Generate robot script
                    ROBOT_GenerateScript(0);
                }


            }
            else if( gROBOT_WaitCount > 0)
            {
                //Wait
                switch(gROBOT_WaitState)
                {
                case 0:
                    //Normal wait, Nothing to do
                    break;
                case 1:
                    //Normal wait, Nothing to do
                    
                    var aSpeedTemp = 0;
                     
                    if( gROBOT_SpeedTargetStart <= gROBOT_SpeedTargetEnd)
                    {
                        aSpeedTemp = (gROBOT_SpeedTargetEnd - gROBOT_SpeedTargetStart) * (gROBOT_WaitCountMax - gROBOT_WaitCount) / gROBOT_WaitCountMax;
                        //Acc
                        aSpeedTemp = Math.round(gROBOT_SpeedTargetStart + aSpeedTemp);
                    }
                    else
                    {
                        aSpeedTemp = (gROBOT_SpeedTargetStart - gROBOT_SpeedTargetEnd) * gROBOT_WaitCount / gROBOT_WaitCountMax;
                        //Dec
                        aSpeedTemp = Math.round(gROBOT_SpeedTargetEnd + aSpeedTemp);
                    }

                    if( gROBOT_WaitCount <= 1)
                    {
                        onChangeSpeed(gROBOT_SpeedTargetEnd);
                        //CommandLocSpeed(gROBOT_LocAddr, gROBOT_SpeedTargetEnd);

                        gROBOT_SpeedLast = gROBOT_SpeedTargetEnd;
                    }
                    else
                    {
                        //console.log(aSpeedTemp);
                        onChangeSpeed(aSpeedTemp);
                        //CommandLocSpeed(gROBOT_LocAddr, aSpeedTemp);
                    }
                    break;
    

                }

                gROBOT_WaitCount--;
            }
            else
            {
                console.log("WaitCount lost");
                gROBOT_State = 0;
            }
            
            //ATC Stop and declaration process
            if( gATCStopTimer > 0)
            {
                gATCStopTimer = gATCStopTimer - 1;
                gATCSpeed = gATCSpeedStop + gATCStopTimer * (gATCSpeedLast - gATCSpeedStop) / gATCStopTimerMax;

                if( gATCStopTimer == 0)
                {
                    gATCSpeed = gATCSpeedStop;
                    gATCSpeedStop = 0;

                }

                aReDraw = 1;

            }

            break;
    }

    //Redraw Meter
    if( aReDraw == 1)
    {
        //Draw
        onDrawMeter(40);    
    }


}

//Generate Robot script
function ROBOT_GenerateScript(inGenerationType)
{

    //Pick up current speed
    var aCurrentSpeed = GetSlotSpeed(modeLocIndex);

    //Robot: XXXX
    switch(inGenerationType)
    {
        case 0:
            //Nothing to do (Reset)
        break;

        case 1:
            //Auto Genererated Script
            gROBOT_Script = ROBOT_Gen_Subrub(aCurrentSpeed);

            //1sec division
            gROBOT_TimeDiv = 4; // 0.25sec * 4 = 1sec
            break;
        
        case 2:
            //Tracked Script
            gROBOT_Script = gROBOT_RecordData;

            //1sec division
            gROBOT_TimeDiv = 1; // 0.2sec * 1 = 0.2sec
            break;
    }

    
    //gROBOT_Script = ROBOT_Gen_Express(aCurrentSpeed);

    //Split Script 
    gROBOT_GenCode = gROBOT_Script.split(";");
    gROBOT_LineMax = gROBOT_GenCode.length;
    gROBOT_WaitCount = 0;
    gROBOT_Line = 0;

}


function ROBOT_Gen_Subrub(inCurSpeed)
{
    var aScript = "BEEP;";

    if( inCurSpeed > 0 )
    {
        gROBOT_SpeedLast = inCurSpeed;
        aScript = aScript + "SPEED,0,900,10;";

    }
    else
    {
        gROBOT_SpeedLast = 0;
        aScript = aScript + "FNC,0,2,1;";
        aScript = aScript + "WAIT,1;";
        aScript = aScript + "FNC,0,2,0;";
        aScript = aScript + "SPEED,0,900,30;";
    }

    aScript = aScript + "WAIT,10;";
    aScript = aScript + "ATC,900;";
    aScript = aScript + "SPEED,0,850,45;";
    aScript = aScript + "ATC,900;";
    aScript = aScript + "SPEED,0,950,5;";
    aScript = aScript + "SPEED,0,700,30;";
    aScript = aScript + "MESSAGE,Thank you...;";

    aScript = aScript + "SPEED,0,850,8;";
    aScript = aScript + "ATC,700;";
    aScript = aScript + "WAIT,25;";
    aScript = aScript + "SPEED,0,650,30;";
    aScript = aScript + "MESSAGE,next station is...;";
    aScript = aScript + "ATC,800;";
    aScript = aScript + "SPEED,0,700,3;";
    aScript = aScript + "WAIT,20;";
    aScript = aScript + "MESSAGE,This train goes to...;";
    aScript = aScript + "ATCSTOP,0,38;";

    aScript = aScript + "SPEED,0,0,35;";
    aScript = aScript + "WAIT,12;";
    aScript = aScript + "MESSAGE,Only have 20 sec.;";
   
    aScript = aScript + "WAIT,10;";
    aScript = aScript + "MESSAGE,Only have 10 sec.;";

    aScript = aScript + "WAIT,10;";
    aScript = aScript + "MESSAGE,Here we go!;"; 
    return aScript;
}


function ROBOT_PlaySound() {
    audioATC.play();
}

function ROBOT_PlaySoundBeep() {
    audioSTART.play();
}

//Interpret Robot Script
function ROBOT_Interpret()
{
    if( gROBOT_Line < gROBOT_LineMax)
    {
        var aFunc = gROBOT_GenCode[gROBOT_Line].split(",");

        var aCmd = aFunc[0];


        switch(aCmd)
        {
            case "END":
                //Generate robot script
                ROBOT_GenerateScript(0);
                break;

            case "SPEED":
                gROBOT_SpeedTargetEnd = Number(aFunc[2]);
                gROBOT_SpeedTargetStart = Number(gROBOT_SpeedLast);

                if(aFunc[3] <= 1)
                {
                    //Immediately send
                    gROBOT_WaitCount = 0;
                    onChangeSpeed(gROBOT_SpeedTargetEnd);
                    gROBOT_SpeedLast = gROBOT_SpeedTargetEnd;
                }
                else
                {
                    //Interval send
                    gROBOT_WaitCountMax = Number(aFunc[3]) * gROBOT_TimeDiv;// 1d=0.5sec
                    gROBOT_WaitCount = gROBOT_WaitCountMax;
                    gROBOT_WaitState = 1;
                }
                break;

            case "FNC":
                CommandLocFunction(gROBOT_LocAddr, Number(aFunc[2]), Number(aFunc[3]));
                LocFuncStatus[modeLocIndex][Number(aFunc[2])] = Number(aFunc[3]);
                UpdateFunctionButtonsAll(modeLocIndex);

                gROBOT_WaitCount = 0;//500ms
                gROBOT_WaitState = 0;
                break;

            case "BEEP":
                ROBOT_PlaySoundBeep();
                break;
            
            case "ACC":
                CommandAccControl(Number(aFunc[1]), Number(aFunc[2]));
                gROBOT_WaitCount = 0;//500ms
                gROBOT_WaitState = 0;
                break;
                
            case "WAIT":
                gROBOT_WaitCount = Number(aFunc[1]) * gROBOT_TimeDiv;
                gROBOT_WaitState = 0;
                break;
                    
            case "JMP":
                break;

            case "LABEL":
                    break;

            case "WAITIF":
                    break;
                    
            case "GOTOIF":
                    break;

            case "ATCSTOP":

                if( gATCSpeed > Number(aFunc[1]) )
                {
                    gATCSpeedLast = gATCSpeed;
                    gATCSpeedStop = Math.trunc(Number(aFunc[1]) / 42.66666666666) * 42.66666666666;
                    gATCStopTimer = Number(aFunc[2]) * gROBOT_TimeDiv;
                    gATCStopTimerMax = gATCStopTimer;

                    if( gATCSpeedStop == 0)
                    {
                        //Stop Beep

                    }
                    else
                    {
                        //ATC bell
                        ROBOT_PlaySound();
                    }

                    //Background image drawing
                    onDrawMeter(40);
                }
                else
                {
                    console.log("ATCSTOP error.");
                }

                break;

            case "ATC":
                gATCSpeedStop = 0; 
                gATCStopTimer = 0;
                
                if( Number(aFunc[1]) < 0 )
                {
                    gATCSpeed = -1;
                }
                else if( Number(aFunc[1]) == gATCSpeed)
                {
                    //Nothing to do
                }
                else
                {
                    gATCSpeed = Math.ceil(Number(aFunc[1]) / 42.66666666) * 42.66666666;
                    ROBOT_PlaySound();
                }

                //Background image drawing
                onDrawMeter(40);

                break;
                    
            case "DIRECTION":
                onClickFwd(Number(aFunc[2]), 1);

                gROBOT_WaitCount = 0;//500ms
                gROBOT_WaitState = 0;
                break;                   
            
            case "MESSAGE":
                toastr.success(aFunc[1]);
                break;

                    
        }


        
    }



}

function ROBOT_LOG_WAIT()
{
    if( gROBOT_RecordTimer > 0 )
    {
            gROBOT_RecordData = gROBOT_RecordData + "WAIT," + gROBOT_RecordTimer + ";";
            gROBOT_RecordTimer = 0;
    }
}

function ROBOT_LOG_SPD(inLocAddr, inSpeed)
{
    //Only for Speed Command, Avoid double tap
    if( (gROBOT_RecordMode == 1 ) && ( gROBOT_RecordTimer > 1 ))
    {
        ROBOT_LOG_WAIT();

        gROBOT_RecordData = gROBOT_RecordData + "SPEED," + inLocAddr.toString() + "," + inSpeed.toString() + ",1;";
    }
}

function ROBOT_LOG_DIR(inLocAddr, inDir)
{
    if( gROBOT_RecordMode == 1 )
    {
        ROBOT_LOG_WAIT();

        gROBOT_RecordData = gROBOT_RecordData + "DIRECTION," + inLocAddr.toString() + "," + inDir.toString() + ";";
    }

}

function ROBOT_LOG_FNC(inLocAddr, inFuncNo, inFuncPwr)
{
    if( gROBOT_RecordMode == 1 )
    {
        ROBOT_LOG_WAIT();

        gROBOT_RecordData = gROBOT_RecordData + "FNC," + inLocAddr.toString() + "," + inFuncNo.toString()  + "," + inFuncPwr.toString() + ";";
    }

}

function ROBOT_LOG_ACC(inAccAddr, inOnOff)
{
    if( gROBOT_RecordMode == 1 )
    {
        ROBOT_LOG_WAIT();

        gROBOT_RecordData = gROBOT_RecordData + "ACC," + inAccAddr.toString() + "," + inOnOff.toString() + ";";
    }
}


function ROBOT_showLog() {
    var esc_str = $('<dummy>').text(gROBOT_RecordData.replace(/;/g,";\n")).html().replace(/\r\n|\r|\n/g, '<br>');
        
        var dlg = $('#dialogLog').dialog({
            autoOpen: false,
            modal: true,
            title: "Teaching user script",
            width: 500,
            height: 360,
            buttons: {

                 "Save": function(){
                    ROBOT_saveLog();
                    $(this).dialog("close");
                 },
                 "ExportXML": function(){
                    ROBOT_saveLogAsXML();
                    $(this).dialog("close");
                 },
                 "Load": function(){
                    ROBOT_loadLog();
                    $(this).dialog("close");
                 },

                 "Close": function(){
                        $(this).dialog("close");
                 }
            },
            close: function(){
                 $('#dialogLog').empty();
            },
     });
 
     $('#dialogLog').append('<div style="width: 460px;height: 100%;overflow: scroll-y;font-size: 20px;">' + esc_str + '</div>');
     dlg.dialog('open');			
}

function ROBOT_saveLogAsXML()
{

    var aScriptLines = gROBOT_RecordData.split(";");
    var aXMLScript = "<xml xmlns=\"http://www.w3.org/1999/xhtml\">\r\n";
    var aStackTag = ["xml","block"];

    var aROBOT_LocAddr = parseInt(dblLocArray[modeLocIndex]);

    //Generate XML
    aXMLScript = aXMLScript + "<block type=\"beginthis\" x=\"190\" y=\"30\">\r\n";

    aXMLScript = aXMLScript + "<next>\r\n";
    aStackTag.push("next");

    for( let j = 0; j < aScriptLines.length; j++ )
    {
        let aParam = aScriptLines[j].split(",");

        switch(aParam[0])
        {
        case "SPEED":
            aXMLScript = aXMLScript + "<block type=\"speed\">\r\n";
            aStackTag.push("block");
            aXMLScript = aXMLScript + "<field name=\"LOC_ADDR\">" + aROBOT_LocAddr.toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<field name=\"LOC_SPEED\">" + Math.floor(Number(aParam[2]) * 100 / 1024).toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<next>\r\n";
            aStackTag.push("next");
            break;
        case "WAIT":
            aXMLScript = aXMLScript + "<block type=\"waitsleep\">\r\n";
            aStackTag.push("block");
            aXMLScript = aXMLScript + "<field name=\"WAIT_TIME\">" + (Number(aParam[1]) / 4).toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<next>\r\n";
            aStackTag.push("next");
            break;
        case "DIRECTION":
            aXMLScript = aXMLScript + "<block type=\"direction\">\r\n";
            aStackTag.push("block");
            aXMLScript = aXMLScript + "<field name=\"LOC_ADDR\">" + aROBOT_LocAddr.toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<field name=\"LOC_DIR\">" + aParam[2] + "</field>\r\n";
            aXMLScript = aXMLScript + "<next>\r\n";
            aStackTag.push("next");
            break;
        case "FNC":
            aXMLScript = aXMLScript + "<block type=\"locfunction\">\r\n";
            aStackTag.push("block");
            aXMLScript = aXMLScript + "<field name=\"LOC_ADDR\">" + aROBOT_LocAddr.toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<field name=\"NAME\">" + aParam[2] + "</field>\r\n";
            aXMLScript = aXMLScript + "<field name=\"FUNC_VAL\">" + (aParam[3] == "1"? "TRUE" : "FALSE") + "</field>\r\n";
            aXMLScript = aXMLScript + "<next>\r\n";
            aStackTag.push("next");
            break;
        case "ACC":
            aXMLScript = aXMLScript + "<block type=\"turnout\">\r\n";
            aStackTag.push("block");
            aXMLScript = aXMLScript + "<field name=\"ACC_ADDR\">" + (Number(aParam[1]) + 1).toString() + "</field>\r\n";
            aXMLScript = aXMLScript + "<field name=\"ACC_DIR\">" + aParam[2] + "</field>\r\n";
            aXMLScript = aXMLScript + "<next>\r\n";
            aStackTag.push("next");
            break;


        }



    }

    aXMLScript = aXMLScript + "<block type=\"exitthis\"></block>\r\n";
    


    for( let i = 0; i < aStackTag.length; i++)
    {
        aXMLScript = aXMLScript + "</" + aStackTag[aStackTag.length - i - 1] + ">\r\n";
    }



    //

    var textToWrite = aXMLScript;



    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = "user_robotscript.xml";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "My Hidden Link";

    window.URL = window.URL || window.webkitURL;

    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function ROBOT_saveLog() {

    var textToWrite = gROBOT_RecordData.replace(/;/g,";\n");
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = "user_robotscript.txt";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "My Hidden Link";

    window.URL = window.URL || window.webkitURL;

    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}


function ROBOT_loadLog(){

    	const showOpenFileDialog = () => {
    		return new Promise(resolve => {
    			const input = document.createElement('input');
    			input.type = 'file';
    			input.accept = '.txt, text/plain';
    			input.onchange = event => {
    				resolve(event.target.files[0]);
    			};
    			input.click();
    		});
    	};

    	const readAsText = file => {
    		return new Promise(resolve => {
    			const reader = new FileReader();
    			reader.readAsText(file);
    			reader.onload = () => {
    				resolve(reader.result);
    			};
    		});
    	};

    	(async () => {
    		const file = await showOpenFileDialog();
    		const content = await readAsText(file);
    		// 内容表示
    		//alert(content);

            //Delete \r
            gROBOT_RecordData = content.replace(/\r?\n/g, '');

            //Save
            STORE_Save_ROBOTUserScript();

    	})();

}

function ROBOT_startTeach()
{
    //Start Tracking
    gROBOT_RecordData = "";
    gROBOT_RecordMode = 1;

    //Background image drawing
    onDrawMeter(40);

    //Not Checked
    $('#btnRobot').prop('checked', false).change();

    toastr.info('Start teaching.');
}
        
function ROBOT_QuestTeachMode() {

    var buttons = [{
            text: "Ok",
            click: function () {
                ROBOT_startTeach();
                $(this).dialog('close');
            }
        },
        {
            text: "Cancel",
            click: function () {
                $(this).dialog('close');
            }
        }
    ];
    // ダイアログを表示
    showDialog("Teaching to Robot", "Would you start teaching to Robot?", buttons);



}

function showDialog(title, message, buttons) {
    var esc_str = $('<dummy>').text(message).html().replace(/\r\n|\r|\n/g, '<br>');

    var html_dialog = '<div>' + esc_str + '</div>';
    $(html_dialog).dialog({
        title: title,
        buttons: buttons,
        width: "40%",
        close: function () {
            $(this).remove();
        }
    });
}

function ROBOT_cleanLog(inLogData) {

    var aOutputLog = "";
    var aLastScript = "";
    var aLog = inLogData.split(";");

    //Cleaning logs
    for (var i in aLog){

        if( (aLastScript != aLog[i]) && (aLog[i] != ""))
        {
            aOutputLog = aOutputLog + aLog[i] + ";";
        }

        aLastScript = aLog[i];
    }
    return aOutputLog;
}
