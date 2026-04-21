import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const ScrollReactiveGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Calculate scroll progress (0 to 1)
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = window.scrollY / maxScroll;
    
    // Rotation mapping
    const targetYAngle = scrollProgress * Math.PI * 8;
    
    const targetZPosition = scrollProgress < 0.5 
      ? THREE.MathUtils.lerp(0, -5, scrollProgress * 2)
      : THREE.MathUtils.lerp(-5, -15, (scrollProgress - 0.5) * 2);
      
    const targetXPosition = scrollProgress < 0.5 
      ? THREE.MathUtils.lerp(2, -2, scrollProgress * 2)
      : THREE.MathUtils.lerp(-2, 4, (scrollProgress - 0.5) * 2);

    // Smooth dampening
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetYAngle, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZPosition, 0.08);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetXPosition, 0.08);
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[2, 0, 0]}>
        {/* Ultra-modern wireframe icosahedron */}
        <icosahedronGeometry args={[3, 2]} />
        <meshStandardMaterial 
          color="#000000" 
          wireframe={true}
          emissive="#4ade80" 
          emissiveIntensity={0.8} 
        />
      </mesh>
    </Float>
  );
};

const Scene3DCanvas = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-[10] pointer-events-none"
      style={{
        background: 'transparent',
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
        {/* Robust Cinematic Lighting (Replaces external HDR) */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#4ade80" />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} penumbra={1} color="#ffffff" />
        
        {/* Animated particles */}
        <Sparkles 
          count={150} 
          scale={20} 
          size={1.2} 
          speed={0.15} 
          opacity={0.1} 
          color="#4ade80" 
        />

        <ScrollReactiveGeometry />
      </Canvas>
    </div>
  );
};

export default Scene3DCanvas;
