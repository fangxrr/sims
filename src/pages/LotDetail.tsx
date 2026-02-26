import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, Ruler, Download, Users, DoorOpen, ExternalLink } from 'lucide-react';
import { LOTS_DATA } from '../data/lots';
import { FAMILIES_DATA } from '../data/families';
import { WORLDS_DATA } from '../data/worlds';

export const LotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lot = id ? LOTS_DATA[id] : null;
  const lotName = lot?.name || id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Find if any family lives in this lot
  const residentFamily = useMemo(() => {
    if (!id) return null;
    return Object.values(FAMILIES_DATA).find(family => family.lotId === id);
  }, [id]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-start h-full w-full overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-5xl px-6 pt-24 pb-28 z-10 relative"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group mb-8"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-medium tracking-widest uppercase">Back</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/70">
                {lot?.type || 'Residential'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/70 flex items-center gap-1">
                <Ruler size={10} />
                {lot?.size || '30x20'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/70 flex items-center gap-1">
                {lot?.isBuilt !== false ? 'BUILT' : 'NOT BUILT'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-2">
              {lot?.chineseName || lotName}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-white/50 tracking-wide mb-6">
              {lotName}
            </h2>
            <div className="flex items-center gap-2 text-white/60">
              <button 
                onClick={() => navigate(`/worlds/${lot?.worldId || 'willow-creek'}`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin size={16} className="text-white/40" />
                <span className="text-sm font-medium tracking-wide uppercase">
                  {WORLDS_DATA[lot?.worldId || '']?.chineseName || lot?.worldId?.replace(/-/g, ' ') || 'Willow Creek'}
                </span>
              </button>
            </div>
          </div>

          {/* Download Button */}
          <a 
            href={lot?.downloadUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            <Download size={18} />
            <span>Download Lot</span>
            <ExternalLink size={14} className="opacity-50 ml-1" />
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <img 
                src={lot?.image || `https://picsum.photos/seed/${id}/1200/800`}
                alt="Lot Hero"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
            </div>
          </div>

          {/* Right Column: Resident Family */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} />
              Current Residents
            </h3>

            {residentFamily ? (
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md group cursor-pointer"
                onClick={() => navigate(`/families/${residentFamily.id}`)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={residentFamily.image} 
                    alt={residentFamily.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20] to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-white mb-2 inline-block">
                      Occupied
                    </span>
                    <h4 className="text-2xl font-bold text-white tracking-tight">
                      {residentFamily.chineseName || residentFamily.name}
                    </h4>
                    <p className="text-sm text-white/60 mt-1">
                      {residentFamily.members?.length || 0} Household Members
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <DoorOpen size={24} className="text-white/40" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Available</h4>
                <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
                  This lot is currently unoccupied and ready for a new family to move in.
                </p>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </main>
  );
};
