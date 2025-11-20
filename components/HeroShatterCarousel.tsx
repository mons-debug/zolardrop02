'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
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

interface ShatteredImageProps {
  imageUrl: string;
  gridSize?: number;
  onShatterComplete?: () => void;
  triggerShatter: boolean;
}

// ============================================================================
// 3D SHATTERED IMAGE COMPONENT
// ============================================================================

const ShatteredImage: React.FC<ShatteredImageProps> = ({
  imageUrl,
  gridSize = 15,
  onShatterComplete,
  triggerShatter,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isShattered, setIsShattered] = useState(false);
  const [shards, setShards] = useState<ShardData[]>([]);
  const shatterTimeRef = useRef(0);
  
  const { viewport, camera, size } = useThree();
  
  // Load texture
  const texture = useTexture(imageUrl);
  
  // Calculate shards once when shattering begins
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
          
          const distFromCenter = Math.sqrt(x * x + y * y);
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
  
  // Trigger shatter effect automatically
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
          opacity: Math.max(0, shard.opacity - delta * 0.8),
        }))
      );
      
      // Notify parent when shatter is complete
      if (shatterTimeRef.current > 2 && onShatterComplete) {
        onShatterComplete();
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      {!isShattered ? (
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial 
            map={texture} 
            side={THREE.DoubleSide}
            metalness={0.1}
            roughness={0.3}
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
              <meshPhysicalMaterial
                map={texture}
                transparent
                opacity={shard.opacity}
                side={THREE.DoubleSide}
                metalness={0.2}
                roughness={0.1}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                reflectivity={0.9}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ============================================================================
// 3D SCENE CONTAINER
// ============================================================================

const Scene: React.FC<{ 
  imageUrl: string;
  triggerShatter: boolean;
  onShatterComplete: () => void;
}> = ({ imageUrl, triggerShatter, onShatterComplete }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ff6b00" />
      <spotLight position={[0, 5, 3]} angle={0.3} penumbra={1} intensity={0.8} />
      
      <ShatteredImage
        imageUrl={imageUrl}
        gridSize={15}
        triggerShatter={triggerShatter}
        onShatterComplete={onShatterComplete}
      />
    </>
  );
};

// ============================================================================
// MAIN HERO CAROUSEL COMPONENT
// ============================================================================

interface HeroShatterCarouselProps {
  images: string[];
  interval?: number; // Time before shatter (in seconds)
  title?: string;
  subtitle?: string;
  className?: string;
}

const HeroShatterCarousel: React.FC<HeroShatterCarouselProps> = ({
  images,
  interval = 5,
  title = 'Experience Innovation',
  subtitle = 'Watch the images shatter and transform',
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerShatter, setTriggerShatter] = useState(false);
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Start shatter after interval
    const shatterTimer = setTimeout(() => {
      setTriggerShatter(true);
    }, interval * 1000);
    
    return () => clearTimeout(shatterTimer);
  }, [currentIndex, interval, isClient]);
  
  const handleShatterComplete = () => {
    // Move to next image
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTriggerShatter(false);
    setKey((prev) => prev + 1); // Force remount
  };
  
  const currentImage = images[currentIndex];
  const nextImage = images[(currentIndex + 1) % images.length];
  
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content - Left Side */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
              {subtitle}
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex gap-4 justify-center lg:justify-start mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                Learn More
              </button>
            </div>
            
            {/* Image Counter */}
            <div className="flex gap-2 justify-center lg:justify-start mt-8">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-12 bg-orange-500' 
                      : 'w-8 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* 3D Interactive Image - Right Side */}
          <div className="relative h-[500px] lg:h-[600px] w-full">
            {isClient && (
              <div className="w-full h-full relative">
                {/* Current shattering image */}
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
                      imageUrl={currentImage} 
                      triggerShatter={triggerShatter}
                      onShatterComplete={handleShatterComplete}
                    />
                  </Canvas>
                </div>
              </div>
            )}
            
            {/* Status Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm pointer-events-none">
              <span className="animate-pulse">
                {triggerShatter ? '💥 Shattering...' : `Next shatter in ${interval}s`}
              </span>
            </div>
            
            {/* Image Info */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs pointer-events-none">
              <div>Image {currentIndex + 1} of {images.length}</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
    </section>
  );
};

export default HeroShatterCarousel;

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * USAGE:
 * 
 * import HeroShatterCarousel from '@/components/HeroShatterCarousel';
 * 
 * export default function Home() {
 *   const images = [
 *     '/assets/hero1.jpg',
 *     '/assets/hero2.jpg',
 *     '/assets/hero3.jpg',
 *     '/assets/hero4.jpg',
 *   ];
 * 
 *   return (
 *     <HeroShatterCarousel
 *       images={images}
 *       interval={5}
 *       title="Shattered Beauty"
 *       subtitle="Watch as each moment transforms into the next"
 *     />
 *   );
 * }
 */








