import React from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Users, Heart, Star, BookOpen, Brain, Zap, Smile, Music, Palette, Sparkles, Dumbbell, Home, Globe, User, Clock } from 'lucide-react';
import { SIMS_DATA } from '../data/sims';
import { WORLDS_DATA } from '../data/worlds';
import { FAMILIES_DATA } from '../data/families';
import { SmartImage } from '../components/SmartImage';

export const SimDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const sim = id ? SIMS_DATA[id] : null;

  if (!sim) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8 pb-32 text-white">
        <p>Sim not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go Back</button>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8 pb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full overflow-hidden flex flex-col relative group"
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-16">

          {/* Back Button */}
          <button
            onClick={() => navigate(sim.familyId ? `/families/${sim.familyId}` : '/sims')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
          >
            <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-medium">Back to {sim.familyId ? 'Family' : 'Sims'}</span>
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Top Section Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row gap-10 mb-12"
            >
              {/* Left: Portrait & Basic Info */}
              <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 relative shadow-2xl">
                  <SmartImage
                    src={sim.image}
                    alt={sim.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="px-2 space-y-3">
                  <div>
                    <h1 className="text-3xl font-medium text-white mb-1">{sim.chineseName || sim.name}</h1>
                    {sim.chineseName && (
                      <div className="text-white/40 text-base mb-1 font-light">
                        {sim.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    {/* Row 1: Family & World */}
                    <div className="flex items-center gap-3 text-white/70 text-sm">
                      <button
                        onClick={() => navigate(`/families/${sim.familyId}`)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors group"
                      >
                        <Home size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
                        <span className="border-b border-transparent group-hover:border-white/20">{FAMILIES_DATA[sim.familyId]?.chineseName || sim.familyId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </button>
                      <span className="text-white/10">|</span>
                      <button
                        onClick={() => navigate(`/worlds/${sim.worldId}`)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors group"
                      >
                        <MapPin size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
                        <span className="border-b border-transparent group-hover:border-white/20">{WORLDS_DATA[sim.worldId]?.chineseName || sim.world}</span>
                      </button>
                    </div>

                    {/* Row 2: Age, Marital, Gender */}
                    <div className="flex items-center gap-3 text-white/50 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-white/30" />
                        <span>{sim.age}</span>
                      </div>
                      <span className="text-white/10">|</span>
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-white/30" />
                        <span>{sim.maritalStatus}</span>
                      </div>
                      <span className="text-white/10">|</span>
                      <div className="flex items-center gap-1">
                        <User size={14} className="text-white/30" />
                        <span>{sim.gender}</span>
                      </div>
                    </div>

                    {/* Row 3: Career */}
                    <div className="flex items-center gap-1.5 text-white/70 text-sm">
                      <Briefcase size={14} className="text-white/30" />
                      <span>{sim.career}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Detailed Info */}
              <div className="flex-1 flex flex-col pt-4">
                {/* Icons Rows */}
                <div className="space-y-6">
                  {/* Aspiration */}
                  {sim.aspiration && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold ml-1">
                        <Star size={14} /> Aspiration
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm backdrop-blur-sm">
                          {sim.aspiration.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Traits */}
                  {sim.traits && sim.traits.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold ml-1">
                        <Sparkles size={14} /> Traits
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sim.traits.map((trait, i) => (
                          <div key={i} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm backdrop-blur-sm">
                            {trait.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {sim.skills && sim.skills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold ml-1">
                        <Dumbbell size={14} /> Skills
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sim.skills.map((skill, i) => (
                          <div key={i} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2 backdrop-blur-sm">
                            <span>{skill.name}</span>
                            <span className="text-[10px] text-white/40 font-mono">Lvl {skill.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Relationships */}
                  {sim.relationships && (
                    <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold">
                        <Users size={14} /> Relationships
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(sim.relationships).map(([type, rels]) => {
                          if (!rels || !Array.isArray(rels)) return null;

                          const labelMap: Record<string, string> = {
                            spouse: 'Spouse / 配偶',
                            lover: 'Lover / 恋人',
                            children: 'Children / 子女',
                            parents: 'Parents / 父母',
                            siblings: 'Siblings / 兄弟姐妹',
                            grandparents: 'Grandparents / 祖父母',
                            grandchildren: 'Grandchildren / 孙子女',
                            relatives: 'Relatives / 亲属'
                          };

                          return (rels as { id: string }[]).map(rel => {
                            const relSim = SIMS_DATA[rel.id];
                            if (!relSim) return null;
                            const label = labelMap[type] || (type.charAt(0).toUpperCase() + type.slice(1));
                            return (
                              <div key={`${type}-${rel.id}`} className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-between gap-3" onClick={() => navigate(`/sims/${rel.id}`)}>
                                <div className="flex flex-col gap-1 min-w-0">
                                  <div className="text-[8px] uppercase tracking-widest text-white/30 font-semibold">{label}</div>
                                  <div className="text-white/90 text-sm truncate">{relSim.chineseName || relSim.name}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                                  <SmartImage src={relSim.image} alt={relSim.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </main>
  );
};
