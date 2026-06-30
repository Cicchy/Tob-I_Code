export function createFileService() {
	const isElectron = typeof window !== "undefined" && window.electronAPI?.isElectron;

	if (isElectron) {
		return createElectronFileService();
	}
	return createWebFileService();
}

function createElectronFileService() {
	return {
		isAvailable: true,
		async save(fileName, content) {
			const result = await window.electronAPI.saveFile({ defaultName: fileName, content });
			return result;
		},
		async open() {
			const result = await window.electronAPI.openFile();
			if (!result.success) return null;
			return { content: result.content, name: result.name, filePath: result.filePath };
		},
	};
}

function createWebFileService() {
	let fileHandleRef = null;

	return {
		isAvailable: typeof window !== "undefined" && !!window.showSaveFilePicker,
		async save(fileName, content) {
			if (!fileHandleRef) {
				fileHandleRef = await window.showSaveFilePicker({
					suggestedName: fileName,
					types: [{ description: "Programa Tob-I", accept: { "text/plain": [".ino"] } }],
				});
			}
			const writable = await fileHandleRef.current?.createWritable();
			await writable.write(content);
			await writable.close();
			return { success: true, filePath: fileHandleRef.name };
		},
		async open() {
			const [handle] = await window.showOpenFilePicker({
				types: [{ description: "Programa Tob-I", accept: { "text/plain": [".ino"] } }],
				multiple: false,
			});
			const file = await handle.getFile();
			const content = await file.text();
			fileHandleRef = handle;
			return { content, name: file.name.replace(/\.ino$/, ""), filePath: handle.name };
		},
		resetFileHandle() {
			fileHandleRef = null;
		},
	};
}
