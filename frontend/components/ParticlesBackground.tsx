
import React, { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DigitalBrain = ({ scrollY }: { scrollY: number }) => {
  const points = useRef<THREE.Points>(null!);
  const particleCount = 25000;
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [positions, initialPositions, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initPos = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const noise = Math.sin(phi * 4) * Math.cos(theta * 3) * 0.4 + 
                    Math.sin(phi * 10) * 0.2 + 
                    Math.cos(theta * 15) * 0.1;
      const r = 3.5 + noise;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi) * 0.7;
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;
      s[i] = Math.random() * 2.0;
    }
    return [pos, initPos, s];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Scroll-based Parallax logic
    // We gently scale and move the group based on the global scroll
    const scrollFactor = scrollY * 0.0005;
    const targetScale = 1 + scrollFactor * 0.2;
    const targetY = -scrollY * 0.002;
    
    points.current.scale.setScalar(THREE.MathUtils.lerp(points.current.scale.x, targetScale, 0.1));
    points.current.position.y = THREE.MathUtils.lerp(points.current.position.y, targetY, 0.1);

    const targetRotX = mouse.current.y * 0.2;
    const targetRotY = mouse.current.x * 0.3;
    
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, targetRotX, 0.05);
    points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, targetRotY + t * 0.05, 0.05);

    const positionsArray = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const noise = Math.sin(t * 0.5 + initialPositions[i3] * 0.5) * 0.05;
      const px = initialPositions[i3];
      const py = initialPositions[i3 + 1];
      const mx = mouse.current.x * 5;
      const my = mouse.current.y * 3;
      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, (1.5 - dist) * 0.2);
      
      positionsArray[i3] = px + noise + (dx * force);
      positionsArray[i3 + 1] = py + noise + (dy * force);
      positionsArray[i3 + 2] = initialPositions[i3 + 2] + noise;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <pointLight position={[0, 0, 2]} intensity={2} color="#22c55e" distance={10} />
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#22c55e" transparent opacity={0.8} sizeAttenuation={true} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
};

export const ParticlesBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 12], fov: 35 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#050505', 8, 20]} />
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <DigitalBrain scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
};
