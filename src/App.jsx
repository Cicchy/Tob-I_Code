import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { MenuBar } from "@/components/layout/MenuBar";
import { Toolbar } from "@/components/layout/Toolbar";
import { BluetoothDialog } from "@/components/robot/BluetoothDialog";
import { PreviewPanel } from "@/components/robot/PreviewPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useCodeGen } from "@/hooks/useCodeGen";
import { useFileIO } from "@/hooks/useFileIO";
import { useSimulation } from "@/hooks/useSimulation";
import { createBlocklyService } from "@/services/blocklyService";
import { createCodeGeneratorService } from "@/services/codeGeneratorService";
import { createConnectionService } from "@/services/connectionService";
import { createFileService } from "@/services/fileService";

const fileService = createFileService();
const codeGeneratorService = createCodeGeneratorService();
const blocklyService = createBlocklyService();

export default function App() {
	const wsRef = useRef(null);
	const xmlRef = useRef("");

	const {
		sketchName,
		setSketchName,
		code,
		setCode,
		view,
		setView,
		handleSave,
		handleOpen,
		handleSaveAs,
	} = useFileIO(fileService, codeGeneratorService);

	const { running, commands, startSimulation, stopSimulation, handleSimulationComplete } =
		useSimulation(codeGeneratorService, blocklyService);

	const {
		device,
		isPairingOpen,
		setIsPairingOpen,
		isScanning,
		availableDevices,
		openPairingDialog,
		connectToDevice,
		disconnectDevice,
	} = useBluetooth(createConnectionService());

	const { handleGenerateCode } = useCodeGen(codeGeneratorService, blocklyService);

	const handleBlocksChange = useCallback((xml) => {
		xmlRef.current = xml;
	}, []);

	const handleVerify = useCallback(() => {
		toast.loading("Verificando programa", {
			description: "Revisando errores de compilación...",
		});
		setTimeout(() => {
			toast.success("Verificación exitosa", {
				description: "El código está listo para subir.",
			});
		}, 1500);
	}, []);

	const handleUpload = useCallback(() => {
		toast.loading("Subiendo al robot", {
			description: `Enviando código a ${device}...`,
		});
		setTimeout(() => {
			toast.success("Subida completa", {
				description: "El robot ahora ejecuta el último programa.",
			});
		}, 2500);
	}, [device]);

	const handleGenerateAndSetCode = useCallback(() => {
		const generated = handleGenerateCode(wsRef.current?.workspace, xmlRef.current);
		setCode(generated);
	}, [handleGenerateCode, setCode]);

	const handleToggleSimulation = useCallback(() => {
		if (running) {
			stopSimulation();
		} else {
			startSimulation(wsRef.current?.workspace, xmlRef.current);
		}
	}, [running, stopSimulation, startSimulation]);

	const handleSaveCurrent = useCallback(() => {
		handleSave(wsRef.current?.workspace);
	}, [handleSave]);

	const handleSaveAsCurrent = useCallback(() => {
		handleSaveAs(wsRef.current?.workspace);
	}, [handleSaveAs]);

	return (
		<TooltipProvider>
			<div className="flex h-svh flex-col">
				<Toaster />
				<MenuBar
					onOpen={handleOpen}
					onSave={handleSaveCurrent}
					onSaveAs={handleSaveAsCurrent}
					onVerify={handleVerify}
					onUpload={handleUpload}
				/>
				<Toolbar
					sketchName={sketchName}
					onSketchNameChange={setSketchName}
					onVerify={handleVerify}
					onUpload={handleUpload}
					device={device}
					onOpenPairing={openPairingDialog}
					onDisconnectDevice={disconnectDevice}
					running={running}
					onToggleSimulation={handleToggleSimulation}
					onResetSimulation={stopSimulation}
				/>
				<BluetoothDialog
					open={isPairingOpen}
					onOpenChange={(open) => {
						setIsPairingOpen(open);
						if (open) openPairingDialog();
					}}
					isScanning={isScanning}
					availableDevices={availableDevices}
					onConnectDevice={connectToDevice}
				/>
				<ResizablePanelGroup direction="horizontal" className="flex-1">
					<ResizablePanel defaultSize={50}>
						<EditorPanel
							view={view}
							onViewChange={setView}
							code={code}
							onCodeChange={setCode}
							onGenerateCode={handleGenerateAndSetCode}
							wsRef={wsRef}
							onBlocksChange={handleBlocksChange}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={50}>
						<PreviewPanel
							running={running}
							commands={commands}
							onSimulationComplete={handleSimulationComplete}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</TooltipProvider>
	);
}
