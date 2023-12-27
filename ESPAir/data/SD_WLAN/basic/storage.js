var gEnableLoad = 0;
var gLoading = 0;

function STORE_Clear()
{
    localStorage.clear();
}


function STORE_Save()
{
    if(gEnableLoad == 0)
    {
        localStorage.setItem("UNIQUEID", "DSAIR0010");
    }
}

function STORE_Load()
{

    if( localStorage.getItem("UNIQUEID") == "DSAIR0001")
    {
        //成功
        gEnableLoad = 1;
    }
    else
    {
        console.log("Not found settings on your localStorage.");
        gEnableLoad = 0;
    }
}

//Document Ready
function STORE_Init()
{
    gLoading = 1;
    
    STORE_Load();

    
    gLoading = 0;
}
