import { generateCode } from "@/lib/codeGenerator";
import { parseCommands } from "@/lib/parseCommands";

export function createCodeGeneratorService() {
	return {
		generate(workspace) {
			return generateCode(workspace);
		},

		parseCommands(workspace) {
			return parseCommands(workspace);
		},
	};
}
