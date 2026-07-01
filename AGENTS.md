# Tob-I Robot IDE

Use neobrutalism component docs from https://neobrutalism.dev/docs
Use SKILL.md in /frontend_skill

Single-window web IDE for programming the Tob-I quadruped robot. Users build programs visually with Blockly blocks, preview execution on a 3D robot model, and upload code to a physical Tob-I robot.

---

## Layout

```
|-- 50% left -----------|-- 50% right --------------|
|  Tab: [Blocks] [Code] |  Three.js robot preview   |
|                        |  (animated simulation)    |
|                        |---------------------------|
|                        |  Serial monitor           |
|                        |  (reads robot output)     |
|----------------------------------------------------|
```

- Left panel: tab-switches between Blockly workspace and generated code editor
- Right panel: split vertically — 3D preview on top, serial monitor on bottom
- No dashboard, no sketch manager — single editor window (like Arduino IDE)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bundler | Vite |
| UI | React |
| Styling | Tailwind CSS v4 |
| UI library | neobrutalism (based on shadcn/ui + Radix) |
| Visual blocks | Blockly v12 |
| 3D preview | Three.js |
| File I/O | File System Access API |
| Connection | TBD (Web Bluetooth / Web Serial) |

---

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build

---

## Visual Style

- **Dark theme**: `class="dark"` on `<html>`, dark backgrounds throughout
- **Neobrutalism**: bold 2px borders, offset box shadows, high contrast, blocky aesthetic
- **Monochrome UI shell**: all buttons, panels, headers, dialogs, tabs — grayscale with a blue accent (`--main`)
- **Blockly blocks are the exception**: blocks use **functional colors** (different hues per category) so users can distinguish motion / control / logic / actions at a glance. The Blockly workspace background, toolbox, and flyout follow the dark theme.
- **neobrutalism components only**: never use raw `<textarea>`, `<input>`, `<select>`, or other native form controls — always import the neobrutalism component
- **System fonts**: no custom font packages

---

## Code Generation

- Blockly blocks generate Arduino-like `.ino` code
- Each block maps to a function call in the Tob-I robot firmware
- Generated file structure: `setup()` + `loop()` with function calls inside
- Save/Open uses the **File System Access API** — `showSaveFilePicker()` to save `.ino` files, `showOpenFilePicker()` to open them

### Custom blocks (all categories)

| Category | Blocks |
|----------|--------|
| Motion | `walk(steps)`, `rotate(degrees)`, `sit()`, `stand()`, `dance()`, `stop()` |
| Control | `wait(seconds)`, `repeat(times)` { ... } |
| Logic | `if/else`, `compare`, `boolean` |
| Math | `number`, `arithmetic` |

---

## Robot Interaction

- **Upload**: button that connects to a previously paired Tob-I robot and flashes the generated code (connection method TBD)
- **Serial monitor**: reads real-time output from the robot (logs, sensor data, etc.)
- **3D preview**: Three.js model of Tob-I that animates step-by-step through the generated code

---

## UI Gotchas

- **Dialog `onOpenChange`**: Radix passes a raw boolean `(open) => setOpen(open)`, not an object
- **Tabs `onValueChange`**: Radix passes a raw string `(value) => setView(value)`, not an object
- **DropdownMenuTrigger**: use as a styled trigger — styling is applied directly via className, not via props
- **All interactive elements** must be neobrutalism components (Button, Textarea, Input, Dialog, Tabs, etc.)
- **Sonner toast API**: `toast.success(title, { description })`, `toast.error(title, { description })`, `toast.loading(title, { description })` — not `toast({ title, type })`

---

## i18n

Not yet designed. Open for implementation.
