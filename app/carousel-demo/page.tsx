'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

const HeroShatterCarousel = dynamic(() => import('@/components/HeroShatterCarousel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-2xl animate-pulse">Loading Shatter Carousel...</div>
    </div>
  ),
});

export default function CarouselDemoPage() {
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate placeholder images with data URLs
    const generatePlaceholderImage = (index: number, color1: string, color2: string, text: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decorative circles
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 200 + 50,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 120px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 30;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 80);
        
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText(`Collection ${index + 1}`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.font = '32px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fillText('Watch it shatter and transform', canvas.width / 2, canvas.height / 2 + 120);
      }
      
      return canvas.toDataURL('image/jpeg', 0.9);
    };
    
    // Generate 4 placeholder images with different colors
    const placeholders = [
      generatePlaceholderImage(0, '#ff6b00', '#ff8c00', 'ZOLAR'),
      generatePlaceholderImage(1, '#8b5cf6', '#6366f1', 'FASHION'),
      generatePlaceholderImage(2, '#ec4899', '#f43f5e', 'STYLE'),
      generatePlaceholderImage(3, '#14b8a6', '#06b6d4', 'LUXURY'),
    ];
    
    setImages(placeholders);
  }, []);
  
  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl animate-pulse">Generating images...</div>
      </div>
    );
  }
  
  return (
    <main className="bg-black">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <HeroShatterCarousel
          images={images}
          interval={5}
          title="Shattered Glass Carousel"
          subtitle="Watch as each image automatically shatters into glass pieces and transforms into the next"
        />
      </Suspense>
      
      {/* Information Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Automatic Shatter Transition
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Automatic Timing
              </h3>
              <p className="text-gray-400">
                Each image displays for 5 seconds before automatically shattering into glass pieces.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">💥</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Glass Shatter Effect
              </h3>
              <p className="text-gray-400">
                Realistic physics simulation with glass-like reflections, gravity, and rotation.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Infinite Loop
              </h3>
              <p className="text-gray-400">
                Carousel automatically loops through all images continuously.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-orange-500 text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real Images Support
              </h3>
              <p className="text-gray-400">
                Works with any JPG, PNG, or WebP images from your assets folder.
              </p>
            </div>
          </div>
          
          {/* Usage Instructions */}
          <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 p-8 rounded-2xl border border-orange-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              How to Use with Your Images
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Step 1: Add Your Images</h4>
                <p className="mb-2">Place your images in the public folder:</p>
                <div className="bg-gray-900/90 p-4 rounded-lg font-mono text-sm">
                  /public/assets/hero1.jpg<br/>
                  /public/assets/hero2.jpg<br/>
                  /public/assets/hero3.jpg<br/>
                  /public/assets/hero4.jpg
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Step 2: Use the Component</h4>
                <div className="bg-gray-900/90 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-300"><code>{`import HeroShatterCarousel from '@/components/HeroShatterCarousel';

export default function Home() {
  const images = [
    '/assets/hero1.jpg',
    '/assets/hero2.jpg',
    '/assets/hero3.jpg',
    '/assets/hero4.jpg',
  ];
  
  return (
    <HeroShatterCarousel
      images={images}
      interval={5}
      title="Your Title"
      subtitle="Your subtitle"
    />
  );
}`}</code></pre>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Step 3: Customize</h4>
                <div className="bg-gray-900/90 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-orange-500">Prop</th>
                        <th className="text-left py-2 text-orange-500">Description</th>
                        <th className="text-left py-2 text-orange-500">Default</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-800">
                        <td className="py-2 font-mono">images</td>
                        <td className="py-2">Array of image URLs</td>
                        <td className="py-2">Required</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 font-mono">interval</td>
                        <td className="py-2">Seconds before shatter</td>
                        <td className="py-2">5</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 font-mono">title</td>
                        <td className="py-2">Hero title text</td>
                        <td className="py-2">"Experience Innovation"</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">subtitle</td>
                        <td className="py-2">Hero subtitle text</td>
                        <td className="py-2">"Watch the images..."</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-green-400 mb-3">✅ Best Practices</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Use high-quality images (1920×1080 or larger)</li>
                <li>• Keep file sizes under 500KB for best performance</li>
                <li>• Use 3-5 images for optimal timing</li>
                <li>• Images with centered subjects work best</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">💡 Pro Tips</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Adjust interval (3-7 seconds recommended)</li>
                <li>• Use consistent aspect ratio images</li>
                <li>• Test on mobile for performance</li>
                <li>• Reduce gridSize for better mobile FPS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}







