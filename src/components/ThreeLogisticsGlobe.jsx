import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, PointMaterial, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Random points on a sphere for atmospheric stardust
const generateStars = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }
  return positions;
};

// Generate connections (arcs) between random supply chain nodes on the globe
const generateArcs = (radius) => {
  const numArcs = 8;
  const arcs = [];
  
  for (let i = 0; i < numArcs; i++) {
    // Start point
    const phi1 = Math.random() * Math.PI;
    const theta1 = Math.random() * Math.PI * 2;
    const p1 = new THREE.Vector3().setFromSphericalCoords(radius, phi1, theta1);
    
    // End point
    const phi2 = Math.random() * Math.PI;
    const theta2 = Math.random() * Math.PI * 2;
    const p2 = new THREE.Vector3().setFromSphericalCoords(radius, phi2, theta2);
    
    // Control point for arc (bulge outwards)
    const mid = p1.clone().lerp(p2, 0.5);
    const distance = p1.distanceTo(p2);
    mid.normalize().multiplyScalar(radius + distance * 0.3);
    
    // Create quadratic bezier curve
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    arcs.push({
      points: curve.getPoints(50),
      color: i % 2 === 0 ? '#22c55e' : '#3b82f6'
    });
  }
  return arcs;
};

const RotatingGlobe = () => {
  const groupRef = useRef();
  const radius = 2.5;

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.1;
  });

  const arcs = useMemo(() => generateArcs(radius), [radius]);
  const stars = useMemo(() => generateStars(800), []);

  return (
    <group ref={groupRef}>
      {/* Background Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={stars.length / 3}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
      </points>

      {/* Main Wireframe Globe */}
      <Sphere args={[radius, 64, 64]}>
        <meshBasicMaterial 
          color="#1e293b" 
          wireframe={true} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
        />
      </Sphere>

      {/* Solid Inner Core for Depth */}
      <Sphere args={[radius * 0.98, 32, 32]}>
        <meshPhongMaterial color="#020617" emissive="#020617" shininess={100} />
      </Sphere>

      {/* Logistics Arcs */}
      {arcs.map((arc, i) => (
        <Line 
          key={i} 
          points={arc.points} 
          color={arc.color} 
          lineWidth={2}
          transparent 
          opacity={0.6}
        />
      ))}

      {/* Hover Nodes (HTML Overlays) */}
      {arcs.map((arc, i) => (
        <Html key={`html-${i}`} position={arc.points[50]} center className="pointer-events-none">
          <div className="flex items-center justify-center pointer-events-none">
             <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] animate-pulse ${arc.color === '#22c55e' ? 'text-emerald-500 bg-emerald-400' : 'text-blue-500 bg-sap-blue'}`}></div>
          </div>
        </Html>
      ))}

      {/* Atmospheric Glow */}
      <Sphere args={[radius * 1.2, 32, 32]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
      </Sphere>
    </group>
  );
};

export default function ThreeLogisticsGlobe() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />
        <RotatingGlobe />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.5} 
        />
      </Canvas>
      {/* Foreground Overlay UI */}
      <div className="absolute top-4 left-4 z-10 p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Live Telemetry</p>
         <h3 className="text-emerald-400 font-mono text-sm shadow-emerald-400/20">Global Sync Active</h3>
      </div>
    </div>
  );
}
