import * as Blockly from "blockly";
import { registerGenerators } from "@/lib/blockly/generators";
import { tobiBlocks, tobiToolbox } from "@/lib/blockly/tobiBlocks";
import { tobiTheme } from "@/lib/blockly/tobiTheme";

registerGenerators();
registerTobiBlocks();

export function createBlocklyService() {
	return {
		inject(container, overrides = {}) {
			const workspace = Blockly.inject(container, {
				toolbox: tobiToolbox,
				theme: tobiTheme,
				renderer: "zelos",
				grid: { spacing: 20, length: 3, colour: "#333", snap: true },
				move: { scrollbars: true, drag: true, wheel: true },
				zoom: { controls: true, wheel: true, startScale: 0.9 },
				trashcan: true,
				...overrides,
			});
			return workspace;
		},

		dispose(workspace) {
			workspace.dispose();
		},

		getXml(workspace) {
			const xmlDom = Blockly.Xml.workspaceToDom(workspace);
			return Blockly.Xml.domToText(xmlDom);
		},

		setXml(workspace, xmlText) {
			const xmlDom = Blockly.Xml.textToDom(xmlText);
			Blockly.Xml.domToWorkspace(xmlDom, workspace);
		},

		createTemporaryWorkspace() {
			const container = document.createElement("div");
			const ws = this.inject(container);
			return { workspace: ws, container, dispose: () => ws.dispose() };
		},

		addChangeListener(workspace, listener) {
			workspace.addChangeListener(listener);
		},

		setToolboxVisible(workspace, visible) {
			const toolbox = workspace.getToolbox();
			if (!toolbox) return;
			toolbox.setVisible(visible);
			const flyout = workspace.getFlyout();
			if (flyout) {
				visible ? toolbox.setSelectedItem(toolbox.getSelectedItem()) : flyout.hide();
			}
			setTimeout(() => workspace.resize(), 0);
		},
	};
}

function registerTobiBlocks() {
	Object.entries(tobiBlocks).forEach(([name, block]) => {
		if (!Blockly.Blocks[name]) {
			Blockly.Blocks[name] = block;
		}
	});
}
