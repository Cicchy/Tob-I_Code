import { javascriptGenerator } from "blockly/javascript"

export function generateCode(workspace) {
  if (!workspace) return "// No hay bloques en el espacio de trabajo"

  const code = javascriptGenerator.workspaceToCode(workspace)
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return "// No hay bloques en el espacio de trabajo"

  const body = lines
    .map((l) => `  ${l}`)
    .join("\n")

  return [
    "void setup() {",
    "  // Inicialización Tob-I",
    "}",
    "",
    "void loop() {",
    body,
    "}",
    "",
  ].join("\n")
}
