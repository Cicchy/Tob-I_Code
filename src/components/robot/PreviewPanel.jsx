import { RobotPreview } from "@/components/sketches/RobotPreview";
import { SerialMonitor } from "@/components/sketches/SerialMonitor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export function PreviewPanel({ running, commands, onSimulationComplete }) {
	return (
		<ResizablePanelGroup direction="vertical">
			<ResizablePanel defaultSize={60}>
				<RobotPreview
					running={running}
					commands={commands}
					onSimulationComplete={onSimulationComplete}
				/>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={40} minSize={15}>
				<SerialMonitor />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
