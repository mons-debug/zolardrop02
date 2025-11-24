"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

type Collection = {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  link: string;
};

export const AnimatedCollection = ({
  collection,
  autoplay = true,
  index = 0,
}: {
  collection: Collection;
  autoplay?: boolean;
  index?: number;
}) => {
  const [active, setActive] = useState(0);
  const images = collection.images.length > 0 ? collection.images : ['/placeholder.jpg'];
  
  // Alternate layout: even index = image left, odd index = image right
  const isEven = index % 2 === 0;

  const handleNext = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && images.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, images.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2">
        {/* Image Stack */}
        <div className={isEven ? "order-2 md:order-1" : "order-2 md:order-2"}>
          <div className="relative h-96 md:h-[500px] w-full max-w-md mx-auto">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    z: -100,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.92,
                    z: isActive(index) ? 0 : -100,
                    zIndex: isActive(index)
                      ? 40
                      : images.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.85,
                    z: 100,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "reverse",
                    },
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <a 
                    href={collection.link}
                    className="block relative h-full w-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <Image
                      src={image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - More spacing from cards */}
          <div className="flex gap-4 justify-center mt-10 md:mt-12 md:justify-start">
            <button
              onClick={handlePrev}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-black hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
              aria-label="Previous image"
            >
              <IconArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-black hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
              aria-label="Next image"
            >
              <IconArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Content - Static, no animation */}
        <div className={isEven ? "flex flex-col justify-center py-4 order-1 md:order-2" : "flex flex-col justify-center py-4 order-1 md:order-1"}>
          <div>
            {/* Orange Badge */}
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-orange-500 text-white text-xs uppercase tracking-wider font-semibold rounded-full">
                {collection.subtitle}
              </span>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              {collection.title}
            </h3>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
              {collection.description}
            </p>

            <a
              href={collection.link}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-sm font-semibold uppercase tracking-wider hover:bg-orange-600 transition-colors rounded"
            >
              SEE COLLECTIONS
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

