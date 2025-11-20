'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the HeroShatter component with no SSR
const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-2xl animate-pulse">Loading 3D Experience...</div>
    </div>
  ),
});

export default function ShatterDemoPage() {
  return (
    <main className="bg-black">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <HeroShatter
          imageUrl="/assets/hero-image.jpg"
          title="Shattered Glass Effect"
          subtitle="Move your cursor close to the image to trigger the interactive glass-shattering animation"
        />
      </Suspense>
      
      {/* Additional Information Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">01</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Proximity Detection
              </h3>
              <p className="text-gray-400">
                The component tracks your cursor position in real-time and calculates the distance to the image center.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">02</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Progressive Fracture
              </h3>
              <p className="text-gray-400">
                As your cursor gets closer, the image begins to show stress fractures and displacement effects.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">03</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Full Shatter
              </h3>
              <p className="text-gray-400">
                When you get very close or hover over the image, it explodes into realistic glass shards with physics.
              </p>
            </div>
          </div>
          
          {/* Technical Details */}
          <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-blue-500/10 p-8 rounded-2xl border border-orange-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Technical Implementation
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">▸</span>
                <span><strong>React Three Fiber:</strong> Powerful 3D rendering with React declarative approach</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">▸</span>
                <span><strong>Custom Shaders:</strong> GLSL shaders for realistic fracture effects and stress visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">▸</span>
                <span><strong>Physics Simulation:</strong> Gravity and velocity calculations for realistic shard movement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">▸</span>
                <span><strong>MeshPhysicalMaterial:</strong> Glass-like reflections and transparency for authentic appearance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">▸</span>
                <span><strong>Performance Optimized:</strong> Efficient rendering with configurable detail levels</span>
              </li>
            </ul>
          </div>
          
          {/* Code Example */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">
              Usage Example
            </h3>
            <div className="bg-gray-900/90 p-6 rounded-xl border border-gray-700 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{`import HeroShatter from '@/components/HeroShatter';

export default function Home() {
  return (
    <HeroShatter
      imageUrl="/assets/your-image.jpg"
      title="Your Title"
      subtitle="Your subtitle"
      proximityThreshold={250}
      shatterThreshold={120}
      gridSize={15}
    />
  );
}`}</code>
              </pre>
            </div>
          </div>
          
          {/* Customization Options */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">
              Customization Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-orange-500 font-semibold">Prop</th>
                    <th className="py-3 px-4 text-orange-500 font-semibold">Type</th>
                    <th className="py-3 px-4 text-orange-500 font-semibold">Default</th>
                    <th className="py-3 px-4 text-orange-500 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">imageUrl</td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4 font-mono text-sm">"/assets/hero-image.jpg"</td>
                    <td className="py-3 px-4">Path to the hero image</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">proximityThreshold</td>
                    <td className="py-3 px-4">number</td>
                    <td className="py-3 px-4">250</td>
                    <td className="py-3 px-4">Distance at which fracturing begins</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">shatterThreshold</td>
                    <td className="py-3 px-4">number</td>
                    <td className="py-3 px-4">120</td>
                    <td className="py-3 px-4">Distance at which full shatter occurs</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">gridSize</td>
                    <td className="py-3 px-4">number</td>
                    <td className="py-3 px-4">15</td>
                    <td className="py-3 px-4">Number of shards (10-20 recommended)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-sm">title</td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4 font-mono text-sm">"Experience Innovation"</td>
                    <td className="py-3 px-4">Hero section title</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}







