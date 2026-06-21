'use client'

import { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'

interface GridCubeProps {
  models: string[];
  storageKey?: string;
}

export default function GridCube({ 
  models, 
  storageKey = 'global_cube_path' 
}: GridCubeProps) {
  const pathname = usePathname()
  const [modelPath, setModelPath] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isInView, setIsInView] = useState(false) 
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerTarget = containerRef.current
    if (!observerTarget) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(observerTarget)
        }
      },
      {
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.1 
      }
    )

    observer.observe(observerTarget)
    return () => {
      if (observerTarget) observer.unobserve(observerTarget)
    }
  }, [mounted])

  useEffect(() => {
    if (typeof window === 'undefined' || !models.length) return

    models.forEach((path) => useGLTF.preload(path))

    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload'
    if (isReload) {
      sessionStorage.removeItem(storageKey)
    }

    let chosenPath = sessionStorage.getItem(storageKey)
    if (!chosenPath || !models.includes(chosenPath)) {
      const randomIndex = Math.floor(Math.random() * models.length)
      chosenPath = models[randomIndex]
      sessionStorage.setItem(storageKey, chosenPath)
    }

    setModelPath(chosenPath)
    setMounted(true)

    return () => setMounted(false)
  }, [pathname, models, storageKey])

  if (!mounted || !modelPath) return <div ref={containerRef} className="w-full h-full min-h-[400px]" />

  return (
    <div 
      ref={containerRef}
      key={`cube-route-${pathname}-${storageKey}`}
      className="w-full h-full min-h-[400px] relative select-none canvas-container-block"
    >
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

          <UniversalModel path={modelPath} animate={isInView} />
          
          <OrbitControls 
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={false} 
          />
        </Canvas>
      </Suspense>
    </div>
  )
}

function UniversalModel({ path, animate }: { path: string; animate: boolean }) {
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
    if (!groupRef.current || !isReadyToRender || !animate) return
    
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