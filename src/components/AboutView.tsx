import React from 'react';
import { motion } from 'motion/react';
import { Star, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { TEAM, BUSINESS_INFO } from '../data';

export default function AboutView() {
  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Title Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Our Heritage</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Our Story & Mission</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Glam N Glow Beauty Bar was founded with a singular conviction: to craft a luxurious sanctuary where personalized cosmetic science meets premium hospitality.
          </p>
        </div>

        {/* 1. Brand Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Big Brand Story Text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-semibold">Established 2010</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-brand-charcoal">
                Sixteen Years of Curating Elegance in Naperville
              </h2>
            </div>
            
            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              Glam N Glow Beauty Bar opened its doors in Naperville, IL back in 2010. Founded by master artist Elena Rostova, our beauty bar has grown from a specialized boutique hair salon into a comprehensive, award-winning beauty bar.
            </p>

            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              We focus on technical precision and skin-safe care. Elena's background in European design inspired her to integrate the latest advanced color formulations, such as Airtouch and Shatush highlights, which were previously unavailable in the local Chicagoland area.
            </p>

            <p className="font-sans text-sm sm:text-base text-brand-warm-gray leading-relaxed font-light">
              Today, we have expanded our services to incorporate clinical facials, gentle organic sugaring hair removal, and highly detailed permanent cosmetic applications. Our goal remains unchanged: to design an intimate space where you feel heard, pampered, and ultimately leave with a healthy, confident glow.
            </p>
          </div>

          {/* Right: Picture Frame */}
          <div className="relative">
            <div className="border border-brand-gold/20 p-3 bg-white">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800&h=800" 
                alt="Beautiful Glam N Glow salon vanity" 
                className="w-full h-[450px] object-cover grayscale-[5%]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Absolute badge */}
            <div className="absolute -top-6 -left-6 bg-brand-charcoal text-brand-cream py-6 px-8 border-l-4 border-brand-gold shadow-lg hidden sm:block">
              <p className="font-serif text-3xl text-brand-gold font-light">16+</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-brand-cream/60 mt-1">Years of Luxury Craft</p>
            </div>
          </div>

        </div>

        {/* 2. Core Pillars & Mission */}
        <div className="bg-brand-blush/40 border border-brand-champagne/60 p-10 sm:p-16 space-y-12">
          <div className="text-center space-y-3">
            <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-semibold">Our Core Commitments</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-light">The Philosophy We Honor Daily</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 space-y-4 border border-brand-champagne/40">
              <div className="text-brand-gold"><Award size={24} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Unparalleled Training</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-warm-gray font-light leading-relaxed">
                We believe that cosmetic trends and sciences never stand still. Our artists undergo quarterly workshops in advanced microblading, color science, and skin safety.
              </p>
            </div>

            <div className="bg-white p-8 space-y-4 border border-brand-champagne/40">
              <div className="text-brand-gold"><Heart size={24} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Clean, Active Ingredients</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-warm-gray font-light leading-relaxed">
                From our natural lemon-juice sugar paste to our premium hair lighteners, we source organic, sulfate-free, and clean products to protect your natural barrier.
              </p>
            </div>

            <div className="bg-white p-8 space-y-4 border border-brand-champagne/40">
              <div className="text-brand-gold"><ShieldCheck size={24} /></div>
              <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Warm, Personal Care</h3>
              <p className="font-sans text-xs sm:text-sm text-brand-warm-gray font-light leading-relaxed">
                We never rush or double-book appointments. Your stylist is dedicated fully to you during your booked slot, offering bespoke consulting and custom champagne care.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Team Showcase */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="font-sans text-xs tracking-widest text-brand-gold uppercase font-semibold">Meet the Artisans</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-light">Our Expert Beauty Team</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <div 
                key={idx}
                className="bg-white border border-brand-champagne/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group"
                id={`team-card-${idx}`}
              >
                {/* Photo frame */}
                <div className="h-96 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Team metadata */}
                <div className="p-8 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors duration-200">
                      {member.name}
                    </h3>
                    <span className="font-sans text-xs text-brand-gold font-semibold uppercase tracking-wider block mt-0.5">
                      {member.role}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-brand-warm-gray leading-relaxed font-light">
                    {member.bio}
                  </p>

                  <div className="pt-2">
                    <span className="font-sans text-[10px] tracking-widest text-brand-charcoal uppercase font-bold block mb-2">Specialties</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialties.map((spec, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="bg-brand-blush text-brand-gold-dark text-[10px] font-medium px-2.5 py-1 uppercase tracking-wider font-sans border border-brand-champagne/30"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
