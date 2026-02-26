import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { GALLERY_DATA as GALLERY_IMAGES } from '../data/gallery';

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            Gallery.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-12 overflow-hidden z-10">
          
          {/* Main Content - Scrollable Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 pt-4 md:px-8 md:pb-8 md:pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {GALLERY_IMAGES.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(item.url)}
                  className="cursor-pointer aspect-video w-full overflow-hidden rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <img 
                    src={item.url} 
                    alt={`Gallery Image ${item.id}`}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={selectedImage}
              alt="Lightbox View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
