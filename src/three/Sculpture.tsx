import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  MathUtils,
  Object3D,
  Vector3,
  type Camera,
  type Group,
  type InstancedMesh,
  type Mesh,
  type MeshPhysicalMaterial,
} from 'three'
import { buildLinks, buildRibbon, RIBBON_COUNT, type RibbonSample } from '@/lib/sculpture'
import type { RenderTier } from './types'

const { damp, smoothstep } = MathUtils

// Amber-to-burnt-orange glass: light amber and amber for the body, burnt orange in the deeper
// folds, and a warm orange for the light that travels along the links.
const AMBER_LIGHT = new Color('#ffd29a')
const AMBER = new Color('#ffb15c')
const BURNT = new Color('#e5631a')
const ORANGE = new Color('#ff7a30')
const HIGHLIGHT = new Color('#fff3e2')
const LINK_BASE = new Color('#ffb15c').multiplyScalar(0.34)
const LINK_ORANGE = new Color('#ff8a45')
const LINK_GLOW = new Color('#ffe2bd')

/** Each ribbon turns about the shared axis at its own slow pace, so they keep re-weaving. */
const SPEEDS = [0.045, -0.03, 0.06] as const

/** How far (in NDC height units) the pointer's influence reaches. */
const POINTER_REACH = 0.4

type Pointer = { x: number; y: number }

function ribbonTint(k: number, t: number, out: Color) {
  const u = Math.pow(t, 0.8)
  if (k === 0) return out.copy(AMBER_LIGHT).lerp(AMBER, u)
  if (k === 1) return out.copy(AMBER).lerp(BURNT, u)
  return out
    .copy(AMBER_LIGHT)
    .lerp(AMBER, u * 0.5)
    .lerp(ORANGE, smoothstep(t, 0.78, 1) * 0.5)
}

/** A strip of triangles along the ribbon, coloured amber to burnt orange along its length. */
function ribbonGeometry(ribbon: RibbonSample[], k: number) {
  const n = ribbon.length
  const positions = new Float32Array(n * 2 * 3)
  const colors = new Float32Array(n * 2 * 3)
  const color = new Color()
  ribbon.forEach((sample, i) => {
    ribbonTint(k, sample.t, color)
    ;[sample.left, sample.right].forEach((edge, side) => {
      const at = (i * 2 + side) * 3
      positions.set(edge, at)
      colors.set([color.r, color.g, color.b], at)
    })
  })
  const index: number[] = []
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  geometry.setIndex(index)
  geometry.computeVertexNormals()
  return geometry
}

/** Slow wave of light travelling along the sculpture's length; the high power keeps it sparse. */
const activationAt = (x: number, time: number) => Math.max(0, Math.sin(time * 0.7 - x * 1.4)) ** 8

/**
 * The hero's neural sculpture: three translucent, iridescent glass ribbons twisting around a
 * shared axis, joined by fine neural links with a few softly lit nodes. Everything moves slowly
 * and continuously (no sudden changes of direction); the pointer tilts the whole form, brightens
 * the part of the web near the cursor and warms the glass. One draw call per ribbon, one for the
 * links and one for the nodes, so it stays light.
 */
export function Sculpture({ tier }: { tier: RenderTier }) {
  const samples = tier === 'high' ? 160 : 96
  const root = useRef<Group>(null)
  const ribbonMeshes = useRef<Array<Mesh | null>>([])
  const nodes = useRef<InstancedMesh>(null)
  const pointerSeen = useRef(false)
  /** The pointer eased over time, so a fast or sudden mouse move can never cause a visual jump. */
  const smoothPointer = useRef({ x: 0, y: 0 })

  const model = useMemo(() => {
    const ribbons = Array.from({ length: RIBBON_COUNT }, (_, k) => buildRibbon(k, samples))
    const links = buildLinks(samples)
    const nodeLinks = links.map((_, i) => i).filter((i) => i % 3 === 0)

    const line = new BufferGeometry()
    const linePositions = new BufferAttribute(new Float32Array(links.length * 2 * 3), 3)
    const lineColors = new BufferAttribute(new Float32Array(links.length * 2 * 3), 3)
    linePositions.setUsage(DynamicDrawUsage)
    lineColors.setUsage(DynamicDrawUsage)
    line.setAttribute('position', linePositions)
    line.setAttribute('color', lineColors)

    return {
      ribbons,
      geometries: ribbons.map((ribbon, k) => ribbonGeometry(ribbon, k)),
      links,
      nodeLinks,
      line,
    }
  }, [samples])

  useEffect(
    () => () => {
      model.geometries.forEach((geometry) => geometry.dispose())
      model.line.dispose()
    },
    [model],
  )

  // Scratch objects, allocated once so the frame loop produces no garbage.
  const scratch = useMemo(
    () => ({
      dummy: new Object3D(),
      color: new Color(),
      a: new Vector3(),
      b: new Vector3(),
      projected: new Vector3(),
    }),
    [],
  )

  /** A ribbon sample's position after that ribbon's own rotation about the X axis. */
  const endpoint = (end: { ribbon: number; sample: number }, time: number, out: Vector3) => {
    const [x, y, z] = model.ribbons[end.ribbon][end.sample].center
    const angle = time * SPEEDS[end.ribbon]
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return out.set(x, y * cos - z * sin, y * sin + z * cos)
  }

  /** Pointer proximity (0..1) for a local-space point, by projecting it to the screen. */
  const influenceAt = (
    local: Vector3,
    pointer: Pointer | undefined,
    aspect: number,
    camera: Camera | undefined,
  ) => {
    if (!pointer || !camera || !root.current) return 0
    const { projected } = scratch
    projected.copy(local).applyMatrix4(root.current.matrixWorld).project(camera)
    const dist = Math.hypot((projected.x - pointer.x) * aspect, projected.y - pointer.y)
    return Math.max(0, 1 - dist / POINTER_REACH) ** 2
  }

  const update = (time: number, pointer?: Pointer, aspect = 1, camera?: Camera) => {
    const { dummy, color, a, b } = scratch
    const { links, nodeLinks } = model
    const linePositions = model.line.getAttribute('position') as BufferAttribute
    const lineColors = model.line.getAttribute('color') as BufferAttribute

    links.forEach((link, i) => {
      endpoint(link.a, time, a)
      endpoint(link.b, time, b)
      linePositions.setXYZ(i * 2, a.x, a.y, a.z)
      linePositions.setXYZ(i * 2 + 1, b.x, b.y, b.z)
      ;[a, b].forEach((p, side) => {
        const light = activationAt(p.x, time)
        const near = influenceAt(p, pointer, aspect, camera)
        color
          .copy(LINK_BASE)
          .lerp(LINK_ORANGE, light * 0.8)
          .lerp(LINK_GLOW, near * 0.75)
        lineColors.setXYZ(i * 2 + side, color.r, color.g, color.b)
      })
    })
    linePositions.needsUpdate = true
    lineColors.needsUpdate = true

    const mesh = nodes.current
    if (mesh) {
      nodeLinks.forEach((linkIndex, i) => {
        endpoint(links[linkIndex].a, time, a)
        const light = activationAt(a.x, time)
        const near = influenceAt(a, pointer, aspect, camera)
        dummy.position.copy(a)
        dummy.scale.setScalar(0.055 * (1 + light * 0.5 + near * 0.8))
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(
          i,
          color
            .copy(AMBER_LIGHT)
            .lerp(AMBER, (i % 4) / 4)
            .lerp(ORANGE, light * 0.85)
            .lerp(HIGHLIGHT, near * 0.4),
        )
      })
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }

  useLayoutEffect(() => update(0), []) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    const g = root.current
    if (!g || g.parent?.visible === false) return
    const { clock, pointer, camera, size } = state
    const time = clock.elapsedTime
    if (pointer.x !== 0 || pointer.y !== 0) pointerSeen.current = true
    const smooth = smoothPointer.current
    smooth.x = damp(smooth.x, pointer.x, 3.5, delta)
    smooth.y = damp(smooth.y, pointer.y, 3.5, delta)

    // Slow, continuous organic motion: a diagonal pose that sways gently, never abruptly.
    g.rotation.set(0.25 + Math.sin(time * 0.17) * 0.06, Math.sin(time * 0.12) * 0.35, -0.32)
    ribbonMeshes.current.forEach((mesh, k) => {
      if (mesh) mesh.rotation.x = time * SPEEDS[k]
    })

    g.updateWorldMatrix(true, false)
    update(time, pointerSeen.current ? smooth : undefined, size.width / size.height, camera)

    // The glass warms slightly as the pointer nears the sculpture's centre.
    const near = influenceAt(
      scratch.a.set(0, 0, 0),
      pointerSeen.current ? smooth : undefined,
      size.width / size.height,
      camera,
    )
    ribbonMeshes.current.forEach((mesh) => {
      const material = mesh?.material as MeshPhysicalMaterial | undefined
      if (!material) return
      material.emissiveIntensity = damp(material.emissiveIntensity, 0.16 + near * 0.35, 3, delta)
    })
  })

  return (
    <group ref={root} position={[0.15, -0.05, 0]}>
      {model.geometries.map((geometry, k) => (
        <mesh
          key={k}
          ref={(el) => {
            ribbonMeshes.current[k] = el
          }}
          geometry={geometry}
          renderOrder={k}
        >
          <meshPhysicalMaterial
            vertexColors
            side={DoubleSide}
            transparent
            opacity={0.62}
            roughness={0.14}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.1}
            iridescenceIOR={1.3}
            emissive="#c2541a"
            emissiveIntensity={0.16}
            envMapIntensity={1.1}
            depthWrite={false}
          />
        </mesh>
      ))}

      <lineSegments geometry={model.line}>
        <lineBasicMaterial vertexColors transparent opacity={0.85} />
      </lineSegments>

      <instancedMesh ref={nodes} args={[undefined, undefined, model.nodeLinks.length]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial roughness={0.3} metalness={0.15} />
      </instancedMesh>
    </group>
  )
}
