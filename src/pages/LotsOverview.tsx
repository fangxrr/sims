import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronDown, Home, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOTS_DATA } from '../data/lots';
import { WORLDS_DATA } from '../data/worlds';
import { SmartImage } from '../components/SmartImage';



export const LotsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [builtStatus, setBuiltStatus] = useState<string>('Built'); // 'All', 'Built', 'Not Built'

  const filterOptions = useMemo(() => {
    const lots = Object.values(LOTS_DATA);
    const sizes = Array.from(new Set(lots.map(l => l.size))).filter(Boolean).sort();
    const types = Array.from(new Set(lots.flatMap(l => l.type?.split(/[,，]\s*/) || [])))
      .map(t => t.trim())
      .filter(Boolean)
      .sort();
    return { sizes, types };
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedSize('');
    setSelectedTypes([]);
    setBuiltStatus('All');
    setSearchQuery('');
  };

  const filteredLots = useMemo(() => {
    return Object.values(LOTS_DATA).filter(lot => {
      const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = selectedSize ? lot.size === selectedSize : true;
      const lotTypes = lot.type?.split(/[,，]\s*/).map(t => t.trim()) || [];
      const matchesType = selectedTypes.length > 0
        ? selectedTypes.some(type => lotTypes.includes(type))
        : true;
      const matchesBuilt = builtStatus === 'All'
        ? true
        : builtStatus === 'Built'
          ? lot.isBuilt === true
          : lot.isBuilt !== true;
      return matchesSearch && matchesSize && matchesType && matchesBuilt;
    });
  }, [searchQuery, selectedSize, selectedTypes, builtStatus]);

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
            Lots Overview.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-12 overflow-hidden z-10">

          {/* Top Bar: Title, Search, Filter */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <Home size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Lots</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search lots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right: Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-full border transition-all duration-300 ${isFilterOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-white/5 bg-black/20 backdrop-blur-xl"
              >
                <div className="px-4 py-4 md:px-8 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Size Filter */}
                  <div className="relative group max-w-xs">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                      Lot Size
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <option value="">All Sizes</option>
                        {filterOptions.sizes.map(size => (
                          <option key={size} value={size} className="bg-gray-900 text-white">
                            {size}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                        <ChevronDown size={12} />
                      </div>
                    </div>

                    {/* Built Status Filter */}
                    <div className="relative group max-w-xs mt-6">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                        Built Status
                      </label>
                      <div className="relative">
                        <select
                          value={builtStatus}
                          onChange={(e) => setBuiltStatus(e.target.value)}
                          className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <option value="All">All Status</option>
                          <option value="Built" className="bg-gray-900 text-white">Built</option>
                          <option value="Not Built" className="bg-gray-900 text-white">Not Built</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                          <ChevronDown size={12} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                      Lot Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.types.map(type => (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedTypes.includes(type)
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Chips */}
          <AnimatePresence>
            {isFilterOpen && (selectedSize || selectedTypes.length > 0 || builtStatus !== 'All') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-white/5 bg-white/[0.02]"
              >
                <div className="px-4 py-2 md:px-8 md:py-3 flex flex-wrap gap-2">
                  {selectedSize && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={() => setSelectedSize('')}
                      className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                    >
                      <span className="text-white/60 capitalize">Size:</span>
                      <span className="font-medium">{selectedSize}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  )}
                  {builtStatus !== 'All' && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={() => setBuiltStatus('All')}
                      className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                    >
                      <span className="text-white/60 capitalize">Status:</span>
                      <span className="font-medium">{builtStatus}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  )}
                  {selectedTypes.map(type => (
                    <motion.button
                      key={type}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={() => toggleType(type)}
                      className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                    >
                      <span className="text-white/60 capitalize">Type:</span>
                      <span className="font-medium">{type}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-white/40 hover:text-white ml-2 transition-colors underline decoration-white/20 hover:decoration-white"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - Scrollable Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                {(selectedSize || selectedTypes.length > 0 || builtStatus !== 'All') ? 'Filtered Lots' : 'All Lots'}
              </h3>
              <span className="text-xs text-white/40">{filteredLots.length} Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredLots.map((lot, index) => (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/lots/${lot.id}`)}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-white/5 group-hover:scale-[1.02]">
                    <SmartImage
                      src={lot.image}
                      alt={lot.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Size Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {lot.size}
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors truncate">
                      {lot.chineseName || lot.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider font-medium truncate">
                        <Globe size={12} />
                        <span className="capitalize">{WORLDS_DATA[lot.worldId]?.chineseName || lot.worldId.replace(/-/g, ' ')}</span>
                      </div>
                      <span className="w-0.5 h-0.5 rounded-full bg-white/20"></span>
                      <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider font-medium overflow-hidden">
                        {(lot.type || 'Residential').split(/[,，]\s*/).map((type, idx) => (
                          <span key={idx} className="shrink-0">{type.trim()}{idx < (lot.type || 'Residential').split(/[,，]\s*/).length - 1 ? ' • ' : ''}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredLots.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                  <Home size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">No lots found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-xs text-white/60 hover:text-white underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
