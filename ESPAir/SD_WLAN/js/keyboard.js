
var kbd_spd_flg = 0;//0�̎�FALSE
var kbd_spd = 0;

document.addEventListener("keydown", KeyDownFunc);
document.addEventListener("keyup",KeyUpFunc);
pressedKeys = [];

function KeyDownFunc(e){
	
	var aSpd = 0;
	
	//If selected Basic Tab, ignore key commands.
	
	if( gTabSelectedIndex == 8 )
	{
		return;
	}
	
	if ( e.keyCode == 32 ) {
		//SPACE
		
		//PowerOnOff
		enterPowerBtn();
		
	}
	
	//�Ȍ�, Power On�݂̂œ���
	if( PowerStatus == 0 )
	{
		
		if( gTabSelectedIndex == 1 )
		{
				if ( e.keyCode == 68 ) {
					//UP
					
					aSpd = ANA_LocSpeed;
					
					aSpd+=16;
					
					if( aSpd >= 1024)
					{
						aSpd = 1023;
					}
					
					ANA_LocSpeed = aSpd;
					
					//���[�^�[�\�����X�V
					ANA_OnDraw(ANA_LocSpeed);
					ANA_Speed(inSpeed);
					
				}
				if ( e.keyCode == 67  ) {
					//DOWN
					
					aSpd = ANA_LocSpeed;
					
					aSpd = aSpd - 16;
					
					if( aSpd <= 0)
					{
						aSpd = 0;
					}
					
					ANA_LocSpeed = aSpd;
					
					//���[�^�[�\�����X�V
					ANA_OnDraw(ANA_LocSpeed);
					ANA_Speed(inSpeed);
				}
				
				if ( e.keyCode == 90  ) {
					//z, FWD/REV
					
					
					var aDir = ANA_Direction;
					
					if(aDir != 2)
					{
						ANA_Fwd(2);
					}
					else
					{
						ANA_Fwd(1);
					}
				}


				if ( e.keyCode == 81  ) {
					//q, STOP
					ANA_Stop();
				}
				
			}
		
		return;
	}
	
	//絶対値スピードデコーダ PXXXとするか？ 0-1023
	if(kbd_spd_flg > 0)
	{
		//0-9の文字かどうか？
		if((e.keyCode >= 48) &&(e.keyCode <= 57))
		{
			kbd_spd += (e.keyCode - 48) * Math.pow(10,4 - kbd_spd_flg);
			kbd_spd_flg ++;
			//通信が全部来たら、スピードを書き込み。
			if(kbd_spd_flg == 5)
			{
				if( kbd_spd >= 1024)
				{
					kbd_spd = 1023;
				}
				LocSpeed[modeLocIndex] = kbd_spd;
				ROBOT_Cancel();

				//メーター表示を更新
				onChangeSpeed(LocSpeed[modeLocIndex]);
				
				//������
				kbd_spd = 0;
				kbd_spd_flg = 0;
			}
			return;//functionも変わってしまうのを防ぐため。
		}
		else
		{
			kbd_spd = 0;
			kbd_spd_flg = 0;
		}
	}
		
	//絶対値は”P”始まりとする！
	if ( e.keyCode == 80)
	{
		kbd_spd = 0;
		kbd_spd_flg ++;
	}
	else
	{
		kbd_spd = 0;
		kbd_spd_flg = 0;
	}

	if ( e.keyCode == 83 || e.keyCode == 107 ) {
		//UP
		
		aSpd = LocSpeed[modeLocIndex];
		
		aSpd+=16;
		
		if( aSpd >= 1024)
		{
			aSpd = 1023;
		}
		
		LocSpeed[modeLocIndex] = aSpd;
		ROBOT_Cancel();
		
		//���[�^�[�\�����X�V
		onChangeSpeed(LocSpeed[modeLocIndex]);
		
	}
	if ( e.keyCode == 68 ) {
		//UP
		
		aSpd = LocSpeed[modeLocIndex];
		
		aSpd+=48;
		
		if( aSpd >= 1024)
		{
			aSpd = 1023;
		}
		
		LocSpeed[modeLocIndex] = aSpd;
		ROBOT_Cancel();
		
		//���[�^�[�\�����X�V
		onChangeSpeed(LocSpeed[modeLocIndex]);
		
	}
	if ( e.keyCode == 67 ) {
		//DOWN
		
		aSpd = LocSpeed[modeLocIndex];
		
		aSpd = aSpd - 48;
		
		if( aSpd <= 0)
		{
			aSpd = 0;
		}
		
		LocSpeed[modeLocIndex] = aSpd;
		ROBOT_Cancel();
		
		//���[�^�[�\�����X�V
		onChangeSpeed(LocSpeed[modeLocIndex]);
	}
	if ( e.keyCode == 88  || e.keyCode == 109  ) {
		//DOWN
		
		aSpd = LocSpeed[modeLocIndex];
		
		aSpd = aSpd - 16;
		
		if( aSpd <= 0)
		{
			aSpd = 0;
		}
		
		LocSpeed[modeLocIndex] = aSpd;
		ROBOT_Cancel();
		
		//���[�^�[�\�����X�V
		onChangeSpeed(LocSpeed[modeLocIndex]);
	}
	
	if ( e.keyCode == 90 || e.keyCode == 13   ) {
		//z, FWD/REV
		ROBOT_Cancel();
		
		if(LocDir[modeLocIndex] == "FWD")
		{
			onClickFwd(2);
		}
		else
		{
			onClickFwd(1);
		}
		
		// Pin readraw
		onDrawMeter(40);
	}
	

	if ( e.keyCode == 81 || e.keyCode == 110   ) {
		//q, STOP
		
		LocSpeed[modeLocIndex] = 0;
		ROBOT_Cancel();
		
		//���[�^�[�\�����X�V
		onChangeSpeed(LocSpeed[modeLocIndex]);
	}
	
	if (  e.keyCode == 48 || e.keyCode == 96  ) {
		//0, F0
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(10);
			$("#check10").prop('checked', (LocFuncStatus[modeLocIndex][10] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(20);
			$("#check20").prop('checked', (LocFuncStatus[modeLocIndex][20] == 1) ? true : false).change();                                                               
                                                                }
                                                               else
		{
			onClickFunction(0);
			$("#check0").prop("checked", (LocFuncStatus[modeLocIndex][0] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 49 || e.keyCode == 97 ) {
		//1, F1
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(11);
			$('#check11').prop('checked', (LocFuncStatus[modeLocIndex][11] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(21);
			$("#check21").prop('checked', (LocFuncStatus[modeLocIndex][21] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(1);
			$("#check1").prop("checked", (LocFuncStatus[modeLocIndex][1] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 50 || e.keyCode == 98 ) {
		//2, F2
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(12);
			$('#check12').prop('checked', (LocFuncStatus[modeLocIndex][12] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(22);
			$("#check22").prop('checked', (LocFuncStatus[modeLocIndex][22] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(2);
			$("#check2").prop("checked", (LocFuncStatus[modeLocIndex][2] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 51 || e.keyCode == 99 ) {
		//3, F3
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(13);
			$('#check13').prop('checked', (LocFuncStatus[modeLocIndex][13] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(23);
			$("#check23").prop('checked', (LocFuncStatus[modeLocIndex][23] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(3);
			$("#check3").prop("checked", (LocFuncStatus[modeLocIndex][3] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 52 || e.keyCode == 100 ) {
		//4, F4
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(14);
			$('#check14').prop('checked', (LocFuncStatus[modeLocIndex][14] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(24);
			$("#check24").prop('checked', (LocFuncStatus[modeLocIndex][24] == 1) ? true : false).change();                                                               
                                                                }
		else
		{	
			onClickFunction(4);
			$("#check4").prop("checked", (LocFuncStatus[modeLocIndex][4] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 53 || e.keyCode == 101 ) {
		//5, F5
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(15);
			$('#check15').prop('checked', (LocFuncStatus[modeLocIndex][15] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(25);
			$("#check25").prop('checked', (LocFuncStatus[modeLocIndex][25] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(5);
			$("#check5").prop("checked", (LocFuncStatus[modeLocIndex][5] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 54 || e.keyCode == 102 ) {
		//6, F6
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(16);
			$('#check16').prop('checked', (LocFuncStatus[modeLocIndex][16] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(26);
			$("#check26").prop('checked', (LocFuncStatus[modeLocIndex][26] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(6);
			$("#check6").prop("checked", (LocFuncStatus[modeLocIndex][6] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 55 || e.keyCode == 103 ) {
		//7, F7
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(17);
			$('#check17').prop('checked', (LocFuncStatus[modeLocIndex][17] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(27);
			$("#check27").prop('checked', (LocFuncStatus[modeLocIndex][27] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(7);
			$("#check7").prop("checked", (LocFuncStatus[modeLocIndex][7] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 56 || e.keyCode == 104 ) {
		//8, F8
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(18);
			$('#check18').prop('checked', (LocFuncStatus[modeLocIndex][18] == 1) ? true : false).change();
		}
		else if(e.ctrlKey  == true || pressedKeys[1] == true)
                                                                {
 			onClickFunction(28);
			$("#check28").prop('checked', (LocFuncStatus[modeLocIndex][28] == 1) ? true : false).change();                                                               
                                                                }
		else
		{
			onClickFunction(8);
			$("#check8").prop("checked", (LocFuncStatus[modeLocIndex][8] == 1) ? true : false).change();
		}
	}
	if ( e.keyCode == 57 || e.keyCode == 105 ) {
		//9, F9
		if(e.shiftKey  == true || pressedKeys[0] == true)
		{
			onClickFunction(19);
			$('#check19').prop('checked', (LocFuncStatus[modeLocIndex][19] == 1) ? true : false).change();
		}
		else
		{
			onClickFunction(9);
			$("#check9").prop("checked", (LocFuncStatus[modeLocIndex][9] == 1) ? true : false).change();
		}
	}

	if ( e.keyCode == 111 ) {
		//F10-19
                                                                                                pressedKeys[0] = true;				
	}
	if ( e.keyCode == 106 ) {
		//F20-28
                                                                                                pressedKeys[1] = true;				
	}


}

function KeyUpFunc(e){

	if ( e.keyCode == 111 ) {
		//F10-19
                                                                                                pressedKeys[0] = false;				
	}
	if ( e.keyCode == 106 ) {
		//F20-28
                                                                                                pressedKeys[1] = false;				
	}
}