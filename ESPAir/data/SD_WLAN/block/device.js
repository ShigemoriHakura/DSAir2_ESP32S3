
var gNoVibration = 0;


function DEVICE_Vibrate()
{
	if( gNoVibration == 1)
	{
		return;
	}
	
	setTimeout(function(){
		if(window.navigator.vibrate)
		{
			window.navigator.vibrate(25);
		}
		else if(window.navigator.webkitVibrate)
		{
			window.navigator.webkitVibrate(25);
		}
	}, 0);

}



function DEVICE_ErrorString(inErrNo)
{
	var aStr = "";
	
	switch( inErrNo)
	{
		case 0:
		case 1:
			aStr = "No errors";
			break;
	
		case 2:
			aStr = "Low Voltage(LV)";
			break;
			
		case 4:
			aStr = "Over Voltage(OV)";
			break;
			
		case 8:
			aStr = "Motor Driver Protection";
			break;
	}
	
	
	return aStr;
}

function DEVICE_HWnameString(inHWNo)
{
	var aStr = "";
	
	switch( inHWNo)
	{
		case 0:
			aStr = "DSshield with FlashAir";
			break;
		case 1:
			aStr = "DSair1";
			break;
		case 2:
			aStr = "DSair2";
			break;
			
		default:
			aStr = "Unknown";
			break;
	}
	
	
	return aStr;
}
