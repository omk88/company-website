'use client'

import { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'

const AVAILABLE_MODELS = [
  '/cube1.glb', '/cube2.glb', '/cube3.glb', '/cube4.glb', '/cube5.glb',
  '/cube6.glb', '/cube7.glb', '/cube8.glb', '/cube9.glb', '/cube10.glb'
]

if (typeof window !== 'undefined') {
  AVAILABLE_MODELS.forEach((path) => useGLTF.preload(path));
}

function getInitialModelPath(): string {
  if (typeof window === 'undefined') return AVAILABLE_MODELS[0];
  const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

  if (isReload) {
    sessionStorage.removeItem('homepage_cube_path');
  }

  const cached = sessionStorage.getItem('homepage_cube_path');
  if (cached && AVAILABLE_MODELS.includes(cached)) {
    return cached;
  }

  const randomIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length);
  const chosen = AVAILABLE_MODELS[randomIndex];
  sessionStorage.setItem('homepage_cube_path', chosen);
  return chosen;
}

const initialPath = getInitialModelPath();

export default function GridCube() {
  const [modelPath] = useState<string>(initialPath)
  const pathname = usePathname()
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [pathname])

  return (
    <div 
      key={`cube-route-${pathname}`}
      className="w-full h-full min-h-[400px] relative select-none canvas-container-block"
    >
      {mounted && (
        <Suspense fallback={null}>
          <Canvas 
            camera={{ position: [40, 45, 80], fov: 5 }}
            gl={{ 
              antialias: true, 
              powerPreference: "high-performance",
              precision: "mediump",
              alpha: true,
              preserveDrawingBuffer: false
            }}
            dpr={[1, 2]} 
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[20, 40, 20]} intensity={1.5} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} />

            <UniversalModel path={modelPath} />
            
            <OrbitControls 
              target={[0, 0, 0]}
              enablePan={false}
              enableZoom={false} 
            />
          </Canvas>
        </Suspense>
      )}
    </div>
  )
}

function UniversalModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  const groupRef = useRef<THREE.Group>(null)
  const [isIntroFinished, setIsIntroFinished] = useState(false)
  const [isReadyToRender, setIsReadyToRender] = useState(false)

  const targetRotationY = -Math.PI / 10
  const targetScale = 1

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(0.9, 0.9, 0.9)
      groupRef.current.position.y = 0
      groupRef.current.rotation.y = targetRotationY - (Math.PI / 6)
    }
    setIsIntroFinished(false)

    const rafId = requestAnimationFrame(() => {
      setIsReadyToRender(true)
    })
    return () => cancelAnimationFrame(rafId)
  }, [path])

  useFrame((state, delta) => {
    if (!groupRef.current || !isReadyToRender) return
    const smoothDelta = Math.min(delta, 0.1)

    if (!isIntroFinished) {
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, smoothDelta * 2)
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, smoothDelta * 2)
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, smoothDelta * 2)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, smoothDelta * 3)

      if (
        Math.abs(groupRef.current.scale.x - targetScale) < 0.005 && 
        Math.abs(groupRef.current.rotation.y - targetRotationY) < 0.005
      ) {
        setIsIntroFinished(true)
      }
    } else {
      groupRef.current.rotation.y += smoothDelta * 0.08
    }
  })

  return (
    <group ref={groupRef} rotation={[Math.PI, targetRotationY, 0]} dispose={null} visible={isReadyToRender}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  )
}