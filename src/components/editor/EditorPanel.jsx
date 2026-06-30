import { BlocklyWorkspace } from "@/components/sketches/BlocklyWorkspace";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function EditorPanel({
	view,
	onViewChange,
	code,
	onCodeChange,
	onGenerateCode,
	wsRef,
	onBlocksChange,
}) {
	return (
		<div className="flex h-full flex-col">
			<Tabs
				value={view}
				onValueChange={(value) => {
					if (value === "code") onGenerateCode();
					onViewChange(value);
				}}
				className="flex flex-col size-full"
			>
				<div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
					<TabsList>
						<TabsTrigger value="blocks">Bloques</TabsTrigger>
						<TabsTrigger value="code">Código</TabsTrigger>
					</TabsList>
					{view === "code" && (
						<div className="flex items-center gap-2 ml-2">
							<Button size="sm" variant="ghost" onClick={onGenerateCode}>
								Regenerar
							</Button>
						</div>
					)}
				</div>
				<div className="flex-1 overflow-hidden border-t border-border">
					<TabsContent value="code" className="size-full h-full">
						<Textarea
							value={code}
							onChange={(e) => onCodeChange(e.target.value)}
							className="size-full resize-none border-0 bg-background p-4 font-mono text-sm text-foreground outline-none"
							spellCheck={false}
							placeholder="// El código generado aparecerá aquí..."
						/>
					</TabsContent>
					<TabsContent value="blocks" className="size-full h-full">
						<BlocklyWorkspace ref={wsRef} onChange={onBlocksChange} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
