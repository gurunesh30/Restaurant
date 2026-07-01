```markdown
# Annapurna - Restaurant Management System

## Architecture Overview

Annapurna is a production-grade restaurant management platform built with a decoupled architecture. The system handles two primary domains: customer-facing operations (menu browsing, table reservations) and administrative workflows (inventory management, business intelligence). The frontend and backend communicate through a RESTful API layer with JWT-based authentication.

---

## Core Domains

### Customer Experience

- **Dynamic Menu System**  
  Items are organized by category with runtime status indicators (Veg/Non-Veg, availability, trending designation). The trending algorithm weights recent order frequency and user engagement signals.

- **Floor Plan Reservation**  
  Multi-floor table mapping (Ground, Lounge, Patio) with real-time slot availability. The reservation service validates against existing bookings and table capacity constraints at the time of request.

- **Authentication Flow**  
  OAuth 2.0 implementation via Google Identity Services with token-based session management.

### Administrative Operations

- **Business Intelligence Dashboard**  
  Weekly aggregated metrics including revenue trends, booking conversion rates, and dish performance analytics derived from order data.

- **Menu CRUD**  
  Full lifecycle management of menu items with Cloudinary integration for asset handling. Supports image optimization presets through Cloudinary's transformation API.

- **Reservation Workflow**  
  State machine for booking statuses (`Pending → Confirmed → Completed | Cancelled`). Status transitions trigger relevant side effects (table availability updates, notification dispatch).

---

## Technical Stack

| Layer | Technology | Justification |
|:------|:-----------|:--------------|
| Client Runtime | React 18, TypeScript, Vite | Type safety across the component tree; Vite for sub-second HMR in development |
| UI Primitives | Lucide React, CSS Custom Properties | Zero-runtime CSS variable system for theming; tree-shakeable icon library |
| HTTP Client | Axios | Interceptor architecture for token refresh and error normalization |
| API Server | Node.js, Express, TypeScript | Shared type definitions with client; middleware composition for auth, validation, error handling |
| Data Layer | Mongoose ODM, MongoDB Atlas | Document model aligns with nested reservation structures; Atlas handles scaling concerns |
| Auth | Passport.js (Google Strategy), JWT | Passport decouples provider logic; JWT for stateless API authentication |
| Asset Management | Cloudinary SDK | Server-side signed uploads; on-the-fly image transformations |

---

## Prerequisites

- **Node.js** 18 LTS or higher
- **MongoDB Atlas** cluster (M0 free tier sufficient for development)
- **Cloudinary** account with upload preset configured
- **Google Cloud Platform** project with OAuth 2.0 credentials

---

## Environment Configuration

### Server (`server/.env`)

```env
PORT=8000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/annapurna

# JWT signing configuration
JWT_SECRET=<cryptographically-random-string>
JWT_EXPIRES_IN=7d

# Google OAuth 2.0 - Web application credentials
GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Cloudinary - Signed upload configuration
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# CORS origins
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Seed admin credentials (change after initial setup)
ADMIN_EMAIL=vignesh112847@gmail.com
ADMIN_PASSWORD=vignesh1128
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=<maps-api-key>
```

---

## Setup Procedure

### 1. Repository Initialization

```bash
git clone https://github.com/lightning4747/Restaurant.git
cd Restaurant
```

### 2. Backend Bootstrap

```bash
cd server
npm install

# Seed menu catalog with categories and items
npm run seed

# Initialize floor plans and table inventory
npm run seed:tables

# Start development server with hot reload
npm run dev
```

> **Note:** The seed scripts populate the database with a baseline menu structure and table layout across three zones. These are idempotent—running them against an existing database will skip duplicate entries.

### 3. Frontend Bootstrap

```bash
cd ../client
npm install
npm run dev
```

> Vite dev server starts on port `5173` with proxy configuration handled through the Vite config, not the env file.

---

## External Service Dependencies

| Service | Integration Point | Purpose |
|:--------|:------------------|:--------|
| MongoDB Atlas | Connection string in `MONGO_URI` | Primary data store for menu items, reservations, user profiles |
| Google Identity | OAuth 2.0 web flow | User authentication and profile retrieval |
| Cloudinary | Upload API with signed requests | Menu item image upload, storage, and delivery with CDN |
| Google Maps Embed | Client-side Maps JavaScript API | Embedded location map on contact page |

---

## Key Design Decisions

1. **Stateless JWT over sessions**  
   Enables horizontal scaling without sticky sessions. Token invalidation is handled through short expiration (7d) and client-side removal on logout.

2. **Cloudinary signed uploads**  
   Server-side signature generation prevents exposure of API secrets to the client while maintaining direct-to-Cloudinary upload throughput.

3. **Table reservation as a state machine**  
   Explicit status transitions prevent invalid state mutations (e.g., completing a cancelled reservation) through validation middleware on each status update endpoint.

4. **CSS Custom Properties for theming**  
   The design system variables are defined in a single source file. Runtime theme switching requires zero JavaScript computation—only variable reassignment.

---

## UI Reference

| View | Description |
|:-----|:------------|
| Home Page | Landing section with hero banner |
| Trending Items | Dynamically populated carousel based on engagement metrics |
| Full Menu | Categorized display with inline status indicators |
| Table Reservation | Interactive floor plan with real-time availability |
| Admin Dashboard | Weekly revenue, booking counts, dish performance charts |
| Menu Management | CRUD interface with Cloudinary upload widget |
| Contact & Location | Embedded Google Maps with restaurant details |
| Authentication | OAuth consent screen integration |
```

---

Let me know if you'd like to add any other sections—such as API documentation, testing strategy, deployment pipeline, or contribution guidelines.