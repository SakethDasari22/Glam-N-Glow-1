import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { JWT } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(process.cwd(), 'salon_db.json');

// Interface structures for DB
interface ClaimedReward {
  id: string;
  rewardId: string;
  title: string;
  pointsCost: number;
  code: string;
  used: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  loyaltyPoints: number;
  claimedRewards: ClaimedReward[];
}

interface Booking {
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

interface BusinessHours {
  start: string;
  end: string;
  closedDays: number[]; // 0=Sunday, 1=Monday...
}

interface Settings {
  businessHours: BusinessHours;
  appointmentDurationMinutes: number;
  timeslots: string[];
  timezone: string;
  googleOwnerToken: string | null;
  ownerEmail: string;
}

// Database helper functions with automatic seed data and migration
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    // Auto-seed administrative owner if missing
    const ownerExists = db.users?.some((u: any) => u.email.toLowerCase() === 'sdasari8921@gmail.com');
    if (db.users && !ownerExists) {
      db.users.push({
        id: 'user-owner',
        name: 'Srinivas Dasari',
        email: 'sdasari8921@gmail.com',
        phone: '(872) 400-0706',
        password: 'password123',
        loyaltyPoints: 1000,
        claimedRewards: []
      });
      await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }

    // Migration: ensure settings exist
    if (!db.settings) {
      db.settings = {
        businessHours: {
          start: '10:00 AM',
          end: '07:00 PM',
          closedDays: [1] // Monday closed
        },
        appointmentDurationMinutes: 60,
        timeslots: [
          '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
          '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
        ],
        timezone: 'America/Chicago',
        googleOwnerToken: null,
        ownerEmail: 'sdasari8921@gmail.com'
      };
      await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
    return db;
  } catch (err) {
    const initialDB = {
      users: [
        {
          id: 'user-owner',
          name: 'Srinivas Dasari',
          email: 'sdasari8921@gmail.com',
          phone: '(872) 400-0706',
          password: 'password123',
          loyaltyPoints: 1000,
          claimedRewards: []
        },
        {
          id: 'user-clara',
          name: 'Clara Sterling',
          email: 'clara@example.com',
          phone: '(872) 555-0199',
          password: 'password123',
          loyaltyPoints: 370,
          claimedRewards: []
        }
      ],
      bookings: [
        {
          id: 'b1',
          userId: 'user-clara',
          guestName: 'Clara Sterling',
          guestEmail: 'clara@example.com',
          guestPhone: '(872) 555-0199',
          serviceName: "Women's & Men's Haircuts",
          priceValue: 75,
          date: '2026-05-12',
          time: '11:00 AM',
          status: 'completed',
          message: 'Loved the precision layer work!'
        },
        {
          id: 'b2',
          userId: 'user-clara',
          guestName: 'Clara Sterling',
          guestEmail: 'clara@example.com',
          guestPhone: '(872) 555-0199',
          serviceName: 'Airtouch',
          priceValue: 240,
          date: '2026-06-02',
          time: '02:00 PM',
          status: 'completed',
          message: 'Seamless cool-blonde blending by Elena.'
        },
        {
          id: 'b3',
          userId: 'user-clara',
          guestName: 'Clara Sterling',
          guestEmail: 'clara@example.com',
          guestPhone: '(872) 555-0199',
          serviceName: 'Manicure',
          priceValue: 35,
          date: '2026-06-18',
          time: '04:30 PM',
          status: 'completed',
          message: 'Elegant gold flake accents.'
        },
        {
          id: 'b4',
          userId: 'user-clara',
          guestName: 'Clara Sterling',
          guestEmail: 'clara@example.com',
          guestPhone: '(872) 555-0199',
          serviceName: 'Balayage',
          priceValue: 190,
          date: '2026-07-25',
          time: '10:30 AM',
          status: 'confirmed',
          message: 'Excited for my summer style refresh!'
        }
      ],
      settings: {
        businessHours: {
          start: '10:00 AM',
          end: '07:00 PM',
          closedDays: [1] // Monday closed
        },
        appointmentDurationMinutes: 60,
        timeslots: [
          '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
          '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
        ],
        timezone: 'America/Chicago',
        googleOwnerToken: null,
        ownerEmail: 'sdasari8921@gmail.com'
      }
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }
}

async function writeDB(db: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// DateTime helpers for Calendar Integration
function parseDateTime(dateStr: string, timeStr: string, durationMinutes: number): { startISO: string, endISO: string } {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  let hours = 10;
  let minutes = 0;
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
  }
  
  // Format as YYYY-MM-DDTHH:MM:SS
  const startISO = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  
  const startDate = new Date(startISO);
  const duration = durationMinutes || 60;
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();
  const endStr = `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;
  
  return { startISO, endISO: endStr };
}

// Nodemailer Email Notification Service
async function sendEmailNotification(booking: Booking) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'Glam N Glow <no-reply@glamnglow.com>';
  const to = 'sdasari8921@gmail.com';

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  const emailSubject = `Glam N Glow New Appointment: ${booking.guestName} - ${booking.serviceName}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ebd8c3; background-color: #faf6f0; color: #212121;">
      <h2 style="color: #c5a059; border-bottom: 1px solid #ebd8c3; padding-bottom: 10px; font-family: 'Georgia', serif;">New Appointment Booking Secured</h2>
      <p>A new appointment has been successfully booked on your beauty salon website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold; width: 35%;">Customer Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;">${booking.guestName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;"><a href="mailto:${booking.guestEmail}" style="color: #c5a059;">${booking.guestEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Phone Number:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;"><a href="tel:${booking.guestPhone}" style="color: #c5a059;">${booking.guestPhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Date:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;">${booking.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Time:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;">${booking.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Service Selected:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; color: #c5a059; font-weight: bold;">${booking.serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Price Value:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3;">$${booking.priceValue}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-weight: bold;">Special Notes:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ebd8c3; font-style: italic;">${booking.message || 'None'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Booking Timestamp:</td>
          <td style="padding: 8px;">${timestamp} (CST)</td>
        </tr>
      </table>
      
      <div style="margin-top: 25px; padding: 15px; background-color: #ebd8c3; text-align: center; font-size: 11px; color: #212121;">
        Glam N Glow Beauty Salon. Fully automated notifications.
      </div>
    </div>
  `;

  const emailText = `
Glam N Glow New Appointment Booking:

Customer Name: ${booking.guestName}
Email: ${booking.guestEmail}
Phone Number: ${booking.guestPhone}
Date: ${booking.date}
Time: ${booking.time}
Service Selected: ${booking.serviceName}
Price Value: $${booking.priceValue}
Notes: ${booking.message || 'None'}
Booking Timestamp: ${timestamp}
  `;

  console.log('--- APPOINTMENT EMAIL NOTIFICATION TRIGGERED ---');
  console.log(emailText);
  console.log('------------------------------------------------');

  if (!host || !user || !pass) {
    console.warn('[Nodemailer] SMTP environment variables are not configured. Email skipped but logged above.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    });

    console.log('[Nodemailer] Notification email sent successfully. MessageID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Nodemailer] Error sending email notification:', error);
    return false;
  }
}

// Google Calendar API Event Creation Service
async function createGoogleCalendarEvent(booking: Booking) {
  try {
    const db = await readDB();
    const settings = db.settings;
    const duration = settings.appointmentDurationMinutes || 60;
    const timezone = settings.timezone || 'America/Chicago';
    const ownerEmail = settings.ownerEmail || 'sdasari8921@gmail.com';

    const { startISO, endISO } = parseDateTime(booking.date, booking.time, duration);

    const eventPayload = {
      summary: booking.guestName, // Requirement: Customer Name as event title
      description: `Customer Email: ${booking.guestEmail}\nCustomer Phone: ${booking.guestPhone}\nService: ${booking.serviceName}\nNotes: ${booking.message || 'None'}`,
      start: {
        dateTime: startISO,
        timeZone: timezone
      },
      end: {
        dateTime: endISO,
        timeZone: timezone
      }
    };

    console.log('--- GOOGLE CALENDAR EVENT CREATE REQUEST ---');
    console.log(JSON.stringify(eventPayload, null, 2));
    console.log('--------------------------------------------');

    // 1. Try Service Account if GOOGLE_SERVICE_ACCOUNT_KEY is configured
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        console.log('[Google Calendar] Authenticating via Service Account...');
        const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim();
        const creds = JSON.parse(keyString);

        const jwtClient = new JWT({
          email: creds.client_email,
          key: creds.private_key,
          scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
        });

        const tokenRes = await jwtClient.authorize();
        const accessToken = tokenRes.access_token;

        if (!accessToken) {
          throw new Error('Service Account authorization failed to obtain access token.');
        }

        console.log(`[Google Calendar] Adding event to calendar "${ownerEmail}"...`);
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(ownerEmail)}/events`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventPayload)
        });

        const result = await response.json() as any;
        if (!response.ok) {
          console.error('[Google Calendar] Service Account event creation failed. API response:', result);
          throw new Error(result.error?.message || 'Unknown calendar API error');
        }

        console.log('[Google Calendar] Event successfully created via Service Account. Event link:', result.htmlLink);
        return { success: true, method: 'Service Account', eventId: result.id };
      } catch (err: any) {
        console.error('[Google Calendar] Service Account attempt failed:', err.message || err);
      }
    }

    // 2. Try Stored OAuth Access Token from Owner login
    if (settings.googleOwnerToken) {
      try {
        console.log('[Google Calendar] Authenticating via stored Owner OAuth access token...');
        const accessToken = settings.googleOwnerToken;

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventPayload)
        });

        const result = await response.json() as any;
        if (!response.ok) {
          if (response.status === 401) {
            console.warn('[Google Calendar] Stored Owner OAuth token is expired (401). Removing token.');
            db.settings.googleOwnerToken = null;
            await writeDB(db);
          }
          console.error('[Google Calendar] OAuth event creation failed. API response:', result);
          throw new Error(result.error?.message || 'Unknown calendar API error');
        }

        console.log('[Google Calendar] Event successfully created via Owner OAuth token. Event link:', result.htmlLink);
        return { success: true, method: 'OAuth', eventId: result.id };
      } catch (err: any) {
        console.error('[Google Calendar] Owner OAuth attempt failed:', err.message || err);
      }
    }

    console.warn('[Google Calendar] No authentication methods succeeded or were available (check env and link state). Logged details above.');
    return { success: false, error: 'No active Google Calendar authentication available' };
  } catch (e: any) {
    console.error('[Google Calendar Integration Error]', e);
    return { success: false, error: e.message || 'Server error during calendar writing' };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB on boot
  await readDB();

  // API - Auth Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all fields.' });
      }

      const db = await readDB();
      const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone,
        password,
        loyaltyPoints: 100, // 100 sign-up bonus points!
        claimedRewards: []
      };

      db.users.push(newUser);
      await writeDB(db);

      // Return user omitting password
      const { password: _, ...safeUser } = newUser;
      return res.status(200).json({ success: true, user: safeUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
    }
  });

  // API - Auth Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const db = await readDB();
      const user = db.users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const { password: _, ...safeUser } = user;
      return res.status(200).json({ success: true, user: safeUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
  });

  // API - Get User Profile details
  app.get('/api/user/:userId/profile', async (req, res) => {
    try {
      const { userId } = req.params;
      const db = await readDB();
      const user = db.users.find((u: any) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const { password: _, ...safeUser } = user;
      return res.status(200).json({ success: true, user: safeUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
    }
  });

  // API - Get Bookings
  app.get('/api/user/:userId/bookings', async (req, res) => {
    try {
      const { userId } = req.params;
      const db = await readDB();
      const bookings = db.bookings.filter((b: any) => b.userId === userId);
      return res.status(200).json({ success: true, bookings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
    }
  });

  // API - Get Booked Slots for a specific date
  app.get('/api/bookings/booked-slots', async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ success: false, message: 'Date parameter is required.' });
      }

      const db = await readDB();
      const bookedSlots = db.bookings
        .filter((b: any) => b.date === date && b.status !== 'cancelled')
        .map((b: any) => b.time);

      return res.status(200).json({ success: true, bookedSlots });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve booked slots.' });
    }
  });

  // API - Get Salon Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const db = await readDB();
      // Don't leak Google OAuth token to client
      const { googleOwnerToken, ...safeSettings } = db.settings;
      return res.status(200).json({ success: true, settings: safeSettings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
    }
  });

  // API - Save Google OAuth Access Token (Owner only)
  app.post('/api/settings/save-token', async (req, res) => {
    try {
      const { email, accessToken } = req.body;
      if (!email || !accessToken) {
        return res.status(400).json({ success: false, message: 'Email and accessToken are required.' });
      }

      if (email.toLowerCase() !== 'sdasari8921@gmail.com') {
        return res.status(403).json({ success: false, message: 'Unauthorized. Only sdasari8921@gmail.com can link Google Calendar.' });
      }

      const db = await readDB();
      db.settings.googleOwnerToken = accessToken;
      db.settings.ownerEmail = email.toLowerCase();
      await writeDB(db);

      console.log(`[Google Calendar] Successfully stored Owner OAuth Access Token for ${email}`);
      return res.status(200).json({ success: true, message: 'Google Calendar linked successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to save access token.' });
    }
  });

  // API - Update Salon Settings (Owner only)
  app.post('/api/settings', async (req, res) => {
    try {
      const { email, businessHours, appointmentDurationMinutes, timeslots, timezone } = req.body;

      if (!email || email.toLowerCase() !== 'sdasari8921@gmail.com') {
        return res.status(403).json({ success: false, message: 'Unauthorized. Only sdasari8921@gmail.com can edit settings.' });
      }

      const db = await readDB();
      if (businessHours) db.settings.businessHours = businessHours;
      if (appointmentDurationMinutes) db.settings.appointmentDurationMinutes = Number(appointmentDurationMinutes);
      if (timeslots) db.settings.timeslots = timeslots;
      if (timezone) db.settings.timezone = timezone;

      await writeDB(db);
      return res.status(200).json({ success: true, settings: db.settings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to update settings.' });
    }
  });

  // API - Create Booking
  app.post('/api/bookings', async (req, res) => {
    try {
      const {
        userId,
        guestName,
        guestEmail,
        guestPhone,
        serviceName,
        priceValue,
        date,
        time,
        message,
        appliedRewardCode
      } = req.body;

      if (!guestName || !guestEmail || !guestPhone || !serviceName || !date || !time) {
        return res.status(400).json({ success: false, message: 'All booking parameters are required.' });
      }

      // Format validations
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address format.' });
      }
      if (!/^\+?[0-9\s\-()]{7,15}$/.test(guestPhone.trim())) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
      }

      const db = await readDB();

      // Prevent past dates
      const today = new Date();
      today.setHours(0,0,0,0);
      const bookingDate = new Date(date);
      if (bookingDate < today) {
        return res.status(400).json({ success: false, message: 'Appointments cannot be booked in the past.' });
      }

      // Check double-booking
      const hasConflict = db.bookings.some(
        (b: any) => b.date === date && b.time === time && b.status !== 'cancelled'
      );
      if (hasConflict) {
        return res.status(400).json({ success: false, message: 'This time slot is already reserved. Please select another time.' });
      }

      // Verify open days (Mondays closed by default)
      const dayOfWeek = new Date(date).getDay();
      if (db.settings.businessHours.closedDays.includes(dayOfWeek)) {
        return res.status(400).json({ success: false, message: 'The salon is closed on this day. Please select another date.' });
      }

      // Verify timeslots list
      if (!db.settings.timeslots.includes(time)) {
        return res.status(400).json({ success: false, message: 'Invalid booking time. Please pick a slot during business hours.' });
      }

      const numericPrice = Number(priceValue) || 0;

      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        userId: userId || null,
        guestName,
        guestEmail,
        guestPhone,
        serviceName,
        priceValue: numericPrice,
        date,
        time,
        status: 'confirmed',
        message: message || ''
      };

      db.bookings.push(newBooking);

      if (userId) {
        const userIndex = db.users.findIndex((u: any) => u.id === userId);
        if (userIndex !== -1) {
          let pointsToEarn = Math.floor(numericPrice);

          // Handle Reward Usage
          if (appliedRewardCode) {
            const rewardIndex = db.users[userIndex].claimedRewards.findIndex(
              (r: any) => r.code === appliedRewardCode && !r.used
            );
            if (rewardIndex !== -1) {
              db.users[userIndex].claimedRewards[rewardIndex].used = true;
              if (db.users[userIndex].claimedRewards[rewardIndex].rewardId === 'reward-10-percent') {
                pointsToEarn = Math.floor(pointsToEarn * 0.9);
              } else {
                pointsToEarn = 0; // Free award services do not earn further points
              }
            }
          }

          db.users[userIndex].loyaltyPoints += pointsToEarn;
        }
      }

      await writeDB(db);

      // Background processes (low-latency completion)
      sendEmailNotification(newBooking).catch(err => {
        console.error('[Nodemailer error in background]', err);
      });

      createGoogleCalendarEvent(newBooking).catch(err => {
        console.error('[Google Calendar error in background]', err);
      });

      return res.status(200).json({ 
        success: true, 
        booking: newBooking,
        message: 'Thank you! Your appointment has been booked successfully. We look forward to seeing you.'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to create booking.' });
    }
  });

  // API - Cancel Booking
  app.post('/api/bookings/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDB();
      const bookingIndex = db.bookings.findIndex((b: any) => b.id === id);

      if (bookingIndex === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      db.bookings[bookingIndex].status = 'cancelled';
      await writeDB(db);

      return res.status(200).json({ success: true, booking: db.bookings[bookingIndex] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
    }
  });

  // API - Claim Loyalty Reward
  app.post('/api/rewards/claim', async (req, res) => {
    try {
      const { userId, rewardId, title, pointsCost } = req.body;

      if (!userId || !rewardId || !title || !pointsCost) {
        return res.status(400).json({ success: false, message: 'Reward details and user are required.' });
      }

      const db = await readDB();
      const userIndex = db.users.findIndex((u: any) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const user = db.users[userIndex];
      if (user.loyaltyPoints < pointsCost) {
        return res.status(400).json({ success: false, message: 'Insufficient points balance.' });
      }

      const randomSegment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomSegment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newReward: ClaimedReward = {
        id: `reward-${Date.now()}`,
        rewardId,
        title,
        pointsCost,
        code: `GLOW-${randomSegment1}-${randomSegment2}`,
        used: false
      };

      db.users[userIndex].loyaltyPoints -= pointsCost;
      db.users[userIndex].claimedRewards.push(newReward);

      await writeDB(db);

      return res.status(200).json({
        success: true,
        loyaltyPoints: db.users[userIndex].loyaltyPoints,
        claimedReward: newReward
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to claim reward.' });
    }
  });

  // Legacy API Support - Booking / Contact Route
  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, date, time, message } = req.body;

    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, service, date, and time.'
      });
    }

    // Basic format validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format.' });
    }
    if (!/^\+?[0-9\s\-()]{7,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
    }

    try {
      const db = await readDB();

      // Prevent past dates
      const today = new Date();
      today.setHours(0,0,0,0);
      const bookingDate = new Date(date);
      if (bookingDate < today) {
        return res.status(400).json({ success: false, message: 'Appointments cannot be booked in the past.' });
      }

      // Check double-booking
      const hasConflict = db.bookings.some(
        (b: any) => b.date === date && b.time === time && b.status !== 'cancelled'
      );
      if (hasConflict) {
        return res.status(400).json({ success: false, message: 'This time slot is already reserved. Please select another time.' });
      }

      const guestBooking: Booking = {
        id: `book-${Date.now()}`,
        userId: null,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        serviceName: service,
        priceValue: 75, // base default price
        date,
        time,
        status: 'confirmed',
        message: message || ''
      };
      db.bookings.push(guestBooking);
      await writeDB(db);

      // Async triggers
      sendEmailNotification(guestBooking).catch(err => {
        console.error('[Nodemailer error in background]', err);
      });

      createGoogleCalendarEvent(guestBooking).catch(err => {
        console.error('[Google Calendar error in background]', err);
      });

      return res.status(200).json({
        success: true,
        message: `Thank you, ${name}! Your booking request for ${service} on ${date} at ${time} has been submitted successfully. We will reach out to you shortly to confirm your appointment.`
      });
    } catch (e) {
      console.error('Failed to log guest contact booking in file', e);
      return res.status(500).json({ success: false, message: 'Failed to process contact booking.' });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Full-stack beauty salon running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start server:', err);
});
