// JavaScript Document
function getMasterCode() {
    var url = "/command.cgi?op=106";
    $.get(url, function(data) {
        $('#mastercode').text(data);
        mastercode = data;
    });
}

function getSSID() {
    var url = "/command.cgi?op=104";
    $.get(url, function(data) {
        $('#appssid').val(data);
    });
}

function getAPPNETWORKKEY() {
    var url = "/command.cgi?op=105";
    $.get(url, function(data) {
        $('#appnetworkkey').val(data);
    });
}

function setParams() {
    var datetime = new Date();
    var url = "/config.cgi?MASTERCODE=" + mastercode +
        "&APPSSID=" + $("#appssid").val() +
        "&APPNETWORKKEY=" + $("#appnetworkkey").val() +
        "&TIME=" + datetime.getTime();
    $.get(url, function(data) {
        $('#result').text(data);
    });
}
//Document Ready
$(function() {
    getMasterCode();
    getSSID();
    getAPPNETWORKKEY();
    $("#submit").click(setParams);
    $( "#formarea" ).controlgroup();
});