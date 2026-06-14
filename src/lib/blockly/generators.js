import { javascriptGenerator, Order } from "blockly/javascript"

export function registerGenerators() {
  javascriptGenerator.forBlock["tobi_walk"] = function (block) {
    const steps = block.getFieldValue("STEPS")
    return [`walk(${steps})`, Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_rotate"] = function (block) {
    const angle = block.getFieldValue("ANGLE")
    return [`rotate(${angle})`, Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_sit"] = function () {
    return ["sit()", Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_stand"] = function () {
    return ["stand()", Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_dance"] = function () {
    return ["dance()", Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_stop"] = function () {
    return ["stop()", Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_wait"] = function (block) {
    const seconds = block.getFieldValue("SECONDS")
    return [`wait(${seconds})`, Order.ATOMIC]
  }

  javascriptGenerator.forBlock["tobi_repeat"] = function (block) {
    const times = block.getFieldValue("TIMES")
    const branch = javascriptGenerator.statementToCode(block, "DO")
    return [`repeat(${times}, function() {\n${branch}\n})`, Order.ATOMIC]
  }
}
