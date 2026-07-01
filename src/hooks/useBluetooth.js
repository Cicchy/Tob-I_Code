import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useBluetooth(connectionService) {
	const [device, setDevice] = useState("");
	const [isPairingOpen, setIsPairingOpen] = useState(false);
	const [isScanning, setIsScanning] = useState(false);
	const [availableDevices, setAvailableDevices] = useState([]);

	const openPairingDialog = useCallback(async () => {
		setIsPairingOpen(true);
		setIsScanning(true);
		try {
			const devices = await connectionService.scan();
			setAvailableDevices(devices);
		} catch {
			setAvailableDevices([
				{ id: "tob1", name: "Tob-I Cuadrúpedo v1" },
				{ id: "tob2", name: "Tob-I Cuadrúpedo v2" },
				{ id: "gen", name: "Dispositivo BT Genérico" },
			]);
		}
		setIsScanning(false);
	}, [connectionService]);

	const connectToDevice = useCallback(
		async (deviceName) => {
			await connectionService.connect(deviceName);
			setDevice(deviceName);
			setIsPairingOpen(false);
			toast.success("¡Vinculado!", { description: `Conectado a ${deviceName}` });
		},
		[connectionService],
	);

	const disconnectDevice = useCallback(() => {
		connectionService.disconnect();
		setDevice("");
	}, [connectionService]);

	return {
		device,
		isPairingOpen,
		setIsPairingOpen,
		isScanning,
		availableDevices,
		openPairingDialog,
		connectToDevice,
		disconnectDevice,
	};
}
