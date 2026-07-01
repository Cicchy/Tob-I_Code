import { Bluetooth, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function BluetoothDialog({
	open,
	onOpenChange,
	isScanning,
	availableDevices,
	onConnectDevice,
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Vincular Robot Tob-I</DialogTitle>
					<DialogDescription>
						Busca dispositivos Bluetooth cercanos para conectar tu robot.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-6">
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-sm text-muted-foreground">Dispositivos disponibles</p>
							{isScanning && (
								<span className="text-xs text-accent animate-pulse flex items-center gap-1">
									<RotateCcw className="size-3 animate-spin" />
									Escaneando...
								</span>
							)}
						</div>
						<div className="grid gap-2">
							{isScanning
								? [1, 2, 3].map((i) => (
										<div key={i} className="h-9 w-full bg-muted animate-pulse rounded-md" />
									))
								: availableDevices.map((d) => (
										<Button
											key={d.id}
											variant="neutral"
											className="justify-between font-normal"
											onClick={() => onConnectDevice(d.name)}
										>
											<div className="flex items-center gap-2">
												<Bluetooth className="size-3.5" />
												{d.name}
											</div>
											<span className="text-[10px] opacity-50 uppercase font-bold">Conectar</span>
										</Button>
									))}
						</div>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="neutral">Cancelar</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
