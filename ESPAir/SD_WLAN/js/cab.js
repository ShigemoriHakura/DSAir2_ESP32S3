    var CAB_LocSpeed = 0;
    var CAB_LocSpeedLast = 0;
    var CAB_Direction = 0;
    var CAB_SpeedMode = 0;
    var LastUpdateTimeCAB = 0;
    var CAB_MaxSpeed = 100;
    var CAB_SpeedDelayOn = 0;
    var CAB_SpeedDelayTime = 0;
    var CAB_SpeedDelaySpeed1 = 0;
    var CAB_SpeedDelaySpeed2 = 0;
    var CAB_SpeedDelaySpeedTemp = 0;
    var CAB_SpeedDelayDiff = 0;
    var CAB_DelayInterval = 0;
    var CAB_SpeedDelaySpeedCnt = 1;
    var CAB_PowerStatus = 0;
    var flagPower = 0;

CAB_Free();

function CAB_Free() {
	CAB_LocSpeed = 0;
	CAB_LocSpeedLast = 0;
	CAB_SpeedDelayTime = 0;
	CAB_Counter = 0;
}

function CAB_Deactivate() {

	clearInterval(CAB_DelayInterval);
	//動作中は無視
	CAB_SpeedDelayTime = 0;
	ATCSpeed = -1;
	
	CAB_OnDraw(CAB_LocSpeed);
	CAB_Free();
}

function onClickCabSlowMotion() {
	
	if( CAB_SpeedDelayOn == 0)
	{
		CAB_SpeedDelayOn = 1;
		$("#btnCabSlow").prop("checked", true).change();
	}
	else
	{
		CAB_SpeedDelayOn = 0;
		$("#btnCabSlow").prop("checked", false).change();
	}
}


function CAB_DelaySpeedProgress() {
	
	$(function () {
		if( (CAB_SpeedDelayTime > 0) && (CAB_SpeedDelayOn == 1))
		{
			
			CAB_SpeedDelaySpeedTemp = CAB_SpeedDelaySpeedTemp + CAB_SpeedDelayDiff;
			CAB_SpeedDelayTime = CAB_SpeedDelayTime - 111;
			
			if( CAB_SpeedDelaySpeedTemp < 0)
			{
				CAB_SpeedDelaySpeedTemp = 0;
			}
			
			
			//3回に1回、送信する。
			if( CAB_SpeedDelaySpeedCnt % 8 == 0)
			{
				CAB_Speed(CAB_SpeedDelaySpeedTemp);
				CAB_OnDraw();
			}
			else
			{
				CAB_OnDrawTemp(CAB_SpeedDelaySpeedTemp);
			}

			if( CAB_SpeedDelaySpeedCnt > 2)
			{
				CAB_Speed(CAB_SpeedDelaySpeedTemp);
				CAB_SpeedDelaySpeedCnt = 0;
			}
			else
			{
				CAB_SpeedDelaySpeedCnt = CAB_SpeedDelaySpeedCnt + 1;
			}
		}
		else
		{
			clearInterval(CAB_DelayInterval);
			CAB_SpeedDelaySpeedCnt = 0;
			CAB_SpeedDelayTime = 0;
			ATCSpeed = -1;
			
			CAB_Speed(CAB_LocSpeed);
			CAB_OnDraw();
			
		}
	});
}

    function CAB_Speed(inSpeed) {
      CAB_LocSpeedLast = Math.round(inSpeed);
	  LocSpeed[modeLocIndex] = Math.round(inSpeed);
    }
    
    function CAB_SpeedSend()
    {
      onChangeSpeed(LocSpeed[modeLocIndex]);
    
    }

    function CAB_Stop() {
      CAB_SpeedDelayTime = 0;
      CAB_LocSpeed = 0;
      CAB_Speed(CAB_LocSpeed);
      CAB_OnDraw();
    }

    function CAB_OnDrawTemp(inSpeed) {
		//メーター表示を更新
		CAB_Speed(inSpeed);
		onDrawMeter(40);
    }


    function CAB_OnDraw() {
		//メーター表示を更新
		CAB_SpeedSend();
    }


