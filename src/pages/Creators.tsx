import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronDown, Palette, ExternalLink, Calendar } from 'lucide-react';
import { CREATORS_DATA, Creator } from '../data/creators';
import { SmartImage } from '../components/SmartImage';



export const Creators: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filterOptions: Record<string, string[]> = useMemo(() => {
    // Extract unique types from all creators
    const allTypes = new Set<string>();
    CREATORS_DATA.forEach(c => c.types.forEach(t => allTypes.add(t)));

    const favLevels = new Set(CREATORS_DATA.map(c => c.favLevel));
    const statuses = new Set(CREATORS_DATA.map(c => c.status));

    return {
      type: Array.from(allTypes).sort(),
      favLevel: Array.from(favLevels).filter(Boolean).sort(),
      status: Array.from(statuses).filter(Boolean).sort(),
    };
  }, []);

  // State for storing custom dates
  const [downloadDates, setDownloadDates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('sims-creator-dates');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('sims-creator-dates', JSON.stringify(downloadDates));
  }, [downloadDates]);

  const handleDateChange = (id: string, date: string) => {
    setDownloadDates(prev => ({
      ...prev,
      [id]: date
    }));
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      const newFilters = { ...prev };
      if (newValues.length === 0) {
        delete newFilters[category];
      } else {
        newFilters[category] = newValues;
      }
      return newFilters;
    });
  };

  const clearFilter = (category: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[category];
      return newFilters;
    });
  };

  const filteredCreators = useMemo(() => {
    return CREATORS_DATA.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.types.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilters = (Object.entries(activeFilters) as [string, string[]][]).every(([key, values]) => {
        if (values.length === 0) return true;

        if (key === 'type') {
          return creator.types.some(t => values.includes(t));
        }
        return values.includes((creator as any)[key]);
      });

      return matchesSearch && matchesFilters;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, activeFilters]);

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
            Creators.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-12 overflow-hidden z-10">

          {/* Top Bar: Title, Search, Filter */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <Palette size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Creators</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search creators or types..."
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
                <div className="px-4 py-4 md:px-8 md:py-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="flex flex-col gap-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 ml-1">
                        {category === 'favLevel' ? 'Favorites Level' : category === 'status' ? 'Update Status' : 'Type'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {options.map(option => {
                          const isActive = activeFilters[category]?.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => toggleFilter(category, option)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border ${isActive
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:bg-white/10'
                                }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Chips */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="px-4 py-2 md:px-8 md:py-3 flex flex-wrap gap-2 border-b border-white/5 bg-white/[0.02]">
              {(Object.entries(activeFilters) as [string, string[]][]).map(([category, values]) => (
                <React.Fragment key={category}>
                  {values.map(value => (
                    <motion.button
                      key={`${category}-${value}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={() => toggleFilter(category, value)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                    >
                      <span className="text-white/60 capitalize">{category === 'favLevel' ? 'Fav' : category}:</span>
                      <span className="font-medium">{value}</span>
                      <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                    </motion.button>
                  ))}
                </React.Fragment>
              ))}
              <button
                onClick={() => setActiveFilters({})}
                className="text-xs text-white/40 hover:text-white ml-2 transition-colors underline decoration-white/20 hover:decoration-white"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Main Content - Scrollable Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                {Object.keys(activeFilters).length > 0 ? 'Filtered Creators' : 'All Creators'}
              </h3>
              <span className="text-xs text-white/40">{filteredCreators.length} Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCreators.map((creator, index) => (
                <motion.a
                  key={creator.id}
                  href={creator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 bg-white/5">
                    <SmartImage
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white/90 group-hover:text-white truncate">
                        {creator.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                        {creator.favLevel}
                      </span>
                    </div>
                    <div className="text-xs text-white/40 mb-2">
                      {creator.types.join(' · ')}
                    </div>

                    {/* Last Downloaded Date Picker */}
                    <div
                      className="flex items-center gap-2 group/date mt-auto pt-2 border-t border-white/5"
                      onClick={(e) => e.preventDefault()} // Prevent link click when interacting with date
                    >
                      <div className="text-white/40 shrink-0 group-hover/date:text-white/60 transition-colors">
                        <Calendar size={12} />
                      </div>
                      <input
                        type="text"
                        placeholder="yyyy/mm/dd"
                        value={downloadDates[creator.id] || creator.date || ''}
                        onChange={(e) => handleDateChange(creator.id, e.target.value)}
                        className="flex-1 bg-transparent text-[10px] text-white/80 focus:outline-none focus:text-white placeholder-white/30 text-left"
                      />
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:text-white/60 transition-colors shrink-0">
                    <ExternalLink size={14} />
                  </div>
                </motion.a>
              ))}

              {filteredCreators.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                  <Palette size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">No creators found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilters({});
                    }}
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
