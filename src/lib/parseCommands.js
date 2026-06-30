export function parseCommands(workspace) {
	if (!workspace) return [];

	const topBlocks = workspace.getTopBlocks(true);
	const startBlocks = topBlocks.filter((block) => block.type === "tobi_when_start");
	const commands = [];

	if (startBlocks.length) {
		for (const block of startBlocks) {
			parseBlock(block, commands);
		}
	} else {
		for (const block of topBlocks) {
			parseBlock(block, commands);
		}
	}

	return commands;
}

function parseBlock(block, commands) {
	if (!block) return;

	switch (block.type) {
		case "tobi_when_start": {
			parseBlock(block.getNextBlock(), commands);
			return;
		}
		case "tobi_walk": {
			const steps = block.getFieldValue("STEPS");
			commands.push({ type: "walk", steps: Number(steps), duration: steps * 0.3 });
			break;
		}
		case "tobi_walk_backward": {
			const steps = block.getFieldValue("STEPS");
			commands.push({ type: "walk_backward", steps: Number(steps), duration: steps * 0.3 });
			break;
		}
		case "tobi_rotate": {
			const angle = block.getFieldValue("ANGLE");
			commands.push({ type: "rotate", angle: Number(angle), duration: 1.5 });
			break;
		}
		case "tobi_turn_left": {
			const angle = block.getFieldValue("ANGLE");
			commands.push({ type: "rotate", angle: -Number(angle), duration: 1.5 });
			break;
		}
		case "tobi_turn_right": {
			const angle = block.getFieldValue("ANGLE");
			commands.push({ type: "rotate", angle: Number(angle), duration: 1.5 });
			break;
		}
		case "tobi_speed": {
			const percent = block.getFieldValue("PERCENT");
			commands.push({ type: "speed", percent: Number(percent), duration: 0.1 });
			break;
		}
		case "tobi_jump":
			commands.push({ type: "jump", duration: 0.8 });
			break;
		case "tobi_incline": {
			const angle = block.getFieldValue("ANGLE");
			commands.push({ type: "incline", angle: Number(angle), duration: 0.6 });
			break;
		}
		case "tobi_tail_wag":
			commands.push({ type: "tail_wag", duration: 2 });
			break;
		case "tobi_sit":
			commands.push({ type: "sit", duration: 0.8 });
			break;
		case "tobi_stand":
			commands.push({ type: "stand", duration: 0.8 });
			break;
		case "tobi_dance":
			commands.push({ type: "dance", duration: 3 });
			break;
		case "tobi_stop":
			commands.push({ type: "stop", duration: 0.3 });
			break;
		case "tobi_wait": {
			const seconds = block.getFieldValue("SECONDS");
			commands.push({ type: "wait", seconds: Number(seconds), duration: Number(seconds) });
			break;
		}
		case "tobi_repeat": {
			const times = block.getFieldValue("TIMES");
			const body = [];
			const branch = block.getInputTargetBlock("DO");
			if (branch) {
				let current = branch;
				while (current) {
					parseBlock(current, body);
					current = current.getNextBlock();
				}
			}
			for (let i = 0; i < Number(times); i++) {
				commands.push(...body);
			}
			break;
		}
		case "tobi_for": {
			const _varName = block.getFieldValue("VAR");
			const from = Number(block.getFieldValue("FROM"));
			const to = Number(block.getFieldValue("TO"));
			const by = Number(block.getFieldValue("BY"));
			const body = [];
			const branch = block.getInputTargetBlock("DO");
			if (branch) {
				let current = branch;
				while (current) {
					parseBlock(current, body);
					current = current.getNextBlock();
				}
			}
			const count = Math.max(0, Math.floor((to - from) / by) + 1);
			for (let i = 0; i < count; i++) {
				commands.push(...body);
			}
			break;
		}
		case "tobi_while": {
			const body = [];
			const branch = block.getInputTargetBlock("DO");
			if (branch) {
				let current = branch;
				while (current) {
					parseBlock(current, body);
					current = current.getNextBlock();
				}
			}
			const MAX_ITER = 10;
			for (let i = 0; i < MAX_ITER; i++) {
				commands.push(...body);
			}
			break;
		}
	}

	parseBlock(block.getNextBlock(), commands);
}
