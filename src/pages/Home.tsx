import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Plumbob } from '../components/Plumbob';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pt-12 sm:pt-16 pb-20 sm:pb-28">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel w-full max-w-5xl h-full md:h-auto max-h-[800px] rounded-3xl overflow-hidden flex flex-col md:flex-row relative group"
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>
        
        {/* Window Header */}
        <div className="absolute top-0 left-0 w-full h-10 sm:h-12 flex items-center px-4 sm:px-5 border-b border-white/5 z-20">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20 border border-white/5"></div>
          </div>
          <div className="mx-auto text-[9px] sm:text-[10px] tracking-widest text-white/30 uppercase font-semibold pointer-events-none">
            Sims Files.exe
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 p-6 sm:p-10 md:p-16 flex flex-col justify-center text-left z-10 pt-14 sm:pt-20">
          <div className="mb-2 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-md shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              online
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white mb-3 sm:mb-6 drop-shadow-lg leading-[0.85]">
            Sul Sul!
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-white/60 font-light max-w-sm leading-relaxed mb-6 sm:mb-10 tracking-wide">
            Welcome to My Sims World.
          </p>
          
          <div className="hidden sm:flex gap-4">
            <button 
              onClick={() => navigate('/worlds')}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3.5 rounded-full font-semibold text-xs tracking-wider transition-all transform hover:scale-105 shadow-xl shadow-white/10 flex items-center gap-2"
            >
              <span>ENTER WORLDS</span>
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => navigate('/lots')}
              className="bg-transparent hover:bg-white/5 text-white border border-white/20 px-8 py-3.5 rounded-full font-medium text-xs tracking-wider transition-all backdrop-blur-sm flex items-center gap-2"
            >
              <span>ENTER LOTS</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Content (Plumbob) */}
        <div className="flex-1 relative min-h-[220px] sm:min-h-[300px] md:min-h-auto flex items-center justify-center overflow-hidden pb-6 sm:pb-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 blur-[60px] sm:blur-[80px] rounded-full"></div>
          <div className="transform scale-75 sm:scale-100">
            <Plumbob />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block absolute top-12 bottom-12 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </motion.div>
    </main>
  );
};
