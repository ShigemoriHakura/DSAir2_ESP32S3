Blockly.Blocks['speed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_RUN"]);
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(3, 1, 9999), "LOC_ADDR");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_SPEED"])
        .appendField(new Blockly.FieldNumber(0, 0, 100), "LOC_SPEED")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['speedx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_RUN"]);
    this.appendValueInput("inAddr")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
    this.appendValueInput("inSpeed")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_SPEED"])
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['direction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DIR"]);
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(3, 1, 9999), "LOC_ADDR");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_Dir2"])
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg["MENU_DS_FWD"],"1"], [Blockly.Msg["MENU_DS_REV"],"2"]]), "LOC_DIR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['directionx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DIR"]);
    this.appendValueInput("inAddr")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
    this.appendValueInput("inDir")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_Dir2"])
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['turnout'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_TURNOUT"]);
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(1, 1, 2048), "ACC_ADDR");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_Dir2"])
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg["MENU_DS_STR"],"1"], [Blockly.Msg["MENU_DS_DIV"],"0"]]), "ACC_DIR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(315);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['turnoutx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_TURNOUT"]);
    this.appendValueInput("inAddr")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
    this.appendValueInput("inDir")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_Dir2"])
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(315);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['locfunction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_FUNC"]);
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(3, 1, 9999), "LOC_ADDR");
    this.appendDummyInput()
        .appendField("F")
        .appendField(new Blockly.FieldNumber(0, 0, 28), "NAME");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ACTION"])
        .appendField(new Blockly.FieldCheckbox("TRUE"), "FUNC_VAL");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("loco function");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['locfunction2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_FUNCMOM"]);
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(3, 1, 9999), "LOC_ADDR");
    this.appendDummyInput()
        .appendField("F")
        .appendField(new Blockly.FieldNumber(0, 0, 28), "NAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Function momentary");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['locfunctionx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_FUNC"]);
    this.appendValueInput("inAddr")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
    this.appendValueInput("inFuncNo")
        .setCheck("Number")
        .appendField("F")
    this.appendValueInput("inFuncVal")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ACTION"])
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("loco function");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['getslotspeed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Slot Speed")
        .appendField(new Blockly.FieldDropdown([["Slot1","0"], ["Slot2","1"], ["Slot3","2"], ["Slot4","3"]]), "SLOT_NO");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['waitsleep'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_WAIT"])
        .appendField(new Blockly.FieldNumber(1, 1, 100000), "WAIT_TIME")
        .appendField(Blockly.Msg["MENU_DS_WAITSEC"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['waitsleep2'] = {
  init: function() {
    this.appendValueInput("inWaitTime")
    .appendField(Blockly.Msg["MENU_DS_WAIT"])
    .setCheck("Number")
    .appendField(Blockly.Msg["MENU_DS_WAITSEC"])
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['s88start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_S88START"]);
    this.setInputsInline(true);
    this.setColour(260);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['s88get'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_S88SENSOR"])
        .appendField(new Blockly.FieldNumber(1, 1, 16), "S88_ADDR");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['s88getx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_S88SENSOR"]);
    this.appendValueInput("PRM_S88")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['getslotaddr'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Slot Addr")
        .appendField(new Blockly.FieldDropdown([["Slot1","0"], ["Slot2","1"], ["Slot3","2"], ["Slot4","3"]]), "SLOT_NO");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['stop_funcx'] = {
  init: function() {
    this.appendValueInput("PRM_STOP")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_STOP"])
        .appendField(Blockly.Msg["MENU_DS_ADDR"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['stop_func'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_STOP"])
        .appendField(Blockly.Msg["MENU_DS_ADDR"])
        .appendField(new Blockly.FieldNumber(3, 1, 9999), "LOCADDR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['playmp3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_MP3PLAY"])
        .appendField(new Blockly.FieldTextInput("test.mp3"), "MP3FILE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['playmp3list'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_MP3PRESET"])
        .appendField(new Blockly.FieldDropdown([["警笛1","horn1.mp3"], ["警笛2","horn2.mp3"], ["汽笛","C61Whistle.mp3"], ["発車ベル","stationbell1.mp3"], ["手笛","whistle.mp3"], ["ブレーキ緩解","break.mp3"], ["ふみきり","fumikiri.mp3"], ["ドア開1","door_open.mp3"], ["ドア閉1","door_close.mp3"], ["ドア開2","door_open2.mp3"],["ドア開3","door_open3.mp3"], ["ドア閉3","door_close3.mp3"], ["国鉄オルゴール","Heykens.mp3"]]), "MP3FILE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['stopmp3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_MP3STOP"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['beginthis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_PRGSTART"]);
    this.setInputsInline(true);
    this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("Start program");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['exitthis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_PRGEND"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(false, null);
    this.setColour(180);
 this.setTooltip("Exit program");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['beginthis2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_THREADSTART"]);
    this.setInputsInline(true);
    this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("Start thread");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['exitthis2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_THREADEND"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(false, null);
    this.setColour(180);
 this.setTooltip("Exit thread");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['getslotfnc'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("SlotFunc");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Slot 1","0"], ["Slot 2","1"], ["Slot 3","2"], ["Slot4","3"]]), "SLOTNO")
        .appendField("Number")
        .appendField(new Blockly.FieldNumber(0, 0, 28), "LOC_FNC");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(270);
 this.setTooltip("Check Slot function status ON/OFF");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['powerx'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_POWER"]);
    this.appendValueInput("inPwr")
        .setCheck("Number")
        .appendField(Blockly.Msg["MENU_DS_ACTION"]);
   this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['power'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_POWER"])
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg["MENU_DS_OFF"],"0"], [Blockly.Msg["MENU_DS_ON"],"1"]]), "PWR_VAL");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['analogpwm'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("PWM");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_STRENGTH"])
        .appendField(new Blockly.FieldNumber(0, 0, 100), "VAL_DUTY")
        .appendField("%");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
 this.setTooltip("Output analog PWM pulse.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['analogdir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("PWM");
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_Dir2"])
        .appendField(new Blockly.FieldNumber(1, 1, 2), "VAL_DIR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
 this.setTooltip("Change analog PWM direction.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ChangeProtocolMM2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_MM2MODE"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(170);
 this.setTooltip("Set Marklin digital Mode");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ChangeProtocolDCC'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DCCMODE"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(170);
 this.setTooltip("Set DCC mode");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['say_deco'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Hmm"), "SAYTEXT")
        .appendField(Blockly.Msg["MENU_DS_DECOSAYS"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['say_decox'] = {
  init: function() {
    this.appendValueInput("inText")
        .setCheck("Text")    
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DECOSAYS"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['excr_deco'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DECOSURPRISED"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
 this.setTooltip("でーこちゃんがおどろきます");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['show_deco'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DECOCOMES"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
 this.setTooltip("Coming deco chan.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['close_deco'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg["MENU_DS_DECOGOHOME"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
 this.setTooltip("Leave deco chan.");
 this.setHelpUrl("");
  }
};