import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function AvatarModel() {
  const { scene } = useGLTF('/models/avatar_base.glb')
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />
}

export default function AvatarScene() {
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: "white", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 2]} intensity={0.8} />
      <Suspense fallback={null}>
        <AvatarModel />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
      />
    </Canvas>
  );
}