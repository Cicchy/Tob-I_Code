import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

let msgId = 0;

export function SerialMonitor() {
	const [messages, setMessages] = useState([
		{ id: msgId++, text: "// Monitor Serie Tob-I", type: "info" },
		{ id: msgId++, text: "// Conecta tu robot para ver la salida", type: "info" },
	]);
	const bottomRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	});

	function handleClear() {
		setMessages([]);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-border px-3 py-1.5">
				<span className="text-xs text-muted-foreground">Monitor Serie</span>
				<Button variant="ghost" size="icon" className="size-6" onClick={handleClear}>
					<Trash2 className="size-3" />
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-relaxed">
				{messages.map((msg) => (
					<div key={msg.id} className="text-muted-foreground">
						{msg.text}
					</div>
				))}
				<div ref={bottomRef} />
			</div>
		</div>
	);
}
