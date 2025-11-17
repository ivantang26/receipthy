# Receipthy Backend

Express.js backend with Prisma ORM for the Receipthy application.

## API Documentation

### Health Check
```
GET /api/health
```

### Dashboard
```
GET /api/dashboard/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&groupBy=daily|monthly|yearly
```

### Transactions
```
GET /api/transactions?page=1&limit=20&from=YYYY-MM-DD&to=YYYY-MM-DD&search=query&status=COMPLETED&paymentMethod=CASH
GET /api/transactions/export (returns CSV)
```

### Invoices
```
GET /api/invoices?page=1&limit=20&status=SENT&search=query
GET /api/invoices/:id
POST /api/invoices
PUT /api/invoices/:id
DELETE /api/invoices/:id
POST /api/invoices/:id/duplicate
```

### Receipts
```
GET /api/receipts?page=1&limit=20&from=YYYY-MM-DD&to=YYYY-MM-DD&source=MANUAL&search=query
GET /api/receipts/:id
POST /api/receipts
PUT /api/receipts/:id
DELETE /api/receipts/:id
```

## Database Schema

See `prisma/schema.prisma` for the complete schema definition.

### Models
- **Transaction**: POS transaction records with items
- **Invoice**: Customer invoices with line items
- **Receipt**: Receipt records (POS, manual, or imported)

### Enums
- **PaymentMethod**: CASH, CARD, E_WALLET, OTHER
- **TransactionStatus**: COMPLETED, REFUNDED, VOIDED
- **InvoiceStatus**: DRAFT, SENT, PAID, OVERDUE, CANCELLED
- **ReceiptSource**: POS, MANUAL, IMPORTED

