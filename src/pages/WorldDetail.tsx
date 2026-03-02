import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Home } from 'lucide-react';
import { LOTS_DATA } from '../data/lots';
import { FAMILIES_DATA } from '../data/families';
import { WORLDS_DATA } from '../data/worlds';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { SmartImage } from '../components/SmartImage';

const SIZE_ORDER = [
  '64x64', '50x50', '50x40', '40x40', '40x30', '40x20', '30x30', '30x20', '20x20', '20x15', '15x10'
];

export const WorldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollRef = useDraggableScroll<HTMLDivElement>();

  // Use specific world data or fallback to Willow Creek if ID matches, otherwise default
  // For demo purposes, we'll just use Willow Creek data if the ID is willow-creek, 
  // otherwise we'll clone it to show data for any world ID.
  const baseWorld = WORLDS_DATA[id || ''] || { ...WORLDS_DATA['willow-creek'], name: id?.replace('-', ' ').toUpperCase(), id: id, chineseName: undefined };

  // Dynamically populate lots, sizes, and families from data sources
  const world = useMemo(() => {
    const worldLots = Object.values(LOTS_DATA).filter(lot => lot.worldId === baseWorld.id);
    const worldFamilies = Object.values(FAMILIES_DATA).filter(family => family.worldId === baseWorld.id);

    // Extract unique sizes, filter out blanks, and sort by predefined order or fallback to area
    // Normalizing '×' to 'x' for consistent comparison
    const uniqueSizes = Array.from(new Set(worldLots.map(lot => lot.size?.replace('×', 'x'))))
      .filter((size): size is string => Boolean(size && size.trim() !== ''))
      .sort((a, b) => {
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
      });

    // Populate districts with their lots
    const populatedDistricts = baseWorld.districts.map((district: any) => ({
      ...district,
      lots: worldLots.filter(lot => lot.districtId === district.id)
    }));

    return {
      ...baseWorld,
      sizes: uniqueSizes,
      families: worldFamilies,
      districts: populatedDistricts
    };
  }, [baseWorld]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-start h-full w-full px-4 pt-20 pb-28 overflow-y-auto custom-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl space-y-16"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/worlds')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group mb-4"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-medium tracking-widest uppercase">Back to Worlds</span>
        </button>

        {/* 1. World Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group"
          >
            <SmartImage
              src={world.image}
              alt={world.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          <div className="flex flex-col justify-center space-y-6">
            {world.sizes && world.sizes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {world.sizes.map((size: string) => (
                  <span key={size} className="px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white/70 bg-white/5 backdrop-blur-sm">
                    {size}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-baseline gap-4 mb-2">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                {world.chineseName || world.name}
              </h1>
              {world.chineseName && (
                <h2 className="text-2xl text-white/40 font-light tracking-wide">
                  {world.name}
                </h2>
              )}
            </div>

            <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
              {world.description}
            </p>
          </div>
        </section>

        {/* 2. Families Section */}
        {world.families.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Users size={20} className="text-white/80" />
              <h2 className="text-xl font-semibold text-white tracking-wide">Families in this World</h2>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar mask-gradient-right"
            >
              {world.families.map((family: any, index: number) => (
                <motion.div
                  key={family.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex-shrink-0 w-48 group cursor-pointer"
                  onClick={() => navigate(`/families/${family.id}`)}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative mb-3 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-white/5">
                    <SmartImage
                      src={family.image}
                      alt={family.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-white/90 text-center group-hover:text-white transition-colors">
                    {family.chineseName || family.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 3. District Sections */}
        <div className="space-y-20">
          {world.districts.map((district: any, index: number) => (
            <section key={district.id} className="space-y-8">
              {/* District Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <MapPin size={20} className="text-white/80" />
                <h2 className="text-2xl font-bold text-white tracking-wide">{district.name}</h2>
              </div>

              {/* District Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: District Info */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <SmartImage
                      src={district.image}
                      alt={district.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {district.description}
                  </p>
                </div>

                {/* Right: Lots Grid */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {district.lots.map((lot: any) => (
                      <motion.div
                        key={lot.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/lots/${lot.id}`)}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                      >
                        <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                          <SmartImage
                            src={lot.image}
                            alt={lot.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                            {lot.chineseName || lot.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {(lot.type || 'Residential').split(/[,，]\s*/).map((type, idx) => (
                              <span key={idx} className="text-[10px] text-white/40 uppercase tracking-wider">{type.trim()}</span>
                            ))}
                            {lot.size && (
                              <span className="text-[10px] text-white/40 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                {lot.size.replace('×', 'x')}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

      </motion.div>
    </main>
  );
};
