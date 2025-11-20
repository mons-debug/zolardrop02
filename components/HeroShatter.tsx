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

interface ShatteredImageProps {
  imageUrl: string;
  proximityThreshold?: number;
  shatterThreshold?: number;
  gridSize?: number;
  onDistanceChange?: (distance: number) => void;
}

// ============================================================================
// 3D SHATTERED IMAGE COMPONENT
// ============================================================================

const ShatteredImage: React.FC<ShatteredImageProps> = ({
  imageUrl,
  proximityThreshold = 200,
  shatterThreshold = 100,
  gridSize = 20,
  onDistanceChange,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [distance, setDistance] = useState(1000);
  const [isShattered, setIsShattered] = useState(false);
  const [shards, setShards] = useState<ShardData[]>([]);
  
  const { viewport, camera, size } = useThree();
  
  // Create procedural texture
  const activeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ff6b00');
      gradient.addColorStop(0.5, '#ff8c00');
      gradient.addColorStop(1, '#ffa500');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add geometric pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 200 + 50,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      
      // Add brand text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 120px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.fillText('ZOLAR', canvas.width / 2, canvas.height / 2 - 80);
      
      ctx.font = '48px sans-serif';
      ctx.shadowBlur = 10;
      ctx.fillText('Interactive 3D Experience', canvas.width / 2, canvas.height / 2 + 40);
      
      ctx.font = '32px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 5;
      ctx.fillText('Move cursor close to shatter', canvas.width / 2, canvas.height / 2 + 120);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
  
  // Calculate shards once when shattering begins
  const createShards = useMemo(() => {
    return () => {
      const newShards: ShardData[] = [];
      const cols = gridSize;
      const rows = gridSize;
      const width = 4; // Image width in 3D space
      const height = 4; // Image height in 3D space
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Create irregular shard shapes (not perfect rectangles)
          const x = (j * cellWidth) - width / 2 + cellWidth / 2;
          const y = (i * cellHeight) - height / 2 + cellHeight / 2;
          
          // Add randomness to shard positions
          const offsetX = (Math.random() - 0.5) * cellWidth * 0.3;
          const offsetY = (Math.random() - 0.5) * cellHeight * 0.3;
          
          // Create triangular shard vertices for more realistic breaking
          const vertices = [
            new THREE.Vector3(
              x - cellWidth / 2 + offsetX,
              y - cellHeight / 2 + offsetY,
              0
            ),
            new THREE.Vector3(
              x + cellWidth / 2 + offsetX,
              y - cellHeight / 2 + offsetY,
              0
            ),
            new THREE.Vector3(
              x + cellWidth / 2 + offsetX,
              y + cellHeight / 2 + offsetY,
              0
            ),
            new THREE.Vector3(
              x - cellWidth / 2 + offsetX,
              y + cellHeight / 2 + offsetY,
              0
            ),
          ];
          
          // UV coordinates for texture mapping
          const u1 = j / cols;
          const u2 = (j + 1) / cols;
          const v1 = 1 - (i / rows);
          const v2 = 1 - ((i + 1) / rows);
          
          const uvs = [
            u1, v1,
            u2, v1,
            u2, v2,
            u1, v2,
          ];
          
          // Calculate velocity based on distance from center
          const distFromCenter = Math.sqrt(x * x + y * y);
          const angle = Math.atan2(y, x);
          const speed = 2 + Math.random() * 3;
          
          newShards.push({
            position: new THREE.Vector3(x, y, 0),
            velocity: new THREE.Vector3(
              Math.cos(angle) * speed,
              Math.sin(angle) * speed,
              (Math.random() - 0.5) * 2
            ),
            rotation: new THREE.Euler(0, 0, 0),
            rotationVelocity: new THREE.Euler(
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2
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
  
  // Track cursor position and calculate distance
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate simple 2D distance from cursor to canvas center
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      setDistance(dist);
      onDistanceChange?.(dist);
      
      // Also update normalized cursor position for other effects
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setCursorPos({ x, y });
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);
  
  // Trigger shatter effect when cursor is very close
  useEffect(() => {
    if (distance < shatterThreshold && !isShattered) {
      setIsShattered(true);
      setShards(createShards());
    }
  }, [distance, shatterThreshold, isShattered, createShards]);
  
  // Animate shards
  useFrame((state, delta) => {
    if (isShattered && shards.length > 0) {
      setShards((prevShards) =>
        prevShards.map((shard) => ({
          ...shard,
          position: shard.position.clone().add(shard.velocity.clone().multiplyScalar(delta)),
          rotation: new THREE.Euler(
            shard.rotation.x + shard.rotationVelocity.x,
            shard.rotation.y + shard.rotationVelocity.y,
            shard.rotation.z + shard.rotationVelocity.z
          ),
          velocity: shard.velocity.clone().add(new THREE.Vector3(0, -9.8 * delta, 0)), // Gravity
          opacity: Math.max(0, shard.opacity - delta * 0.5),
        }))
      );
    }
  });
  
  // Calculate fracture intensity based on proximity
  const fractureIntensity = useMemo(() => {
    if (isShattered) return 1;
    if (distance > proximityThreshold) return 0;
    return 1 - distance / proximityThreshold;
  }, [distance, proximityThreshold, isShattered]);
  
  return (
    <group ref={groupRef}>
      {!isShattered ? (
        // Main image with proximity fracture effect
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[4, 4, gridSize, gridSize]} />
          <shaderMaterial
            uniforms={{
              uTexture: { value: activeTexture },
              uFractureIntensity: { value: fractureIntensity },
              uTime: { value: 0 },
            }}
            vertexShader={`
              uniform float uFractureIntensity;
              uniform float uTime;
              varying vec2 vUv;
              varying float vDisplacement;
              
              // Simple noise function
              float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
              }
              
              void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Calculate distance from center
                float distFromCenter = length(uv - 0.5);
                
                // Apply fracture displacement
                float displacement = random(uv) * uFractureIntensity * 0.3;
                pos.z += displacement;
                
                // Add slight wave distortion when fractured
                pos.x += sin(uv.y * 20.0 + uTime) * uFractureIntensity * 0.05;
                pos.y += cos(uv.x * 20.0 + uTime) * uFractureIntensity * 0.05;
                
                vDisplacement = displacement;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `}
            fragmentShader={`
              uniform sampler2D uTexture;
              uniform float uFractureIntensity;
              varying vec2 vUv;
              varying float vDisplacement;
              
              void main() {
                vec4 texColor = texture2D(uTexture, vUv);
                
                // Add white stress lines at fracture points
                float stressLines = step(0.15, vDisplacement) * uFractureIntensity;
                vec3 color = mix(texColor.rgb, vec3(1.0), stressLines * 0.5);
                
                // Add slight transparency at fracture points
                float alpha = texColor.a * (1.0 - stressLines * 0.3);
                
                gl_FragColor = vec4(color, alpha);
              }
            `}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        // Render shattered pieces
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
                  array={new Float32Array(
                    shard.vertices.flatMap((v) => [v.x, v.y, v.z])
                  )}
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
                map={activeTexture}
                transparent
                opacity={shard.opacity}
                side={THREE.DoubleSide}
                metalness={0.1}
                roughness={0.1}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                reflectivity={0.9}
                envMapIntensity={1}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Proximity indicator */}
      {distance < proximityThreshold && !isShattered && (
        <>
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[2, 2.2, 32]} />
            <meshBasicMaterial
              color="#ff6b00"
              transparent
              opacity={fractureIntensity * 0.5}
            />
          </mesh>
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[1.5, 1.7, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={fractureIntensity * 0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

// ============================================================================
// 3D SCENE CONTAINER
// ============================================================================

const Scene: React.FC<{ 
  imageUrl: string;
  onDistanceChange?: (distance: number) => void;
}> = ({ imageUrl, onDistanceChange }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ff6b00" />
      
      <ShatteredImage
        imageUrl={imageUrl}
        proximityThreshold={350}
        shatterThreshold={200}
        gridSize={15}
        onDistanceChange={onDistanceChange}
      />
    </>
  );
};

// ============================================================================
// MAIN HERO SECTION COMPONENT
// ============================================================================

interface HeroShatterProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

const HeroShatter: React.FC<HeroShatterProps> = ({
  imageUrl = '/assets/hero-image.jpg',
  title = 'Experience Innovation',
  subtitle = 'Move your cursor close to discover the effect',
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(1000);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black ${className}`}
    >
      {/* Background Elements - Preserve existing design */}
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
                        </div>
          
          {/* 3D Interactive Image - Right Side */}
          <div className="relative h-[500px] lg:h-[600px] w-full">
            {isClient && (
              <Canvas
                className="w-full h-full cursor-pointer"
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: 'high-performance',
                }}
              >
                <Scene imageUrl={imageUrl} onDistanceChange={setCurrentDistance} />
              </Canvas>
            )}
            
            {/* Instruction Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm pointer-events-none">
              <span className="animate-pulse">Move your cursor close to the image</span>
            </div>
            
            {/* Debug Distance Display */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs font-mono pointer-events-none">
              <div>Distance: <span className="text-orange-500">{Math.round(currentDistance)}px</span></div>
              <div>Proximity: <span className="text-green-500">350px</span></div>
              <div>Shatter: <span className="text-red-500">200px</span></div>
              <div className="mt-1 text-yellow-400">
                {currentDistance < 350 ? '⚠ In proximity range!' : ''}
                {currentDistance < 200 ? ' 💥 SHATTER ZONE!' : ''}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
    </section>
  );
};

export default HeroShatter;

// ============================================================================
// USAGE NOTES & SETUP
// ============================================================================

/**
 * INSTALLATION REQUIREMENTS:
 * 
 * npm install three @react-three/fiber @react-three/drei
 * 
 * USAGE EXAMPLE:
 * 
 * import HeroShatter from '@/components/HeroShatter';
 * 
 * export default function Home() {
 *   return (
 *     <HeroShatter
 *       imageUrl="/assets/your-image.jpg"
 *       title="Your Custom Title"
 *       subtitle="Your custom subtitle"
 *     />
 *   );
 * }
 * 
 * CUSTOMIZATION OPTIONS:
 * 
 * - imageUrl: Path to your hero image
 * - proximityThreshold: Distance at which fracturing begins (default: 250)
 * - shatterThreshold: Distance at which full shatter occurs (default: 120)
 * - gridSize: Number of shards (higher = more pieces, default: 15)
 * 
 * PERFORMANCE TIPS:
 * 
 * - Keep gridSize between 10-20 for optimal performance
 * - Use optimized images (WebP format recommended)
 * - Consider lazy loading this component for better initial page load
 * 
 * 3D MODEL PLACEHOLDER:
 * 
 * To use a custom 3D model instead of an image:
 * 1. Import useGLTF from @react-three/drei
 * 2. Load your model: const { scene } = useGLTF('/path/to/model.glb')
 * 3. Replace the <mesh> with <primitive object={scene} />
 */
