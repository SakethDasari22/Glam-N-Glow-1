import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Scissors, Sparkles, Award, ShieldCheck, Heart, ChevronRight } from 'lucide-react';
import { BUSINESS_INFO, TESTIMONIALS } from '../data';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
}

// Custom hook / component for scroll-triggered stats count-up animation
function StatItem({ value, label }: { value: string; label: string; key?: any }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Extract number and suffix (e.g. "4.8 ★" -> 4.8, "18+" -> 18, "100%" -> 100)
  const numericVal = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const isPercent = value.includes('%');
  const isStar = value.includes('★');
  const isPlus = value.includes('+');
  
  useEffect(() => {
    let observer: IntersectionObserver;
    let started = false;
    
    if (targetRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            let start = 0;
            // Handle year counting up from 1995 to 2010
            if (numericVal === 2010) {
              start = 1990;
            }
            const duration = 1500;
            const startTime = performance.now();
            
            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Cubic ease-out
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = start + (numericVal - start) * easeProgress;
              
              setDisplayValue(currentVal);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(numericVal);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(targetRef.current);
    }
    
    return () => {
      if (observer && targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [numericVal, value]);

  const renderValue = () => {
    if (isStar) return `${displayValue.toFixed(1)} ★`;
    if (isPercent) return `${Math.round(displayValue)}%`;
    if (isPlus) return `${Math.round(displayValue)}+`;
    if (numericVal === 2010) return Math.round(displayValue).toString();
    return Math.round(displayValue).toString();
  };

  return (
    <div ref={targetRef} className="border-l border-brand-champagne/20 first:border-none pl-4 md:pl-8">
      <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-gold font-light tracking-wide">
        {renderValue()}
      </p>
      <p className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-brand-cream/65 mt-2 font-light">
        {label}
      </p>
    </div>
  );
}

export default function HomeView({ setCurrentPage }: HomeViewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const stats = [
    { value: '2010', label: 'Established' },
    { value: '4.8 ★', label: 'Client Rating' },
    { value: '18+', label: 'Luxury Services' },
    { value: '100%', label: 'Organic Sugaring' },
  ];

  const featuredServices = [
    {
      title: 'Airtouch Highlights',
      category: 'Hair Artistry',
      desc: 'The ultimate seamless highlighting technique using air separation. Zero harsh lines and incredibly natural regrowth.',
      price: 'from $240',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600&h=450'
    },
    {
      title: 'Brows (Microblading)',
      category: 'Permanent Makeup',
      desc: 'Certified high-precision eyebrow mapping and organic pigment hair-strokes to define and shape your perfect brows.',
      price: 'from $450',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600&h=450'
    },
    {
      title: 'Signature Facials',
      category: 'Skincare',
      desc: 'Botanical and peptide-rich skincare formulas customized to restore collagen, deep cleanse, and hydrate your complexion.',
      price: 'from $95',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600&h=450'
    }
  ];

  return (
    <div className="bg-brand-cream text-brand-dark-text overflow-hidden">
      
      {/* 1. Hero Section with dynamic shimmer background */}
      <section className="relative min-h-[92vh] flex items-center justify-center py-20 px-4 md:px-8 shimmer-bg overflow-hidden border-b border-brand-champagne/40">
        
        {/* Shimmer sparkle background overlays */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-champagne)_0%,_transparent_55%)] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-brand-charcoal)_0%,_transparent_70%)] opacity-50 pointer-events-none" />
        
        {/* Subtle glitter pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#C9A659_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center px-4">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 text-brand-gold uppercase tracking-[0.25em] text-xs font-semibold justify-center lg:justify-start"
            >
              <Sparkles size={14} className="text-brand-gold animate-pulse" />
              <span>Aurora’s Premium Beauty Sanctuary</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-brand-cream leading-[1.1]"
            >
              Where Beauty <br />
              <span className="font-serif italic text-brand-gold font-normal">Meets Glow</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-sans text-base sm:text-lg text-brand-cream/80 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Step into a beautifully quiet space of tailored luxury. From European-grade Airtouch hair color to restorative skincare rituals, our artists craft elegant results unique to you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-4"
            >
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-brand-gold hover:bg-white text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4.5 px-8 transition-all duration-300 font-bold cursor-pointer shadow-lg gold-glow"
                id="hero-book-btn"
              >
                Book Consultation
              </button>
              <button
                onClick={() => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-brand-cream border border-brand-champagne/40 hover:border-brand-gold font-sans text-xs tracking-widest uppercase py-4.5 px-8 transition-all duration-300 font-medium cursor-pointer"
                id="hero-services-btn"
              >
                Explore Services
              </button>
            </motion.div>
          </div>

          {/* Right Visual Column (Large Editorial Portrait framed in Gold) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Outer gold glow card-frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-gold via-brand-champagne to-brand-gold/40 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
              
              {/* Actual photo card frame */}
              <div className="relative bg-brand-charcoal border-2 border-brand-champagne/60 p-3 rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Premium Luxury Glam N Glow Aesthetics" 
                  className="w-full h-[320px] sm:h-[420px] object-cover rounded-xl transition-all duration-700 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded luxury badge overlay */}
                <div className="absolute bottom-6 right-6 bg-brand-charcoal/95 border border-brand-gold/60 backdrop-blur-sm p-4 text-right rounded-lg shadow-xl">
                  <span className="font-serif text-sm text-brand-gold tracking-wide italic block font-semibold">Bespoke Artistry</span>
                  <span className="font-sans text-[9px] text-brand-cream/70 tracking-widest uppercase block mt-1">Glam & Glow Salon</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Stats Section with Animate Counters */}
      <section className="bg-brand-charcoal text-brand-cream py-14 md:py-18 relative">
        <div className="absolute inset-0 bg-radial-at-t from-transparent to-black/30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-brand-champagne/15">
            {stats.map((stat, idx) => (
              <StatItem key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center space-y-3 mb-16"
        >
          <motion.span variants={itemVariants} className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold block">
            Our Signature Craft
          </motion.span>
          <motion.h2 variants={itemVariants} className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light tracking-tight">
            Featured Rituals
          </motion.h2>
          <motion.div variants={itemVariants} className="gold-foil-line w-40 mx-auto mt-4" />
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredServices.map((srv, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group bg-brand-charcoal border border-brand-champagne/30 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              id={`featured-card-${idx}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={srv.image} 
                  alt={srv.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal text-[9px] tracking-widest uppercase px-3 py-1.5 font-sans font-bold">
                  {srv.category}
                </span>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-serif text-xl font-medium text-brand-cream group-hover:text-brand-gold transition-colors duration-200">
                      {srv.title}
                    </h3>
                    <span className="font-sans text-xs text-brand-gold font-semibold shrink-0 bg-white/5 border border-brand-gold/20 py-0.5 px-2.5">
                      {srv.price}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-brand-cream/70 leading-relaxed font-light">
                    {srv.desc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 font-sans text-xs tracking-wider uppercase text-brand-gold hover:text-white font-bold transition-colors duration-200 cursor-pointer pt-4 border-t border-brand-champagne/10 mt-2"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Why Choose Us Section with visual gold split */}
      <section className="bg-brand-charcoal text-brand-cream py-24 border-y border-brand-gold/25 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Picture frame */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="border border-brand-champagne p-3.5 bg-brand-charcoal shadow-2xl rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Elegant interior at Glam N Glow" 
                  className="w-full h-[520px] object-cover rounded-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-brand-cream text-brand-charcoal p-8 max-w-xs border-l-4 border-brand-gold shadow-2xl">
                <p className="font-serif text-lg font-light text-brand-charcoal italic leading-relaxed">
                  "Since day one, we set out to craft an oasis of serene hospitality."
                </p>
                <p className="font-sans text-[10px] tracking-widest uppercase text-brand-warm-gray mt-4 font-semibold">— Elena R., Founder</p>
              </div>
            </motion.div>

            {/* Right Column: Copy and Core Pillars */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Premium Experience</span>
                <h2 className="font-serif text-3xl sm:text-5xl text-brand-cream font-light tracking-tight">
                  The Salon Artistry Standards
                </h2>
                <div className="gold-foil-line w-24 mt-2" />
              </div>
              
              <p className="font-sans text-sm sm:text-base text-brand-cream/80 font-light leading-relaxed">
                At Glam N Glow Beauty Bar, we believe every visit should be an immersive sensory retreat. Our master stylists undergo regular advanced training in European and Asian cosmetic applications to secure perfect technical outcomes.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-none border border-brand-gold/30 text-brand-gold shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-cream">Master Stylist Expertise</h3>
                    <p className="font-sans text-sm text-brand-cream/70 font-light mt-1 leading-relaxed">Our certified cosmetologists possess over a decade of hands-on hair coloring and aesthetic treatment expertise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-none border border-brand-gold/30 text-brand-gold shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-cream">100% Organic Sugaring & Natural Care</h3>
                    <p className="font-sans text-sm text-brand-cream/70 font-light mt-1 leading-relaxed">We utilize hypoallergenic, non-toxic formulations for hair removal and skin treatments to prioritize skin safety.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-none border border-brand-gold/30 text-brand-gold shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-cream">Impeccable Sanitization</h3>
                    <p className="font-sans text-sm text-brand-cream/70 font-light mt-1 leading-relaxed">We enforce hospital-grade cleaning and individual autoclavable instruments for all permanent makeup procedures.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center space-y-3 mb-16"
        >
          <motion.span variants={itemVariants} className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold block">
            Salon Guest Reviews
          </motion.span>
          <motion.h2 variants={itemVariants} className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light tracking-tight">
            Our Glowing Reputations
          </motion.h2>
          <motion.div variants={itemVariants} className="gold-foil-line w-40 mx-auto mt-4" />
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {TESTIMONIALS.map((test, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-brand-charcoal border border-brand-champagne/30 p-8 space-y-4 flex flex-col justify-between shadow-xl transition-all duration-300"
              id={`testimonial-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="flex text-brand-gold gap-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-brand-cream leading-relaxed font-light">
                  "{test.text}"
                </p>
              </div>
              <div className="pt-4 border-t border-brand-champagne/15 flex justify-between items-center">
                <div>
                  <span className="block font-sans text-xs font-semibold text-brand-cream">{test.name}</span>
                  <span className="block font-sans text-[10px] text-brand-cream/60">{test.date}</span>
                </div>
                <span className="font-sans text-[9px] tracking-wider uppercase bg-brand-gold/15 px-2.5 py-1 text-brand-gold font-bold border border-brand-gold/30 rounded-none">
                  {test.source}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. Call-To-Action (CTA) with parallax image background */}
      <section className="bg-brand-charcoal text-brand-cream relative py-28 text-center border-t border-brand-gold/30">
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920&h=600" 
            alt="Glam N Glow design context" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Deep emerald glass backdrop filter overlay */}
        <div className="absolute inset-0 bg-radial-at-c from-brand-charcoal/80 to-brand-charcoal pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-8">
          <span className="font-sans text-xs tracking-[0.25em] text-brand-gold uppercase font-bold block">Experience the Glow</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-brand-cream">
            Ready to Secure Your Radiant Look?
          </h2>
          <div className="gold-foil-line w-24 mx-auto" />
          <p className="font-sans text-sm sm:text-base text-brand-cream/80 max-w-lg mx-auto font-light leading-relaxed">
            Appointments fill up quickly. Secure your premium slot today with our master beauty consultants.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-gold hover:bg-white text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4.5 px-10 transition-all duration-300 font-bold cursor-pointer shadow-2xl inline-block gold-glow"
              id="cta-book-btn"
            >
              Book My Appointment Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
