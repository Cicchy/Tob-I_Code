const { spawn } = require("child_process")
const path = require("path")

const root = path.resolve(__dirname, "..")

const vite = spawn("npx vite", [], { cwd: root, stdio: "inherit", shell: true })

let electronStarted = false

function startElectron() {
  if (electronStarted) return
  electronStarted = true
  const electron = spawn("npx cross-env NODE_ENV=development electron .", [], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  })
  electron.on("close", (code) => {
    vite.kill()
    process.exit(code ?? 0)
  })
}

vite.stdout?.on("data", (data) => {
  if (data.toString().includes("Local:")) {
    setTimeout(startElectron, 1000)
  }
})

vite.on("close", (code) => {
  if (!electronStarted) process.exit(code ?? 0)
})

process.on("SIGINT", () => {
  vite.kill()
  process.exit()
})
