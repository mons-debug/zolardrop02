"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localIsHovering, setLocalIsHovering] = useState(false);

  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const [touchPosition, setTouchPosition] = useState({ x: 100, y: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setTouchPosition({ x, y });
    }
  };

  // Determine if we should use mouse or touch position
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCurrentPosition = () => {
    if (isStatic) return position;
    // Use touch position on mobile, mouse position on desktop
    return isMobile ? touchPosition : mousePosition;
  };

  const currentPosition = getCurrentPosition();

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg z-20"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => {
        setIsHovering(true);
      }}
      onTouchEnd={() => setIsHovering(false)}
      onTouchMove={handleTouchMove}
    >
      {children}

      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${position.x}px ${position.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${position.x}px ${position.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                    currentPosition.x
                  }px ${currentPosition.y}px, black 100%, transparent 100%)`,
                  WebkitMaskImage: `radial-gradient(circle ${
                    lensSize / 2
                  }px at ${currentPosition.x}px ${
                    currentPosition.y
                  }px, black 100%, transparent 100%)`,
                  transformOrigin: `${currentPosition.x}px ${currentPosition.y}px`,
                  zIndex: 50,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: `${currentPosition.x}px ${currentPosition.y}px`,
                  }}
                >
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

