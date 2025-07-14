import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface AIAssistant3DProps {
  isProcessing: boolean;
  isListening: boolean;
}

export const AIAssistant3D: React.FC<AIAssistant3DProps> = ({ isProcessing, isListening }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Rotation when processing
      if (isProcessing) {
        meshRef.current.rotation.y += delta * 0.5;
      }
      
      // Pulsing when listening
      if (isListening) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />
      
      {/* Point Light */}
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      {/* Main Character Sphere (placeholder for anime model) */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={isListening ? "#ff00ff" : isProcessing ? "#00ffff" : "#8000ff"}
            emissive={isListening ? "#ff00ff" : isProcessing ? "#00ffff" : "#4000ff"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Status Text */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={isListening ? "#ff00ff" : isProcessing ? "#00ffff" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {isListening ? "Listening..." : isProcessing ? "Processing..." : "Ready"}
      </Text>
      
      {/* Particle Effects */}
      {(isListening || isProcessing) && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Float key={i} speed={2 + i * 0.1} rotationIntensity={0.5} floatIntensity={0.8}>
              <mesh position={[
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
              ]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial
                  color={isListening ? "#ff00ff" : "#00ffff"}
                  emissive={isListening ? "#ff00ff" : "#00ffff"}
                  emissiveIntensity={0.8}
                />
              </mesh>
            </Float>
          ))}
        </group>
      )}
    </>
  );
};