import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SmartImage } from './SmartImage';

interface MapHotspot {
    id: string;
    name: string;
    top: string;
    left: string;
    width?: string;
    height?: string;
}

const HOTSPOTS: MapHotspot[] = [
    // Top Row
    { id: 'copperdale', name: 'Copperdale', top: '23.5%', left: '39.2%', width: '8%', height: '3%' },
    { id: 'glimmerbrook', name: 'Glimmerbrook', top: '30%', left: '46%', width: '8%', height: '3%' },
    { id: 'granitefalls', name: 'Granite Falls', top: '25%', left: '55%', width: '8%', height: '3%' },
    { id: 'nordhaven', name: 'Nordhaven', top: '23.8%', left: '68.5%', width: '8%', height: '3%' },
    { id: 'mtkomorebi', name: 'Mt. Komorebi', top: '15.5%', left: '84.8%', width: '9%', height: '3.5%' },

    // Left Area
    { id: 'foxbury', name: 'Foxbury', top: '38.5%', left: '15.8%', width: '5%', height: '3%' },
    { id: 'evergreenharbor', name: 'Evergreen Harbor', top: '31.2%', left: '21%', width: '9%', height: '3%' },
    { id: 'sanmyshuno', name: 'San Myshuno', top: '41.5%', left: '26.8%', width: '8%', height: '3%' },
    { id: 'newcrest', name: 'Newcrest', top: '33%', left: '29.5%', width: '6%', height: '3%' },
    { id: 'magnoliapromenade', name: 'Magnolia', top: '29.2%', left: '34.5%', width: '6%', height: '3%' },
    { id: 'willowcreek', name: 'Willow Creek', top: '36.5%', left: '38.5%', width: '7%', height: '3%' },

    // Center
    { id: 'forgottenhollow', name: 'Forgotten Hollow', top: '39.8%', left: '53.5%', width: '9%', height: '3%' },
    { id: 'ravenwood', name: 'Ravenwood', top: '36.5%', left: '64.2%', width: '7%', height: '3%' },
    { id: 'windenburg', name: 'Windenburg', top: '28.5%', left: '72.8%', width: '7%', height: '3%' },

    // Right Area
    { id: 'britechester', name: 'Britechester', top: '43.2%', left: '71.5%', width: '8%', height: '3%' },
    { id: 'henfordonbagley', name: 'Henford-on-Bagley', top: '42%', left: '78.5%', width: '10%', height: '3%' },
    { id: 'innisgreen', name: 'Innisgreen', top: '39.8%', left: '88.5%', width: '7%', height: '3%' },

    // Bottom Area
    { id: 'ciudadenamorada', name: 'Ciudad Enamorada', top: '60.5%', left: '15.2%', width: '10%', height: '3.5%' },
    { id: 'selvadorada', name: 'Selvadorada', top: '75.2%', left: '15.2%', width: '8%', height: '3%' },
    { id: 'sansequoia', name: 'San Sequoia', top: '46.2%', left: '23.2%', width: '7%', height: '3%' },
    { id: 'gibbipoint', name: 'Gibbi Point', top: '56.2%', left: '29.2%', width: '7%', height: '3%' },
    { id: 'delsolvalley', name: 'Del Sol Valley', top: '47.5%', left: '36.8%', width: '8%', height: '3%' },
    { id: 'tomarang', name: 'Tomarang', top: '69.5%', left: '39.2%', width: '7%', height: '3%' },
    { id: 'oasissprings', name: 'Oasis Springs', top: '47.2%', left: '44.8%', width: '8%', height: '3%' },
    { id: 'batuu', name: 'Batuu', top: '49.8%', left: '49.2%', width: '4%', height: '2.5%' },
    { id: 'strangerville', name: 'Stranger Ville', top: '53.8%', left: '55.2%', width: '8%', height: '3%' },
    { id: 'tartosa', name: 'Tartosa', top: '63.5%', left: '56%', width: '6%', height: '3%' },
    { id: 'chestnutridge', name: 'Chestnut Ridge', top: '48.2%', left: '59.8%', width: '8%', height: '3%' },
    { id: 'brindletonbay', name: 'Brindleton Bay', top: '52.5%', left: '70%', width: '9%', height: '3.5%' },
    { id: 'ondarion', name: 'Ondarion', top: '76%', left: '58.5%', width: '6%', height: '3%' },
    { id: 'sulani', name: 'Sulani', top: '73.2%', left: '88.5%', width: '5%', height: '3.5%' },
];

export const WorldMap: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full aspect-[4/3] max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 group/map">
            <SmartImage
                src="/world-map.jpg"
                alt="Sims 4 World Map"
                className="w-full h-full object-contain"
            />

            {/* Interactive Overlay */}
            <div className="absolute inset-0 z-10">
                {HOTSPOTS.map((spot) => (
                    <motion.button
                        key={spot.id}
                        title={spot.name}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate(`/worlds/${spot.id}`)}
                        className="absolute flex items-center justify-center group/spot cursor-pointer outline-none focus:ring-2 focus:ring-white/40 rounded-lg"
                        style={{
                            top: spot.top,
                            left: spot.left,
                            width: spot.width || '8%',
                            height: spot.height || '4%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {/* Debug/Hover visual indicator */}
                        <div className="absolute inset-0 rounded-lg border border-white/0 group-hover/spot:border-white/20 group-hover/spot:bg-white/5 transition-all duration-300"></div>

                        {/* Glow effect on hover */}
                        <div className="w-2 h-2 rounded-full bg-white/0 group-hover/spot:bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300"></div>
                    </motion.button>
                ))}
            </div>

            {/* Map Hint */}
            <div className="absolute bottom-4 left-6 z-20 pointer-events-none opacity-40 group-hover/map:opacity-80 transition-opacity flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] text-white uppercase tracking-widest font-semibold flex items-center gap-1.5 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
                    Click world names to explore
                </div>
            </div>
        </div>
    );
};
