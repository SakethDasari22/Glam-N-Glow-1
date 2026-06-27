import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Gift,
  Check
} from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../data';
import { BookingFormState, User } from '../types';

interface ContactViewProps {
  initialSelectedService?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIMESLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

// Helper to check if a timeslot on a given date is in the past
function isSlotInPast(slotStr: string, dateStr: string): boolean {
  const today = new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < todayDate) return true;
  if (selectedDate > todayDate) return false;
  
  // Date is today - check specific timeslot
  const match = slotStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return false;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  
  return slotTime < today;
}

export default function ContactView({ initialSelectedService }: ContactViewProps) {
  const [user, setUser] = useState<User | null>(null);

  // Dynamic Settings states
  const [timeslots, setTimeslots] = useState<string[]>(TIMESLOTS);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [closedDays, setClosedDays] = useState<number[]>([1]); // Default Monday closed

  // Extract flat list of all services to easily get prices and verify
  const allServices = SERVICES.flatMap(cat => 
    cat.services.map(s => ({
      name: s.name,
      priceStr: s.price,
      priceValue: parsePriceNumeric(s.price),
      category: cat.category
    }))
  );

  // Form fields
  const [form, setForm] = useState<BookingFormState>({
    name: '',
    email: '',
    phone: '',
    service: initialSelectedService || '',
    date: '',
    time: '',
    message: ''
  });

  // Calendar States
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());

  // Active coupon chosen
  const [selectedRewardCode, setSelectedRewardCode] = useState<string>('');
  const [appliedDiscountText, setAppliedDiscountText] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<number>(0);

  // UI States
  const [errors, setErrors] = useState<Partial<BookingFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Parse price string like "from $190" or "Free" to numeric value
  function parsePriceNumeric(priceStr: string): number {
    if (!priceStr || priceStr.toLowerCase().includes('free')) return 0;
    const digits = priceStr.replace(/[^0-9]/g, '');
    return Number(digits) || 0;
  }

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (response.ok && data.success && data.settings) {
          if (data.settings.timeslots) setTimeslots(data.settings.timeslots);
          if (data.settings.businessHours?.closedDays) setClosedDays(data.settings.businessHours.closedDays);
        }
      } catch (err) {
        console.error('Failed to load salon settings', err);
      }
    }
    loadSettings();
  }, []);

  // Fetch booked slots for the chosen date
  useEffect(() => {
    if (!form.date) {
      setBookedSlots([]);
      return;
    }
    async function loadBookedSlots() {
      try {
        const response = await fetch(`/api/bookings/booked-slots?date=${form.date}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch (err) {
        console.error('Failed to load booked slots', err);
      }
    }
    loadBookedSlots();
  }, [form.date]);

  // Load user from session & update form fields
  useEffect(() => {
    const savedUser = localStorage.getItem('salon_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
      setForm(prev => ({
        ...prev,
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone
      }));
    }
  }, []);

  // Update chosen service, reset chosen reward coupon if service changes
  useEffect(() => {
    if (initialSelectedService) {
      setForm(prev => ({ ...prev, service: initialSelectedService }));
    }
  }, [initialSelectedService]);

  // Recalculate price and discount when service or reward choice changes
  useEffect(() => {
    const matched = allServices.find(s => s.name === form.service);
    if (!matched) {
      setFinalPrice(0);
      setAppliedDiscountText('');
      return;
    }

    let price = matched.priceValue;
    if (selectedRewardCode && user) {
      const reward = user.claimedRewards.find(r => r.code === selectedRewardCode && !r.used);
      if (reward) {
        if (reward.rewardId === 'reward-10-percent') {
          price = Math.floor(price * 0.9);
          setAppliedDiscountText('10% Off VIP Discount Applied!');
        } else if (reward.rewardId === 'reward-free-blowout' && matched.name.toLowerCase().includes('blowout')) {
          price = 0;
          setAppliedDiscountText('Free Blowout Coupon Applied!');
        } else if (reward.rewardId === 'reward-free-facial' && matched.name.toLowerCase().includes('facial')) {
          price = 0;
          setAppliedDiscountText('Free Facial Coupon Applied!');
        } else if (reward.rewardId === 'reward-free-nails' && matched.name.toLowerCase().includes('manicure')) {
          price = 0;
          setAppliedDiscountText('Free Nail Care Coupon Applied!');
        } else {
          // Incompatible reward
          setSelectedRewardCode('');
          setAppliedDiscountText('');
          alert(`This reward coupon is only applicable to ${reward.title.split('Free')[1] || 'matching service'}.`);
        }
      }
    } else {
      setAppliedDiscountText('');
    }
    setFinalPrice(price);
  }, [form.service, selectedRewardCode, user]);

  // Calendar Helpers
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOffset = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOffset = getFirstDayOffset(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDateSelect = (dayNum: number) => {
    // Format as YYYY-MM-DD
    const selected = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setForm(prev => ({ ...prev, date: selected }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookingFormState]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormState> = {};
    
    if (!form.name.trim()) newErrors.name = 'Please provide your name.';
    if (!form.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Please provide your phone number.';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!form.service) newErrors.service = 'Please select a salon service.';
    if (!form.date) newErrors.date = 'Please pick a preferred calendar date.';
    if (!form.time) newErrors.time = 'Please select an hour slot.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    const selectedServiceDetails = allServices.find(s => s.name === form.service);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user ? user.id : null,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          serviceName: form.service,
          priceValue: finalPrice || (selectedServiceDetails ? selectedServiceDetails.priceValue : 0),
          date: form.date,
          time: form.time,
          message: form.message,
          appliedRewardCode: selectedRewardCode || null
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitResult({
          success: true,
          message: `Booking secured! Thank you, ${form.name}. Your session for ${form.service} is confirmed for ${form.date} at ${form.time}. We can't wait to see you!`
        });

        // If logged in, fetch refreshed loyalty score and profiles
        if (user) {
          const profileRes = await fetch(`/api/user/${user.id}/profile`);
          const profileData = await profileRes.json();
          if (profileRes.ok && profileData.success) {
            setUser(profileData.user);
            localStorage.setItem('salon_user', JSON.stringify(profileData.user));
          }
        }

        // Reset wizard states
        setForm({
          name: user ? user.name : '',
          email: user ? user.email : '',
          phone: user ? user.phone : '',
          service: '',
          date: '',
          time: '',
          message: ''
        });
        setSelectedRewardCode('');
      } else {
        setSubmitResult({
          success: false,
          message: data.message || 'Verification error. Please review dates and try again.'
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitResult({
        success: false,
        message: 'Could not connect to the scheduling service. Please check your network or call the salon directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build list of calendar day cells
  const calendarCells = [];
  for (let i = 0; i < firstDayOffset; i++) {
    calendarCells.push({ day: null, isPast: true, isMonday: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentYear, currentMonth, day);
    const cellDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Clear hours to compare calendar days
    const comparisonToday = new Date();
    comparisonToday.setHours(0,0,0,0);
    
    const isPast = cellDate < comparisonToday;
    const isMonday = closedDays.includes(cellDate.getDay()); // Closed based on dynamic settings

    calendarCells.push({
      day,
      dateString: cellDateString,
      isPast,
      isMonday
    });
  }

  // Format date readable for summary card
  const getReadableSelectedDate = () => {
    if (!form.date) return '';
    const [year, month, day] = form.date.split('-');
    return `${MONTH_NAMES[Number(month) - 1]} ${Number(day)}, ${year}`;
  };

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs tracking-[0.2em] text-brand-gold uppercase font-semibold">Bespoke Styling Sessions</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-light tracking-tight">Interactive Booking</h1>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-4"></div>
          <p className="font-sans text-sm sm:text-base text-brand-warm-gray font-light max-w-2xl mx-auto leading-relaxed">
            Select your preferred treatment, interact with our real-time salon calendar, choose your timeslot, and apply loyalty coupons to lock in your next glow.
          </p>
        </div>

        {/* Master Booking Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Booking Wizard (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-brand-champagne/50 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-2 border-b border-brand-champagne pb-4">
              <Sparkles className="text-brand-gold" size={20} />
              <h2 className="font-serif text-2xl font-medium text-brand-charcoal">Appointment Scheduler</h2>
            </div>

            {submitResult && (
              <div 
                className={`p-5 flex items-start gap-3 border ${
                  submitResult.success 
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50/80 border-red-200 text-red-800'
                }`}
                id="booking-wizard-alert"
              >
                {submitResult.success ? (
                  <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={18} />
                ) : (
                  <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={18} />
                )}
                <div className="text-sm font-sans">
                  <p className="font-semibold">{submitResult.success ? 'Reservation Confirmed!' : 'Error Submitting Request'}</p>
                  <p className="mt-1 leading-relaxed font-light">{submitResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Client Information */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-medium text-brand-charcoal flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold text-xs flex items-center justify-center font-bold">1</span>
                  <span>Your Details</span>
                </h3>

                {user ? (
                  <div className="p-3 bg-brand-cream/40 border border-brand-gold/20 flex items-center justify-between">
                    <p className="font-sans text-xs text-brand-charcoal font-light leading-relaxed">
                      Logged in as <span className="font-bold">{user.name}</span>. Details pre-filled.
                    </p>
                    <span className="font-sans text-[10px] tracking-wider uppercase font-semibold text-brand-gold bg-white px-2 py-0.5 border border-brand-champagne">
                      VIP Status
                    </span>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-brand-warm-gray font-light">
                    Booking as a Guest. To earn loyalty points on this reservation, please sign in under "My Account" first.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-charcoal font-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 font-sans text-xs text-brand-charcoal placeholder-brand-warm-gray/40 rounded-none"
                    />
                    {errors.name && <p className="font-sans text-[10px] text-red-600 font-light">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-charcoal font-semibold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 font-sans text-xs text-brand-charcoal placeholder-brand-warm-gray/40 rounded-none"
                    />
                    {errors.email && <p className="font-sans text-[10px] text-red-600 font-light">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-charcoal font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="(630) 555-0199"
                      className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 font-sans text-xs text-brand-charcoal placeholder-brand-warm-gray/40 rounded-none"
                    />
                    {errors.phone && <p className="font-sans text-[10px] text-red-600 font-light">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2: Service Pick */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-medium text-brand-charcoal flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold text-xs flex items-center justify-center font-bold">2</span>
                  <span>Select Salon Ritual</span>
                </h3>

                <div className="space-y-1.5">
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleInputChange}
                    className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3.5 font-sans text-xs text-brand-charcoal"
                  >
                    <option value="">-- Click to Choose Treatment --</option>
                    {SERVICES.map((cat) => (
                      <optgroup key={cat.id} label={cat.category}>
                        {cat.services.map((srv, idx) => (
                          <option key={idx} value={srv.name}>
                            {srv.name} ({srv.price})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.service && <p className="font-sans text-[11px] text-red-600 font-light">{errors.service}</p>}
                </div>

                {/* Loyalty and Rewards Panel if logged in & service is chosen */}
                {user && form.service && (
                  <div className="bg-brand-cream/30 border border-brand-gold/20 p-4 space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans font-medium text-brand-charcoal">VIP loyalty point accrual:</span>
                      <span className="font-serif text-brand-gold font-bold">
                        +{allServices.find(s => s.name === form.service)?.priceValue || 0} pts
                      </span>
                    </div>

                    {user.claimedRewards && user.claimedRewards.filter(r => !r.used).length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-brand-champagne/40">
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-charcoal font-semibold">
                          Apply Active Reward Code:
                        </label>
                        <select
                          value={selectedRewardCode}
                          onChange={(e) => setSelectedRewardCode(e.target.value)}
                          className="w-full bg-white border border-brand-champagne focus:border-brand-gold focus:outline-none p-2 font-sans text-xs text-brand-charcoal"
                        >
                          <option value="">-- Do Not Apply Coupon --</option>
                          {user.claimedRewards.filter(r => !r.used).map((reward) => (
                            <option key={reward.id} value={reward.code}>
                              {reward.title} ({reward.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Step 3: Interactive Calendar Grid */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-medium text-brand-charcoal flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold text-xs flex items-center justify-center font-bold">3</span>
                  <span>Interact with Salon Calendar</span>
                </h3>
                <p className="font-sans text-xs text-brand-warm-gray font-light">
                  Mondays are closed. Past dates are locked. Click on any active date box to select.
                </p>

                {/* Custom Month Navigator */}
                <div className="border border-brand-champagne/60 bg-brand-cream/20">
                  <div className="flex justify-between items-center p-4 border-b border-brand-champagne/40 bg-white">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="text-brand-charcoal hover:text-brand-gold p-1 cursor-pointer transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-serif text-sm font-semibold tracking-wide text-brand-charcoal">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="text-brand-charcoal hover:text-brand-gold p-1 cursor-pointer transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Weekday Labels Grid */}
                  <div className="grid grid-cols-7 text-center py-2 bg-brand-cream/40 border-b border-brand-champagne/20">
                    {WEEKDAYS.map((day) => (
                      <span key={day} className="font-sans text-[10px] uppercase font-bold text-brand-warm-gray">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Date Grid Cells */}
                  <div className="grid grid-cols-7 text-center gap-px bg-brand-champagne/30">
                    {calendarCells.map((cell, idx) => {
                      if (cell.day === null) {
                        return <div key={`empty-${idx}`} className="bg-white/40 h-10 sm:h-12" />;
                      }

                      const isSelected = form.date === cell.dateString;
                      const isClosed = cell.isMonday;
                      const isDisabled = cell.isPast || isClosed;

                      return (
                        <button
                          key={`day-${cell.day}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateSelect(cell.day!)}
                          className={`h-10 sm:h-12 flex flex-col justify-between items-center p-1 sm:p-2.5 transition-all text-xs font-sans relative cursor-pointer ${
                            isSelected 
                              ? 'bg-brand-charcoal text-brand-cream font-bold border border-brand-gold' 
                              : isClosed 
                              ? 'bg-red-50/40 text-red-400 font-light' 
                              : isDisabled 
                              ? 'bg-neutral-50 text-neutral-300 font-light' 
                              : 'bg-white hover:bg-brand-cream/60 hover:text-brand-gold text-brand-charcoal'
                          }`}
                        >
                          <span>{cell.day}</span>
                          
                          {/* Closed Label indicator */}
                          {isClosed && (
                            <span className="text-[7px] text-red-500 uppercase tracking-tight scale-90 sm:scale-100 font-semibold leading-none mb-0.5">Closed</span>
                          )}
                          
                          {/* Dot marker if selected */}
                          {isSelected && (
                            <span className="w-1 h-1 rounded-full bg-brand-gold block" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {errors.date && <p className="font-sans text-[11px] text-red-600 font-light">{errors.date}</p>}
              </div>

              {/* Step 4: Timeslots */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-medium text-brand-charcoal flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold text-xs flex items-center justify-center font-bold">4</span>
                  <span>Select Booking Time</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {timeslots.map((slot) => {
                    const isSelected = form.time === slot;
                    const isBooked = bookedSlots.includes(slot);
                    const isPast = form.date ? isSlotInPast(slot, form.date) : false;
                    const isDisabled = isBooked || isPast;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setForm(prev => ({ ...prev, time: slot }));
                          if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                        }}
                        className={`py-2 px-1 text-xs font-sans border transition-all text-center rounded-none flex flex-col items-center justify-center min-h-[50px] cursor-pointer ${
                          isSelected
                            ? 'bg-brand-gold text-brand-charcoal border-brand-gold font-semibold shadow-xs'
                            : isDisabled
                            ? 'bg-neutral-50 border-neutral-100 text-neutral-300 line-through cursor-not-allowed'
                            : 'bg-white border-brand-champagne/80 hover:border-brand-gold hover:bg-brand-cream/30 text-brand-charcoal'
                        }`}
                        title={isBooked ? 'Already Reserved' : isPast ? 'Time has passed' : ''}
                      >
                        <span className="font-sans font-medium text-[11px]">{slot}</span>
                        {isBooked && (
                          <span className="text-[7px] text-red-400 uppercase tracking-tight scale-90 leading-none mt-0.5 font-bold">Reserved</span>
                        )}
                        {!isBooked && isPast && (
                          <span className="text-[7px] text-neutral-300 uppercase tracking-tight scale-90 leading-none mt-0.5 font-bold">Passed</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.time && <p className="font-sans text-[11px] text-red-600 font-light">{errors.time}</p>}
              </div>

              {/* Notes Input Area */}
              <div className="space-y-2">
                <label className="block font-sans text-xs uppercase tracking-wider text-brand-charcoal font-semibold">Special Notes / Special Requests (Optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Note hair length, skin allergies, or if you applied a loyalty reward coupon."
                  className="w-full bg-brand-cream border border-brand-champagne/80 focus:border-brand-gold focus:outline-none p-3 font-sans text-xs text-brand-charcoal resize-none rounded-none placeholder-brand-warm-gray/40"
                />
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-charcoal hover:bg-brand-gold text-brand-cream hover:text-brand-charcoal font-sans text-xs tracking-widest uppercase py-4.5 transition-all duration-300 font-semibold cursor-pointer rounded-none disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                id="btn-wizard-submit"
              >
                {isSubmitting ? 'Securing Treatment slot...' : 'Book Treatment & Earn Loyalty'}
              </button>

            </form>
          </div>

          {/* Right Side: Interactive Booking Summary & Info Columns (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Real-time Receipt/Summary Ticket */}
            <div className="bg-brand-charcoal text-white p-8 border border-neutral-800 space-y-6 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="border-b border-white/10 pb-4 text-center">
                <span className="font-sans text-[10px] tracking-[0.25em] text-brand-gold uppercase font-bold">Appointment Summary</span>
                <h3 className="font-serif text-xl font-light tracking-wide mt-1">Glam N Glow Ticket</h3>
              </div>

              <div className="space-y-4 font-sans text-xs">
                
                {/* Client detail */}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Client:</span>
                  <span className="font-medium text-neutral-200">{form.name || 'Guest'}</span>
                </div>

                {/* Treatment detail */}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Treatment:</span>
                  <span className="font-medium text-brand-gold">{form.service || 'None selected'}</span>
                </div>

                {/* Date detail */}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Date:</span>
                  <span className="font-medium text-neutral-200">{getReadableSelectedDate() || 'None selected'}</span>
                </div>

                {/* Hour detail */}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Timeslot:</span>
                  <span className="font-medium text-neutral-200">{form.time || 'None selected'}</span>
                </div>

                {/* Pricing / Loyalty Calculation */}
                {form.service && (
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-neutral-400">
                      <span>Standard Rate:</span>
                      <span className="text-neutral-200">
                        {allServices.find(s => s.name === form.service)?.priceStr}
                      </span>
                    </div>

                    {appliedDiscountText && (
                      <div className="flex justify-between text-emerald-400 font-light">
                        <span>Reward Discount:</span>
                        <span>-{appliedDiscountText.includes('10%') ? '10%' : '100%'}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm pt-2 border-t border-white/10 font-serif">
                      <span className="text-brand-gold font-light">Total Estimated Due:</span>
                      <span className="text-brand-gold font-semibold">${finalPrice}</span>
                    </div>

                    {user && (
                      <div className="flex justify-between text-[11px] text-brand-gold/80 italic pt-1 font-sans">
                        <span>VIP Points Accrued:</span>
                        <span>+{finalPrice} Points</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Secure Booking Notice */}
              <div className="bg-white/5 p-4 text-[11px] font-sans text-neutral-400 leading-relaxed font-light border-l-2 border-brand-gold/60">
                All booking submissions are instantly secured on the server. There are no prepayment requirements; you will redeem any loyalty coupons or pay after your sessions.
              </div>
            </div>

            {/* Standard Contact/Location info */}
            <div className="bg-white border border-brand-champagne/50 p-6 space-y-4">
              <h4 className="font-serif text-base font-semibold text-brand-charcoal border-b border-brand-champagne pb-2">
                Salon Inquiries
              </h4>
              <div className="space-y-3 font-sans text-xs text-brand-warm-gray font-light">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-brand-gold shrink-0 mt-0.5" />
                  <span>{BUSINESS_INFO.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone size={15} className="text-brand-gold shrink-0 mt-0.5" />
                  <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brand-gold">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail size={15} className="text-brand-gold shrink-0 mt-0.5" />
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-brand-gold">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium">Tuesday–Sunday: 10am – 7pm</span>
                    <span className="block text-red-500 mt-0.5">Mondays Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="bg-white border border-brand-champagne/50 p-1">
              <iframe
                title="Google Maps Location"
                src="https://maps.google.com/maps?q=2760%20Aurora%20Ave%20Suite%20100%20Naperville%20IL%2060540&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
