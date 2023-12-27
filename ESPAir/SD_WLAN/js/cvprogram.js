
	var fncSendPing = function(){
		writePing();
	} 


// Get file list
function getFileList_cv(dir) {
    // Make a path to show next.
    var nextPath = dir;
    // Make URL for CGI. (DIR must not end with '/' except if it is the root.)
    var url = "/command.cgi?op=100&DIR=/SD_WLAN" + nextPath;
    // Issue CGI command.
    $.get(url, function(data) {
       // Save the current path.
        currentPath_cv = nextPath;
        // Split lines by new line characters.
        wlansd_cv = data.split(/\n/g);
        // Ignore the first line (title) and last line (blank).
        wlansd_cv.shift();
        wlansd_cv.pop();
        // Convert to V2 format.
        convertFileList(wlansd_cv);
        // Show
        showFileList_cv(currentPath_cv);
    });
}

// Show file list
function showFileList_cv(path) {
    // Clear box.
    $("#CVtemplate").html('');

    $.each(wlansd_cv, function() {
        var file = this;
        
        fileinfo = file.split(",");
        
        var caption = fileinfo[1];
        var aExt = splitExt(caption.toLowerCase());
        
        if (aExt[1] == "json") {
            $("#CVtemplate").append("<option value=" +caption + ">" + caption +  "</option>");
        }
        else
        {
        	return;
        }
    });     
}



function OpenCVInfoPOff()
{
	$( function() {
	    $('p').css({
	        'display': 'block'
	    });
	    
		$( "#dialogCVInfo" ).dialog({
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
		        "Ok": function () {
		            $(this).dialog('close');
		        }
		    }
		}).css("font-size", "1.5em");
			
		$("#dialogCVInfo").dialog("open");
    });
	
}


function onClickCVWrite() {

	var inCVNo = $('#CVList').val();
	var inCVValue = $('#CVValue').val();
	
	if( PowerStatus == 1)
	{
		OpenCVInfoPOff();
	}
	else
	{
	
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
              		console.log("SV(0," + inCVNo + "," + inCVValue + ")");
					var url = GetUrl() + "SV(0," + inCVNo + "," + inCVValue + ")";
					$.get(url, function (data) {});
					setTimeout(fncSendPing, 200);
					
                    $(this).dialog('close');
                },
                "Cancel": function () {
                    $(this).dialog('close');
                },
            }
        }).css("font-size", "1.5em");


        $(`#dialogMsg_msg`).text("Would you write CV No." + inCVNo + "=" + inCVValue + "?");
        $("#dialogMsg").dialog("open");
    });
    }
}

function onClickCVRead() {

	var inCVNo = $('#CVList').val();
	var inCVValue = $('#CVValue').val();
	
	if( PowerStatus == 1)
	{
		OpenCVInfoPOff();
	}
	else
	{
	
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
              		console.log("GV(0," + inCVNo + ")");
					var url = GetUrl() + "GV(0," + inCVNo + ")";
					$.get(url, function (data) {});
					
				
                    $(this).dialog('close');
					setTimeout(fncSendPing, 200);
                },
                "Cancel": function () {
                    $(this).dialog('close');
                },
            }
        }).css("font-size", "1.5em");


        $(`#dialogMsg_msg`).text("Would you read CV No." + inCVNo + "?");
        $("#dialogMsg").dialog("open");
    });
    }
}

function OpenCVValEdit() {
    //Set CVVal_edit to LocEditForm
    
    $(DblAddr).val($(CVValue).val());

    $(`#dialogAL_item`).val("CV Value");

    $(function () {
        $('p').css({
            'display': 'block'
        });
        $("#dialogAL").dialog({
            dialogClass: 'CVEditDlgClass',
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
	                $(CVValue).val($(DblAddr).val());

                    $(this).dialog('close');
                }
            }
        }).css("font-size", "1.5em");

        $("#dialogAL").dialog("open");
    });

}

	
$(function($) {

	
	$("#CVList").change(function() {
	 
		ChangeCVDescription();
	 	
	});
	
	function ChangeCVDescription()
	{
	 	var r = $('#CVList').val();
	 	//console.log(r);
	 	
	 	if( r == null)
	 	{
	 		return;
	 	}
	 	
	 	switch(r)
	 	{
		 	
		 	case "1":
		 		$("#CVDescription").text("Set 1 to 99(127).");
		 	break;
		 	
		 	case "8":
		 		$("#CVDescription").text("Decoder factory reset. Set 8.");
		 	break;
		 	
		 	case "29":
		 		$("#CVDescription").text("1:Rev,2:128stps,4:DCope,8:Railcom,16:SpdCurve,32:ExAddr");
		 	break;
		 	
		 	
		 	
		 	 
		 	default:
		 		$("#CVDescription").text("Depend on decoder. See instruction.");
		 	break;
	 	}
	}
	
    ChangeCVDescription();

});


function RegisterCVList(file) {
	$(function($) {

        $.getJSON(file) 
        
        .done(function(data) {
            console.log("成功");
            var len = data.cvdata.length;
            
            $("#CVList").html('');
        
            for(var i = 0; i < len; i++) {
              $("#CVList").append("<option value=" +data.cvdata[i].cvnum + ">" + data.cvdata[i].cvname +  "</option>");
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("エラー：" + textStatus);
            console.log("テキスト：" + jqXHR.responseText);

            //Default dammy
            for(var i = 1; i <= 1024; i++) {
                $("#CVList").append("<option value=" + i + ">CV" + i.toString() +  "     </option>");
              }

        })
        .always(function() {
            console.log("完了");
        });
    
        /*
		$.getJSON("./cvdata/default.json")
		.done(function(data){ // jsonの読み込みに成功した時
			console.log('CV list JSON loaded.');
			for(var i in data) {
				$("#CVList").append("<option value=" +data.cvdata[i].cvnum + ">" + data.cvdata[i].cvname +  "</option>");
			}	
		})
		.fail(function(){ // jsonの読み込みに失敗した時
			console.log('CV list JSON FAILED');
        })
        
        */

	});
}

$(function () {

	RegisterCVList("/SD_WLAN/cvdata/default.json");

	$('#CVList').val(1);
	$('#CVValue').val(3);
	
	// Iniialize global variables.
    var aLoc = location.pathname;
    currentPath_cv = '/cvdata';//aLoc.substring(0, aLoc.lastIndexOf('/')) + '/cvdata';
	
	wlansd_cv = new Array();
	// Show the root directory.
	getFileList_cv(currentPath_cv);
	
	//セレクトボックスが切り替わったら発動
	$('#CVtemplate').change(function() {
		RegisterCVList("/SD_WLAN/cvdata/" + $(this).val());
		
	});
});
