import { javascriptGenerator, Order } from "blockly/javascript"

export function registerGenerators() {
  javascriptGenerator.forBlock["tobi_walk"] = function (block) {
    const steps = block.getFieldValue("STEPS")
    return `caminar(${steps});`
  }

  javascriptGenerator.forBlock["tobi_walk_backward"] = function (block) {
    const steps = block.getFieldValue("STEPS")
    return `retroceder(${steps});`
  }

  javascriptGenerator.forBlock["tobi_rotate"] = function (block) {
    const angle = block.getFieldValue("ANGLE")
    return `girar(${angle});`
  }

  javascriptGenerator.forBlock["tobi_turn_left"] = function (block) {
    const angle = block.getFieldValue("ANGLE")
    return `girar(${-angle});`
  }

  javascriptGenerator.forBlock["tobi_turn_right"] = function (block) {
    const angle = block.getFieldValue("ANGLE")
    return `girar(${angle});`
  }

  javascriptGenerator.forBlock["tobi_speed"] = function (block) {
    const percent = block.getFieldValue("PERCENT")
    return `velocidad(${percent});`
  }

  javascriptGenerator.forBlock["tobi_jump"] = function () {
    return "saltar();"
  }

  javascriptGenerator.forBlock["tobi_incline"] = function (block) {
    const angle = block.getFieldValue("ANGLE")
    return `inclinarse(${angle});`
  }

  javascriptGenerator.forBlock["tobi_tail_wag"] = function () {
    return "moverCola();"
  }

  javascriptGenerator.forBlock["tobi_sit"] = function () {
    return "sentarse();"
  }

  javascriptGenerator.forBlock["tobi_stand"] = function () {
    return "pararse();"
  }

  javascriptGenerator.forBlock["tobi_dance"] = function () {
    return "bailar();"
  }

  javascriptGenerator.forBlock["tobi_stop"] = function () {
    return "detener();"
  }

  javascriptGenerator.forBlock["tobi_wait"] = function (block) {
    const seconds = block.getFieldValue("SECONDS")
    return `esperar(${seconds});`
  }

  javascriptGenerator.forBlock["tobi_repeat"] = function (block) {
    const times = block.getFieldValue("TIMES")
    const branch = javascriptGenerator.statementToCode(block, "DO")
    const idx = block.id.replace(/\D/g, "") || "0"
    return `for (int _r${idx} = 0; _r${idx} < ${times}; _r${idx}++) {\n${branch}}`
  }

  javascriptGenerator.forBlock["tobi_for"] = function (block) {
    const varName = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE")
    const from = block.getFieldValue("FROM") || "0"
    const to = block.getFieldValue("TO") || "10"
    const by = block.getFieldValue("BY") || "1"
    const branch = javascriptGenerator.statementToCode(block, "DO")
    return `for (int ${varName} = ${from}; ${varName} <= ${to}; ${varName} += ${by}) {\n${branch}}`
  }

  javascriptGenerator.forBlock["tobi_while"] = function (block) {
    const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.CONDITIONAL) || "true"
    const branch = javascriptGenerator.statementToCode(block, "DO")
    return `while (${condition}) {\n${branch}}`
  }

  javascriptGenerator.forBlock["variables_set"] = function (block) {
    const varName = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE")
    const value = javascriptGenerator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "0"
    return `${varName} = ${value};`
  }

  javascriptGenerator.forBlock["variables_get"] = function (block) {
    const varName = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE")
    return [varName, Order.ATOMIC]
  }
}
