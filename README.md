# 🫀 OrganEase™ 2.0 — National Organ Allocation & Viability Tracking Platform

> **Next-Generation Biomedical MERN Platform** designed with **Minimalism & Glassmorphism ("Glamorphism")**, bridging transplant surgery centers with regional hypothermic procurement banks in real time.

---

## 🌟 Key Upgrades & Highlights

1. **Minimalist & Glassmorphic UI ("Glamorphism")**:
   - Deep cosmic biomedical background with frosted glass cards (`backdrop-blur-xl`, `border-white/10`, bioluminescent emerald/cyan/rose accents).
   - Fluid typography, micro-interactions, responsive frosted modals, and slide-over allocation drawer.

2. **Real-Time Cold Ischemia Viability Countdown**:
   - Dynamic countdown timers for every donor allograft based on clinical limits (Cardiac: 4-6h STAT, Pulmonary: 6-8h, Whole Liver: 8-12h, Renal: 24-36h HMP, Cornea: 14 days).
   - Visual urgency gauge: Safe (Emerald) ➔ Caution (Amber) ➔ Critical STAT (Pulsing Crimson).

3. **Complete Backend Feature Coverage**:
   - **Public / Browse Registry**: Search by organ name or bank, filter by category (Kidneys, Liver, Heart, Lungs, Corneas, Pancreas), filter by Blood Group compatibility (O-, O+, A+, B+, etc.), sort by urgency or fee.
   - **Allograft Details (`/products/:id`)**: High-res image preview, clinical preservation profile (temperature, preservation fluids, HLA matching notes), surgeon biopsy reviews and star ratings.
   - **Emergency Watchlist (`/wish-list`)**: 1-click allograft bookmarking for scheduled transplant procedures.
   - **Requisition Queue & Checkout (`/checkout`)**: Slide-over frosted glass drawer, hospital destination form, emergency contact, token confirmation fee authorization, and instant unique transaction ID generation.
   - **Hospital Dashboard (`/user/profile`, `/user/orders`, `/user/setting`)**: Order tracking with real-time status progression stepper (`Submitted` ➔ `Under Scrutiny` ➔ `Accepted` ➔ `In Transit` ➔ `Delivered`).
   - **Procurement Command Center (`/admin/dashboard`)**: KPI metrics, live order status modification (accept, dispatch green corridor, deliver, reject), organ inventory management (add/edit/delete organs), organ category management, and portal announcement slider management.

4. **Zero-Setup Instant Demo Duality**:
   - Fully connects to MongoDB (local or MongoDB Atlas via `.env`).
   - Built-in instant fallback store with rich mock organ data and seeded accounts so every single feature runs out-of-the-box immediately even before configuring a database!

---

## 🚀 Quick Start Guide

### 1. Start the Backend Server (Port 8000)
```bash
cd backend
npm install
npm start
```
*Health check URL: [http://localhost:8000/api/health](http://localhost:8000/api/health)*

### 2. Start the Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Open in browser: [http://localhost:3000](http://localhost:3000)*

---

## 🔑 Quick Demo Credentials

You can use the **1-Click Demo Login** buttons inside the portal modal, or use the credentials below:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Hospital / Surgeon** | `hospital@aims.org` | `hospital12345` | Requisition Organs, View Tracking, Hospital Profile |
| **Procurement Admin** | `admin@organease.org` | `admin12345` | Accept Requests, Dispatch Organs, Manage Inventory |

---

## 📁 Project Structure

```
c:\mern-own-project\
├── backend/
│   ├── config/               # DB connection, mock fallback store, upload folders
│   ├── controller/           # Auth, Categories, Products, Orders, Users, Customize
│   ├── middleware/           # JWT verification & role authorization (isAuth, isAdmin)
│   ├── models/               # Mongoose schemas (Products, Categories, Orders, Users, Customize)
│   ├── routes/               # Express REST API routes
│   ├── seed.js               # Clinical sample data seeder
│   └── server.js             # Server entry point with graceful fallback
│
└── frontend/
    ├── public/               # Organ SVG logo and static assets
    ├── src/
    │   ├── components/       # Frosted glass Navbar, Footer, ViabilityTimer, Modals, Drawer
    │   ├── context/          # Auth, Cart, Wishlist, Toast state management
    │   ├── pages/            # Home, Details, Watchlist, Checkout, User & Admin Dashboards
    │   ├── services/         # Axios API client
    │   ├── App.jsx           # Client router
    │   └── index.css         # Custom Glassmorphism styles & animations
    ├── vite.config.js        # Vite dev server with proxy to backend
    └── tailwind.config.js    # Glassmorphism & biomedical color palette
```

---

## 🩺 Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express, Mongoose 8, JWT, BcryptJS, Multer
- **Design System**: Frosted Glassmorphism, Deep Cosmic Bioluminescent Palette, Responsive Mobile-to-Desktop
