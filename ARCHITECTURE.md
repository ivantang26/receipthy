# Receipthy Architecture

## Overview

Receipthy is a full-stack application built with a clear separation between frontend and backend, following modern web development best practices.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Port 3000)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Vite                            │  │
│  │  ├── Components (Layout, Forms)                       │  │
│  │  ├── Pages (Dashboard, Invoices, Receipts, Settings) │  │
│  │  ├── API Client (lib/api.ts)                          │  │
│  │  └── Utilities (lib/utils.ts)                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP (REST API)
┌─────────────────────────────────────────────────────────────┐
│                        Backend (Port 3001)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + TypeScript                       │  │
│  │  ├── Routes (API Endpoints)                           │  │
│  │  ├── Services (Business Logic)                        │  │
│  │  └── Prisma Client (ORM)                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      Database (SQLite)                       │
│  ├── Transactions (with TransactionItems)                   │
│  ├── Invoices (with InvoiceItems)                           │
│  └── Receipts                                                │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout with sidebar
│   ├── InvoiceForm.tsx  # Invoice create/edit form
│   └── ReceiptForm.tsx  # Receipt create/edit form
├── pages/               # Route-level page components
│   ├── Dashboard.tsx    # Analytics dashboard
│   ├── Invoices.tsx     # Invoice list/management
│   ├── InvoiceDetail.tsx # Single invoice view
│   ├── Receipts.tsx     # Receipt list/management
│   └── Settings.tsx     # Settings page
├── lib/                 # Utilities and helpers
│   ├── api.ts          # API client functions
│   └── utils.ts        # Formatting and helper functions
├── App.tsx             # Root component with routing
└── main.tsx            # Entry point
```

### State Management

- **Local State**: React useState for component-level state
- **No Global State**: Each page fetches its own data (can be extended with React Context or Redux if needed)

### Data Flow

1. User interacts with UI
2. Component calls API function from `lib/api.ts`
3. API function makes HTTP request to backend
4. Response data updates component state
5. UI re-renders with new data

## Backend Architecture

### Layer Structure

```
src/
├── routes/              # HTTP route handlers
│   ├── dashboard.ts     # Dashboard analytics endpoints
│   ├── invoices.ts      # Invoice CRUD endpoints
│   ├── receipts.ts      # Receipt CRUD endpoints
│   └── transactions.ts  # Transaction query endpoints
├── services/            # Business logic layer
│   ├── dashboardService.ts    # Analytics calculations
│   ├── invoiceService.ts      # Invoice business logic
│   ├── receiptService.ts      # Receipt business logic
│   └── transactionService.ts  # Transaction business logic
└── index.ts            # Express server setup
```

### Three-Layer Architecture

1. **Route Layer** (`routes/`)
   - Handles HTTP requests/responses
   - Validates query parameters
   - Calls service layer
   - Returns JSON responses

2. **Service Layer** (`services/`)
   - Contains business logic
   - Interacts with database via Prisma
   - Performs calculations and data transformations
   - Returns plain data objects

3. **Data Layer** (Prisma ORM)
   - Database access through Prisma Client
   - Type-safe queries
   - Automatic migrations

### Error Handling

- Route-level try-catch blocks
- Centralized error middleware
- Proper HTTP status codes

## Database Design

### Entity Relationships

```
Transaction ──┬─── TransactionItem (1:many)
              └─── Invoice (many:1, optional)

Invoice ──┬─── InvoiceItem (1:many)
          ├─── Receipt (1:many)
          └─── Transaction (1:many)

Receipt ─────── Invoice (many:1, optional)
```

### Key Design Decisions

1. **Transactions are separate from Invoices**: 
   - Transactions represent POS sales
   - Invoices are formal billing documents
   - They can be linked but serve different purposes

2. **Receipts are flexible**:
   - Can be POS-generated (linked to transaction)
   - Manually entered (external receipts)
   - Imported from other systems

3. **Soft relationships**:
   - Foreign keys are optional where appropriate
   - Allows for orphaned records when needed

## API Design

### RESTful Principles

- Resources identified by URLs (`/api/invoices/:id`)
- HTTP verbs for actions (GET, POST, PUT, DELETE)
- JSON for request/response bodies
- Proper status codes (200, 201, 400, 404, 500)

### Pagination

All list endpoints support pagination:
```
?page=1&limit=20
```

Returns:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Filtering

Query parameters for filtering:
- Date ranges: `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Search: `?search=query`
- Status/Category: `?status=PAID&source=MANUAL`

## Development Workflow

### Local Development

1. Backend runs on port 3001
2. Frontend runs on port 3000 with Vite dev server
3. Vite proxies `/api` requests to backend

### Production Build

1. Frontend builds to static files (`frontend/dist/`)
2. Backend compiles TypeScript (`backend/dist/`)
3. Deploy:
   - Serve static files from CDN or web server
   - Run backend on Node.js server

## Scalability Considerations

### Current Limitations (SQLite)

- Single file database
- Limited concurrent writes
- Not suitable for high-traffic production

### Migration Path

For production scale:

1. **Database**: Switch to PostgreSQL or MySQL
   - Change `datasource` in Prisma schema
   - Run migrations
   - No code changes needed (Prisma abstraction)

2. **Caching**: Add Redis for:
   - Dashboard analytics caching
   - Session storage
   - Rate limiting

3. **File Storage**: For receipt images/PDFs:
   - AWS S3 or similar
   - Add file upload endpoints

4. **Authentication**: 
   - JWT with refresh tokens
   - OAuth providers
   - Session management

5. **Multi-tenancy**:
   - Add `organizationId` to all models
   - Row-level security
   - Tenant isolation

## Security Layers

### Current State (Development)

- CORS enabled for all origins
- No authentication
- No input validation beyond basic checks

### Production Requirements

1. **Authentication**: JWT or session-based
2. **Authorization**: Role-based access control
3. **Input Validation**: Zod or Joi schemas
4. **SQL Injection**: Protected by Prisma (parameterized queries)
5. **XSS**: React's built-in protection
6. **CSRF**: CSRF tokens for state-changing operations
7. **Rate Limiting**: Prevent abuse
8. **HTTPS**: TLS encryption in transit

## Testing Strategy

### Recommended Approach

1. **Unit Tests**: Services layer
   - Mock Prisma Client
   - Test business logic

2. **Integration Tests**: API routes
   - Test database interactions
   - Use test database

3. **E2E Tests**: Critical flows
   - Playwright or Cypress
   - Test full user journeys

## Monitoring & Observability

### For Production

1. **Logging**: Structured logs (Winston, Pino)
2. **Error Tracking**: Sentry for frontend & backend
3. **Performance**: APM tools (New Relic, DataDog)
4. **Uptime**: Health check endpoints + monitoring service
5. **Analytics**: User behavior tracking (PostHog, Mixpanel)

## Deployment Options

### Simple Deployment

- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, Fly.io
- **Database**: SQLite on same server as backend

### Scalable Deployment

- **Frontend**: CDN (CloudFront, Cloudflare)
- **Backend**: Container orchestration (Kubernetes, ECS)
- **Database**: Managed PostgreSQL (RDS, Supabase, Neon)
- **Load Balancer**: Distribute traffic
- **Caching**: Redis/Memcached

## Future Enhancements

### Planned Features

1. **Real-time Updates**: WebSockets for live dashboard
2. **Offline Support**: PWA with service workers
3. **Mobile App**: React Native companion app
4. **Advanced Analytics**: Custom reports and visualizations
5. **Integrations**: Payment gateways, accounting software
6. **Automation**: Email notifications, scheduled reports
7. **AI Features**: OCR for receipt scanning, anomaly detection

---

This architecture provides a solid foundation that can scale from a local SQLite app to a distributed, multi-tenant SaaS platform.

