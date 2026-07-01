import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const BODY_WIDTH = 2;
const BODY_HEIGHT = 0.5;
const BODY_DEPTH = 1.2;
const LEG_LENGTH = 0.8;
const LEG_WIDTH = 0.2;
const HEAD_SIZE = 0.5;
const MODEL_SCALE = 12;

function Leg({ side, index }) {
	const xOffset = side === "left" ? -BODY_WIDTH / 2 + 0.15 : BODY_WIDTH / 2 - 0.15;
	const zOffset = index === 0 ? BODY_DEPTH / 2 - 0.1 : -BODY_DEPTH / 2 + 0.1;

	return (
		<group position={[xOffset, -BODY_HEIGHT / 2, zOffset]}>
			<mesh position={[0, -LEG_LENGTH / 2, 0]}>
				<boxGeometry args={[LEG_WIDTH, LEG_LENGTH, LEG_WIDTH]} />
				<meshStandardMaterial color="#444" />
			</mesh>
		</group>
	);
}

const _LEG_KEYWORDS = [
	"leg",
	"pierna",
	"thigh",
	"femur",
	"pata",
	"arm",
	"brazo",
	"limb",
	"miembro",
];

let nodeLogDone = false;

const ZERO = new THREE.Vector3(0, 0, 0);

export function TobiModel({ commands, running, onComplete }) {
	const groupRef = useRef();
	const bodyRef = useRef();
	const headRef = useRef();
	const timeRef = useRef(0);
	const cmdIdxRef = useRef(0);
	const cmdTimeRef = useRef(0);

	const danceTimeRef = useRef(0);
	const modelPosRef = useRef(new THREE.Vector3(0, -1.5, 0));
	const headingRef = useRef(0);
	const speedRef = useRef(1);
	const startPosRef = useRef(new THREE.Vector3(0, -1.5, 0));
	const startHeadingRef = useRef(0);

	const gltf = useGLTF("/models/CHOCO.gltf");
	const hasModel = gltf?.scene;

	const modelParts = useMemo(() => {
		if (!gltf?.scene) return null;
		if (!nodeLogDone) {
			console.log("=== GLTF scene dump ===");
			gltf.scene.traverse((n) => {
				const info = [n.type, n.name || "(unnamed)"];
				if (n.isBone) info.push("(bone)");
				if (n.isMesh && n.geometry)
					info.push(`mesh(${n.geometry.index?.count || n.geometry.attributes.position.count})`);
				console.log(`  ${info.join(" | ")}`);
			});
			console.log("=== end dump ===");
			nodeLogDone = true;
		}

		const parts = { root: gltf.scene, skeleton: null };

		gltf.scene.traverse((n) => {
			if (n.isSkinnedMesh && n.skeleton) {
				parts.skeleton = n.skeleton;
			}
		});

		gltf.scene.traverse((n) => {
			const name = n.name?.toLowerCase() || "";
			if (name.includes("tail") || name.includes("cola") || name.includes("queue")) {
				parts.tailNode = n;
			}
		});

		return parts;
	}, [gltf]);

	useEffect(() => {
		if (!gltf?.scene) return;
		gltf.scene.rotation.set(-Math.PI / 2, 0, 0);

		const box = new THREE.Box3().setFromObject(gltf.scene);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());

		gltf.scene.position.sub(center);
		gltf.scene.position.y += size.y / 2;

		modelPosRef.current.set(0, -1.5, 0);
		gltf.scene.position.y += modelPosRef.current.y;
		gltf.scene.scale.setScalar(MODEL_SCALE);
	}, [gltf]);

	useEffect(() => {
		if (running) return;
		cmdIdxRef.current = 0;
		cmdTimeRef.current = 0;
		timeRef.current = 0;
		danceTimeRef.current = 0;
		speedRef.current = 1;
		headingRef.current = 0;
		startHeadingRef.current = 0;
		startPosRef.current.copy(modelPosRef.current);
		if (gltf?.scene) {
			gltf.scene.position.copy(modelPosRef.current);
			gltf.scene.rotation.set(-Math.PI / 2, 0, 0);
		}
		if (bodyRef.current) {
			bodyRef.current.position.set(0, -1, 0);
			bodyRef.current.rotation.set(0, 0, 0);
		}
	}, [running, gltf?.scene]);

	useFrame((_, delta) => {
		const dt = Math.min(delta, 0.05);

		if (!gltf?.scene && !bodyRef.current) return;

		if (!running || !commands?.length) {
			timeRef.current += dt;
			if (!gltf?.scene && bodyRef.current) {
				bodyRef.current.position.y = -1;
			}
			return;
		}

		if (cmdIdxRef.current >= commands.length) {
			return;
		}

		const cmd = commands[cmdIdxRef.current];
		cmdTimeRef.current += dt;
		const t = Math.min(cmdTimeRef.current / cmd.duration, 1);
		const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

		switch (cmd.type) {
			case "walk":
			case "walk_backward": {
				const dir = cmd.type === "walk_backward" ? -1 : 1;
				const forward = new THREE.Vector3(dir, 0, 0);
				forward.applyAxisAngle(new THREE.Vector3(0, 0, 1), headingRef.current);

				const totalDist = cmd.steps * 1.2;
				const start = startPosRef.current;

				if (gltf?.scene) {
					gltf.scene.position.x = start.x + forward.x * totalDist * ease;
					gltf.scene.position.z = start.z + forward.z * totalDist * ease;
				}
				if (bodyRef.current) {
					bodyRef.current.position.x = start.x + forward.x * totalDist * ease;
					bodyRef.current.position.z = start.z + forward.z * totalDist * ease;
				}
				break;
			}
			case "speed": {
				speedRef.current = cmd.percent / 100;
				break;
			}
			case "jump": {
				const jumpPhase = t * Math.PI;
				const height = Math.sin(jumpPhase) * 0.4;
				if (bodyRef.current) bodyRef.current.position.y = -1 + height;
				if (gltf?.scene) gltf.scene.position.y = modelPosRef.current.y + height;
				break;
			}
			case "incline": {
				const inclineAngle = THREE.MathUtils.degToRad(cmd.angle) * ease;
				if (bodyRef.current) bodyRef.current.rotation.x = inclineAngle;
				if (gltf?.scene) gltf.scene.rotation.z = inclineAngle * 0.5;
				break;
			}
			case "tail_wag": {
				const wag = Math.sin(timeRef.current * 8) * 0.4;
				if (modelParts?.tailNode) modelParts.tailNode.rotation.y = wag;
				timeRef.current += dt;
				break;
			}
			case "rotate": {
				const targetAngle = THREE.MathUtils.degToRad(cmd.angle);
				const currentAngle = startHeadingRef.current + targetAngle * ease;
				headingRef.current = currentAngle;
				if (gltf?.scene) gltf.scene.rotation.z = currentAngle;
				break;
			}
			case "sit": {
				if (bodyRef.current) bodyRef.current.position.y = -1 - ease * 0.6;
				if (gltf?.scene) gltf.scene.position.y = modelPosRef.current.y - ease * 0.3;
				break;
			}
			case "stand": {
				if (bodyRef.current) bodyRef.current.position.y = -1 + ease * 0.6;
				if (gltf?.scene) gltf.scene.position.y = modelPosRef.current.y + ease * 0.3;
				break;
			}
			case "dance": {
				danceTimeRef.current += dt;
				const dt2 = danceTimeRef.current;
				if (gltf?.scene) {
					gltf.scene.position.y = modelPosRef.current.y + Math.abs(Math.sin(dt2 * 5)) * 0.15;
					gltf.scene.rotation.y += dt * 2;
					headingRef.current = gltf.scene.rotation.z;
				}
				break;
			}
			case "stop":
			case "wait":
				break;
		}

		if (t >= 1) {
			if (cmd.type === "walk" || cmd.type === "walk_backward") {
				startPosRef.current.copy(gltf?.scene?.position || bodyRef.current?.position || ZERO);
			}
			if (cmd.type === "rotate") {
				startHeadingRef.current = headingRef.current;
			}
			if (cmd.type === "dance") danceTimeRef.current = 0;
			cmdIdxRef.current++;
			cmdTimeRef.current = 0;
		}

		if (cmdIdxRef.current >= commands.length) {
			onComplete?.();
		}
	});

	if (hasModel) {
		return (
			<group ref={groupRef}>
				<primitive object={gltf.scene} />
			</group>
		);
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

			<Leg side="left" index={0} />
			<Leg side="left" index={1} />
			<Leg side="right" index={0} />
			<Leg side="right" index={1} />
		</group>
	);
}
