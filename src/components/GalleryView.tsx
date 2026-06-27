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

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Visual Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Our Gallery of Glow</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Real guests, authentic results. Browse through our premium catalog of haircuts, flawless hair color balances, natural microblading strokes, and glowing custom skincare outcomes.
          </p>
        </div>

        {/* Gallery Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-brand-champagne/60 pb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeFilter.toLowerCase() === filter.toLowerCase()
                  ? 'bg-brand-charcoal text-brand-cream font-medium'
                  : 'bg-white border border-brand-champagne/40 text-brand-charcoal hover:bg-brand-champagne/30'
              }`}
              id={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {filter === 'all' ? 'All Formats' : filter}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={index}
              onClick={() => handleOpenLightbox(photo.url)}
              className="group cursor-pointer bg-white border border-brand-champagne/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative"
              id={`gallery-item-${index}`}
            >
              {/* Photo */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-brand-cream text-brand-charcoal p-3 rounded-full hover:scale-110 transition-transform duration-300">
                    <Camera size={20} />
                  </span>
                </div>
              </div>

              {/* Photo Title and Metadata Info */}
              <div className="p-5 space-y-1">
                <span className="font-sans text-[10px] tracking-widest text-brand-gold uppercase font-semibold">
                  {photo.category}
                </span>
                <h3 className="font-serif text-base text-brand-charcoal font-medium">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Lightbox Modal */}
        {lightboxIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-brand-charcoal/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 text-brand-cream hover:text-brand-gold p-2 cursor-pointer z-50"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              id="close-lightbox"
            >
              <X size={28} />
            </button>

            {/* Left arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream hover:text-brand-gold bg-brand-cream/10 hover:bg-brand-cream/20 p-3 rounded-full transition-all cursor-pointer hidden md:block"
              aria-label="Previous image"
              id="prev-lightbox"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Lightbox Content Container */}
            <div 
              className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center justify-center relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_PHOTOS[lightboxIndex].url}
                alt={GALLERY_PHOTOS[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-brand-champagne/15"
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
            </div>

            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream hover:text-brand-gold bg-brand-cream/10 hover:bg-brand-cream/20 p-3 rounded-full transition-all cursor-pointer hidden md:block"
              aria-label="Next image"
              id="next-lightbox"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
