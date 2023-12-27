

var imagMapData = new Image();
imagMapData.src = "/SD_WLAN/c/acc/RAILMAP.png";

var CHIPSIZE = 48;
var ChipToolIndex = 0;
var ChipIndex = 0;
var DLG_Cancel = 0;

$(function () {
    $('#mapboxMain').scroll(function() {
        DrawLayoutPanel();
        //$('#labelMapMsg').text($(this).scrollTop() + "," + $(this).scrollLeft());
    });
});

function OpenDialogMsg(inMessage) {

    $(function () {
        $('p').css({
            'display': 'block'
        });
        $("#dialogMsg").dialog({
            dialogClass: 'MsgDlgClass',
            autoOpen: false,
            maxWidth: 400,
            maxHeight: 200,
            width: 420,
            height: 220,
            show: "fade",
            hide: "fade",
            modal: true,
            buttons: {
                "OK": function () {

                    $(this).dialog('close');
                }
            }
        }).css("font-size", "1.5em");


        $(`#dialogMsg_msg`).text(inMessage);
        $("#dialogMsg").dialog("open");
    });
}



function OpenDialogAccAddrEdit() {
    /* 編集画面 */

    //Set DblAddr to LocEditForm
    $(DblAddr).val(Map_AccAddr[ChipIndex]);


    $(function () {
        $('p').css({
            'display': 'block'
        });
        $("#dialogAL").dialog({
            dialogClass: 'LocEditDlgClass',
            autoOpen: false,
            maxWidth: 600,
            maxHeight: 320,
            width: 560,
            height: 300,
            show: "fade",
            hide: "fade",
            modal: true,
            buttons: {
                "0": function () {
                    $(DblAddr).val($(DblAddr).val() + "0");
                },
                "1": function () {
                    $(DblAddr).val($(DblAddr).val() + "1");
                },
                "2": function () {
                    $(DblAddr).val($(DblAddr).val() + "2");
                },
                "3": function () {
                    $(DblAddr).val($(DblAddr).val() + "3");
                },
                "4": function () {
                    $(DblAddr).val($(DblAddr).val() + "4");
                },
                "CLR": function () {
                    $(DblAddr).val("");
                },


                "5": function () {
                    $(DblAddr).val($(DblAddr).val() + "5");
                },
                "6": function () {
                    $(DblAddr).val($(DblAddr).val() + "6");
                },
                "7": function () {
                    $(DblAddr).val($(DblAddr).val() + "7");
                },
                "8": function () {
                    $(DblAddr).val($(DblAddr).val() + "8");
                },
                "9": function () {
                    $(DblAddr).val($(DblAddr).val() + "9");
                },
                "OK": function () {
                    var aAccAddr = $(DblAddr).val();

                    if (aAccAddr == "") {
                        aAccAddr = "0";
                    } else {

                    }

                    //変数にセット
                    Map_AccAddr[ChipIndex] = aAccAddr;
                    DrawLayoutPanel();

                    $(this).dialog('close');
                }
            }
        }).css("font-size", "1.5em");

        $("#dialogAL").dialog("open");
    });
}




function onClickSaveMaps()
{
    STORE_Save_MapDatas();

    OpenDialogMsg("Layout data saved!");
}

function onClickClearMaps()
{
    ClearMaps();

    DrawLayoutTool();
    DrawLayoutPanel();

    OpenDialogMsg("Layout data cleared!");
}



function ClearMaps()
{
    for( var i = 0; i< 50 * 100; i++)
    {
        Map_AccAddr[i] = 0;
        Map_Image[i] = 0;
    }
}

function onClickLayoutCanvas(e) {

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xx = Math.floor(x / CHIPSIZE);
    var yy = Math.floor(y / CHIPSIZE);


    ChipIndex = (yy * Map_Width) + xx;

    if( ChipToolIndex == 0)
    {
        //操作モード
        if ((Map_AccAddr[ChipIndex] > 0) && (PowerStatus != 0)) {
            ChangeAcc(Number(Map_AccAddr[ChipIndex] - 1));
        }
    }
    else if( ChipToolIndex == 1)
    {
        //アドレス設定モード
        OpenDialogAccAddrEdit();

    }
    else
    {
        //線路描画モード
        Map_Image[ChipIndex] = ChipToolIndex;
    }

     //レイアウトを再描画
    DrawLayoutPanel();
}

function onClickLayoutTool(e) {

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xx = Math.floor(x / CHIPSIZE);
    var yy = Math.floor(y / CHIPSIZE);


    ChipToolIndex = (yy * 2) + xx;

 
    DrawLayoutTool();
    DrawLayoutPanel();

}

function DrawLayoutTool()
{
    var canvas = document.getElementById("mapCanvasTool");
    var cv = canvas.getContext("2d");
 
    canvas.addEventListener("mousedown", onClickLayoutTool);

    //�T�C�Y�̎擾
    cvSize = canvas.getAttribute("width");
    cv.clearRect(0, 0, cvSize, cvSize);

    cv.shadowBlur = 0;
    cv.fillStyle = '#000000';
    cv.strokeStyle = '#202020';
    cv.beginPath();
    cv.moveTo(0, 0);
    cv.lineTo(0 + Map_Width * CHIPSIZE, 0);
    cv.lineTo(0 + Map_Width * CHIPSIZE, 0 + Map_Height * CHIPSIZE);
    cv.lineTo(0, 0 + Map_Height * CHIPSIZE);
    cv.lineWidth = "1px";
    cv.lineCap = "round";
    cv.closePath();
    cv.fill();
    cv.stroke();    

    for (var y = 0; y < 12; y++) {
        for (var x = 0; x < 2; x++) {

            var aIndex = y * 2 + x;

            var xx = x * CHIPSIZE;
            var yy = y * CHIPSIZE;

            var aImageX = aIndex % 4;
            var aImageY = Math.floor(aIndex / 4);
            
            cv.drawImage(imagMapData, CHIPSIZE * aImageX, CHIPSIZE * aImageY, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);

        }

    }

    cv.lineWidth = "1px";
    cv.strokeStyle = '#202020';

    // grid
    for (var ay = 0; ay < 12; ay++) {
        cv.moveTo(0, ay * CHIPSIZE);
        cv.lineTo(Map_Width * CHIPSIZE, ay * CHIPSIZE);
        cv.closePath();
        cv.stroke();
    }

    for (var ax = 0; ax < 2; ax++) {
        cv.moveTo(ax * CHIPSIZE, 0);
        cv.lineTo(ax * CHIPSIZE, Map_Height * CHIPSIZE);
        cv.closePath();
        cv.stroke();

    }

    //selected item
    cv.strokeStyle = '#F02020';
    cv.beginPath();
    cv.rect((ChipToolIndex % 2) * CHIPSIZE, Math.floor(ChipToolIndex / 2) * CHIPSIZE, CHIPSIZE, CHIPSIZE);
    cv.closePath();
    cv.stroke();



}



function DrawLayoutPanel() {
    var canvas = document.getElementById("mapCanvasMain");
    var cv = canvas.getContext("2d");
    var aTileImageOffset = 26;

    canvas.addEventListener("mousedown", onClickLayoutCanvas);

    //�T�C�Y�̎擾
    cvSize = canvas.getAttribute("width");
    cv.clearRect(0, 0, cvSize, cvSize);

    cv.shadowBlur = 0;
    cv.fillStyle = '#000000';
    cv.strokeStyle = '#202020';
    cv.beginPath();
    cv.moveTo(0, 0);
    cv.lineTo(0 + Map_Width * CHIPSIZE, 0);
    cv.lineTo(0 + Map_Width * CHIPSIZE, 0 + Map_Height * CHIPSIZE);
    cv.lineTo(0, 0 + Map_Height * CHIPSIZE);
    cv.lineWidth = "1px";
    cv.lineCap = "round";
    cv.closePath();
    cv.fill();
    cv.stroke();

    var aScrollY = Math.floor($('#mapboxMain').scrollTop() / CHIPSIZE);
    var aScrollX = Math.floor($('#mapboxMain').scrollLeft() / CHIPSIZE);
 
    // Canvas�̐F�A�t�H���g
    cv.font = "14px 'arial'";

    // �|�C���g�\��
    for (var y = aScrollY; y < aScrollY + 15; y++) {
        for (var x = aScrollX; x < aScrollX + 20; x++) {

            var xx = x * CHIPSIZE;
            var yy = y * CHIPSIZE;

            var aIndex = y * Map_Width + x;


            if (Map_Image [x + y * Map_Width] > 1) {
                var aImageX = (Map_Image[x + y * Map_Width]) % 4;
                var aImageY = Math.floor((Map_Image[x + y * Map_Width]) / 4);

                if ((Map_Image [x + y * Map_Width] < 10) || (ChipToolIndex > 1)) {
                    cv.drawImage(imagMapData, CHIPSIZE * aImageX, CHIPSIZE * aImageY, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                }
                else if (Map_AccAddr[x + y * Map_Width] > 0) {
                    if (AccStatus[Number(Map_AccAddr[x + y * Map_Width]) - 1] == 0) {
                        cv.beginPath();
                        cv.arc(xx + 5, yy + 5, 4, 0, Math.PI * 2, false);
                        cv.lineWidth = "0px";
                        cv.fillStyle = "red";
                        cv.fill();
                    } else {
                        cv.beginPath();
                        cv.arc(xx + 5, yy + 5, 4, 0, Math.PI * 2, false);
                        cv.lineWidth = "0px";
                        cv.fillStyle = "green";
                        cv.fill();
                    }

                    if( Map_Image[x + y * Map_Width] >= 20)
                    {
                        aTileImageOffset = 24;
                    }
                    else
                    {
                        //Nothig to do
                        aTileImageOffset = 26;
                    }

                    var aImageX2 = Math.floor((Math.floor(Map_Image[x + y * Map_Width]) + aTileImageOffset) % 4);
                    var aImageY2 = Math.floor((Math.floor(Map_Image[x + y * Map_Width]) + aTileImageOffset) / 4);

                    aImageY2 = aImageY2 + ((AccStatus[Number(Map_AccAddr[x + y * Map_Width]) - 1] == 0 ? 6 : 0));
                    cv.drawImage(imagMapData, CHIPSIZE * aImageX2, CHIPSIZE * aImageY2, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                    
                    //Address 

                    if( ChipToolIndex == 1)
                    {
                        cv.fillStyle = "#FF00FF";
                        cv.fillText(Map_AccAddr[x + y * Map_Width], xx + 5, yy + 14);
                    }

                } else {
                    //
                    cv.drawImage(imagMapData, CHIPSIZE * aImageX, CHIPSIZE * aImageY, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                }


            }

        }

    }


    cv.lineWidth = "1px";


    // grid
    for (var ay = aScrollY; ay <  aScrollY + 15; ay++) {
        cv.moveTo(aScrollX * CHIPSIZE, ay * CHIPSIZE);
        cv.lineTo((aScrollX + 20) * CHIPSIZE, ay * CHIPSIZE);
        cv.closePath();
        cv.stroke();
    }

    for (var ax = aScrollX; ax < aScrollX + 20; ax++) {
        cv.moveTo(ax * CHIPSIZE, aScrollY * CHIPSIZE);
        cv.lineTo(ax * CHIPSIZE, (aScrollY + 15) * CHIPSIZE);
        cv.closePath();
        cv.stroke();
    }


    //selected item
    cv.strokeStyle = '#F02020';
    cv.beginPath();
    cv.rect((ChipIndex % Map_Width) * CHIPSIZE, Math.floor(ChipIndex / Map_Width) * CHIPSIZE, CHIPSIZE, CHIPSIZE);
    cv.closePath();
    cv.stroke();    



};


