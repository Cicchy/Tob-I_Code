import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const BODY_WIDTH = 2
const BODY_HEIGHT = 0.5
const BODY_DEPTH = 1.2
const LEG_LENGTH = 0.8
const LEG_WIDTH = 0.2
const HEAD_SIZE = 0.5

function Leg({ side, index, timeRef }) {
  const ref = useRef()
  const phase = index * Math.PI

  useFrame(() => {
    if (!ref.current) return
    const walk = Math.sin(timeRef.current * 3 + phase) * 0.3
    ref.current.rotation.x = walk
  })

  const xOffset = side === "left" ? -BODY_WIDTH / 2 + 0.15 : BODY_WIDTH / 2 - 0.15
  const zOffset = index === 0 ? BODY_DEPTH / 2 - 0.1 : -BODY_DEPTH / 2 + 0.1

  return (
    <group position={[xOffset, -BODY_HEIGHT / 2, zOffset]}>
      <mesh ref={ref} position={[0, -LEG_LENGTH / 2, 0]}>
        <boxGeometry args={[LEG_WIDTH, LEG_LENGTH, LEG_WIDTH]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  )
}

export function TobiModel({ running }) {
  const bodyRef = useRef()
  const headRef = useRef()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (running) {
      timeRef.current += delta
    }
    if (bodyRef.current && running) {
      bodyRef.current.position.y = -1 + Math.abs(Math.sin(timeRef.current * 2)) * 0.1
    }
    if (headRef.current && running) {
      headRef.current.rotation.y = Math.sin(timeRef.current * 1.5) * 0.3
    }
  })

  return (
    <group>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <boxGeometry args={[BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Head */}
      <group position={[0, BODY_HEIGHT / 2 + HEAD_SIZE / 2, BODY_DEPTH / 2 - 0.1]}>
        <mesh ref={headRef}>
          <boxGeometry args={[HEAD_SIZE, HEAD_SIZE, HEAD_SIZE]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0, HEAD_SIZE / 2 + 0.01]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[0.15, 0, HEAD_SIZE / 2 + 0.01]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

      {/* Legs */}
      <Leg side="left" index={0} timeRef={timeRef} />
      <Leg side="left" index={1} timeRef={timeRef} />
      <Leg side="right" index={0} timeRef={timeRef} />
      <Leg side="right" index={1} timeRef={timeRef} />
    </group>
  )
}
