    var myInterpreter = null;
    var runner;
	var ThreadScripts = [];
	var ExternalFunctionsScripts = "";
	var threads = [];
    

    $(function () {
    	//標準のボタン
    	$("#btn_run").button();
    	$("#btn_stop").button();
    	$("#btn_gen").button();
    	$("#btn_load").button();
    	$("#btn_save").button();
    	$("#btn_new").button();
		$("#btn_ret").button();
   		$('#btn_stop').hide();
   		$('#lang_img').button();

		//Load Block Data(Language mode change)
		LoadXMLFromMemory("XML_BLOCKMEM_TEMP");
		//Clear
		localStorage.removeItem("XML_BLOCKMEM_TEMP");


    });
    



    //Auto update Highlight function added
    demoWorkspace.addChangeListener(function (event) {
    	if (!(event instanceof Blockly.Events.Ui)) {
    		// Something changed. Parser needs to be reloaded.
    		resetInterpreter();
    		generateCodeAndLoadIntoInterpreter();
    	}
		});
		
		function returnToHome()
		{
			window.location.href = "/SD_WLAN/List.htm";
		}


    function destroyClickedElement(event) {
    	// remove the link from the DOM
    	document.body.removeChild(event.target);
    }


function onLoad() {
 
    //サイズの変更
    var h = $(window).height()  - 100;
    $('#blocklyDiv').height(h);
	
    Blockly.svgResize(demoWorkspace);

}

$(window).resize( onResize);

function onResize()
{
	
    //サイズの変更
    
    var h = $(window).height() - 100;
    $('#blocklyDiv').height(h);
    
    Blockly.svgResize(demoWorkspace);

}



function XML_SaveDialog(){

	var dlg = $('#dialogXml').dialog({
	   autoOpen: false,
	   modal: true,
	   title: "ブロックの保存",
	   width: 440,
	   height: 200,
	   buttons: {
	      "ファイルに保存": function(){
	         SaveXML();
	         $(this).dialog("close");
	      },
	      
	      "メモリに保存": function(){
	         SaveXMLtoMemory("XML_BLOCKMEM1");
	         $(this).dialog("close");
	      },	      
	      "やめる": function(){
	         $(this).dialog("close");
	      }
	   },
	   close: function(){
	      $('#dialogXml').empty();
	   },
	});

	$('#dialogXml').append("<h2>保存のしかたをえらんでください</h2>");
	dlg.dialog('open');
}

function XML_LoadDialog(){

	var dlg = $('#dialogXml').dialog({
	   autoOpen: false,
	   modal: true,
	   title: "ブロックをひらく",
	   width: 440,
	   height: 200,
	   buttons: {
	      "ファイルから開く": function(){
				LoadXML();
				$(this).dialog("close");
	      },
	      "メモリから開く": function(){
				LoadXMLFromMemory("XML_BLOCKMEM1");
				$(this).dialog("close");
	      },
	      "やめる": function(){
	         $(this).dialog("close");
	      }
	   },
	   close: function(){
	      $('#dialogXml').empty();
	   },
	});

	$('#dialogXml').append("<h2>開き方をえらんでください</h2>");
	dlg.dialog('open');
}

function LoadXMLFromMemory(inBlock){
	
    var aXMLdata = localStorage.getItem(inBlock);
    
    if( aXMLdata != null)
    {
		
		try {
			xmlDom = Blockly.Xml.textToDom(aXMLdata);
		} catch (e) {
			alert("Load Error");
		}

		if (xmlDom) {
			demoWorkspace.clear();
			Blockly.Xml.domToWorkspace(xmlDom, demoWorkspace);
		}
		
		return 0;
	}
	else
	{
		return -1;
	}
}


    function SaveXML() {
    	var xmlDom = Blockly.Xml.workspaceToDom(demoWorkspace);
    	var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

    	var textToWrite = xmlText;
    	var textFileAsBlob = new Blob([textToWrite], {
    		type: 'text/plain'
    	});
    	var fileNameToSaveAs = "userseqs.xml";

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
    
    function SaveXMLtoMemory(inBlockName) {
    	var xmlDom = Blockly.Xml.workspaceToDom(demoWorkspace);
    	var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        localStorage.setItem(inBlockName, xmlText);
    }


    function NewXML() {

    	var buttons = [{
    			text: "OK",
    			click: function () {
    				demoWorkspace.clear();
    				$(this).dialog('close');
    			}
    		},
    		{
    			text: "キャンセル",
    			click: function () {
    				$(this).dialog('close');
    			}
    		}
    	];
    	// ダイアログを表示
    	showDialog("あたらしいプログラム", "いまのプログラムをけしても良いですか?", buttons);



    }

    function LoadXML() {


    	const showOpenFileDialog = () => {
    		return new Promise(resolve => {
    			const input = document.createElement('input');
    			input.type = 'file';
    			input.accept = '.xml, text/plain';
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

    		xmlText = content;
    		try {
    			xmlDom = Blockly.Xml.textToDom(xmlText);
    		} catch (e) {
    			alert("Load Error");
    		}

    		if (xmlDom) {
    			demoWorkspace.clear();
    			Blockly.Xml.domToWorkspace(xmlDom, demoWorkspace);
    		}

    	})();

		}

    function showDialog(title, message, buttons) {
    	var esc_str = $('<dummy>').text(message).html().replace(/\r\n|\r|\n/g, '<br>');

    	var html_dialog = '<div>' + esc_str + '</div>';
    	$(html_dialog).dialog({
    		title: title,
    		buttons: buttons,
    		width: "40%",
    		close: function () {
    			$(this).remove();
    		}
    	});
    }

    function showCodeDialog(title, message, buttons) {
    	var esc_str = $('<dummy>').text(message).html();
			//内部コマンドを除去

			esc_str = esc_str.replace(/Sleep2\(1\);/g,"");
			esc_str = esc_str.replace(/highlightBlock(.*);\n/g,"");
			esc_str = esc_str.replace(/\r\n|\r|\n/g, '<br>');
			
			var dlg = $('#dialogXml').dialog({
				autoOpen: false,
				modal: true,
				title: "コードを確認する",
				width: 700,
				height: 360,
				buttons: {
					 "ダウンロード": function(){
						SaveCode();
					 $(this).dialog("close");
					 },
					 "とじる": function(){
							$(this).dialog("close");
					 }
				},
				close: function(){
					 $('#dialogXml').empty();
				},
		 });
	 
		 $('#dialogXml').append('<div style="width: 700px;height: 360px;overflow: scroll-y;">' + esc_str + '</div>');
		 dlg.dialog('open');			
    }

    function showCode() {
    	// Generate JavaScript code and display it.
    	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    	var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    	var buttons = [{
    		text: "OK",
    		click: function () {
    			$(this).dialog('close');
    		}
    	}];


    	// ダイアログを表示
    	showCodeDialog("生成されたコード", code, buttons);
		}
		
    function SaveCode() {
    	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    	var code_temp = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    	var textToWrite = code_temp;
    	var textFileAsBlob = new Blob([textToWrite], {
    		type: 'text/plain'
    	});
    	var fileNameToSaveAs = "usercode.js.txt";

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



    /**
     * Register the interpreter asynchronous function
     * <code>waitForSeconds()</code>.
     */
    function initInterpreterWaitForSeconds(interpreter, scope) {
    	Blockly.JavaScript.addReservedWords('Sleep');

    	var wrapper = interpreter.createAsyncFunction(
    		function (timeInSeconds, callback) {
    			// Delay the call to the callback.
    			setTimeout(callback, timeInSeconds * 1000);
    		});
    	interpreter.setProperty(scope, 'Sleep', wrapper);
    }

    function initInterpreterWaitForSeconds2(interpreter, scope) {
    	Blockly.JavaScript.addReservedWords('Sleep2');

    	var wrapper = interpreter.createAsyncFunction(
    		function (timeInSeconds, callback) {
    			// Delay the call to the callback.
    			setTimeout(callback, timeInSeconds * 10);
    		});
    	interpreter.setProperty(scope, 'Sleep2', wrapper);
    }

    function initApi(interpreter, scope) {
    	// Add an API function for the alert() block, generated for "text_print" blocks.
    	var wrapper = function (text) {
    		text = text ? text.toString() : '';
    		outputArea.value = outputArea.value + '\n' + text;
    	};

    	interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(wrapper));

    	// Add an API function for the prompt() block.
    	var wrapper = function (text) {
    		text = text ? text.toString() : '';
    		return prompt(text);
    	};

    	interpreter.setProperty(scope, 'prompt',
    		interpreter.createNativeFunction(wrapper));

    	var wrapper = function (text) {
			clearInterval(runner);
			resetInterpreter();
			resetStepUi(false);
    		return;
    	};

    	interpreter.setProperty(scope, 'exit',
    		interpreter.createNativeFunction(wrapper));


    	// Add an API for the wait block.  See wait_block.js
    	initInterpreterWaitForSeconds(interpreter, scope);
    	initInterpreterWaitForSeconds2(interpreter, scope);

    	// Add an API function for highlighting blocks.
    	var wrapper = function (id) {
    		id = id ? id.toString() : '';
    		return highlightBlock(id);
    	};

    	interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(wrapper));

    	interpreter.setProperty(scope, 'CommandPower', interpreter.createNativeFunction(CommandPower));
    	interpreter.setProperty(scope, 'CommandGetS88', interpreter.createNativeFunction(CommandGetS88));
    	interpreter.setProperty(scope, 'CommandLocSpeed', interpreter.createNativeFunction(CommandLocSpeed));
    	interpreter.setProperty(scope, 'CommandLocDirection', interpreter.createNativeFunction(CommandLocDirection));
    	interpreter.setProperty(scope, 'CommandTurnout', interpreter.createNativeFunction(CommandTurnout));
    	interpreter.setProperty(scope, 'CommandLocFunction', interpreter.createNativeFunction(CommandLocFunction));
    	interpreter.setProperty(scope, 'CommandGetS88Data', interpreter.createNativeFunction(CommandGetS88Data));
    	interpreter.setProperty(scope, 'GetSlotAdress', interpreter.createNativeFunction(GetSlotAdress));
    	interpreter.setProperty(scope, 'playSound', interpreter.createNativeFunction(playSound));
    	interpreter.setProperty(scope, 'stopSound', interpreter.createNativeFunction(stopSound));
    	interpreter.setProperty(scope, 'GetSlotFnc', interpreter.createNativeFunction(GetSlotFnc));
    	interpreter.setProperty(scope, 'ANA_Fwd', interpreter.createNativeFunction(ANA_Fwd));
    	interpreter.setProperty(scope, 'ANA_Speed', interpreter.createNativeFunction(ANA_Speed));
    	interpreter.setProperty(scope, 'UpdateProtocol', interpreter.createNativeFunction(UpdateProtocol));
    	interpreter.setProperty(scope, 'DecoSay', interpreter.createNativeFunction(DecoSay));
    	interpreter.setProperty(scope, 'DecoShow', interpreter.createNativeFunction(DecoShow));

    }

    var highlightPause = false;
    var latestCode = '';

    function highlightBlock(id) {
    	demoWorkspace.highlightBlock(id);
    	highlightPause = true;
    }

    function resetStepUi(clearOutput) {
    	demoWorkspace.highlightBlock(null);
    	highlightPause = false;
    	//runButton.disabled = '';
    	if (clearOutput) {
    		//outputArea.value = 'Program output:\n=================';
    	}
    }

    function generateCodeAndLoadIntoInterpreter() {
    	// Generate JavaScript code and parse it.
    	Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    	Blockly.JavaScript.addReservedWords('highlightBlock');
    	latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    	resetStepUi(true);
	}

	function extractThreadsFromScript()
	{
		//自動で分割
		var aScripts = latestCode.split("\n");
		var aScriptArea = 0;
		var aScriptLatch = 0;
		var aExScripts = "";
		var aThreadScripts = "";

		ThreadScripts.splice(0);


		for( let i = 0; i < aScripts.length; i++)
		{
			if( (i + 1) < aScripts.length)
			{
				if( aScripts[i + 1].indexOf("//@BEGIN") >= 0)
				{
					aScriptLatch = 1;
					aScriptArea++;
					aThreadScripts = aScripts[i];
				}
			}

			if( aScripts[i].indexOf("//@BEGIN") >= 0)
			{
				//スクリプトの最初にBeginがあった場合のみ
				if( aScriptLatch == 0)
				{
					aScriptLatch = 1;
					aScriptArea++;
					aThreadScripts = "";
				}

			}
			else if( aScripts[i].indexOf("//@END") >= 0)
			{
				aScriptLatch = 0;
				ThreadScripts.push(aThreadScripts);
			}
			else
			{
				switch(aScriptLatch)
				{
					case 0:
						aExScripts = aExScripts + aScripts[i] + "\n";
						break;
					case 1:
						aThreadScripts = aThreadScripts + aScripts[i] + "\n";
						break;
				}

			}
		}

		//外部関数群をグローバルに変更
		ExternalFunctionsScripts = aExScripts;

		console.log("Found " + ThreadScripts.length + " threads.");

    }

    function resetInterpreter() {
    	myInterpreter = null;

    	if (runner) {
    		clearTimeout(runner);
    		runner = null;
    		$('#btn_run').show();
    		$('#btn_stop').hide();
   		}
    }

    // Load the interpreter now, and upon future changes.
    generateCodeAndLoadIntoInterpreter();
	
	function stopCode() {
		clearInterval(runner);
		
		//Power off
		if( PowerStatus == 1)
		{
			CommandPower(0);
		}
		
		//Analog off
		if( ANA_LocSpeed > 0)
		{
			ANA_Speed(0);
		}
		
		resetInterpreter();
		resetStepUi(false);
	}
	

    function runCode() {


    	if (!myInterpreter) {

    		// First statement of this code.

    		// Clear the program output.
    		resetStepUi(true);
    		//btn_run.disabled = 'disabled';
    		$('#btn_run').hide();
    		$('#btn_stop').show();

			//Extract Threads
			extractThreadsFromScript();

    		// And then show generated code in an alert.
    		// In a timeout to allow the outputArea.value to reset first.
    		setTimeout(function () {
    		//	alert('Ready to execute the following code\n' +
    		//		'===================================\n' +
    		//		latestCode);

    			// Begin execution
    			highlightPause = false;

				var aThreadCode_0 = ExternalFunctionsScripts + ThreadScripts[0];

    			myInterpreter = new Interpreter(aThreadCode_0, initApi);

    			runner = function () {
    				if (myInterpreter) {
    					var hasMore = myInterpreter.run();
    					if (hasMore) {
    						// Execution is currently blocked by some async call.
    						// Try again later.
    						//setTimeout(runner, 100);
    					} else {
    						// Program is complete.
    						//outputArea.value += '\n\n<< Program complete >>';

    						//Stop runner();
    						clearInterval(runner);
    						resetInterpreter();
    						resetStepUi(false);
    					}
    				}
    			};

    			setInterval(runner, 500);

    		}, 1);

			//その他のスレッドを実行
			for(let j = 1; j < ThreadScripts.length; j++)
			{
				setTimeout(function () {
					runThreadScripts(j)
				}, 1);
			}




    		return;
    	}
    }

	function runThreadScripts(inThreadNo)
	{

		var aThreadCode = ExternalFunctionsScripts + ThreadScripts[inThreadNo];

		//var aInterpreter = new Interpreter(aThreadCode, initApi);
		var aInterpreter = new Interpreter('');
		aInterpreter.stateStack[0].scope = myInterpreter.globalScope;
		aInterpreter.appendCode(aThreadCode);
		threads[inThreadNo] = aInterpreter;
		initApi(aInterpreter, aInterpreter.globalObject);

		var aRunner = function () {
			if (aInterpreter) {
				var hasMore = aInterpreter.run();
				if (hasMore) {
					// Execution is currently blocked by some async call.
					// Try again later.
					//setTimeout(runner, 100);
				} else {

					console.log("Exit Thread #" + inThreadNo.toString());

					if (aRunner) {
						clearInterval(aRunner);
						clearTimeout(aRunner);
					}
				}
			}
		};

		setInterval(aRunner, 500);




	}