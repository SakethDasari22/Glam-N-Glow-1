import React from 'react';
import { motion } from 'motion/react';
import { Star, Scissors, Sparkles, Award, ShieldCheck, Heart, ChevronRight } from 'lucide-react';
import { BUSINESS_INFO, TESTIMONIALS } from '../data';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
}

export default function HomeView({ setCurrentPage }: HomeViewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <div className="bg-brand-cream text-brand-charcoal overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 md:px-8 bg-brand-blush/40">
        {/* Background visual overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Glam N Glow salon experience" 
            className="w-full h-full object-cover opacity-15 filter sepia-[20%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-brand-cream/80 to-brand-cream"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 text-brand-gold uppercase tracking-[0.25em] text-xs font-semibold"
          >
            <Sparkles size={14} />
            <span>Naperville’s Premium Beauty Sanctuary</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-brand-charcoal leading-[1.1]"
          >
            Where Beauty <br />
            <span className="font-serif italic text-brand-gold font-normal">Meets Glow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-sans text-base sm:text-lg text-brand-warm-gray max-w-2xl mx-auto font-light leading-relaxed"
          >
            Step into a beautifully quiet space of tailored luxury. From European-grade airtouch hair color to restorative skincare rituals, our artists craft elegant results unique to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4.5 px-8 transition-all duration-300 font-medium cursor-pointer shadow-md"
              id="hero-book-btn"
            >
              Book Consultation
            </button>
            <button
              onClick={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-transparent hover:bg-brand-champagne/40 text-brand-charcoal border border-brand-charcoal/30 hover:border-brand-charcoal font-sans text-xs tracking-widest uppercase py-4.5 px-8 transition-all duration-300 font-medium cursor-pointer"
              id="hero-services-btn"
            >
              Explore Services
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-brand-cream/10">
            {stats.map((stat, idx) => (
              <div key={idx} className="first:border-none border-brand-cream/10 pl-2">
                <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-gold font-light tracking-wide">
                  {stat.value}
                </p>
                <p className="font-sans text-xs sm:text-sm tracking-widest uppercase text-brand-cream/60 mt-2 font-light">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Our Signature Craft</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light tracking-tight">Featured Rituals</h2>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((srv, idx) => (
            <div 
              key={idx} 
              className="group bg-white border border-brand-champagne/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              id={`featured-card-${idx}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={srv.image} 
                  alt={srv.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-brand-charcoal text-brand-cream text-[10px] tracking-widest uppercase px-3 py-1.5 font-sans font-light">
                  {srv.category}
                </span>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-serif text-xl font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors duration-200">
                    {srv.title}
                  </h3>
                  <span className="font-mono text-sm text-brand-gold font-semibold shrink-0">{srv.price}</span>
                </div>
                <p className="font-sans text-sm text-brand-warm-gray leading-relaxed font-light">
                  {srv.desc}
                </p>
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 font-sans text-xs tracking-wider uppercase text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors duration-200 cursor-pointer pt-2"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="bg-brand-blush/30 py-24 border-y border-brand-champagne/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Image Montage / Big Photo */}
            <div className="relative">
              <div className="border border-brand-gold/20 p-3 bg-brand-cream">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Elegant interior at Glam N Glow" 
                  className="w-full h-[550px] object-cover grayscale-[10%]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-brand-charcoal text-brand-cream p-8 max-w-xs border-l-4 border-brand-gold">
                <p className="font-serif text-2xl font-light text-brand-gold italic">"Since day one, we set out to craft an oasis of serene hospitality."</p>
                <p className="font-sans text-xs tracking-widest uppercase text-brand-cream/60 mt-4">— Elena R., Founder</p>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Premium Experience</span>
                <h2 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light tracking-tight">
                  The Salon Artistry Standards
                </h2>
              </div>
              
              <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light leading-relaxed">
                At Glam N Glow Beauty Bar, we believe every visit should be an immersive sensory retreat. Our master stylists undergo regular advanced training in European and Asian cosmetic applications to secure perfect technical outcomes.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-none border border-brand-champagne/60 text-brand-gold">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-charcoal">Master Stylist Expertise</h3>
                    <p className="font-sans text-sm text-brand-warm-gray font-light mt-1">Our certified cosmetologists possess over a decade of hands-on hair coloring and aesthetic treatment expertise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-none border border-brand-champagne/60 text-brand-gold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-charcoal">100% Organic Sugaring & Natural Care</h3>
                    <p className="font-sans text-sm text-brand-warm-gray font-light mt-1">We utilize hypoallergenic, non-toxic formulations for hair removal and skin treatments to prioritize skin safety.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-none border border-brand-champagne/60 text-brand-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-charcoal">Impeccable Sanitization</h3>
                    <p className="font-sans text-sm text-brand-warm-gray font-light mt-1">We enforce hospital-grade cleaning and individual autoclavable instruments for all permanent makeup procedures.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Salon Guest Reviews</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light tracking-tight">Our Glowing Reputations</h2>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-brand-champagne/40 p-8 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-sm"
              id={`testimonial-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-brand-charcoal leading-relaxed font-light">
                  "{test.text}"
                </p>
              </div>
              <div className="pt-4 border-t border-brand-champagne/30 flex justify-between items-center">
                <div>
                  <span className="block font-sans text-xs font-semibold text-brand-charcoal">{test.name}</span>
                  <span className="block font-sans text-[10px] text-brand-warm-gray">{test.date}</span>
                </div>
                <span className="font-sans text-[10px] tracking-wider uppercase bg-brand-blush px-2 py-1 text-brand-gold font-semibold rounded-xs">
                  {test.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Hero Call-To-Action (CTA) */}
      <section className="bg-brand-charcoal text-brand-cream relative py-24 text-center border-t border-brand-gold/30">
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920&h=600" 
            alt="Glam N Glow design context" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-6">
          <span className="font-sans text-xs tracking-[0.25em] text-brand-gold uppercase font-semibold block">Experience the Glow</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-brand-cream">
            Ready to Secure Your Radiant Look?
          </h2>
          <p className="font-sans text-sm text-brand-cream/75 max-w-lg mx-auto font-light leading-relaxed">
            Appointments fill up quickly. Secure your premium slot today with our master beauty consultants.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-gold hover:bg-brand-gold-dark text-brand-charcoal hover:text-brand-cream font-sans text-xs tracking-widest uppercase py-4.5 px-10 transition-all duration-300 font-semibold cursor-pointer rounded-none inline-block shadow-lg"
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
