import { ServiceCategory, Testimonial, TeamMember } from './types';

export const BUSINESS_INFO = {
  name: 'Glam N Glow Beauty Bar',
  tagline: 'Where Beauty Meets Glow',
  address: '4255 Westbrook Dr, Unit 207, Aurora, IL 60504',
  phone: '(872) 400-0706',
  email: 'hello@glamnglowbeautybar.com',
  hours: [
    { day: 'Tuesday', time: '10:00 AM – 7:00 PM' },
    { day: 'Wednesday', time: '10:00 AM – 7:00 PM' },
    { day: 'Thursday', time: '10:00 AM – 7:00 PM' },
    { day: 'Friday', time: '10:00 AM – 7:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 7:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 7:00 PM' },
    { day: 'Monday', time: 'Closed' }
  ],
  rating: 4.8,
  reviewsCount: 18,
  established: 2010
};

export const SERVICES: ServiceCategory[] = [
  {
    id: 'hair',
    category: 'Hair',
    description: 'Transform your hair with our premier cut, coloring, and signature styling techniques managed by master stylists.',
    icon: 'Scissors',
    services: [
      {
        name: "Women's & Men's Haircuts",
        price: 'from $75',
        description: 'Precision cuts tailored to your facial structure, hair type, and lifestyle, including a luxurious wash and finished blowdry.'
      },
      {
        name: 'Hair Coloring (All Complexity)',
        price: 'from $110',
        description: 'All-inclusive single process, root retouches, or global color corrections utilizing premium formulas to protect your hair integrity.'
      },
      {
        name: 'Ombré',
        price: 'from $180',
        description: 'A striking, low-maintenance color gradient showcasing a deeper root color blending seamlessly into beautifully lightened ends.'
      },
      {
        name: 'Balayage',
        price: 'from $190',
        description: 'Bespoke hand-painted dimensional highlights that create a beautifully soft, sun-kissed, natural regrowth pattern.'
      },
      {
        name: 'Highlighting',
        price: 'from $130',
        description: 'Full or partial custom foil placements to add gorgeous depth, high contrast brightness, and vibrant tone and texture.'
      },
      {
        name: 'Airtouch',
        price: 'from $240',
        description: 'State-of-the-art highlighting technique using cool air to separate hair, ensuring absolute seamless blending and soft transitions.'
      },
      {
        name: 'Shatush',
        price: 'from $210',
        description: 'A subtle backcombed hand-painting method originating in Europe, creating an effortlessly soft, natural lightened effect.'
      },
      {
        name: 'Blowout & Styling',
        price: 'from $55',
        description: 'A relaxing wash, hydrating condition, signature blowout, and flat or curling iron styling for instant polish and volume.'
      }
    ]
  },
  {
    id: 'skincare',
    category: 'Facials & Skincare',
    description: 'Reinvigorate your skin and achieve a glowing complexion with clinical-grade facial rituals and customized resurfacing.',
    icon: 'Sparkles',
    services: [
      {
        name: 'Signature Facials',
        price: 'from $95',
        description: 'A multi-step customized botanical facial featuring deep double cleansing, mild extractions, nourishing mask, and a face massage.'
      },
      {
        name: 'Anti-Aging Facials',
        price: 'from $125',
        description: 'Collagen-boosting peptides and micro-current therapy designed to lift, firm, hydrate, and restore youthful elasticity.'
      },
      {
        name: 'Chemical Peels',
        price: 'from $115',
        description: 'Gentle medical-grade acid peels designed to speed up cell turnover, treat fine lines, and clarify blemishes and pigmentation.'
      },
      {
        name: 'Microdermabrasion',
        price: 'from $130',
        description: 'Non-invasive diamond-tip physical exfoliation that resurfaces the outer skin layer to instantly reveal smooth, radiant skin.'
      }
    ]
  },
  {
    id: 'hair-removal',
    category: 'Hair Removal',
    description: 'Enjoy ultra-smooth skin with our gentle, meticulous hair removal services using all-natural sugars or premium hard waxes.',
    icon: 'Flame',
    services: [
      {
        name: 'Sugaring',
        price: 'from $45',
        description: 'Hypoallergenic organic lemon-sugar-water paste technique applied in direction of hair growth for less discomfort and long-lasting smoothness.'
      },
      {
        name: 'Waxing',
        price: 'from $30',
        description: 'Gentle, fast hair removal using top-tier elastic hard waxes perfect for sensitive facial or full body skin zones.'
      },
      {
        name: 'Threading',
        price: 'from $20',
        description: 'Traditional hair removal technique using cotton thread for high-precision brow shaping and facial hair removal.'
      }
    ]
  },
  {
    id: 'nails',
    category: 'Nails',
    description: 'Pamper your hands and feet with professional manicures, strengthening builder gels, and custom hand-painted nail designs.',
    icon: 'Sparkles',
    services: [
      {
        name: 'Manicure',
        price: 'from $35',
        description: 'Warm soak, detailed cuticle care, nail shaping, moisturizing massage, and high-shine regular or long-lasting gel polish.'
      },
      {
        name: 'Nail Care & Nail Art',
        price: 'from $55',
        description: 'Strength-boosting builder gel overlays and intricate hand-painted designs ranging from minimalist accents to 3D gems.'
      }
    ]
  },
  {
    id: 'permanent-makeup',
    category: 'Permanent Makeup',
    description: 'Wake up ready with effortless, semi-permanent cosmetic enhancements curated carefully by our certified micro-pigmentation artists.',
    icon: 'Eye',
    services: [
      {
        name: 'Brows (Microblading)',
        price: 'from $450',
        description: 'Ultra-fine hair-like strokes tattooed to create full, balanced, and highly natural eyebrows designed specifically for your brow structure.'
      },
      {
        name: 'Permanent Makeup Application',
        price: 'from $380',
        description: 'Enhance your eyes or lips with smudge-proof cosmetic eyeliner or elegant blushing pigments that restore symmetry and color.'
      },
      {
        name: 'Touch-Ups',
        price: 'from $150',
        description: 'Perfecting or annual color boost sessions to revive pigments and refine lines for brows, eyeliner, or lip contours.'
      },
      {
        name: 'Consultation',
        price: 'Free',
        description: 'Complimentary consultation to discuss mapping, medical history, custom colors, and pre/post-care instructions.'
      }
    ]
  },
  {
    id: 'lashes',
    category: 'Lashes',
    description: 'Frame your eyes with precision lash extensions or gentle lifting treatments designed to maximize length and definition.',
    icon: 'Heart',
    services: [
      {
        name: 'Eyelash Extensions',
        price: 'from $150',
        description: 'Individually applied synthetic mink or silk lash extensions ranging from elegant classic sets to multi-dimensional volume fans.'
      },
      {
        name: 'Lash Lift',
        price: 'from $85',
        description: 'Perm-free structural lift and deep keratin infusion that semi-permanently curls and darkens your own natural lashes for 6–8 weeks.'
      }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rebecca M.',
    rating: 5,
    text: 'Glam N Glow is absolutely top tier! I had the Airtouch hair coloring done here, and it looks incredibly natural and healthy. The staff is so warm and welcoming, and the salon is gorgeous. Will never go anywhere else!',
    date: '2 weeks ago',
    source: 'Google'
  },
  {
    name: 'Sophia L.',
    rating: 5,
    text: 'I scheduled a Signature Facial and a brow microblading session. The esthetician was so informative and gentle, explaining every step. My skin literally glows and my eyebrows are perfectly mapped. Ten out of ten!',
    date: '1 month ago',
    source: 'Yelp'
  },
  {
    name: 'Emily T.',
    rating: 5,
    text: 'I have been a client of Glam N Glow since they established in Aurora. Their commitment to detail is incredible. The Sugaring is the best I have ever had—extremely gentle. Highly recommend!',
    date: '3 weeks ago',
    source: 'Google'
  },
  {
    name: 'Sarah K.',
    rating: 5,
    text: 'The best balayage in Illinois! Their master stylists know exactly how to blend the hair perfectly. The champagne interior makes you feel so pampered. Worth every dollar!',
    date: '2 months ago',
    source: 'Google'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Elena Rostova',
    role: 'Founder & Master Stylist',
    bio: 'With over 18 years of global beauty experience, Elena founded Glam N Glow in 2010 to bring European-precision hair coloring, balayage, and Airtouch technology to Aurora.',
    specialties: ['Airtouch Highlights', 'Balayage Color', 'Precision Haircuts'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=750'
  },
  {
    name: 'Marina Petrova',
    role: 'Lead Skincare Specialist',
    bio: 'Marina is a licensed clinical esthetician specializing in personalized anti-aging therapies, chemical resurfacing, and natural sugaring techniques.',
    specialties: ['Clinical Facials', 'Sugaring Hair Removal', 'Microdermabrasion'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=750'
  },
  {
    name: 'Anna Williams',
    role: 'Certified PMU Artist',
    bio: 'Anna has completed extensive certifications in permanent cosmetics, mapping, and fine-line tattooing to construct beautiful microbladed eyebrows and lip blushes.',
    specialties: ['Brow Microblading', 'Lip Blushing', 'Lash Extensions'],
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600&h=750'
  }
];

export const GALLERY_PHOTOS = [
  {
    title: 'Airtouch Blended Highlights',
    category: 'Hair',
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Perfect Brow Microblading',
    category: 'Permanent Makeup',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Signature Hydrating Facial',
    category: 'Skincare',
    url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Warm Balayage Ombré',
    category: 'Hair',
    url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Classic Eyelash Extensions',
    category: 'Lashes',
    url: 'https://images.unsplash.com/photo-1582284540020-8acdf03f48f4?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Precision Cut & Blowout',
    category: 'Hair',
    url: 'https://images.unsplash.com/photo-1605497746444-17dfd33f400f?auto=format&fit=crop&q=80&w=800&h=600'
  }
];
