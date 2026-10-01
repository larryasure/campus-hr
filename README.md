# University Lecturer HR Management System

A modern, responsive Human Resources Management System designed specifically for managing university lecturers, their academic records, teaching workload, HR requests, and institutional announcements.

## Overview

The University Lecturer HR Management System provides two role-based portals:

- **Lecturer**
- **HR Admin**

The system is designed as a focused MVP for managing core lecturer HR workflows without introducing unnecessary university management features.

## Features

### Authentication

- Lecturer registration
- Lecturer and HR Admin login
- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Secure authentication state handling

### Lecturer Portal

Lecturers can:

- View their HR dashboard
- View and update their profile
- Manage academic and career records
- View qualifications
- View promotion history
- View research interests
- View publications and professional affiliations
- View teaching workload
- Submit HR requests
- Track HR request status
- View institutional announcements

### HR Admin Portal

HR administrators can:

- View HR dashboard statistics
- Search and filter lecturers
- View lecturer profiles
- View academic records
- View teaching workload
- Review lecturer HR requests
- Update request status
- Add administrative comments
- Delete HR requests
- Create announcements
- Edit draft announcements
- Schedule announcements
- Cancel scheduled announcements
- Publish announcements
- Delete announcements

### HR Requests

Supported request types include:

- Leave
- Letter of Introduction
- Employment / Reference Letter
- Sabbatical
- Other HR requests

Request workflow:

```text
Pending
   ↓
Under Review
   ↓
Approved / Rejected
```
