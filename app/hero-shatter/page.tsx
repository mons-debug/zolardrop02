'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// TYPES
// ============================================================================

interface ShardData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationVelocity: THREE.Euler;
  vertices: THREE.Vector3[];
  uvs: number[];
  opacity: number;
}

// ============================================================================
// SMOOTH SHATTER LAYER - No remounting, smooth transitions
// ============================================================================

const ShatterLayer: React.FC<{
  images: string[];
  interval: number;
}> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerShatter, setTriggerShatter] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [shards, setShards] = useState<ShardData[]>([]);
  const shatterTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();
  
  const currentTexture = useMemo(() => {
    return new THREE.TextureLoader().load(images[currentIndex]);
  }, [currentIndex, images]);
  
  const nextTexture = useMemo(() => {
    return new THREE.TextureLoader().load(images[(currentIndex + 1) % images.length]);
  }, [currentIndex, images]);
  
  // Modern widescreen dimensions (16:9)
  const width = 6;
  const height = 3.375; // 16:9 ratio
  const gridSize = 15;
  
  // Create shards
  const createShards = () => {
    const newShards: ShardData[] = [];
    const cols = gridSize;
    const rows = Math.floor(gridSize * (height / width));
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
          vertices,
          uvs,
          opacity: 1,
        });
      }
    }
    
    return newShards;
  };
  
  // Auto trigger shatter
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setTriggerShatter(true);
      setIsShattered(true);
      setShards(createShards());
      shatterTimeRef.current = 0;
    }, interval * 1000);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, interval]);
  
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
          opacity: shatterTimeRef.current > 1.5 ? Math.max(0, shard.opacity - delta * 2) : 1,
        }))
      );
      
      // Complete transition smoothly
      if (shatterTimeRef.current > 2.2) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTriggerShatter(false);
        setIsShattered(false);
        setShards([]);
      }
    }
  });
  
  return (
    <group>
      {/* NEXT IMAGE - Always behind */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={nextTexture} side={THREE.DoubleSide} />
      </mesh>
      
      {/* CURRENT IMAGE - Front (or shattered) */}
      {!isShattered ? (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={currentTexture} side={THREE.DoubleSide} />
        </mesh>
      ) : (
        <group>
          {shards.map((shard, index) => (
            <mesh
              key={index}
              position={shard.position}
              rotation={shard.rotation}
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
                map={currentTexture}
                transparent
                opacity={shard.opacity}
                side={THREE.DoubleSide}
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
// SCENE
// ============================================================================

const Scene: React.FC<{ images: string[]; interval: number }> = ({ images, interval }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} />
      
      <ShatterLayer images={images} interval={interval} />
    </>
  );
};

// ============================================================================
// CLEAN HERO SECTION
// ============================================================================

export default function HeroShatterPage() {
  const [images, setImages] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const interval = 5;
  
  useEffect(() => {
    setIsClient(true);
    
    // Generate modern widescreen dummy images
    const generateImage = (index: number, color1: string, color2: string, text: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080; // 16:9
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decorative circles
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 200 + 100,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 160px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 40;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = '64px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 20;
        ctx.fillText(`Collection ${index + 1}`, canvas.width / 2, canvas.height / 2 + 80);
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
  
  if (!isClient || images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-tight">
              Breaking
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                Boundaries
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
              Experience fashion that shatters expectations. Every moment tells a story.
            </p>
            
            <div className="flex gap-4 justify-center lg:justify-start">
              <button className="px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-orange-500/50">
                Explore Collection
              </button>
              <button className="px-10 py-5 border-2 border-white/30 text-white text-lg font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Watch Film
              </button>
            </div>
          </div>
          
          {/* Widescreen 3D Canvas */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <Canvas
                className="w-full h-full"
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: 'high-performance',
                }}
              >
                <Scene images={images} interval={interval} />
              </Canvas>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10" />
          </div>
          
        </div>
      </div>
    </section>
  );
}







