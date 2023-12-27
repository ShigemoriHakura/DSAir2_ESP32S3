var LocAddr = 49152 + 3;
var LocSpeed = 0;
var LocDirReverse = 0;
var LocFuncStatus = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var gReadCVNo = 0;
var gReadCVVal = 0;
var gMode = 0;
var g_RecvStatusRaw = "";
var gLastCVReply = "";
var gResetCheck = 1;

function GetUrl() {
    return "/command.cgi?op=131&ADDR=0&LEN=64&DATA=";

}

function SetCVReply(inCVNo, inCVValue)
{
	switch(gMode)
	{
		case 1:
			//CVread
			//console.log("Read Finish -> No."+inCVNo + " Val." + inCVValue);
			
			if( inCVNo == 8)
			{
				$(".read_cvval").text(ReplyManufacturer(inCVValue)+" (" + inCVValue + ")");
				
			}
			else
			{
				$(".read_cvval").text(inCVValue);
			}
			
			
			gMode = 0;
			
		break;
		
		case 2:
			//CVwrite
			$(".write_msg").text("Finished");
			gMode = 0;
			
		break;
		
		case 3:
			//CV29
			
			SetCV29Data(inCVValue);
			
			gMode = 0;
		break;
	
		case 4:
			//Loc address
			LOC_StateProcess();
		break;
	
	
	}
	
	
}

function UpdateLocAddr(inLocAddr)
{
    LocAddr = inLocAddr;
}

function GetUrl() {
    return "/command.cgi?op=131&ADDR=0&LEN=64&DATA=";
}

function onClickFunction(inFuncNo) {
    var aOnOff = LocFuncStatus[inFuncNo];

    if (aOnOff == 1) {
        aOnOff = 0;
    } else {
        aOnOff = 1;
    }

    LocFuncStatus[inFuncNo] = aOnOff;

    var url = GetUrl() + "FN(" + LocAddr + "," + inFuncNo + "," + aOnOff + ")";

    $.get(url, function (data) {});
}

function onClickStop() {

    onChangeSpeed(0);
}

function onClickFwd(inFwd) {

    var url = GetUrl() + "DI(" + LocAddr + "," + inFwd + ")";
    $.get(url, function (data) {});

}

function onChangeSpeed(inSpeed) {

    var url = GetUrl() + "SP(" + LocAddr + "," + inSpeed + ",2)";
    $.get(url, function (data) {});

}

function onClickPon(inPon) {

    var url = GetUrl() + "PW(" + inPon + ")";
    $.get(url, function (data) {});

}

function SHRAM_getStatus()
{
    var url = "/command.cgi?op=130&ADDR=128&LEN=264";

    $.get(url, function(data) {
        g_RecvStatusRaw = data;
    });
}


$(function () {
    
    setInterval(function () {
		
		SHRAM_getStatus();
		
        var aReplyStrArray = g_RecvStatusRaw.split(";");
        
        if( aReplyStrArray.length <= 1)
        {
            return;
        }                  
        
        var aPrmStrArray = aReplyStrArray[0].split(",");

        if( aPrmStrArray.length == 0)
        {
            return;
        }
        
        //CV Reply
        
        if( gLastCVReply != aReplyStrArray[1])
        {
        	//Store last buffer
        	gLastCVReply = aReplyStrArray[1];
        	
        	//Parse CV reply.
	        var aCvStrArray = aReplyStrArray[1].split(",");
	        
	        //Size check
	        if( aCvStrArray.length > 1)
	        {
	        	//CVNo check
		        if( (Number(aCvStrArray[1]) != 0))
		        {
		            var aReadCVNo = Number(aCvStrArray[1]);
		            var aReadCVVal = Number(aCvStrArray[2]);
		            
		            if( (gMode != 0) && (gReadCVNo == aReadCVNo))
		            {
			            
			            if( aReadCVNo != 0)
			            {
				            gReadCVNo = aReadCVNo;
				            gReadCVVal = aReadCVVal;
			            	SetCVReply(gReadCVNo, gReadCVVal);
			            }
			            else
			            {
			            	
			            }
		            }
		        }
		        else
		        {
		            if( (gReadCVVal == -1) && (gMode != 0))
		            {
		        		gMode = 0;
		        		gReadCVVal = 0;
		        		ons.notification.toast('CVNo.' + gReadCVNo + ' :Read error!', { timeout: 1000, animation: 'ascend' });
		        	}
		        }
	        }
        	else
        	{
	        	//gResetCheck = 1;
	        }
	        
        }
        
        console.log(g_RecvStatusRaw);
        
    }, 500);
    
    
});