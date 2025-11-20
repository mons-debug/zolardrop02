'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HeroShatterCarousel = dynamic(() => import('@/components/HeroShatterCarousel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-2xl animate-pulse">Loading Shatter Carousel...</div>
    </div>
  ),
});

export default function ShatterCarouselPage() {
  // Real fashion images downloaded from Unsplash
  const images = [
    '/assets/hero1.jpg',
    '/assets/hero2.jpg',
    '/assets/hero3.jpg',
    '/assets/hero4.jpg',
  ];
  
  return (
    <main className="bg-black">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <HeroShatterCarousel
          images={images}
          interval={5}
          title="Zolar Fashion"
          subtitle="Watch as each moment shatters into the next"
        />
      </Suspense>
      
      {/* Additional Content Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Breaking Boundaries
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience fashion through the lens of innovation. Every transition tells a story.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-400">
                Each piece crafted with attention to detail and uncompromising quality standards.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Innovative Design
              </h3>
              <p className="text-gray-400">
                Pushing the boundaries of fashion with cutting-edge designs and technology.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Unique Experience
              </h3>
              <p className="text-gray-400">
                More than fashion - it's an immersive journey through style and innovation.
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-3xl p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Explore?
              </h3>
              <p className="text-gray-300 mb-8 text-lg">
                Discover our full collection and experience fashion that breaks the mold.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/50">
                  Shop Collection
                </button>
                <button className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Showcase */}
      <section className="bg-gray-900 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Why This Effect?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/assets/hero1.jpg" 
                alt="Fashion" 
                className="rounded-2xl shadow-2xl shadow-orange-500/20"
              />
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Memorable Experience</h3>
                  <p className="text-gray-400">
                    The shatter effect creates an unforgettable first impression that visitors remember.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Increased Engagement</h3>
                  <p className="text-gray-400">
                    Users stay longer to watch the full cycle of transformations.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Brand Differentiation</h3>
                  <p className="text-gray-400">
                    Stand out from competitors with cutting-edge 3D web technology.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Performance Optimized</h3>
                  <p className="text-gray-400">
                    Built with React Three Fiber for smooth 60fps animations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}







