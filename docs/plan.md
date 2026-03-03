# 🍽️ Restaurant Website — Full Project Documentation

> **Stack:** React + Vite + TypeScript · Node.js + Express + TypeScript · MongoDB Atlas · Bootstrap 5 · GSAP · Cloudinary · Google OAuth

---

## 📁 Folder Structure

```
restaurant-app/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── MenuItemCard.tsx
│   │   │   │   └── StarRating.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSlider.tsx
│   │   │   │   ├── TrendingItems.tsx
│   │   │   │   └── LocationSection.tsx
│   │   │   ├── menu/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── CategoryTabs.tsx
│   │   │   │   └── MenuGrid.tsx
│   │   │   ├── reservation/
│   │   │   │   ├── TableMap.tsx
│   │   │   │   ├── TableSlot.tsx
│   │   │   │   └── BookingForm.tsx
│   │   │   ├── contact/
│   │   │   │   └── ContactInfo.tsx
│   │   │   └── admin/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── DashboardStats.tsx
│   │   │       ├── RevenueChart.tsx
│   │   │       ├── TopItemsChart.tsx
│   │   │       ├── RecentBookings.tsx
│   │   │       ├── MenuForm.tsx
│   │   │       ├── CategoryForm.tsx
│   │   │       └── BookingTable.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Reservation.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Login.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ManageMenu.tsx
│   │   │       ├── ManageCategories.tsx
│   │   │       ├── ManageBookings.tsx
│   │   │       └── ManageTables.tsx
│   │   ├── hooks/
│   │   │   ├── useMenu.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useReservation.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useAdmin.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── menuService.ts
│   │   │   ├── categoryService.ts
│   │   │   ├── reservationService.ts
│   │   │   ├── authService.ts
│   │   │   └── adminService.ts
│   │   ├── types/
│   │   │   ├── category.types.ts
│   │   │   ├── menu.types.ts
│   │   │   ├── reservation.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── admin.types.ts
│   │   │   └── api.types.ts
│   │   ├── utils/
│   │   │   ├── gsapAnimations.ts
│   │   │   └── formatters.ts
│   │   ├── data/
│   │   │   └── mockData.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── passport.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── menuController.ts
│   │   │   ├── reservationController.ts
│   │   │   └── adminController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── adminMiddleware.ts
│   │   │   ├── uploadMiddleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Category.ts          ← new
│   │   │   ├── MenuItem.ts
│   │   │   ├── Reservation.ts
│   │   │   └── Table.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── categoryRoutes.ts    ← new
│   │   │   ├── menuRoutes.ts
│   │   │   ├── reservationRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   ├── category.types.ts
│   │   │   ├── menu.types.ts
│   │   │   ├── reservation.types.ts
│   │   │   └── user.types.ts
│   │   ├── utils/
│   │   │   ├── generateToken.ts
│   │   │   └── seedData.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Relations

```
User
 └── _id ──────────────────────────── Reservation.userId (optional, null if guest)

Category
 └── _id ──────────────────────────── MenuItem.categoryId (ObjectId ref)

MenuItem
 └── _id  (no direct FK — orders are tracked via analytics, not a separate Order model yet)

Table
 └── _id ──────────────────────────── Reservation.tableId (ObjectId ref)

Reservation
 ├── tableId  → ref: Table
 └── userId   → ref: User (optional)
```

### ERD (simplified)

```
┌──────────┐       ┌──────────────┐        ┌──────────┐
│  User    │       │  MenuItem    │        │ Category │
│──────────│       │──────────────│        │──────────│
│ _id      │◄──┐   │ _id          │        │ _id      │
│ name     │   │   │ name         │        │ name     │
│ email    │   │   │ price        │        │ slug     │
│ role     │   │   │ categoryId   │───────►│ image    │
└──────────┘   │   │ image        │        │ sortOrder│
               │   │ isVeg        │        └──────────┘
               │   │ isTrending   │
               │   │ available    │
               │   └──────────────┘
               │
┌─────────────────┐        ┌──────────┐
│  Reservation    │        │  Table   │
│─────────────────│        │──────────│
│ _id             │        │ _id      │
│ userId          │───────►│ number   │
│ tableId         │───────►│ capacity │
│ customerName    │        │ shape    │
│ customerEmail   │        │ position │
│ customerPhone   │        │ floor    │
│ date            │        └──────────┘
│ time            │
│ guests          │
│ status          │
│ notes           │
└─────────────────┘
```

---

## 🔌 API Endpoints & Route Documentation

### Base URL
```
Development:  http://localhost:8000/api
Production:   https://your-domain.com/api
```

---

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/auth/google` | Initiate Google OAuth flow | ❌ |
| `GET` | `/auth/google/callback` | OAuth callback, returns JWT | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ User |
| `POST` | `/auth/logout` | Clear session | ✅ User |

---

### 🏷️ Category Routes — `/api/categories`

> All categories are stored in DB and fully manageable by admin.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories` | Get all categories | ❌ |
| `GET` | `/categories/:id` | Get single category | ❌ |
| `POST` | `/categories` | Create a category | ✅ Admin |
| `PUT` | `/categories/:id` | Update a category | ✅ Admin |
| `DELETE` | `/categories/:id` | Delete category (blocked if items exist) | ✅ Admin |
| `PATCH` | `/categories/:id/reorder` | Update sort order | ✅ Admin |

**Request Body — `POST /categories`** *(multipart/form-data)*
```
name       string   required
image      file     optional  → Cloudinary
sortOrder  number   optional  (default: 0, controls tab order on menu page)
```

**Response — `GET /categories`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64cat...",
      "name": "Biryani",
      "slug": "biryani",
      "image": { "url": "https://res.cloudinary.com/...", "public_id": "..." },
      "sortOrder": 1,
      "itemCount": 6
    }
  ]
}
```

> `itemCount` is a virtual field — computed via aggregation on `MenuItem`.  
> `DELETE` returns `400` if any `MenuItem` references that category. Admin must reassign or delete those items first.

---

### 🍛 Menu Routes — `/api/menu`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/menu` | Get all items (filters/pagination) | ❌ |
| `GET` | `/menu/trending` | Get trending items | ❌ |
| `GET` | `/menu/:id` | Get single item (populated category) | ❌ |
| `POST` | `/menu` | Create menu item | ✅ Admin |
| `PUT` | `/menu/:id` | Update menu item | ✅ Admin |
| `DELETE` | `/menu/:id` | Delete menu item | ✅ Admin |
| `PATCH` | `/menu/:id/toggle` | Toggle availability | ✅ Admin |

**Query Params — `GET /menu`**
```
?categoryId=64cat...      ObjectId of category
?search=paneer
?available=true
?isVeg=true
?page=1&limit=12
?sort=price_asc | price_desc | rating
```

**Request Body — `POST /menu`** *(multipart/form-data)*
```
name          string    required
description   string    required
price         number    required
categoryId    ObjectId  required   → ref to Category._id
image         file      required   → Cloudinary
isVeg         boolean   required
isTrending    boolean   optional
```

**Response — `GET /menu/:id`** *(category is populated)*
```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "name": "Chicken Biryani",
    "price": 280,
    "category": {
      "_id": "64cat...",
      "name": "Biryani",
      "slug": "biryani"
    },
    "image": { "url": "https://...", "public_id": "..." },
    "isVeg": false,
    "isTrending": true,
    "rating": 4.7,
    "available": true
  }
}
```

---

### 🪑 Reservation Routes — `/api/reservations`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/reservations/tables` | All tables with live status | ❌ |
| `GET` | `/reservations/availability` | Check by date/time/guests | ❌ |
| `POST` | `/reservations` | Book a table | ❌ |
| `GET` | `/reservations/my` | Current user's bookings | ✅ User |
| `DELETE` | `/reservations/:id` | Cancel own booking | ✅ User |
| `GET` | `/reservations` | All reservations | ✅ Admin |
| `PATCH` | `/reservations/:id/status` | Update status | ✅ Admin |

**Request Body — `POST /reservations`**
```json
{
  "customerName": "Arun Kumar",
  "customerEmail": "arun@gmail.com",
  "customerPhone": "9876543210",
  "tableId": "64tbl...",
  "date": "2024-12-25",
  "time": "19:00",
  "guests": 4,
  "notes": "Window seat preferred"
}
```

**Response — `GET /reservations` (admin, populated)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64res...",
      "customerName": "Arun Kumar",
      "table": { "_id": "64tbl...", "tableNumber": 5, "capacity": 4 },
      "user": { "_id": "64usr...", "name": "Arun Kumar", "email": "arun@gmail.com" },
      "date": "2024-12-25",
      "time": "19:00",
      "guests": 4,
      "status": "confirmed"
    }
  ]
}
```

> `user` field is `null` for guest bookings (no Google login).

---

### 🏓 Table Routes — `/api/tables`

> Tables are also fully manageable — admin can add/remove/reposition tables to match real layout changes.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tables` | All tables | ❌ |
| `POST` | `/tables` | Add a table | ✅ Admin |
| `PUT` | `/tables/:id` | Update table details / position | ✅ Admin |
| `DELETE` | `/tables/:id` | Remove a table | ✅ Admin |
| `PATCH` | `/tables/:id/status` | Set availability manually | ✅ Admin |

**Request Body — `POST /tables`**
```json
{
  "tableNumber": 12,
  "capacity": 4,
  "shape": "square",
  "position": { "x": 2, "y": 3 },
  "floor": "ground"
}
```

---

### 📊 Admin Routes — `/api/admin`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/dashboard` | Full analytics summary | ✅ Admin |
| `GET` | `/admin/dashboard/earnings` | Earnings chart (weekly/monthly) | ✅ Admin |
| `GET` | `/admin/dashboard/top-items` | Top selling items | ✅ Admin |
| `GET` | `/admin/dashboard/bookings-summary` | Booking counts by status | ✅ Admin |
| `GET` | `/admin/users` | All registered users | ✅ Admin |

---

## 🔒 Auth Middleware Flow

```
Request
   │
   ▼
authMiddleware.ts  →  Verify JWT (Authorization: Bearer <token>)
   ├── Invalid / Missing  →  401
   ▼
req.user = { id, email, role }
   │
   ▼
adminMiddleware.ts (admin routes only)  →  role === 'admin'?
   ├── No  →  403
   ▼
Controller
```

> On first Google login, if `email === process.env.ADMIN_EMAIL` → `role: "admin"` is set automatically.

---

## 📦 TypeScript — Key Types

### `src/types/api.types.ts`
```ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pages: number;
}
```

### `src/types/category.types.ts`
```ts
export interface CloudinaryImage {
  url: string;
  public_id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: CloudinaryImage;
  sortOrder: number;
  itemCount?: number;   // virtual, from aggregation
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  image?: File;
  sortOrder?: number;
}
```

### `src/types/menu.types.ts`
```ts
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | Category;   // string (id) or populated Category
  image: CloudinaryImage;
  isVeg: boolean;
  isTrending: boolean;
  rating: number;
  available: boolean;
  createdAt: string;
}

export interface MenuFilters {
  categoryId?: string;
  search?: string;
  available?: boolean;
  isVeg?: boolean;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating";
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: File;
  isVeg: boolean;
  isTrending?: boolean;
}
```

### `src/types/reservation.types.ts`
```ts
export type TableShape    = "round" | "square";
export type TableStatus   = "available" | "booked" | "unavailable";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  position: { x: number; y: number };
  shape: TableShape;
  floor: string;
  status: TableStatus;
}

export interface Reservation {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string | Table;
  userId?: string | User;        // null for guest bookings
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateReservationDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}
```

### `src/types/user.types.ts`
```ts
export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: UserRole;
  createdAt: string;
}
```

### `server/src/types/express.d.ts`
```ts
import { UserRole } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
```

---

## 📦 Standard Response Format

**Success**
```json
{ "success": true, "message": "...", "data": { } }
```

**Error**
```json
{ "success": false, "message": "...", "error": "stack (dev only)" }
```

---

## 🌐 Environment Variables

### `client/.env`
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your_key
```

### `server/.env`
```env
PORT=8000
NODE_ENV=development

MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/restaurant

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your_admin@gmail.com
```

---

## ⚡ Next Step: Schema Design

Five Mongoose schemas to define:

| Schema | Relations |
|--------|-----------|
| `User` | standalone |
| `Category` | standalone |
| `MenuItem` | `categoryId` → `Category._id` |
| `Table` | standalone |
| `Reservation` | `tableId` → `Table._id`, `userId` → `User._id` (optional) |