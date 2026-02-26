import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Home, Users, DollarSign } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { FAMILIES_DATA } from '../data/families';
import { WORLDS_DATA } from '../data/worlds';
import { LOTS_DATA } from '../data/lots';
import { SIMS_DATA } from '../data/sims';

export const FamilyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const family = id && FAMILIES_DATA[id] ? FAMILIES_DATA[id] : { 
    id: id || 'unknown',
    name: id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown Family',
    chineseName: id?.toUpperCase() || 'UNKNOWN',
    description: 'Family details not found.',
    world: 'Unknown World',
    worldId: 'unknown',
    lot: 'Homeless',
    image: 'https://picsum.photos/seed/unknown/800/1000',
    members: []
  };

  return (
    <main className="relative z-10 w-full h-full px-8 pt-14 pb-32 overflow-y-auto custom-scrollbar">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/families')}
        className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group mb-8"
      >
        <div className="p-2 rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase">Back to Families</span>
      </button>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left: Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[40%] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group"
        >
          <img 
            src={family.image} 
            alt={family.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col justify-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.9] mb-2">
              {family.chineseName}
            </h1>
            <h2 className="text-xl text-white/40 font-light tracking-wide">
              {family.name}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-white/60 leading-relaxed max-w-lg font-light mb-6">
              {family.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate(`/worlds/${family.worldId}`)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin size={12} className="text-white/40" />
                <span className="text-xs font-medium tracking-wide uppercase">
                  {WORLDS_DATA[family.worldId]?.chineseName || family.world}
                </span>
              </button>
              {family.lotId ? (
                <button 
                  onClick={() => navigate(`/lots/${family.lotId}`)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Home size={12} className="text-white/40" />
                  <span className="text-xs font-medium tracking-wide uppercase">
                    {LOTS_DATA[family.lotId]?.chineseName || family.lot}
                  </span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80">
                  <Home size={12} className="text-white/40" />
                  <span className="text-xs font-medium tracking-wide uppercase">
                    {family.lotId ? (LOTS_DATA[family.lotId]?.chineseName || family.lot) : family.lot}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Members Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-white/70" size={20} />
          <h2 className="text-xl font-bold text-white tracking-wide">Household Members</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {family.members.map((member: any, index: number) => {
            const sim = SIMS_DATA[member.id];
            if (!sim) return null;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/sims/${member.id}`)}
              >
                <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative mb-4 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-white/5">
                  <img 
                    src={sim.image} 
                    alt={sim.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                    {sim.chineseName || sim.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </main>
  );
};
