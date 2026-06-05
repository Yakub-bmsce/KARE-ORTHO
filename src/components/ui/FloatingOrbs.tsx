'use client';

import React from 'react';

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Teal Orb */}
      <div className="absolute top-[15%] left-[5%] md:left-[10%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-radial from-[rgba(0,201,167,0.18)] to-transparent blur-[60px] md:blur-[90px] animate-float-orb" />
      
      {/* Electric Blue Orb */}
      <div className="absolute bottom-[20%] right-[5%] md:right-[10%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-radial from-[rgba(26,143,255,0.18)] to-transparent blur-[70px] md:blur-[100px] animate-float-orb-slow" />

      {/* Extra glow behind hero content */}
      <div className="absolute top-[5%] right-[20%] w-[250px] h-[250px] rounded-full bg-radial from-[rgba(0,201,167,0.08)] to-transparent blur-[50px]" />
    </div>
  );
}
