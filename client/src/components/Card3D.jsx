import React, { useState, useRef } from 'react';

/**
 * Interactive 3D Tilt Card Component
 * Adds realistic 3D perspective rotation and specular glare on mouse move.
 */
export default function Card3D({ children, className = '', depth = 20, maxTilt = 8 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX,
      glareY,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      x: 0,
      y: 0,
      glareX: 50,
      glareY: 50,
      opacity: 0
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
        style={{
          opacity: tilt.opacity,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Card Content with 3D Depth */}
      <div
        style={{
          transform: `translateZ(${depth}px)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  );
}
