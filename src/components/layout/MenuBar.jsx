import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MenuBar({ onOpen, onSave, onSaveAs, onVerify, onUpload }) {
	return (
		<div className="flex items-center gap-1 bg-background border-b border-border px-2 py-0.5 text-xs z-[1000] relative">
			<DropdownMenu>
				<DropdownMenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">
					Archivo
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={onOpen}>Abrir</DropdownMenuItem>
					<DropdownMenuItem onClick={onSave}>Guardar</DropdownMenuItem>
					<DropdownMenuItem onClick={onSaveAs}>Guardar como</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">
					Editar
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Deshacer</DropdownMenuItem>
					<DropdownMenuItem>Rehacer</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">
					Programa
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={onVerify}>Verificar</DropdownMenuItem>
					<DropdownMenuItem onClick={onUpload}>Subir</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">
					Herramientas
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Preferencias</DropdownMenuItem>
					<DropdownMenuItem>Config. Robot</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
