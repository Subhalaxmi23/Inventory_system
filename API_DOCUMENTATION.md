# IMS Backend API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Environment Setup](#environment-setup)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Examples](#requestresponse-examples)
6. [Backend Flow](#backend-flow)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)

---

## Overview

This document describes the complete API endpoints and request flow for the Inventory Management System (IMS) backend. All endpoints are prefixed with `/api`.

**Base URL**: `https://inventory-system-apipoint.onrender.com` (Production)  
**Local URL**: `http://localhost:4001` (Development)

---

## Authentication

### JWT Token-Based Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **admin**: Full access to all endpoints
- **customer**: Limited access (can place orders, view own orders)

### Getting a Token

1. Register a new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Use the returned token in subsequent requests

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/ims
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ims

JWT_SECRET=your-super-secret-jwt-key-here
PORT=4001
```

### Installation & Running

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start
```

---

## API Endpoints

### 🔐 Authentication Endpoints

#### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // Optional: "admin" or "customer"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 📦 Product Endpoints

#### Create Product (Admin Only)
```
POST /api/products
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 50000,
  "stockId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 50000,
    "stockId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Products
```
GET /api/products
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 50000,
    "stockId": {
      "_id": "507f1f77bcf86cd799439011",
      "productName": "Laptop",
      "category": "Electronics",
      "quantity": 50,
      "supplierId": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Tech Supplier",
        "company": "Tech Corp"
      }
    }
  }
]
```

#### Update Product (Admin Only)
```
PUT /api/products/:id
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Laptop",
  "price": 55000
}
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:id
Headers: Authorization: Bearer <token>
```

---

### 🏢 Supplier Endpoints

#### Create Supplier (Admin Only)
```
POST /api/suppliers
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Supplier",
  "company": "Supplier Corp",
  "email": "supplier@example.com",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Response (201):**
```json
{
  "message": "Supplier created successfully",
  "supplier": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "John Supplier",
    "company": "Supplier Corp",
    "email": "supplier@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
}
```

#### Get All Suppliers (Admin Only)
```
GET /api/suppliers
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "John Supplier",
    "company": "Supplier Corp",
    "email": "supplier@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }
]
```

#### Update Supplier (Admin Only)
```
PUT /api/suppliers/:id
Headers: Authorization: Bearer <token>
```

#### Delete Supplier (Admin Only)
```
DELETE /api/suppliers/:id
Headers: Authorization: Bearer <token>
```

---

### 📊 Stock Endpoints

#### Create Stock (Admin Only)
```
POST /api/stocks
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productName": "Laptop",
  "category": "Electronics",
  "quantity": 50,
  "supplierId": "507f1f77bcf86cd799439013"
}
```

**Response (201):**
```json
{
  "message": "Stock added successfully",
  "stock": {
    "_id": "507f1f77bcf86cd799439011",
    "productName": "Laptop",
    "category": "Electronics",
    "quantity": 50,
    "supplierId": "507f1f77bcf86cd799439013",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Stock
```
GET /api/stocks
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "productName": "Laptop",
    "category": "Electronics",
    "quantity": 50,
    "supplierId": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Supplier",
      "company": "Supplier Corp",
      "email": "supplier@example.com",
      "phone": "+1234567890"
    }
  }
]
```

#### Update Stock (Admin Only)
```
PUT /api/stocks/:id
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 75
}
```

#### Delete Stock (Admin Only)
```
DELETE /api/stocks/:id
Headers: Authorization: Bearer <token>
```

---

### 🛒 Order Endpoints

#### Create Order (Customer)
```
POST /api/orders
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Order placed successfully ✅",
  "newOrder": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439010",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "stockId": "507f1f77bcf86cd799439011",
        "productName": "Laptop",
        "quantity": 2,
        "price": 50000
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Flow:**
1. Validates items array
2. Checks product existence
3. Verifies stock availability
4. Calculates total amount
5. Deducts stock quantities
6. Creates order

#### Get All Orders (Admin Only)
```
GET /api/orders
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "userId": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "productName": "Laptop",
        "quantity": 2,
        "price": 50000
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Note:** Orders are sorted by newest first (`createdAt: -1`)

#### Get My Orders (Customer)
```
GET /api/orders/my-orders
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "items": [
      {
        "productName": "Laptop",
        "quantity": 2,
        "price": 50000
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:id/status
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Valid Status Values:**
- `pending` (default)
- `shipped`
- `delivered`

**Response (200):**
```json
{
  "message": "Order status updated ✅",
  "order": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "shipped",
    ...
  }
}
```

#### Delete Order (Admin Only)
```
DELETE /api/orders/:id
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Order deleted successfully ✅"
}
```

**Important:** When an order is deleted, stock quantities are automatically restored.

---

## Backend Flow

### Request Lifecycle

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │ (with JWT token)
       ▼
┌─────────────────────────────────────┐
│         Express App (app.js)         │
│  ┌───────────────────────────────┐  │
│  │  Middleware Stack:            │  │
│  │  1. CORS                      │  │
│  │  2. express.json()            │  │
│  │  3. protect (JWT verify)     │  │
│  │  4. authorizeRoles (if admin) │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       │ Route Match
       ▼
┌─────────────────────────────────────┐
│      Route Handler                  │
│  (routes/*Routes.js)                │
└──────┬──────────────────────────────┘
       │
       │ Controller Call
       ▼
┌─────────────────────────────────────┐
│      Controller                     │
│  (controllers/*Controller.js)       │
│  ┌───────────────────────────────┐  │
│  │  Business Logic:              │  │
│  │  - Validate data               │  │
│  │  - Database operations         │  │
│  │  - Calculate totals            │  │
│  │  - Error handling              │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       │ Mongoose Query
       ▼
┌─────────────────────────────────────┐
│         MongoDB Database           │
│  ┌───────────────────────────────┐  │
│  │  Collections:                  │  │
│  │  - users                       │  │
│  │  - products                    │  │
│  │  - suppliers                   │  │
│  │  - stocks                      │  │
│  │  - orders                      │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       │ Response
       ▼
┌─────────────┐
│   Client    │
│  (Frontend) │
└─────────────┘
```

### Authentication Flow

```
1. User Registration/Login
   POST /api/auth/register or /api/auth/login
   │
   ├─► Controller validates credentials
   │
   ├─► generateToken() creates JWT
   │
   └─► Returns token + user data
   
2. Protected Request
   GET /api/products
   Headers: Authorization: Bearer <token>
   │
   ├─► protect middleware extracts token
   │
   ├─► Verifies JWT signature
   │
   ├─► Attaches user to req.user
   │
   └─► Controller processes request
```

### Order Creation Flow

```
1. Customer Places Order
   POST /api/orders
   Body: { items: [{ productId, quantity }] }
   │
   ├─► Validate items array
   │
   ├─► For each item:
   │   ├─► Find product by ID
   │   ├─► Check stock availability
   │   ├─► Calculate item total
   │   └─► Prepare order item
   │
   ├─► Calculate totalAmount
   │
   ├─► Deduct stock quantities
   │   └─► Stock.findByIdAndUpdate(quantity: -item.quantity)
   │
   ├─► Create order in database
   │
   └─► Return order with success message
```

### Order Deletion Flow

```
1. Admin Deletes Order
   DELETE /api/orders/:id
   │
   ├─► Find order by ID
   │
   ├─► For each item in order:
   │   └─► Restore stock quantity
   │       └─► Stock.findByIdAndUpdate(quantity: +item.quantity)
   │
   ├─► Delete order from database
   │
   └─► Return success message
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions (not admin)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "message": "Error description here"
}
```

### Example Error Responses

**401 Unauthorized:**
```json
{
  "message": "Not authorized, token failed"
}
```

**403 Forbidden:**
```json
{
  "message": "Not authorized as an admin"
}
```

**404 Not Found:**
```json
{
  "message": "Product not found"
}
```

**400 Bad Request (Order Creation):**
```json
{
  "message": "Not enough stock for Laptop"
}
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["admin", "customer"], default: "customer"),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  stockId: ObjectId (ref: "Stock", required),
  createdAt: Date,
  updatedAt: Date
}
```

### Supplier Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  company: String (required),
  email: String,
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Stock Model
```javascript
{
  _id: ObjectId,
  productName: String (required),
  category: String (required),
  quantity: Number (required, min: 0),
  supplierId: ObjectId (ref: "Supplier", required),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: "User", required),
  items: [{
    productId: ObjectId (ref: "Product", required),
    stockId: ObjectId (ref: "Stock", required),
    productName: String (required),
    quantity: Number (required, min: 1),
    price: Number (required)
  }],
  totalAmount: Number (required),
  status: String (enum: ["pending", "shipped", "delivered"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Quick Reference

### Endpoint Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | - | Register new user |
| POST | `/api/auth/login` | ❌ | - | Login user |
| POST | `/api/products` | ✅ | Admin | Create product |
| GET | `/api/products` | ✅ | All | Get all products |
| PUT | `/api/products/:id` | ✅ | Admin | Update product |
| DELETE | `/api/products/:id` | ✅ | Admin | Delete product |
| POST | `/api/suppliers` | ✅ | Admin | Create supplier |
| GET | `/api/suppliers` | ✅ | Admin | Get all suppliers |
| PUT | `/api/suppliers/:id` | ✅ | Admin | Update supplier |
| DELETE | `/api/suppliers/:id` | ✅ | Admin | Delete supplier |
| POST | `/api/stocks` | ✅ | Admin | Create stock |
| GET | `/api/stocks` | ✅ | All | Get all stock |
| PUT | `/api/stocks/:id` | ✅ | Admin | Update stock |
| DELETE | `/api/stocks/:id` | ✅ | Admin | Delete stock |
| POST | `/api/orders` | ✅ | Customer | Create order |
| GET | `/api/orders` | ✅ | Admin | Get all orders |
| GET | `/api/orders/my-orders` | ✅ | Customer | Get my orders |
| PUT | `/api/orders/:id/status` | ✅ | Admin | Update order status |
| DELETE | `/api/orders/:id` | ✅ | Admin | Delete order |

---

## Notes

- **CORS**: Currently configured to allow all origins (`origin: *`). Adjust for production.
- **Token Expiration**: JWT tokens don't expire by default. Consider adding expiration for production.
- **Stock Management**: Stock quantities are automatically updated when orders are created/deleted.
- **Order Status**: Orders default to "pending" and can be updated to "shipped" or "delivered".
- **Data Population**: Many endpoints use Mongoose `.populate()` to include related data (e.g., supplier info in stock, user info in orders).

---

## Support

For issues or questions, check the codebase:
- Routes: `src/routes/*.js`
- Controllers: `src/controllers/*.js`
- Models: `src/models/*.js`
- Middleware: `src/middlewares/authMiddleware.js`
