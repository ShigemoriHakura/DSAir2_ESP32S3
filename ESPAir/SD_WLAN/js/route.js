const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


var RouteItems = []; //ルートデータ本体
var RouteID = 0;
var SelectedRouteIndex = -1; //エディタでのルート選択インデックス
var MaxIndex = 0;
var SubItemMax = 0;
var gRoute_Disable = 0; //ルートシグナル機能有効
var gRoute_RequireUpdate = 0;//アップデート要求

initRouteItems();
applyRouteItems();
ROUTE_ShareMemLoad();

function initRouteItems() {
  addNewRouteItems();

}

function ROUTE_Clear()
{
  RouteItems = [];
  addNewRouteItems();

  //表示系を全て更新
  $("#route_selectbox option").remove();
  applyRouteItems();  

}

function addNewRouteItems() {
  let aSubItems = [];
  let addData = {
    id: RouteID,
    name: "Route " + RouteID.toString(),
    acc_addr: 1,
    dir: 0,
    ignore_open: 0,
    nomonitor: 0,
    disable: 0,
    status: 0,
    subitems: aSubItems
  };

  RouteItems.push(addData);
  RouteID++;
}

function addNewRouteSubItems(inIndex) {
  let addSubData = {
    id: 0,
    index: SubItemMax,
    type: 0,
    addr: 1,
    dir: 0,
    operation: 0
  };

  RouteItems[inIndex].subitems.push(addSubData);
  SubItemMax++;

}

function deleteRouteSubItems(inRouteIndex, inSubItemIndex) {

  if (inSubItemIndex < RouteItems[inRouteIndex].subitems.length) {

    var newData = RouteItems[inRouteIndex].subitems.filter(function (item, index) {
      if (index != inSubItemIndex) return true;
    });

    RouteItems[inRouteIndex].subitems = newData;

  }

}

function destroyClickedElement(event) {
  // remove the link from the DOM
  document.body.removeChild(event.target);
}


function loadRouteItemsFromFile() {


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

    RouteItems = JSON.parse(content);

    //表示系を全て更新
    $("#route_selectbox option").remove();
    applyRouteItems();


  })();

}

function saveRouteItems(inFileName) {

  // データをJSON形式の文字列に変換する。
  const data = JSON.stringify(RouteItems);

  var textToWrite = data;
  var textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  var fileNameToSaveAs = inFileName;

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

function findRoute(inRouteName) {
  //単語の次元（単語の位置No.）
  aIndex = -1;

  for (let i = 0; i < RouteItems.length; i++) {
    if (RouteItems[i].name == inRouteName) {
      aIndex = i;
      break;
    }
  }

  return aIndex;

}

function applyRouteItems() {
  //ルート一覧に反映

  $(function () {
    for (let i = 0; i < RouteItems.length; i++) {
      addRouteList(i);
    }

  });
}

function addRouteList(inIndex) {
  //Add
  $('#route_selectbox').append($('<option value=' + inIndex + '>').html(inIndex + '.' + RouteItems[inIndex].name).val(RouteItems[inIndex].id));

}

function deleteRouteItems(inIndex) {
  //

  if (inIndex < RouteItems.length) {

    var newData = RouteItems.filter(function (item, index) {
      if (index != inIndex) return true;
    });

    RouteItems = newData;

  }


}



function updateRouteList(inIndex) {
      //表示系を全て更新
      $("#route_selectbox option").remove();
      applyRouteItems();

      //選択しなおし
      $('#route_selectbox').val(inIndex);
}

function addSubRouteList(inIndex) {

  //テンプレート行のjqueryオブジェクト取得
  var obj = $('#routebody_subitems').clone(true);
  //非表示スタイルを表示にする
  obj.show();
  //Indexを増やす
  MaxIndex += 1;
  obj.attr("data-index", MaxIndex);
  obj.attr("id", "");
  //最後尾にjqueryオブジェクト追加
  $('table#route_table tbody').append(obj);

}



$(document).ready(function () {
  // CSSで非表示にした1行目の行を複製し、その行の下に挿入
  $('#routetbody>tr')
    //.clone(true)
    .insertAfter($('#routetbody>tr'));


  // 行を削除する
  $(document).on('click', '#routetbody>tr:gt(1) .upList', function () {
    var t = $(this)
      .parent()
      .parent();
    if (t.prev('tr')) {
      t.insertBefore(t.prev('tr')[0]);
    }
  });

  // 行を一つ上に移動させる
  $(document).on('click', '.downList', function () {
    var t = $(this)
      .parent()
      .parent();
    if (t.next('tr')) {
      t.insertAfter(t.next('tr')[0]);
    }
  });

  // 行を一つ下に移動させる
  $(document).on('click', '#ButtonRouteItemPlus', function () {

    addSubRouteList(SelectedRouteIndex);
    addNewRouteSubItems(SelectedRouteIndex);

  });

  // 行の一部を変更する
  $(document).on('click', '#ButtonRouteItemMinus', function () {

    let aIndex = $(this).closest('tr').index();

    $(this)
      .parent()
      .parent()
      .remove();

    //Delete Selected Items
    deleteRouteSubItems(SelectedRouteIndex, aIndex - 1);

  });

  //ルート一覧
  $('#route_selectbox').change(function () {
    let aIndex = $(this).prop("selectedIndex");

    SelectRoute(aIndex);

  });

  function SelectRoute(inIndex)
  {
    let aIndex = inIndex;

    if (aIndex <= RouteItems.length) {
      $("#route_sub_name").val(RouteItems[aIndex].name);
      $("#route_sub_disable").val(RouteItems[aIndex].disable);
      $("#route_sub_addr").val(RouteItems[aIndex].acc_addr);
      $("#route_sub_signaldir").val(RouteItems[aIndex].dir);
      $("#route_openstate").val(RouteItems[aIndex].ignore_open);

      //既に表示されているものをいったん削除して入れ直す
      var obj = $('#routebody_subitems').clone();

      $('#route_table tbody *').remove();
      MaxIndex = 0;

      //最後尾にjqueryオブジェクト追加
      $('table#route_table tbody').append(obj);

      for (let j = 0; j < RouteItems[aIndex].subitems.length; j++) {
        addSubRouteList(j);

        let aIdx_subitems = j + 1;

        //データを反映
        $('table#route_table tbody tr .RouteItemTypeList:eq(' + aIdx_subitems + ')').val(RouteItems[aIndex].subitems[j].type);
        $('table#route_table tbody tr .RouteItemAddressList:eq(' + aIdx_subitems + ')').val(RouteItems[aIndex].subitems[j].addr);
        $('table#route_table tbody tr .RouteItemDirList:eq(' + aIdx_subitems + ')').val(RouteItems[aIndex].subitems[j].dir);
        $('table#route_table tbody tr .RouteItemOpList:eq(' + aIdx_subitems + ')').val(RouteItems[aIndex].subitems[j].operation);

      }

      //インデックスをセット（更新時に利用）
      SelectedRouteIndex = aIndex;
    }


  }




  $('#route_sub_name').change(function () {

    if (SelectedRouteIndex >= 0) {
      RouteItems[SelectedRouteIndex].name = $("#route_sub_name").val();

      //リストも更新
      updateRouteList(SelectedRouteIndex);
    }
  });

  $('#route_sub_disable').change(function () {

    if (SelectedRouteIndex >= 0) {
      RouteItems[SelectedRouteIndex].disable = $(this).val();
    }
  });

  $('#route_sub_addr').change(function () {

    if (SelectedRouteIndex >= 0) {
      RouteItems[SelectedRouteIndex].acc_addr = $("#route_sub_addr").val();
    }
  });

  $('#route_sub_signaldir').change(function () {

    if (SelectedRouteIndex >= 0) {
      RouteItems[SelectedRouteIndex].dir = $(this).val();
    }
  });

  $('#route_openstate').change(function () {

    if (SelectedRouteIndex >= 0) {
      RouteItems[SelectedRouteIndex].ignore_open = $(this).val();
    }
  });

  $("#ButtonRoutePlus").click(function () {

    addNewRouteItems();

    if (RouteItems.length >= 1) {
      addRouteList(RouteItems.length - 1);
    }

  });

  $("#ButtonRouteMinus").click(function () {

    deleteRouteItems(SelectedRouteIndex);

    //再表示
    $("#route_selectbox option").remove();
    applyRouteItems();

  });

  $("#ButtonRouteSave").click(function () {

    saveRouteItems("routedata.json");

  });

  $("#ButtonRouteLoad").click(function () {

    loadRouteItemsFromFile();

  });

  //ルートのサブアイテム編集用
  $(document).on('change', '.RouteItemTypeList', function () {

    //現在位置を取得
    let aIndex = $(this).closest('tr').index() - 1;

    if (aIndex >= 0) {
      RouteItems[SelectedRouteIndex].subitems[aIndex].type = Number($(this).val());
    }


  });

  $(document).on('change', '.RouteItemAddressList', function () {

    //現在位置を取得
    let aIndex = $(this).closest('tr').index() - 1;

    if (aIndex >= 0) {
      RouteItems[SelectedRouteIndex].subitems[aIndex].addr = Number($(this).val());
    }

  });

  $(document).on('change', '.RouteItemDirList', function () {

    //現在位置を取得
    let aIndex = $(this).closest('tr').index() - 1;

    if (aIndex >= 0) {
      RouteItems[SelectedRouteIndex].subitems[aIndex].dir = Number($(this).val());
    }

  });

  $(document).on('change', '.RouteItemOpList', function () {

    //現在位置を取得
    let aIndex = $(this).closest('tr').index() - 1;

    if (aIndex >= 0) {
      RouteItems[SelectedRouteIndex].subitems[aIndex].operation = Number($(this).val());
    }

  });


});



function OpenDialogRoute() {

  var aWidth = $(window).width() - 100;
  var aHeight = $(window).height() - 80;

  if (aWidth > 780) {
    aWidth = 780;
  }

  if (aHeight > 500) {
    aHeight = 500;
  }


  $("#route_routeitem").css("height", aHeight - 120);

  $(function () {
    $('p').css({
      'display': 'block'
    });

    $('#route_routeitem').css({
      'display': 'block'
    });


    $("#dialogRoute").dialog({
      dialogClass: 'MsgDlgClass',
      autoOpen: false,
      maxwidth: 900,
      maxheight: 600,
      width: aWidth,
      height: aHeight,
      show: "fade",
      hide: "fade",
      modal: true,
      buttons: {},
      close: function () {
        //ダイアログが閉じたときにメモリに保存
        ROUTE_ShareMemSave();
      }
    }).css("font-size", "1.25em");


    //$("#dialogRoute_msg").text(inMessage);

    if( (RouteItems.length > 0) && (SelectedRouteIndex < 0))
    {
      //SelectRoute(0);
    }

    $("#dialogRoute").dialog("open");
  });
}



function onClickOpenRouteList() {
  //ルート編集画面を開く

  OpenDialogRoute();

}

//ルート強制開通処理
function ROUTE_SetRoute(inRouteIndex) {

  if (inRouteIndex < 0) return;
  if (inRouteIndex >= RouteItems.length) return;

  //該当ルートを強制操作
  for (let j = 0; j < RouteItems[inRouteIndex].subitems.length; j++) {

    //データを反映
    switch (RouteItems[inRouteIndex].subitems[j].type) {
      case 0:
      case 1:
        ROUTE_SetTurnout(RouteItems[inRouteIndex].subitems[j].addr, RouteItems[inRouteIndex].subitems[j].dir);
        //await _sleep(200);
        break;
      case 2:
        //S88
        break;
    }
  }


}


function ROUTE_SetDisable(inDisableFlag)
{
	gRoute_Disable = inDisableFlag;

}


function ROUTE_SetTurnout(inAddress, status) {

  if (PowerStatus == 0) return;

  //アクセサリ状態チェック
  if (CommandGetAccStatus(Number(inAddress)) == status) {
    return;
  }

  CommandAccControl(Number(inAddress) - 1, Number(status));

}

function ROUTE_Interval() {
  //アクセサリ情報、S88からルート監視＆信号自動制御

  if (gRoute_Disable == 1) return;
  if (PowerStatus == 0) return;

  //変更点の確認用フラグ
  let aChangeCount = 0;

  for (let i = 0; i < RouteItems.length; i++) {

    //サブアイテムの中が何もない場合は動かさない
    if( (RouteItems[i].subitems.length > 0) && (RouteItems[i].nomonitor == 0) )
    {
      //ロジックの成立可否判定用フラグ
      let aRouteSubItemsCheck = 1;

      for (let j = 0; j < RouteItems[i].subitems.length; j++) {

        let aSubItemCheck = -1;

        //データを反映
        switch (Number(RouteItems[i].subitems[j].type)) {
          case 0:
          case 1:

            if (CommandGetAccStatus(Number(RouteItems[i].subitems[j].addr)) == RouteItems[i].subitems[j].dir) {
              //真
              aSubItemCheck = 1;
            } else {
              //偽
              aSubItemCheck = 0;
            }

            break;
          case 2:
            //S88
            if (CommandGetS88Data(Number(RouteItems[i].subitems[j].addr)) == RouteItems[i].subitems[j].dir) {
              //真
              aSubItemCheck = 1;
            } else {
              //偽
              aSubItemCheck = 0;
            }

            break;
        }

        //論理式を演算（かなり簡易的）
        switch (Number(RouteItems[i].subitems[j].operation)) {
          case 0:
            //AND
            aRouteSubItemsCheck = aRouteSubItemsCheck && aSubItemCheck;
            break;
          case 1:
            //OR
            aRouteSubItemsCheck = aRouteSubItemsCheck || aSubItemCheck;
            break;
          case 2:
            //NOP
            aRouteSubItemsCheck = aRouteSubItemsCheck && aSubItemCheck;
            break;
        }
      }

      //論理式に適合した場合の信号制御
      if (RouteItems[i].disable == 0) {

        //ステータスを更新(表示用)
        RouteItems[i].status = aRouteSubItemsCheck;

        if (aRouteSubItemsCheck == 1) {
          //ルート開通の時
          //既にポイントが切り替わっていたら何もしない
          ROUTE_SetTurnout(RouteItems[i].acc_addr, RouteItems[i].dir);
          
          aChangeCount++;

        } else {
          //ルート未開通の時
          let aDir = 0;

          if (RouteItems[i].dir == 0) {
            aDir = 1;
          } else {
            aDir = 0;

          }

          //デフォルトは非開通(OPEN)でも操作する
          if (RouteItems[i].ignore_open == 0) {
            //既にポイントが切り替わっていたら何もしない
            ROUTE_SetTurnout(RouteItems[i].acc_addr, aDir);

            aChangeCount++;
          }

        }

      }
      else
      {
        //ルートシグナル機能が無効なので、無効と表示用に-1をセット
        RouteItems[i].status = -1;
      }

    }
  } // for 

  if( aChangeCount > 0)
  {
    gRoute_RequireUpdate = 1;
  }

}

function ROUTE_UpdateRequired()
{
  let aRet = gRoute_RequireUpdate;
  gRoute_RequireUpdate =0;

  return aRet;
}

function ROUTE_ShareMemSave() {
  localStorage.setItem("UNIQUEID", "DSAIR0001");
  localStorage.setItem("ROUTE_JSONDATA", JSON.stringify(RouteItems));

  console.log("Route Data(JSON) Saved.");
}

function ROUTE_ShareMemLoad() {

  if (localStorage.getItem("UNIQUEID") == "DSAIR0001") {
    var aJSONRoute = localStorage.getItem("ROUTE_JSONDATA");

    if (aJSONRoute != null) {
      RouteItems = JSON.parse(aJSONRoute);
      console.log("Route Data(JSON) Loaded.");
    }
  }
}

//定周期実行
$(function () {

  setInterval(function () {

    ROUTE_Interval();


  }, 1000);

});