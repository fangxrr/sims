import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronDown, ClipboardList, Download, Globe, Calendar } from 'lucide-react';
import { TRACKERS_DATA as CC_DATA, CCItem } from '../data/trackers';
import { SmartImage } from '../components/SmartImage';



export const CCTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(CC_DATA.map(item => item.type))).sort();

    const subtypeMap: Record<string, string[]> = {};
    CC_DATA.forEach(item => {
      if (!subtypeMap[item.type]) subtypeMap[item.type] = [];
      if (!subtypeMap[item.type].includes(item.subtype)) {
        subtypeMap[item.type].push(item.subtype);
      }
    });
    Object.keys(subtypeMap).forEach(key => subtypeMap[key].sort());

    const authors = Array.from(new Set(CC_DATA.map(item => item.author))).sort();

    return {
      type: types,
      subtype: subtypeMap,
      author: authors
    };
  }, []);

  // State for storing custom dates
  const [downloadDates, setDownloadDates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('sims-cc-dates');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('sims-cc-dates', JSON.stringify(downloadDates));
  }, [downloadDates]);

  const handleDateChange = (id: string, date: string) => {
    setDownloadDates(prev => ({
      ...prev,
      [id]: date
    }));
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (value === '') {
        delete newFilters[category];
        // If clearing type, also clear subtype
        if (category === 'type') {
          delete newFilters['subtype'];
        }
      } else {
        newFilters[category] = value;
        // If changing type, clear subtype
        if (category === 'type') {
          delete newFilters['subtype'];
        }
      }
      return newFilters;
    });
  };

  const clearFilter = (category: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[category];
      if (category === 'type') {
        delete newFilters['subtype'];
      }
      return newFilters;
    });
  };

  const filteredItems = useMemo(() => {
    return CC_DATA.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        return (item as any)[key] === value;
      });

      return matchesSearch && matchesFilters;
    }).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.subtype.localeCompare(b.subtype);
    });
  }, [searchQuery, activeFilters]);

  // Determine available subtypes based on selected type
  const availableSubtypes = activeFilters.type
    ? filterOptions.subtype[activeFilters.type] || []
    : [];

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
            Tracker.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-12 overflow-hidden z-10">

          {/* Top Bar: Title, Search, Filter */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <ClipboardList size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Tracker</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search CC or authors..."
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
                <div className="px-4 py-4 md:px-8 md:py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Type Filter */}
                  <div className="relative group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={activeFilters.type || ''}
                        onChange={(e) => toggleFilter('type', e.target.value)}
                        className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <option value="">All Types</option>
                        {filterOptions.type.map(option => (
                          <option key={option} value={option} className="bg-gray-900 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>

                  {/* Subtype Filter (Dynamic) */}
                  <div className={`relative group ${!activeFilters.type ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                      Subtype
                    </label>
                    <div className="relative">
                      <select
                        value={activeFilters.subtype || ''}
                        onChange={(e) => toggleFilter('subtype', e.target.value)}
                        disabled={!activeFilters.type}
                        className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors disabled:cursor-not-allowed"
                      >
                        <option value="">All Subtypes</option>
                        {availableSubtypes.map(option => (
                          <option key={option} value={option} className="bg-gray-900 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>

                  {/* Author Filter */}
                  <div className="relative group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                      Author
                    </label>
                    <div className="relative">
                      <select
                        value={activeFilters.author || ''}
                        onChange={(e) => toggleFilter('author', e.target.value)}
                        className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <option value="">All Authors</option>
                        {filterOptions.author.map(option => (
                          <option key={option} value={option} className="bg-gray-900 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Chips */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="px-4 py-2 md:px-8 md:py-3 flex flex-wrap gap-2 border-b border-white/5 bg-white/[0.02]">
              {Object.entries(activeFilters).map(([category, value]) => (
                <motion.button
                  key={category}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={() => clearFilter(category)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                >
                  <span className="text-white/60 capitalize">{category}:</span>
                  <span className="font-medium">{value}</span>
                  <X size={12} className="text-white/40 group-hover:text-white transition-colors" />
                </motion.button>
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
                {Object.keys(activeFilters).length > 0 ? 'Filtered CC' : 'All CC'}
              </h3>
              <span className="text-xs text-white/40">{filteredItems.length} Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Image Preview */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/20 relative">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Hover Actions */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {item.translationUrl && (
                        <a
                          href={item.translationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                          title="Translation"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                        title="Download"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-1">
                    <h4 className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-white/50 truncate">
                        {item.author}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                          {item.type}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                          {item.subtype}
                        </span>
                      </div>
                    </div>

                    {/* Last Downloaded Date Picker */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end gap-2 group">
                      <div className="text-white/40 shrink-0 group-hover:text-white/60 transition-colors">
                        <Calendar size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="yyyy/mm/dd"
                        value={downloadDates[item.id] || ''}
                        onChange={(e) => handleDateChange(item.id, e.target.value)}
                        className="w-[70px] bg-transparent text-xs text-white/80 focus:outline-none focus:text-white placeholder-white/30 text-right"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                  <ClipboardList size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">No CC found matching your criteria.</p>
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
