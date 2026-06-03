'use client'

import React, { useState, useEffect } from 'react'
import { useGLTF, OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const AVAILABLE_MODELS = [
  '/cube1.glb',
  '/cube2.glb',
  '/cube3.glb',
  '/cube4.glb',
  '/cube5.glb',
  '/cube6.glb',
  '/cube7.glb',
  '/cube8.glb',
  '/cube9.glb',
  '/cube10.glb'
]

AVAILABLE_MODELS.forEach((path) => useGLTF.preload(path))

function UniversalModel({ path }: { path: string }) {
  const { scene } = useGLTF(path) as any

  return (
    <group rotation={[Math.PI / 6, -Math.PI / 4, 0]} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

export default function Dynamic3DScene() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length)
    setSelectedModel(AVAILABLE_MODELS[randomIndex])
  }, [])

  if (!selectedModel) return <div className="w-full aspect-square bg-neutral-100/10 animate-pulse rounded-full" />

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [1, 1, 15], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        
        <Stage intensity={0.5} environment="city" adjustCamera={false} shadows={false}>
          <UniversalModel path={selectedModel} />
        </Stage>
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}