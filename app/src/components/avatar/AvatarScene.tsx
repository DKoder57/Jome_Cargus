import { Canvas,useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function TestCube() {
  const meshRef = useRef<Mesh>(null!);
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={meshRef}>
        <boxGeometry args={[1.5 , 2, 0.3]}/>
        <meshStandardMaterial color="#c53737"/>
    </mesh>
    );
}

export default function AvatarScene() {
  return (
    <Canvas dpr={Math.min(window.devicePixelRatio, 2)}
    camera={{ position: [0, 0, 5], fov: 50 }}
    style={{ background: "black", width: "100%", height: "100%" }}>

      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 2]} intensity={0.8} />
      <TestCube />
      <OrbitControls 
      enablePan={false}
      minDistance={1.5}
      maxDistance={6}
      />
    </Canvas>
  );
}