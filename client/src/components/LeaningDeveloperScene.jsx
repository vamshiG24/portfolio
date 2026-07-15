import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Steam particle animation component
const SteamParticles = () => {
  const groupRef = useRef();
  const particleCount = 4;
  const particles = useRef(
    Array.from({ length: particleCount }).map((_, i) => ({
      y: 0.1 + i * 0.1,
      x: (Math.random() - 0.5) * 0.03,
      scale: 0.005 + Math.random() * 0.005,
      speed: 0.0005 + Math.random() * 0.0008,
      seed: Math.random() * 100,
    }))
  );

  useFrame((state) => {
    particles.current.forEach((p, idx) => {
      // Float upwards
      p.y += p.speed;
      // Drift slightly sideways
      p.x += Math.sin(state.clock.elapsedTime * 2 + p.seed) * 0.0002;
      
      // Reset if it gets too high
      if (p.y > 0.4) {
        p.y = 0.08;
        p.x = (Math.random() - 0.5) * 0.03;
      }
      
      const child = groupRef.current.children[idx];
      if (child) {
        child.position.set(p.x, p.y, 0);
        // Fade out near the top
        const opacity = Math.max(0, 1 - (p.y - 0.08) / 0.32);
        child.material.opacity = opacity * 0.4;
      }
    });
  });

  return (
    <group ref={groupRef} position={[-0.5, -0.42, 0.2]}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// Scroll controller to rotate camera and lean the developer
const SceneController = ({ sceneRef, developerRef }) => {
  useFrame((state) => {
    const scrollY = window.scrollY || 0;
    const scrollFraction = scrollY / 800; // normalize
    
    // Stabilize camera coordinates statically looking at the workspace
    state.camera.position.set(2.8, 1.2, 3.2);
    state.camera.lookAt(0, -0.2, 0);

    // Rotate the entire desk group on scroll
    if (sceneRef.current) {
      sceneRef.current.rotation.y = scrollFraction * 0.7;
    }

    // Physically lean developer closer to screen on scroll
    if (developerRef.current) {
      const leanFraction = Math.min(scrollFraction, 1.2);
      developerRef.current.position.x = -0.72 + leanFraction * 0.12;
      developerRef.current.position.z = 0.2 - leanFraction * 0.04;
      developerRef.current.rotation.z = 0.15 + leanFraction * 0.08;
    }
  });
  return null;
};

const LeaningDeveloperScene = () => {
  const sceneRef = useRef();
  const developerRef = useRef();

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [2.8, 1.2, 3.2], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 8, 5]}
          castShadow
          intensity={2.0}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-2, 3, -1]} color="#FACC15" intensity={1.8} />

        {/* 3D Scene parent group that rotates on scroll */}
        <group ref={sceneRef} position={[0, 0.2, 0]}>
          {/* Table Top */}
          <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.08, 1.2]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Table Legs */}
          <mesh position={[1.1, -1.1, 0.5]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-1.1, -1.1, 0.5]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[1.1, -1.1, -0.5]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-1.1, -1.1, -0.5]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Procedural Laptop Base */}
          <mesh position={[0, -0.45, 0.08]} castShadow>
            <boxGeometry args={[0.45, 0.02, 0.3]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Procedural Laptop Screen */}
          <mesh position={[0, -0.32, -0.06]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.28, 0.015]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Procedural Laptop Screen Emissive Glow */}
          <mesh position={[0, -0.32, -0.05]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.43, 0.26]} />
            <meshBasicMaterial color="#ffeb78" toneMapped={false} />
          </mesh>

          {/* Coffee Cup */}
          <mesh position={[-0.5, -0.42, 0.2]} castShadow>
            <cylinderGeometry args={[0.045, 0.038, 0.08]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.1} />
          </mesh>
          <mesh position={[-0.5, -0.385, 0.2]}>
            <cylinderGeometry args={[0.042, 0.042, 0.005]} />
            <meshStandardMaterial color="#3c2f2f" roughness={0.6} />
          </mesh>
          <SteamParticles />

          {/* Potted Plant */}
          {/* Pot */}
          <mesh position={[0.6, -0.41, -0.2]} castShadow>
            <cylinderGeometry args={[0.07, 0.05, 0.1]} />
            <meshStandardMaterial color="#e07a5f" roughness={0.5} />
          </mesh>
          {/* Soil */}
          <mesh position={[0.6, -0.362, -0.2]}>
            <cylinderGeometry args={[0.065, 0.065, 0.004]} />
            <meshStandardMaterial color="#4a3525" roughness={0.8} />
          </mesh>
          {/* Plant Leaves */}
          <mesh position={[0.6, -0.3, -0.2]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
          <mesh position={[0.56, -0.27, -0.17]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#40916c" roughness={0.6} />
          </mesh>
          <mesh position={[0.64, -0.26, -0.23]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#52b788" roughness={0.6} />
          </mesh>

          {/* Stylized Leaning Developer Group */}
          <group ref={developerRef} position={[-0.72, -0.1, 0.2]} rotation={[0.08, 0, 0.15]}>
            {/* Torso/Shirt */}
            <mesh castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.6]} />
              <meshStandardMaterial color="#22333b" roughness={0.6} />
            </mesh>

            {/* Head */}
            <mesh position={[0.08, 0.42, 0.02]} castShadow>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#fccbb3" roughness={0.6} />
            </mesh>

            {/* Hair/Cap */}
            <mesh position={[0.08, 0.46, 0.0]} castShadow>
              <boxGeometry args={[0.11, 0.06, 0.11]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.12, -0.58, -0.05]} rotation={[0, 0, -0.05]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.65]} />
              <meshStandardMaterial color="#1d3557" roughness={0.6} />
            </mesh>
            <mesh position={[0.0, -0.58, 0.05]} rotation={[0, 0, -0.02]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.65]} />
              <meshStandardMaterial color="#1d3557" roughness={0.6} />
            </mesh>

            {/* Left Arm resting on table */}
            <mesh position={[0.2, -0.05, -0.05]} rotation={[0.2, -0.6, -0.4]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.32]} />
              <meshStandardMaterial color="#22333b" roughness={0.6} />
            </mesh>

            {/* Right Arm */}
            <mesh position={[0.05, -0.02, 0.12]} rotation={[0.1, 0.2, 0.2]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.28]} />
              <meshStandardMaterial color="#22333b" roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* Scroll controller */}
        <SceneController sceneRef={sceneRef} developerRef={developerRef} />
      </Canvas>
    </div>
  );
};

export default LeaningDeveloperScene;
