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
      
      {/* Floating Controls */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {isMainPage ? (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-[10px] font-medium tracking-widest uppercase text-white/60 shadow-lg">
            <DataManager />
          </div>
        ) : (
          <Link to="/" className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] group">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
            MAIN
          </Link>
        )}
      </div>

      {/* Main Content Area */}
      <Outlet />

      {/* Dock */}
      <Dock />
    </div>
  );
};
