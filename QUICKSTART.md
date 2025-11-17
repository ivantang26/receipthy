# Receipthy - Quick Start Guide

Get Receipthy up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed

## Step 1: Install Dependencies

```bash
npm install
```

This installs all dependencies for both frontend and backend.

## Step 2: Set Up Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
cd ..
```

This creates the SQLite database, runs migrations, and seeds it with sample data.

## Step 3: Start the Application

From the root directory:

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 3000) servers.

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

## What You'll See

### Dashboard
- 200 sample transactions spanning several months
- KPI cards showing revenue, transaction count, and refunds
- Interactive charts showing revenue trends
- Searchable transaction table with export to CSV

### Invoices
- 15 sample invoices with different statuses
- Create, edit, and delete functionality
- Print-ready invoice detail pages
- Duplicate invoice feature

### Receipts
- 30 sample receipts from various sources
- Manual receipt creation
- Link receipts to invoices
- Filter by date range and source

## Sample Data Overview

The seed script creates:
- **200 Transactions**: Various payment methods (Cash, Card, E-Wallet), mostly completed, some refunded
- **15 Invoices**: Mix of Draft, Sent, Paid, and Overdue statuses
- **30 Receipts**: From POS, Manual entry, and Imported sources

## Common Commands

```bash
# Start development servers
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build

# Open Prisma Studio (database GUI)
npm run db:studio

# Re-seed database
cd backend && npm run db:seed
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 3001 are occupied:

**Backend**: Edit `backend/.env` and change `PORT=3001` to another port.

**Frontend**: Edit `frontend/vite.config.ts` and change the `server.port` value.

### Database Errors

Delete and recreate the database:

```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npm run db:seed
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm install
```

## Next Steps

1. **Explore the Dashboard**: Check out the different date ranges and grouping options
2. **Create an Invoice**: Try creating a new invoice with multiple line items
3. **Link a Receipt**: Create a receipt and link it to an invoice
4. **Export Data**: Use the CSV export feature on the dashboard

## Development Tips

- **Prisma Studio**: Run `npm run db:studio` to visually explore and edit data
- **Hot Reload**: Both frontend and backend support hot reload during development
- **TypeScript**: Full type safety across the stack

## Production Deployment

See the main README.md for production deployment considerations including:
- Switching to PostgreSQL
- Adding authentication
- Security hardening
- Monitoring and logging

---

**Need Help?** Check the full README.md for detailed documentation.

