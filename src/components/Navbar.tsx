import React, { useState } from 'react';
import { Menu, X, Star } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'About', value: 'about' },
    { label: 'Book Now', value: 'contact' },
    { label: 'My Account', value: 'account' },
  ];

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-champagne/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex flex-col cursor-pointer group"
            onClick={() => handleNavClick('home')}
            id="nav-logo"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-widest text-brand-charcoal uppercase group-hover:text-brand-gold transition-colors duration-300">
                Glam N Glow
              </span>
            </div>
            <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] text-brand-warm-gray uppercase -mt-0.5 font-semibold">
              Beauty Bar
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`font-sans text-sm tracking-wider uppercase transition-all duration-300 relative py-1 cursor-pointer ${
                  currentPage === item.value
                    ? 'text-brand-gold font-semibold'
                    : 'text-brand-charcoal hover:text-brand-gold'
                }`}
                id={`desktop-nav-${item.value}`}
              >
                {item.label}
                {currentPage === item.value && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold" />
                )}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('contact')}
              className="bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-3 px-6 rounded-none transition-all duration-300 border border-brand-charcoal hover:border-brand-gold font-medium cursor-pointer"
              id="desktop-book-btn"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-charcoal hover:text-brand-gold p-2 cursor-pointer"
              aria-expanded="false"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream/98 border-b border-brand-champagne/80 absolute w-full left-0 z-40 transition-all duration-300 ease-in-out shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`block w-full text-left font-sans text-base tracking-widest uppercase py-2.5 px-3 border-b border-brand-champagne/30 cursor-pointer ${
                  currentPage === item.value
                    ? 'text-brand-gold font-bold bg-brand-gold/10'
                    : 'text-brand-charcoal hover:text-brand-gold'
                }`}
                id={`mobile-nav-${item.value}`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 px-3">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full text-center bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-sm tracking-widest uppercase py-3.5 px-4 transition-all duration-300 border border-brand-charcoal hover:border-brand-gold cursor-pointer"
                id="mobile-book-btn"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
