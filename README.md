# 💘 Merry Match — Final Project (TechUp Bootcamp)

**Merry Match** is a full-stack dating web application inspired by Tinder, developed as a final project during the full-stack developer bootcamp at [TechUp](https://www.techupth.com/).  
This project was collaboratively built by a team of 5 members, using modern tools like **Next.js**, **Supabase**, **Stripe**, and more.

---

## 🔗 Live Demo & UI Design

- 🔗 **Live Site**: [https://merry-match-ihmu.onrender.com](https://merry-match-ihmu.onrender.com)  
- 🎨 **Figma Design**: [Merry Match UI](https://www.figma.com/design/hrHQRTVfoR2fiYwjQCHHWG/Merry-Match?node-id=0-1&p=f&t=o72TELqHYpvkz9VP-0)

---

## 📌 Description

Merry Match is a web application that enables users to discover potential matches through a Tinder-style swipe interface.  
The platform provides a rich set of features for both users and administrators.

### 👥 Users can:
- Register, login, and manage their personal profiles
- Swipe left/right to like or skip potential matches (Merry system)
- Engage in **live chat** with mutual matches
- Receive **notifications** for new messages or interactions
- Upgrade via **paid packages** to increase daily match limits (via **Stripe**)
- Submit complaints via a user support system

### 🛠️ Admins can:
- Manage users, packages, and match settings
- View and respond to user complaints
- Monitor platform activity through the admin dashboard

---

## 🌟 Key Features

- 🎴 Swipe-based matching interface (like Tinder)
- 🔐 Authentication & session management with Supabase
- 💬 Real-time chat with match notifications
- 🔔 Notification system with in-app indicators
- 📦 Tiered package system with feature unlocks
- 💳 Secure payment processing via Stripe
- 🧑 Admin dashboard for user, match, and complaint management
- 📄 PDF invoice generation via Puppeteer & pdf-lib
- 📷 Image compression & upload for profile pictures
- 🌍 Country/state/city data auto-fill in forms
- 📱 Fully responsive and animated using Framer Motion

---

## 🛠️ Tech Stack

| Layer        | Tools / Libraries |
|--------------|-------------------|
| Frontend     | Next.js (Pages Router), React, Tailwind CSS, MUI, Emotion, Lucide Icons, Framer Motion |
| Backend      | Supabase (DB, Auth, Realtime), Supabase Storage, Next API Routes |
| Authentication | Supabase Auth Helpers |
| Payment      | Stripe API |
| File Upload  | Supabase Storage + `browser-image-compression` |
| Chat System  | Supabase Realtime + custom UI |
| Admin Tools  | Custom Next.js pages |
| Others       | Axios, Day.js, PDF-lib, Puppeteer, React Hook Form, UUID, Crypto-JS |
