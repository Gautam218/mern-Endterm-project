# OrganEase — National Organ Allocation & Viability Tracking Platform


---

## 📌 Problem Statement

In organ transplantation, **time is the most critical determinant of graft survival and patient mortality**. However, conventional organ procurement and hospital transfer requests have historically depended on fragmented, manual communication channels—such as phone calls, emails, paper ledgers, and faxes across decentralized regional procurement centers. 

This manual paradigm creates grave challenges:
- **Severe Time Delays & Graft Ischemia**: Calling centers individually wastes irreplaceable hours while harvested organs approach their cold ischemia time limits.
- **Communication Inefficiencies & Data Entry Errors**: Manual ledger entries result in typographical mistakes in compatibility matching, HLA typing, and blood groups.
- **Lack of Centralized Inventory Visibility**: Transplant surgical units cannot instantly view which compatible allografts are currently preserved in regional hypothermic storages across neighboring centers.

---

## 👥 Target Users

OrganEase is engineered for verified medical institutions and healthcare operators:
1. **Transplant Surgery Units & Hospitals**: Surgeons, transplant coordinators, and emergency surgical teams requiring rapid identification, reservation, and requisition of compatible donor allografts for patients awaiting surgery.
2. **Organ Procurement Organizations (OPOs) & Tissue Banks**: Retrieval coordinators and hypothermic storage bank administrators responsible for logging harvested allografts, monitoring cold ischemia preservation limits, and confirming transfer authorizations.
3. **National & Regional Transplant Registries**: Regulatory bodies auditing organ allocation ethics, cold chain compliance, and crossmatch verification records.

---

## 💡 Solution

OrganEase establishes a centralized, real-time, digital organ transfer and hypothermic preservation registry. 

- **Unified Digital Storage Bank**: Consolidates real-time listings of donor allografts stored across regional hypothermic banks into a single accessible portal.
- **Algorithmic Compatibility Filtering**: Allows hospitals to filter organs in seconds by blood group compatibility (e.g., O- universal donor, A+, B+, AB+), cold ischemia limits, and anatomical classifications.
- **Active Cold Ischemia Viability Countdown**: Displays live, ticking preservation countdown timers for every organ with color-coded urgency indicators to prevent graft expiration.
- **Transparent Token Transfer Authorization**: Facilitates confirmed hospital allocation requests via an encrypted protocol token fee, prompting procurement centers to review, accept, and trigger green-corridor ambulance dispatch.

---

## ⚡ Key Features

### For Hospitals & Transplant Surgeons:
- **Live Allograft Catalog**: Browse organs with high-resolution clinical imaging, preservation fluid specifications, and retrieval bank locations.
- **Compatibility & Urgency Filtering**: Instantly isolate donor organs by blood group, maximum cold ischemia hours, or classification (Kidneys, Liver, Heart, Lungs, Cornea, Pancreas).
- **Real-Time Viability Gauges**: Active countdown timer for every organ showing remaining viability with color-coded warnings: **Optimal (Emerald)** ➔ **Caution (Amber)** ➔ **Critical STAT (Pulsing Crimson)**.
- **Clinical Details & Biopsy Observations**: Detailed profiles featuring preservation temperature (2°C–4°C), HLA match notes, and peer review logs submitted by harvesting specialists.
- **Emergency Watchlist**: One-click bookmarking of candidate allografts for scheduled surgery cross-matching.
- **Streamlined Requisition Drawer & Checkout**: Slide-over requisition queue, destination operating theater entry, surgeon emergency contact input, and protocol token authorization generating unique tracking hashes (`TXN-ORG-XXXXXX`).
- **Hospital Progression Dashboard**: Live 5-stage status stepper (`Submitted` ➔ `Under Scrutiny` ➔ `Accepted` ➔ `In Transit` ➔ `Delivered`) to track dispatch in real time.

### For Procurement Centers & Registry Admins:
- **Allocation Command Dashboard**: High-level KPI metrics on total active allografts, pending hospital claims, registered medical centers, and token volume.
- **Transfer Request Management**: Review incoming requisitions with instant 1-click status updates (**Accept Request**, **Dispatch Green Corridor**, **Mark Delivered**, or **Reject/Cancel**).
- **Allograft Inventory Management**: Full administrative CRUD functionality to add newly harvested organs, edit perfusion parameters, and remove expired records.
- **Category & Announcement Customization**: Manage anatomical categories and update homepage emergency alert banners.
- **One-Click Demo Access**: Fast-login demo buttons allowing immediate institutional evaluation without manual sign-up overhead.

---

## 🛠️ Tech Stack

### Frontend:
- **React 18** — High-performance declarative user interface library
- **Vite** — Next-generation frontend build tooling and development server
- **Tailwind CSS** — Modern utility-first CSS framework customized for glassmorphism
- **Lucide React** — Crisp medical, surgical, and administrative vector iconography
- **Axios** — Promise-based HTTP client with request and response interceptors
- **React Router DOM v6** — Client-side declarative routing and protected routes
- **Canvas Confetti** — Micro-interaction celebration upon transfer confirmation

### Backend:
- **Node.js** — Asynchronous event-driven JavaScript runtime environment
- **Express.js** — Minimalist RESTful API framework
- **MongoDB & Mongoose 8** — Document-oriented NoSQL database with strict schema modeling
- **JSON Web Tokens (JWT)** — Stateless role-based authentication and route authorization
- **BcryptJS** — One-way cryptographic hashing for secure password storage
- **Multer** — Multi-part form-data processing for clinical documentation uploads

---

## 🏗️ Architecture

OrganEase follows a decoupled client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│               Client Tier (Vercel)                     │
│  - React 22 SPA with Custom Glassmorphism System       │
│  - Global State Contexts (Auth, Cart, Wishlist, Toast) │
│  - Live Viability Timers & Responsive Views            │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON REST API
┌──────────────────────────▼─────────────────────────────┐
│              Server Gateway Tier (Render)              │
│  - Express REST API & CORS Gateway                     │
│  - JWT Middleware & Role Authorization Guard           │
│  - Controllers: Auth, Products, Categories, Orders     │
│  - Dual-Mode Resilience Bridge (Live DB / Fallback)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM Driver
┌──────────────────────────▼─────────────────────────────┐
│               Data Tier (MongoDB Atlas)                │
│  - Users Collection (Hospitals & Procurement Admins)   │
│  - Products Collection (Donor Organs & Viability Logs) │
│  - Categories Collection (Anatomical Classifications)  │
│  - Orders Collection (Requisition & Transfer Tracks)   │
└────────────────────────────────────────────────────────┘
```

---

## 💻 Local Setup

### Prerequisites:
- **Node.js** (v18 or higher installed)
- **NPM** (v9 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Gautam218/mern-Endterm-project.git
cd mern-Endterm-project
```

### 2. Configure & Run Backend
Open a terminal in the project root:
```bash
cd backend
npm install
npm start
```
*The backend server will launch on `http://localhost:8000`. Test endpoint: `http://localhost:8000/api/health`.*

### 3. Configure & Run Frontend
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
*The Vite frontend will launch on `http://localhost:3000`.*

---

## 🔐 Environment Variables

### Backend Configuration (`backend/.env`):
Create a file named `.env` in the `backend/` directory:

```env
# Server Port
PORT=8000

# MongoDB Database Connection
# Local MongoDB:
DATABASE=mongodb://127.0.0.1:27017/OrganEase
# Or MongoDB Atlas:
# DATABASE=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/OrganEase?retryWrites=true&w=majority

# JWT Token Secret
JWT_SECRET=OrganEase_BioMed_Secure_JWT_Secret_2026


```

### Frontend Configuration (`frontend/.env`):
Optional for local development (defaults to local Vite proxy):
```env
VITE_API_BASE_URL=/api
```

---

## 🚀 Deployment

The platform is deployed and publicly accessible in production:

| Deployment | Provider | Live URL |
| :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://organize-self.vercel.app/](https://organize-self.vercel.app/) |
| **Backend REST API** | **Render** | [https://mern-endterm-project.onrender.com](https://mern-endterm-project.onrender.com) |
| **Database Cluster** | **MongoDB Atlas** | Production Cloud Cluster |

### Demo Credentials for Evaluation:
Use the **1-Click Demo Login** buttons inside the portal modal, or use the following credentials:

| Institutional Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Hospital / Transplant Unit** | `hospital@aims.org` | `hospital12345` | Requisition allografts, monitor cold ischemia countdowns, track transfer progress |
| **Procurement Admin** | `admin@organease.org` | `admin12345` | Accept requests, dispatch green corridor, manage organ listings & categories |
