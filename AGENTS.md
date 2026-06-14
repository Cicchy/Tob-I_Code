# Tob-I Robot IDE

Use Shark UI documentation from https://shark.vini.one/llms-full.txt
Use Shark UI component documentation https://shark.vini.one/llms-components.txt
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
| UI library | Shark UI (park-ui) — all interactive components |
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
- **Monochrome UI shell**: all buttons, panels, headers, dialogs, tabs — grayscale only (black, white, grays)
- **Blockly blocks are the exception**: blocks use **functional colors** (different hues per category) so users can distinguish motion / control / logic / actions at a glance. The Blockly workspace background, toolbox, and flyout follow the dark monochrome theme.
- **Shark UI only**: never use raw `<textarea>`, `<input>`, `<select>`, or other native form controls — always import the Shark UI component
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

- **Dialog `onOpenChange`**: must use `(details) => setOpen(details.open)` — Ark UI passes `{ open: boolean }`, not a raw boolean
- **AlertDialog**: control via `open` prop + state variable at component root, not `AlertDialogTrigger` — avoids event propagation bugs with Ark UI `asChild`
- **All interactive elements** must be Shark UI components (Button, Textarea, SegmentGroup, Dialog, Popover, etc.)

---

## i18n

Not yet designed. Open for implementation.
