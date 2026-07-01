import { useCallback } from "react";

export function useCodeGen(codeGenerator, blocklyService) {
	const handleGenerateCode = useCallback(
		(workspace, xmlText) => {
			if (workspace) {
				return codeGenerator.generate(workspace);
			}
			if (xmlText) {
				const temp = blocklyService.createTemporaryWorkspace();
				blocklyService.setXml(temp.workspace, xmlText);
				const generated = codeGenerator.generate(temp.workspace);
				temp.dispose();
				return generated;
			}
			return "";
		},
		[codeGenerator, blocklyService],
	);

	return { handleGenerateCode };
}
