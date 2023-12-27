//Meter Drawing Unit

/* ↓オリジナルスキン******************************  */

//メーター関係
var MeterStartDeg_E259 = 36 * 4; //Start角度 135 36 * 4
var MeterRangeDeg_E259 = 36 * 7; //Range角度 270 36 * 7

function changeBackground_E259()
{
    //タブの背景を切り替え
    document.getElementById("tab-cab").style.backgroundColor = "#3B4B6E"; 
  
}
   

function drawMeterBackground_E259(inScale) {

    var canvas = document.getElementById("myCanvas");
    var cv = canvas.getContext("2d");
    var scale = inScale * 10
    var center = {
        x: scale / 2,
        y: scale / 2
    };
    var hLen = scale * 0.8 / 2; // 針の長さ
    var fSize = scale / 11; // フォントサイズ
    var rLen = scale / 2.7;

    CenterX = center.x;
    CenterY = center.y;

    // メーター背景の円描画
    cvSize = document.getElementById("myCanvas").getAttribute("width");
    cv.clearRect(0, 0, cvSize, cvSize);

    //背景を白に描画
    cv.fillStyle ="#3B4B6E"; //"#FFFFFF";
    cv.fillRect(0, 0, cvSize, cvSize);

    //Draw meter
    cv.beginPath();
    cv.arc(center.x, center.y, scale / 2, 0, Math.PI * 2, false);
    
    //決定
    //cv.arc(center.x, center.y, rLen, 0, Math.PI * 2, false);
    
    // グラデーション指定
    //var grad = cv.createRadialGradient(center.x / 1, center.y / 1, 0, center.x, center.y, scale / 2);
    var grad = cv.createRadialGradient(center.x / 1, center.y / 1, 0, center.x, center.y, rLen);
    grad.addColorStop(0.00, "#202020");//"#202020");
    grad.addColorStop((rLen - 40) / rLen, "#202020");
    grad.addColorStop((rLen - 31) / rLen, "#101010");
    grad.addColorStop((rLen - 30) / rLen, "#3B4B6E");
    grad.addColorStop(1.00, "#3B4B6E");
    cv.fillStyle = grad;
    cv.fill();


    // Canvasの線の色
    cv.strokeStyle = "#818C9D";

    //　メモリ　円
    cv.beginPath();
    // 線の太さ
    cv.lineWidth = 3;
    //cv.moveTo(center.x,center.y)

    //決定
    //cv.arc( center.x, center.y, rLen - scale / 3.5, ((MeterRangeDeg_E259 / 120) * 0 + MeterStartDeg_E259) * Math.PI / 180, ((MeterRangeDeg_E259 / 120)*120 + MeterStartDeg_E259) * Math.PI / 180, false ) ;
    cv.arc( center.x, center.y, (rLen - 30 ) / 2, ((MeterRangeDeg_E259 / 120) * 0 + MeterStartDeg_E259) * Math.PI / 180, ((MeterRangeDeg_E259 / 120)*120 + MeterStartDeg_E259) * Math.PI / 180, false ) ;
    cv.stroke();

    // Canvasの線の色、塗りつぶし色
    cv.fillStyle = "#3B4B6E";
    cv.strokeStyle = "#EEEEEE";

    cv.beginPath();
    // 線の太さ
    cv.lineWidth = 2 ;
    cv.moveTo(center.x,center.y)
    cv.arc( center.x, center.y, rLen, ((MeterRangeDeg_E259 / 120) * 120 + MeterStartDeg_E259) * Math.PI / 180, ((MeterRangeDeg_E259 / 120)*0 + MeterStartDeg_E259) * Math.PI / 180, false ) ;
    cv.fill();
    /*
    cv.beginPath();
    cv.arc( center.x, center.y, rLen - 37, ((MeterRangeDeg_E259 / 120) * 0 + MeterStartDeg_E259) * Math.PI / 180, ((MeterRangeDeg_E259 / 120)*120 + MeterStartDeg_E259) * Math.PI / 180, false ) ;
    cv.stroke();
    */
    
    // メモリ表示
    for (var i = 0; i <= LocMeterMaxSpeed; i++) {
        var radian = ((MeterRangeDeg_E259 / LocMeterMaxSpeed) * i + MeterStartDeg_E259) * Math.PI / 180;
        var radian2 = ((MeterRangeDeg_E259 / LocMeterMaxSpeed) * i + MeterStartDeg_E259 + 1.5) * Math.PI / 180;
        var radian3 = ((MeterRangeDeg_E259 / LocMeterMaxSpeed) * i + MeterStartDeg_E259 - 1.5) * Math.PI / 180;
        //var xx = center.x + (rLen - 20) * Math.cos(radian);
        //var yy = center.y + (rLen - 20) * Math.sin(radian);
        var pos_x = cPoint(center, rLen - 16, radian);//外側
        var pos_x2 = cPoint(center, rLen - 25, radian);//内側
        var pos_x3 = cPoint(center, rLen - 2, radian);//内側
        var pos_x4 = cPoint(center, (rLen - 30 ) / 2, radian);//内側
        var pos_x5 = cPoint(center, rLen - 31, radian);//内側
        var pos_x6 = cPoint(center, rLen - 7, radian);//内側
        var pos_x7 = cPoint(center, rLen - 20, radian);//内側
        var aMemSize = 1;



        cv.strokeStyle = "#818C9D";
        if ((i % 20 == 0) && (i != 0) && (i != LocMeterMaxSpeed)) {
            aMemSize = 2.5;
            //ライン描画
            cv.lineWidth = aMemSize;
            cv.lineCap = "butt";
            cv.beginPath();
            //cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
            cv.moveTo(pos_x4.x,pos_x4.y);
            cv.lineTo(pos_x5.x,pos_x5.y);
            //cv.fill();
            cv.stroke();                    
        }

        cv.linecap = "round";
        cv.strokeStyle = "#EEEEEE";
        if (i % 20 == 0) {
            aMemSize = 4;
            //ライン描画
            cv.lineWidth = aMemSize;
            cv.lineCap = "round";
            cv.beginPath();
            //cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
            cv.moveTo(pos_x3.x,pos_x3.y);
            cv.lineTo(pos_x2.x,pos_x2.y);
            //cv.fill();
            cv.stroke();
        }
        else if (i % 10 == 0) {
            aMemSize = 4;
            //ライン描画
            cv.lineWidth = aMemSize;
            cv.lineCap = "round";
            cv.beginPath();
            //cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
            cv.moveTo(pos_x6.x,pos_x6.y);
            cv.lineTo(pos_x7.x,pos_x7.y);
            //cv.fill();
            cv.stroke();
        }
        else if (i % 2 == 0) {
            aMemSize = 2.5;
            //ライン描画
            cv.lineWidth = aMemSize;
            cv.lineCap = "round";
            cv.beginPath();
            //cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
            cv.moveTo(pos_x6.x,pos_x6.y);
            cv.lineTo(pos_x.x,pos_x.y);
            //cv.fill();
            cv.stroke();
        }

        
    }

    // Canvasの色、フォント
    cv.fillStyle = "#EEEEEE";
    cv.font = "bold italic " + fSize * 0.9 + "px 'arial'";
    cv.shadowColor = '#9F9F9F';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;
    cv.shadowBlur = 8;


    // 文字盤表示
    var MeterNotch = 20;
    if ( LocMeterMaxSpeed >= 200) {
        MeterNotch = 40;
    }
    for (var i = 0; i <= LocMeterMaxSpeed; i++) {
        if(i % MeterNotch == 0) {
            var radian = ((MeterRangeDeg_E259 / LocMeterMaxSpeed) * i + MeterStartDeg_E259) * Math.PI / 180;
            //var xx = center.x + (hLen - 23) * Math.cos(radian) ;
            //var yy = center.y + (hLen - 23) * Math.sin(radian) + fSize / 4;
            var xx = center.x + (hLen+10) * Math.cos(radian) ;
            var yy = center.y + (hLen+10) * Math.sin(radian) + fSize / 4;
            var aSpeedMeterText = i;
            var aMetrics3 = cv.measureText(aSpeedMeterText);
            cv.fillText(aSpeedMeterText, xx - (aMetrics3.width * 0.8 / 2), yy,aMetrics3.width * 0.9);
        }
    }
    

    /*速度単位表示*/
    cv.font = "italic bold " + fSize * 0.7 + "px 'arial'";
    
    var aMetrics2 = cv.measureText("km/h");
    cv.fillText("km/h", center.x - (aMetrics2.width / 2) + scale /3, center.y + scale / 2.0 - 8);


    CacheMeterBG.src = canvas.toDataURL('image/png');
    CachedImage = 1;
}


function drawMeter_E259(inSpeed, inScale) {
    if (CachedImage == 0) {
        drawMeterBackground(inScale);
        CachedImage = 1;
    }



    var inValue = Math.round((inSpeed * MeterRangeDeg_E259) / 1023);

    var canvas = document.getElementById("myCanvas");
    var cv = canvas.getContext("2d");
    var scale = inScale * 10
    var center = {
        x: scale / 2,
        y: scale / 2
    };
    var hLen = scale * 0.8 / 2; // 針の長さ
    var fSize = scale / 9; // フォントサイズ
    var rLen = scale / 2.5;

    CenterX = center.x;
    CenterY = center.y;

    //影は無効
    cv.shadowBlur = 0;
    cv.shadowColor = 'none';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;

    // メーター背景の円描画
    cvSize = document.getElementById("myCanvas").getAttribute("width");

    //背景を白に描画
    cv.fillStyle = "#EEEEEE";
    //cv.fillRect(0,0, cvSize, cvSize);

    //画像描画
    cv.drawImage(CacheMeterBG, 0, 0);

    // 値表示
    cv.font = "bold Italic " + fSize * 2 + "px 'arial'";
    //cv.textAlign = "end";
   /* ROBOT mark*/
   switch(ROBOT_CurrentState())
   {
       case 1:
        cv.drawImage(imageROBOT, center.x - (50 / 2), center.y - 80, 50, 55);
       break;

       case 2:
        cv.drawImage(imageROBOT2, center.x - (50 / 2), center.y - 80, 50, 63);
           break;

        default:
        break;
   }

    var aMetrics = cv.measureText(Math.round(inSpeed * LocMeterMaxSpeed / 1024));
    cv.fillText(Math.round(inSpeed * LocMeterMaxSpeed / 1024), center.x - (aMetrics.width) + scale / 4, center.y +
        scale / 2.05);

    /* 進行方向表示 */
    cv.font = "bold " + fSize * 0.75 + "px 'arial'";
    var aMetrics3 = cv.measureText(LocDir[modeLocIndex]);
    cv.fillText(LocDir[modeLocIndex], center.x - (aMetrics3.width / 2), center.y + scale / 4);

    /* 三角形を描く */
    cv.beginPath();

    if( LocDir[modeLocIndex] == "FWD")
    {
        cv.moveTo(center.x + 10, center.y + (scale / 4) - 30);
        cv.lineTo(center.x +  0, center.y + (scale / 4) - 40);
        cv.lineTo(center.x - 10, center.y + (scale / 4) - 30);
    }
    else
    {
        cv.moveTo(center.x + 10, center.y + (scale / 4) + 10);
        cv.lineTo(center.x +  0, center.y + (scale / 4) + 20);
        cv.lineTo(center.x - 10, center.y + (scale / 4) + 10);
    }
    cv.closePath();
    /* 三角形を塗りつぶす */
    cv.fill();

     /* ATC mark */

    if( gATCSpeed >= 0)
    {

        if( gATCStopTimer == 0)
        {
            DrawATCMark(cv, gATCSpeed, center, rLen);
        }
        else
        {

            for( var i = Math.trunc(gATCSpeedStop / 42.66666666); i <= Math.ceil(gATCSpeed / 42.66666666); i++)
            {
                DrawATCMark(cv, i * 42.66666666, center, rLen);
            }

        }

    }

    //影は無効
    cv.shadowBlur = 0;
    cv.shadowColor = 'none';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;

    // 針(影)描画
    var hRadian = (inValue + MeterStartDeg_E259) * Math.PI / 180;
    var pos_x = cPoint(center, rLen - 30, hRadian);//先端
    var pos_x2 = cPoint(center, rLen - 50, hRadian);//途中の変曲点
    var a90deg = Math.PI / 2;
    var needle_width = 7;
    var pos_x3 = cPoint(center, rLen - 132, hRadian + a90deg * 2);//逆側の変曲点
    cv.strokeStyle = "#EEEEEE";
    cv.fillStyle = "#EEEEEE";
    cv.lineWidth = scale / 100;
    cv.beginPath();
    cv.moveTo(pos_x3.x + needle_width * Math.cos(hRadian - a90deg), pos_x3.y + needle_width * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x2.x + needle_width * Math.cos(hRadian - a90deg), pos_x2.y + needle_width * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x.x, pos_x.y);
    cv.lineTo(pos_x2.x + needle_width * Math.cos(hRadian + a90deg), pos_x2.y + needle_width * Math.sin(hRadian + a90deg));
    cv.lineTo(pos_x3.x + needle_width * Math.cos(hRadian + a90deg), pos_x3.y + needle_width * Math.sin(hRadian + a90deg));
    cv.closePath();
    //cv.stroke();
    cv.fill();
    // 針(中心)描画
    /*
    cv.strokeStyle = "#EEEEEE";
    cv.fillStyle = "#EEEEEE";
    cv.lineWidth = scale / 100;
    cv.beginPath();
    cv.moveTo(center.x + 8 * Math.cos(hRadian - a90deg), center.y + 8 * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x2.x + 6 * Math.cos(hRadian - a90deg), pos_x2.y + 6 * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x.x, pos_x.y);
    cv.lineTo(pos_x2.x + 6 * Math.cos(hRadian + a90deg), pos_x2.y + 6 * Math.sin(hRadian + a90deg));
    cv.lineTo(center.x + 8 * Math.cos(hRadian + a90deg), center.y + 8 * Math.sin(hRadian + a90deg));
    cv.closePath();
    cv.stroke();
    cv.fill();
    */

    //メータの中心円を書く
    // グラデーション指定
    /*
    var grad2 = cv.createRadialGradient(center.x / 1, center.y / 1, 0, center.x, center.y, scale / 6);// scale/10 中心の円大きさ
    grad2.addColorStop(0.00, "#444444");
    grad2.addColorStop(0.10, "#444444");
    grad2.addColorStop(0.15, "#BBBBBB");
    grad2.addColorStop(0.3, "#EEEEEE");
    grad2.addColorStop(0.35, "#222222");
    grad2.addColorStop(1.00, "#222222");
    cv.fillStyle = grad2;
    */

    cv.fillStyle = "#EEEEEE";
    cv.beginPath();
    cv.arc(center.x, center.y, scale / 24, 0, Math.PI * 2, false);// scale/10 中心の円大きさ
    cv.closePath();
    cv.fill();

    // 光沢を付ける（半透明の円描画）
    /*
    cv.fillStyle = 'rgba(255, 255, 255, 0.07)';
    cv.beginPath();
    cv.arc(center.x, center.y / 20, scale / 1.5, 0, Math.PI * 2, false);
    cv.closePath();
    cv.fill();
    */
    //ATC �}�[�N
    if( ATCSpeed >= 0)
    {
        var radian = ((270 * Math.round(60 * ATCSpeed / 1023) / 60) + 135) * Math.PI / 180;
        var xx = center.x + (rLen - 20) * Math.cos(radian);
        var yy = center.y + (rLen - 20) * Math.sin(radian);

	    cv.fillStyle = "#C02020";
	    cv.beginPath();

	    cv.arc(xx, yy, 4, Math.PI * 2, false);
	        
	    cv.closePath();
	    /* �O�p�`��h��Ԃ� */
	    cv.fill();
    }

 

    //cv.restore();
}

/* ↑オリジナルスキン*************************************** */
