

$(function () {

	$('#CVList').val(1);
	$('#CVValue').val(3);
});

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



