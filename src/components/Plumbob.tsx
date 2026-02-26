import React from 'react';

export const Plumbob: React.FC = () => {
  return (
    <div className="plumbob-container relative w-64 h-64 flex items-center justify-center grayscale contrast-125">
      <div className="plumbob-shape relative w-28 h-56">
        {/* Upper Pyramid */}
        <div 
          className="absolute top-0 left-0 w-full h-1/2" 
          style={{ 
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: 'linear-gradient(135deg, #e5e5e5 0%, #a3a3a3 100%)',
            opacity: 0.95
          }} 
        />
        <div 
          className="absolute top-0 left-0 w-full h-1/2" 
          style={{ 
            clipPath: 'polygon(50% 0%, 50% 100%, 100% 100%)',
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%)',
            opacity: 0.7,
            mixBlendMode: 'overlay'
          }} 
        />
        
        {/* Lower Pyramid */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1/2" 
          style={{ 
            clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
            background: 'linear-gradient(135deg, #737373 0%, #525252 100%)',
            opacity: 0.95
          }} 
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-1/2" 
          style={{ 
            clipPath: 'polygon(50% 0%, 50% 100%, 100% 0%)',
            background: 'linear-gradient(135deg, #a3a3a3 0%, #737373 100%)',
            opacity: 0.7,
            mixBlendMode: 'overlay'
          }} 
        />
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/15 blur-md rounded-full pointer-events-none" />
      </div>
      
      {/* Shadow/Reflections at the bottom */}
      <div className="absolute bottom-[-50px] w-32 h-8 border border-white/10 rounded-[100%] transform rotate-x-60 bg-white/5 blur-[1px]" />
      <div className="absolute bottom-[-50px] w-32 h-8 rounded-[100%] transform rotate-x-60 bg-white/5 blur-xl" />
    </div>
  );
};
