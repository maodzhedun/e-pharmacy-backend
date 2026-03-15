# E-Pharmacy Backend API

Backend API for E-Pharmacy Admin Dashboard built with Node.js, Express and MongoDB.

## Features

- 🔐 Session-based Authentication (Access & Refresh Tokens in httpOnly Cookies)
- ✅ Request Validation (Celebrate/Joi — Body, Params, Query)
- 📊 Dashboard with Aggregated Statistics
- 📦 Products CRUD with Category Filtering
- 🚚 Suppliers CRUD Management
- 👥 Customers & Orders with Pagination
- 🔄 Centralized Error Handling (http-errors)
- 📝 Structured Logging (pino-http)
- 🏗️ Functional Architecture (ES Modules)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose
- **Authentication:** Session-based (crypto tokens + httpOnly cookies)
- **Password Hashing:** bcrypt
- **Validation:** Celebrate (Joi wrapper) — Body, Params, Query segments
- **Error Handling:** http-errors
- **Logging:** pino-http (structured, pretty)
- **Module System:** ES Modules (`"type": "module"`)
- **Code Quality:** ESLint + Prettier
- **Architecture:** Functional Programming

## Project Structure

```
e-pharmacy-backend/
├── src/
│   ├── server.js
│   ├── config/
│   │   └── connectMongoDB.js
│   ├── constants/
│   │   ├── pharmacy.js
│   │   └── time.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── ordersController.js
│   │   ├── productsController.js
│   │   ├── suppliersController.js
│   │   └── customersController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── notFoundHandler.js
│   ├── models/
│   │   ├── user.js
│   │   ├── session.js
│   │   ├── product.js
│   │   ├── order.js
│   │   ├── supplier.js
│   │   ├── customer.js
│   │   └── incomeExpense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── ordersRoutes.js
│   │   ├── productsRoutes.js
│   │   ├── suppliersRoutes.js
│   │   └── customersRoutes.js
│   ├── seed/
│   │   └── seedDB.js
│   ├── services/
│   │   └── auth.js
│   └── validations/
│       ├── authValidation.js
│       ├── productValidation.js
│       ├── supplierValidation.js
│       └── queryValidation.js
├── data/
│   ├── products.json
│   ├── customers.json
│   ├── orders.json
│   ├── suppliers.json
│   └── Income-Expenses.json
├── .editorconfig
├── .prettierrc
├── eslint.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas cloud instance)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/maodzhedun/e-pharmacy-backend.git
cd e-pharmacy-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/e-pharmacy
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

5. Seed the database with initial data:

```bash
npm run seed
```

### Running the Application

Development mode with auto-restart:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/user/login` — Login (returns token + sets httpOnly cookies)
- `POST /api/user/logout` — Logout (clears session & cookies)
- `POST /api/user/refresh` — Refresh session (new access token)
- `GET /api/user/user-info` — Get current user info 🔒

### Dashboard (Protected 🔒)

- `GET /api/dashboard` — Aggregated statistics, recent customers, income/expenses

### Orders (Protected 🔒)

- `GET /api/orders` — List orders with filtering & pagination

### Products (Protected 🔒)

- `GET /api/products` — List products with filtering & pagination
- `GET /api/products/:productId` — Get product by ID
- `POST /api/products` — Create new product
- `PUT /api/products/:productId` — Update product
- `DELETE /api/products/:productId` — Delete product

### Suppliers (Protected 🔒)

- `GET /api/suppliers` — List suppliers with filtering & pagination
- `POST /api/suppliers` — Create new supplier
- `PUT /api/suppliers/:supplierId` — Update supplier

### Customers (Protected 🔒)

- `GET /api/customers` — List customers with filtering & pagination
- `GET /api/customers/:customerId` — Get customer by ID

## Security Features

### Session-based Authentication

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens stored in httpOnly cookies (XSS protection)
- Also supports `Authorization: Bearer <token>` header
- Old sessions are automatically deleted on new login

### Password Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Minimum password length: 6 characters
- Passwords are hidden from all API responses via `toJSON()` method

### HTTP Security

- CORS configured with `credentials: true` for cookie support
- cookie-parser middleware for httpOnly cookie handling

## Validation Rules

All request validation is handled by Celebrate (Joi) with three segments:

### Body Validation (`Segments.BODY`)

- Login: email (valid format, required), password (min 6 chars, required)
- Products: name, suppliers, stock, price, category (enum), photo (optional)
- Suppliers: name, address, suppliers, date, amount, status (Active/Deactive)

### Params Validation (`Segments.PARAMS`)

- `:productId` — validated as MongoDB ObjectId
- `:supplierId` — validated as MongoDB ObjectId
- `:customerId` — validated as MongoDB ObjectId

### Query Validation (`Segments.QUERY`)

- `page` — integer, min 1, default 1
- `limit` — integer, min 1, max 50, default 5
- `name` — string, optional (case-insensitive regex search)
- `sortBy`, `sortOrder` — optional sorting parameters

## Error Handling

The API uses centralized error handling with consistent error responses:

```json
{
  "message": "Error description"
}
```

Handled error types:

- `HttpError` — http-errors instances (400, 401, 404, etc.)
- `CastError` — invalid MongoDB ObjectId format
- `ValidationError` — Mongoose schema validation failures
- `11000` — duplicate key errors (e.g., duplicate email)
- Celebrate errors — request validation failures (body/params/query)

Common HTTP status codes:

- `200` — Success
- `201` — Created
- `400` — Bad Request (validation errors)
- `401` — Unauthorized (missing/expired token)
- `404` — Not Found
- `409` — Conflict (duplicate resource)
- `500` — Internal Server Error

## Product Categories

```
Medicine, Head, Hand, Heart, Leg, Dental Care,
Skin Care, Eye Care, Vitamins & Supplements,
Orthopedic Products, Baby Care
```

## Order Statuses

```
Completed, Confirmed, Pending, Cancelled,
Processing, Shipped, Delivered
```

## Test Account

After running `npm run seed`:

- **Email:** `vendor@gmail.com`
- **Password:** `admin123`

## Development Notes

### Architecture

This project follows a **functional programming approach** with ES Modules:

- **Controllers**: Async functions that handle requests and responses
- **Services**: Business logic layer (`services/auth.js` — session management)
- **Models**: Mongoose schemas with named exports and `toJSON()` overrides
- **Middleware**: Request processing (authenticate, logger, errorHandler)
- **Validations**: Celebrate schemas with Segments (Body, Params, Query)
- **Constants**: Centralized enums (`pharmacy.js`, `time.js`)
- **Error Handling**: `http-errors` + Express 5 native async error catching (no `ctrlWrapper` needed)

### Key Decisions

| Decision | Reasoning |
|----------|-----------|
| Express 5 | Native async error catching — no try/catch or ctrlWrapper needed |
| Session model vs JWT | Sessions can be revoked instantly; refresh token support |
| httpOnly cookies | XSS protection — JavaScript cannot access tokens |
| Celebrate | Validates body, params, AND query in a single schema |
| pino-http | Structured logging with colored output and response times |
| `toJSON()` on User | Password never leaks into any API response |
| Constants folder | Single source of truth for categories, statuses, time intervals |

## Design Reference

[Figma — Admin Dashboard](https://www.figma.com/file/z1JklHHxX8kTGo3zWvlzat/Admin-dashboard)
