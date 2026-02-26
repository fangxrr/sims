import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dock } from './Dock';
import { DataManager } from './DataManager';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <div className="os-background h-screen w-screen relative overflow-hidden">
      {/* Overlay for background darkening */}
      <div className="absolute inset-0 bg-[#050505]/60 pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-[12px] h-[16px] bg-white opacity-90" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/90">SIMS FILES</span>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-medium tracking-widest uppercase text-white/60">
          {isMainPage ? (
            <DataManager />
          ) : (
            <Link to="/" className="hover:text-white transition-colors duration-300 cursor-pointer">Main</Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <Outlet />

      {/* Dock */}
      <Dock />
    </div>
  );
};
