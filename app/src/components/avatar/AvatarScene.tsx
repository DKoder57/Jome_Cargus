import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useState } from "react";
import type { Mesh } from "three";

interface AvatarControlsProps {
  altura: number;
  massa: number;
}

function AvatarModel({ altura, massa }: AvatarControlsProps) {
  const { scene } = useGLTF('/models/avatar_base.glb')
  const meshRef = useRef<Mesh>(null!)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.morphTargetInfluences) {
        // ajuste os índices conforme os shape keys que você criou no Blender
        child.morphTargetInfluences[0] = altura  // shape key "alto"
        child.morphTargetInfluences[1] = massa   // shape key "largo"
      }
    })
  }, [scene, altura, massa])

  return <primitive ref={meshRef} object={scene} scale={1} position={[0, -1, 0]} />
}

export default function AvatarScene() {
  const [altura, setAltura] = useState(0)
  const [massa, setMassa] = useState(0)

  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "white", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={0.8} />
        <Suspense fallback={null}>
          <AvatarModel altura={altura} massa={massa} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
        />
      </Canvas>

      {/* Painel de sliders */}
      <div className="absolute bottom-24 left-4 z-10 bg-zinc-900/80 rounded-xl p-4 flex flex-col gap-3 w-48">
        <div>
          <label className="text-zinc-400 text-xs uppercase tracking-widest">Altura</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={altura}
            onChange={e => setAltura(parseFloat(e.target.value))}
            className="w-full mt-1 accent-yellow-500"
          />
        </div>
        <div>
          <label className="text-zinc-400 text-xs uppercase tracking-widest">Massa</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={massa}
            onChange={e => setMassa(parseFloat(e.target.value))}
            className="w-full mt-1 accent-yellow-500"
          />
        </div>
      </div>
    </div>
  )
}