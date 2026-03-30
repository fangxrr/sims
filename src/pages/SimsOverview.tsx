import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SIMS_DATA } from '../data/sims';
import { SmartImage } from '../components/SmartImage';

const AGE_ORDER = ['Toddler', 'Child', 'Teen', 'Young Adult', 'Adult', 'Elder'];

export const SimsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filterOptions = useMemo(() => {
    const sims = Object.values(SIMS_DATA);

    const genders = Array.from(new Set(sims.map(s => s.gender))).filter(Boolean).sort();
    const ages = Array.from(new Set(sims.map(s => s.age)))
      .filter(Boolean)
      .sort((a, b) => AGE_ORDER.indexOf(a) - AGE_ORDER.indexOf(b));
    const maritalStatuses = Array.from(new Set(sims.map(s => s.maritalStatus))).filter(Boolean).sort();
    const worlds = Array.from(new Set(sims.map(s => s.world))).filter(Boolean).sort();
    const careers = Array.from(new Set(sims.map(s => s.career))).filter(Boolean).sort();

    const allSkills = new Set<string>();
    sims.forEach(sim => {
      sim.skills?.forEach(s => allSkills.add(s.name));
    });
    const skills = Array.from(allSkills).sort();

    return {
      gender: genders,
      age: ages,
      maritalStatus: maritalStatuses,
      world: worlds,
      career: careers,
      skill: skills,
      homelessStatus: ['Housed', 'Homeless'],
    };
  }, []);

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category] === value) {
        delete newFilters[category];
      } else {
        newFilters[category] = value;
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

  const filteredSims = useMemo(() => {
    return Object.values(SIMS_DATA).filter(sim => {
      const matchesSearch = sim.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        if (key === 'homelessStatus') {
          if (value === 'Homeless') return sim.isHomeless === true;
          if (value === 'Housed') return sim.isHomeless !== true;
          return true;
        }
        if (key === 'skill') {
          return sim.skills?.some(s => s.name === value);
        }
        return (sim as any)[key] === value;
      });
      return matchesSearch && matchesFilters;
    });
  }, [searchQuery, activeFilters]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pb-20 md:px-12 md:pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full overflow-hidden flex flex-col relative group"
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden z-10">

          {/* Top Bar: Title, Search, Filter */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <User size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Sims</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search sims..."
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
                <div className="px-4 py-4 md:px-8 md:py-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4">
                  {(Object.entries(filterOptions) as [string, string[]][]).map(([category, options]) => (
                    <div key={category} className="relative group">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="relative">
                        <select
                          value={activeFilters[category] || ''}
                          onChange={(e) => toggleFilter(category, e.target.value)}
                          className="appearance-none w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <option value="">All</option>
                          {options.map(option => (
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
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Chips */}
          <AnimatePresence>
            {isFilterOpen && Object.keys(activeFilters).length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-white/5 bg-white/[0.02]"
              >
                <div className="px-4 py-2 md:px-8 md:py-3 flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([category, value]) => (
                    <motion.button
                      key={category}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={() => clearFilter(category)}
                      className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white hover:bg-white/20 transition-colors group"
                    >
                      <span className="text-white/60 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}:</span>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - Scrollable Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                {Object.keys(activeFilters).length > 0 ? 'Filtered Sims' : 'All Sims'}
              </h3>
              <span className="text-xs text-white/40">{filteredSims.length} Found</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredSims.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/sims/${sim.id}`)}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-white/5">
                    <SmartImage
                      src={sim.image}
                      alt={sim.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors truncate">
                      {sim.chineseName || sim.name}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {filteredSims.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                  <User size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">No Sims found matching your criteria.</p>
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
