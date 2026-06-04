'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGLTF, OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const AVAILABLE_MODELS = [
  '/cube1.glb', '/cube2.glb', '/cube3.glb', '/cube4.glb', '/cube5.glb',
  '/cube6.glb', '/cube7.glb', '/cube8.glb', '/cube9.glb', '/cube10.glb'
]

let globalSessionModelPath: string | null = null

function UniversalModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group rotation={[Math.PI / 6, -Math.PI / 4, 0]} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

export default function Dynamic3DScene() {
  const [isReady, setIsReady] = useState(false)

  if (typeof window !== 'undefined' && !globalSessionModelPath) {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length)
    globalSessionModelPath = AVAILABLE_MODELS[randomIndex]
  }

  const finalPath = globalSessionModelPath || AVAILABLE_MODELS[0]

  useEffect(() => {
    setIsReady(true)
    
    if (globalSessionModelPath) {
      useGLTF.preload(globalSessionModelPath)
    }
  }, [])

  if (!isReady) {
    return <div className="w-full aspect-square bg-neutral-100/10 animate-pulse rounded-full" />
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas 
        key={`home-canvas}`}
        camera={{ position: [1, 1, 15], fov: 45 }}
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          precision: "highp" 
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1} 
      >
        <Stage intensity={0.5} environment="city" adjustCamera={false} shadows={false}>
          <UniversalModel path={finalPath} />
        </Stage>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}