
````markdown
# Awaaz — Hackathon MVP Implementation Plan

A civic complaint platform for tourists in Nepal.

Built as a single Next.js full-stack application using:
- Next.js App Router
- Server Components
- Server Actions
- Prisma ORM
- PostgreSQL
- Tailwind CSS

The goal is to create a functional MVP that demonstrates the complete complaint lifecycle:

Tourist submits complaint → Authority receives it → Authority resolves it → Tourist gets updates.

---

# Feature Tier Map

## Tier 1 — Foundation

1. Project setup
2. Database design
3. UI system
4. Authentication
5. Role-based access


## Tier 2 — Core Complaint System

6. Tourist complaint submission
7. Evidence upload
8. Complaint tracking
9. Authority dashboard
10. Complaint status management
11. Complaint feed with filters


## Tier 3 — Smart Features

12. AI complaint categorization
13. AI priority suggestion
14. Notification system


## Tier 4 — Demo Enhancement

15. Location/map integration
16. Admin management
17. UI polishing
18. Seed/demo data


---

# Phase 1: Foundation + Authentication

## 1. Project Setup

Create Next.js application:

```bash
npx create-next-app@latest awaaz --typescript --tailwind --app
````

Install dependencies:

```bash
npm install prisma @prisma/client
npm install bcryptjs
npm install jose
npm install zod
npm install react-leaflet leaflet
npm install lucide-react
npm install @google/generative-ai
```

---

# 2. Database Setup

Use Prisma + PostgreSQL.

Main models:

## User

Stores authentication and roles.

Fields:

```
id
name
email
passwordHash
role
createdAt
```

Roles:

```
TOURIST
AUTHORITY
ADMIN
```

---

## Complaint

Stores tourist complaints.

Fields:

```
id
referenceNumber
title
description
category
status
priority
location
touristId
assignedAuthority
createdAt
updatedAt
```

Complaint status:

```
SUBMITTED
UNDER_REVIEW
INVESTIGATION
RESOLVED
CLOSED
```

Complaint categories:

```
Taxi Fraud
Hotel Issue
Trekking Safety
Harassment
Overcharging
Theft
Other
```

---

## Evidence

Stores uploaded files.

Fields:

```
id
complaintId
fileUrl
fileType
uploadedAt
```

---

## Notification

Stores user notifications.

Fields:

```
id
userId
message
isRead
createdAt
```

---

# 3. Authentication System

Implement:

## Registration

Users create accounts.

Fields:

```
Name
Email
Password
Role
```

## Login

Authentication using:

* bcrypt password hashing
* JWT/session cookie

Role redirect:

```
Tourist
    ↓
Tourist Dashboard


Authority
    ↓
Authority Dashboard
```

---

# Phase 2: Core Complaint Workflow

## Tourist Module

## Complaint Submission

Route:

```
/dashboard/complaints/new
```

Form:

```
Title

Description

Category

Incident Date

Location

Evidence Upload
```

When submitted:

System creates:

```
Complaint ID

Reference Number

Status = SUBMITTED
```

Example:

```
AWAAZ-2026-00125
```

---

# Evidence Upload

Tourists can upload:

```
Images
Videos
Documents
```

Stored using object storage(install and use uploadthing).

Complaint detail page displays:

```
Complaint information

Evidence gallery

Status timeline
```

---

# Complaint Tracking

Tourist can view:

```
Submitted
     |
Under Review
     |
Investigation
     |
Resolved
```

Each status shows:

* Date
* Authority action
* Updates

---

# Tourist Complaint Feed

Dashboard contains a social-style complaint feed.

Example:

```
--------------------------------

AWAAZ-2026-00125

Taxi charged unfair amount

Category:
Taxi Fraud

Status:
Under Review

Location:
Thamel

2 hours ago

--------------------------------
```

Features:

* Search
* Category filter
* Status filter

---

# Authority Module

Authority dashboard:

Displays:

```
New Complaints

Active Complaints

Resolved Complaints
```

Authority can:

* View complaint details
* View evidence
* Update status
* Add resolution message

Actions:

```
Accept Complaint

Mark Under Review

Resolve Complaint
```

---

# Phase 3: Smart Features

## AI Complaint Categorization

After complaint submission:

AI analyzes description.

Example:

Input:

```
Taxi driver charged me double price
```

AI output:

```
Category:
Taxi Fraud


Priority:
High
```

Stored:

```
aiCategory

aiConfidence

priority
```

Technology:

Google Gemini API / OpenAI API

---

# AI Priority Detection

AI suggests urgency:

Example:

```
Lost passport

Priority:
URGENT
```

```
Bad restaurant service

Priority:
LOW
```

Authority can override AI result.

---

# Notification System

When events happen:

Create notifications.

Examples:

Tourist:

```
Your complaint AWAAZ-102
is under investigation.
```

Authority:

```
New complaint assigned.
```

Implemented using database notifications.

---

# Phase 4: Location + Management Features

# Map Integration

Complaint contains location.

Implementation:

React Leaflet + OpenStreetMap

Features:

Tourist:

* Select complaint location

Authority:

* View complaint location

Example:

```
Complaint Location:

[Map View]

Thamel, Kathmandu
```

---

# Admin Module

Admin manages:

## Users

View:

```
Tourists
Authorities
```

## Complaints

View:

```
All complaints

Status

Priority
```

## Authority Management

Create authority accounts.

---

# Project Structure

```
src/

├── app/

│   ├── login/

│   ├── register/

│   ├── dashboard/

│   │     ├── complaints/

│   │     └── notifications/

│   │

│   ├── authority/

│   │     └── dashboard/


├── actions/

│   ├── auth.actions.ts

│   ├── complaint.actions.ts

│   └── notification.actions.ts


├── server/

│   ├── auth.ts

│   ├── complaints.ts

│   ├── ai.ts


├── components/

│   ├── complaint/

│   ├── auth/

│   ├── map/

│   └── ui/


├── lib/

│   ├── prisma.ts

│   ├── session.ts

│   └── validators.ts
```

---

# Demo Flow

1. Tourist registers

↓

2. Tourist logs in

↓

3. Tourist submits complaint

↓

4. AI categorizes complaint

↓

5. Authority receives complaint

↓

6. Authority updates status

↓

7. Tourist receives notification

↓

8. Complaint gets resolved

---

# Features Included

✅ Full authentication
✅ Role-based system
✅ Tourist dashboard
✅ Authority dashboard
✅ Complaint submission
✅ Evidence upload
✅ Complaint tracking
✅ Complaint feed
✅ Search/filter
✅ AI categorization
✅ AI priority detection
✅ Notifications
✅ Location/map support
✅ Admin management

---

# Features Reduced From Production Version

Removed for hackathon time:

* Advanced SSE real-time engine
* Complex identity verification
* Heatmap analytics
* Translation pipeline
* Advanced event architecture
* Heavy background job system

The MVP keeps the complete user experience while reducing implementation complexity.

```
```
