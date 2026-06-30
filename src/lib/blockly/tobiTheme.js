import * as Blockly from "blockly";

const blockStyles = {
	motion_blocks: {
		colourPrimary: "#4a90d9",
		colourSecondary: "#3d7ab8",
		colourTertiary: "#33669e",
	},
	posture_blocks: {
		colourPrimary: "#e8734a",
		colourSecondary: "#cc5e38",
		colourTertiary: "#b04e2b",
	},
	stop_blocks: {
		colourPrimary: "#d94a4a",
		colourSecondary: "#bf3636",
		colourTertiary: "#a32a2a",
	},
	control_blocks: {
		colourPrimary: "#50b86c",
		colourSecondary: "#439e5c",
		colourTertiary: "#38854d",
	},
	logic_blocks: {
		colourPrimary: "#d9a84a",
		colourSecondary: "#c4953e",
		colourTertiary: "#ae8234",
	},
	loop_blocks: {
		colourPrimary: "#a864d9",
		colourSecondary: "#9156c4",
		colourTertiary: "#7c49ae",
	},
	event_blocks: {
		colourPrimary: "#f5a623",
		colourSecondary: "#d48e1f",
		colourTertiary: "#b4751c",
	},
	math_blocks: {
		colourPrimary: "#4a9bd9",
		colourSecondary: "#3d86b8",
		colourTertiary: "#33739e",
	},
};

const categoryStyles = {
	motion_category: { colour: "#4a90d9" },
	control_category: { colour: "#50b86c" },
	logic_category: { colour: "#d9a84a" },
	event_category: { colour: "#f5a623" },
	loop_category: { colour: "#a864d9" },
	math_category: { colour: "#4a9bd9" },
};

const componentStyles = {
	workspaceBackgroundColour: "#0a0a0a",
	toolboxBackgroundColour: "#171717",
	toolboxForegroundColour: "#a3a3a3",
	flyoutBackgroundColour: "#171717",
	flyoutForegroundColour: "#a3a3a3",
	flyoutOpacity: 1,
	scrollbarColour: "#262626",
	scrollbarOpacity: 0.8,
	insertionMarkerColour: "#525252",
	insertionMarkerOpacity: 0.3,
	selectedGlowColour: "#525252",
	selectedGlowOpacity: 0.3,
	cursorColour: "#a3a3a3",
	markerColour: "#a3a3a3",
};

const fontStyle = {
	family:
		"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	weight: "400",
	size: 13,
};

export const tobiTheme = new Blockly.Theme("tobi", blockStyles, categoryStyles, componentStyles);
tobiTheme.setFontStyle(fontStyle);
tobiTheme.setStartHats(true);
