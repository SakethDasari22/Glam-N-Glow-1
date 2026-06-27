import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data';

export default function GalleryView() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = ['all', 'Hair', 'Skincare', 'Lashes', 'Permanent Makeup'];

  const filteredPhotos = activeFilter === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(photo => photo.category.toLowerCase() === activeFilter.toLowerCase());

  const handleOpenLightbox = (photoUrl: string) => {
    const originalIndex = GALLERY_PHOTOS.findIndex(p => p.url === photoUrl);
    if (originalIndex !== -1) {
      setLightboxIndex(originalIndex);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => {
        if (prev === null) return null;
        return prev === 0 ? GALLERY_PHOTOS.length - 1 : prev - 1;
      });
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => {
        if (prev === null) return null;
        return prev === GALLERY_PHOTOS.length - 1 ? 0 : prev + 1;
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-brand-cream text-brand-dark-text min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-bold block">Visual Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Our Gallery of Glow</h1>
          <div className="gold-foil-line w-40 mx-auto mt-4" />
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Real guests, authentic results. Browse through our premium catalog of haircuts, flawless hair color balances, natural microblading strokes, and glowing custom skincare outcomes.
          </p>
        </motion.div>

        {/* Gallery Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-brand-champagne/40 pb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeFilter.toLowerCase() === filter.toLowerCase()
                  ? 'bg-brand-charcoal text-brand-cream font-bold border border-brand-gold'
                  : 'bg-white border border-brand-champagne/40 text-brand-charcoal hover:bg-brand-champagne/20'
              }`}
              id={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {filter === 'all' ? 'All Formats' : filter}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid with Framer Motion Stagger */}
        <motion.div 
          key={activeFilter} // Re-animate on filter change
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => handleOpenLightbox(photo.url)}
              className="group cursor-pointer bg-brand-charcoal border border-brand-champagne/30 overflow-hidden shadow-2xl transition-all duration-300 relative rounded-sm"
              id={`gallery-item-${index}`}
            >
              {/* Photo Frame */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay with gold-tint glassmorphism */}
                <div className="absolute inset-0 bg-brand-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                  <span className="bg-brand-gold text-brand-charcoal p-3.5 rounded-full hover:scale-115 transition-transform duration-300 shadow-xl border border-white/20">
                    <Camera size={20} />
                  </span>
                </div>
              </div>

              {/* Photo Title and Metadata Info */}
              <div className="p-6 space-y-1 bg-brand-charcoal">
                <span className="font-sans text-[9px] tracking-widest text-brand-gold uppercase font-bold block">
                  {photo.category}
                </span>
                <h3 className="font-serif text-base text-brand-cream font-medium group-hover:text-brand-gold transition-colors duration-200">
                  {photo.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-brand-charcoal/95 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close button */}
              <button 
                className="absolute top-6 right-6 text-brand-cream hover:text-brand-gold p-2 cursor-pointer z-50 transition-colors"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close lightbox"
                id="close-lightbox"
              >
                <X size={28} />
              </button>

              {/* Left arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream hover:text-brand-gold bg-white/5 hover:bg-white/10 p-3.5 border border-white/10 rounded-full transition-all cursor-pointer hidden md:block"
                aria-label="Previous image"
                id="prev-lightbox"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Lightbox Content Container */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center justify-center relative space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_PHOTOS[lightboxIndex].url}
                  alt={GALLERY_PHOTOS[lightboxIndex].title}
                  className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-brand-champagne/30"
                  referrerPolicy="no-referrer"
                />

                <div className="text-center text-brand-cream space-y-1">
                  <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-semibold">
                    {GALLERY_PHOTOS[lightboxIndex].category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-light">
                    {GALLERY_PHOTOS[lightboxIndex].title}
                  </h3>
                </div>
              </motion.div>

              {/* Right arrow */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream hover:text-brand-gold bg-white/5 hover:bg-white/10 p-3.5 border border-white/10 rounded-full transition-all cursor-pointer hidden md:block"
                aria-label="Next image"
                id="next-lightbox"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
