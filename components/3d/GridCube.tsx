'use client'

import { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'

interface GridCubeProps {
  models: string[];
  storageKey?: string;
  glitchEnabled?: boolean;
}

export default function GridCube({ 
  models, 
  storageKey = 'global_cube_path',
  glitchEnabled = false 
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

          <UniversalModel path={modelPath} animate={isInView} glitchEnabled={glitchEnabled} />
          
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

interface UniversalModelProps {
  path: string;
  animate: boolean;
  glitchEnabled: boolean;
}

function UniversalModel({ path, animate, glitchEnabled }: UniversalModelProps) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  const groupRef = useRef<THREE.Group>(null)
  const [isIntroFinished, setIsIntroFinished] = useState(false)
  const [isReadyToRender, setIsReadyToRender] = useState(false)

  const glitchTimeRef = useRef(0)
  const nextGlitchTimeRef = useRef(Math.random() * 3 + 1.5) 
  const isGlitchingRef = useRef(false)
  const glitchDurationRef = useRef(0)
  const glitchTypeRef = useRef(0) 

  const isFilterActiveRef = useRef(false)

  const colorBase = useMemo(() => new THREE.Color('#ffffff'), [])
  const colorBlackGlitch = useMemo(() => new THREE.Color('#000000'), []) 

  const targetRotationY = -Math.PI / 10
  const targetScale = 1

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(0.9, 0.9, 0.9)
      groupRef.current.position.set(0, 0, 0)
      groupRef.current.rotation.set(Math.PI, targetRotationY - (Math.PI / 6), 0)
    }
    setIsIntroFinished(false)
    isGlitchingRef.current = false
    isFilterActiveRef.current = false
    glitchTimeRef.current = 0

    const rafId = requestAnimationFrame(() => {
      setIsReadyToRender(true)
    })
    return () => cancelAnimationFrame(rafId)
  }, [path])

  useFrame((state, delta) => {
    if (!groupRef.current || !isReadyToRender || !animate) return
    
    const smoothDelta = Math.min(delta, 0.1)

    const ambientLight = state.scene.children.find(child => child instanceof THREE.AmbientLight) as THREE.AmbientLight | undefined
    const dirLights = state.scene.children.filter(child => child instanceof THREE.DirectionalLight) as THREE.DirectionalLight[]

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
      return
    }

    if (!glitchEnabled) {
      groupRef.current.rotation.y += smoothDelta * 0.08
      return
    }

    glitchTimeRef.current += delta

    if (!isGlitchingRef.current && glitchTimeRef.current >= nextGlitchTimeRef.current) {
      isGlitchingRef.current = true
      glitchDurationRef.current = Math.random() * 0.22 + 0.08 
      glitchTypeRef.current = Math.floor(Math.random() * 3) 
    }

    if (isGlitchingRef.current) {
      glitchDurationRef.current -= delta

      if (glitchDurationRef.current <= 0) {
        isGlitchingRef.current = false
        glitchTimeRef.current = 0
        nextGlitchTimeRef.current = Math.random() * 4 + 2
        
        groupRef.current.position.set(0, 0, 0)
        groupRef.current.scale.set(targetScale, targetScale, targetScale)
        
        if (ambientLight) ambientLight.color.copy(colorBase)
        dirLights.forEach(light => light.color.copy(colorBase))

        if (Math.random() > 0.5) {
          isFilterActiveRef.current = !isFilterActiveRef.current
          
          clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                mat.transparent = isFilterActiveRef.current;
                mat.opacity = isFilterActiveRef.current ? 0.25 : 1.0; 
                mat.depthWrite = !isFilterActiveRef.current;         
              });
            }
          });
        }
      } else {
        const subTickChance = Math.random()

        if (subTickChance > 0.25) {
          if (ambientLight) ambientLight.color.copy(colorBlackGlitch)
          dirLights.forEach(light => light.color.copy(colorBlackGlitch))

          if (glitchTypeRef.current === 0) {
            groupRef.current.position.x = (Math.random() - 0.5) * 3.0
            groupRef.current.position.y = (Math.random() - 0.5) * 0.5
            groupRef.current.scale.set(targetScale, targetScale, targetScale)
          } 
          
          else if (glitchTypeRef.current === 1) {
            const timeSin = Math.sin(state.clock.getElapsedTime() * 140) 
            groupRef.current.position.x = timeSin * 1.8
            groupRef.current.position.y = (Math.random() - 0.5) * 1.2
            groupRef.current.rotation.y += timeSin * 0.15
            groupRef.current.scale.set(targetScale, targetScale, targetScale)
          } 
          
          else {
            groupRef.current.scale.set(targetScale, targetScale, targetScale)
            groupRef.current.position.set(
              (Math.random() - 0.5) * 2.2,
              (Math.random() - 0.5) * 2.2,
              (Math.random() - 0.5) * 1.5 
            )
          }
        } else if (subTickChance < 0.08) {
          groupRef.current.position.y = -9999 
        } else {
          groupRef.current.position.set(0, 0, 0)
          groupRef.current.scale.set(targetScale, targetScale, targetScale)
          if (ambientLight) ambientLight.color.copy(colorBase)
          dirLights.forEach(light => light.color.copy(colorBase))
        }
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