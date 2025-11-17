# Receipthy Frontend

React + TypeScript + Vite frontend for the Receipthy application.

## Pages

- **Dashboard**: POS analytics with KPIs, charts, and transaction table
- **Invoices**: Full invoice management with CRUD operations
- **Invoice Detail**: Printable invoice view
- **Receipts**: Receipt management with invoice linking
- **Settings**: Application settings (placeholder)

## Components

- **Layout**: Main application layout with sidebar navigation
- **InvoiceForm**: Dynamic form for creating/editing invoices
- **ReceiptForm**: Form for creating/editing receipts

## API Integration

All API calls are centralized in `src/lib/api.ts` for easy maintenance.

## Styling

Uses Tailwind CSS with a custom primary color scheme:
- Primary: Blue (`#0ea5e9`)
- Accent colors for different statuses and payment methods

