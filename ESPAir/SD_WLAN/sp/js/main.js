
    var flagPower = 0;
    var addrLoco = 3;


    $(function () {
      // Initialization code

      UpdateLocoAddr(addrLoco);

      $("#speedobar").on('click touchstart touchmove touchend', function (e) {
        
        e.preventDefault();

        if( e.changedTouches[0] != null)
        {

          var touchObject = e.changedTouches[0];
          var touchX = touchObject.pageX;
          var touchY = touchObject.pageY;

          // �v�f�̈ʒu���擾
          var clientRect = e.target.getBoundingClientRect();
          var positionX = clientRect.left + window.pageXOffset;
          var positionY = clientRect.top + window.pageYOffset;

          // �v�f���ɂ�����^�b�`�ʒu���v�Z
          var x = touchX - positionX;
          var y = touchY - positionY;


          //console.log(y)
          
          LocSpeed = Math.round(Number(320 - y) * 1024 / 320);
          
          if( LocSpeed >= 1024)
          {
          	LocSpeed = 1023;
          }
          else if( LocSpeed < 0)
          {
            LocSpeed = 0;
          }
          
          OnDraw();
          
          onChangeSpeed(LocSpeed);
          
        }

        return true;
      });
    });
    

function onClickAddrNum(inNum)
{
    if( Number(addrLoco + inNum.toString()) <= 9999)
    {
      addrLoco = addrLoco + inNum.toString();
      UpdateLocoAddr(addrLoco);
    }
}

function onClickAddrCLR()
{
    addrLoco = "";
    UpdateLocoAddr(addrLoco);
    return true;
}

function onClickAddrBS()
{
    var aAddrNum = Math.floor(Number(addrLoco) / 10);

    addrLoco = String(aAddrNum);
    UpdateLocoAddr(addrLoco);
}

function onClickStop()
{
    LocSpeed = 0;
    onChangeSpeed(0);
      OnDraw();
    
    return true;
}

    function UpdateLocoAddr(inAddr)
    {
    
      if( inAddr=="")
      {
        $("#NumAddress").text("____");
        $("#CabAddress").text("*****");
      }
      else
      {
        $("#NumAddress").text(inAddr);
        $("#CabAddress").text(inAddr);
        UpdateLocAddr(Number(49152) + Number(inAddr));
      }
    }

        function onClickFunc(inFuncNo) {
          onClickFunction(inFuncNo);
        }

    var imgBarMask = new Image();
    imgBarMask.src = "/SD_WLAN/img/speedobar_mask.png";

    imgBarMask.onload = function () {
      OnDraw();
    }

    function OnDraw()
    {
        draw((Number(LocSpeed) * 320) / 1024, 320);
    }

    function draw(bar_val, bar_height) {
      var canvas = document.getElementById('speedobar');
      if (!canvas || !canvas.getContext) {
        return false;
      }
      var ctx = canvas.getContext('2d');

      //�D�F�ɕ`��
      ctx.fillStyle = "lightgray";
      ctx.fillRect(0, 0, canvas.width, bar_height - bar_val);

      /* �`�� */
      ctx.beginPath();
      /* �O���f�[�V�����̈���Z�b�g */
      var grad = ctx.createLinearGradient(0, 0, 0, bar_height);
      /* �O���f�[�V�����I�_�̃I�t�Z�b�g�ƐF���Z�b�g */
      grad.addColorStop(1, 'rgb(255, 180, 177)'); // ��
      grad.addColorStop(0, 'rgb(192, 80, 100)'); // ��
      /* �O���f�[�V������fillStyle�v���p�e�B�ɃZ�b�g */
      ctx.fillStyle = grad;


      ctx.rect(0, bar_height - bar_val, canvas.width, bar_height);
      /* �`�� */
      ctx.fill();

      ctx.drawImage(imgBarMask, 0, 0, canvas.width, canvas.height);
    }

    function enterPowerBtn()
    {

      if(flagPower == 1)
      {
        onClickPon(0);
        flagPower = 0;
        $("#PowerBtn").text("ON");
        $("#DStitle").text("DSair ");
      }
      else
      {
        onClickPon(1);
        flagPower = 1;
        $("#PowerBtn").text("OFF");
        $("#DStitle").text("DSair*");
      }
    }