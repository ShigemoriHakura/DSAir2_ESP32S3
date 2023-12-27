

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

    var canvas = document.getElementById("mapCanvasMain");
    canvas.addEventListener("mousedown", onClickLayoutCanvas);


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
        }).css("font-size", "1.0em");


        $(`#dialogMsg_msg`).text(inMessage);
        $("#dialogMsg").dialog("open");
    });
}



function OpenDialogAccAddrEdit() {
    /* 編集画面 */

    //Set DblAddr to LocEditForm
    $("#DblAddr2").val(Map_AccAddr[ChipIndex]);


    $(function () {
        $('p').css({
            'display': 'block'
        });
        $("#dialogAL2").dialog({
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

        $("#dialogAL2").dialog("open");
    });
}

$(function () {

    
    //アドレス編集画面のボタンイベント登録
    $("#NumAEnter").click(function () {
        var aAccAddr = $("#DblAddr2").val();

        if (aAccAddr == "") {
            aAccAddr = "1";
        } else {
            let aNumAccAddr = Number(aAccAddr);

            if( aNumAccAddr > 2044)
            {
                aAccAddr = "2044";
            }
            else if(aNumAccAddr <= 0)
            {
                aAccAddr = "1";
            }
            else
            {
                aAccAddr = aNumAccAddr.toString();
            }
        }

        //変数にセット
        Map_AccAddr[ChipIndex] = aAccAddr;
        DrawLayoutPanel();

        $("#dialogAL2").dialog('close');          
    });

    $("#NumA0").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "0");
    });

    $("#NumA1").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "1");
    });
    
    $("#NumA2").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "2");
    });

    $("#NumA3").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "3");
    });        

    $("#NumA4").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "4");
    });

    $("#NumA5").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "5");
    });

    $("#NumA6").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "6");
    });

    $("#NumA7").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "7");
    });

    $("#NumA8").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "8");
    });

    $("#NumA9").click(function () {
        $("#DblAddr2").val($("#DblAddr2").val() + "9");
    });

    $("#NumABS").click(function () {
        let aAddr = $("#DblAddr2").val();

        if( aAddr.length > 0)
        {
            $("#DblAddr2").val(aAddr.substr(0,aAddr.length - 1 ));
        }            
    });

    $("#NumAClear").click(function () {
        $("#DblAddr2").val("");
    });
});    

function onClickLoadMaps()
{

    var dlg = $('#dialogXml').dialog({
        autoOpen: false,
        modal: true,
        title: "Load Layout data",
        width: 440,
        height: 200,
        buttons: {
           "Load from File": function(){
                LAYOUT_Load_MapDatas();
                $(this).dialog("close");
           },
           
           "Load from Browser": function(){
                STORE_Load_MapDatas();
                $(this).dialog("close");
           },	      
           "Cancel": function(){
              $(this).dialog("close");
           }
        },
        close: function(){
           $('#dialogXml').empty();
        },
     });
 
     $('#dialogXml').append("<h2>Select how to load.</h2>");
     dlg.dialog('open');
    
}

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}
  

function LAYOUT_Load_MapDatas() {
 
  
    const showOpenFileDialog = () => {
      return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, text/plain';
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
  
      let aLayoutJsonFile = JSON.parse(content);
  
        if( aLayoutJsonFile.accaddr != null )
        {
            //表示系を全て更新
            for( var i = 0; i< 50 * 100; i++)
            {
                Map_AccAddr[i] = aLayoutJsonFile.accaddr[i];
                Map_Image[i] = aLayoutJsonFile.image[i];
            }

            //Map_Width = aLayoutJsonFile.width;
            //Map_Height = aLayoutJsonFile.height;

            //表示をアップデート
            DrawLayoutTool();
            DrawLayoutPanel();

        }
        else
        {
            OpenDialogMsg("JSON Layout Load Error!");
        }
 
    })();
  
  }


function onClickSaveMaps()
{

    var dlg = $('#dialogXml').dialog({
        autoOpen: false,
        modal: true,
        title: "Save Layout data",
        width: 440,
        height: 200,
        buttons: {
           "Save to File": function(){
                LAYOUT_Save_MapDatas();
                $(this).dialog("close");
           },
           
           "Save to Browser": function(){
                STORE_Save_MapDatas();
                OpenDialogMsg("Layout data saved on your browser!");
                $(this).dialog("close");
           },	      
           "Cancel": function(){
              $(this).dialog("close");
           }
        },
        close: function(){
           $('#dialogXml').empty();
        },
     });
 
     $('#dialogXml').append("<h2>Select how to save.</h2>");
     dlg.dialog('open');
    
}

function LAYOUT_Save_MapDatas()
{

  let aJsonData = {accaddr:Map_AccAddr, image:Map_Image, width:Map_Width, height:Map_Height};

  // データをJSON形式の文字列に変換する。
  const data = JSON.stringify(aJsonData);

  var textToWrite = data;
  var textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  var fileNameToSaveAs = "UnknownLayout.json";

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


function onClickClearMaps()
{

    var dlg = $('#dialogXml').dialog({
        autoOpen: false,
        modal: true,
        title: "Clear Layout data",
        width: 440,
        height: 200,
        buttons: {
           
           "Yes": function(){
                ClearMaps();
                ROUTE_Clear();

                DrawLayoutTool();
                DrawLayoutPanel();
            
                OpenDialogMsg("Layout data cleared!");               

                $(this).dialog("close");
           },	      
           "Cancel": function(){
              $(this).dialog("close");
           }
        },
        close: function(){
           $('#dialogXml').empty();
        },
     });
 
     $('#dialogXml').append("<h2>Would you clear Layout and Route?</h2>");
     dlg.dialog('open');






}



function ClearMaps()
{
    for( var i = 0; i< 50 * 100; i++)
    {
        Map_AccAddr[i] = 0;
        Map_Image[i] = 0;
    }
}

function OpenDialogRouteSelect()
{
    var dlg = $('#dialogRouteSelect').dialog({
        autoOpen: false,
        modal: true,
        title: "Select Route",
        width: 230,
        height: 370,
        buttons: {
          
           "Ok": function(){
                //変数にセット
                let aIndex = $('#route_selectbox_2').prop("selectedIndex");
                     
                if( aIndex == null)
                {
                    aIndex = 0;
                }
                else if (aIndex >= RouteItems.length)
                {
                    aIndex = 0;
                }

                Map_AccAddr[ChipIndex] = aIndex + 32768;//強制オフセット
                DrawLayoutPanel();
                
                $(this).dialog("close");
           },	      
           "Cancel": function(){
              $(this).dialog("close");
           }
        },

     });
 
     $(function () {

        $("#route_selectbox_2 option").remove();
 
        for (let i = 0; i < RouteItems.length; i++) {
            $('#route_selectbox_2').append($('<option>').html(i + '.' + RouteItems[i].name).val(RouteItems[i].id));
        }    
      });

     dlg.dialog('open');

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

            if( (Map_Image[ChipIndex] >= 24) && (Map_Image[ChipIndex] <= 27))
            {
                //ルート信号機の強制操作
                ROUTE_SetRoute(Map_AccAddr[ChipIndex] - 32768);
            }
            else
            {
                //通常のポイント・信号機
                ChangeAcc(Number(Map_AccAddr[ChipIndex] - 1));
            }            
        }
    }
    else if( ChipToolIndex == 1)
    {

        if( (Map_Image[ChipIndex] >= 24) && (Map_Image[ChipIndex] <= 27))
        {
            //ルート信号機データ設定モード
            OpenDialogRouteSelect();
        }
        else
        {
            //アドレス設定モード
            OpenDialogAccAddrEdit();
        }
    }
    else
    {
        //線路描画モード
        Map_Image[ChipIndex] = ChipToolIndex;
    }

     //レイアウトを再描画
     DrawAccPanel();
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

    for (var y = 0; y < 14; y++) {
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
    for (var ay = 0; ay < 14; ay++) {
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


            if (Map_Image [aIndex] > 1) {
                var aImageX = (Map_Image[aIndex]) % 4;
                var aImageY = Math.floor((Map_Image[aIndex]) / 4);

                if ((Map_Image [aIndex] < 10) || (ChipToolIndex > 1)) {
                    cv.drawImage(imagMapData, CHIPSIZE * aImageX, CHIPSIZE * aImageY, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                }
                else if (Map_AccAddr[aIndex] > 0) {

                    if( (Map_Image[aIndex] >= 24) && (Map_Image[aIndex] <= 27))
                    {

                        aTileImageOffset = 24;

                        //ルート信号機
                        var aImageX2 = Math.floor((Math.floor(Map_Image[aIndex]) + aTileImageOffset) % 4);
                        var aImageY2 = Math.floor((Math.floor(Map_Image[aIndex]) + aTileImageOffset) / 4);

                        if( RouteItems[Map_AccAddr[aIndex] - 32768] != null)
                        {
                            aImageY2 = aImageY2 + ((RouteItems[Map_AccAddr[aIndex] - 32768].status == 0) ? 6 : 0);
                        }
                        
                        cv.drawImage(imagMapData, CHIPSIZE * aImageX2, CHIPSIZE * aImageY2, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                        
                        //Address 

                        if( ChipToolIndex == 1)
                        {
                            cv.fillStyle = "#00FFFF";
                            cv.fillText("R" + (Map_AccAddr[aIndex] - 32768).toString(), xx + 5, yy + 14);
                        }                        

                    }
                    else
                    {
                        if (AccStatus[Number(Map_AccAddr[aIndex]) - 1] == 0) {
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

                        //オフセット
                        if( Map_Image[aIndex] >= 20)
                        {
                            aTileImageOffset = 24;
                        }
                        else
                        {
                            //Nothig to do
                            aTileImageOffset = 26;
                        }

                        var aImageX2 = Math.floor((Math.floor(Map_Image[aIndex]) + aTileImageOffset) % 4);
                        var aImageY2 = Math.floor((Math.floor(Map_Image[aIndex]) + aTileImageOffset) / 4);

                        aImageY2 = aImageY2 + ((AccStatus[Number(Map_AccAddr[aIndex]) - 1] == 0 ? 6 : 0));
                        cv.drawImage(imagMapData, CHIPSIZE * aImageX2, CHIPSIZE * aImageY2, CHIPSIZE, CHIPSIZE, xx, yy, CHIPSIZE, CHIPSIZE);
                        
                        //Address 

                        if( ChipToolIndex == 1)
                        {
                            cv.fillStyle = "#FF00FF";
                            cv.fillText(Map_AccAddr[x + y * Map_Width], xx + 5, yy + 14);
                        }
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


