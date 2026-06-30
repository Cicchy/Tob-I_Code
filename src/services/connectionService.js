export function createConnectionService(implementation = "mock") {
	switch (implementation) {
		case "bluetooth":
			return createBluetoothConnectionService();
		case "serial":
			return createSerialConnectionService();
		default:
			return createMockConnectionService();
	}
}

function createMockConnectionService() {
	let connectedDevice = null;

	return {
		get isConnected() {
			return connectedDevice !== null;
		},
		get connectedDevice() {
			return connectedDevice;
		},

		async scan() {
			await delay(2000);
			return [
				{ id: "tob1", name: "Tob-I Cuadrúpedo v1" },
				{ id: "tob2", name: "Tob-I Cuadrúpedo v2" },
				{ id: "gen", name: "Dispositivo BT Genérico" },
			];
		},

		async connect(deviceId) {
			connectedDevice = { id: deviceId, name: deviceId };
			return true;
		},

		disconnect() {
			connectedDevice = null;
		},

		async upload(_code) {
			await delay(2500);
			return true;
		},
	};
}

function createBluetoothConnectionService() {
	let device = null;
	let _server = null;
	let _service = null;
	let _characteristic = null;

	return {
		get isConnected() {
			return device !== null;
		},
		get connectedDevice() {
			return device ? { id: device.id, name: device.name } : null;
		},

		async scan() {
			// TODO: implement navigator.bluetooth.requestDevice()
			throw new Error("Web Bluetooth no implementado");
		},

		async connect(_deviceId) {
			// TODO: implement GATT connection
			throw new Error("Web Bluetooth no implementado");
		},

		disconnect() {
			device = null;
			_server = null;
			_service = null;
			_characteristic = null;
		},

		async upload(_code) {
			// TODO: implement firmware upload via BLE
			throw new Error("Upload via Bluetooth no implementado");
		},
	};
}

function createSerialConnectionService() {
	let port = null;
	const _reader = null;

	return {
		get isConnected() {
			return port !== null;
		},
		get connectedDevice() {
			return port ? { id: port.id, name: "Puerto Serie" } : null;
		},

		async scan() {
			// TODO: implement navigator.serial.requestPort()
			throw new Error("Web Serial no implementado");
		},

		async connect(_deviceId) {
			throw new Error("Web Serial no implementado");
		},

		disconnect() {
			port = null;
		},

		async upload(_code) {
			throw new Error("Upload via Serial no implementado");
		},
	};
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
