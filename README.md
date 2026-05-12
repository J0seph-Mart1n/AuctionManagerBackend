# Auction Manager Backend

This is the backend service for the Auction Manager application. It is built with Node.js, Express, Prisma ORM, and PostgreSQL.

## Prerequisites

- Node.js
- PostgreSQL database
- npm

## Setup Instructions

1. **Install Dependencies**
   Navigate to the backend directory and install the required packages:
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   DATABASE_URL="postgresql://postgres:123456@127.0.0.1:5432/AuctionManager?schema=public"
   PORT=3000
   ```
   Replace the database credentials with your actual PostgreSQL connection details.

3. **Database Setup**
   The project uses Prisma as an ORM. To sync the schema with your database, run:
   ```bash
   npx prisma db push
   ```
   *(Alternatively, use `npx prisma migrate dev` if you are tracking migrations).*

4. **Start the Server**
   To start the backend in development mode with auto-reloading:
   ```bash
   npm run dev
   ```
   To start the backend normally:
   ```bash
   npm start
   ```

   The server will run on the configured `PORT` (default is `http://localhost:3000`).

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running.

### Items
- `GET /api/items` - Retrieve all auction items.
- `POST /api/items` - Create a new item.
  - Body: `{ itemNumber, title, description, amount, shop }`
- `PUT /api/items/:id` - Update an existing item by ID.
- `DELETE /api/items/:id` - Delete an item by ID.

### Sales
- `GET /api/sales` - Retrieve all recorded sales.
- `POST /api/sales` - Record a new sale.
  - Body: `{ itemId, itemName, bidderName, wardName, paymentMethod, paymentDone, amount }`
- `PUT /api/sales/:id` - Update an existing sale by ID.
- `DELETE /api/sales/:id` - Delete a sale by ID.

## Technologies Used
- Node.js & Express
- Prisma ORM
- PostgreSQL
- dotenv
- cors
