-- BuildOps Pro Database Initialization Script
-- This script creates all tables and populates initial data

-- ============================================
-- Create Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'worker' CHECK (role IN ('admin', 'supervisor', 'worker')),
  phone VARCHAR(20),
  avatar_url TEXT,
  title VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- ============================================
-- Create Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date >= start_date),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
  department VARCHAR(100) NOT NULL,
  budget DECIMAL(15, 2),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_department ON projects(department);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- ============================================
-- Create Clock In Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS clock_in_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clock_in_time TIMESTAMP NOT NULL,
  clock_out_time TIMESTAMP,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  biometric_verified BOOLEAN DEFAULT FALSE,
  biometric_type VARCHAR(50),
  device_id VARCHAR(100),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clock_in_user_id ON clock_in_records(user_id);
CREATE INDEX IF NOT EXISTS idx_clock_in_date ON clock_in_records(DATE(clock_in_time));

-- ============================================
-- Create Timesheet Entries Table
-- ============================================
CREATE TABLE IF NOT EXISTS timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  hours_worked DECIMAL(5, 2) NOT NULL CHECK (hours_worked >= 0 AND hours_worked <= 24),
  task_description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, project_id)
);

CREATE INDEX IF NOT EXISTS idx_timesheet_user_date ON timesheet_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_timesheet_project_id ON timesheet_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_status ON timesheet_entries(status);

-- ============================================
-- Create Payroll Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_pay DECIMAL(12, 2) NOT NULL,
  hours_worked DECIMAL(8, 2) NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  total_deductions DECIMAL(12, 2) DEFAULT 0,
  net_pay DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'rejected')),
  payment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period_start, period_end, project_id)
);

CREATE INDEX IF NOT EXISTS idx_payroll_user_period ON payroll_records(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll_records(status);

-- ============================================
-- Create Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- ============================================
-- Create Project Team Members Table
-- ============================================
CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL,
  hours_allocated DECIMAL(8, 2),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_team_members(user_id);

-- ============================================
-- Insert Initial Data
-- ============================================

-- Insert sample users
INSERT INTO users (email, password_hash, full_name, employee_id, department, role, phone, title, hire_date, status) VALUES
  ('sarah.johnson@buildops.com', 'hashed_password_1', 'Sarah Johnson', 'EMP-2026-001', 'Engineering', 'supervisor', '+1-555-0101', 'Project Lead', '2024-01-15', 'active'),
  ('mike.rodriguez@buildops.com', 'hashed_password_2', 'Mike Rodriguez', 'EMP-2026-002', 'Operations', 'worker', '+1-555-0102', 'Site Foreman', '2024-06-10', 'active'),
  ('david.kim@buildops.com', 'hashed_password_3', 'David Kim', 'EMP-2026-003', 'Engineering', 'worker', '+1-555-0103', 'Structural Engineer', '2024-03-20', 'active'),
  ('elena.martinez@buildops.com', 'hashed_password_4', 'Elena Martinez', 'EMP-2026-004', 'Safety', 'worker', '+1-555-0104', 'Safety Inspector', '2025-01-10', 'active'),
  ('james.wilson@buildops.com', 'hashed_password_5', 'James Wilson', 'EMP-2026-005', 'Operations', 'worker', '+1-555-0105', 'Heavy Equipment Op.', '2023-09-05', 'active'),
  ('aisha.patel@buildops.com', 'hashed_password_6', 'Aisha Patel', 'EMP-2026-006', 'Management', 'admin', '+1-555-0106', 'Project Manager', '2022-05-20', 'active');

-- Insert sample projects
INSERT INTO projects (name, description, start_date, end_date, status, department, budget, created_by) 
SELECT 
  'Riverside Commercial Complex',
  'Multi-phase commercial development with retail and office space',
  '2025-06-01',
  '2026-12-31',
  'active',
  'Engineering',
  5000000.00,
  id
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

INSERT INTO projects (name, description, start_date, end_date, status, department, budget, created_by) 
SELECT 
  'Downtown Office Complex',
  'Modern office tower construction and infrastructure setup',
  '2025-08-15',
  '2027-06-30',
  'active',
  'Engineering',
  8500000.00,
  id
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

INSERT INTO projects (name, description, start_date, end_date, status, department, budget, created_by) 
SELECT 
  'Skyline Towers - Phase 2',
  'Second phase of Skyline Towers residential project',
  '2024-01-10',
  '2026-05-30',
  'completed',
  'Engineering',
  3200000.00,
  id
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

INSERT INTO projects (name, description, start_date, end_date, status, department, budget, created_by) 
SELECT 
  'Waterfront Development',
  'Waterfront mixed-use development project',
  '2025-10-01',
  '2027-12-31',
  'planning',
  'Operations',
  6800000.00,
  id
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

-- Insert sample clock-in records (today)
INSERT INTO clock_in_records (user_id, clock_in_time, clock_out_time, location_lat, location_lng, biometric_verified, status) 
SELECT 
  id,
  NOW() - INTERVAL '8 hours',
  NOW(),
  40.7128,
  -74.0060,
  true,
  'completed'
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

INSERT INTO clock_in_records (user_id, clock_in_time, location_lat, location_lng, biometric_verified, status) 
SELECT 
  id,
  NOW() - INTERVAL '4 hours',
  40.7128,
  -74.0060,
  true,
  'active'
FROM users WHERE employee_id = 'EMP-2026-002'
LIMIT 1;

-- Insert sample timesheet entries
INSERT INTO timesheet_entries (user_id, project_id, date, hours_worked, task_description, status)
SELECT 
  u.id,
  p.id,
  CURRENT_DATE - INTERVAL '1 day',
  8.5,
  'Foundation work and site preparation',
  'submitted'
FROM users u, projects p 
WHERE u.employee_id = 'EMP-2026-001' AND p.name = 'Riverside Commercial Complex'
LIMIT 1;

INSERT INTO timesheet_entries (user_id, project_id, date, hours_worked, task_description, status)
SELECT 
  u.id,
  p.id,
  CURRENT_DATE - INTERVAL '1 day',
  7.5,
  'Equipment maintenance and logistics',
  'approved'
FROM users u, projects p 
WHERE u.employee_id = 'EMP-2026-002' AND p.name = 'Downtown Office Complex'
LIMIT 1;

-- Insert sample payroll records
INSERT INTO payroll_records (user_id, project_id, period_start, period_end, gross_pay, hours_worked, hourly_rate, total_deductions, net_pay, status)
SELECT 
  u.id,
  p.id,
  '2026-05-01',
  '2026-05-15',
  3840.00,
  80,
  48.00,
  241.58,
  3598.42,
  'pending'
FROM users u, projects p 
WHERE u.employee_id = 'EMP-2026-001' AND p.name = 'Riverside Commercial Complex'
LIMIT 1;

INSERT INTO payroll_records (user_id, project_id, period_start, period_end, gross_pay, hours_worked, hourly_rate, total_deductions, net_pay, status)
SELECT 
  u.id,
  p.id,
  '2026-05-01',
  '2026-05-15',
  3360.00,
  80,
  42.00,
  256.00,
  3104.00,
  'paid'
FROM users u, projects p 
WHERE u.employee_id = 'EMP-2026-002' AND p.name = 'Downtown Office Complex'
LIMIT 1;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, read)
SELECT 
  id,
  'Timesheet Approved',
  'Your timesheet for May 20-27 has been approved',
  'success',
  false
FROM users WHERE employee_id = 'EMP-2026-001'
LIMIT 1;

INSERT INTO notifications (user_id, title, message, type, read)
SELECT 
  id,
  'Payroll Ready',
  'Your May payroll is ready for review',
  'info',
  true
FROM users WHERE employee_id = 'EMP-2026-002'
LIMIT 1;

-- Assign team members to projects
INSERT INTO project_team_members (project_id, user_id, role, hours_allocated)
SELECT 
  p.id,
  u.id,
  'Project Lead',
  160
FROM projects p, users u 
WHERE p.name = 'Riverside Commercial Complex' AND u.employee_id = 'EMP-2026-001';

INSERT INTO project_team_members (project_id, user_id, role, hours_allocated)
SELECT 
  p.id,
  u.id,
  'Site Foreman',
  160
FROM projects p, users u 
WHERE p.name = 'Riverside Commercial Complex' AND u.employee_id = 'EMP-2026-002';

INSERT INTO project_team_members (project_id, user_id, role, hours_allocated)
SELECT 
  p.id,
  u.id,
  'Structural Engineer',
  120
FROM projects p, users u 
WHERE p.name = 'Downtown Office Complex' AND u.employee_id = 'EMP-2026-003';

INSERT INTO project_team_members (project_id, user_id, role, hours_allocated)
SELECT 
  p.id,
  u.id,
  'Safety Inspector',
  80
FROM projects p, users u 
WHERE p.name = 'Downtown Office Complex' AND u.employee_id = 'EMP-2026-004';
