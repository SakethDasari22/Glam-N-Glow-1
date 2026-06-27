import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Star } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-charcoal text-brand-cream/90 pt-16 pb-8 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-brand-champagne/10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col cursor-pointer" onClick={() => handleNavClick('home')} id="footer-logo">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-brand-cream uppercase hover:text-brand-gold transition-colors duration-300">
                Glam N Glow
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] text-brand-gold uppercase font-semibold">
                Beauty Bar
              </span>
            </div>
            <p className="font-sans text-sm text-brand-cream/70 leading-relaxed font-light">
              Where beauty meets glow. Providing Aurora with European-grade hair coloring, custom facials, natural sugaring, and certified permanent makeup since {BUSINESS_INFO.established}.
            </p>
            <div className="flex items-center gap-2 text-brand-gold">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-semibold font-sans">
                {BUSINESS_INFO.rating} Stars ({BUSINESS_INFO.reviewsCount}+ Reviews)
              </span>
            </div>
          </div>

          {/* Column 2: Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-brand-gold tracking-wider font-semibold">
              Hours of Glow
            </h3>
            <ul className="space-y-2 font-sans text-sm text-brand-cream/70 font-light">
              {BUSINESS_INFO.hours.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-brand-champagne/5 pb-1">
                  <span>{item.day}:</span>
                  <span className={item.time === 'Closed' ? 'text-red-400 font-normal' : ''}>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-brand-gold tracking-wider font-semibold">
              Visit Us
            </h3>
            <ul className="space-y-3 font-sans text-sm text-brand-cream/70 font-light">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>
                  {BUSINESS_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brand-gold transition-colors duration-200">
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-brand-gold transition-colors duration-200 break-all">
                  {BUSINESS_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Links & Social */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-brand-gold tracking-wider font-semibold">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2 font-sans text-sm text-brand-cream/70 font-light">
              <button onClick={() => handleNavClick('home')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">Home</button>
              <button onClick={() => handleNavClick('services')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">Services</button>
              <button onClick={() => handleNavClick('gallery')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">Gallery</button>
              <button onClick={() => handleNavClick('about')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">About Us</button>
              <button onClick={() => handleNavClick('contact')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">Contact</button>
              <button onClick={() => handleNavClick('contact')} className="text-left hover:text-brand-gold transition-colors py-1 cursor-pointer">Book Now</button>
            </div>
            
            <div className="pt-2">
              <h4 className="font-sans text-xs tracking-widest uppercase text-brand-gold font-semibold mb-3">
                Follow Our Journey
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-brand-cream/5 hover:bg-brand-gold hover:text-brand-charcoal text-brand-cream p-2.5 rounded-full transition-all duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-brand-cream/5 hover:bg-brand-gold hover:text-brand-charcoal text-brand-cream p-2.5 rounded-full transition-all duration-300"
                  aria-label="Like us on Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-brand-cream/40 font-light">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Established 2010 • Aurora, IL</span>
            <span>|</span>
            <span className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('about')}>Our Mission</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
