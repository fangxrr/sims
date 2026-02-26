import React from 'react';
import { 
  Globe, 
  Home, 
  Users, 
  User, 
  Palette, 
  ClipboardList, 
  Search, 
  LayoutGrid 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  isActive?: boolean;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, path, isActive }) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => path && navigate(path)}
      className={`group relative flex flex-col items-center justify-center w-7 h-7 sm:w-11 sm:h-11 shrink-0 rounded-full border transition-all duration-300 hover:scale-115 hover:-translate-y-2 
        ${isActive 
          ? 'bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/15 hover:border-white/30'
        }`}
    >
      {icon}
      <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] tracking-wider uppercase text-white bg-black/80 px-2 py-1 rounded border border-white/10 backdrop-blur-md whitespace-nowrap pointer-events-none">
        {label}
      </span>
      {isActive && (
        <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]"></span>
      )}
    </button>
  );
};

export const Dock: React.FC = () => {
  const location = useLocation();
  const scrollRef = useDraggableScroll<HTMLDivElement>();

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-[95vw] glass-dock rounded-full">
      <div 
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-3 rounded-full"
      >
        <DockItem 
          icon={<Globe className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Worlds" 
          path="/worlds" 
          isActive={location.pathname === '/worlds'}
        />
        <DockItem 
          icon={<Home className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Lots" 
          path="/lots" 
          isActive={location.pathname === '/lots'}
        />
        <DockItem 
          icon={<Users className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Families" 
          path="/families"
          isActive={location.pathname === '/families'}
        />
        <DockItem 
          icon={<User className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Sims" 
          path="/sims"
          isActive={location.pathname === '/sims'}
        />
        
        <div className="w-[1px] h-4 sm:h-6 bg-white/10 mx-0.5 sm:mx-1 shrink-0" />
        
        <DockItem 
          icon={<Palette className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Creators" 
          path="/creators"
          isActive={location.pathname === '/creators'}
        />
        <DockItem 
          icon={<ClipboardList className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Trackers" 
          path="/tracker"
          isActive={location.pathname === '/tracker'}
        />
        <DockItem 
          icon={<Search className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Finders" 
          path="/finders"
          isActive={location.pathname === '/finders'}
        />
        <DockItem 
          icon={<LayoutGrid className="w-3 h-3 sm:w-5 sm:h-5" />} 
          label="Gallery" 
          path="/gallery"
          isActive={location.pathname === '/gallery'}
        />
      </div>
    </div>
  );
};
