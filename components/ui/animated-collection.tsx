"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isPaused, setIsPaused] = useState(false);
  const [isOverArrowButton, setIsOverArrowButton] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const arrowButtonRef = useRef<HTMLAnchorElement | null>(null);
  const images = collection.images.length > 0 ? collection.images : ['/placeholder.jpg'];

  // Alternate layout: even index = image left, odd index = image right
  const isEven = index % 2 === 0;

  const advanceSlide = useCallback(
    (direction: number) => {
      setActive((prev) => (prev + direction + images.length) % images.length);
    },
    [images.length]
  );

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  }, []);

  const handleManualNext = useCallback(() => {
    pauseAutoplay();
    advanceSlide(1);
  }, [advanceSlide, pauseAutoplay]);

  const handleManualPrev = useCallback(() => {
    pauseAutoplay();
    advanceSlide(-1);
  }, [advanceSlide, pauseAutoplay]);

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (!autoplay || images.length <= 1 || isPaused) return;

    autoplayIntervalRef.current = setInterval(() => {
      advanceSlide(1);
    }, 5000);

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
    }
    };
  }, [autoplay, images.length, isPaused, advanceSlide]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, []);

  const getStackState = (cardIndex: number) => {
    if (cardIndex === active) return "current";
    if ((active + 1) % images.length === cardIndex) return "next";
    if ((active - 1 + images.length) % images.length === cardIndex) return "previous";
    return "rest";
  };

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2">
        {/* Image Stack */}
        <div className={isEven ? "order-2 md:order-1" : "order-2 md:order-2"}>
          <div
            className="relative h-96 md:h-[500px] w-full max-w-md mx-auto"
            style={{ perspective: "1200px" }}
          >
            <AnimatePresence>
              {images.map((image, index) => {
                const stackState = getStackState(index);
                const isCurrent = stackState === "current";
                const isNext = stackState === "next";
                const isPrev = stackState === "previous";

                return (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    z: -100,
                  }}
                  animate={{
                    opacity:
                      stackState === "rest" ? 0 : stackState === "current" ? 1 : 0.65,
                    scale: isCurrent ? 1 : 0.94,
                    z: isCurrent ? 80 : isNext ? 20 : isPrev ? 20 : -60,
                    zIndex: isCurrent ? 50 : isNext || isPrev ? 30 : 10,
                    x: isNext ? 32 : isPrev ? -32 : 0,
                    y: isCurrent ? [0, -18, 0] : 28,
                    rotateY: isNext ? -6 : isPrev ? 6 : 0,
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
                  style={{ transformStyle: "preserve-3d", pointerEvents: isCurrent ? "auto" : "none" }}
                  onMouseEnter={pauseAutoplay}
                  onTouchStart={pauseAutoplay}
                  drag={isCurrent && !isOverArrowButton ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  dragPropagation={false}
                  onDragStart={(event, info) => {
                    const target = event.target as HTMLElement;
                    if (arrowButtonRef.current && arrowButtonRef.current.contains(target)) {
                      return false;
                    }
                    if (target.closest('a[href]')) {
                      return false;
                    }
                    pauseAutoplay();
                  }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) < 40) return;
                    if (info.offset.x < -40) {
                      handleManualNext();
                    } else if (info.offset.x > 40) {
                      handleManualPrev();
                    }
                  }}
                >
                  <div
                    className="relative h-full w-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Image
                      src={image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    {/* Arrow button - Mobile only */}
                    {isCurrent && (
                      <div 
                        className="md:hidden absolute bottom-0 right-0 w-20 h-20 z-[60]"
                        onMouseEnter={() => setIsOverArrowButton(true)}
                        onMouseLeave={() => setIsOverArrowButton(false)}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <a
                          ref={arrowButtonRef}
                          href={collection.link}
                          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-all duration-300 hover:bg-orange-500 hover:text-white cursor-pointer z-[70]"
                          aria-label={`View ${collection.title} collection`}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            window.location.href = collection.link;
                          }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                          onTouchStart={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <IconArrowRight className="h-5 w-5 pointer-events-none" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Desktop only */}
          <div className="hidden md:flex gap-4 justify-center mt-10 md:mt-12 md:justify-start">
            <button
              onClick={handleManualPrev}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-black hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
              aria-label="Previous image"
            >
              <IconArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={handleManualNext}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-black hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
              aria-label="Next image"
            >
              <IconArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile: EXPLORE COLLECTION button centered */}
          <div className="flex justify-center mt-12 md:hidden">
            <a
              href={collection.link}
              className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] hover:bg-orange-500 transition-colors rounded-none"
            >
              EXPLORE COLLECTION
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Content - Static, no animation */}
        <div className={isEven ? "flex flex-col justify-center py-4 order-1 md:order-2" : "flex flex-col justify-center py-4 order-1 md:order-1"}>
          <div>
            {/* Subtitle + Accent to mirror reference */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[11px] tracking-[0.45em] uppercase text-orange-500 font-semibold">
                NEW RELEASE
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-gray-400 to-transparent" />
            </div>

            <h3 className="text-4xl sm:text-5xl lg:text-[64px] font-light uppercase tracking-[0.15em] text-black mb-5">
              {collection.title}
            </h3>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-xl font-light">
              {collection.description}
            </p>

            <a
              href={collection.link}
              className="hidden md:inline-flex items-center gap-3 px-8 py-3 bg-black text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] hover:bg-orange-500 transition-colors rounded-none"
            >
              EXPLORE COLLECTION
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

