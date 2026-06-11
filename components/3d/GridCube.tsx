'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const AVAILABLE_MODELS = [
  '/cube1.glb', '/cube2.glb', '/cube3.glb', '/cube4.glb', '/cube5.glb',
  '/cube6.glb', '/cube7.glb', '/cube8.glb', '/cube9.glb', '/cube10.glb'
]

let persistentSessionPath: string | null = null

function UniversalModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group rotation={[Math.PI, -Math.PI / 10, 0]} dispose={null}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  )
}

export default function Dynamic3DScene() {
  const [modelPath, setModelPath] = useState<string | null>(null)
  const [isUnmounting, setIsUnmounting] = useState(false)

  useEffect(() => {
    setIsUnmounting(false)

    if (typeof window !== 'undefined') {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const isReload = navEntries.length > 0 && navEntries[0].type === 'reload'

      if (isReload) {
        persistentSessionPath = null
        sessionStorage.removeItem('homepage_cube_path')
      }

      if (!persistentSessionPath) {
        const cached = sessionStorage.getItem('homepage_cube_path')
        
        if (cached && AVAILABLE_MODELS.includes(cached)) {
          persistentSessionPath = cached
        } else {
          const randomIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length)
          const chosen = AVAILABLE_MODELS[randomIndex]
          persistentSessionPath = chosen
          sessionStorage.setItem('homepage_cube_path', chosen)
        }
      }
    }

    const finalPath = persistentSessionPath || AVAILABLE_MODELS[0]

    useGLTF.preload(finalPath)
    setModelPath(finalPath)

    return () => {
      setIsUnmounting(true)
    }
  }, [])

  const loadingPlaceholder = (
    <div className="w-full aspect-square bg-neutral-100/10 animate-pulse rounded-xl" />
  )

  if (!modelPath || isUnmounting) return loadingPlaceholder

  return (
    <div 
      key={`wrapper-${modelPath}`} 
      className="w-full h-full min-h-[400px] relative select-none canvas-container-block"
    >
      <Suspense fallback={loadingPlaceholder}>
        <Canvas 
          key={`canvas-${modelPath}`}
          camera={{ position: [40, 45, 80], fov: 5 }}
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            precision: "mediump",
            alpha: true 
          }}
          dpr={[1, 2]} 
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow={false} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />

          <UniversalModel path={modelPath} />
          
          <OrbitControls 
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.6} 
          />
        </Canvas>
      </Suspense>
    </div>
  )
}