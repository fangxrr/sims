import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORLDS_DATA } from '../data/worlds';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { SmartImage } from '../components/SmartImage';
import { WorldMap } from '../components/WorldMap';

const WORLDS = Object.values(WORLDS_DATA);

const SIZE_ORDER = [
  '64x64', '50x50', '50x40', '40x40', '40x30', '40x20', '30x30', '30x20', '20x20', '20x15', '15x10'
];

export const Worlds: React.FC = () => {
  const [selectedWorldId, setSelectedWorldId] = useState(WORLDS[0].id);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('All');
  const navigate = useNavigate();
  const scrollRef = useDraggableScroll<HTMLDivElement>();

  const availableSizes = useMemo(() => {
    const allSizes = new Set<string>();
    Object.values(WORLDS_DATA).forEach(w => w.sizes?.forEach(s => {
      if (s) allSizes.add(s.replace('×', 'x'));
    }));

    return ['All', ...Array.from(allSizes).sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      const aParts = a.split('x');
      const bParts = b.split('x');
      const aArea = parseInt(aParts[0]) * parseInt(aParts[1] || '0');
      const bArea = parseInt(bParts[0]) * parseInt(bParts[1] || '0');
      return bArea - aArea;
    })];
  }, []);

  const selectedWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];

  // Filter Logic
  const filteredWorlds = selectedSize === 'All'
    ? WORLDS
    : WORLDS.filter(world => world.sizes.includes(selectedSize));

  const isFiltering = selectedSize !== 'All';

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pt-16 pb-20 md:px-12 md:pt-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel w-full h-full rounded-3xl overflow-hidden flex flex-col relative group"
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>

        {/* Window Header */}
        <div className="absolute top-0 left-0 w-full h-12 flex items-center px-5 border-b border-white/5 z-20 bg-white/5 backdrop-blur-md">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
          </div>
          <div className="mx-auto text-[10px] tracking-widest text-white/30 uppercase font-semibold pointer-events-none">
            Worlds Overview.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-12 overflow-hidden z-10">

          {/* Top Bar: Tabs & Filter */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Tabs (Only show when NOT filtering) */}
            {!isFiltering ? (
              <div
                ref={scrollRef}
                className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mask-gradient-right pr-4"
              >
                {WORLDS.map((world) => (
                  <button
                    key={world.id}
                    onClick={() => setSelectedWorldId(world.id)}
                    className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 border whitespace-nowrap shrink-0 ${selectedWorldId === world.id
                      ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {world.chineseName || world.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white tracking-wide">
                  Filtered by Size: <span className="text-white/60">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setSelectedSize('All')}
                  className="ml-4 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white/40"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`ml-4 p-2.5 rounded-full border transition-all duration-300 ${isFilterOpen || isFiltering
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Filter size={16} />
            </button>
          </div>

          {/* Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-black/20 backdrop-blur-xl border-b border-white/5"
              >
                <div className="px-4 py-4 md:px-8 md:py-4 flex items-center gap-6">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Size</span>
                  <div className="flex gap-2 flex-wrap">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded text-[10px] font-medium transition-colors ${selectedSize === size
                          ? 'bg-white/20 text-white'
                          : 'text-white/40 hover:text-white/80'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">

            {/* Conditional Rendering: Spotlight OR Grid */}
            {!isFiltering ? (
              /* Spotlight Section (Default View) */
              <div className="flex flex-col gap-12">
                {/* World Map Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full"
                >
                  <WorldMap />
                </motion.div>

                <div className="w-full h-px bg-white/5"></div>

                <div className="mb-12">
                  <motion.div
                    key={selectedWorld.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row gap-8 items-start"
                  >
                    {/* Spotlight Image */}
                    <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                      <SmartImage
                        src={selectedWorld.image}
                        alt={selectedWorld.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>

                    {/* Spotlight Info */}
                    <div className="flex-1 flex flex-col h-full justify-center pt-4">

                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                        {selectedWorld.chineseName || selectedWorld.name}
                      </h2>
                      {selectedWorld.chineseName && (
                        <h3 className="text-xl text-white/40 mb-4 font-light tracking-wide">
                          {selectedWorld.name}
                        </h3>
                      )}

                      <p className="text-white/60 text-sm leading-relaxed mb-8 font-light">
                        {selectedWorld.description}
                      </p>

                      <button
                        onClick={() => navigate(`/worlds/${selectedWorld.id}`)}
                        className="self-start px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold tracking-wider transition-all flex items-center gap-2 group"
                      >
                        <span>Explore Worlds Details</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Filtered Grid View */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                    Worlds with {selectedSize} Lots
                  </h3>
                  <span className="text-xs text-white/40">{filteredWorlds.length} Found</span>
                </div>

                {filteredWorlds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredWorlds.map((world) => (
                      <motion.div
                        key={world.id}
                        whileHover={{ y: -5 }}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/worlds/${world.id}`)}
                      >
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-white/5 relative mb-3 transition-colors group-hover:border-white/20">
                          <SmartImage
                            src={world.image}
                            alt={world.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="flex flex-col px-1">
                          <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                            {world.chineseName || world.name}
                          </h4>
                          {world.chineseName && (
                            <span className="text-[10px] text-white/40 font-light">
                              {world.name}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-white/30">
                    <MapPin size={48} className="mb-4 opacity-20" />
                    <p>No worlds found with size {selectedSize}</p>
                    <button
                      onClick={() => setSelectedSize('All')}
                      className="mt-4 text-xs text-white/60 hover:text-white underline"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </main>
  );
};
