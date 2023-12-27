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
        localStorage.setItem("UNIQUEID", "DSAIR0001");
    }
}

function STORE_Save_ProtcolLoc()
{
    STORE_Save();

    localStorage.setItem("PROTCOL_LOC", LocProtocol);
}

function STORE_Save_ProtcolAcc()
{
   
    STORE_Save();

    localStorage.setItem("PROTCOL_ACC", AccProtocol);
}

function STORE_Save_TypeImagesAcc()
{
    STORE_Save();

    localStorage.setItem("ACCTYPEIMAGES", AccTypes);
}

function STORE_Save_MapDatas()
{
    STORE_Save();

    localStorage.setItem("MAPDAT-ACCADDR", Map_AccAddr);
    localStorage.setItem("MAPDAT-IMAGE", Map_Image);
    localStorage.setItem("MAPDAT-WIDTH", Map_Width);
    localStorage.setItem("MAPDAT-HEIGHT", Map_Height);
}

function STORE_Load_MapDatas()
{
    if( gEnableLoad == 0)
    {
        return;
    }

    var aAccAddrArray_str = localStorage.getItem("MAPDAT-ACCADDR");
    
    if( aAccAddrArray_str != null)
    {

        var aAccAddrArray_strarray = aAccAddrArray_str.split(",");

        if( aAccAddrArray_strarray.length == 0)
        {
            return;
        }

        for( var i = 0; i < (100*50); i++)
        {
            Map_AccAddr[i] = parseInt(aAccAddrArray_strarray[i]);
        }
    }
    else
    {
        for( var i = 0; i < 50 * 100; i++)
        {
            Map_AccAddr[i] = 0;
        }
    } 
    
    var aMapImgArray_str = localStorage.getItem("MAPDAT-IMAGE");
    
    if( aMapImgArray_str != null)
    {

        var aMapImgArray_strarray = aMapImgArray_str.split(",");

        if( aMapImgArray_strarray.length == 0)
        {
            return;
        }

        for( var i = 0; i < (100*50); i++)
        {
            Map_Image[i] = parseInt(aMapImgArray_strarray[i]);
        }
    }
    else
    {
        for( var i = 0; i < 50 * 100; i++)
        {
            Map_Image[i] = 0;
        }
    }    
    
    var aMapWidth = localStorage.getItem("MAPDAT-WIDTH");
    var aMapHeight = localStorage.getItem("MAPDAT-HEIGHT");

    if( aMapWidth != null)
    {
    	Map_Width = aMapWidth;
    }
    
    if( aMapHeight != null)
    {
    	Map_Height = aMapHeight;
    }
    
}

function STORE_Load_TypeImagesAcc()
{
    if( gEnableLoad == 0)
    {
        return;
    }

    var aAccImageArray_str = localStorage.getItem("ACCTYPEIMAGES");
    
    if( aAccImageArray_str != null)
    {

        var aAccImageArray_strarray = aAccImageArray_str.split(",");

        if( aAccImageArray_strarray.length == 0)
        {
            return;
        }

        for( var i = 0; i < 2044; i++)
        {
            AccTypes[i] = parseInt(aAccImageArray_strarray[i]);
        }
    }
}


function STORE_Load_MaxSpeed()
{
    if( gEnableLoad == 0)
    {
        return;
    }

    var aLocMaxSpeed_str = localStorage.getItem("MAXSPEED_LOC");

    if( aLocMaxSpeed_str != null)
    {
        var aLocMaxSpeed = parseInt(aLocMaxSpeed_str);

        if( aLocMaxSpeed > 0)
        {
            //LocMeterMaxSpeed = aLocMaxSpeed;
            
            $(function() {
                $("#maxspeed_slider").slider("value", aLocMaxSpeed / 60);
            });
        }
    }

}

function STORE_Save_MaxSpeed()
{
     
    if( gLoading == 1)
    {
        return;
    }
  
    STORE_Save();

    localStorage.setItem("MAXSPEED_LOC", LocMeterMaxSpeed);
}

function STORE_Load_Protcol()
{
    if( gEnableLoad == 0)
    {
        return;
    }

    var aLocProtocol = localStorage.getItem("PROTCOL_LOC");
    var aAccProtocol = localStorage.getItem("PROTCOL_ACC");

    if( aLocProtocol != null)
    {
        LocProtocol = aLocProtocol;

        $(function() {

            if(aLocProtocol == 0)
            {
                //MM2
                $("#radio2").prop("checked", true).change();
            }
            else
            {
                //DCC
                $("#radio1").prop("checked", true).change();
            }
        });
    }

    if( aAccProtocol != null)
    {
        AccProtocol = aAccProtocol;

        $(function() {

            if(aAccProtocol == 12287)
            {
                //MM2
                $("#radio2a").prop("checked", true).change();
            }
            else
            {
                //DCC
                $("#radio1a").prop("checked", true).change();
            }
        });
    }
}


function STORE_Save_LocAddr()
{
    STORE_Save();

    localStorage.setItem("LOCADDR", dblLocArray);
}

function STORE_Load_LocAddr()
{
    if( gEnableLoad == 0)
    {
        return;
    }

    var aLocArray = localStorage.getItem("LOCADDR");

    if( aLocArray != null)
    {

        dblLocArray = aLocArray.split(",");

        if( dblLocArray.length == 0)
        {
            return;
        }
    
        $(function() {
    
    
            $(radio_adr1_label).text(dblLocArray[0]);
    
            if (dblLocArray.length > 1) {
                $(radio_adr2_label).text(dblLocArray[1]);
            } else {
                $(radio_adr2_label).text("-");
            }
    
            if (dblLocArray.length > 2) {
                $(radio_adr3_label).text(dblLocArray[2]);
            } else {
                $(radio_adr3_label).text("-");
            }
    
            if (dblLocArray.length > 3) {
                $(radio_adr4_label).text(dblLocArray[3]);
            } else {
                $(radio_adr4_label).text("-");
            }
    
            //console.log(dblLocArray);
        });
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
    STORE_Load_LocAddr();
    STORE_Load_Protcol();
    STORE_Load_MaxSpeed();
    STORE_Load_TypeImagesAcc();
    STORE_Load_MapDatas();

    
    gLoading = 0;
}
