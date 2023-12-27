//Meter Drawing Unit

var gSkinID = 0;//スキンの番号

var CacheMeterBG = new Image(); //メーター背景のキャッシュ
var CachedImage = 0;

var imageROBOT = new Image();
imageROBOT.src = "/SD_WLAN/img/btn_robot_mini50.png";
var imageROBOT2 = new Image();
imageROBOT2.src = "/SD_WLAN/img/btn_robot_teach_mini50.png";

function RefreshSkins()
{
    drawMeterBackground(40); 
    onDrawMeter(40); 
}


function onChangeSkins()
{

    //電源ON時は無効
    if( PowerStatus == 1)
    {
        return;
    }

    //スキン切り替え処理
    gSkinID = gSkinID + 1;

    if( gSkinID > 5)
    {
        gSkinID = 0;
    }

    //スキン番号の保存
    STORE_Save_CabSkin();

    //Refresh Meter cab screen
    RefreshSkins();
  
    
    switch(gSkinID)
    {

        case 0:
            toastr.info('Skin: Normal');
            break;

        case 1:
            toastr.info('Skin: E233');
            break;     

        case 2:
            toastr.info('Skin: E217');
            break;             

        case 3:
            toastr.info('Skin: E259');
            break;

        case 4:
            toastr.info('Skin: Kyukoku');
            break;                          
        case 5:
            toastr.info('Skin: Keikyu');
            break;         
    }


}

function drawMeterBackground(inScale) {

    switch(gSkinID)
    {
        case 0:
            document.getElementById("tab-cab").style.backgroundColor = "#ffffff"; 
            clearFunctionButtons();
            drawMeterBackground_Default(inScale);
        break;
        
        case 1:
            changeFunctionButtons();
            drawMeterBackground_E233(inScale);
        break;

        case 2:
            changeBackground_E217();
            changeFunctionButtons();
            drawMeterBackground_E217(inScale);
        break;

        case 3:
            changeBackground_E259();
            changeFunctionButtons();
            drawMeterBackground_E259(inScale);
        break;

        case 4:
            changeBackground_Eden();
            changeFunctionButtons();
            drawMeterBackground_Eden(inScale);
        break;

        case 5:
            changeBackground_Keikyu();
            changeFunctionButtons();
            drawMeterBackground_Keikyu(inScale);
        break; 
    }

}

function drawMeter(inSpeed, inScale) {

    switch(gSkinID)
    {
        case 0:
            drawMeter_Default(inSpeed, inScale);
        break;
        
        case 1:
            drawMeter_E233(inSpeed, inScale);
        break;

        case 2:
            drawMeter_E217(inSpeed, inScale);
        break;

        case 3:
            drawMeter_E259(inSpeed, inScale);
        break;

        case 4:
            drawMeter_Eden(inSpeed, inScale);
        break;

        case 5:
            drawMeter_Keikyu(inSpeed, inScale);
        break; 
     }
}


function changeFunctionButtons()
{

    //ファンクションボタンのCSS設定に強制介入
    document.getElementById("funcbox1").style.overflow = "hidden";
    document.getElementById("funcbox1").style.overflowY = "initial";

    document.getElementById("funcbox1").style.width = '175px';
    document.getElementById("funcbox1").style.height = '410px';

    document.getElementById("check0").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check1").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check2").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check3").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check4").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check5").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check6").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check7").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check8").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check9").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check10").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check11").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check12").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check13").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check14").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check15").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check16").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check17").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check18").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check19").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check20").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check21").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check22").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check23").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check24").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check25").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check26").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check27").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check28").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check29").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check30").nextElementSibling.style.fontSize = '0.79em';
    document.getElementById("check31").nextElementSibling.style.fontSize = '0.79em';
    
    document.getElementById("check0").nextElementSibling.style.width = '21px';
    document.getElementById("check1").nextElementSibling.style.width = '21px';
    document.getElementById("check2").nextElementSibling.style.width = '21px';
    document.getElementById("check3").nextElementSibling.style.width = '21px';
    document.getElementById("check4").nextElementSibling.style.width = '21px';
    document.getElementById("check5").nextElementSibling.style.width = '21px';
    document.getElementById("check6").nextElementSibling.style.width = '21px';
    document.getElementById("check7").nextElementSibling.style.width = '21px';
    document.getElementById("check8").nextElementSibling.style.width = '21px';
    document.getElementById("check9").nextElementSibling.style.width = '21px';
    document.getElementById("check10").nextElementSibling.style.width = '21px';
    document.getElementById("check11").nextElementSibling.style.width = '21px';
    document.getElementById("check12").nextElementSibling.style.width = '21px';
    document.getElementById("check13").nextElementSibling.style.width = '21px';
    document.getElementById("check14").nextElementSibling.style.width = '21px';
    document.getElementById("check15").nextElementSibling.style.width = '21px';
    document.getElementById("check16").nextElementSibling.style.width = '21px';
    document.getElementById("check17").nextElementSibling.style.width = '21px';
    document.getElementById("check18").nextElementSibling.style.width = '21px';
    document.getElementById("check19").nextElementSibling.style.width = '21px';
    document.getElementById("check20").nextElementSibling.style.width = '21px';
    document.getElementById("check21").nextElementSibling.style.width = '21px';
    document.getElementById("check22").nextElementSibling.style.width = '21px';
    document.getElementById("check23").nextElementSibling.style.width = '21px';
    document.getElementById("check24").nextElementSibling.style.width = '21px';
    document.getElementById("check25").nextElementSibling.style.width = '21px';
    document.getElementById("check26").nextElementSibling.style.width = '21px';
    document.getElementById("check27").nextElementSibling.style.width = '21px';
    document.getElementById("check28").nextElementSibling.style.width = '21px';
    document.getElementById("check29").nextElementSibling.style.width = '21px';
    document.getElementById("check30").nextElementSibling.style.width = '21px';
    document.getElementById("check31").nextElementSibling.style.width = '21px';


    document.getElementById("check0").nextElementSibling.style.height = '48px';
    document.getElementById("check1").nextElementSibling.style.height = '24px';
    document.getElementById("check2").nextElementSibling.style.height = '24px';
    document.getElementById("check3").nextElementSibling.style.height = '24px';
    document.getElementById("check4").nextElementSibling.style.height = '24px';
    document.getElementById("check5").nextElementSibling.style.height = '24px';
    document.getElementById("check6").nextElementSibling.style.height = '24px';
    document.getElementById("check7").nextElementSibling.style.height = '24px';
    document.getElementById("check8").nextElementSibling.style.height = '24px';
    document.getElementById("check9").nextElementSibling.style.height = '24px';
    document.getElementById("check10").nextElementSibling.style.height = '24px';
    document.getElementById("check11").nextElementSibling.style.height = '24px';
    document.getElementById("check12").nextElementSibling.style.height = '24px';
    document.getElementById("check13").nextElementSibling.style.height = '24px';
    document.getElementById("check14").nextElementSibling.style.height = '24px';
    document.getElementById("check15").nextElementSibling.style.height = '24px';
    document.getElementById("check16").nextElementSibling.style.height = '24px';
    document.getElementById("check17").nextElementSibling.style.height = '24px';
    document.getElementById("check18").nextElementSibling.style.height = '24px';
    document.getElementById("check19").nextElementSibling.style.height = '24px';
    document.getElementById("check20").nextElementSibling.style.height = '24px';
    document.getElementById("check21").nextElementSibling.style.height = '24px';
    document.getElementById("check22").nextElementSibling.style.height = '24px';
    document.getElementById("check23").nextElementSibling.style.height = '24px';
    document.getElementById("check24").nextElementSibling.style.height = '24px';
    document.getElementById("check25").nextElementSibling.style.height = '24px';
    document.getElementById("check26").nextElementSibling.style.height = '24px';
    document.getElementById("check27").nextElementSibling.style.height = '24px';
    document.getElementById("check28").nextElementSibling.style.height = '24px';
    document.getElementById("check29").nextElementSibling.style.height = '24px';
    document.getElementById("check30").nextElementSibling.style.height = '24px';
    document.getElementById("check31").nextElementSibling.style.height = '24px';
}


function clearFunctionButtons()
{

    //ファンクションボタンのCSS設定に強制介入
    document.getElementById("funcbox1").style.overflow = "auto";
    document.getElementById("funcbox1").style.overflowY = "scroll";

    document.getElementById("funcbox1").style.width = '150px';
    document.getElementById("funcbox1").style.height = '395px';

    
    document.getElementById("check0").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check1").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check2").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check3").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check4").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check5").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check6").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check7").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check8").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check9").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check10").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check11").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check12").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check13").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check14").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check15").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check16").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check17").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check18").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check19").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check20").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check21").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check22").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check23").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check24").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check25").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check26").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check27").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check28").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check29").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check30").nextElementSibling.style.fontSize = '1.5em';
    document.getElementById("check31").nextElementSibling.style.fontSize = '1.5em';
    
    document.getElementById("check0").nextElementSibling.style.width = '75px';
    document.getElementById("check1").nextElementSibling.style.width = '75px';
    document.getElementById("check2").nextElementSibling.style.width = '75px';
    document.getElementById("check3").nextElementSibling.style.width = '75px';
    document.getElementById("check4").nextElementSibling.style.width = '75px';
    document.getElementById("check5").nextElementSibling.style.width = '75px';
    document.getElementById("check6").nextElementSibling.style.width = '75px';
    document.getElementById("check7").nextElementSibling.style.width = '75px';
    document.getElementById("check8").nextElementSibling.style.width = '75px';
    document.getElementById("check9").nextElementSibling.style.width = '75px';
    document.getElementById("check10").nextElementSibling.style.width = '75px';
    document.getElementById("check11").nextElementSibling.style.width = '75px';
    document.getElementById("check12").nextElementSibling.style.width = '75px';
    document.getElementById("check13").nextElementSibling.style.width = '75px';
    document.getElementById("check14").nextElementSibling.style.width = '75px';
    document.getElementById("check15").nextElementSibling.style.width = '75px';
    document.getElementById("check16").nextElementSibling.style.width = '75px';
    document.getElementById("check17").nextElementSibling.style.width = '75px';
    document.getElementById("check18").nextElementSibling.style.width = '75px';
    document.getElementById("check19").nextElementSibling.style.width = '75px';
    document.getElementById("check20").nextElementSibling.style.width = '75px';
    document.getElementById("check21").nextElementSibling.style.width = '75px';
    document.getElementById("check22").nextElementSibling.style.width = '75px';
    document.getElementById("check23").nextElementSibling.style.width = '75px';
    document.getElementById("check24").nextElementSibling.style.width = '75px';
    document.getElementById("check25").nextElementSibling.style.width = '75px';
    document.getElementById("check26").nextElementSibling.style.width = '75px';
    document.getElementById("check27").nextElementSibling.style.width = '75px';
    document.getElementById("check28").nextElementSibling.style.width = '75px';
    document.getElementById("check29").nextElementSibling.style.width = '75px';
    document.getElementById("check30").nextElementSibling.style.width = '75px';
    document.getElementById("check31").nextElementSibling.style.width = '75px';

    document.getElementById("check0").nextElementSibling.style.height = '28px';
    document.getElementById("check1").nextElementSibling.style.height = '28px';
    document.getElementById("check2").nextElementSibling.style.height = '28px';
    document.getElementById("check3").nextElementSibling.style.height = '28px';
    document.getElementById("check4").nextElementSibling.style.height = '28px';
    document.getElementById("check5").nextElementSibling.style.height = '28px';
    document.getElementById("check6").nextElementSibling.style.height = '28px';
    document.getElementById("check7").nextElementSibling.style.height = '28px';
    document.getElementById("check8").nextElementSibling.style.height = '28px';
    document.getElementById("check9").nextElementSibling.style.height = '28px';
    document.getElementById("check10").nextElementSibling.style.height = '28px';
    document.getElementById("check11").nextElementSibling.style.height = '28px';
    document.getElementById("check12").nextElementSibling.style.height = '28px';
    document.getElementById("check13").nextElementSibling.style.height = '28px';
    document.getElementById("check14").nextElementSibling.style.height = '28px';
    document.getElementById("check15").nextElementSibling.style.height = '28px';
    document.getElementById("check16").nextElementSibling.style.height = '28px';
    document.getElementById("check17").nextElementSibling.style.height = '28px';
    document.getElementById("check18").nextElementSibling.style.height = '28px';
    document.getElementById("check19").nextElementSibling.style.height = '28px';
    document.getElementById("check20").nextElementSibling.style.height = '28px';
    document.getElementById("check21").nextElementSibling.style.height = '28px';
    document.getElementById("check22").nextElementSibling.style.height = '28px';
    document.getElementById("check23").nextElementSibling.style.height = '28px';
    document.getElementById("check24").nextElementSibling.style.height = '28px';
    document.getElementById("check25").nextElementSibling.style.height = '28px';
    document.getElementById("check26").nextElementSibling.style.height = '28px';
    document.getElementById("check27").nextElementSibling.style.height = '28px';
    document.getElementById("check28").nextElementSibling.style.height = '28px';
    document.getElementById("check29").nextElementSibling.style.height = '28px';
    document.getElementById("check30").nextElementSibling.style.height = '28px';
    document.getElementById("check31").nextElementSibling.style.height = '28px';
}


function drawMeterBackground_Default(inScale) {

    var canvas = document.getElementById("myCanvas");
    var cv = canvas.getContext("2d");
    var scale = inScale * 10
    var center = {
        x: scale / 2,
        y: scale / 2
    };
    var hLen = scale * 0.8 / 2; // �j�̒���
    var fSize = scale / 8; // �t�H���g�T�C�Y
    var rLen = scale / 2;

    CenterX = center.x;
    CenterY = center.y;

    // ���[�^�[�w�i�̉~�`��
    cvSize = document.getElementById("myCanvas").getAttribute("width");
    cv.clearRect(0, 0, cvSize, cvSize);

    //�w�i�𔒂ɕ`��
    cv.fillStyle = "#FFFFFF";
    cv.fillRect(0, 0, cvSize, cvSize);

    //Draw meter
    cv.beginPath();
    cv.arc(center.x, center.y, scale / 2, 0, Math.PI * 2, false);
    // �O���f�[�V�����w��
    var grad = cv.createRadialGradient(center.x / 1, center.y / 1, 0, center.x, center.y, scale / 2);
    grad.addColorStop(0.00, "#202020");
    grad.addColorStop(0.92, "#404040");
    grad.addColorStop(0.95, "#0A0A0A");
    grad.addColorStop(0.97, "#707070");
    grad.addColorStop(1.00, "#8A8A8A");
    cv.fillStyle = grad;
    cv.fill();

    // Canvas�̐F�A�t�H���g
    cv.fillStyle = "#9F9F9F";


    // �������\��
    for (var i = 0; i <= 60; i++) {
        var radian = ((270 / 60) * i + 135) * Math.PI / 180;
        var xx = center.x + (rLen - 20) * Math.cos(radian);
        var yy = center.y + (rLen - 20) * Math.sin(radian);

        var aMemSize = 2;

        if (i % 10 == 0) {
            aMemSize = 6;
        }
        else if (i % 5 == 0) {
            aMemSize = 4;
        }                
        else {
            //aMemSize = 2;
        }


        cv.beginPath();
        cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
        cv.fill();
    }

    // Canvas�̐F�A�t�H���g
    cv.fillStyle = "#FFFFFF";
    cv.font = "bold " + fSize * 0.55 + "px 'verdana'";
    cv.shadowColor = '#9F9F9F';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;
    cv.shadowBlur = 16;

    // �����Օ\��
    for (var i = 0; i <= 6; i++) {
        var radian = ((270 / 6) * i + 135) * Math.PI / 180;
        var xx = center.x + (hLen - 20) * Math.cos(radian) ;
        var yy = center.y + (hLen - 20) * Math.sin(radian) + fSize / 4;
        var aSpeedMeterText = Math.round(i * (LocMeterMaxSpeed / 6));
        var aMetrics3 = cv.measureText(aSpeedMeterText);
        cv.fillText(aSpeedMeterText, xx - (aMetrics3.width / 2), yy);
    }

    /*���x�P�ʕ\��*/
    cv.font = "bold " + fSize * 0.5 + "px 'verdana'";
    var aMetrics2 = cv.measureText("km/h");
    cv.fillText("km/h", center.x - (aMetrics2.width / 2), center.y + scale / 3.8);

    CacheMeterBG.src = canvas.toDataURL('image/png');
    CachedImage = 1;
}

function drawMeter_Default(inSpeed, inScale) {
    if (CachedImage == 0) {
        drawMeterBackground(inScale);
        CachedImage = 1;
    }



    var inValue = Math.round((inSpeed * 270) / 1023);

    var canvas = document.getElementById("myCanvas");
    var cv = canvas.getContext("2d");
    var scale = inScale * 10
    var center = {
        x: scale / 2,
        y: scale / 2
    };
    var hLen = scale * 0.8 / 2; // �j�̒���
    var fSize = scale / 9; // �t�H���g�T�C�Y
    var rLen = scale / 2;

    CenterX = center.x;
    CenterY = center.y;

    //�e�͖���
    cv.shadowBlur = 0;
    cv.shadowColor = 'none';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;

    // ���[�^�[�w�i�̉~�`��
    cvSize = document.getElementById("myCanvas").getAttribute("width");

    //�w�i�𔒂ɕ`��
    cv.fillStyle = "#FFFFFF";
    //cv.fillRect(0,0, cvSize, cvSize);

    //�摜�`��
    cv.drawImage(CacheMeterBG, 0, 0);

   /* ROBOT mark*/
   switch(ROBOT_CurrentState())
   {
       case 1:
        cv.drawImage(imageROBOT, center.x - (50 / 2), center.y - 100, 50, 55);
       break;

       case 2:
        cv.drawImage(imageROBOT2, center.x - (50 / 2), center.y - 100, 50, 63);
           break;

        default:
        break;
   }

    //Font
    cv.font = "bold " + fSize * 0.7 + "px 'verdana'";

    cv.shadowColor = '#9F9F9F';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;
    cv.shadowBlur = 16;

    var aMetrics = cv.measureText(Math.round(inSpeed * LocMeterMaxSpeed / 1024));
    cv.fillText(Math.round(inSpeed * LocMeterMaxSpeed / 1024), center.x - (aMetrics.width / 2), center.y +
        scale / 5);

    /* �i�s�����\�� */
    var aMetrics3 = cv.measureText(LocDir[modeLocIndex]);
    cv.fillText(LocDir[modeLocIndex], center.x - (aMetrics3.width / 2), center.y + scale / 2.5);

    /* Direction mark */
    cv.beginPath();

    if( LocDir[modeLocIndex] == "FWD")
    {
        cv.moveTo(center.x + 10, center.y + (scale / 2.5) - 30);
        cv.lineTo(center.x +  0, center.y + (scale / 2.5) - 40);
        cv.lineTo(center.x - 10, center.y + (scale / 2.5) - 30);
    }
    else
    {
        cv.moveTo(center.x + 10, center.y + (scale / 2.5) + 10);
        cv.lineTo(center.x +  0, center.y + (scale / 2.5) + 20);
        cv.lineTo(center.x - 10, center.y + (scale / 2.5) + 10);
    }
    cv.closePath();
    /* �O�p�`��h��Ԃ� */
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

    //�e�͖���
    cv.shadowBlur = 0;
    cv.shadowColor = 'none';
    cv.shadowOffsetX = 0;
    cv.shadowOffsetY = 0;

    // �j(�e)�`��
    var hRadian = (inValue + 135) * Math.PI / 180;
    var a90deg = Math.PI / 2;
    var pos_x = cPoint(center, rLen - 25, hRadian);
    cv.strokeStyle = "#550000";
    cv.lineWidth = scale / 50;
    cv.beginPath();
    cv.moveTo(center.x + 8 * Math.cos(hRadian - a90deg), center.y + 8 * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x.x, pos_x.y);
    cv.lineTo(center.x + 8 * Math.cos(hRadian + a90deg), center.y + 8 * Math.sin(hRadian + a90deg));
    cv.closePath();
    cv.stroke();

    // �j(���S)�`��
    cv.strokeStyle = "#FF5555";
    cv.fillStyle = "#FF5555";
    cv.lineWidth = scale / 100;
    cv.beginPath();
    cv.moveTo(center.x + 8 * Math.cos(hRadian - a90deg), center.y + 8 * Math.sin(hRadian - a90deg));
    cv.lineTo(pos_x.x, pos_x.y);
    cv.lineTo(center.x + 8 * Math.cos(hRadian + a90deg), center.y + 8 * Math.sin(hRadian + a90deg));
    cv.closePath();
    cv.stroke();
    cv.fill();

    //���[�^�̒��S�~������
    // �O���f�[�V�����w��
    var grad2 = cv.createRadialGradient(center.x / 1, center.y / 1, 0, center.x, center.y, scale / 20);
    grad2.addColorStop(0.00, "#505050");
    grad2.addColorStop(0.95, "#515151");
    grad2.addColorStop(1.00, "#707070");
    cv.fillStyle = grad2;
    //cv.fillStyle = 'rgb(50, 50, 50)';
    cv.beginPath();
    cv.arc(center.x, center.y, scale / 20, 0, Math.PI * 2, false);
    cv.closePath();
    cv.fill();

    // �����t����i�������̉~�`��j
    cv.fillStyle = 'rgba(255, 255, 255, 0.07)';
    cv.beginPath();
    cv.arc(center.x, center.y / 20, scale / 1.5, 0, Math.PI * 2, false);
    cv.closePath();
    cv.fill();
    
    
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


function DrawATCMark(inCV, inSpeed, inCenter, inR)
{
    var aATCValue = Math.round((inSpeed * 270) / 1023);

    if( inSpeed == 0)
    {
        inCV.strokeStyle = "#CC1111";
        inCV.fillStyle = "#FF3333";
    }
    else
    {
        inCV.strokeStyle = "#11CC11";
        inCV.fillStyle = "#33FF33";
    }



    inCV.beginPath();
    var aATCmarkX = inCenter.x - (inR - 10) * Math.cos((aATCValue - 45) * Math.PI / 180);
    var aATCmarkY = inCenter.y - (inR - 10) * Math.sin((aATCValue - 45) * Math.PI / 180);
    var aATCmarkX2 = inCenter.x - (inR - 2) * Math.cos((aATCValue - 45 - 1.6) * Math.PI / 180);
    var aATCmarkY2 = inCenter.y - (inR - 2) * Math.sin((aATCValue - 45 - 1.6) * Math.PI / 180);
    var aATCmarkX3 = inCenter.x - (inR - 2) * Math.cos((aATCValue - 45 + 1.6) * Math.PI / 180);
    var aATCmarkY3 = inCenter.y - (inR - 2) * Math.sin((aATCValue - 45 + 1.6) * Math.PI / 180);

    inCV.moveTo(aATCmarkX, aATCmarkY);
    inCV.lineTo(aATCmarkX2, aATCmarkY2);//11.5 is 20(25-5) / root3/2
    inCV.lineTo(aATCmarkX3, aATCmarkY3);
    inCV.closePath();
    inCV.fill();  
}



function CalcSpeedMeter(rx, ry) {

    var aR = Math.sqrt(rx * rx + ry * ry);

    if ((aR < 40) || (aR > 200)) {
        /* �~�̓�������ъO���͖������� */
        return;
    }

    var aTheta = Math.atan2(ry, rx) + Math.PI;

    var aTheta_r = (aTheta * 180 / Math.PI);


    /* 10deg�ȏジ��Ă���ꍇ�͖������鏈���Ƃ��� */
    if ((aTheta_r < 300) && (aTheta_r > 240)) {
        return;
    }

    /* 225deg - 315deg�͖����͈́B */

    /* ���e�͈͂̒���(0speed) */
    if ((aTheta_r <= 320) && (aTheta_r >= 300)) {
        aTheta_r = 315;
    }

    /* ���e�͈͂̒���(max speed) */
    if ((aTheta_r >= 220) && (aTheta_r <= 240)) {
        aTheta_r = 225;
    }

    /* ���K�� */
    if (aTheta_r > 300) {
        aTheta_r = aTheta_r - 360 + 45;

    } else {
        aTheta_r = aTheta_r + 45;

    }

    //alert(aTheta_r);

    /* �p�x���瑬�x�l�Ɋ��Z�i���x��32d���ɂ킴�Ɨ��Ƃ��ď����y�ʉ��j */
    return Math.round((aTheta_r) * 1024 / 270);

};
