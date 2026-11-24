import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { HERO_3D_ANCHOR_ID } from './anchor'

const { damp } = MathUtils

/** Half the sculpture's width and height, in scene units at scale 1 (it is longer than it is tall). */
const MODEL_HALF_WIDTH = 2.7
const MODEL_HALF_HEIGHT = 2.0

/**
 * Places the scene inside the hero's `#hero-3d` DOM cell, so responsive layout stays in CSS: the
 * object is fitted to the cell and follows it as the page scrolls. It adds a gentle float, a
 * damped pointer tilt, a very small camera drift for depth, and a soft scale-in on mount, and
 * hides itself when the cell is off-screen.
 */
export function Rig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const anchor = useRef<HTMLElement | null>(null)
  const intro = useRef(0)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    if (!anchor.current?.isConnected) anchor.current = document.getElementById(HERO_3D_ANCHOR_ID)
    const rect = anchor.current?.getBoundingClientRect()
    const { viewport, pointer, size, clock, camera } = state

    g.visible = Boolean(rect && rect.bottom > 0 && rect.top < size.height)
    if (!rect || !g.visible) return

    // The canvas covers the viewport, so CSS pixels map straight onto world units at z = 0.
    const worldPerPx = viewport.width / size.width
    const fit = Math.min(rect.width / 2 / MODEL_HALF_WIDTH, rect.height / 2 / MODEL_HALF_HEIGHT)
    intro.current = damp(intro.current, 1, 2.2, delta)

    g.position.set(
      (rect.left + rect.width / 2 - size.width / 2) * worldPerPx,
      -(rect.top + rect.height / 2 - size.height / 2) * worldPerPx +
        Math.sin(clock.elapsedTime * 0.6) * 0.05,
      0,
    )
    g.scale.setScalar(Math.max(fit * worldPerPx * 0.96 * intro.current, 0.0001))

    g.rotation.y = damp(g.rotation.y, pointer.x * 0.3, 2.5, delta)
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.2, 2.5, delta)

    // Tiny opposing camera drift: the near and far parts shift by different amounts, which reads
    // as depth without moving the object out of its cell.
    camera.position.x = damp(camera.position.x, pointer.x * 0.08, 2, delta)
    camera.position.y = damp(camera.position.y, pointer.y * 0.06, 2, delta)
    camera.lookAt(0, 0, 0)
  })

  return <group ref={group}>{children}</group>
}
