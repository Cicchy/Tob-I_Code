import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

const BODY_WIDTH = 2
const BODY_HEIGHT = 0.5
const BODY_DEPTH = 1.2
const LEG_LENGTH = 0.8
const LEG_WIDTH = 0.2
const HEAD_SIZE = 0.5
const MODEL_SCALE = 12

function Leg({ side, index, legAnglesRef }) {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x = legAnglesRef.current[index]
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

const LEG_KEYWORDS = ["leg", "pierna", "thigh", "femur", "pata", "arm", "brazo", "limb", "miembro"]

let nodeLogDone = false

export function TobiModel({ commands, running, onComplete }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const timeRef = useRef(0)
  const cmdIdxRef = useRef(0)
  const cmdTimeRef = useRef(0)

  const legAnglesRef = useRef([0, 0, 0, 0])
  const headingRef = useRef(0)
  const posZRef = useRef(0)
  const danceTimeRef = useRef(0)
  const modelPosRef = useRef(new THREE.Vector3(0, -1.5, 0))
  const legRotationsRef = useRef([0, 0, 0, 0, 0, 0, 0, 0])
  const speedRef = useRef(1)
  const tailRef = useRef()
  const jumpTimeRef = useRef(0)

  const gltf = useGLTF("/models/CHOCO.gltf")
  const hasModel = gltf?.scene

  const modelParts = useMemo(() => {
    if (!gltf?.scene) return null
    if (!nodeLogDone) {
      console.log("=== GLTF scene dump ===")
      gltf.scene.traverse((n) => {
        const info = [n.type, n.name || "(unnamed)"]
        if (n.isBone) info.push("(bone)")
        if (n.isMesh && n.geometry) info.push(`mesh(${(n.geometry.index?.count || n.geometry.attributes.position.count)})`)
        console.log("  " + info.join(" | "))
      })
      console.log("=== end dump ===")
      nodeLogDone = true
    }

    const parts = { root: gltf.scene, legGroups: [], tailNode: null, skeleton: null }

    gltf.scene.traverse((n) => {
      if (n.isSkinnedMesh && n.skeleton) {
        parts.skeleton = n.skeleton
      }
    })

    if (parts.skeleton) {
      parts.skeleton.bones.forEach((bone) => {
        const name = bone.name?.toLowerCase() || ""
        if (LEG_KEYWORDS.some(kw => name.includes(kw))) {
          parts.legGroups.push(bone)
        }
      })
    }

    if (parts.legGroups.length < 4) {
      gltf.scene.traverse((n) => {
        const name = n.name?.toLowerCase() || ""
        if (LEG_KEYWORDS.some(kw => name.includes(kw))) {
          if (!parts.legGroups.includes(n)) {
            parts.legGroups.push(n)
          }
        }
      })
    }

    if (parts.legGroups.length < 4 && parts.skeleton) {
      const midY = (Math.min(...parts.skeleton.bones.map(b => b.position.y)) + Math.max(...parts.skeleton.bones.map(b => b.position.y))) / 2
      parts.skeleton.bones.forEach((bone) => {
        if (bone.position.y < midY) {
          parts.legGroups.push(bone)
        }
      })
    }

    gltf.scene.traverse((n) => {
      const name = n.name?.toLowerCase() || ""
      if (name.includes("tail") || name.includes("cola") || name.includes("queue")) {
        parts.tailNode = n
      }
    })

    console.log("Found leg groups:", parts.legGroups.length, "- skeleton:", !!parts.skeleton, "- tail:", !!parts.tailNode)
    return parts
  }, [gltf])

  const mixerRef = useRef()
  const actionsRef = useRef({})

  useEffect(() => {
    if (!gltf?.scene || !gltf?.animations?.length) return
    const mixer = new THREE.AnimationMixer(gltf.scene)
    mixerRef.current = mixer
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip)
      if (action) {
        action.setLoop(THREE.LoopOnce)
        action.clampWhenFinished = true
        actionsRef.current[clip.name.toLowerCase()] = action
      }
    })
  }, [gltf])

  useEffect(() => {
    if (!gltf?.scene) return
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    gltf.scene.position.sub(center)
    gltf.scene.position.y += size.y / 2
    gltf.scene.rotation.x = -Math.PI / 2
    gltf.scene.rotation.z = 0
    gltf.scene.rotation.y = 0

    modelPosRef.current.set(0, -1.5, 0)
    gltf.scene.position.y += modelPosRef.current.y
    gltf.scene.scale.setScalar(MODEL_SCALE)

    console.log("Model centered, size:", size)
  }, [gltf])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)

    if (mixerRef.current) {
      mixerRef.current.update(dt)
    }

    if (!gltf?.scene && !bodyRef.current) return

    const idleBob = Math.sin(timeRef.current * 1.2) * 0.05

    if (!running || !commands?.length) {
      timeRef.current += dt
      if (bodyRef.current) bodyRef.current.position.y = -1 + idleBob
      if (headRef.current) headRef.current.rotation.y = Math.sin(timeRef.current * 0.8) * 0.2
      legAnglesRef.current = legAnglesRef.current.map((_, i) =>
        Math.sin(timeRef.current * 0.5 + i * Math.PI) * 0.08
      )
      if (gltf?.scene) {
        gltf.scene.position.y = modelPosRef.current.y + idleBob * 0.5
      }
      return
    }

    if (cmdIdxRef.current >= commands.length) {
      timeRef.current += dt
      if (gltf?.scene) {
        gltf.scene.position.y = modelPosRef.current.y + Math.sin(timeRef.current * 1.2) * 0.02
      }
      return
    }

    const cmd = commands[cmdIdxRef.current]
    cmdTimeRef.current += dt
    const t = Math.min(cmdTimeRef.current / cmd.duration, 1)
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    switch (cmd.type) {
      case "walk":
      case "walk_backward": {
        const phase = t * Math.PI * cmd.steps * 2
        const dir = cmd.type === "walk_backward" ? -1 : 1
        const forward = new THREE.Vector3(dir, 0, 0)
        forward.applyAxisAngle(new THREE.Vector3(0, 0, 1), headingRef.current)

        legAnglesRef.current = [0, 1, 2, 3].map((i) => Math.sin(phase + i * Math.PI * 0.5) * 0.3)
        legRotationsRef.current = [0, 1, 2, 3].map((i) => Math.sin(phase + i * Math.PI * 0.5) * 0.4)

        if (modelParts?.legGroups?.length >= 4) {
          modelParts.legGroups.forEach((group, i) => {
            const idx = i % 4
            group.rotation.x = Math.sin(phase + idx * Math.PI * 0.5) * 0.4
          })
        }

        if (bodyRef.current) bodyRef.current.position.y = -1 + Math.abs(Math.sin(phase)) * 0.08
        if (gltf?.scene) {
          const speed = speedRef.current
          gltf.scene.position.x += forward.x * dt * 1.5 * speed
          gltf.scene.position.z += forward.z * dt * 1.5 * speed
          gltf.scene.position.y = modelPosRef.current.y + Math.abs(Math.sin(phase)) * 0.06
          gltf.scene.rotation.z = Math.sin(phase) * 0.03
        }
        break
      }
      case "speed": {
        speedRef.current = cmd.percent / 100
        break
      }
      case "jump": {
        const jumpPhase = t * Math.PI
        const height = Math.sin(jumpPhase) * 0.4
        if (bodyRef.current) bodyRef.current.position.y = -1 + height
        if (gltf?.scene) {
          gltf.scene.position.y = modelPosRef.current.y + height
        }
        legAnglesRef.current = [0, 1, 2, 3].map(() => Math.sin(jumpPhase) * 0.2)
        if (modelParts?.legGroups) {
          modelParts.legGroups.forEach((group) => { group.rotation.x = Math.sin(jumpPhase) * 0.2 })
        }
        break
      }
      case "incline": {
        const inclineAngle = THREE.MathUtils.degToRad(cmd.angle) * ease
        if (bodyRef.current) bodyRef.current.rotation.x = inclineAngle
        if (gltf?.scene) {
          gltf.scene.rotation.z = inclineAngle * 0.5
        }
        break
      }
      case "tail_wag": {
        const wag = Math.sin(timeRef.current * 8) * 0.4
        if (modelParts?.tailNode) {
          modelParts.tailNode.rotation.y = wag
        }
        if (tailRef.current) {
          tailRef.current.rotation.y = wag
        }
        timeRef.current += dt
        break
      }
      case "rotate": {
        const targetAngle = THREE.MathUtils.degToRad(cmd.angle)
        headingRef.current += targetAngle * dt / cmd.duration
        if (gltf?.scene) gltf.scene.rotation.z = headingRef.current
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * Math.PI * 2) * 0.1
        break
      }
      case "sit": {
        if (bodyRef.current) bodyRef.current.position.y = -1 - ease * 0.6
        legAnglesRef.current = [0, 1, 2, 3].map(() => ease * 0.8)
        if (modelParts?.legGroups) {
          modelParts.legGroups.forEach((group) => { group.rotation.x = ease * 0.6 })
        }
        if (gltf?.scene) gltf.scene.position.y = modelPosRef.current.y - ease * 0.3
        break
      }
      case "stand": {
        if (bodyRef.current) bodyRef.current.position.y = -1 + ease * 0.6
        legAnglesRef.current = [0, 1, 2, 3].map(() => (1 - ease) * 0.8)
        if (modelParts?.legGroups) {
          modelParts.legGroups.forEach((group) => { group.rotation.x = (1 - ease) * 0.6 })
        }
        if (gltf?.scene) gltf.scene.position.y = modelPosRef.current.y + ease * 0.3
        break
      }
      case "dance": {
        danceTimeRef.current += dt
        const dt2 = danceTimeRef.current
        if (bodyRef.current) bodyRef.current.position.y = -1 + Math.abs(Math.sin(dt2 * 5)) * 0.25
        if (headRef.current) headRef.current.rotation.y = Math.sin(dt2 * 4) * 0.5
        legAnglesRef.current = [0, 1, 2, 3].map((i) => Math.sin(dt2 * 6 + i * Math.PI * 0.5) * 0.4)
        legRotationsRef.current = [0, 1, 2, 3].map((i) => Math.sin(dt2 * 6 + i * Math.PI * 0.5) * 0.4)
        if (modelParts?.legGroups) {
          modelParts.legGroups.forEach((group, i) => {
            const idx = i % 4
            group.rotation.x = Math.sin(dt2 * 6 + idx * Math.PI * 0.5) * 0.4
          })
        }
        if (gltf?.scene) {
          gltf.scene.position.y = modelPosRef.current.y + Math.abs(Math.sin(dt2 * 5)) * 0.15
          gltf.scene.rotation.y += dt * 2
          headingRef.current = gltf.scene.rotation.z
        }
        break
      }
      case "stop": {
        legAnglesRef.current = legAnglesRef.current.map((v) => v * (1 - ease))
        if (modelParts?.legGroups) {
          modelParts.legGroups.forEach((group) => { group.rotation.x *= (1 - ease) })
        }
        break
      }
      case "wait":
        break
    }

    if (t >= 1) {
      if (cmd.type === "dance") danceTimeRef.current = 0
      cmdIdxRef.current++
      cmdTimeRef.current = 0
    }

    if (cmdIdxRef.current >= commands.length) {
      onComplete?.()
    }
  })

  if (hasModel) {
    return (
      <group ref={groupRef}>
        <primitive object={gltf.scene} />
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef} position={[0, -1, 0]}>
        <boxGeometry args={[BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      <group position={[0, -1 + BODY_HEIGHT / 2 + HEAD_SIZE / 2, BODY_DEPTH / 2 - 0.1]}>
        <mesh ref={headRef}>
          <boxGeometry args={[HEAD_SIZE, HEAD_SIZE, HEAD_SIZE]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[-0.15, 0, HEAD_SIZE / 2 + 0.01]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[0.15, 0, HEAD_SIZE / 2 + 0.01]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

      <Leg side="left" index={0} legAnglesRef={legAnglesRef} />
      <Leg side="left" index={1} legAnglesRef={legAnglesRef} />
      <Leg side="right" index={0} legAnglesRef={legAnglesRef} />
      <Leg side="right" index={1} legAnglesRef={legAnglesRef} />
    </group>
  )
}
