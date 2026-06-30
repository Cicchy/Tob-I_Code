import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export function useFileIO(fileService, codeGenerator) {
	const [sketchName, setSketchName] = useState("sin-titulo");
	const [code, setCode] = useState("");
	const [view, setView] = useState("blocks");
	const lastFilePath = useRef(null);

	const getCurrentCode = useCallback(
		(workspace) => {
			if (workspace) return codeGenerator.generate(workspace);
			return code;
		},
		[code, codeGenerator],
	);

	const handleSave = useCallback(
		async (workspace) => {
			try {
				const content = getCurrentCode(workspace);
				setCode(content);
				const result = await fileService.save(`${sketchName}.ino`, content);
				if (result?.success) {
					lastFilePath.current = result.filePath;
					toast.success("Archivo guardado", {
						description: `Guardado exitosamente ${sketchName}.ino`,
					});
				}
			} catch (err) {
				if (err.name !== "AbortError") {
					console.error("Error al guardar:", err);
					toast.error("Error al guardar", {
						description: "Ocurrió un error al guardar el archivo.",
					});
				}
			}
		},
		[sketchName, fileService, getCurrentCode],
	);

	const handleOpen = useCallback(async () => {
		try {
			const result = await fileService.open();
			if (result) {
				lastFilePath.current = result.filePath;
				setSketchName(result.name);
				setCode(result.content);
				setView("code");
			}
		} catch (err) {
			if (err.name !== "AbortError") console.error("Error al abrir:", err);
		}
	}, [fileService]);

	const handleSaveAs = useCallback(
		async (workspace) => {
			try {
				fileService.resetFileHandle?.();
				lastFilePath.current = null;
				await handleSave(workspace);
			} catch (err) {
				if (err.name !== "AbortError") console.error("Error al guardar como:", err);
			}
		},
		[handleSave, fileService],
	);

	return {
		sketchName,
		setSketchName,
		code,
		setCode,
		view,
		setView,
		getCurrentCode,
		handleSave,
		handleOpen,
		handleSaveAs,
	};
}
