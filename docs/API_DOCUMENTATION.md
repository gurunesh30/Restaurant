# 🍽️ Restaurant API Documentation

This document outlines all the REST API endpoints available in the application, including their request (req) and response (res) formats.

## 🔗 Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

---

## 🔒 Authentication Routes (`/api/auth`)

### 1. Initiate Google Login
Initiates the Google OAuth 2.0 flow.
- **Route:** `GET /auth/google`
- **Access:** Public
- **Request:** N/A
- **Response:** Redirects to Google consent screen.

### 2. Google OAuth Callback
Callback URL for Google OAuth flow.
- **Route:** `GET /auth/google/callback`
- **Access:** Public
- **Request:** Google OAuth params in URL
- **Response:** Redirects to `<FRONTEND_URL>/login-success?token=<jwt_token>`

### 3. Get Current User Profille
- **Route:** `GET /auth/me`
- **Access:** Private (User)
- **Request Headers:**
  ```json
  { "Authorization": "Bearer <token>" }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "64abc...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "picture": "https://...",
      "role": "user"
    }
  }
  ```

### 4. Logout
- **Route:** `GET /auth/logout`
- **Access:** Private (User)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

---

## 🏷️ Category Routes (`/api/categories`)

### 1. Get All Categories
- **Route:** `GET /categories`
- **Access:** Public
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64cat...",
        "name": "Biryani",
        "slug": "biryani",
        "image": { "url": "...", "public_id": "..." },
        "sortOrder": 1,
        "itemCount": 5
      }
    ]
  }
  ```

### 2. Get Single Category
- **Route:** `GET /categories/:id`
- **Access:** Public
- **Response:** 
  ```json
  {
    "success": true,
    "data": { /* Category Object + itemCount */ }
  }
  ```

### 3. Create Category
- **Route:** `POST /categories`
- **Access:** Private (Admin)
- **Request Format:** `multipart/form-data`
  - `name` (string) - Required
  - `sortOrder` (number) - Optional
  - `image` (file) - Optional
- **Response:**
  ```json
  {
    "success": true,
    "data": { /* New Category Object */ }
  }
  ```

### 4. Update Category
- **Route:** `PUT /categories/:id`
- **Access:** Private (Admin)
- **Request Format:** `multipart/form-data`
  - `name` (string) - Optional
  - `sortOrder` (number) - Optional
  - `image` (file) - Optional
- **Response:**
  ```json
  {
    "success": true,
    "data": { /* Updated Category Object */ }
  }
  ```

### 5. Delete Category
- **Route:** `DELETE /categories/:id`
- **Access:** Private (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Category deleted"
  }
  ```
  *(Returns 400 if category has associated menu items)*

### 6. Reorder Category
- **Route:** `PATCH /categories/:id/reorder`
- **Access:** Private (Admin)
- **Request Body (JSON):**
  ```json
  { "sortOrder": 2 }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": { /* Updated Category Object */ }
  }
  ```

---

## 🍛 Menu Routes (`/api/menu`)

### 1. Get Menu Items
- **Route:** `GET /menu`
- **Access:** Public
- **Query Params:** 
  - `categoryId`: String
  - `search`: String
  - `available`: Boolean
  - `isVeg`: Boolean
  - `page`: Number (Default: 1)
  - `limit`: Number (Default: 12)
  - `sort`: `price_asc` | `price_desc` | `rating`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "name": "Paneer Tikka",
        "description": "...",
        "price": 250,
        "category": { /* Populated Category */ },
        "image": { "url": "...", "public_id": "..." },
        "isVeg": true,
        "isTrending": true,
        "rating": 4.5,
        "available": true
      }
    ],
    "total": 50,
    "page": 1,
    "pages": 5
  }
  ```

### 2. Get Trending Items
- **Route:** `GET /menu/trending`
- **Access:** Public
- **Response:** Array of top 10 trending items.

### 3. Get Single Menu Item
- **Route:** `GET /menu/:id`
- **Access:** Public
- **Response:** Single populated menu item object.

### 4. Create Menu Item
- **Route:** `POST /menu`
- **Access:** Private (Admin)
- **Request Format:** `multipart/form-data`
  - `name` (string) - Required
  - `description` (string) - Required
  - `price` (number) - Required
  - `categoryId` (string) - Required
  - `isVeg` (boolean) - Required
  - `isTrending` (boolean) - Optional
  - `image` (file) - Required
- **Response:** Returns created item.

### 5. Update Menu Item
- **Route:** `PUT /menu/:id`
- **Access:** Private (Admin)
- **Request Format:** `multipart/form-data`
  - (All fields from POST are optional)
  - `available` (boolean)
- **Response:** Returns updated item.

### 6. Delete Menu Item
- **Route:** `DELETE /menu/:id`
- **Access:** Private (Admin)
- **Response:** `{ "success": true, "message": "Menu item deleted" }`

### 7. Toggle Availability
- **Route:** `PATCH /menu/:id/toggle`
- **Access:** Private (Admin)
- **Response:** Returns updated item.

---

## 🏓 Table Routes (`/api/tables`)

### 1. Get All Tables
- **Route:** `GET /tables`
- **Access:** Public
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "tableNumber": 1,
        "capacity": 4,
        "shape": "square",
        "position": { "x": 1, "y": 2 },
        "floor": "ground",
        "status": "available"
      }
    ]
  }
  ```

### 2. Add Table
- **Route:** `POST /tables`
- **Access:** Private (Admin)
- **Request Body (JSON):**
  ```json
  {
    "tableNumber": 1,
    "capacity": 4,
    "shape": "square",
    "position": { "x": 1, "y": 2 },
    "floor": "ground"
  }
  ```
- **Response:** Returns created table.

### 3. Update Table
- **Route:** `PUT /tables/:id`
- **Access:** Private (Admin)
- **Request Body (JSON):** (Fields from POST are optional) + `status`
- **Response:** Returns updated table.

### 4. Delete Table
- **Route:** `DELETE /tables/:id`
- **Access:** Private (Admin)
- **Response:** `{ "success": true, "message": "Table deleted" }`

### 5. Update Table Status
- **Route:** `PATCH /tables/:id/status`
- **Access:** Private (Admin)
- **Request Body (JSON):**
  ```json
  { "status": "available" | "booked" | "unavailable" }
  ```
- **Response:** Returns updated table.

---

## 🪑 Reservation Routes (`/api/reservations`)

### 1. Get Tables with Live Status
- **Route:** `GET /reservations/tables`
- **Access:** Public
- **Query Params:** `date` (YYYY-MM-DD), `time` (HH:MM)
- **Response:** Returns all tables with dynamically computed `status` based on parameter slot.

### 2. Check Availability
- **Route:** `GET /reservations/availability`
- **Access:** Public
- **Query Params:** `date`, `time`, `guests`
- **Response:** Returns available tables that fit the guest capacity.

### 3. Create Reservation
- **Route:** `POST /reservations`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "1234567890",
    "tableId": "64tbl...",
    "date": "2024-03-10",
    "time": "19:00",
    "guests": 2,
    "notes": "Anniversary dinner"
  }
  ```
- **Response:** Returns created reservation (status: `pending`).

### 4. Get My Reservations
- **Route:** `GET /reservations/my`
- **Access:** Private (User)
- **Response:** Returns reservations belonging to the authenticated `req.user._id`.

### 5. Cancel My Reservation
- **Route:** `DELETE /reservations/:id`
- **Access:** Private (User)
- **Response:** `{ "success": true, "message": "Reservation cancelled" }`

### 6. Get All Reservations (Admin)
- **Route:** `GET /reservations`
- **Access:** Private (Admin)
- **Response:** Returns all reservations (populated `tableId` & `userId`).

### 7. Update Reservation Status
- **Route:** `PATCH /reservations/:id/status`
- **Access:** Private (Admin)
- **Request Body (JSON):**
  ```json
  { "status": "pending" | "confirmed" | "cancelled" | "completed" }
  ```
- **Response:** Returns updated reservation.

---

## 📊 Admin Routes (`/api/admin`)

*(All routes are Private (Admin))*

### 1. Dashboard Summary
- **Route:** `GET /admin/dashboard`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 120,
      "totalReservations": 45,
      "pendingReservations": 12,
      "totalMenuItems": 64,
      "totalCategories": 10
    }
  }
  ```

### 2. Dashboard Earnings (Mock Data)
- **Route:** `GET /admin/dashboard/earnings`
- **Response:** Array of weekly objects containing total income.

### 3. Top Trending Items
- **Route:** `GET /admin/dashboard/top-items`
- **Response:** Array of top 5 trending items with limited fields.

### 4. Bookings Summary
- **Route:** `GET /admin/dashboard/bookings-summary`
- **Response:** Array of booking statuses and their relative counts.

### 5. All Users
- **Route:** `GET /admin/users`
- **Response:** Returns array of all registered users without schema metadata.
