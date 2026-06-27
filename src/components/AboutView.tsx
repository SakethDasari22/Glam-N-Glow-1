import React from 'react';
import { motion } from 'motion/react';
import { Star, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { TEAM, BUSINESS_INFO } from '../data';

export default function AboutView() {
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

  return (
    <div className="bg-brand-cream text-brand-dark-text min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Title Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-bold">Our Heritage</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Our Story & Mission</h1>
          <div className="gold-foil-line w-40 mx-auto mt-4" />
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Glam N Glow Beauty Bar was founded with a singular conviction: to craft a luxurious sanctuary where personalized cosmetic science meets premium hospitality.
          </p>
        </motion.div>

        {/* 1. Brand Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Big Brand Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-bold">Established 2010</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-brand-charcoal leading-tight">
                Sixteen Years of Curating Elegance in Aurora
              </h2>
              <div className="gold-foil-line w-24 mt-2" />
            </div>
            
            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              Glam N Glow Beauty Bar opened its doors in Aurora, IL back in 2010. Founded by master artist Elena Rostova, our beauty bar has grown from a specialized boutique hair salon into a comprehensive, award-winning beauty sanctuary.
            </p>

            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              We focus on technical precision and skin-safe care. Elena's background in European design inspired her to integrate the latest advanced color formulations, such as Airtouch and Shatush highlights, which were previously unavailable in the local Chicagoland area.
            </p>

            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              Today, we have expanded our services to incorporate clinical facials, gentle organic sugaring hair removal, and highly detailed permanent cosmetic applications. Our goal remains unchanged: to design an intimate space where you feel heard, pampered, and ultimately leave with a healthy, confident glow.
            </p>
          </motion.div>

          {/* Right: Picture Frame (cropped with double gold border) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative group">
              {/* Gold glow outline */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-brand-gold to-transparent rounded-lg blur opacity-20" />
              
              <div className="relative border-2 border-brand-champagne p-3 bg-brand-charcoal rounded-lg shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800&h=800" 
                  alt="Beautiful Glam N Glow salon vanity" 
                  className="w-full h-[450px] object-cover rounded-sm group-hover:scale-[1.01] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Absolute badge */}
            <div className="absolute -top-6 -left-6 bg-brand-charcoal text-brand-cream py-5 px-8 border-l-4 border-brand-gold shadow-2xl hidden sm:block">
              <p className="font-serif text-3xl text-brand-gold font-light">16+</p>
              <p className="font-sans text-[9px] tracking-widest uppercase text-brand-cream/60 mt-1">Years of Luxury Craft</p>
            </div>
          </motion.div>

        </div>

        {/* 2. Core Pillars & Mission */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-brand-charcoal border border-brand-champagne/30 p-10 sm:p-16 space-y-12 shadow-2xl relative overflow-hidden rounded-lg"
        >
          {/* Radial glow background effect */}
          <div className="absolute inset-0 bg-radial-at-t from-brand-blush/25 to-transparent pointer-events-none" />

          <div className="text-center space-y-3 relative z-10">
            <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-bold">Our Core Commitments</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-brand-cream font-light">The Philosophy We Honor Daily</h2>
            <div className="gold-foil-line w-32 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <motion.div variants={itemVariants} className="bg-brand-charcoal border border-brand-champagne/20 p-8 space-y-4 hover:border-brand-gold/60 transition-colors duration-300">
              <div className="text-brand-gold"><Award size={26} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-cream">Unparalleled Training</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-cream/75 font-light leading-relaxed">
                We believe that cosmetic trends and sciences never stand still. Our artists undergo quarterly workshops in advanced microblading, color science, and skin safety.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-brand-charcoal border border-brand-champagne/20 p-8 space-y-4 hover:border-brand-gold/60 transition-colors duration-300">
              <div className="text-brand-gold"><Heart size={26} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-cream">Clean, Active Ingredients</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-cream/75 font-light leading-relaxed">
                From our natural lemon-juice sugar paste to our premium hair lighteners, we source organic, sulfate-free, and clean products to protect your natural barrier.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-brand-charcoal border border-brand-champagne/20 p-8 space-y-4 hover:border-brand-gold/60 transition-colors duration-300">
              <div className="text-brand-gold"><ShieldCheck size={26} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-cream">Warm, Personal Care</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-cream/75 font-light leading-relaxed">
                We never rush or double-book appointments. Your stylist is dedicated fully to you during your booked slot, offering bespoke consulting and custom champagne care.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 3. Team Showcase */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-bold">Meet the Artisans</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light">Our Expert Beauty Team</h2>
            <div className="gold-foil-line w-40 mx-auto mt-4" />
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {TEAM.map((member, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="bg-brand-charcoal border border-brand-champagne/30 overflow-hidden shadow-2xl transition-all duration-300 group"
                id={`team-card-${idx}`}
              >
                {/* Photo frame */}
                <div className="h-96 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Team metadata */}
                <div className="p-8 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-brand-cream group-hover:text-brand-gold transition-colors duration-200">
                      {member.name}
                    </h3>
                    <span className="font-sans text-xs text-brand-gold font-semibold uppercase tracking-wider block mt-1">
                      {member.role}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-brand-cream/70 leading-relaxed font-light">
                    {member.bio}
                  </p>

                  <div className="pt-2">
                    <span className="font-sans text-[10px] tracking-widest text-brand-gold uppercase font-bold block mb-2">Specialties</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialties.map((spec, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="bg-brand-gold/10 text-brand-gold text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider font-sans border border-brand-gold/25"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
