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
}: {
  collection: Collection;
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const images = collection.images.length > 0 ? collection.images : ['/placeholder.jpg'];

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
        <div className="order-2 md:order-1">
          <div className="relative h-96 md:h-[500px] w-full max-w-md mx-auto">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : images.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white border border-gray-200">
                    <Image
                      src={image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Desktop (side) / Mobile (bottom) */}
          <div className="flex gap-4 justify-center mt-6 md:justify-start">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-colors"
              aria-label="Previous image"
            >
              <IconArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:rotate-12" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-colors"
              aria-label="Next image"
            >
              <IconArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:-rotate-12" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center py-4 order-1 md:order-2">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
                {collection.subtitle}
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-gray-300 to-transparent" />
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black mb-6 leading-[0.9]">
              {collection.title}
            </h3>

            <motion.p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-8">
              {collection.description.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>

            <a
              href={collection.link}
              className="inline-block px-8 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Explore Collection
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

