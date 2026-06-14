import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from "react"
import * as Blockly from "blockly"
import "blockly/msg/es"
import { javascriptGenerator } from "blockly/javascript"
import { tobiBlocks, tobiToolbox } from "@/lib/blockly/tobiBlocks"
import { tobiTheme } from "@/lib/blockly/tobiTheme"
import { registerGenerators } from "@/lib/blockly/generators"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

registerGenerators()

Object.entries(tobiBlocks).forEach(([name, block]) => {
  Blockly.Blocks[name] = block
})

const CATEGORY_ICONS = [
  /* Motion */
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#4a90d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h10M8 4l4 4-4 4"/></svg>`,
  /* Control */
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="#50b86c"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>`,
  /* Logic */
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#d9a84a" stroke-width="1.5" stroke-linejoin="round"><path d="M8 2l6 6-6 6-6-6z"/></svg>`,
  /* Loops */
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#a864d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l3 3-3 3M6 12l-3-3 3-3"/><circle cx="8" cy="8" r="5"/></svg>`,
  /* Math */
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#4a9bd9" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`,
]

function injectCategoryIcons(container) {
  const icons = container.querySelectorAll(".blocklyToolboxCategoryIcon")
  icons.forEach((span, i) => {
    if (i < CATEGORY_ICONS.length) {
      span.innerHTML = CATEGORY_ICONS[i]
      span.style.visibility = "visible"
    }
  })
}

export const BlocklyWorkspace = forwardRef(function BlocklyWorkspace({ onChange }, ref) {
  const containerRef = useRef(null)
  const workspaceRef = useRef(null)
  const [toolboxOpen, setToolboxOpen] = useState(true)
  const [toolboxWidth, setToolboxWidth] = useState(180)

  function setToolboxVisible(ws, visible) {
    const toolbox = ws.getToolbox()
    if (!toolbox) return
    toolbox.setVisible(visible)
    const flyout = ws.getFlyout()
    if (flyout) {
      if (visible) {
        const selected = toolbox.getSelectedItem()
        if (selected) toolbox.setSelectedItem(selected)
      } else {
        flyout.hide()
      }
    }
    setTimeout(() => ws.resize(), 0)
  }

  useImperativeHandle(ref, () => ({
    get workspace() { return workspaceRef.current },
    get toolboxOpen() { return toolboxOpen },
    toggleToolbox() {
      const ws = workspaceRef.current
      if (!ws) return
      const next = !toolboxOpen
      setToolboxVisible(ws, next)
      setToolboxOpen(next)
    },
    setToolboxOpen(open) {
      const ws = workspaceRef.current
      if (!ws) return
      setToolboxVisible(ws, open)
      setToolboxOpen(open)
    },
  }), [toolboxOpen])

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: tobiToolbox,
      theme: tobiTheme,
      renderer: "zelos",
      grid: { spacing: 20, length: 3, colour: "#333", snap: true },
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 0.9 },
      trashcan: true,
    })

    workspace.addChangeListener(() => {
      if (onChange) {
        const xmlDom = Blockly.Xml.workspaceToDom(workspace)
        const xmlText = Blockly.Xml.domToText(xmlDom)
        onChange(xmlText)
      }
    })

    workspaceRef.current = workspace

    requestAnimationFrame(() => {
      if (!containerRef.current) return
      const tb = containerRef.current.querySelector(".blocklyToolbox")
      if (tb) setToolboxWidth(tb.offsetWidth)
      injectCategoryIcons(containerRef.current)
    })

    return () => {
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [onChange])

  const handleToggle = useCallback((e) => {
    e.stopPropagation()
    const ws = workspaceRef.current
    if (!ws) return
    const next = !toolboxOpen
    setToolboxVisible(ws, next)
    setTimeout(() => {
      if (next && containerRef.current) {
        const tb = containerRef.current.querySelector(".blocklyToolbox")
        if (tb) setToolboxWidth(tb.offsetWidth)
      }
    }, 0)
    setToolboxOpen(next)
  }, [toolboxOpen])

  return (
    <div className="relative size-full" style={{ minHeight: 0 }}>
      <div
        ref={containerRef}
        className="size-full"
        style={{ minHeight: 0 }}
      />
      <div
        className="absolute top-2 z-[100]"
        style={{
          left: toolboxOpen ? `${toolboxWidth + 6}px` : "6px",
          transition: "left 0.15s ease",
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleToggle}
              aria-label={toolboxOpen ? "Collapse toolbox" : "Expand toolbox"}
            >
              {toolboxOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </TooltipTrigger>
              <TooltipContent>{toolboxOpen ? "Contraer caja" : "Expandir caja"}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
})
