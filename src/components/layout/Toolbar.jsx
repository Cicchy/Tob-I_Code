import { Bluetooth, Play, RotateCcw, Square, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Toolbar({
	sketchName,
	onSketchNameChange,
	onVerify,
	onUpload,
	device,
	onOpenPairing,
	onDisconnectDevice,
	running,
	onToggleSimulation,
	onResetSimulation,
}) {
	return (
		<header className="flex items-center gap-2 border-b border-border px-4 py-2">
			<div className="flex items-center gap-2">
				<Input
					value={sketchName}
					onChange={(e) => onSketchNameChange(e.target.value)}
					className="h-7 w-48 bg-background font-semibold text-sm"
					placeholder="nombre-del-programa"
				/>
				<span className="text-sm text-muted-foreground">.ino</span>
			</div>
			<div className="h-4 w-px bg-border" />
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					variant="neutral"
					onClick={onVerify}
					className="flex items-center gap-1.5"
				>
					<RotateCcw className="size-3.5" />
					Verificar
				</Button>
				<Button
					size="sm"
					variant="neutral"
					onClick={onUpload}
					className="flex items-center gap-1.5"
				>
					<Upload className="size-3.5" />
					Subir
				</Button>
				<div className="h-4 w-px bg-border" />
				<div className="flex items-center gap-2">
					{!device ? (
						<Button
							size="sm"
							variant="neutral"
							onClick={onOpenPairing}
							className="flex items-center gap-1.5"
						>
							<Bluetooth className="size-3.5" />
							Vincular robot
						</Button>
					) : (
						<div className="flex items-center gap-1 bg-accent/50 border border-border rounded-md px-2 py-1">
							<Bluetooth className="size-3.5 text-muted-foreground" />
							<span className="text-xs font-medium">{device}</span>
							<Button
								size="icon"
								variant="ghost"
								className="size-4 p-0 ml-1 hover:bg-destructive/20 hover:text-destructive"
								onClick={onDisconnectDevice}
							>
								<X className="size-3" />
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="flex-1" />
			<div className="flex items-center gap-1">
				<Button
					size="sm"
					variant={running ? "destructive" : "default"}
					onClick={onToggleSimulation}
				>
					{running ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
					{running ? "Detener" : "Ejecutar"}
				</Button>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={onResetSimulation}>
							<RotateCcw className="size-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Reiniciar simulación</TooltipContent>
				</Tooltip>
			</div>
		</header>
	);
}
