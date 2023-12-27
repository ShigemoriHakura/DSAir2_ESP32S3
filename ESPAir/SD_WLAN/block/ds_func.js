Blockly.JavaScript['speed'] = function(block) {
  var number_loc_addr = block.getFieldValue('LOC_ADDR');
  var number_loc_speed = block.getFieldValue('LOC_SPEED');
  
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocSpeed(' + number_loc_addr + ',' + number_loc_speed + ');\n';
  return code;
};

Blockly.JavaScript['speedx'] = function(block) {
  var value_inaddr = Blockly.JavaScript.valueToCode(block, 'inAddr', Blockly.JavaScript.ORDER_ATOMIC);
  var value_inspeed = Blockly.JavaScript.valueToCode(block, 'inSpeed', Blockly.JavaScript.ORDER_ATOMIC);

  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocSpeed(' + value_inaddr + ',' + value_inspeed + ');\n';
  return code;
};

Blockly.JavaScript['direction'] = function(block) {
  var number_loc_addr = block.getFieldValue('LOC_ADDR');
  var number_loc_dir = block.getFieldValue('LOC_DIR');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocDirection(' + number_loc_addr + ',' + number_loc_dir + ');\n';
  return code;
};

Blockly.JavaScript['directionx'] = function(block) {
  var value_inaddr = Blockly.JavaScript.valueToCode(block, 'inAddr', Blockly.JavaScript.ORDER_ATOMIC);
  var value_indir = Blockly.JavaScript.valueToCode(block, 'inDir', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocDirection(' + value_inaddr + ',' + value_indir + ');\n';
  return code;
};

Blockly.JavaScript['turnout'] = function(block) {
  var number_acc_addr = block.getFieldValue('ACC_ADDR');
  var dropdown_acc_dir = block.getFieldValue('ACC_DIR');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandTurnout(' + number_acc_addr + ',' + dropdown_acc_dir + ');\n';
  return code;
};

Blockly.JavaScript['turnoutx'] = function(block) {
  var value_inaddr = Blockly.JavaScript.valueToCode(block, 'inAddr', Blockly.JavaScript.ORDER_ATOMIC);
  var value_indir = Blockly.JavaScript.valueToCode(block, 'inDir', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandTurnout(' + value_inaddr + ',' + value_indir + ');\n';
  return code;
};

Blockly.JavaScript['locfunction'] = function(block) {
  var number_loc_addr = block.getFieldValue('LOC_ADDR');
  var number_name = block.getFieldValue('NAME');
  var checkbox_func_val = block.getFieldValue('FUNC_VAL') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocFunction(' + number_loc_addr + ',' + number_name + ',' + (checkbox_func_val == true ? 1 : 0) +');\n';
  return code;
};

Blockly.JavaScript['locfunction2'] = function(block) {
  var number_loc_addr = block.getFieldValue('LOC_ADDR');
  var number_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocFunction(' + number_loc_addr + ',' + number_name + ',1);Sleep(1);CommandLocFunction(' + number_loc_addr + ',' + number_name + ',0);\n';
  return code;
};

Blockly.JavaScript['locfunctionx'] = function(block) {
  var value_inaddr = Blockly.JavaScript.valueToCode(block, 'inAddr', Blockly.JavaScript.ORDER_ATOMIC);
  var value_infuncno = Blockly.JavaScript.valueToCode(block, 'inFuncNo', Blockly.JavaScript.ORDER_ATOMIC);
  var value_infuncval = Blockly.JavaScript.valueToCode(block, 'inFuncVal', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocFunction(' + value_inaddr + ',' + value_infuncno + ',' + value_infuncval +');\n';
  return code;
};

Blockly.JavaScript['getslotspeed'] = function(block) {
  var dropdown_slot_no = block.getFieldValue('SLOT_NO');
  var value_slot_num = Blockly.JavaScript.valueToCode(block, 'SLOT_NUM', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['waitsleep'] = function(block) {
  var number_wait_time = block.getFieldValue('WAIT_TIME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep(' + number_wait_time + ');\n';
  return code;
};

Blockly.JavaScript['waitsleep2'] = function(block) {
  var number_wait_time = Blockly.JavaScript.valueToCode(block, 'inWaitTime', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep(' + number_wait_time + ');\n';
  return code;
};

Blockly.JavaScript['s88start'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandGetS88();\n';
  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};

Blockly.JavaScript['s88get'] = function(block) {
  var number_s88_addr = block.getFieldValue('S88_ADDR');
  // TODO: Assemble JavaScript into code variable.
  var code = 'CommandGetS88Data(' + number_s88_addr + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['s88getx'] = function(block) {
  var value_prm_s88 = Blockly.JavaScript.valueToCode(block, 'PRM_S88', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'CommandGetS88Data(' + value_prm_s88 + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['getslotaddr'] = function(block) {
  var dropdown_slot_no = block.getFieldValue('SLOT_NO');
  // TODO: Assemble JavaScript into code variable.
  var code = 'GetSlotAdress(' + dropdown_slot_no + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['stop_funcx'] = function(block) {
  var value_prm_locaddr = Blockly.JavaScript.valueToCode(block, 'PRM_STOP', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocSpeed(' + value_prm_locaddr + ',0);\n';
  return code;
};

Blockly.JavaScript['stop_func'] = function(block) {
  var number_locaddr = block.getFieldValue('LOCADDR');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandLocSpeed(' + number_locaddr + ',0);\n';
  return code;
};

Blockly.JavaScript['playmp3'] = function(block) {
  var text_mp3file = block.getFieldValue('MP3FILE');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);playSound("/' + text_mp3file + '");\n';
  return code;
};

Blockly.JavaScript['playmp3list'] = function(block) {
  var text_mp3file = block.getFieldValue('MP3FILE');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);playSound("/SD_WLAN/block/locmedia/' + text_mp3file + '");\n';
  return code;
};

Blockly.JavaScript['stopmp3'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);stopSound();\n';
  return code;
};

Blockly.JavaScript['exitthis'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);exit();\n//@END\n';
  return code;
};

Blockly.JavaScript['beginthis2'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '//@BEGIN\nSleep2(1);\n';
  return code;
};

Blockly.JavaScript['exitthis2'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '//@END\n';
  return code;
};

Blockly.JavaScript['beginthis'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '//@BEGIN\nSleep2(1);\n';
  return code;
};


Blockly.JavaScript['getslotfnc'] = function(block) {
  var dropdown_slotno = block.getFieldValue('SLOTNO');
  var number_loc_fnc = block.getFieldValue('LOC_FNC');
  // TODO: Assemble JavaScript into code variable.
  var code = 'GetSlotFnc(' + dropdown_slotno + ',' + number_loc_fnc +  ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['power'] = function(block) {
  var checkbox_pwr_val = block.getFieldValue('PWR_VAL');
  // TODO: Assemble JavaScript into code variable.
  var code = 'CommandPower(' + checkbox_pwr_val +');Sleep(2);\n';
  return code;
};

Blockly.JavaScript['powerx'] = function(block) {
  var value_prm_pwr = Blockly.JavaScript.valueToCode(block, 'PRM_PWR', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);CommandPower(' + (value_prm_pwr == true ? 1 : 0) +');Sleep(2);\n';
  return code;
};

Blockly.JavaScript['analogpwm'] = function(block) {
  var value_prm_analog = block.getFieldValue('VAL_DUTY') * 1023 / 100;
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);ANA_Speed(' + Math.trunc(value_prm_analog) + ');\n';
  return code;
};

Blockly.JavaScript['analogdir'] = function(block) {
  var value_prm_anadir = block.getFieldValue('VAL_DIR');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);ANA_Fwd(' + value_prm_anadir + ');\n';
  return code;
};

Blockly.JavaScript['ChangeProtocolDCC'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);UpdateProtocol(1);\n';
  return code;
};

Blockly.JavaScript['ChangeProtocolMM2'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);UpdateProtocol(0);\n';
  return code;
};

Blockly.JavaScript['say_deco'] = function(block) {
  var text_deco = block.getFieldValue('SAYTEXT');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);DecoSay("' + text_deco + '");\n';
  return code;
};

Blockly.JavaScript['say_decox'] = function(block) {
  var text_deco = Blockly.JavaScript.valueToCode(block, 'inText', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);DecoSay(' + text_deco + ');\n';
  return code;
};


Blockly.JavaScript['excr_deco'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);DecoSay("!");\n';
  return code;
};


Blockly.JavaScript['show_deco'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);DecoShow(1);\n';
  return code;
};

Blockly.JavaScript['close_deco'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Sleep2(1);DecoShow(0);\n';
  return code;
};
