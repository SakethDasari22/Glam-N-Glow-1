# Glam N Glow Beauty Bar 🌸✨

A premium, production-ready, full-stack website and scheduling system for **Glam N Glow Beauty Bar**, located in Naperville, IL. Built with an elegant soft cream, blush, and champagne aesthetic, highlighted by delicate gold accents, luxurious Playfair Display headings, and fluid scroll transitions.

---

## 🎨 Visual Identity & Architecture

- **Color Palette:** Soft Cream (`#FCF9F5`), Blush (`#FAF0E6`), Champagne (`#F5EBE0`), Classic Charcoal (`#2A2521`), and Antique Gold (`#C5A059`).
- **Typography:** Display Headings in elegant **Playfair Display**, and highly readable, accessible body text in **Inter**.
- **Animations:** Custom transitions using **Framer Motion (`motion/react`)** for smooth, staggered fade-in-up section entries, interactive media filters, and an immersive gallery lightbox.
- **Full-Stack Ingress:** Built as a full-stack Node.js server powered by **Express** and **Vite 6** to support a production-grade secure contact/scheduling API route (`/api/contact`).

---

## 📂 Project Structure

```bash
├── server.ts              # Full-stack Express server (Vite middleware in dev, static server in prod)
├── index.html             # Main HTML entrypoint
├── package.json           # Scripts, dependencies (React 19, Vite 6, Express 4, Framer Motion)
├── tsconfig.json          # TypeScript configurations
├── vite.config.ts         # Vite bundler options & Tailwind v4 compiler plugins
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # App layout, state routing, and AnimatePresence transitions
│   ├── index.css          # Global Tailwind v4 styles, Google Fonts imports, custom colors
│   ├── data.ts            # Salon specifications, full grouped services list, team bios, testimonials
│   ├── types.ts           # Shared TypeScript interfaces (ServiceItem, Testimonial, BookingFormState)
│   └── components/
│       ├── Navbar.tsx     # Responsive navigation header with slide-out mobile drawer
│       ├── Footer.tsx     # Information-rich footer with business NAP, hours, and quick links
│       ├── HomeView.tsx   # Hero, guest reviews, stats banner, and premium call-to-actions
│       ├── ServicesView.tsx # Grouped services menu cards with "from $" pricing and quick booking
│       ├── GalleryView.tsx # Responsive portfolio grid with a full-screen interactive lightbox
│       ├── AboutView.tsx  # Brand heritage timeline, team bio cards, and corporate pillars
│       └── ContactView.tsx # Address card, business hours list, map, and dynamic booking form
```

---

## 📅 Business Specifications (NAP & Hours)

- **Name:** Glam N Glow Beauty Bar
- **Address:** 2760 Aurora Ave, Suite 100, Naperville, IL 60540
- **Phone:** (872) 400-0706
- **Hours:** Tuesday – Sunday: 10:00 AM – 7:00 PM, Monday: Closed
- **Established:** 2010
- **Rating:** 4.8 Stars (18+ verified Google/Yelp reviews)

---

## 🚀 Local Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Full-Stack Dev Server
This boots the Express backend integrated with Vite's Dev Server on Port `3000`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Compile for Production
Generates optimized front-end assets in `dist/` and bundles `server.ts` into a lightweight, self-contained CommonJS Node server (`dist/server.cjs`) using `esbuild`:
```bash
npm run build
```

### 4. Run Production Server
```bash
npm start
```

---

## 🔌 API Documentation: `/api/contact`

Our custom Express booking engine validates booking requests server-side and log transactions securely (ready for SMTP, Resend, or Formspree integration).

### POST Request Schema
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "6305550199",
  "service": "Airtouch Highlights",
  "date": "2026-07-15",
  "time": "11:00 AM",
  "message": "My hair is medium-length, dark brown."
}
```

### Success Response (Status 200)
```json
{
  "success": true,
  "message": "Thank you, Jane Doe! Your booking request for Airtouch Highlights on 2026-07-15 at 11:00 AM has been submitted successfully."
}
```

---

## ☁️ Deployment Instructions

### Option A: Deploy to Cloud Run / Docker Container (Recommended)
This is the default configuration for this full-stack project.
1. Build the container image:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/glamnglow
   ```
2. Run on Cloud Run (mapping Port `3000` to ingress):
   ```bash
   gcloud run deploy glamnglow --image gcr.io/YOUR_PROJECT_ID/glamnglow --platform managed --port 3000 --allow-unauthenticated
   ```

### Option B: Deploy to Vercel (Next.js / Jamstack Option)
If you decide to migrate or host this code as a static Jamstack application with serverless functions on Vercel:
1. Put the static build output inside Vercel. In **Vercel Project Settings**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
2. To use serverless functions for the API on Vercel, simply copy the logic inside `server.ts` to a Vercel-compatible serverless folder `/api/contact.ts`.
