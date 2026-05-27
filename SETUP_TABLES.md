# BuildOps Pro - Database Setup Guide

## Quick Setup (3 Steps)

### Step 1: Go to Supabase SQL Editor

1. Visit your Supabase dashboard at https://app.supabase.com
2. Select your project: **BuildOpsPro**
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Copy the SQL Script

Copy and paste the entire SQL script from `scripts/init-database.sql` into the SQL editor. This creates all 7 tables:

- `users` - Employee records
- `projects` - Construction projects
- `clock_in_records` - Attendance tracking
- `timesheet_entries` - Time tracking
- `payroll_records` - Payroll data
- `notifications` - User notifications
- `project_team_members` - Team assignments

### Step 3: Execute and Verify

1. Click the **RUN** button (or press Ctrl+Enter)
2. Wait for the query to complete
3. You should see success messages for all table creations

---

## Verification

After running the SQL script, verify the tables exist:

1. Go to **Database** section in Supabase
2. You should see all 7 tables listed:
   - [ ] users
   - [ ] projects
   - [ ] clock_in_records
   - [ ] timesheet_entries
   - [ ] payroll_records
   - [ ] notifications
   - [ ] project_team_members

---

## Sample Data

The SQL script automatically inserts sample data:

### Users (6 employees)
- Sarah Johnson - Project Lead (supervisor)
- Mike Rodriguez - Site Foreman (worker)
- David Kim - Structural Engineer (worker)
- Elena Martinez - Safety Inspector (worker)
- James Wilson - Heavy Equipment Op. (worker)
- Aisha Patel - Project Manager (admin)

### Projects (4 projects)
- Riverside Commercial Complex - Active
- Downtown Office Complex - Active
- Skyline Towers - Phase 2 - Completed
- Waterfront Development - Planning

### Clock-In Records
- Sample attendance records for today

### Timesheet Entries
- Sample work hours logged

### Payroll Records
- Sample payroll data for current period

---

## Using the Application

Once tables are created, you can:

1. **Home Page**: View dashboard stats pulled from database
2. **Projects Page**: See clock-in/out records and search employees
3. **Timesheet Page**: View employee time entries by month
4. **Payroll Page**: View and manage payroll by project

---

## Troubleshooting

### Tables Already Exist?
The SQL uses `CREATE TABLE IF NOT EXISTS`, so you can run it multiple times safely.

### Getting Errors?
- Ensure you're using the **public schema** (default)
- Check that environment variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Data Not Showing?
- Refresh the browser
- Check browser console for any fetch errors
- Verify tables have data: Go to Supabase Dashboard → Database → Tables

---

## Alternative: Using Node Script

If you prefer automated setup:

```bash
npm run setup-db
```

This requires the service role key to be set as an environment variable.

---

## API Integration

All pages automatically fetch from these tables via Supabase client:

- **Home Page**: `users` and `projects` tables
- **Projects Page**: `clock_in_records` table
- **Timesheet Page**: `timesheet_entries` table
- **Payroll Page**: `payroll_records` table

No configuration needed - just run the SQL and start using the app!
