// JavaScript Document

var gSHRAM_LocRawData = "";
var gSHRAM_Power = 0;
var g_RecvResponseRaw = "0";
var g_RecvStatusRaw = "";
var g_RecvWLANLevel = "";


function LocClass(_addr, _dir, _speed, _func) {
    this.addr = _addr;
    this.dir = _dir;
    this.speed = _speed;
    this.func = _func;
}

function SHRAM_getPower()
{
    var url = "/command.cgi?op=130&ADDR=128&LEN=1";

    $.get(url, function(data) {
        g_RecvResponseRaw = data;
    });
}

function SHRAM_getStatus()
{
    var url = "/command.cgi?op=130&ADDR=128&LEN=264";

    $.get(url, function(data) {
        g_RecvStatusRaw = data;
    });
}


function SHRAM_getSlot(inAddr)
{
    var aSlot = 0;





    return aSlot;
}


function SHRAM_getAccStatus(inData) {
	
	
	if( inData.length() > 0)
	{
		
	    for( var i = 0; i < 32; i++ ){
	        AccStatus[i * 8] = (inData >> i) & 255;
	    }
    }
}


//Document Ready
$(function() {




});