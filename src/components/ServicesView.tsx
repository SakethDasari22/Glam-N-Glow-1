import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Sparkles, Flame, Eye, Heart, Calendar } from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceCategory } from '../types';

interface ServicesViewProps {
  setCurrentPage: (page: string) => void;
  setSelectedService?: (serviceName: string) => void;
}

export default function ServicesView({ setCurrentPage, setSelectedService }: ServicesViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'hair':
        return <Scissors className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'facials & skincare':
        return <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'hair removal':
        return <Flame className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'nails':
        return <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'permanent makeup':
        return <Eye className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'lashes':
        return <Heart className="w-5 h-5 text-brand-gold shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />;
    }
  };

  const handleBookService = (serviceName: string) => {
    if (setSelectedService) {
      setSelectedService(serviceName);
    }
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCategories = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(cat => cat.id === activeCategory);

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Glow Menu & Pricing</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Our Curated Rituals</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Every facial, haircut, and cosmetic application is tailored meticulously. Select from our menu of advanced salon rituals. Prices may vary depending on individual artist certification.
          </p>
        </div>

        {/* Category Tabs / Filters */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-brand-champagne/60 pb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-brand-charcoal text-brand-cream font-medium'
                : 'bg-white border border-brand-champagne/40 text-brand-charcoal hover:bg-brand-champagne/30'
            }`}
            id="tab-all-services"
          >
            All Services
          </button>
          {SERVICES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 font-sans text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-charcoal text-brand-cream font-medium'
                  : 'bg-white border border-brand-champagne/40 text-brand-charcoal hover:bg-brand-champagne/30'
              }`}
              id={`tab-service-${cat.id}`}
            >
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Services Grouping Grid */}
        <div className="space-y-20">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-8" id={`category-block-${cat.id}`}>
              {/* Category Title Header */}
              <div className="flex items-center gap-3.5 border-b border-brand-champagne pb-4">
                <div className="p-2.5 bg-brand-blush text-brand-gold border border-brand-champagne/50">
                  {getCategoryIcon(cat.category)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-medium">
                    {cat.category}
                  </h2>
                  <p className="font-sans text-xs text-brand-warm-gray mt-1 max-w-xl font-light">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Grid of actual Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cat.services.map((srv, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-brand-champagne/40 p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group"
                    id={`service-card-${cat.id}-${idx}`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-lg font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors duration-200">
                          {srv.name}
                        </h3>
                        <span className="font-mono text-sm tracking-wide text-brand-gold font-semibold bg-brand-cream border border-brand-gold/15 py-1 px-3.5 rounded-none shrink-0">
                          {srv.price}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-brand-warm-gray leading-relaxed font-light">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-brand-champagne/30 flex items-center justify-between">
                      <span className="font-sans text-[10px] tracking-widest text-brand-warm-gray uppercase font-light">
                        Booking Required
                      </span>
                      <button
                        onClick={() => handleBookService(srv.name)}
                        className="bg-transparent hover:bg-brand-charcoal border border-brand-charcoal/20 hover:border-brand-charcoal text-brand-charcoal hover:text-brand-cream font-sans text-[10px] tracking-widest uppercase py-2 px-4 transition-all duration-300 font-semibold cursor-pointer rounded-none inline-flex items-center gap-1.5"
                        id={`btn-book-${cat.id}-${idx}`}
                      >
                        <Calendar size={12} />
                        <span>Book Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking CTA banner */}
        <div className="bg-brand-blush/40 border border-brand-champagne/60 p-8 sm:p-12 text-center space-y-6">
          <span className="font-sans text-xs tracking-[0.25em] text-brand-gold uppercase font-semibold block">Need a Custom Package?</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-brand-charcoal font-light">Can’t decide which combination is right?</h2>
          <p className="font-sans text-sm text-brand-warm-gray max-w-xl mx-auto font-light leading-relaxed">
            Our expert cosmetologists offer complimentary consultations to curate custom beauty packages for weddings, formal events, or full glow makeovers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleBookService('Custom Beauty Consultation')}
              className="bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4 px-8 transition-all duration-300 font-semibold cursor-pointer rounded-none"
              id="services-consultation-btn"
            >
              Book Complimentary Consultation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
