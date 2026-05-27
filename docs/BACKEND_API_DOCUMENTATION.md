# BuildOps Pro - Backend API & Database Documentation

**Project:** Industrial Precision Cloud App - BuildOps Pro  
**Version:** 1.0.0  
**Date:** May 27, 2026  
**Framework:** Supabase (PostgreSQL) + Next.js API Routes  
**Status:** Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Clock-In/Time Tracking](#clock-intiming-endpoints)
4. [Timesheet Management](#timesheet-endpoints)
5. [Projects Management](#projects-endpoints)
6. [Biometric Management](#biometric-endpoints)
7. [Dashboard](#dashboard-endpoints)
8. [Payroll](#payroll-endpoints)
9. [Notifications](#notifications-endpoints)
10. [Settings & Profile](#settings--profile-endpoints)
11. [Database Schema](#database-schema)
12. [Response Format Standards](#response-format-standards)
13. [Error Handling](#error-handling)
14. [Rate Limiting](#rate-limiting)

---

## Overview

BuildOps Pro is a comprehensive site office management portal for industrial-scale operations. The backend provides RESTful APIs for authentication, time tracking, timesheet management, biometric verification, project management, and payroll processing.

### Base URL

```
Production: https://buildops-pro.supabase.co/rest/v1
Development: http://localhost:3000/api
```

### Authentication Scheme

All endpoints (except `/auth/signup` and `/auth/login`) require JWT bearer token authentication:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### POST `/auth/signup`

Register a new user account in the system.

**Description:** User registration with email, password, and basic employee information

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (email format, required, unique)",
  "password": "string (min 8 chars, 1 uppercase, 1 number, required)",
  "full_name": "string (required, max 100 chars)",
  "employee_id": "string (required, unique, alphanumeric)",
  "department": "string (required, enum: Engineering, Operations, Management, Safety, HR)",
  "phone": "string (optional, valid phone format)"
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@buildops.com",
  "full_name": "John Doe",
  "employee_id": "EMP-2026-001",
  "department": "Engineering",
  "role": "worker",
  "created_at": "2026-05-27T08:30:00Z",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Email already exists / Invalid email format / Password too weak / Missing required fields
- `409 Conflict`: Employee ID already exists
- `422 Unprocessable Entity`: Invalid phone format

---

### POST `/auth/login`

Authenticate user and obtain session tokens.

**Description:** User login with email and password credentials

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@buildops.com",
  "full_name": "John Doe",
  "role": "worker|supervisor|admin",
  "department": "Engineering",
  "avatar_url": "https://example.com/avatar.jpg",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials / User not found
- `429 Too Many Requests`: Too many login attempts (locked for 15 minutes)

---

### POST `/auth/refresh`

Refresh access token using refresh token.

**Description:** Obtain a new access token using a valid refresh token

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "string (required)"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid refresh token / Token expired

---

### POST `/auth/logout`

Invalidate user session.

**Description:** Log out user and revoke session tokens

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/auth/forgot-password`

Request password reset link.

**Description:** Send password reset email to user

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reset link sent to email",
  "email": "john.doe@buildops.com"
}
```

**Error Responses:**
- `404 Not Found`: Email not found in system

---

### POST `/auth/reset-password`

Reset password with reset token.

**Description:** Complete password reset using token from email

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "string (reset token from email, required, 1 hour expiry)",
  "new_password": "string (min 8 chars, 1 uppercase, 1 number, required)",
  "confirm_password": "string (must match new_password, required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Token expired / Invalid token / Passwords don't match / Password too weak
- `422 Unprocessable Entity`: Passwords don't match

---

## Clock-In/Timing Endpoints

### POST `/clock-in/checkin`

Record clock-in time with biometric verification.

**Description:** Employee clock-in with location tracking and biometric authentication

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "location_lat": "number (latitude, required, -90 to 90)",
  "location_lng": "number (longitude, required, -180 to 180)",
  "biometric_verified": "boolean (required)",
  "biometric_type": "string (fingerprint|face|iris, required if biometric_verified=true)",
  "biometric_data": "string (base64 encoded biometric sample, required if biometric_verified=true)",
  "device_id": "string (device identifier, optional)",
  "notes": "string (optional, max 500 chars)"
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "clock_in_time": "2026-05-27T08:30:00Z",
  "location_lat": 40.7128,
  "location_lng": -74.0060,
  "biometric_verified": true,
  "biometric_type": "fingerprint",
  "device_id": "DEVICE-001",
  "notes": null,
  "status": "active",
  "created_at": "2026-05-27T08:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid token
- `400 Bad Request`: Invalid location / Missing required fields / Biometric verification failed
- `409 Conflict`: Already clocked in / Clock-in not allowed during non-working hours

---

### POST `/clock-in/checkout`

Record clock-out time.

**Description:** Employee clock-out with optional notes and location verification

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "location_lat": "number (latitude, required)",
  "location_lng": "number (longitude, required)",
  "notes": "string (optional, max 500 chars)"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "clock_in_time": "2026-05-27T08:30:00Z",
  "clock_out_time": "2026-05-27T17:30:00Z",
  "total_hours": 9.0,
  "location_lat": 40.7128,
  "location_lng": -74.0060,
  "status": "completed",
  "created_at": "2026-05-27T08:30:00Z",
  "updated_at": "2026-05-27T17:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid token
- `400 Bad Request`: Invalid location
- `409 Conflict`: Not currently clocked in

---

### GET `/clock-in/status`

Get current clock-in status.

**Description:** Check if employee is currently clocked in and elapsed time

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:** None

**Success Response (200):**
```json
{
  "is_clocked_in": true,
  "current_session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clock_in_time": "2026-05-27T08:30:00Z",
    "elapsed_time_seconds": 32400,
    "elapsed_time_formatted": "9h 0m",
    "location_lat": 40.7128,
    "location_lng": -74.0060,
    "biometric_verified": true
  }
}
```

**Or when not clocked in:**
```json
{
  "is_clocked_in": false,
  "current_session": null,
  "last_clock_out": "2026-05-26T17:30:00Z"
}
```

---

### GET `/clock-in/history`

Get historical clock-in records.

**Description:** Retrieve clock-in/out records for a date range

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
start_date: string (YYYY-MM-DD, required)
end_date: string (YYYY-MM-DD, required)
limit: number (default: 50, max: 100)
offset: number (default: 0)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "clock_in_time": "2026-05-27T08:30:00Z",
      "clock_out_time": "2026-05-27T17:30:00Z",
      "total_hours": 9.0,
      "location_lat": 40.7128,
      "location_lng": -74.0060,
      "biometric_verified": true,
      "notes": "Site inspection completed",
      "date": "2026-05-27"
    }
  ],
  "total_count": 22,
  "offset": 0,
  "limit": 50,
  "period": {
    "start_date": "2026-05-20",
    "end_date": "2026-05-27",
    "total_hours": 90.5
  }
}
```

---

## Timesheet Endpoints

### GET `/timesheet/entries`

Get timesheet entries for period.

**Description:** Retrieve timesheet entries for a specific date range

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
start_date: string (YYYY-MM-DD, required)
end_date: string (YYYY-MM-DD, required)
status: string (draft|submitted|approved|rejected, optional)
project_id: string (uuid, optional)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "project_id": "550e8400-e29b-41d4-a716-446655440002",
      "project_name": "Downtown Office Complex",
      "date": "2026-05-27",
      "hours_worked": 9.0,
      "task_description": "Foundation inspection and safety audit",
      "status": "draft",
      "submitted_at": null,
      "approved_by": null,
      "approved_at": null,
      "created_at": "2026-05-27T08:00:00Z"
    }
  ],
  "summary": {
    "total_hours": 45.5,
    "submitted_hours": 36.0,
    "approved_hours": 36.0,
    "draft_hours": 9.5,
    "period": "2026-05-20 to 2026-05-27"
  }
}
```

---

### POST `/timesheet/submit`

Submit timesheet for approval.

**Description:** Submit timesheet entries for manager review and approval

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "entries": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "date": "2026-05-27",
      "hours_worked": 9.0,
      "project_id": "550e8400-e29b-41d4-a716-446655440002",
      "task_description": "Foundation work",
      "required": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "date": "2026-05-28",
      "hours_worked": 8.5,
      "project_id": "550e8400-e29b-41d4-a716-446655440002",
      "task_description": "Structural inspection",
      "required": true
    }
  ],
  "period_start": "2026-05-20",
  "period_end": "2026-05-27",
  "notes": "All hours accounted for, no overtime"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "submitted",
  "submitted_at": "2026-05-27T10:00:00Z",
  "period_start": "2026-05-20",
  "period_end": "2026-05-27",
  "total_hours": 45.5,
  "entry_count": 5,
  "notes": "All hours accounted for, no overtime",
  "message": "Timesheet submitted successfully and awaiting approval"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid hours / Missing required fields / Total hours mismatch
- `409 Conflict`: Already submitted / Entries already exist for dates / Outside submission window

---

### GET `/timesheet/pending-approvals`

Get pending timesheets (manager/admin only).

**Description:** Retrieve timesheets awaiting approval for managed team

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
department: string (optional, filter by department)
status: string (pending|approved|rejected, optional)
limit: number (default: 50)
offset: number (default: 0)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "user_name": "John Doe",
      "employee_id": "EMP-2026-001",
      "department": "Engineering",
      "period_start": "2026-05-20",
      "period_end": "2026-05-27",
      "total_hours": 45.5,
      "submitted_at": "2026-05-27T10:00:00Z",
      "status": "submitted",
      "entry_count": 5
    }
  ],
  "total_count": 12,
  "pending_count": 12
}
```

---

### PUT `/timesheet/approve/:id`

Approve or reject timesheet (manager/admin only).

**Description:** Approve or reject submitted timesheet

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
```
id: string (timesheet id, required)
```

**Request Body:**
```json
{
  "action": "approve|reject (required)",
  "feedback": "string (optional, max 500 chars)",
  "adjustments": [
    {
      "entry_id": "uuid",
      "adjusted_hours": 8.5,
      "reason": "Overtime adjustment"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "status": "approved|rejected",
  "approved_at": "2026-05-27T14:00:00Z",
  "approved_by": "550e8400-e29b-41d4-a716-446655440099",
  "feedback": "Looks good, approved",
  "total_hours": 45.5
}
```

---

## Projects Endpoints

### GET `/projects`

List all projects.

**Description:** Retrieve all projects with filtering and pagination

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
status: string (planning|active|completed, optional)
department: string (optional)
limit: number (default: 50)
offset: number (default: 0)
search: string (optional, search by name or description)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Downtown Office Complex",
      "description": "High-rise office building construction in downtown district",
      "start_date": "2026-05-01",
      "end_date": "2026-06-30",
      "status": "active",
      "created_by": "550e8400-e29b-41d4-a716-446655440099",
      "created_at": "2026-05-01T08:00:00Z",
      "team_size": 25,
      "progress": 35
    }
  ],
  "total_count": 8,
  "offset": 0
}
```

---

### GET `/projects/:id`

Get project details.

**Description:** Retrieve full project details including team and tasks

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
```
id: string (project uuid, required)
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Downtown Office Complex",
  "description": "High-rise office building construction",
  "start_date": "2026-05-01",
  "end_date": "2026-06-30",
  "status": "active",
  "department": "Engineering",
  "created_by": "550e8400-e29b-41d4-a716-446655440099",
  "created_at": "2026-05-01T08:00:00Z",
  "updated_at": "2026-05-27T08:00:00Z",
  "team_members": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "role": "lead_engineer",
      "hours_allocated": 160
    }
  ],
  "budget": {
    "allocated": 500000,
    "spent": 175000
  },
  "progress": 35,
  "milestones": [
    {
      "id": "uuid",
      "title": "Foundation Complete",
      "target_date": "2026-05-31",
      "status": "completed"
    }
  ]
}
```

---

### POST `/projects` (Admin only)

Create new project.

**Description:** Create a new project with initial team members

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required, max 200 chars)",
  "description": "string (required, max 1000 chars)",
  "start_date": "2026-05-01 (required, YYYY-MM-DD)",
  "end_date": "2026-06-30 (required, YYYY-MM-DD, must be after start_date)",
  "department": "string (required, enum)",
  "budget": "number (optional)",
  "team_member_ids": ["uuid", "uuid"] (optional)
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Downtown Office Complex",
  "description": "High-rise office building construction",
  "start_date": "2026-05-01",
  "end_date": "2026-06-30",
  "status": "planning",
  "department": "Engineering",
  "created_at": "2026-05-27T08:00:00Z",
  "team_members": []
}
```

---

### PUT `/projects/:id` (Admin only)

Update project.

**Description:** Update project details and status

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
```
id: string (project uuid, required)
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "start_date": "2026-05-01 (optional)",
  "end_date": "2026-06-30 (optional)",
  "status": "planning|active|completed (optional)",
  "budget": "number (optional)"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Downtown Office Complex",
  "status": "active",
  "updated_at": "2026-05-27T14:00:00Z"
}
```

---

### GET `/projects/:id/tasks`

Get project tasks.

**Description:** Retrieve all tasks for a specific project

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
```
id: string (project uuid, required)
```

**Query Parameters:**
```
status: string (pending|in_progress|completed, optional)
assigned_to: string (uuid, optional)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "title": "Foundation Inspection",
      "description": "Complete structural inspection of foundation",
      "status": "in_progress",
      "assigned_to": "550e8400-e29b-41d4-a716-446655440001",
      "assigned_to_name": "John Doe",
      "due_date": "2026-05-31",
      "priority": "high",
      "created_at": "2026-05-20T08:00:00Z",
      "progress": 75
    }
  ],
  "total_count": 12,
  "summary": {
    "total": 12,
    "pending": 3,
    "in_progress": 5,
    "completed": 4
  }
}
```

---

## Biometric Endpoints

### POST `/biometric/enroll`

Enroll biometric data.

**Description:** Register user's biometric data for future verification

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "biometric_type": "string (fingerprint|face|iris, required)",
  "biometric_data": "string (base64 encoded raw biometric sample, required)",
  "quality_score": "number (0-100, optional)",
  "finger_position": "string (thumb|index|middle|ring|pinky, only for fingerprint)"
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440080",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "biometric_type": "fingerprint",
  "verified": false,
  "enrolled_at": "2026-05-27T10:00:00Z",
  "quality_score": 95,
  "message": "Biometric template created successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid biometric data / Low quality score (< 80)
- `409 Conflict`: Biometric type already enrolled

---

### POST `/biometric/verify`

Verify biometric data.

**Description:** Verify user's biometric against enrolled template

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "biometric_type": "string (fingerprint|face|iris, required)",
  "biometric_data": "string (base64 encoded biometric sample, required)"
}
```

**Success Response (200):**
```json
{
  "verified": true,
  "match_score": 98,
  "match_threshold": 95,
  "biometric_type": "fingerprint",
  "message": "Biometric verified successfully"
}
```

**Or on failure:**
```json
{
  "verified": false,
  "match_score": 72,
  "match_threshold": 95,
  "message": "Biometric verification failed - insufficient match"
}
```

---

### GET `/biometric/status`

Get biometric enrollment status.

**Description:** Check enrollment status for all biometric types

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "fingerprint": {
    "enrolled": true,
    "verified": true,
    "enrolled_at": "2026-05-27T08:00:00Z",
    "finger_position": "thumb"
  },
  "face": {
    "enrolled": false,
    "verified": false,
    "enrolled_at": null
  },
  "iris": {
    "enrolled": false,
    "verified": false,
    "enrolled_at": null
  }
}
```

---

## Dashboard Endpoints

### GET `/dashboard/summary`

Get dashboard summary KPIs.

**Description:** Retrieve key performance indicators for dashboard display

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "today": {
    "hours_worked": 9.5,
    "clocked_in": false,
    "current_project": "Downtown Office Complex",
    "clock_in_time": "2026-05-27T08:30:00Z",
    "clock_out_time": "2026-05-27T18:00:00Z"
  },
  "this_week": {
    "total_hours": 45.5,
    "days_worked": 5,
    "projects_active": 2,
    "target_hours": 40,
    "overtime": 5.5
  },
  "this_month": {
    "total_hours": 182.0,
    "days_worked": 22,
    "on_time_ratio": 96,
    "target_hours": 160,
    "overtime": 22.0
  },
  "pending_approvals": 1
}
```

---

### GET `/dashboard/attendance`

Get attendance statistics.

**Description:** Retrieve attendance metrics and trends

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
period: string (week|month|quarter, default: month)
```

**Success Response (200):**
```json
{
  "period": "May 2026",
  "total_working_days": 22,
  "present_days": 21,
  "absent_days": 1,
  "late_days": 2,
  "attendance_percentage": 95.5,
  "average_hours_per_day": 8.3,
  "daily_breakdown": [
    {
      "date": "2026-05-27",
      "hours_worked": 9.5,
      "status": "present",
      "on_time": true
    },
    {
      "date": "2026-05-26",
      "hours_worked": 8.0,
      "status": "present",
      "on_time": false,
      "minutes_late": 15
    }
  ]
}
```

---

### GET `/dashboard/notifications`

Get dashboard notifications.

**Description:** Retrieve recent notifications and alerts

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
limit: number (default: 20)
offset: number (default: 0)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "title": "Timesheet Approved",
      "message": "Your timesheet for May 20-27 has been approved",
      "type": "success",
      "read": false,
      "created_at": "2026-05-27T14:30:00Z",
      "action_url": "/payroll/current"
    }
  ],
  "unread_count": 3,
  "total_count": 28
}
```

---

## Payroll Endpoints

### GET `/payroll/current`

Get current payroll information.

**Description:** Retrieve current pay period details and earnings

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "period_start": "2026-05-20",
  "period_end": "2026-06-03",
  "days_remaining": 5,
  "gross_pay": 3600.00,
  "deductions": {
    "federal_tax": 432.00,
    "state_tax": 144.00,
    "social_security": 223.20,
    "medicare": 52.20,
    "insurance": 200.00,
    "retirement": 180.00,
    "other": 0.00
  },
  "total_deductions": 1231.40,
  "net_pay": 2368.60,
  "hours_worked": 45.5,
  "hourly_rate": 79.12,
  "status": "draft",
  "payment_date": "2026-06-05",
  "pay_frequency": "biweekly"
}
```

---

### GET `/payroll/history`

Get payroll history.

**Description:** Retrieve historical payroll records

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
limit: number (default: 12)
offset: number (default: 0)
year: number (optional, default: current year)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "period_start": "2026-05-06",
      "period_end": "2026-05-19",
      "gross_pay": 3520.00,
      "deductions": 1215.20,
      "net_pay": 2304.80,
      "hours_worked": 44.5,
      "status": "paid",
      "payment_date": "2026-05-22"
    }
  ],
  "total_count": 26,
  "ytd_gross": 45600.00,
  "ytd_net": 29952.00
}
```

---

### GET `/payroll/ytd`

Get year-to-date earnings.

**Description:** Retrieve cumulative year-to-date payroll data

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "year": 2026,
  "total_gross": 45600.00,
  "total_deductions": 15648.00,
  "total_net": 29952.00,
  "total_hours": 576.0,
  "pay_periods_completed": 13,
  "average_gross_per_period": 3507.69,
  "average_hours_per_period": 44.3,
  "tax_summary": {
    "federal_tax": 5616.00,
    "state_tax": 1872.00,
    "social_security": 2851.20,
    "medicare": 666.20
  }
}
```

---

## Notifications Endpoints

### GET `/notifications`

Get user notifications.

**Description:** Retrieve user notifications with filtering

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
read: string (true|false, optional)
type: string (info|warning|error|success, optional)
limit: number (default: 50)
offset: number (default: 0)
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "title": "Timesheet Reminder",
      "message": "Please submit your timesheet for the week of May 20-27",
      "type": "warning",
      "read": false,
      "created_at": "2026-05-27T14:00:00Z",
      "expires_at": "2026-05-28T14:00:00Z",
      "action_url": "/timesheet"
    }
  ],
  "unread_count": 5,
  "total_count": 127
}
```

---

### PUT `/notifications/:id/read`

Mark notification as read.

**Description:** Mark individual or bulk notifications as read

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
```
id: string (notification uuid, use "all" to mark all as read)
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440300",
  "read": true,
  "updated_at": "2026-05-27T15:00:00Z"
}
```

---

## Settings & Profile Endpoints

### GET `/settings/profile`

Get user profile.

**Description:** Retrieve complete user profile information

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "john.doe@buildops.com",
  "full_name": "John Doe",
  "employee_id": "EMP-2026-001",
  "department": "Engineering",
  "role": "worker",
  "phone": "+1-555-0123",
  "avatar_url": "https://example.com/avatars/john-doe.jpg",
  "title": "Senior Site Engineer",
  "hire_date": "2025-01-15",
  "status": "active",
  "created_at": "2026-05-01T08:00:00Z"
}
```

---

### PUT `/settings/profile`

Update user profile.

**Description:** Update profile information (non-sensitive fields)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "string (optional, max 100 chars)",
  "phone": "string (optional, valid phone format)",
  "avatar_url": "string (optional, image URL, must be https)",
  "title": "string (optional, max 50 chars)"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "full_name": "John Doe",
  "phone": "+1-555-0123",
  "avatar_url": "https://example.com/avatars/john-doe-new.jpg",
  "title": "Senior Site Engineer",
  "updated_at": "2026-05-27T15:30:00Z"
}
```

---

### GET `/settings/preferences`

Get user preferences.

**Description:** Retrieve user settings and preferences

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "theme": "dark",
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": true,
  "language": "en",
  "timezone": "America/New_York",
  "working_hours_start": "08:00",
  "working_hours_end": "17:00",
  "auto_logout_minutes": 30
}
```

---

### PUT `/settings/preferences`

Update user preferences.

**Description:** Update user settings and preferences

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "theme": "light|dark|auto (optional)",
  "notifications_enabled": "boolean (optional)",
  "email_notifications": "boolean (optional)",
  "push_notifications": "boolean (optional)",
  "language": "en|es|fr (optional)",
  "timezone": "string (IANA timezone, optional)",
  "working_hours_start": "HH:MM (optional, format 00:00-23:59)",
  "working_hours_end": "HH:MM (optional, format 00:00-23:59)",
  "auto_logout_minutes": "number (optional, 15-120)"
}
```

**Success Response (200):**
```json
{
  "theme": "dark",
  "notifications_enabled": true,
  "language": "en",
  "timezone": "America/New_York",
  "updated_at": "2026-05-27T15:45:00Z"
}
```

---

## Database Schema

### Core Tables

#### `users`

Main user account table with authentication and profile data.

```sql
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department);
```

#### `clock_in_records`

Time tracking records with biometric and location data.

```sql
CREATE TABLE clock_in_records (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clock_in_user_id ON clock_in_records(user_id);
CREATE INDEX idx_clock_in_date ON clock_in_records(DATE(clock_in_time));
```

#### `timesheet_entries`

Hourly work entries tracked by project and date.

```sql
CREATE TABLE timesheet_entries (
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

CREATE INDEX idx_timesheet_user_date ON timesheet_entries(user_id, date);
CREATE INDEX idx_timesheet_project_id ON timesheet_entries(project_id);
CREATE INDEX idx_timesheet_status ON timesheet_entries(status);
```

#### `timesheet_submissions`

Batch timesheet submissions for approval workflow.

```sql
CREATE TABLE timesheet_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_hours DECIMAL(8, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMP NOT NULL,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submission_user_period ON timesheet_submissions(user_id, period_start, period_end);
CREATE INDEX idx_submission_status ON timesheet_submissions(status);
```

#### `projects`

Project management and tracking.

```sql
CREATE TABLE projects (
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

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_department ON projects(department);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
```

#### `project_team_members`

Team assignments for projects.

```sql
CREATE TABLE project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL,
  hours_allocated DECIMAL(8, 2),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_team_members(project_id);
CREATE INDEX idx_project_members_user ON project_team_members(user_id);
```

#### `biometric_enrollments`

Biometric data templates for authentication.

```sql
CREATE TABLE biometric_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  biometric_type VARCHAR(50) NOT NULL CHECK (biometric_type IN ('fingerprint', 'face', 'iris')),
  biometric_template BYTEA NOT NULL,
  quality_score INT CHECK (quality_score >= 0 AND quality_score <= 100),
  verified BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMP NOT NULL,
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, biometric_type)
);

CREATE INDEX idx_biometric_user_type ON biometric_enrollments(user_id, biometric_type);
```

#### `notifications`

User notification system.

```sql
CREATE TABLE notifications (
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

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
```

#### `payroll_records`

Employee payroll and compensation tracking.

```sql
CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_pay DECIMAL(12, 2) NOT NULL,
  hours_worked DECIMAL(8, 2) NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'rejected')),
  payment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period_start, period_end)
);

CREATE INDEX idx_payroll_user_period ON payroll_records(user_id, period_start, period_end);
CREATE INDEX idx_payroll_status ON payroll_records(status);
```

#### `payroll_deductions`

Deduction details for payroll records.

```sql
CREATE TABLE payroll_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  deduction_type VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deductions_payroll ON payroll_deductions(payroll_id);
```

#### `user_settings`

User preferences and configuration.

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'auto',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  working_hours_start TIME DEFAULT '08:00',
  working_hours_end TIME DEFAULT '17:00',
  auto_logout_minutes INT DEFAULT 30 CHECK (auto_logout_minutes >= 15 AND auto_logout_minutes <= 120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_user ON user_settings(user_id);
```

#### `password_reset_tokens`

Password reset token management.

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_expires ON password_reset_tokens(expires_at);
```

#### `audit_logs`

System audit trail for compliance and security.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

---

## Response Format Standards

### Success Response

```json
{
  "status": "success",
  "code": 200,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2026-05-27T10:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Paginated Response

```json
{
  "status": "success",
  "code": 200,
  "data": [],
  "pagination": {
    "total_count": 100,
    "offset": 0,
    "limit": 50,
    "has_more": true
  },
  "timestamp": "2026-05-27T10:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Error Handling

### Error Response Format

All errors follow this standardized format:

```json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": "Field error description",
      "another_field": "Another error description"
    }
  },
  "timestamp": "2026-05-27T10:00:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input / Validation error |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authorized but lacks permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Business logic conflict (duplicate, state) |
| 422 | Unprocessable Entity | Semantic validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily down |

### Common Error Codes

- `INVALID_INPUT`: Invalid request body or parameters
- `AUTHENTICATION_FAILED`: Auth credentials invalid
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Resource doesn't exist
- `DUPLICATE_RESOURCE`: Resource already exists
- `VALIDATION_ERROR`: Field validation failed
- `STATE_CONFLICT`: Invalid state transition
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

### Rate Limit Headers

All responses include rate limit information:

```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 87
X-Rate-Limit-Reset: 1653628800
```

### Rate Limits by Endpoint Type

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 10 req/min | Per IP |
| Standard API | 100 req/min | Per user |
| Bulk Operations | 20 req/min | Per user |
| Clock-In | 50 req/min | Per user |

### Handling Rate Limits

When rate limited (429 response):
1. Wait for `X-Rate-Limit-Reset` timestamp
2. Use exponential backoff for retries
3. Check remaining requests via `X-Rate-Limit-Remaining`

---

## Security Considerations

### Authentication

- All passwords hashed using bcrypt with salt rounds: 12
- JWT tokens signed with RS256 algorithm
- Access tokens: 1 hour expiry
- Refresh tokens: 7 days expiry
- HTTPS required for all endpoints

### Data Protection

- All sensitive data encrypted at rest
- Biometric templates stored encrypted
- PII encrypted using AES-256
- Audit logs maintained for compliance

### Authorization

- Row-level security (RLS) enabled in Supabase
- Role-based access control (RBAC)
- Department-based data isolation
- Users can only access their own data unless admin/supervisor

### Input Validation

- All inputs validated server-side
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- CSRF protection via same-site cookies

---

## Implementation Checklist

- [ ] Set up Supabase project and database
- [ ] Create all database tables with proper indexes
- [ ] Implement Row-Level Security (RLS) policies
- [ ] Set up authentication with Supabase Auth
- [ ] Create API route handlers for all endpoints
- [ ] Implement JWT token validation middleware
- [ ] Add input validation for all endpoints
- [ ] Implement rate limiting
- [ ] Set up error handling and logging
- [ ] Create audit logging system
- [ ] Implement biometric data encryption
- [ ] Set up email notifications
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Implement pagination for list endpoints
- [ ] Add request/response logging
- [ ] Set up monitoring and alerting
- [ ] Implement backup and disaster recovery
- [ ] Create database migration scripts
- [ ] Write integration tests
- [ ] Perform security audit
- [ ] Deploy to production

---

## Next Steps

1. **Database Setup**: Execute SQL schema in Supabase PostgreSQL
2. **Authentication**: Integrate Supabase Auth with Next.js
3. **API Routes**: Create API routes in `/app/api/` directory
4. **Client Integration**: Add Supabase client library to frontend
5. **Testing**: Create comprehensive test suite
6. **Documentation**: Generate OpenAPI/Swagger documentation
7. **Deployment**: Deploy to production environment

---

**Document Version:** 1.0  
**Last Updated:** May 27, 2026  
**Next Review:** June 27, 2026
