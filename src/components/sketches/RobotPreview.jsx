import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { TobiModel } from "./TobiModel"

export function RobotPreview({ running }) {
  return (
    <div className="size-full bg-background relative">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <directionalLight position={[-3, 4, -3]} intensity={0.3} />
        <TobiModel running={running} />
        <Grid
          position={[0, -1.5, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#262626"
          sectionColor="#404040"
          fadeDistance={20}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}
