    var ANA_LocSpeed = 0;
    var ANA_LocSpeedLast = 0;
    var ANA_Direction = 0;
    var ANA_SpeedMode = 0;
    var LastUpdateTimeANA = 0;
    var ANA_LightMode = 0;
    var ANA_LightThreshold = 72;
    var ANA_MaxSpeed = 100;
    var ANA_SpeedDelayOn = 0;
    var ANA_SpeedDelayTime = 0;
    var ANA_SpeedDelaySpeed1 = 0;
    var ANA_SpeedDelaySpeed2 = 0;
    var ANA_SpeedDelaySpeedTemp = 0;
    var ANA_SpeedDelayDiff = 0;
    var ANA_DelayInterval = 0;
    var ANA_SpeedDelaySpeedCnt = 1;
    var ANA_PowerStatus = 0;
    var flagPower = 0;

	
	function ANA_Free() {
		ANA_LocSpeed = 0;
		ANA_LocSpeedLast = 0;
		ANA_LightMode = 0;
	}
	
	function ANA_SpeedCurve(inMode, inSpeed)
	{
		var aSpd = inSpeed;
		var aSpd_unit = inSpeed / 1023;
		
		switch(inMode)
		{
		case 1:
			aSpd = inSpeed;
			break;
		case 2:
			aSpd = 1023 * (1 - (1 - aSpd_unit) * (1 - aSpd_unit));
			break;
		case 3:
			aSpd = 1023 * (aSpd_unit * aSpd_unit);
			break;
		}
		
		return Math.round(aSpd * ANA_MaxSpeed / 100);
		
	}
	
	function onClickAnalogLight() {
		
		if( ANA_LightMode == 0)
		{
			ANA_LightMode = 1;
			$("#btnAnaLight").prop("checked", true).change();
		}
		else
		{
			ANA_LightMode = 0;
			$("#btnAnaLight").prop("checked", false).change();
		}
		
		ANA_Speed(ANA_LocSpeed);
		
	}
	
	function onClickAnalogSlowMotion() {
		
		if( ANA_SpeedDelayOn == 0)
		{
			ANA_SpeedDelayOn = 1;
			$("#btnAnaSlow").prop("checked", true).change();
		}
		else
		{
			ANA_SpeedDelayOn = 0;
			$("#btnAnaSlow").prop("checked", false).change();
		}
	}
	

      function ANA_DelaySpeedProgress() {
      	
	    $(function () {
      	if( (ANA_SpeedDelayTime > 0) && (ANA_SpeedDelayOn == 1))
      	{
      		
      		ANA_SpeedDelaySpeedTemp = ANA_SpeedDelaySpeedTemp + ANA_SpeedDelayDiff;
      		ANA_SpeedDelayTime = ANA_SpeedDelayTime - 111;
      		
      		if( ANA_SpeedDelaySpeedTemp < 0)
      		{
      			ANA_SpeedDelaySpeedTemp = 0;
      		}
      		
	        ANA_OnDraw(ANA_SpeedDelaySpeedTemp);
	        
	        if( ANA_SpeedDelaySpeedCnt > 2)
	        {
	        	ANA_Speed(ANA_SpeedDelaySpeedTemp);
	        	ANA_SpeedDelaySpeedCnt = 0;
	        }
	        else
	        {
	        	ANA_SpeedDelaySpeedCnt = ANA_SpeedDelaySpeedCnt + 1;
	        }
      	}
      	else
      	{
      		ANA_SpeedDelayTime = 0;
      		
	        ANA_OnDraw(ANA_LocSpeed);
	        ANA_Speed(ANA_LocSpeed);
      		clearInterval(ANA_DelayInterval);
      	}
		});
      }
	

    $(function () {
      // Initialization code

        $( '#ANA_SPEED-value' ) . val( 0 );
        $( '#ANA_SPEED-option' ) . val( "%" );


	$("#ANA_MaxVoltage").slider({
        orientation: 'vertical',
        animate: 'slow',
        value:100,
		min:50,
		max:100,
		step:1,
		range:"min",
        slide: function( event, ui ) {
            $( '#ANA_MaxVoltage-value' ) . val( ui.value );
            ANA_MaxSpeed = ui.value;
        }
	});
    $( '#ANA_MaxVoltage-value' ) . val( jQuery( '#ANA_MaxVoltage' ) . slider( 'value' ) );

	$("#ANA_LightThred").slider({
        orientation: 'vertical',
        animate: 'slow',
		value:7,
		min:1,
		max:40,
		step:1,
		range:"min",
        slide: function( event, ui ) {
            $( '#ANA_LightThred-value' ) . val( ui.value );
            ANA_LightThreshold = Math.round(ui.value * 1023 / 100);
        }
	});
    $( '#ANA_LightThred-value' ) . val( jQuery( '#ANA_LightThred' ) . slider( 'value' ) );

      var canvas = document.getElementById("speedobar");
      canvas.addEventListener("mousedown", onClickAnalogBar);
      //canvas.addEventListener("mousemove", onClickAnalogBar);
      //canvas.addEventListener("mouseup", onClickAnalogBar);

      canvas.addEventListener("touchstart", onTouchAnalogBar);
      canvas.addEventListener("touchmove", onTouchAnalogBar);
      canvas.addEventListener("touchend", onTouchAnalogBarEnd);


      ANA_Fwd(1);
      ANA_Mode(1);


      function onClickAnalogBar(e) {

        if (PowerStatus == 1) {
          return;
        }

        e.preventDefault();

        var rect = e.target.getBoundingClientRect();

        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;


        if( y > 312)
        {
          y = 320;
        }

        OnChangeAnalogBar(x, y, false);


      }

      function onTouchAnalogBarEnd(e) {
        e.preventDefault();

        if (PowerStatus == 1) {
          return;
        }

        if (e.changedTouches[0] != null) {

          var touchObject = e.changedTouches[0];
          var touchX = touchObject.pageX;
          var touchY = touchObject.pageY;

          // 要素の位置を取得
          var clientRect = e.target.getBoundingClientRect();
          var positionX = clientRect.left + window.pageXOffset;
          var positionY = clientRect.top + window.pageYOffset;

          // 要素内におけるタッチ位置を計算
          var x = touchX - positionX;
          var y = touchY - positionY;

          OnChangeAnalogBar(x, y, true);
        }      
      }


      function onTouchAnalogBar(e) {

        if (PowerStatus == 1) {
          return;
        }

        if (e.changedTouches[0] != null) {

          var touchObject = e.changedTouches[0];
          var touchX = touchObject.pageX;
          var touchY = touchObject.pageY;

          // 要素の位置を取得
          var clientRect = e.target.getBoundingClientRect();
          var positionX = clientRect.left + window.pageXOffset;
          var positionY = clientRect.top + window.pageYOffset;

          // 要素内におけるタッチ位置を計算
          var x = touchX - positionX;
          var y = touchY - positionY;

          OnChangeAnalogBar(x, y, false);
        }
      }

      function OnChangeAnalogBar(x, y, inUpdateFlag) {
        if (y < 0) {
          y = 0;
        }

        if (y > 320) {
          y = 320;
        }


        var aCalcLocSpeed = Math.round(Number(320 - y) * 1024 / 320);
        
        if( ANA_SpeedDelayOn == 1)
        {
        	if( ANA_SpeedDelayTime == 0)
        	{
        		ANA_LocSpeed = aCalcLocSpeed;
        		
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
        		ANA_SpeedDelaySpeed2 = ANA_LocSpeed;
        		ANA_SpeedDelaySpeed1 = ANA_LocSpeedLast;
        		ANA_SpeedDelaySpeedTemp = ANA_LocSpeedLast;
        		ANA_SpeedDelayTime = Math.abs(ANA_LocSpeed - ANA_LocSpeedLast) * aHofTime / 1023;//0->max speed == 30sec
        		ANA_SpeedDelayDiff = (ANA_LocSpeed - ANA_LocSpeedLast)* 111 / ANA_SpeedDelayTime;
        		
        		ANA_DelayInterval = setInterval('ANA_DelaySpeedProgress()',111);
        		
        	}
        	else
        	{
        		//動作中は無視
        		
        		
        	}
        }
        else
        {
        	//速度を反映
        	ANA_LocSpeed = aCalcLocSpeed;
	        
	        ANA_OnDraw(ANA_LocSpeed);

		    var date = new Date();

		    if ((Math.abs(date.getTime() - LastUpdateTimeANA) >= 500) || (inUpdateFlag == true)) {
		        if (ANA_LocSpeedLast != ANA_LocSpeed) {
		            //前回より500ms経過時
		            ANA_Speed(ANA_LocSpeed);
		        }
		        LastUpdateTimeANA = date.getTime();
		    } else {
		        /*表示のみ（速度を送信しない）*/
		    }
	    
	    }
	    
	    
        return true;
      }
      

    });




    var imgBarMask = new Image();
    imgBarMask.src = "/SD_WLAN/img/speedobar_mask.png";

    imgBarMask.onload = function () {
      ANA_OnDraw(ANA_LocSpeed);
    }

    function ANA_Mode(inMode) {
      ANA_SpeedMode = inMode;
      
      switch(inMode)
      {
      case 1:
      	    $("#btnModeC1").prop("checked", true).change();
      	    $("#btnModeC2").prop("checked", false).change();
      	    $("#btnModeC3").prop("checked", false).change();
      	break;
      case 2:
      	    $("#btnModeC1").prop("checked", false).change();
      	    $("#btnModeC2").prop("checked", true).change();
      	    $("#btnModeC3").prop("checked", false).change();
      	break;

      case 3:
      	    $("#btnModeC1").prop("checked", false).change();
      	    $("#btnModeC2").prop("checked", false).change();
      	    $("#btnModeC3").prop("checked", true).change();
      	break;
      }
    }

    function ANA_Fwd(inMode) {

      if (ANA_Direction != inMode) {
        ANA_LocSpeed = 0;
        ANA_Direction = inMode;

	      ANA_Speed(ANA_LocSpeed);
	      ANA_OnDraw(ANA_LocSpeed);
        
        if( ANA_Direction == 2)
        {
        	//REV
      	    $("#btnAnaFwd").prop("checked", false).change();
      	    $("#btnAnaRev").prop("checked", true).change();
        }
        else
        {
        	//FWD
      	    $("#btnAnaFwd").prop("checked", true).change();
      	    $("#btnAnaRev").prop("checked", false).change();
        
        }
      }
    }

    function ANA_BASSpeed(inSpeed) {
    	
        ANA_LocSpeed = inSpeed;
        ANA_OnDraw(ANA_LocSpeed);
    	ANA_Speed(inSpeed);
    	
    }


    function ANA_Speed(inSpeed) {
      ANA_LocSpeedLast = inSpeed;
      //console.log(inSpeed);
	  
	  var aSpeed = ANA_SpeedCurve(ANA_SpeedMode,inSpeed);
	  
	  if( (aSpeed < ANA_LightThreshold) && (ANA_LightMode == 1))
	  {
	  	aSpeed = ANA_LightThreshold;
	  }
	  
      var url = GetUrl() + "DC(" + aSpeed + "," + ANA_Direction + ")";
      $.get(url, function (data) {});
      
      
     
      if( aSpeed > 0)
      {
      	if( ANA_PowerStatus == 0)
      	{
	      	ANA_PowerStatus = 1;
			$( "#ANA_PowerIcon" ).animate({
	          color: "#aa0000",
	        }, 500 );
	    }
      }
      else
      {
      	if( ANA_PowerStatus == 1)
      	{
	        ANA_PowerStatus = 0;
			$( "#ANA_PowerIcon" ).animate({
	          color: "#aaaaaa",
	        }, 500 );
        }
      }


    }

    function ANA_Stop() {
      ANA_SpeedDelayTime = 0;
      ANA_LocSpeed = 0;
      ANA_Speed(ANA_LocSpeed);
      ANA_OnDraw(ANA_LocSpeed);
    }

    function ANA_OnDraw(inSpeed) {
      ANA_DrawMeter((Number(inSpeed) * 320) / 1024, 320);
      $( '#ANA_SPEED-value' ) . val( Math.round(inSpeed * 100 / 1023) );
      
    }

    function ANA_DrawMeter(bar_val, bar_height) {
      var canvas = document.getElementById('speedobar');
      if (!canvas || !canvas.getContext) {
        return false;
      }
      var ctx = canvas.getContext('2d');

      //灰色に描画
      ctx.fillStyle = "lightgray";
      ctx.fillRect(0, 0, canvas.width, bar_height - bar_val);

      /* 描画 */
      ctx.beginPath();
      /* グラデーション領域をセット */
      var grad = ctx.createLinearGradient(0, 0, 0, bar_height);
      /* グラデーション終点のオフセットと色をセット */
      grad.addColorStop(1, 'rgb(255, 180, 177)'); // 赤
      grad.addColorStop(0, 'rgb(192, 80, 100)'); // 紫
      /* グラデーションをfillStyleプロパティにセット */
      ctx.fillStyle = grad;


      ctx.rect(0, bar_height - bar_val, canvas.width, bar_height);
      /* 描画 */
      ctx.fill();

      ctx.drawImage(imgBarMask, 0, 0, canvas.width, canvas.height);
    }

    function enterPowerBtn() {

      if (flagPower == 1) {
        onClickPon(0);
        flagPower = 0;
        $("#PowerBtn").text("ON");
        $("#DStitle").text("DSair ");
      } else {
        onClickPon(1);
        flagPower = 1;
        $("#PowerBtn").text("OFF");
        $("#DStitle").text("DSair*");
      }
    }