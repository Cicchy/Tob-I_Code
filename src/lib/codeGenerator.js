import { javascriptGenerator } from "blockly/javascript";

export function generateCode(workspace) {
	if (!workspace) return "// No hay bloques en el espacio de trabajo";

	const code = javascriptGenerator.workspaceToCode(workspace);
	const lines = code
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);

	if (lines.length === 0) return "// No hay bloques en el espacio de trabajo";

	const varAssignRe = /^([a-zA-Z_]\w*)\s*=/;
	const declared = new Set();
	const declLines = [];
	const bodyLines = [];

	for (const line of lines) {
		const m = line.match(varAssignRe);
		if (m && !declared.has(m[1])) {
			declared.add(m[1]);
			const val = line
				.slice(line.indexOf("=") + 1)
				.trim()
				.replace(/;$/, "");
			declLines.push(`  int ${m[1]} = ${val};`);
		} else {
			bodyLines.push(`  ${line}`);
		}
	}

	return [
		"void setup() {",
		"  // Inicialización Tob-I",
		"}",
		"",
		"void loop() {",
		...(declLines.length ? [...declLines, ""] : []),
		...bodyLines,
		"}",
		"",
	].join("\n");
}
