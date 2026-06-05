'use client';

import React, { useRef, useState } from 'react';

export function DoctorCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Calculate rotation angles (max tilt angle of 15 degrees)
    const factorX = 15 / (box.height / 2);
    const factorY = 15 / (box.width / 2);
    
    setRotate({
      x: -y * factorX,
      y: x * factorY,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const photoUrl = "/doctor-profile.jpg";

  return (
    <div className="animate-float-card w-full flex justify-center">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: rotate.x === 0 && rotate.y === 0 ? 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[320px] h-[440px] rounded-[24px] bg-[#0b1528] border border-white/5 shadow-2xl flex flex-col justify-between p-5 group cursor-pointer transition-shadow hover:shadow-[0_20px_50px_rgba(0,201,167,0.15)]"
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00c9a7] to-[#1a8fff] transition-all duration-300 group-hover:h-[6px]" />
        
        {/* Inner glow overlay */}
        <div 
          style={{ transform: 'translateZ(20px)' }}
          className="absolute inset-0 bg-gradient-to-b from-[#00c9a7]/5 to-[#1a8fff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" 
        />
        
        {/* Image Container with 3D Pop */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="relative w-full h-[230px] rounded-xl overflow-hidden border border-white/10 group-hover:border-accent-teal/40 transition-colors duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={photoUrl} 
            alt="Dr. Ajay N" 
            className="w-full h-full object-cover object-[center_22%]"
            onError={(e) => {
              // Fallback to local image or generic avatar if url fails
              (e.target as HTMLImageElement).src = "/dr-ajay-treat.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528] via-transparent to-transparent opacity-80" />
          
          {/* Experience Overlay */}
          <div className="absolute bottom-2 left-3 bg-[#00c9a7] text-[#050e1f] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Arthroscopic Surgeon
          </div>
        </div>
        
        {/* Doctor Name & Title */}
        <div 
          style={{ transform: 'translateZ(40px)' }}
          className="flex flex-col mt-2"
        >
          <h3 className="font-serif text-2xl font-bold text-white group-hover:text-accent-teal transition-colors duration-300">
            Dr. Ajay N
          </h3>
          <p className="text-white/60 text-xs mt-1">
            Orthopaedic & Joint Replacement Surgeon
          </p>
        </div>

        {/* Badges row */}
        <div 
          style={{ transform: 'translateZ(50px)' }}
          className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5"
        >
          {['MBBS', 'MS', 'DNB Ortho', 'FIJR', 'FASM', 'FIRA (Europe)'].map((badge) => (
            <span 
              key={badge}
              className="text-[9px] font-medium font-sans tracking-wide bg-white/5 border border-white/10 text-accent-teal px-2 py-0.5 rounded-md"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
