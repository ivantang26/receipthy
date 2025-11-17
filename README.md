# Receipthy

**Receipthy** is a lightweight, production-ready POS analytics and document hub built with modern web technologies. It provides comprehensive transaction analytics, invoice management, and receipt tracking in a clean, intuitive interface.

## Features

### 📊 POS Analytics Dashboard
- **Real-time KPIs**: Total revenue, transaction count, average order value, and refund tracking
- **Flexible Date Ranges**: Today, This Week, This Month, This Year, or Custom ranges
- **Dynamic Grouping**: View data by daily, monthly, or yearly periods
- **Interactive Charts**: Revenue over time (line chart) and revenue by payment method (pie chart)
- **Transaction Table**: Paginated, searchable table with export to CSV functionality

### 🧾 Invoice Manager
- **Full CRUD Operations**: Create, read, update, and delete invoices
- **Smart Status Management**: Track invoices as Draft, Sent, Paid, Overdue, or Cancelled
- **Dynamic Line Items**: Add multiple items with automatic total calculation
- **Professional Invoice View**: Print-ready invoice detail page with clean layout
- **Duplicate Invoices**: Quickly create copies of existing invoices
- **Advanced Filtering**: Search by invoice number, customer name, or status

### 📄 Receipt Manager
- **Manual Receipt Creation**: Add receipts from external sources
- **Source Tracking**: Categorize receipts as POS, Manual, or Imported
- **Invoice Linking**: Connect receipts to invoices for complete tracking
- **Date Range Filtering**: Find receipts within specific time periods
- **Payment Method Tracking**: Support for Cash, Card, E-Wallet, and Other methods

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Backend**: Node.js + Express
- **Database**: SQLite with Prisma ORM
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
receipthy/
├── backend/                    # Backend server
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data script
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   │   ├── dashboard.ts
│   │   │   ├── invoices.ts
│   │   │   ├── receipts.ts
│   │   │   └── transactions.ts
│   │   ├── services/          # Business logic layer
│   │   │   ├── dashboardService.ts
│   │   │   ├── invoiceService.ts
│   │   │   ├── receiptService.ts
│   │   │   └── transactionService.ts
│   │   └── index.ts           # Express server entry point
│   └── package.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   └── ReceiptForm.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── InvoiceDetail.tsx
│   │   │   ├── Receipts.tsx
│   │   │   └── Settings.tsx
│   │   ├── lib/               # Utilities
│   │   │   ├── api.ts         # API client functions
│   │   │   └── utils.ts       # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── package.json               # Root workspace config
```

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)

### Installation

1. **Clone or download the repository** (or ensure you're in the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install dependencies for both the frontend and backend workspaces.

3. **Set up the database**:
   ```bash
   # Generate Prisma Client
   cd backend
   npx prisma generate
   
   # Run migrations to create the database
   npx prisma migrate dev --name init
   
   # Seed the database with sample data
   npm run db:seed
   ```

### Running the Application

#### Development Mode

From the **root directory**, run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server at `http://localhost:3001`
- Frontend dev server at `http://localhost:3000`

#### Running Separately

**Backend only**:
```bash
npm run dev:backend
```

**Frontend only**:
```bash
npm run dev:frontend
```

### Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

3. **Serve the frontend** using any static file server, or configure your backend to serve the `frontend/dist` directory.

## Database Management

### Prisma Studio

Explore and edit your database visually:

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555`

### Migrations

Create a new migration after schema changes:

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Re-seeding

To clear and re-seed the database:

```bash
npm run db:seed
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&groupBy=daily|monthly|yearly`

### Transactions
- `GET /api/transactions` - List transactions (supports pagination, filtering)
- `GET /api/transactions/export` - Export transactions as CSV

### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/duplicate` - Duplicate invoice

### Receipts
- `GET /api/receipts` - List receipts
- `GET /api/receipts/:id` - Get receipt details
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
```

## Sample Data

The seed script (`backend/prisma/seed.ts`) generates:
- **200 transactions** spanning several months with varied payment methods
- **15 invoices** with different statuses and multiple line items
- **30 receipts** from various sources, some linked to invoices

## Key Features Explained

### Dashboard Analytics
- **Date Range Presets**: Quick selection for common periods
- **Custom Date Range**: Flexible analysis for any time period
- **Grouping Options**: Switch between daily, monthly, or yearly views
- **Payment Method Breakdown**: Visual representation of revenue by payment type
- **Export Functionality**: Download transaction data as CSV for external analysis

### Invoice Management
- **Auto-numbering**: Invoices are automatically assigned sequential numbers (INV-0001, INV-0002, etc.)
- **Tax Calculation**: Configurable tax rate with automatic total calculation
- **Status Tracking**: Automatic overdue detection based on due date
- **Print/PDF Ready**: Invoice detail page is optimized for printing or PDF generation
- **Line Items**: Dynamic form for adding multiple products/services with quantity and pricing

### Receipt Management
- **Source Differentiation**: Track whether receipts came from POS, manual entry, or imports
- **Invoice Linking**: Associate receipts with invoices for payment reconciliation
- **Payment Method Tracking**: Record how payment was received
- **Search and Filter**: Find receipts by number, amount, date range, or source

## Production Hardening Checklist

This is a solid foundation, but for production deployment, consider:

### Security
- [ ] Add authentication (JWT, OAuth, or session-based)
- [ ] Implement authorization/permissions for multi-user access
- [ ] Add rate limiting to API endpoints
- [ ] Validate and sanitize all user inputs
- [ ] Use environment variables for sensitive configuration
- [ ] Enable CORS only for trusted origins

### Features
- [ ] Multi-tenant support (separate data per organization)
- [ ] Email notifications for invoices and overdue reminders
- [ ] PDF generation for invoices (using libraries like puppeteer or pdfkit)
- [ ] Bulk operations (delete, export, status updates)
- [ ] Advanced search with full-text capabilities
- [ ] Receipt image uploads and OCR
- [ ] Reporting and analytics export (Excel, PDF)
- [ ] Audit logs for all data changes

### Infrastructure
- [ ] Use PostgreSQL or MySQL for production instead of SQLite
- [ ] Set up proper logging (Winston, Pino)
- [ ] Add monitoring and error tracking (Sentry, LogRocket)
- [ ] Implement database backups
- [ ] Add health check endpoints
- [ ] Configure proper HTTPS/SSL
- [ ] Set up CI/CD pipeline
- [ ] Container deployment (Docker)

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Load testing

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

**Frontend** (edit `frontend/vite.config.ts`):
```typescript
server: {
  port: 3002, // Change to available port
}
```

**Backend** (edit `backend/.env`):
```env
PORT=3003
```

### Database Issues

If you encounter database errors:

1. Delete the database file:
   ```bash
   rm backend/prisma/dev.db
   ```

2. Re-run migrations and seed:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run db:seed
   ```

### Module Not Found Errors

Ensure all dependencies are installed:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Contributing

This is a foundation project. Feel free to extend it with:
- Additional payment gateways integration
- Inventory management
- Customer relationship management
- Advanced reporting
- Mobile app (React Native)

## License

This project is provided as-is for development and learning purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints and data models in the code
3. Inspect browser console and backend logs for errors

---

**Built with ❤️ using React, TypeScript, Express, and Prisma**

#   r e c e i p t h y  
 