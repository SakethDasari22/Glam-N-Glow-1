export interface ServiceItem {
  name: string;
  price: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  category: string;
  description: string;
  icon: string; // lucide icon name
  services: ServiceItem[];
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  date: string;
  source: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  image: string;
}

export interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

export interface ClaimedReward {
  id: string;
  rewardId: string;
  title: string;
  pointsCost: number;
  code: string;
  used: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  claimedRewards: ClaimedReward[];
}

export interface Booking {
  id: string;
  userId: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceName: string;
  priceValue: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message?: string;
}
