import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuSeparator,
} from "@/components/ui/menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  Resizable,
  ResizablePanel,
  ResizableResizeTrigger,
} from "@/components/ui/resizable"
import { Toaster, toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Save,
  FolderOpen,
  Upload,
  Play,
  Square,
  RotateCcw,
  Trash2,
  Bluetooth,
  X,
} from "lucide-react"
import { BlocklyWorkspace } from "@/components/sketches/BlocklyWorkspace"
import { RobotPreview } from "@/components/sketches/RobotPreview"
import { SerialMonitor } from "@/components/sketches/SerialMonitor"
import { generateCode } from "@/lib/codeGenerator"

const isElectron = typeof window !== "undefined" && window.electronAPI?.isElectron

export default function App() {
  const [view, setView] = useState("blocks")
  const [code, setCode] = useState("")
  const [running, setRunning] = useState(false)
  const [sketchName, setSketchName] = useState("sin-titulo")
  const [device, setDevice] = useState("")
  const [isPairingOpen, setIsPairingOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const wsRef = useRef(null)
  const fileHandleRef = useRef(null)
  const lastFilePath = useRef(null)

  const handleVerify = useCallback(() => {
    toast({
      title: "Verificando programa",
      description: "Revisando errores de compilación...",
      type: "loading",
    });

    setTimeout(() => {
      toast({
        title: "Verificación exitosa",
        description: "El código está listo para subir.",
        type: "success",
      });
    }, 1500);
  }, [])

  const handleUpload = useCallback(() => {
    toast({
      title: "Subiendo al robot",
      description: `Enviando código a ${device}...`,
      type: "loading",
    });

    setTimeout(() => {
      toast({
        title: "Subida completa",
        description: "El robot ahora ejecuta el último programa.",
        type: "success",
      });
    }, 2500);
  }, [device])

  const handleGenerateCode = useCallback(() => {
    if (!wsRef.current?.workspace) return
    const generated = generateCode(wsRef.current.workspace)
    setCode(generated)
  }, [])

  const handleBlocksChange = useCallback((xml) => {
    // Blockly XML changed - store for later
  }, [])

  function getCurrentCode() {
    if (!wsRef.current?.workspace) return code
    return generateCode(wsRef.current.workspace)
  }

  const handleSave = useCallback(async () => {
    try {
      const content = getCurrentCode()
      setCode(content)
      if (isElectron) {
        const result = await window.electronAPI.saveFile({
          defaultName: `${sketchName}.ino`,
          content,
        })
        if (result.success) {
          lastFilePath.current = result.filePath
          toast({
            title: "Archivo guardado",
            description: `Guardado exitosamente ${sketchName}.ino`,
            type: "success",
          })
        }
      } else if (window.showSaveFilePicker) {
        if (!fileHandleRef.current) {
          fileHandleRef.current = await window.showSaveFilePicker({
            suggestedName: `${sketchName}.ino`,
            types: [
              {
                description: "Programa Tob-I",
                accept: { "text/plain": [".ino"] },
              },
            ],
          })
        }
        const writable = await fileHandleRef.current.createWritable()
        await writable.write(content)
        await writable.close()
        toast({
          title: "Archivo guardado",
          description: `Guardado exitosamente ${sketchName}.ino`,
          type: "success",
        })
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error al guardar:", err)
        toast({
          title: "Error al guardar",
          description: "Ocurrió un error al guardar el archivo.",
          type: "error",
        })
      }
    }
  }, [code, sketchName])

  const handleOpen = useCallback(async () => {
    try {
      if (isElectron) {
        const result = await window.electronAPI.openFile()
        if (result.success) {
          lastFilePath.current = result.filePath
          setSketchName(result.name)
          setCode(result.content)
          setView("code")
        }
      } else if (window.showOpenFilePicker) {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: "Programa Tob-I",
              accept: { "text/plain": [".ino"] },
            },
          ],
          multiple: false,
        })
        const file = await handle.getFile()
        const content = await file.text()
        fileHandleRef.current = handle
        setSketchName(file.name.replace(/\.ino$/, ""))
        setCode(content)
        setView("code")
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error al abrir:", err)
    }
  }, [])

  const handleSaveAs = useCallback(async () => {
    try {
      fileHandleRef.current = null
      lastFilePath.current = null
      await handleSave()
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error al guardar como:", err)
    }
  }, [handleSave])

  return (
    <div className="flex h-svh flex-col">
      <Toaster />
      {/* Barra de menús */}
      <div className="flex items-center gap-1 bg-background border-b border-border px-2 py-0.5 text-xs z-[1000] relative">
        <Menu>
          <MenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">Archivo</MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleOpen}>Abrir</MenuItem>
            <MenuItem onClick={handleSave}>Guardar</MenuItem>
            <MenuItem onClick={handleSaveAs}>Guardar como</MenuItem>
            <MenuSeparator />
            <MenuItem variant="destructive">Eliminar</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">Editar</MenuTrigger>
          <MenuContent>
            <MenuItem>Deshacer</MenuItem>
            <MenuItem>Rehacer</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">Programa</MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleVerify}>Verificar</MenuItem>
            <MenuItem onClick={handleUpload}>Subir</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer">Herramientas</MenuTrigger>
          <MenuContent>
            <MenuItem>Preferencias</MenuItem>
            <MenuItem>Config. Robot</MenuItem>
          </MenuContent>
        </Menu>
      </div>

      {/* Barra de herramientas */}
      <header className="flex items-center gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Input
            value={sketchName}
            onChange={(e) => setSketchName(e.target.value)}
            className="h-7 w-48 bg-background font-semibold text-sm"
            placeholder="nombre-del-programa"
          />
          <span className="text-sm text-muted-foreground">.ino</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleVerify} className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            Verificar
          </Button>
          <Button size="sm" variant="outline" onClick={handleUpload} className="flex items-center gap-1.5">
            <Upload className="size-3.5" />
            Subir
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            {!device ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPairingOpen(true)}
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
                  onClick={() => setDevice("")}
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
            onClick={() => setRunning(!running)}
          >
            {running ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? "Detener" : "Ejecutar"}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <RotateCcw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reiniciar simulación</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Diálogo de vinculación Bluetooth */}
      <Dialog
        open={isPairingOpen}
        onOpenChange={(details) => {
          setIsPairingOpen(details.open);
          if (details.open) {
            setIsScanning(true);
            setTimeout(() => setIsScanning(false), 2000);
          }
        }}
      >
        <DialogContent size="md">
          <DialogHeader
            title="Vincular Robot Tob-I"
            description="Busca dispositivos Bluetooth cercanos para conectar tu robot."
          />
          <DialogBody className="flex flex-col gap-4 py-6">
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
                {isScanning ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="h-9 w-full bg-muted animate-pulse rounded-md" />
                  ))
                ) : (
                  ["Tob-I Cuadrúpedo v1", "Tob-I Cuadrúpedo v2", "Dispositivo BT Genérico"].map((d) => (
                    <Button
                      key={d}
                      variant="outline"
                      className="justify-between font-normal"
                      onClick={() => {
                        setDevice(d);
                        setIsPairingOpen(false);
                        toast({ title: "¡Vinculado!", description: `Conectado a ${d}`, type: "success" });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Bluetooth className="size-3.5" />
                        {d}
                      </div>
                      <span className="text-[10px] opacity-50 uppercase font-bold">Conectar</span>
                    </Button>
                  ))
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Panel principal con división 50/50 */}
      <Resizable className="flex-1" defaultSize={[50, 50]} panels={[{ id: "left" }, { id: "right" }]}>
        <ResizablePanel id="left">
          <div className="flex h-full flex-col">
            <Tabs
              value={view}
              onValueChange={(details) => {
                if (details.value === "code") handleGenerateCode()
                setView(details.value)
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
                    <Button size="sm" variant="ghost" onClick={handleGenerateCode}>
                      Regenerar
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden border-t border-border">
                <TabsContent value="code" className="size-full h-full">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="size-full resize-none border-0 bg-background p-4 font-mono text-sm text-foreground outline-none"
                    spellCheck={false}
                    placeholder="// El código generado aparecerá aquí..."
                  />
                </TabsContent>
                <TabsContent value="blocks" className="size-full h-full">
                  <BlocklyWorkspace
                    ref={wsRef}
                    onChange={handleBlocksChange}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableResizeTrigger id="preview-serial" withHandle />

        <ResizablePanel id="right">
          <Resizable orientation="vertical" defaultSize={[60, 40]} panels={[{ id: "preview" }, { id: "serial" }]}>
            <ResizablePanel id="preview">
              <RobotPreview running={running} />
            </ResizablePanel>
            <ResizableResizeTrigger id="left-right" withHandle />
            <ResizablePanel id="serial" minSize={15}>
              <SerialMonitor />
            </ResizablePanel>
          </Resizable>
        </ResizablePanel>
      </Resizable>
    </div>
  )
}
