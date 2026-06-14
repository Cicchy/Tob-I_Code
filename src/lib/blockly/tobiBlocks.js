import * as Blockly from "blockly"

export const tobiBlocks = {
  tobi_walk: {
    init() {
      this.appendDummyInput()
        .appendField("caminar")
        .appendField(new Blockly.FieldNumber(10, 0, 100, 1), "STEPS")
        .appendField("pasos")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("motion_blocks")
      this.setTooltip("Mueve el robot hacia adelante un número de pasos")
    },
  },
  tobi_rotate: {
    init() {
      this.appendDummyInput()
        .appendField("girar")
        .appendField(new Blockly.FieldNumber(90, -360, 360, 1), "ANGLE")
        .appendField("°")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("motion_blocks")
      this.setTooltip("Gira el robot un número de grados")
    },
  },
  tobi_sit: {
    init() {
      this.appendDummyInput().appendField("sentarse")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("posture_blocks")
      this.setTooltip("Hace que el robot se siente")
    },
  },
  tobi_stand: {
    init() {
      this.appendDummyInput().appendField("pararse")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("posture_blocks")
      this.setTooltip("Hace que el robot se pare")
    },
  },
  tobi_dance: {
    init() {
      this.appendDummyInput().appendField("bailar")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("posture_blocks")
      this.setTooltip("Hace que el robot baile")
    },
  },
  tobi_stop: {
    init() {
      this.appendDummyInput().appendField("detener")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("stop_blocks")
      this.setTooltip("Detiene todos los movimientos del robot")
    },
  },
  tobi_wait: {
    init() {
      this.appendDummyInput()
        .appendField("esperar")
        .appendField(new Blockly.FieldNumber(1, 0, 60, 0.1), "SECONDS")
        .appendField("s")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("control_blocks")
      this.setTooltip("Pausa la ejecución por una duración")
    },
  },
  tobi_repeat: {
    init() {
      this.appendDummyInput()
        .appendField("repetir")
        .appendField(new Blockly.FieldNumber(3, 1, 999, 1), "TIMES")
        .appendField("veces")
      this.appendStatementInput("DO")
        .appendField("hacer")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle("control_blocks")
      this.setTooltip("Repite un conjunto de acciones")
    },
  },
}

export const tobiToolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Movimiento",
      categorystyle: "motion_category",
      colour: "#4a90d9",
      contents: [
        { kind: "block", type: "tobi_walk" },
        { kind: "block", type: "tobi_rotate" },
        { kind: "block", type: "tobi_sit" },
        { kind: "block", type: "tobi_stand" },
        { kind: "block", type: "tobi_dance" },
        { kind: "block", type: "tobi_stop" },
      ],
    },
    {
      kind: "category",
      name: "Control",
      categorystyle: "control_category",
      colour: "#50b86c",
      contents: [
        { kind: "block", type: "tobi_repeat" },
        { kind: "block", type: "tobi_wait" },
      ],
    },
    {
      kind: "category",
      name: "Lógica",
      categorystyle: "logic_category",
      colour: "#d9a84a",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_boolean" },
      ],
    },
    {
      kind: "category",
      name: "Bucles",
      categorystyle: "loop_category",
      colour: "#a864d9",
      contents: [
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_whileUntil" },
      ],
    },
    {
      kind: "category",
      name: "Matemáticas",
      categorystyle: "math_category",
      colour: "#4a9bd9",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
      ],
    },
  ],
}
