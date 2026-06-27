import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone as PhoneIcon, 
  Award, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Gift, 
  ArrowRight, 
  LogOut, 
  Tag, 
  Activity, 
  Scissors, 
  Sparkles,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { SERVICES } from '../data';
import { User, Booking } from '../types';
import { googleSignIn, googleSignOut } from '../firebase';

// Loyalty rewards configuration
export const REWARDS = [
  { id: 'reward-10-percent', title: '10% Off Any Hair Service', cost: 150, description: 'Redeem for a 10% discount on any precision cut, coloring, Airtouch, or balayage.' },
  { id: 'reward-free-blowout', title: 'Free Blowout & Styling', cost: 300, description: 'Redeem for a complimentary relaxing wash, treatment, and signature blowout.' },
  { id: 'reward-free-facial', title: 'Free Signature Facial', cost: 500, description: 'Redeem for a deluxe 60-minute multi-step botanical skin ritual.' },
  { id: 'reward-free-nails', title: 'Free Nail Care & Custom Art', cost: 800, description: 'Redeem for a luxury builder-gel manicure with custom hand-painted nail art.' }
];

interface AccountViewProps {
  onLoginStatusChange?: (user: User | null) => void;
}

export default function AccountView({ onLoginStatusChange }: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Business Owner Admin / Google Calendar Settings states
  const [settings, setSettings] = useState<any>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'connected' | 'unlinked'>('unlinked');
  const [ownerGoogleEmail, setOwnerGoogleEmail] = useState('');
  const [adminSaveSuccess, setAdminSaveSuccess] = useState('');
  const [adminSaveError, setAdminSaveError] = useState('');

  // Editable configurations states
  const [adminClosedDays, setAdminClosedDays] = useState<number[]>([]);
  const [adminDuration, setAdminDuration] = useState<number>(60);
  const [adminTimeslots, setAdminTimeslots] = useState<string[]>([]);
  const [adminTimezone, setAdminTimezone] = useState<string>('America/Chicago');
  const [newTimeslotInput, setNewTimeslotInput] = useState<string>('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // UI feedback states
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (response.ok && data.success && data.settings) {
          setSettings(data.settings);
          setAdminTimeslots(data.settings.timeslots || []);
          setAdminClosedDays(data.settings.businessHours?.closedDays || []);
          setAdminDuration(data.settings.appointmentDurationMinutes || 60);
          setAdminTimezone(data.settings.timezone || 'America/Chicago');
          
          if (data.settings.googleOwnerToken) {
            setLinkStatus('connected');
            setOwnerGoogleEmail(data.settings.ownerEmail || 'sdasari8921@gmail.com');
          } else {
            setLinkStatus('unlinked');
          }
        }
      } catch (err) {
        console.error('Failed to load settings in AccountView:', err);
      }
    }
    loadSettings();
  }, []);

  // Load user session from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('salon_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
      if (onLoginStatusChange) onLoginStatusChange(parsedUser);
      fetchUserProfile(parsedUser.id);
      fetchUserBookings(parsedUser.id);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const response = await fetch(`/api/user/${userId}/profile`);
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('salon_user', JSON.stringify(data.user));
        if (onLoginStatusChange) onLoginStatusChange(data.user);
      }
    } catch (err) {
      console.error('Error fetching updated profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUserBookings = async (userId: string) => {
    setLoadingBookings(true);
    try {
      const response = await fetch(`/api/user/${userId}/bookings`);
      const data = await response.json();
      if (response.ok && data.success) {
        // Sort bookings: upcoming first, then past
        const sorted = data.bookings.sort((a: Booking, b: Booking) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setBookings(sorted);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('salon_user', JSON.stringify(data.user));
        if (onLoginStatusChange) onLoginStatusChange(data.user);
        fetchUserBookings(data.user.id);
        setAuthSuccess('Welcome back! Logged in successfully.');
      } else {
        setAuthError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      setAuthError('Please fill out all registration fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPassword
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('salon_user', JSON.stringify(data.user));
        if (onLoginStatusChange) onLoginStatusChange(data.user);
        setBookings([]);
        setAuthSuccess('Account created successfully! 100 Bonus points added!');
      } else {
        setAuthError(data.message || 'Failed to create account.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection error during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreloadDemo = () => {
    setLoginEmail('clara@example.com');
    setLoginPassword('password123');
    setAuthSuccess('Demo credentials pre-filled. Press Login below!');
  };

  const handleLogout = () => {
    setUser(null);
    setBookings([]);
    localStorage.removeItem('salon_user');
    if (onLoginStatusChange) onLoginStatusChange(null);
    setLoginEmail('');
    setLoginPassword('');
    setAuthSuccess('Logged out successfully.');
  };

  const handleClaimReward = async (reward: typeof REWARDS[0]) => {
    if (!user) return;
    setClaimError('');
    setClaimSuccess('');

    if (user.loyaltyPoints < reward.cost) {
      setClaimError('You do not have enough loyalty points to claim this reward.');
      return;
    }

    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          rewardId: reward.id,
          title: reward.title,
          pointsCost: reward.cost
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setClaimSuccess(`Successfully claimed: "${reward.title}"! Save code ${data.claimedReward.code} to redeem at checkout!`);
        fetchUserProfile(user.id);
      } else {
        setClaimError(data.message || 'Failed to redeem reward.');
      }
    } catch (err) {
      console.error(err);
      setClaimError('Failed to connect to the rewards program. Try again.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    setCancellingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchUserBookings(user.id);
        fetchUserProfile(user.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleLinkGoogleCalendar = async () => {
    setIsLinking(true);
    setAdminSaveSuccess('');
    setAdminSaveError('');
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        const { user: googleUser, accessToken } = authResult;
        
        const response = await fetch('/api/settings/save-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: googleUser.email, accessToken })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setLinkStatus('connected');
          setOwnerGoogleEmail(googleUser.email || 'sdasari8921@gmail.com');
          setAdminSaveSuccess('Google Calendar linked successfully! Appointments will sync in real time.');
        } else {
          setAdminSaveError(data.message || 'Failed to sync authentication token to the server.');
        }
      }
    } catch (error: any) {
      console.error(error);
      setAdminSaveError(error.message || 'Google Auth popup failed or was cancelled.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      await googleSignOut();
      const response = await fetch('/api/settings/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sdasari8921@gmail.com', accessToken: '' })
      });
      if (response.ok) {
        setLinkStatus('unlinked');
        setOwnerGoogleEmail('');
        setAdminSaveSuccess('Google Calendar disconnected successfully.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAdminSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSaveSuccess('');
    setAdminSaveError('');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'sdasari8921@gmail.com',
          businessHours: {
            start: '10:00 AM',
            end: '07:00 PM',
            closedDays: adminClosedDays
          },
          appointmentDurationMinutes: Number(adminDuration),
          timeslots: adminTimeslots,
          timezone: adminTimezone
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminSaveSuccess('Business configurations and timeslots successfully saved!');
      } else {
        setAdminSaveError(data.message || 'Failed to save salon configurations.');
      }
    } catch (err) {
      console.error(err);
      setAdminSaveError('Network error. Failed to persist configurations.');
    }
  };

  const handleAddTimeslot = () => {
    if (!newTimeslotInput.trim()) return;
    if (adminTimeslots.includes(newTimeslotInput.trim())) {
      setAdminSaveError('Timeslot already exists.');
      return;
    }
    setAdminTimeslots(prev => [...prev, newTimeslotInput.trim()].sort((a, b) => {
      const parseTime = (t: string) => {
        const match = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return parseTime(a) - parseTime(b);
    }));
    setNewTimeslotInput('');
    setAdminSaveError('');
  };

  const handleRemoveTimeslot = (slot: string) => {
    setAdminTimeslots(prev => prev.filter(t => t !== slot));
  };

  const handleToggleClosedDay = (dayIndex: number) => {
    if (adminClosedDays.includes(dayIndex)) {
      setAdminClosedDays(prev => prev.filter(d => d !== dayIndex));
    } else {
      setAdminClosedDays(prev => [...prev, dayIndex].sort());
    }
  };

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Your Luxury Profile</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">
            {user ? `Welcome Back, ${user.name.split(' ')[0]}` : 'Salon Account'}
          </h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            {user 
              ? 'Manage your upcoming beauty sessions, view your appointment history, and redeem earned loyalty points for premium styling rewards.'
              : 'Register or sign in to track appointments, earn loyalty points on bookings, and unlock exclusive beauty coupons.'
            }
          </p>
        </div>

        {/* Auth Forms (When logged out) */}
        {!user ? (
          <div className="max-w-md mx-auto bg-white border border-brand-champagne/50 shadow-sm overflow-hidden">
            
            {/* Form Toggle Tabs */}
            <div className="flex border-b border-brand-champagne/40">
              <button
                onClick={() => { setActiveTab('login'); setAuthError(''); }}
                className={`flex-1 py-4 font-sans text-xs tracking-widest uppercase font-semibold transition-all ${
                  activeTab === 'login' 
                    ? 'bg-brand-cream text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-brand-warm-gray bg-white hover:text-brand-charcoal'
                }`}
                id="tab-login"
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setAuthError(''); }}
                className={`flex-1 py-4 font-sans text-xs tracking-widest uppercase font-semibold transition-all ${
                  activeTab === 'register' 
                    ? 'bg-brand-cream text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-brand-warm-gray bg-white hover:text-brand-charcoal'
                }`}
                id="tab-register"
              >
                Create Account
              </button>
            </div>

            <div className="p-8 space-y-6">
              
              {/* Demo Account Callout */}
              {activeTab === 'login' && (
                <div className="p-4 bg-brand-blush/40 border border-brand-champagne/80 space-y-2 text-center">
                  <span className="font-sans text-[11px] font-semibold text-brand-gold-dark uppercase tracking-wider block">Testing & Verification</span>
                  <p className="font-sans text-xs text-brand-warm-gray leading-relaxed font-light">
                    Test immediate loyalty features with our preloaded VIP demo profile.
                  </p>
                  <button
                    onClick={handlePreloadDemo}
                    type="button"
                    className="mt-1 inline-flex items-center gap-1 bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-[10px] tracking-widest uppercase py-1.5 px-3 transition-colors duration-300"
                    id="btn-preload-demo"
                  >
                    <span>Autofill Clara's VIP Account</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              )}

              {/* Status Feedbacks */}
              {authError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-start gap-2">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="clara@example.com"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="login-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="login-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4 font-semibold transition-all duration-300"
                    id="btn-login-submit"
                  >
                    {isSubmitting ? 'Verifying...' : 'Sign In To Account'}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="p-3 bg-brand-cream border border-brand-gold/30 text-center rounded-none mb-2">
                    <p className="font-sans text-xs text-brand-gold-dark font-semibold tracking-wider flex items-center justify-center gap-1">
                      <Sparkles size={14} />
                      <span>SIGN-UP BONUS: Earn 100 Instant Loyalty Points!</span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="register-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="register-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Phone Number</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="tel"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        placeholder="(630) 555-0199"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="register-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 text-brand-warm-gray/40" size={16} />
                      <input
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 pl-10 font-sans text-sm text-brand-charcoal"
                        id="register-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4 font-semibold transition-all duration-300"
                    id="btn-register-submit"
                  >
                    {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                  </button>
                </form>
              )}

            </div>
          </div>
        ) : (
          
          /* Dashboard Layout (When logged in) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: User Profile & Loyalty Points Card (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Premium VIP Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-charcoal via-neutral-900 to-neutral-950 p-8 border border-neutral-800 text-white shadow-xl group">
                {/* Visual Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-gold/15 blur-3xl group-hover:bg-brand-gold/25 transition-all duration-500" />
                
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-sans text-[10px] tracking-[0.2em] text-brand-gold uppercase font-bold">GLAM VIP MEMBER</span>
                      <h2 className="font-serif text-2xl font-light tracking-wide mt-1">{user.name}</h2>
                    </div>
                    <Award className="text-brand-gold shrink-0 animate-pulse" size={28} />
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <span className="block font-sans text-[9px] tracking-wider text-neutral-400 uppercase">LOYALTY BALANCE</span>
                      <span className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-brand-gold block mt-1">
                        {loadingProfile ? (
                          <RefreshCw className="animate-spin text-brand-gold inline-block" size={24} />
                        ) : (
                          `${user.loyaltyPoints} pts`
                        )}
                      </span>
                    </div>
                    <div className="text-right font-sans text-xs text-neutral-400">
                      <p>Established {new Date().getFullYear()}</p>
                      <p className="text-brand-gold/80 font-medium">1 pt = $1 Spent</p>
                    </div>
                  </div>

                  {/* Progress Bar towards next reward */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-sans text-neutral-400">
                      <span>Next Level Reward</span>
                      <span>{user.loyaltyPoints >= 500 ? 'Unlocked!' : `${user.loyaltyPoints}/500 pts`}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800">
                      <div 
                        className="h-full bg-brand-gold transition-all duration-500" 
                        style={{ width: `${Math.min((user.loyaltyPoints / 500) * 100, 100)}%` }} 
                      />
                    </div>
                    <span className="block text-[10px] font-sans text-neutral-400 italic">
                      {user.loyaltyPoints < 500 
                        ? `${500 - user.loyaltyPoints} more points until a complimentary Signature Facial!`
                        : 'Congratulations! You have enough points to claim a Free Signature Facial!'
                      }
                    </span>
                  </div>

                  {/* Account Detail Rows */}
                  <div className="pt-4 border-t border-white/10 space-y-2 font-sans text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span className="font-medium">Client Reference:</span>
                      <span className="font-mono text-[11px] text-brand-gold">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Registered Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Contact Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-brand-gold hover:text-brand-gold text-white/80 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
                    id="btn-logout"
                  >
                    <LogOut size={14} />
                    <span>Sign Out Profile</span>
                  </button>

                </div>
              </div>

              {/* Claimed Coupons / Active codes */}
              <div className="bg-white border border-brand-champagne/50 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-brand-champagne/40 pb-3">
                  <Tag className="text-brand-gold" size={16} />
                  <h3 className="font-serif text-lg font-medium text-brand-charcoal">My Redeemed Coupons</h3>
                </div>

                {user.claimedRewards && user.claimedRewards.filter(r => !r.used).length > 0 ? (
                  <div className="space-y-3">
                    {user.claimedRewards.filter(r => !r.used).map((reward) => (
                      <div key={reward.id} className="p-3 bg-brand-cream border border-brand-gold/30 flex justify-between items-center">
                        <div>
                          <p className="font-sans text-xs font-semibold text-brand-charcoal">{reward.title}</p>
                          <span className="font-mono text-[10px] tracking-widest bg-brand-blush/80 text-brand-gold-dark px-1.5 py-0.5 inline-block mt-1 border border-brand-gold/20">
                            {reward.code}
                          </span>
                        </div>
                        <span className="font-sans text-[10px] uppercase font-bold text-brand-gold tracking-widest bg-white py-1 px-2 border border-brand-champagne/60">
                          Active
                        </span>
                      </div>
                    ))}
                    <p className="font-sans text-[11px] text-brand-warm-gray font-light leading-relaxed pt-1">
                      *Simply enter these codes in the booking form special request notes, or display them on your phone at checkout.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-brand-warm-gray font-sans font-light text-xs">
                    No active coupon codes. Redeem your points below to claim beauty rewards!
                  </div>
                )}
              </div>

            </div>

            {/* Right Side: Tabular Bookings History & Rewards Shop (7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              {user.email.toLowerCase() === 'sdasari8921@gmail.com' ? (
                /* Business Owner Admin Control Panel */
                <div className="space-y-8">
                  {/* Google Calendar Sync Panel */}
                  <div className="bg-white border border-brand-champagne/50 p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b border-brand-champagne/40 pb-4">
                      <CalendarIcon className="text-brand-gold animate-pulse" size={22} />
                      <h3 className="font-serif text-xl font-medium text-brand-charcoal">Google Calendar Integration</h3>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-brand-warm-gray font-light leading-relaxed">
                      Connect your Google Account to automatically create calendar events for every booking. Conflicts on your Google Calendar will automatically block timeslots on the salon scheduler.
                    </p>

                    {adminSaveSuccess && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-start gap-2">
                        <CheckCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{adminSaveSuccess}</span>
                      </div>
                    )}

                    {adminSaveError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{adminSaveError}</span>
                      </div>
                    )}

                    <div className="p-5 border bg-brand-cream/10 border-brand-champagne/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="font-sans text-[10px] tracking-wider text-brand-warm-gray uppercase font-semibold">Connection Status</span>
                        {linkStatus === 'connected' ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-sans text-sm font-semibold">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Linked to {ownerGoogleEmail}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-neutral-400 font-sans text-sm font-semibold">
                            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                            <span>Unlinked</span>
                          </div>
                        )}
                      </div>

                      {linkStatus === 'connected' ? (
                        <button
                          onClick={handleDisconnectCalendar}
                          className="font-sans text-[10px] tracking-widest uppercase border border-red-200 text-red-600 hover:bg-red-50 py-3 px-5 transition-colors cursor-pointer"
                        >
                          Disconnect Calendar
                        </button>
                      ) : (
                        <button
                          disabled={isLinking}
                          onClick={handleLinkGoogleCalendar}
                          className="font-sans text-[10px] tracking-widest uppercase bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal py-3 px-6 font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                          {isLinking ? (
                            <>
                              <RefreshCw className="animate-spin" size={12} />
                              <span>Linking...</span>
                            </>
                          ) : (
                            <>
                              <span>Link Google Calendar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Operational Settings Customizer Panel */}
                  <form onSubmit={handleSaveAdminSettings} className="bg-white border border-brand-champagne/50 p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b border-brand-champagne/40 pb-4">
                      <Scissors className="text-brand-gold" size={22} />
                      <h3 className="font-serif text-xl font-medium text-brand-charcoal">Salon Configurations</h3>
                    </div>

                    {/* Timezone and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">
                          Appointment Duration (Minutes)
                        </label>
                        <select
                          value={adminDuration}
                          onChange={(e) => setAdminDuration(Number(e.target.value))}
                          className="w-full bg-brand-cream border border-brand-champagne/80 p-3 font-sans text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold focus:bg-white"
                        >
                          <option value={30}>30 Minutes</option>
                          <option value={45}>45 Minutes</option>
                          <option value={60}>60 Minutes (Standard)</option>
                          <option value={90}>90 Minutes</option>
                          <option value={120}>120 Minutes</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">
                          Business Timezone
                        </label>
                        <select
                          value={adminTimezone}
                          onChange={(e) => setAdminTimezone(e.target.value)}
                          className="w-full bg-brand-cream border border-brand-champagne/80 p-3 font-sans text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold focus:bg-white"
                        >
                          <option value="America/Chicago">Central Time (Aurora)</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>
                    </div>

                    {/* Closed Days Selector */}
                    <div className="space-y-3">
                      <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">
                        Weekly Closed Days (Off-Duty Days)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, index) => {
                          const isClosed = adminClosedDays.includes(index);
                          return (
                            <button
                              key={dayName}
                              type="button"
                              onClick={() => handleToggleClosedDay(index)}
                              className={`py-2 px-3 text-xs font-sans border transition-all cursor-pointer ${
                                isClosed
                                  ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                                  : 'bg-white text-brand-charcoal border-brand-champagne hover:border-brand-gold'
                              }`}
                            >
                              {dayName}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Timeslots Editor */}
                    <div className="space-y-4">
                      <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">
                        Interactive Active Timeslots
                      </label>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTimeslotInput}
                          onChange={(e) => setNewTimeslotInput(e.target.value)}
                          placeholder="e.g. 10:30 AM"
                          className="flex-1 bg-brand-cream border border-brand-champagne/85 focus:border-brand-gold focus:outline-none p-2.5 font-sans text-xs text-brand-charcoal"
                        />
                        <button
                          type="button"
                          onClick={handleAddTimeslot}
                          className="bg-brand-charcoal text-brand-cream px-4 text-xs font-sans uppercase tracking-widest hover:bg-brand-gold hover:text-brand-charcoal font-semibold transition-all cursor-pointer"
                        >
                          Add Slot
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-neutral-50 p-4 border border-brand-champagne/20 max-h-[220px] overflow-y-auto">
                        {adminTimeslots.map((slot) => (
                          <div 
                            key={slot}
                            className="bg-white border border-brand-champagne/50 p-2 flex justify-between items-center text-xs text-brand-charcoal font-sans"
                          >
                            <span>{slot}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeslot(slot)}
                              className="text-red-400 hover:text-red-600 transition-colors font-bold ml-1 cursor-pointer"
                              title="Delete Timeslot"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4 font-semibold transition-all duration-300 cursor-pointer"
                    >
                      Save Configuration Settings
                    </button>
                  </form>
                </div>
              ) : (
                /* Standard Customer Rewards & History Panels */
                <>
                  {/* Rewards Store Section */}
                  <div className="bg-white border border-brand-champagne/50 p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-brand-champagne/40 pb-4">
                      <div className="flex items-center gap-2">
                        <Gift className="text-brand-gold" size={20} />
                        <h3 className="font-serif text-xl font-medium text-brand-charcoal">Redeem Loyalty Points</h3>
                      </div>
                      <span className="font-sans text-xs font-semibold text-brand-gold bg-brand-cream px-3 py-1.5">
                        Your Points: {user.loyaltyPoints}
                      </span>
                    </div>

                    {/* Reward Claim status message */}
                    {claimError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{claimError}</span>
                      </div>
                    )}

                    {claimSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-start gap-2">
                        <CheckCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{claimSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {REWARDS.map((reward) => {
                        const canAfford = user.loyaltyPoints >= reward.cost;
                        return (
                          <div 
                            key={reward.id} 
                            className={`p-5 border flex flex-col justify-between transition-all ${
                              canAfford 
                                ? 'bg-brand-cream/30 border-brand-gold/40 hover:border-brand-gold hover:shadow-xs' 
                                : 'bg-white border-brand-champagne/40 opacity-75'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-serif text-sm font-semibold text-brand-charcoal leading-tight">{reward.title}</h4>
                                <span className="font-sans text-xs font-bold text-brand-gold shrink-0 bg-white py-0.5 px-2 border border-brand-champagne">
                                  {reward.cost} pts
                                </span>
                              </div>
                              <p className="font-sans text-xs text-brand-warm-gray font-light leading-relaxed">{reward.description}</p>
                            </div>

                            <button
                              disabled={!canAfford}
                              onClick={() => handleClaimReward(reward)}
                              className={`mt-4 w-full py-2 font-sans text-[10px] tracking-widest uppercase font-semibold transition-colors duration-300 border ${
                                canAfford 
                                  ? 'bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal border-brand-charcoal hover:border-brand-gold cursor-pointer' 
                                  : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                              }`}
                              id={`btn-claim-${reward.id}`}
                            >
                              {canAfford ? 'Claim Reward Code' : 'Insufficient Points'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bookings History Section */}
                  <div className="bg-white border border-brand-champagne/50 p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-brand-champagne/40 pb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="text-brand-gold" size={20} />
                        <h3 className="font-serif text-xl font-medium text-brand-charcoal">My Appointment History</h3>
                      </div>
                      <span className="font-sans text-xs text-brand-warm-gray font-light">
                        Total Visits: {bookings.filter(b => b.status === 'completed').length}
                      </span>
                    </div>

                    {loadingBookings ? (
                      <div className="text-center py-12">
                        <RefreshCw className="animate-spin text-brand-gold mx-auto" size={24} />
                        <p className="font-sans text-xs text-brand-warm-gray mt-2 font-light">Fetching your bookings history...</p>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                        {bookings.map((booking) => {
                          const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
                          
                          return (
                            <div 
                              key={booking.id} 
                              className="p-4 border border-brand-champagne/40 bg-brand-cream/10 space-y-3 hover:bg-brand-cream/35 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                  <span className="font-sans text-[10px] text-brand-gold tracking-widest uppercase font-bold">
                                    {booking.serviceName}
                                  </span>
                                  <div className="flex items-center gap-3.5 font-sans text-xs text-brand-warm-gray font-light mt-1">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon size={12} className="text-brand-gold" />
                                      {booking.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} className="text-brand-gold" />
                                      {booking.time}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-center">
                                  {/* Status Badge */}
                                  <span className={`font-sans text-[10px] tracking-widest uppercase py-1 px-2.5 font-semibold text-center ${
                                    booking.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : booking.status === 'confirmed'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : booking.status === 'cancelled'
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                                  }`}>
                                    {booking.status}
                                  </span>

                                  {/* Cancel action */}
                                  {isUpcoming && (
                                    <button
                                      disabled={cancellingId === booking.id}
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                                      title="Cancel Appointment"
                                      id={`btn-cancel-${booking.id}`}
                                    >
                                      {cancellingId === booking.id ? (
                                        <RefreshCw className="animate-spin" size={14} />
                                      ) : (
                                        <XCircle size={14} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {booking.message && (
                                <div className="bg-white/80 p-2.5 border-l-2 border-brand-champagne/60 text-xs font-sans text-brand-warm-gray font-light italic">
                                  "{booking.message}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-brand-champagne text-brand-warm-gray font-sans font-light text-xs">
                        No bookings logged yet. Ready to experience Glam N Glow? Select "Book Now" at the top!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
