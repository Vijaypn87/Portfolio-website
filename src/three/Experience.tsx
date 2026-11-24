import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { MathUtils, type PointLight } from 'three'
import { Sculpture } from './Sculpture'
import { Rig } from './Rig'
import type { RenderTier } from './types'

interface ExperienceProps {
  tier: RenderTier
  /** False while the hero is off-screen or the tab is hidden, which stops rendering entirely. */
  active: boolean
  onReady: () => void
  onFail: () => void
  onDecline: () => void
}

/** A soft light that follows the pointer, so the node highlights respond to the cursor. */
function PointerLight() {
  const light = useRef<PointLight>(null)
  useFrame(({ pointer }, delta) => {
    if (!light.current) return
    light.current.position.x = MathUtils.damp(light.current.position.x, pointer.x * 4, 3, delta)
    light.current.position.y = MathUtils.damp(light.current.position.y, pointer.y * 3, 3, delta)
  })
  return (
    <pointLight ref={light} position={[0, 0, 3.5]} intensity={18} distance={12} color="#ffb98a" />
  )
}

/**
 * Procedural studio lighting (no external HDR file): a warm charcoal base with an amber key,
 * a deeper orange fill and an orange kicker, so the ribbons pick up soft, golden reflections.
 */
function Studio() {
  return (
    <Environment resolution={256}>
      <color attach="background" args={['#2a1a10']} />
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffd9a8"
        position={[0, 7, 0]}
        scale={[16, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.0}
        color="#ffd9a8"
        position={[-7, 1, 2]}
        scale={[4, 9, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.8}
        color="#ff9a4d"
        position={[7, 0, 2]}
        scale={[3, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#ff9a4d"
        position={[0, -7, 1]}
        scale={[14, 3, 1]}
      />
      <Lightformer form="ring" intensity={1.2} color="#ff7a30" position={[0, -2, -6]} scale={3} />
    </Environment>
  )
}

export default function Experience({ tier, active, onReady, onFail, onDecline }: ExperienceProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={tier === 'high' ? [1, 2] : tier === 'medium' ? [1, 1.5] : [1, 1]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ alpha: true, antialias: tier === 'high', powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root') ?? undefined}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onFail()
        })
        onReady()
      }}
    >
      <PerformanceMonitor flipflops={3} onDecline={onDecline} />
      <ambientLight intensity={0.15} />
      <PointerLight />
      <directionalLight position={[-3, 2, -4]} intensity={1.4} color="#ff7a30" />
      <Studio />
      <Rig>
        <Sculpture tier={tier} />
      </Rig>
    </Canvas>
  )
}
