import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function SerialMonitor() {
  const [messages, setMessages] = useState([
    { text: "// Monitor Serie Tob-I", type: "info" },
    { text: "// Conecta tu robot para ver la salida", type: "info" },
  ])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleClear() {
    setMessages([])
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Monitor Serie</span>
        <Button variant="ghost" size="icon-xs" onClick={handleClear}>
          <Trash2 className="size-3" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-relaxed">
        {messages.map((msg, i) => (
          <div key={i} className="text-muted-foreground">
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
