import { javascriptGenerator, Order } from "blockly/javascript"

export function registerGenerators() {
  // ── Bloque de inicio — deja que blockToCode recorra la cadena next ──
  javascriptGenerator.forBlock["tobi_when_start"] = function () {
    return ""
  }

  // ── Movimiento ──
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

  // ── Control ──
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

  // ── Lógica ──
  javascriptGenerator.forBlock["controls_if"] = function (block) {
    let code = ""
    const n = block.elseifCount_ + 1
    for (let i = 0; i < n; i++) {
      const condition = javascriptGenerator.valueToCode(block, `IF${i}`, Order.NONE) || "true"
      const branch = javascriptGenerator.statementToCode(block, `DO${i}`)
      code += i === 0 ? `if (${condition}) {\n${branch}}` : ` else if (${condition}) {\n${branch}}`
    }
    if (block.elseCount_) {
      const branch = javascriptGenerator.statementToCode(block, "ELSE")
      code += ` else {\n${branch}}`
    }
    return code + "\n"
  }

  javascriptGenerator.forBlock["logic_compare"] = function (block) {
    const a = javascriptGenerator.valueToCode(block, "A", Order.RELATIONAL) || "0"
    const b = javascriptGenerator.valueToCode(block, "B", Order.RELATIONAL) || "0"
    const ops = { EQ: "==", NEQ: "!=", LT: "<", LTE: "<=", GT: ">", GTE: ">=" }
    const op = ops[block.getFieldValue("OP")] || "=="
    return [ `${a} ${op} ${b}`, Order.RELATIONAL ]
  }

  javascriptGenerator.forBlock["logic_operation"] = function (block) {
    const a = javascriptGenerator.valueToCode(block, "A", Order.LOGICAL_AND) || "true"
    const b = javascriptGenerator.valueToCode(block, "B", Order.LOGICAL_AND) || "true"
    const op = block.getFieldValue("OP") === "AND" ? "&&" : "||"
    return [ `${a} ${op} ${b}`, Order.LOGICAL_AND ]
  }

  javascriptGenerator.forBlock["logic_negate"] = function (block) {
    const a = javascriptGenerator.valueToCode(block, "BOOL", Order.LOGICAL_NOT) || "true"
    return [ `!(${a})`, Order.LOGICAL_NOT ]
  }

  javascriptGenerator.forBlock["logic_boolean"] = function (block) {
    const val = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false"
    return [ val, Order.ATOMIC ]
  }

  // ── Bucles (nativos) ──
  javascriptGenerator.forBlock["controls_repeat_ext"] = function (block) {
    const times = javascriptGenerator.valueToCode(block, "TIMES", Order.ASSIGNMENT) || "1"
    const branch = javascriptGenerator.statementToCode(block, "DO")
    const idx = block.id.replace(/\D/g, "") || "0"
    return `for (int _r${idx} = 0; _r${idx} < ${times}; _r${idx}++) {\n${branch}}`
  }

  javascriptGenerator.forBlock["controls_whileUntil"] = function (block) {
    const condition = javascriptGenerator.valueToCode(block, "BOOL", Order.CONDITIONAL) || "true"
    const mode = block.getFieldValue("MODE")
    const expr = mode === "UNTIL" ? `!(${condition})` : condition
    const branch = javascriptGenerator.statementToCode(block, "DO")
    return `while (${expr}) {\n${branch}}`
  }

  // ── Matemáticas ──
  javascriptGenerator.forBlock["math_number"] = function (block) {
    const num = block.getFieldValue("NUM")
    return [ num, Order.ATOMIC ]
  }

  javascriptGenerator.forBlock["math_arithmetic"] = function (block) {
    const a = javascriptGenerator.valueToCode(block, "A", Order.NONE) || "0"
    const b = javascriptGenerator.valueToCode(block, "B", Order.NONE) || "0"
    const op = block.getFieldValue("OP")
    const ops = { ADD: ["+", Order.ADD], MINUS: ["-", Order.SUBTRACT], MULTIPLY: ["*", Order.MULTIPLY], DIVIDE: ["/", Order.DIVIDE], POWER: ["^", Order.EXPONENTIATION] }
    const [sym, order] = ops[op] || ["+", Order.ADD]
    return op === "POWER"
      ? [ `pow(${a}, ${b})`, order ]
      : [ `${a} ${sym} ${b}`, order ]
  }

  javascriptGenerator.forBlock["math_single"] = function (block) {
    const a = javascriptGenerator.valueToCode(block, "NUM", Order.NONE) || "0"
    const op = block.getFieldValue("OP")
    const ops = {
      ROOT: ["sqrt", Order.UNARY],
      ABS: ["abs", Order.UNARY],
      NEG: ["-", Order.UNARY],
      LN: ["log", Order.UNARY],
      LOG10: ["log10", Order.UNARY],
      EXP: ["exp", Order.UNARY],
      POW10: ["pow10", Order.UNARY],
      SIN: ["sin", Order.UNARY],
      COS: ["cos", Order.UNARY],
      TAN: ["tan", Order.UNARY],
      ASIN: ["asin", Order.UNARY],
      ACOS: ["acos", Order.UNARY],
      ATAN: ["atan", Order.UNARY],
    }
    const [fn, order] = ops[op] || ["abs", Order.UNARY]
    if (op === "NEG") return [ `-(${a})`, order ]
    return [ `${fn}(${a})`, order ]
  }

  // ── Variables ──
  javascriptGenerator.forBlock["variables_set"] = function (block) {
    const varName = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE")
    const value = javascriptGenerator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "0"
    return `${varName} = ${value};`
  }

  javascriptGenerator.forBlock["variables_get"] = function (block) {
    const varName = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE")
    return [ varName, Order.ATOMIC ]
  }
}
