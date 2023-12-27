//参考サイト https://zenn.dev/dami/articles/01cce2ed63be7e
// getGamepads メソッドに対応している

/*
割り当て	

AXIS -1～+1まで、Nは0.02くらい
B0	B
B1	A
B2	Y
B3	X
B4	L
B5	R
B6	ZL
B7	ZR
B8	-
B9	+
B10	なし
B11	なし
B12	上
B13	下
B14	左
B15	右
B16	HOME
B17	〇
*/

let start;
let a = 0;
let b = 0;
let LastLeverID = -99;
let LastButtons = {};
let GamePadIndex = 0;


if(navigator.getGamepads){

	window.addEventListener("gamepadconnected", (e) => {
	  console.log(
	    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
	    e.gamepad.index,
	    e.gamepad.id,
	    e.gamepad.buttons.length,
	    e.gamepad.axes.length
	  );

    GamePadIndex = e.gamepad.index;

    for( let i = 0; i < 18; i++)
    {
      LastButtons[i] = e.gamepad.buttons[i];
    }    
	  
	  gameLoop();

    //表示
    VisibleGamePadIcon(1);
	  
	  
	});

  addEventListener("gamepaddisconnected", (e) => {
    let gamepad = e.gamepad;
    console.log("Gamepad disconnected");
    //表示
    VisibleGamePadIcon(0);
    SetGamePadIconInfo(-990, "");

  });


}


    const buttonPressed = (button) => {
      if (typeof button == "object") {
        return button.pressed;
      }
      return button == 1.0;
    };

    const gameLoop = () => {
      const gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
      if (!gamepads) {
        return;
      }
  
      const gp = gamepads[GamePadIndex];

      //レバーの位置から判定
      //LスティックVerticalはaxis 1

      let aAxis1 = gp.axes[1];
      let aLeverID = 0;

      if( aAxis1 >= 0)
      {
        aLeverID = Math.trunc(aAxis1 * 5);
        aLeverID_Text = "P" + (aLeverID).toString(); 
      }
      else
      {
        aLeverID = -1 * Math.trunc(-aAxis1 * 9);   
        aLeverID_Text = "B" + (-aLeverID).toString(); 
      }

      //表記の強制変更
      if( aLeverID == 0)
      {
        aLeverID_Text = "N";
      }
      else if( aLeverID == -9)
      {
        aLeverID_Text = "EB";
      }

      //変化したときだけ表示
      if( LastLeverID != aLeverID)
      {
        console.log(aLeverID_Text);
        LastLeverID = aLeverID;
        //画面上に表示する
        SetGamePadIconInfo(aLeverID, aLeverID_Text);

      }  


      

      //Power ON/OFF   
      if ( (LastButtons[17].value != 1.0) && buttonPressed(gp.buttons[17])) {

        if(PowerStatus == 0)
        {
          onClickPon(1);
        }
        else
        {
          onClickPon(0);
        }
        
      }

      //F0 (X)
      if ((LastButtons[3].value != 1.0) && buttonPressed(gp.buttons[3])) {
        onClickFunction(0);

        //Update Function button on off status
        UpdateFunctionButtonsAll(modeLocIndex);
      }

      //F1 (Y)
      if ((LastButtons[2].value != 1.0) && buttonPressed(gp.buttons[2])) {
        onClickFunction(1);

        //Update Function button on off status
        UpdateFunctionButtonsAll(modeLocIndex);
      }

      //F2 (A)
      if ((LastButtons[1].value != 1.0) && buttonPressed(gp.buttons[1])) {
        onClickFunction(2);

        //Update Function button on off status
        UpdateFunctionButtonsAll(modeLocIndex);
      } 

      //F3 (B)
      if ((LastButtons[0].value != 1.0) && buttonPressed(gp.buttons[0])) {
        onClickFunction(3);

        //Update Function button on off status
        UpdateFunctionButtonsAll(modeLocIndex);
      } 

      //REV (L)
      if ((LastButtons[4].value != 1.0) && buttonPressed(gp.buttons[4])) {
        onClickFwd(2,0);
      } 

      //FWD (R)
      if ((LastButtons[5].value != 1.0) && buttonPressed(gp.buttons[5])) {
        onClickFwd(1,0);
      }       

      //次回用に保持
      for( let i = 0; i < 18; i++)
      {
        LastButtons[i] = gp.buttons[i];
      }


      start = requestAnimationFrame(gameLoop);
    };

