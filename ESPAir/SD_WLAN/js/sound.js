// Judge the card is V1 or V2.
function isV1(wlansd) {
    if ( wlansd.length == undefined || wlansd.length == 0 ) {
        // List is empty so the card version is not detectable. Assumes as V2.
        return false;
    } else if ( wlansd[0].length != undefined ) {
        // Each row in the list is array. V1.
        return true;
    } else {
        // Otherwise V2.
        return false;
    }
}

// Convert data format from V1 to V2.
function convertFileList() {
    for (var i = 0; i < wlansd.length; i++) {
        var elements = wlansd[i].split(",");
        wlansd[i] = new Array();
        wlansd[i]["r_uri"] = elements[0];
        wlansd[i]["fname"] = elements[1];
        wlansd[i]["attr"]  = Number(elements[3]);
    }
}
// Callback Function for sort()
function cmpname(a, b) {
    a = a["fname"].toString().toLowerCase();
    b = b["fname"].toString().toLowerCase();
    if(a < b){
        return -1;
    }else if(a > b){
        return 1;
    }
    return 0;
}

function splitExt(filename) {
    return filename.split(/\.(?=[^.]+$)/);
}


// Show file list
function showFileList(path) {
    // Clear box.
    $("#soundlist").html('');
    // Output a link to the parent directory if it is not the root directory.
    if( path != "/" ) {
        $("#soundlist").append(
            $("<div></div>").append(
                $('<button class="dir" style="color:blue;"><img src="/SD_WLAN/img/file_dir.png" width=24 style="margin-right:0.2em;">..</button><br/>')
            )
        );
    }
    $.each(wlansd, function() {
        var file = this;
        // Skip hidden file.
        if ( file["attr"] & 0x02 ) {
            return;
        }
        
        var filelink;
        var caption = file["fname"];
        
        if ( file["attr"] & 0x10 ) {
            filelink = $('<button class="dir" style="color:blue;"><img src="/SD_WLAN/img/file_dir.png" width=24 style="margin-right:0.2em;"></button><br/>');
            caption = caption;
        } else {
	        var aExt = splitExt(file["fname"].toLowerCase());
	        
	        if( aExt.length <= 1)
	        {
	        	return;
	        }
	        
	        // Make a link to directories and files.
	        
	        var path_slash = path;
	        
	        if( path != "/")
	        {
	        	path_slash = path + "/";
	        }
	        			        
	        if (aExt[1] == "mp3") {
		        var callFunc = "audioElem.src =\'" + path_slash + caption + "\';audioElem.play();";
				filelink = $(`<button onclick="${callFunc}" style="text-align: left;"><img src="/SD_WLAN/img/file_mp3.png" width=24 style="margin-right:0.2em;"><label></label></button><br/>`);
	        }
	        else if(aExt[1] == "pdf")
	        {
		        var callFunc2 = "window.open(\'" + path_slash + caption + "\');";
				filelink = $(`<button onclick="${callFunc2}" style="text-align: left;"><img src="/SD_WLAN/img/file_pdf.png" width=24 style="margin-right:0.2em;"><label></label></button><br/>`);
	        }
	        else if(aExt[1] == "bas")
	        {
		        var callFunc2 = "BASIC_LoadDialog(\'" + path_slash + caption + "\');";
				filelink = $(`<button onclick="${callFunc2}" style="text-align: left;"><img src="/SD_WLAN/img/file_bas.png" width=24 style="margin-right:0.2em;"><label></label></button><br/>`);
	        }
	        else
	        {
	        	return;
	        }
        }
 
        // Append a file entry or directory to the end of the list.
        $("#soundlist").append(
                 filelink.append(
                    caption
                )
        );
    });     
}
//Making Path
function makePath(dir) {
    var arrPath = currentPath.split('/');
    if ( currentPath == "/" ) {
        arrPath.pop();
    }
    if ( dir == ".." ) {
        // Go to parent directory. Remove last fragment.
        arrPath.pop();
    } else if ( dir != "" && dir != "." ) {
        // Go to child directory. Append dir to the current path.
        arrPath.push(dir);
    }
    if ( arrPath.length == 1 ) {
        arrPath.push("");
    }
    return arrPath.join("/");
}

// Get file list
function getFileList(dir) {
    // Make a path to show next.
    var nextPath = makePath(dir);
    // Make URL for CGI. (DIR must not end with '/' except if it is the root.)
    var url = "/command.cgi?op=100&DIR=" + nextPath;
    // Issue CGI command.
    $.get(url, function(data) {
       // Save the current path.
        currentPath = nextPath;
        // Split lines by new line characters.
        wlansd = data.split(/\n/g);
        // Ignore the first line (title) and last line (blank).
        wlansd.shift();
        wlansd.pop();
        // Convert to V2 format.
        convertFileList(wlansd);
        // Sort by name.
        wlansd.sort(cmpname);
        // Show
        showFileList(currentPath);
    });
}

function playVideo(inFile)
{
	/*
	$(function() {
		var video = $('<video />', {
		    id: 'video',
		    width: 320,
		    height: 240,
		    src: inFile,
		    type: 'video/mp4',
		    controls: true
		});
		video.appendTo($('#basic_videoscreen'));
		
		//var obj = document.getElementById("basic_tv");
		//obj.play();
	});
	*/
}

function playSound(inFile)
{
	audioElem.src = inFile;
	audioElem.play();
}


function stopSound()
{
	
	audioElem.pause();
	audioElem.currentTime = 0;
	
}


//Document Ready
$(function() {
    
    // オーディオ
    audioElem = new Audio();
    
    // Iniialize global variables.
    var aLoc = location.pathname;
    currentPath = '';//aLoc.substring(0, aLoc.lastIndexOf('/')) + '';
    
    wlansd = new Array();
    // Show the root directory.
    getFileList('');
    
    $('.soundbutton').buttonset();
    
    // Register onClick handler for <a class="dir">
    $(document).on("click","button.dir",function() {
        getFileList(this.innerText);
    });    
    


});

