function onClickLang(){
	
	if( ModeLang == "ja")
	{
		//English
		LangChange(1);
	}
	else
	{
		//Japanese
		LangChange(0);
	}
	
}

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (lang == "") {
     //Default to English.
    lang = 'ja';
  }
  return lang;
};



/**
 * User's language (e.g. "en").
 * @type {string}
 */


Code.LANG = Code.getLang();
ModeLang = Code.LANG;

$(function() {

switch(ModeLang)
{
	case "en":
		$("#lang_img").text("JP");
		//UI language set
		//$("#btn_gen").text("Code");
		//$("#btn_run").text("Run");
		//$("#btn_stop").text("Stop");
		//$("#btn_load").text("Load");
		//$("#btn_save").text("Save");
		//$("#btn_new").text("Clear");
	break;
	case "ja":
		$("#lang_img").text("EN");
	break;
}
});


// Load the Code demo's language strings.
document.write('<script src="/SD_WLAN/block/msg/' + Code.LANG + '.js"></script>\n');

    function LangChange(inLangNo)
    {
    	
    	SaveXMLtoMemory("XML_BLOCKMEM_TEMP");
		
		var search = window.location.search;
		var newLang = "en";
		
		if( inLangNo == 0)
		{
			newLang = "ja";
		}
		
		if (search.length <= 1) {
			search = '?lang=' + newLang;
		} else if (search.match(/[?&]lang=[^&]*/)) {
			search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
		} else {
			search = search.replace(/\?/, '?lang=' + newLang + '&');
		}

		window.location = window.location.protocol + '//' +
		window.location.host + window.location.pathname + search;
    }
    
    