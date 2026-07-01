import { useCallback, useState } from "react";

export function useSimulation(codeGenerator, blocklyService) {
	const [running, setRunning] = useState(false);
	const [commands, setCommands] = useState([]);

	const startSimulation = useCallback(
		(workspace, xmlText) => {
			let cmds = [];
			if (workspace) {
				cmds = codeGenerator.parseCommands(workspace);
			} else if (xmlText) {
				const temp = blocklyService.createTemporaryWorkspace();
				blocklyService.setXml(temp.workspace, xmlText);
				cmds = codeGenerator.parseCommands(temp.workspace);
				temp.dispose();
			}
			setCommands(cmds);
			setRunning(true);
		},
		[codeGenerator, blocklyService],
	);

	const stopSimulation = useCallback(() => {
		setRunning(false);
		setCommands([]);
	}, []);

	const handleSimulationComplete = useCallback(() => {
		setRunning(false);
	}, []);

	return {
		running,
		commands,
		startSimulation,
		stopSimulation,
		handleSimulationComplete,
	};
}
