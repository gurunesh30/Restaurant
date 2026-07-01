# Annapurna — Restaurant Management System

A full-stack restaurant management platform providing digital menu browsing, table reservation management, and an administrative dashboard for operations and analytics.

## Overview

Annapurna is built as a two-tier application: a React/TypeScript client and a Node.js/Express API server, backed by MongoDB. It supports customer-facing menu and reservation flows alongside an internal admin console for staff to manage inventory, reservations, and performance metrics.

## Features

- **Menu Management** — Categorized menu catalog with dietary classification (veg/non-veg), availability status, and trending indicators.
- **Table Reservations** — Interactive floor plan (Ground, Lounge, Patio) with real-time availability and booking status tracking (Pending, Confirmed, Completed, Cancelled).
- **Admin Dashboard** — Weekly revenue and booking analytics, menu CRUD operations with image upload, and reservation lifecycle management.
- **Authentication** — Google OAuth 2.0 via Passport.js, session management with JWT.
- **Responsive UI** — Component-driven design system built on CSS variables.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | Passport.js (Google OAuth strategy), JWT |
| Media Storage | Cloudinary |

## Prerequisites

- Node.js v16 or later
- A MongoDB Atlas cluster
- A Cloudinary account
- A Google Cloud Console project with OAuth 2.0 credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/lightning4747/Restaurant.git
cd Restaurant
```

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` using the template below. **Do not commit this file or any real credentials to version control.**

```env
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# URLs
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Initial admin bootstrap (set once, then rotate/remove)
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Seed the database and start the server:

```bash
npm run seed          # menu categories and items
npm run seed:tables   # table/floor layout
npm run dev
```

### 3. Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=
```

Start the client:

```bash
npm run dev
```

## Configuration Reference

| Service | Purpose | Provisioning |
|---|---|---|
| MongoDB Atlas | Primary datastore | mongodb.com |
| Google OAuth | Authentication | Google Cloud Console |
| Cloudinary | Menu image storage | cloudinary.com |
| Google Maps API | Contact/location page | Google Cloud Console |

## Security Notes

- All secrets are supplied via environment variables and must never be committed to source control.
- The `ADMIN_EMAIL` / `ADMIN_PASSWORD` bootstrap values are for initial setup only; rotate or disable them after the first admin account is provisioned.
- Add `.env` to `.gitignore` in both `server/` and `client/` if not already present.

## Screenshots

| | |
|---|---|
| Home | `client/public/screenshots/homeintro.png` |
| Trending Dishes | `client/public/screenshots/trending.png` |
| Menu | `client/public/screenshots/menu.png` |
| Table Reservation | `client/public/screenshots/tables.png` |
| Admin Dashboard | `client/public/screenshots/admin-dashboard.png` |
| Menu Admin | `client/public/screenshots/admin-menu.png` |
| Contact | `client/public/screenshots/contact.png` |
| Authentication | `client/public/screenshots/signup.png` |

## License

Specify a license (e.g., MIT) here if this project is intended for public distribution.