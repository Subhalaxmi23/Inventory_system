## IMS Backend API Documentation and Flow

### Overview
This document describes the public API endpoints and the backend request flow for the IMS backend located in `src/`. Base URL prefix for all endpoints is `/api`.

### Authentication
- Auth uses JWT in the `Authorization` header with the Bearer scheme.
- Obtain token via `POST /api/auth/login`.
- Include header for protected routes: `Authorization: Bearer <token>`.
- Roles: currently `admin` and regular user. Role checks are enforced via middleware.

### Environment
- `JWT_SECRET`: secret used to sign JWTs
- `MONGO_URI`: MongoDB connection string
- `PORT`: server port (defaults in `src/server.js` if set)

### Common Response Structure
- Success: status 2xx with resource JSON
- Auth errors: 401/403 with `{ message: string }`
- Validation/not found: 400/404 with `{ message: string }`

---

## Endpoints

### Auth
- POST `/api/auth/register`
  - Body: `{ name, email, password, role? }`
  - Returns: created user (sans password) and/or token depending on controller implementation

- POST `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Products
- POST `/api/products` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: product fields (e.g., name, price, etc.)
  - Creates a product

- GET `/api/products` (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Lists products

- PUT `/api/products/:id` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: updated fields
  - Updates a product

- DELETE `/api/products/:id` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Deletes a product

### Suppliers (admin only unless specified)
- POST `/api/suppliers`
  - Headers: `Authorization: Bearer <token>`
  - Body: supplier fields

- GET `/api/suppliers`
  - Headers: `Authorization: Bearer <token>`
  - Lists suppliers

- PUT `/api/suppliers/:id`
  - Headers: `Authorization: Bearer <token>`
  - Body: updated fields

- DELETE `/api/suppliers/:id`
  - Headers: `Authorization: Bearer <token>`

### Stock
- POST `/api/stocks` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: stock fields (e.g., productId, quantity, etc.)

- GET `/api/stocks` (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Lists stock entries

- PUT `/api/stocks/:id` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: updated fields

- DELETE `/api/stocks/:id` (admin only)
  - Headers: `Authorization: Bearer <token>`

### Orders
- POST `/api/orders` (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Body: order fields (e.g., items, totals, etc.)
  - Places an order (customer)

- GET `/api/orders` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Lists all orders (admin)

- GET `/api/orders/my-orders` (authenticated)
  - Headers: `Authorization: Bearer <token>`
  - Lists orders for the current user

- PUT `/api/orders/:id/status` (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ status }`
  - Updates order status

---

## Backend Flow

### High-level Request Lifecycle
1. Client calls an endpoint under `/api/...`.
2. Express middleware stack runs:
   - `cors` and `express.json()` parse/permit request
   - `protect` (if applied) reads `Authorization` header, verifies JWT via `JWT_SECRET`, attaches `req.user`
   - `authorizeRoles("admin")` (if applied) checks `req.user.role`
3. Route handler delegates to a controller in `src/controllers/*Controller.js`.
4. Controllers use Mongoose models in `src/models/*.js` to query/update MongoDB.
5. Response JSON is sent back. Errors are returned with appropriate HTTP codes.

### Relevant Modules
- `src/app.js`: wires up middleware and mounts route modules at `/api/*`.
- `src/middlewares/authMiddleware.js`: `protect` and `authorizeRoles` for auth/role checks.
- `src/utils/generateToken.js`: issues JWTs on login/registration.
- `src/config/db.js`: connects to MongoDB using `MONGO_URI`.
- `src/controllers/*`: request handlers per domain (auth, products, suppliers, stock, orders).
- `src/models/*`: Mongoose schemas for `User`, `Product`, `Supplier`, `Stock`, `Order`.

### Example Auth Flow
1. `POST /api/auth/login` with `{ email, password }`.
2. Controller validates user, generates JWT using `generateToken`.
3. Client stores token and sends `Authorization: Bearer <token>` on subsequent requests.
4. Protected routes validate token in `protect`, attach `req.user`, and proceed.

---

## Quick Start
1. Set environment variables (`.env`):
   - `MONGO_URI=<your-mongodb-uri>`
   - `JWT_SECRET=<secure-random-string>`
   - `PORT=5000`
2. Install and run:
   - `npm install`
   - `npm start` or `node src/server.js`

## Notes
- CORS is configured as open (`origin: *`). Adjust for production.
- All protected routes require the Bearer token. Admin-only routes also require `user.role === "admin"`.


