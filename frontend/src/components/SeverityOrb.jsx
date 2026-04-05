/**
 * SeverityOrb — 3D animated danger sphere using @react-three/fiber
 * Glows and pulses based on the extracted severity level.
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SEVERITY_COLORS = {
  critical: { core: '#ef4444', glow: '#ff6b6b', emissive: '#ff0000' },
  high:     { core: '#f97316', glow: '#ffaa44', emissive: '#ff6600' },
  medium:   { core: '#eab308', glow: '#ffd644', emissive: '#ccaa00' },
  low:      { core: '#22c55e', glow: '#44ff88', emissive: '#00cc44' },
};

function Orb({ severity = 'high' }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.high;

  const coreColor = useMemo(() => new THREE.Color(colors.core), [colors.core]);
  const emissiveColor = useMemo(() => new THREE.Color(colors.emissive), [colors.emissive]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
    if (glowRef.current) {
      const glowScale = 1.3 + Math.sin(t * 1.5) * 0.15;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>

      {/* Inner light point */}
      <pointLight color={colors.core} intensity={2} distance={5} decay={2} />
    </group>
  );
}

export default function SeverityOrb({ severity = 'high', size = 80 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Orb severity={severity} />
      </Canvas>
    </div>
  );
}
