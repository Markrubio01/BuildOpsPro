# BuildOps Pro - Database Setup Guide

This document provides instructions for initializing the Supabase database with the required tables and sample data.

## Prerequisites

- Supabase project created and connected
- Environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (optional, for automated setup)

## Quick Setup

### Option 1: Manual SQL Setup (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and copy the contents of `scripts/init-database.sql`
4. Execute the SQL script

This will create all required tables and insert sample data.

### Option 2: Using the Initialization Script

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the initialization script
node scripts/init-db.js
```

## Database Schema

The following tables are created:

### Core Tables
- **users** - User accounts and authentication
- **projects** - Project management and tracking
- **clock_in_records** - Time tracking with location and biometrics
- **timesheet_entries** - Hourly work entries by project and date
- **payroll_records** - Employee payroll and compensation tracking
- **notifications** - User notification system
- **project_team_members** - Team assignments for projects

### Sample Data

The initialization script inserts sample data for:
- 6 users (employees with different departments and roles)
- 4 projects (in different statuses)
- Clock-in/out records for today
- Timesheet entries for current month
- Payroll records for current period
- Project team member assignments

## Accessing Database Data

### Home Page
Fetches and displays:
- Active projects count from `projects` table
- Team members count from `users` table
- Hours worked this month from `timesheet_entries` table

### Projects Page
Fetches and displays:
- Active clock-in records from `clock_in_records` table (status = 'active')
- Completed clock-out records from `clock_in_records` table (with clock_out_time set)
- Search filters crew members by name and role

### Timesheet Page
Fetches and displays:
- Timesheet entries for selected month and employee
- Dynamically generates calendar data based on database records
- Supports month navigation and employee filtering

### Payroll Page
Fetches and displays:
- Payroll records for current period from `payroll_records` table
- Employee information from joined `users` table
- Project selection and change functionality

## API Endpoints

All API endpoints are integrated with Supabase:

- `POST /api/auth/login` - User authentication
- `POST /api/clock-in/checkin` - Record clock-in with location
- `POST /api/clock-in/checkout` - Record clock-out
- `GET /api/projects` - List projects with filtering
- `POST /api/projects` - Create new project
- `GET /api/timesheet/entries` - Get timesheet for date range
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Update payroll records

## Data Relationships

```
users (1) ──────────→ (many) clock_in_records
users (1) ──────────→ (many) projects (created_by)
users (1) ──────────→ (many) timesheet_entries
users (1) ──────────→ (many) payroll_records
users (1) ──────────→ (many) project_team_members

projects (1) ──────→ (many) timesheet_entries
projects (1) ──────→ (many) project_team_members
projects (1) ──────→ (many) payroll_records
```

## Troubleshooting

### "Missing Supabase environment variables"
Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in your `.env.local` file.

### "Failed to execute SQL"
If tables already exist, the `IF NOT EXISTS` clauses will prevent errors. You can safely re-run the script.

### No data appearing in UI
- Check that the Supabase connection is working
- Verify environment variables are correctly set
- Check browser console for any error messages
- Ensure sample data was inserted correctly by querying the tables in Supabase

## Next Steps

1. Run the database initialization script
2. Start the development server: `npm run dev`
3. Visit each page to verify data is loading from Supabase:
   - Home page: Check dashboard stats
   - Projects page: View clocked-in employees and search
   - Timesheet page: Navigate months and filter by employee
   - Payroll page: Check employee payroll data

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema Details](./BACKEND_API_DOCUMENTATION.md#database-schema)
