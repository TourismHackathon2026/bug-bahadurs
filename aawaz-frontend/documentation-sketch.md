# Awaaz Project Documentation Sketch

This file is a rough documentation outline for the Awaaz frontend project. It is intended as a working reference for writing the final report.

## Abstract
Awaaz is a civic complaint management platform designed for tourists, authorities, and administrators. The system allows users to report issues, attach evidence, track complaint status, and receive updates. It also helps authorities triage, assign, and resolve complaints more efficiently through a structured dashboard and notification system.

## Acknowledgment
- Thank the project supervisor and faculty members.
- Thank teammates, contributors, and anyone who supported development.
- Mention tools, documentation, and libraries used in the project.

## List of Figures
- Figure 1: Home page / landing page
- Figure 2: Complaint submission form
- Figure 3: Complaint tracking feed
- Figure 4: Authority dashboard
- Figure 5: Heatmap view
- Figure 6: Admin approval screen
- Figure 7: Notification panel
- Figure 8: Database or architecture diagram

## List of Tables
- Table 1: Functional requirements
- Table 2: Non-functional requirements
- Table 3: Technology stack
- Table 4: Test cases
- Table 5: User roles and permissions
- Table 6: Feature comparison with existing systems

## List of Abbreviations
- UI: User Interface
- UX: User Experience
- API: Application Programming Interface
- DB: Database
- SDLC: Software Development Life Cycle
- ERD: Entity Relationship Diagram
- DFD: Data Flow Diagram
- SSE: Server-Sent Events
- OTP: One-Time Password, if used in the final report

# 1 Introduction

## 1.1 Overview
Awaaz is a web-based complaint management platform for public-facing civic issues. It supports tourists who want to report problems, authorities who need to resolve them, and admins who manage access and oversight.

## 1.2 Problem Statement
Traditional complaint reporting is often fragmented, slow, and difficult to track. Users may not know whether their complaint was received, assigned, or resolved. Authorities also lack a unified workflow for handling complaints and monitoring service demand.

## 1.3 Objectives
- Provide a simple complaint submission workflow.
- Allow users to upload evidence and track complaint status.
- Help authorities manage and resolve complaints faster.
- Support admin approval and oversight workflows.
- Improve transparency through notifications and status updates.

## 1.4 Features
- User registration and login
- Complaint submission form
- Evidence upload support
- Complaint feed and status tracking
- Notifications for important updates
- Authority dashboard for triage and response
- Heatmap or location-based insight view
- Admin registration and complaint oversight
- Role-based access control

## 1.5 Significance
The system improves accountability and communication between the public and authorities. It reduces manual follow-up, helps prioritize urgent issues, and makes complaint resolution more transparent.

## 1.6 Scope and Limitations
### Scope
- Web-based complaint reporting and management
- Tourist, authority, and admin workflows
- Complaint tracking, notifications, and evidence handling
- Dashboard views for different roles

### Limitations
- Depends on internet connectivity
- Some features may rely on external services such as uploads or AI categorization
- The system is limited to the workflows implemented in the current project version

# 2 Literature Review

This section can compare Awaaz with similar complaint, grievance, or public-service reporting systems.

## 2.1 Existing Complaint Management Portal 1
### Pros
- Centralized complaint submission
- Basic complaint tracking
- Often already familiar to users

### Cons
- Limited transparency
- Weak user experience
- Little or no evidence-based reporting

## 2.2 Existing Complaint Management Portal 2
### Pros
- May support government workflows
- Can store complaint records securely
- Can support multiple departments

### Cons
- Complex interfaces
- Slow manual routing
- Limited real-time feedback

## 2.3 Existing Mobile Reporting App / Civic Portal 3
### Pros
- Accessible from mobile devices
- May support image uploads and location reporting
- Useful for on-the-go reporting

### Cons
- May lack authority-side dashboards
- May not support live notification loops
- May not offer strong complaint lifecycle visibility

# 3 Methodology

## 3.1 Software Development Life Cycle
The project can be described using an iterative or agile-inspired SDLC approach:
- Requirement analysis
- System design
- Frontend and backend implementation
- Database design
- Testing and debugging
- Deployment and refinement

## 3.2 Technologies and Tools Used
Use the actual project stack here instead of a generic template.

### 3.2.1 Programming Language
- TypeScript / JavaScript

### 3.2.2 Framework
- Next.js

### 3.2.3 Database
- PostgreSQL with Prisma ORM

### 3.2.4 Integrated Development Environment
- Visual Studio Code

### 3.2.5 Other Technologies Used
- React
- Tailwind CSS
- shadcn/ui-style components
- Upload handling services
- Notification and real-time update mechanisms
- Feature flags for controlling optional modules

# 4 System Analysis

## 4.1 Requirement Analysis
### 4.1.1 Requirement Gathering
Requirements were gathered by identifying the needs of tourists, authorities, and admins. The system needed to support complaint filing, tracking, response handling, and administrative oversight.

### 4.1.2 Functional Requirement
- User registration and authentication
- Complaint creation and editing
- Evidence attachment
- Complaint filtering and tracking
- Status updates and notifications
- Authority review and assignment
- Admin verification and management

## 4.2 Feasibility Study
### 4.2.1 Technical Feasibility
The project is technically feasible because the required web technologies, database support, and upload workflows can be implemented using modern frontend and backend frameworks.

### 4.2.2 Economic Feasibility
The system uses mostly open-source tools and scalable services, making it practical for a student or small-team project.

### 4.2.3 Schedule Feasibility
The project can be completed in phases by separating design, core workflows, dashboard views, testing, and documentation.

### 4.2.4 Gantt Chart
Insert a Gantt chart showing planning, design, implementation, testing, and documentation phases.

# 5 System Design and Implementation

## 5.1 System Architecture
### 5.1.1 Presentation Layer (Frontend)
The frontend is built with Next.js and React, providing the user interface for complaint filing, dashboards, and notifications.

### 5.1.2 Business Logic Layer (Backend)
The backend handles authentication, complaint processing, admin actions, routing logic, notification delivery, and data operations.

### 5.1.3 Data Layer (Database)
The database stores users, complaints, evidence metadata, notifications, roles, and related workflow records.

## 5.2 Procedure Oriented
### 5.2.1 Data Flow Diagram - Context Diagram
Show the flow between users, authorities, admins, and the Awaaz system.

### 5.2.2 Data Flow Diagram
Show complaint submission, processing, status update, and notification flow.

## 5.3 Database Design
### 5.3.1 ER Diagram
Include entities such as User, Complaint, Evidence, Notification, and Role.

# 6 System Development and Implementation

## 6.1 Programming Platform
The project is developed in a modern web development environment using Next.js, TypeScript, and supporting libraries.

## 6.2 Operating Environment
- Windows development environment
- Web browser for testing and use
- Database server for persistent storage
- Deployment-ready web hosting environment

# 7 Testing and Debugging

## 7.1 Tools Used for Testing
- Browser-based manual testing
- ESLint for code quality checks
- TypeScript compiler checks
- Application-level testing of forms, uploads, and navigation

## 7.2 Test Case
Example test cases:
- Register a new user
- Log in with valid credentials
- Submit a complaint with evidence
- Filter complaints by status
- Update complaint status from authority dashboard
- Verify notification delivery

# 8 Conclusion
Awaaz provides a structured and transparent way to handle civic complaints. It improves the reporting experience for users and gives authorities a better workflow for response and resolution.

# References
- Next.js documentation
- React documentation
- Prisma documentation
- PostgreSQL documentation
- Tailwind CSS documentation
- shadcn/ui documentation
- Project source code and implementation files

---

## Notes for Writing the Final Documentation
- Replace placeholders such as literature review software names with real comparisons.
- Add screenshots for figures from the actual application.
- Add tables for requirements, modules, and test cases.
- Update the methodology section to match the exact stack used in the project.
- Expand each section into formal report language before submission.
