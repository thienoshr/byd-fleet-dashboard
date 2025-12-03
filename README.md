# BYD Fleet Risk Dashboard

A Next.js 13 application for managing fleet risk, vehicles, and agreements with SQLite database storage.

## Features

- **Dashboard**: View key performance indicators including average part lead time, vehicles overdue, contracts expiring soon, and high-risk vehicles
- **Vehicle List**: Comprehensive table showing vehicle details, part status, days overdue, contract expiry, and risk flags
- **Agreements**: Manage rental agreements with status tracking (Pending, Signed, Overdue, Completed)
- **Reports**: Export summary reports in CSV and PDF formats

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- TailwindCSS
- SQLite (better-sqlite3)
- jsPDF for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The database will be automatically initialized with sample data on first run.

## Project Structure

```
├── app/
│   ├── api/export/        # API route for report exports
│   ├── dashboard/         # Dashboard page
│   ├── vehicles/          # Vehicle list page
│   ├── agreements/        # Agreements page
│   ├── reports/           # Reports page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects to dashboard)
│   └── globals.css        # Global styles
├── components/
│   ├── Navigation.tsx     # Navigation component
│   ├── KPICard.tsx        # KPI card component
│   ├── VehicleTable.tsx   # Vehicle table component
│   ├── AgreementTable.tsx # Agreement table component
│   └── ExportButtons.tsx  # Export buttons component
├── lib/
│   ├── db.ts              # Database connection and setup
│   └── export.ts          # Export utilities
└── data/
    └── fleet.db           # SQLite database (auto-generated)
```

## Database

The SQLite database is automatically created in the `data/` directory on first run. It includes:

- **vehicles**: Vehicle information and risk data
- **agreements**: Contract and agreement details
- **parts**: Part order tracking and lead times

Sample data is automatically inserted for development purposes.

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The database file (`data/fleet.db`) is gitignored and will be created automatically
- All pages are server-rendered for optimal performance
- The application uses Next.js 13 App Router with Server Components
- TailwindCSS is configured with custom color schemes and utility classes















