'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGLTF, OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const AVAILABLE_MODELS = [
  '/cube1.glb', '/cube2.glb', '/cube3.glb', '/cube4.glb', '/cube5.glb',
  '/cube6.glb', '/cube7.glb', '/cube8.glb', '/cube9.glb', '/cube10.glb'
]

function UniversalModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group rotation={[Math.PI / 6, -Math.PI / 4, 0]} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

function Dynamic3DScene() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [canRenderCanvas, setCanRenderCanvas] = useState(false)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length)
    setSelectedModel(AVAILABLE_MODELS[randomIndex])

    const idleTimeout = setTimeout(() => {
      setCanRenderCanvas(true)
    }, 100) 

    return () => clearTimeout(idleTimeout)
  }, [])

  if (!selectedModel || !canRenderCanvas) {
    return <div className="w-full aspect-square bg-neutral-100/10 animate-pulse rounded-full" />
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas 
        camera={{ position: [1, 1, 15], fov: 45 }}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          precision: "mediump" 
        }}
        dpr={1}
      >
        <Stage intensity={0.5} environment="city" adjustCamera={false} shadows={false}>
          <UniversalModel path={selectedModel} />
        </Stage>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}

import dynamic from 'next/dynamic'
export default dynamic(() => Promise.resolve(Dynamic3DScene), {
  ssr: false,
  loading: () => <div className="w-full aspect-square bg-neutral-100/10 animate-pulse rounded-full" />
})