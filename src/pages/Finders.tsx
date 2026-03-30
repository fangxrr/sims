import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ExternalLink, Compass } from 'lucide-react';
import { FINDERS_DATA, Finder } from '../data/finders';
import { SmartImage } from '../components/SmartImage';

export const Finders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFinders = useMemo(() => {
    return FINDERS_DATA.filter(finder =>
      finder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pt-16 pb-20 md:px-12 md:pt-20 md:pb-28">
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

          {/* Top Bar: Title, Search */}
          <div className="px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/5">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/5 border border-white/10">
                <Compass size={16} className="text-white/80" />
              </div>
              <h1 className="hidden md:block text-lg font-semibold text-white tracking-wide">Finders</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-8 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                placeholder="Search finders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right: Empty placeholder for balance */}
            <div className="w-10"></div>
          </div>

          {/* Main Content - Scrollable Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase">
                {searchQuery ? 'Filtered Finders' : 'All Finders'}
              </h3>
              <span className="text-xs text-white/40">{filteredFinders.length} Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFinders.map((finder, index) => (
                <motion.a
                  key={finder.id}
                  href={finder.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 shrink-0 ring-4 ring-white/5 group-hover:ring-white/20 transition duration-300">
                    <SmartImage
                      src={finder.avatar}
                      alt={finder.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white/90 group-hover:text-white truncate">
                      {finder.name}
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:text-white/60 transition-colors shrink-0">
                    <ExternalLink size={14} />
                  </div>
                </motion.a>
              ))}

              {filteredFinders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/30">
                  <Compass size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">No finders found matching your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-xs text-white/60 hover:text-white underline"
                  >
                    Clear Search
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
