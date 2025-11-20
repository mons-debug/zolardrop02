'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ShardData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationVelocity: THREE.Euler;
  scale: number;
  vertices: THREE.Vector3[];
  uvs: number[];
  opacity: number;
}

// ============================================================================
// 3D SHATTERED IMAGE COMPONENT
// ============================================================================

const ShatteredImage: React.FC<{
  textureUrl: string;
  triggerShatter: boolean;
  onShatterComplete: () => void;
}> = ({ textureUrl, triggerShatter, onShatterComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isShattered, setIsShattered] = useState(false);
  const [shards, setShards] = useState<ShardData[]>([]);
  const shatterTimeRef = useRef(0);
  
  // Create texture from data URL
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(textureUrl);
    return tex;
  }, [textureUrl]);
  
  const gridSize = 15;
  
  // Create shards
  const createShards = useMemo(() => {
    return () => {
      const newShards: ShardData[] = [];
      const cols = gridSize;
      const rows = gridSize;
      const width = 4;
      const height = 4;
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = (j * cellWidth) - width / 2 + cellWidth / 2;
          const y = (i * cellHeight) - height / 2 + cellHeight / 2;
          
          const offsetX = (Math.random() - 0.5) * cellWidth * 0.3;
          const offsetY = (Math.random() - 0.5) * cellHeight * 0.3;
          
          const vertices = [
            new THREE.Vector3(x - cellWidth / 2 + offsetX, y - cellHeight / 2 + offsetY, 0),
            new THREE.Vector3(x + cellWidth / 2 + offsetX, y - cellHeight / 2 + offsetY, 0),
            new THREE.Vector3(x + cellWidth / 2 + offsetX, y + cellHeight / 2 + offsetY, 0),
            new THREE.Vector3(x - cellWidth / 2 + offsetX, y + cellHeight / 2 + offsetY, 0),
          ];
          
          const u1 = j / cols;
          const u2 = (j + 1) / cols;
          const v1 = 1 - (i / rows);
          const v2 = 1 - ((i + 1) / rows);
          
          const uvs = [u1, v1, u2, v1, u2, v2, u1, v2];
          
          const angle = Math.atan2(y, x);
          const speed = 3 + Math.random() * 4;
          
          newShards.push({
            position: new THREE.Vector3(x, y, 0),
            velocity: new THREE.Vector3(
              Math.cos(angle) * speed,
              Math.sin(angle) * speed,
              (Math.random() - 0.5) * 3
            ),
            rotation: new THREE.Euler(0, 0, 0),
            rotationVelocity: new THREE.Euler(
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.3
            ),
            scale: 1,
            vertices,
            uvs,
            opacity: 1,
          });
        }
      }
      
      return newShards;
    };
  }, [gridSize]);
  
  // Trigger shatter
  useEffect(() => {
    if (triggerShatter && !isShattered) {
      setIsShattered(true);
      setShards(createShards());
      shatterTimeRef.current = 0;
    }
  }, [triggerShatter, isShattered, createShards]);
  
  // Animate shards
  useFrame((state, delta) => {
    if (isShattered && shards.length > 0) {
      shatterTimeRef.current += delta;
      
      setShards((prevShards) =>
        prevShards.map((shard) => ({
          ...shard,
          position: shard.position.clone().add(shard.velocity.clone().multiplyScalar(delta)),
          rotation: new THREE.Euler(
            shard.rotation.x + shard.rotationVelocity.x,
            shard.rotation.y + shard.rotationVelocity.y,
            shard.rotation.z + shard.rotationVelocity.z
          ),
          velocity: shard.velocity.clone().add(new THREE.Vector3(0, -12 * delta, 0)),
          // Keep opacity higher longer, then fade quickly
          opacity: shatterTimeRef.current > 1.5 
            ? Math.max(0, shard.opacity - delta * 2) 
            : 1,
        }))
      );
      
      // Complete after 2 seconds
      if (shatterTimeRef.current > 2 && onShatterComplete) {
        onShatterComplete();
      }
    }
  });
  
  return (
    <group>
      {!isShattered ? (
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial 
            map={texture} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <group>
          {shards.map((shard, index) => (
            <mesh
              key={index}
              position={shard.position}
              rotation={shard.rotation}
              scale={shard.scale}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={4}
                  array={new Float32Array(shard.vertices.flatMap((v) => [v.x, v.y, v.z]))}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="attributes-uv"
                  count={4}
                  array={new Float32Array(shard.uvs)}
                  itemSize={2}
                />
                <bufferAttribute
                  attach="index"
                  count={6}
                  array={new Uint16Array([0, 1, 2, 0, 2, 3])}
                  itemSize={1}
                />
              </bufferGeometry>
              <meshStandardMaterial
                map={texture}
                transparent
                opacity={shard.opacity}
                side={THREE.DoubleSide}
                metalness={0.1}
                roughness={0.4}
                emissive="#ffffff"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ============================================================================
// SCENE WITH STACKED IMAGES
// ============================================================================

const Scene: React.FC<{ 
  currentImageUrl: string;
  nextImageUrl: string;
  triggerShatter: boolean;
  onShatterComplete: () => void;
}> = ({ currentImageUrl, nextImageUrl, triggerShatter, onShatterComplete }) => {
  // Create textures
  const nextTexture = useMemo(() => {
    return new THREE.TextureLoader().load(nextImageUrl);
  }, [nextImageUrl]);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} />
      
      {/* NEXT IMAGE - Behind, always visible */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial 
          map={nextTexture} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* CURRENT IMAGE - Front, shatters */}
      <ShatteredImage
        textureUrl={currentImageUrl}
        triggerShatter={triggerShatter}
        onShatterComplete={onShatterComplete}
      />
    </>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AutoShatterPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerShatter, setTriggerShatter] = useState(false);
  const [key, setKey] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const interval = 5; // seconds
  
  useEffect(() => {
    setIsClient(true);
    
    // Generate dummy images
    const generateImage = (index: number, color1: string, color2: string, text: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decorative circles
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 150 + 50,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 140px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 30;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = '56px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText(`Image ${index + 1}`, canvas.width / 2, canvas.height / 2 + 60);
        
        ctx.font = '36px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fillText('Watch it shatter automatically', canvas.width / 2, canvas.height / 2 + 130);
      }
      
      return canvas.toDataURL('image/jpeg', 0.9);
    };
    
    const dummyImages = [
      generateImage(0, '#ff6b00', '#ff8c00', 'ZOLAR'),
      generateImage(1, '#8b5cf6', '#6366f1', 'FASHION'),
      generateImage(2, '#ec4899', '#f43f5e', 'STYLE'),
      generateImage(3, '#14b8a6', '#06b6d4', 'LUXURY'),
    ];
    
    setImages(dummyImages);
  }, []);
  
  // Auto trigger shatter after interval
  useEffect(() => {
    if (!isClient || images.length === 0) return;
    
    const timer = setTimeout(() => {
      setTriggerShatter(true);
    }, interval * 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, interval, isClient, images.length]);
  
  const handleShatterComplete = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTriggerShatter(false);
    setKey((prev) => prev + 1);
  };
  
  if (!isClient || images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl animate-pulse">Generating images...</div>
      </div>
    );
  }
  
  const currentImage = images[currentIndex];
  const nextImage = images[(currentIndex + 1) % images.length];
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Auto Shatter Carousel
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
              Watch as each image automatically shatters into glass pieces and transforms into the next
            </p>
            
            <div className="flex gap-4 justify-center lg:justify-start mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                Learn More
              </button>
            </div>
            
            {/* Progress Dots */}
            <div className="flex gap-3 justify-center lg:justify-start mt-8">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-16 bg-orange-500' 
                      : 'w-8 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* 3D Canvas */}
          <div className="relative h-[500px] lg:h-[600px] w-full">
            <div key={key} className="absolute inset-0">
              <Canvas
                className="w-full h-full"
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: 'high-performance',
                }}
              >
                <Scene 
                  currentImageUrl={currentImage}
                  nextImageUrl={nextImage}
                  triggerShatter={triggerShatter}
                  onShatterComplete={handleShatterComplete}
                />
              </Canvas>
            </div>
            
            {/* Status */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm pointer-events-none">
              <span className={triggerShatter ? 'text-red-400' : 'animate-pulse'}>
                {triggerShatter ? '💥 Shattering...' : `⏱️ Next shatter in ${interval}s`}
              </span>
            </div>
            
            {/* Counter */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm pointer-events-none">
              <div className="font-mono">Image {currentIndex + 1} of {images.length}</div>
            </div>
            
            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 px-4 py-2 rounded-lg text-white text-xs pointer-events-none max-w-xs">
              <div className="font-semibold mb-1">✨ No Mouse Needed!</div>
              <div className="text-orange-200">Just watch - images shatter automatically every 5 seconds</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
    </section>
  );
}

