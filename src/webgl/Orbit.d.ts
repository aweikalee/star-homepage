import { Transform, OrbitOptions } from 'ogl-typescript'

export declare class Orbit {
  constructor(
    object: Transform,
    {
      element,
      enabled,
      target,
      ease,
      inertia,
      enableRotate,
      rotateSpeed,
      autoRotate,
      autoRotateSpeed,
      enableZoom,
      zoomSpeed,
      enablePan,
      panSpeed,
      minPolarAngle,
      maxPolarAngle,
      minAzimuthAngle,
      maxAzimuthAngle,
      minDistance,
      maxDistance,
    }?: Partial<OrbitOptions>
  )

  update(): void
  forcePosition(): void
  remove(): void
}
