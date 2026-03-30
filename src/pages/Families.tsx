import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronDown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FAMILIES_DATA } from '../data/families';
import { WORLDS_DATA } from '../data/worlds';
import type { Family } from '../types/schemas';
import { SmartImage } from '../components/SmartImage';



export const Families: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState<string>('');
  const [housingStatus, setHousingStatus] = useState<string>('All');

  const worlds = useMemo(() => {
    return Array.from(new Set(Object.values(FAMILIES_DATA).map(f => f.world))).filter(Boolean).sort();
  }, []);

  const filteredFamilies = useMemo(() => {
    return Object.values(FAMILIES_DATA).filter(family => {
      if (!family) return false;
      const name = family.chineseName || family.name || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWorld = selectedWorld ? family.world === selectedWorld : true;
      const matchesHousing = housingStatus === 'All'
        ? true
        : housingStatus === 'Housed'
          ? !!family.lotId
          : !family.lotId;
      return matchesSearch && matchesWorld && matchesHousing;
    });
  }, [searchQuery, selectedWorld, housingStatus]);



  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pb-20 md:px-12 md:pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full overflow-hidden flex flex-col relative group"
      >
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>

        <div className="flex-1 flex flex-col overflow-hidden z-10">
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <Users size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Families</h1>
            </div>

            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search families..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-full border transition-all duration-300 ${isFilterOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <Filter size={16} />
            </button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-white/5 bg-black/20 backdrop-blur-xl"
              >
                <div className="px-4 py-4 md:px-8 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">World</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedWorld('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedWorld === '' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}
                      >
                        All Worlds
                      </button>
                      {worlds.map(world => (
                        <button
                          key={world}
                          onClick={() => setSelectedWorld(world)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedWorld === world ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                          {world}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">Housing Status</span>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Housed', 'Homeless'].map(status => (
                        <button
                          key={status}
                          onClick={() => setHousingStatus(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${housingStatus === status ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFilterOpen && (selectedWorld || housingStatus !== 'All') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-white/5 bg-white/[0.02]"
              >
                <div className="px-4 py-2 md:px-8 md:py-3 flex flex-wrap gap-2">
                  {selectedWorld && (
                    <motion.button onClick={() => setSelectedWorld('')} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group">
                      <span className="text-white/60 capitalize">World:</span>
                      <span className="font-medium">{selectedWorld}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  )}
                  {housingStatus !== 'All' && (
                    <motion.button onClick={() => setHousingStatus('All')} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group">
                      <span className="text-white/60 capitalize">Housing:</span>
                      <span className="font-medium">{housingStatus}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  )}
                  <button onClick={() => { setSelectedWorld(''); setHousingStatus('All'); }} className="text-xs text-white/40 hover:text-white ml-2 transition-colors underline decoration-white/20 hover:decoration-white">Clear all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                {selectedWorld || housingStatus !== 'All' || searchQuery ? 'Filtered Families' : 'All Families'}
              </h3>
              <span className="text-xs text-white/40">{filteredFamilies.length} Families</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredFamilies.map((family, index) => (
                <motion.div
                  key={family.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/families/${family.id}`)}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-white/5">
                    <SmartImage src={family.image} alt={family.name || family.chineseName || 'Unknown Family'} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors truncate">{family.chineseName || family.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{family.members?.length || 0} Members</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredFamilies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-white/30">
                <Users size={48} strokeWidth={1} className="mb-4 opacity-50" />
                <p className="text-sm">No families found matching your criteria.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedWorld(''); setHousingStatus('All'); }} className="mt-4 text-xs text-white/60 hover:text-white underline">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
};
