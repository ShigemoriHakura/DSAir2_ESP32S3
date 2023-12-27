var editor = ace.edit("texteditor");
//editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/fortran");

var gIntervalRun = 0;
var gBasicRunning = 0;
var gLastBasicQuitting = 0;

function RunBasic() {

	gBasicRunning = 1;
	BASIC_quit = 0;
	$( "#basic_statusrun" ).animate({
	  color: "#BB0000",
	}, 500 );

	const basic_out = document.getElementById('basic_out');
	window.Basic(editor.getValue(), basic_out);
}


function onRunBasic() {

	if( gBasicRunning == 0)
	{
		RunBasic();
	}
	else
	{
		window.Basic("print \"Force Exit\"", basic_out);
	}
}


function BASIC_New(){
	
	var dlg = $('#dialogBas').dialog({
	   autoOpen: false,
	   modal: true,
	   title: "Clear BASIC program",
	   width: 440,
	   height: 200,
	   buttons: {
	      "Ok": function(){
			editor.setValue("");
	         $(this).dialog("close");
	      },
	      "Cancel": function(){
	         $(this).dialog("close");
	      }
	   },
	   close: function(){
	      $('#dialogBas').empty();
	   },
	});

	$('#dialogBas').append("<h2>Would you clear current BASIC program?</h2>");
	dlg.dialog('open');	
	
	
	

}


function BASIC_LoadDialog(inFileName){

	var dlg = $('#dialogBas').dialog({
	   autoOpen: false,
	   modal: true,
	   title: "Open BASIC file",
	   width: 440,
	   height: 200,
	   buttons: {
	      "Open": function(){
				$(function() {
					$.get(inFileName, function(data){
					editor.setValue(data, -1);
					});
				});
	         $(this).dialog("close");
	      },
	      "Cancel": function(){
	         $(this).dialog("close");
	      }
	   },
	   close: function(){
	      $('#dialogBas').empty();
	   },
	});

	$('#dialogBas').append("<h2>Would you open " + inFileName + "?</h2>");
	dlg.dialog('open');
}

function BASIC_Load(){
	
    var aBasicValue = localStorage.getItem("BASIC_SAVEDVAL");
    
    if( aBasicValue != null)
    {
		editor.setValue(aBasicValue, -1);
		return 0;
	}
	else
	{
		return -1;
	}
}


function BASIC_SaveDialog(){

	var dlg = $('#dialogBas').dialog({
	   autoOpen: false,
	   modal: true,
	   title: "Save BASIC file",
	   width: 440,
	   height: 200,
	   buttons: {
	      "Save to File": function(){
	         saveTextAsFile();
	         $(this).dialog("close");
	      },
	      
	      "Save to Memory": function(){
			 localStorage.setItem("BASIC_SAVEDVAL", editor.getValue(""));
	         $(this).dialog("close");
	      },	      
	      "Cancel": function(){
	         $(this).dialog("close");
	      }
	   },
	   close: function(){
	      $('#dialogBas').empty();
	   },
	});

	$('#dialogBas').append("<h2>Would you save BASIC data?</h2>");
	dlg.dialog('open');
}

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}

function saveTextAsFile() {
    var textToWrite = editor.getValue();
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = "dsair_userbas.bas";

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


function BASIC_Save(){
	
    BASIC_SaveDialog();

}


function BASIC_ConfigInterval(){
	
	if( gIntervalRun == 0)
	{
		gIntervalRun = 1;
		
		$( "#basic_statusInterval" ).animate({
		  color: "#BB0000",
		}, 500 );
	}
	else
	{
		gIntervalRun = 0;
		
		$( "#basic_statusInterval" ).animate({
		  color: "#4b4b4b",
		}, 500 );		
		
	}
}

function BASIC_Interval(){
	
	if( (gIntervalRun == 1) && (gBasicRunning == 0))
	{
		RunBasic();
	}
	else
	{
		//Nothing to do
	}
	
	//Check BASIC quit
	if( (gBasicRunning == 1) && (BASIC_quit == 1))
	{
		$( "#basic_statusrun" ).animate({
		  color: "#4b4b4b",
		}, 500 );
		
		gBasicRunning = 0;
	}
	else
	{
		//Nothing to do
	}
}

if( BASIC_Load() <0)
{
	RunBasic();
	editor.setValue("", -1);
}

//Interval 0.9sec
$(function () {
	setInterval(function () {
		BASIC_Interval();
    }, 900);
});



