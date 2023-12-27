
    var flagPower = 0;
    var addrLoco = 3;
    var gDammy = 0;
    var gLOCADR_state = 0;
    var gLOCADR_CV29data = 0;
    var gLOCADR_CV1data = 0;
    var gLOCADR_CV17data = 0;
    var gLOCADR_CV18data = 0;
    var gLOCADR_Address = 0;


    $(function () {
      // Initialization code


    });
    

//CV Programmer

function GetCV(inCVNo)
{
	gReadCVNo = inCVNo;
	gReadCVVal = -1;

	
	if( inCVNo != "")
	{
		var url = GetUrl() + "GV(" + gDammy + "," + inCVNo + ")";
		$.get(url, function (data) {});
	}
	else
	{
		ons.notification.toast('Type CV No!', { timeout: 1000, animation: 'ascend' });
	}
	
	//Dammy Number for retry
	gDammy++;
	
	if( gDammy > 3)
	{
		gDammy = 0;
	}

}

function SetCV(inCVNo, inCVval)
{
	
	gReadCVNo = inCVNo;
	gReadCVVal = -1;

	
	if( (inCVNo != "") && ( inCVval != ""))
	{
		var url = GetUrl() + "SV(" + gDammy + "," + inCVNo + "," + inCVval + ")";
		$.get(url, function (data) {});
	}
	else
	{
		ons.notification.toast('Type CV No and Value!', { timeout: 1000, animation: 'ascend' });
	}
	
	//Dammy Number for retry
	gDammy++;
	
	if( gDammy > 3)
	{
		gDammy = 0;
	}
}

function Return()
{
	window.location.href = "/../bluebox.htm";
}

function CVR_Read()
{
	gMode = 1;
	
	var aCVNo = $("#read_cvno").val();
	
	//console.log(aCVNo)
	
	GetCV(aCVNo);
	
}

function CVW_Write()
{
	gMode = 2;

	var aCVNo = $("#write_cvno").val();
	var aCVVal = $("#write_cvval").val();
	
	//console.log(aCVNo)
	
	SetCV(aCVNo, aCVVal);

}

function CV29_Read()
{
	gMode = 3;
	
	GetCV(29);

}

function CV29_Write()
{
	gMode = 3;
	
	var aCV29Val_temp = 0;
	
	if($("#check-cv29-0").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 1;
	}
	
	if($("#check-cv29-1").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 2;
	}
	
	if($("#check-cv29-2").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 4;
	}
	
	if($("#check-cv29-3").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 8;
	}
	
	if($("#check-cv29-4").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 16;
	}
	
	if($("#check-cv29-5").prop('checked')) {
		aCV29Val_temp = aCV29Val_temp + 32;
	}

	
	//console.log(aCV29Val_temp);
	SetCV(29, aCV29Val_temp);

}

function SetCV29Data(inCV29val)
{
	
	$("#check-cv29-0").prop("checked", ((inCV29val & 1) > 0) ? true : false).change();
	$("#check-cv29-1").prop("checked", ((inCV29val & 2) > 0) ? true : false).change();
	$("#check-cv29-2").prop("checked", ((inCV29val & 4) > 0) ? true : false).change();
	$("#check-cv29-3").prop("checked", ((inCV29val & 8) > 0) ? true : false).change();
	$("#check-cv29-4").prop("checked", ((inCV29val & 16) > 0) ? true : false).change();
	$("#check-cv29-5").prop("checked", ((inCV29val & 32) > 0) ? true : false).change();
	
}


function LOC_Read()
{
	gMode = 4;
	gLOCADR_state = 1;
	
	GetCV(29);
	
}

function LOC_Write()
{
	
	if($("#chkbox_ignore_cvread").prop('checked'))
	{
		gMode = 4;
		gLOCADR_state = 111;
		LOC_StateProcess();
	}
	else
	{
		gMode = 4;
		gLOCADR_state = 11;
		GetCV(29);
	}
	
}

function LOC_StateProcess()
{
	switch(gLOCADR_state)
	{
		case 1:
			gLOCADR_CV29data = gReadCVVal;//CV29
			
			if( (gLOCADR_CV29data & 32) > 0)
			{
				gLOCADR_state = 5;
				//LONG ADDR
				GetCV(17);
			}
			else
			{
				gLOCADR_state = 2;
				GetCV(1);
			}
			break;
			
		case 2:
			//Display Loco address as SHORT
			gLOCADR_state = 0;
			gMode = 0;
			
			gLOCADR_CV1data = gReadCVVal;
			
			$("#read_locaddr").val(gLOCADR_CV1data);
			$(".addr_msg").text("as SHORT ADDRESS");
			
			break;
			
		case 5:
			//Read CV18
			gLOCADR_state = 6;
			gLOCADR_CV17data = gReadCVVal;
			//LONG ADDR
			GetCV(18);
			break;
			
		case 6:
			//Display Loco address as LONG
			gLOCADR_state = 0;
			gMode = 0;
			gLOCADR_CV18data = gReadCVVal;
			
			$("#read_locaddr").val(gLOCADR_CV18data + ((gLOCADR_CV17data & 63) * 256));
			$(".addr_msg").text("as LONG ADDRESS");
			
			break;
		
		case 11:
			gLOCADR_CV29data = gReadCVVal;//CV29
			
			//Address range
			var aAddress = $("#read_locaddr").val();
			gLOCADR_Address = Number(aAddress);
			
			if( gLOCADR_Address < 128)
			{
				//SHORT
				if( (gLOCADR_CV29data & 32) > 0)
				{
					gLOCADR_state = 12;
					//SET SHORT ADDR
					SetCV(29, gLOCADR_CV29data - 32);
				}
				else
				{
					gLOCADR_state = 13;
					//Already Short address
					SetCV(1, gLOCADR_Address);
				}
			}
			else
			{
				//LONG
				if( (gLOCADR_CV29data & 32) == 0)
				{
					gLOCADR_state = 15;
					//SET LONG ADDR
					SetCV(29, gLOCADR_CV29data + 32);
				}
				else
				{
					gLOCADR_state = 16;
					//Already LONG ADDR
					SetCV(17, 192 + Math.floor(gLOCADR_Address / 256));
				}
			}
			break;			
			
			
		break;
		case 111:
			gLOCADR_CV29data = 14;//CV29, DC/Railcom/128step
			
			//Address range
			var aAddress = $("#read_locaddr").val();
			gLOCADR_Address = Number(aAddress);
			
			if( gLOCADR_Address < 128)
			{
				//SHORT
				gLOCADR_state = 12;
				//SET SHORT ADDR
				SetCV(29, gLOCADR_CV29data);
			}
			else
			{
				//LONG
				gLOCADR_state = 15;
				//SET LONG ADDR
				SetCV(29, gLOCADR_CV29data + 32);
			}
			break;			
			
			
		break;


		case 12:
			gLOCADR_state = 13;
			
			SetCV(1, gLOCADR_Address);
			break;
			
		case 13:
			gLOCADR_state = 0;
			gMode = 0;
			ons.notification.toast('LocAddr write finished', { timeout: 1000, animation: 'ascend' });
			break;

		
		case 15:
			//Read CV18
			gLOCADR_state = 16;
			//LONG ADDR
			SetCV(17, 192 + Math.floor(gLOCADR_Address / 256));
			break;
		
		case 16:
			//Read CV18
			gLOCADR_state = 17;
			//LONG ADDR
			SetCV(18, (gLOCADR_Address) % 256);
			break;
			
		case 17:
			gLOCADR_state = 0;
			gMode = 0;
			ons.notification.toast('LocAddr write finished', { timeout: 1000, animation: 'ascend' });
			break;
			
	
	}
	
	
}

function ReplyManufacturer(inManID)
{
	
	var aReplyText = "Unknown";
	
	switch(inManID)
	{
	case 17: aReplyText="US -Advance IC Engineering ";break;
	case 19: aReplyText="AT -AMW ";break;
	case 45: aReplyText="TWN -ANE Model Co, Ltd ";break;
	case 34: aReplyText="US -Aristo-Craft Trains ";break;
	case 173: aReplyText="DE -Arnold Rivarossi ";break;
	case 127: aReplyText="US -Atlas Model Railroad Products ";break;
	case 170: aReplyText="US/IT -AuroTrains ";break;
	case 76: aReplyText="DE -Auvidel ";break;
	case 110: aReplyText="CHN -AXJ Electronics ";break;
	case 101: aReplyText="US -Bachmann Trains ";break;
	case 114: aReplyText="ESP -Benezan Electronics ";break;
	case 122: aReplyText="NL -Berros ";break;
	case 148: aReplyText="UK -BLOCKsignalling ";break;
	case 60: aReplyText="DE -Bluecher-Electronic ";break;
	case 225: aReplyText="POL -Blue Digital ";break;
	case 31: aReplyText="BE -Brelec ";break;
	case 186: aReplyText="DE -BRAWA Modellspielwaren GmbH & Co. ";break;
	case 38: aReplyText="US -Broadway Limited Imports, LLC ";break;
	case 47: aReplyText="AU -Capecom ";break;
	case 1: aReplyText="UK -CML Electronics Limited ";break;
	case 130: aReplyText="AUS -cmOS Engineering ";break;
	case 105: aReplyText="FR -Computer Dialysis France ";break;
	case 204: aReplyText="AT -Con-Com GmbH ";break;
	case 120: aReplyText="HUN -csikos-muhely ";break;
	case 117: aReplyText="AT -cT Elektronik ";break;
	case 135: aReplyText="US -CVP Products ";break;
	case 154: aReplyText="UK -Dapol Limited ";break;
	case 36: aReplyText="AU -DCCconcepts ";break;
	case 124: aReplyText="HUN -DCC-Gaspar-Electronic ";break;
	case 51: aReplyText="UK -DCC Supplies, Ltd ";break;
	case 144: aReplyText="UK -DCC Train Automation ";break;
	case 140: aReplyText="JP -Desktop Station ";break;
	case 115: aReplyText="DE -Dietz Modellbahntechnik ";break;
	case 152: aReplyText="CZE -Digi-CZ ";break;
	case 42: aReplyText="NL -Digirails ";break;
	case 64: aReplyText="DE -Digital Bahn ";break;
	case 75: aReplyText="HUN -Digitools Elektronika, Kft ";break;
	case 129: aReplyText="US -Digitrax ";break;
	case 30: aReplyText="CN -Digsight ";break;
	case 97: aReplyText="DE -Doehler & Haas ";break;
	case 164: aReplyText="TWN -drM ";break;
	case 39: aReplyText="US -Educational Computer, Inc. ";break;
	case 35: aReplyText="SE -Electronik & Model Produktion ";break;
	case 151: aReplyText="DE -Electronic Solutions Ulm GmbH ";break;
	case 94: aReplyText="US -Electroniscript, Inc. ";break;
	case 69: aReplyText="DE -E-Modell ";break;
	case 128: aReplyText="BRA -Frateschi Model Trains ";break;
	case 158: aReplyText="CZE -Fucik ";break;
	case 65: aReplyText="UK -Gaugemaster ";break;
	case 155: aReplyText="DE -Gebr. Fleischmann GmbH & Co. ";break;
	case 156: aReplyText="JP -Nucky ";break;
	case 46: aReplyText="UK -GFB Designs ";break;
	case 81: aReplyText="BEL -GooVerModels ";break;
	case 111: aReplyText="AT -Haber & Koenig Electronics GmbH (HKE) ";break;
	case 82: aReplyText="CHE -HAG Modelleisenbahn AG ";break;
	case 98: aReplyText="UK -Harman DCC ";break;
	case 79: aReplyText="UK -Hattons Model Railways ";break;
	case 28: aReplyText="DK -Heljan A/S ";break;
	case 67: aReplyText="DE -Heller Modenlbahn ";break;
	case 88: aReplyText="HKG -HONS Model ";break;
	case 48: aReplyText="UK -Hornby Hobbies Ltd ";break;
	case 102: aReplyText="US -Integrated Signal Systems ";break;
	case 133: aReplyText="US -Intelligent Command Control ";break;
	case 49: aReplyText="DE -Joka Electronic ";break;
	case 18: aReplyText="US -JMRI ";break;
	case 83: aReplyText="DE -JSS-Elektronic ";break;
	case 22: aReplyText="US -KAM Industries ";break;
	case 40: aReplyText="JP -KATO Precision Models ";break;
	case 93: aReplyText="ZAF -Kevtronics cc ";break;
	case 21: aReplyText="DE -Kreischer Datentechnik ";break;
	case 58: aReplyText="DE -KRES GmbH ";break;
	case 52: aReplyText="AT -Krois-Modell ";break;
	case 157: aReplyText="DE -Kuehn Ing. ";break;
	case 134: aReplyText="CHN -LaisDCC ";break;
	case 99: aReplyText="DE -Lenz Elektronik GmbH ";break;
	case 56: aReplyText="ARG -LDH ";break;
	case 159: aReplyText="DE -LGB (Ernst Paul Lehmann Patentwerk) ";break;
	case 112: aReplyText="DE -LSdigital ";break;
	case 77: aReplyText="BEL -LS Models Sprl ";break;
	case 166: aReplyText="JP -Maison de DCC ";break;
	case 123: aReplyText="DE -Massoth Elektronik, GmbH ";break;
	case 68: aReplyText="CH -MAWE Elektronik ";break;
	case 26: aReplyText="DE -MBTronik ";break;
	case 160: aReplyText="DE -MD Electronics ";break;
	case 29: aReplyText="BE -Mistral Train Models ";break;
	case 24: aReplyText="DE -MoBaTron.de ";break;
	case 165: aReplyText="UK -Model Electronic Railway Group ";break;
	case 143: aReplyText="US -Model Rectifier Corp. ";break;
	case 161: aReplyText="AT -Modelleisenbahn GmbH (formerly Roco) ";break;
	case 126: aReplyText="SE -Mullehem Gurdsproduktion ";break;
	case 72: aReplyText="CZE -MTB Model ";break;
	case 27: aReplyText="US -MTH Electric Trains, Inc. ";break;
	case 118: aReplyText="DE -MUT GmbH ";break;
	case 116: aReplyText="AUS -MyLocoSound ";break;
	case 50: aReplyText="ESP -N&Q Electronics ";break;
	case 37: aReplyText="US -NAC Services, Inc ";break;
	case 103: aReplyText="JP -Nagasue System Design Office ";break;
	case 108: aReplyText="JP -Nagoden ";break;
	case 11: aReplyText="US -NCE Corporation (formerly North Coast Engineering) ";break;
	case 71: aReplyText="HK -New York Byano Limited ";break;
	case 43: aReplyText="US -Ngineering ";break;
	case 238: aReplyText="US -NMRA Reserved (for extended ID) ";break;
	case 63: aReplyText="AUS -Noarail ";break;
	case 156: aReplyText="JP -Nucky ";break;
	case 136: aReplyText="US -NYRS ";break;
	case 106: aReplyText="FR -Opherline1 ";break;
	case 41: aReplyText="DE -Passmann ";break;
	case 107: aReplyText="US -Phoenix Sound Systems, Inc. ";break;
	case 162: aReplyText="DE -PIKO ";break;
	case 74: aReplyText="ESP -PpP Digital ";break;
	case 89: aReplyText="CZE -Pojezdy.EU ";break;
	case 33: aReplyText="CA -Praecipuus ";break;
	case 96: aReplyText="US -PRICOM Design ";break;
	case 125: aReplyText="DE -ProfiLok Modellbahntechnik GmbH ";break;
	case 14: aReplyText="US -PSI Dynatrol";break;
	case 13: aReplyText="- -Public Domain & Do-It-Yourself Decoders ";break;
	case 55: aReplyText="DE -QElectronics GmbH ";break;
	case 113: aReplyText="US -QS Industries (QSI) ";break;
	case 84: aReplyText="CAN -Railflyer Model Prototypes, Inc. ";break;
	case 66: aReplyText="US -Railnet Solutions, LLC ";break;
	case 146: aReplyText="FR -Rails Europ Express ";break;
	case 91: aReplyText="US -Railstars Limited ";break;
	case 15: aReplyText="CA/US -Ramfixx Technologies (Wangrow) ";break;
	case 57: aReplyText="DE -Rampino Elektronik ";break;
	case 53: aReplyText="DE -Rautenhaus Digital Vertrieb ";break;
	case 139: aReplyText="US -RealRail Effects ";break;
	case 32: aReplyText="HKG -Regal Way Co. Ltd ";break;
	case 149: aReplyText="US -Rock Junction Controls ";break;
	case 70: aReplyText="DE -Rocrail ";break;
	case 87: aReplyText="US -RR-Cirkits ";break;
	case 23: aReplyText="US -S Helper Service ";break;
	case 95: aReplyText="HKG -Sanda Kan Industrial, Ltd. ";break;
	case 90: aReplyText="US -Shourt Line ";break;
	case 142: aReplyText="JP -SLOMO Railroad Models ";break;
	case 80: aReplyText="US -Spectrum Engineering ";break;
	case 44: aReplyText="UK -SPROG-DCC ";break;
	case 20: aReplyText="DE -T4T Technology for Trains GmbH ";break;
	case 59: aReplyText="US -Tam Valley Depot ";break;
	case 62: aReplyText="DE -Tams Elektronik GmbH ";break;
	case 92: aReplyText="UK -Tawcrafts ";break;
	case 54: aReplyText="US -TCH Technology ";break;
	case 25: aReplyText="US -Team Digital, LLC ";break;
	case 78: aReplyText="ROM -Tehnologistic (train-O-matic) ";break;
	case 73: aReplyText="US -The Electric Railroad Company ";break;
	case 141: aReplyText="US -Throttle-Up (Soundtraxx) ";break;
	case 153: aReplyText="US -Train Control Systems ";break;
	case 138: aReplyText="US -Train ID Systems ";break;
	case 61: aReplyText="HUN -TrainModules ";break;
	case 2: aReplyText="BE -Train Technology ";break;
	case 104: aReplyText="NL -TrainTech ";break;
	case 100: aReplyText="ARG -Trenes Digitales ";break;
	case 131: aReplyText="DE -Trix Modelleisenbahn ";break;
	case 85: aReplyText="DE -Uhlenbrock GmbH ";break;
	case 147: aReplyText="CH -Umelec Ing. Buero ";break;
	case 109: aReplyText="DE -Viessmann Modellspielwaren GmbH ";break;
	case 150: aReplyText="US -Wm. K. Walthers, Inc. ";break;
	case 119: aReplyText="US -W. S. Ataras Engineering ";break;
	case 12: aReplyText="US -Wangrow Electronics ";break;
	case 86: aReplyText="DE -Wekomm Engineering, GmbH ";break;
	case 163: aReplyText="CA -WP Railshops ";break;
	case 145: aReplyText="AT -Zimo Elektronik ";break;
	case 132: aReplyText="UK -ZTC ";break;
	}
	
	return aReplyText;
}


