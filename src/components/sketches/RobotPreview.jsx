import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid } from "@react-three/drei"
import { TobiModel } from "./TobiModel"

export function RobotPreview({ running, commands, onSimulationComplete }) {
  return (
    <div className="size-full bg-background relative">
      <Canvas
        camera={{ position: [18, 12, 18], fov: 36 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <directionalLight position={[-3, 4, -3]} intensity={0.45} />
        <TobiModel running={running} commands={commands} onComplete={onSimulationComplete} />
        <Grid
          position={[0, -1.5, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#262626"
          sectionColor="#404040"
          fadeDistance={35}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={6}
          maxDistance={45}
        />
      </Canvas>
    </div>
  )
}
