# Implementation Approach

## Overview

This document outlines the approach for implementing the Secure Task Management System within the 8-hour time constraint.

## Architecture Strategy

### Monorepo Structure

```
apps/
  api/          → NestJS backend with TypeORM + SQLite
  dashboard/    → Angular frontend with TailwindCSS
libs/
  data/         → Shared TypeScript interfaces & DTOs
  auth/         → Reusable RBAC decorators and guards
```

### Technology Stack

- **Backend:** NestJS + TypeORM + SQLite + JWT
- **Frontend:** Angular + TailwindCSS + RxJS
- **Testing:** Jest
- **Monorepo:** NX Workspace

## Role-Based Access Control

### Admin Role (Highest Privilege)

Full administrative control across the entire organization hierarchy.

**Permissions:**

- ✅ Create tasks in their org and all descendant orgs
- ✅ View tasks in their org and all descendant orgs
- ✅ Edit any task in their org and all descendant orgs
- ✅ Delete any task in their org and all descendant orgs
- ✅ Access audit logs for their org and all descendant orgs
- ✅ Full read/write access to entire subtree

**Use Case:** System administrators, department heads who need full control over their domain and all sub-organizations.

### Owner Role (Medium Privilege)

Full control of their own organization, read-only access to child organizations.

**Permissions:**

- ✅ Create tasks in their own org only
- ✅ View tasks in their org and all descendant orgs (read-only for children)
- ✅ Edit tasks in their own org only
- ✅ Delete tasks in their own org only
- ✅ Access audit logs for their org and all descendant orgs (read-only)
- ⚠️ Read-only access to child organization tasks

**Use Case:** Team leads, managers who need visibility into their team and sub-teams but should not interfere with child org operations.

### Viewer Role (Lowest Privilege)

Read-only access to their organization.

**Permissions:**

- ❌ Cannot create tasks
- ✅ View tasks in their own org only
- ❌ Cannot edit tasks
- ❌ Cannot delete tasks
- ❌ Cannot access audit logs
- 📖 Strictly read-only

**Use Case:** Stakeholders, observers, contractors who need visibility but no modification rights.

## Permission System & Role Inheritance

### Permission Model

Permissions are implemented as predefined constants mapped to roles, demonstrating role inheritance without requiring a database table. Each role inherits all permissions from roles below it in the hierarchy:

**Hierarchy:** `Viewer → Owner → Admin`

- **Viewer** has base read permissions
- **Owner** inherits all Viewer permissions + adds write permissions for own org
- **Admin** inherits all Owner permissions + extends write permissions to child orgs

**Implementation Note:** Due to time constraints, the current backend implementation in `TaskService` uses direct role checks (e.g., `user.role === Role.VIEWER`) rather than the more granular `PermissionsGuard` and `@RequirePermissions` decorators. The detailed permission definitions and role-permission mapping below represent the _planned_, more flexible RBAC system that would be implemented in a full production scenario.

### Permission Definitions

Permissions are granular and scope-aware:

- `task:read:own` - View tasks in own organization
- `task:read:children` - View tasks in child organizations
- `task:create:own` - Create tasks in own organization
- `task:create:children` - Create tasks in child organizations
- `task:update:own` - Edit tasks in own organization
- `task:update:children` - Edit tasks in child organizations
- `task:delete:own` - Delete tasks in own organization
- `task:delete:children` - Delete tasks in child organizations
- `audit:read` - Access audit logs

### Role-Permission Mapping

- **Viewer:** `task:read:own`
- **Owner:** All Viewer permissions + `task:create:own`, `task:update:own`, `task:delete:own`, `task:read:children`, `audit:read`
- **Admin:** All Owner permissions + `task:create:children`, `task:update:children`, `task:delete:children`

This inheritance model makes it easy to add new roles or extend permissions in the future by converting to a Permission entity with database-backed role-permission relationships.

## Permission Matrix

| Action                   | Admin | Owner          | Viewer |
| ------------------------ | ----- | -------------- | ------ |
| Create task in own org   | ✅    | ✅             | ❌     |
| Create task in child org | ✅    | ❌             | ❌     |
| View tasks in own org    | ✅    | ✅             | ✅     |
| View tasks in child orgs | ✅    | ✅ (read-only) | ❌     |
| Edit task in own org     | ✅    | ✅             | ❌     |
| Edit task in child org   | ✅    | ❌             | ❌     |
| Delete task in own org   | ✅    | ✅             | ❌     |
| Delete task in child org | ✅    | ❌             | ❌     |
| Access audit logs        | ✅    | ✅ (read-only) | ❌     |

## Organization Hierarchy

### N-Level Hierarchy Structure

Organizations support unlimited nesting depth with parent-child relationships.

**Example:**

```
Acme Corporation (Root)
├── Engineering
│   ├── Frontend Team
│   └── Backend Team
└── Sales
    ├── Enterprise Sales
    └── SMB Sales
```

### Hierarchy Access Rules

**Admin at Acme Corporation:**

- Full control over all 7 organizations
- Can create/edit/delete tasks anywhere in the tree

**Owner at Engineering:**

- Full control over Engineering tasks
- Read-only access to Frontend Team and Backend Team tasks
- Cannot modify Frontend or Backend tasks

**Admin at Frontend Team:**

- Full control over Frontend Team tasks only
- Cannot see Engineering, Backend, Acme, or Sales tasks

**Viewer at Sales:**

- Can only view Sales tasks
- Cannot see Enterprise or SMB child org tasks

## Data Model

### Organization

- Self-referencing hierarchy (parentId references Organization.id)
- Supports unlimited nesting depth
- Each organization belongs to zero or one parent
- Each organization can have multiple children

### User

- Belongs to exactly one organization
- Has exactly one role (Admin, Owner, or Viewer)
- Role applies within their organization context

### Task

- Belongs to exactly one organization
- Created by one user (owner)
- Visibility and modification rights determined by user role and org hierarchy

## Implementation Phases

### Phase 1: Backend Foundation (2 hours)

**Priority: CRITICAL**

1. **Database Setup**

   - ✅ Configure TypeORM with SQLite
   - ✅ Create entities: User, Organization, Task
   - ✅ Implement N-level organization hierarchy (self-referencing)
   - ✅ Set up entity relationships

2. **Authentication**

   - ✅ JWT strategy implementation
   - ✅ Login endpoint with email/password
   - ✅ JWT guard for protected routes
   - ✅ Password hashing with bcrypt

3. **Seed Data**
   - Create sample organization hierarchy
   - Create test users with different roles
   - Create sample tasks for testing

### Phase 2: RBAC & Hierarchical Access (2 hours)

**Priority: CRITICAL**

1. **Organization Hierarchy Service**

   - Method to get all descendant organizations
   - Method to get accessible organization IDs based on user role
   - Permission checking helpers

2. **Access Control Guards**

   - Custom role-based guards
   - Decorators for permission checking
   - Organization hierarchy-aware access scoping
   - Different logic for Admin vs Owner vs Viewer

3. **Task API Endpoints**

   - `POST /tasks` - Create task (Admin/Owner in own org, Admin in child orgs)
   - `GET /tasks` - List accessible tasks (scoped by role and org hierarchy)
   - `PUT /tasks/:id` - Update task (Admin/Owner in own org, Admin in child orgs)
   - `DELETE /tasks/:id` - Delete task (Admin/Owner in own org, Admin in child orgs)
   - `GET /audit-log` - View access logs (Admin/Owner only)

4. **Audit Logging**
   - **Implementation Note:** This feature was skipped to prioritize the completion of the core CRUD and RBAC functionality within the time limit. In a full implementation, a dedicated `AuditService` and middleware would be created to log key events.
   - Console logging for create/update/delete operations
   - Log user, action, timestamp, and affected resource

### Phase 3: Frontend Implementation (2.5 hours)

**Priority: HIGH**

1. **Authentication UI**

   - Login page with email/password form
   - Form validation
   - JWT storage in localStorage
   - HTTP interceptor to attach JWT to all requests
   - Auto-redirect to login on 401

2. **Task Dashboard**

   - Task list component showing accessible tasks
   - Display organization name for each task
   - Conditional UI based on user role
   - Create task form (hidden for Viewers, scoped for Owners)
   - Edit task button (only for tasks user can modify)
   - Delete task button (only for tasks user can delete)
   - Responsive layout with TailwindCSS

3. **State Management**
   - Angular services for task management
   - RxJS observables for reactive updates
   - Current user state management

### Phase 4: Testing & Polish (1 hour)

**Priority: MEDIUM**

**Implementation Note:** Formal unit and integration tests were de-prioritized to focus on delivering a complete end-to-end functional prototype. The application was manually tested across all user roles to ensure correctness. In a production scenario, the test cases outlined below would be implemented.

1. **Backend Tests**

   - JWT authentication flow
   - Role-based permission guards
   - Hierarchy access logic (Admin full access, Owner read-only children, Viewer own org only)
   - Task CRUD operations with permission checks
   - Edge cases (access denied, invalid tokens, etc.)

2. **Code Quality**
   - Error handling with proper HTTP status codes
   - Input validation with DTOs
   - Security best practices (no password exposure, SQL injection prevention)

### Phase 5: Documentation (0.5 hours)

**Priority: CRITICAL**

1. **README Updates**
   - Clear setup instructions (dependencies, environment, database)
   - Architecture overview with organization hierarchy explanation
   - Role definitions with examples
   - API documentation with sample requests/responses
   - Data model diagram showing relationships
   - Access control explanation with real-world scenarios

## Success Criteria

### Must Have

✅ Real JWT authentication (no mock)  
✅ Three distinct roles with different permission levels  
✅ N-level organization hierarchy with self-referencing structure  
✅ Admin: full access to own org + all descendants  
✅ Owner: full access to own org, read-only to descendants  
✅ Viewer: read-only access to own org only  
✅ All 4 task CRUD endpoints functional  
✅ Hierarchical task visibility based on role  
✅ Login UI with token management  
✅ Task management dashboard with role-based UI  
✅ Basic test coverage (auth, RBAC, hierarchy)  
✅ Complete README documentation

### Nice to Have (if time permits)

- Task sorting and filtering
- Task categorization (Work, Personal, etc.)
- Drag-and-drop for reordering
- Visual task completion charts
- Organization tree visualization
- Dark mode toggle
- Keyboard shortcuts
- Comprehensive test suite

## Technical Decisions

### Why N-Level Hierarchy Instead of 2-Level?

- Implementation complexity is identical (self-referencing relationship)
- Provides more flexibility and real-world applicability
- Demonstrates understanding of recursive data structures
- Better showcase of technical skills

### Why These Role Definitions?

- **Admin:** System-level control for IT staff, executive leadership
- **Owner:** Middle management with oversight but not interference
- **Viewer:** Stakeholders, clients, read-only observers
- Clear separation of concerns and responsibilities
- Real-world applicability

### Why SQLite?

- Zero configuration required
- Portable (single file database)
- Sufficient for development and demonstration
- Easy to inspect and debug
- Can be replaced with PostgreSQL for production

### Hierarchy Traversal Implementation

- **Current approach:** Recursive method with N database queries (one per level)
- **Trade-off:** Prioritized code clarity and correctness over performance for the challenge
- **Production optimization:** Would use recursive CTEs, materialized paths, or closure tables for single-query traversal
- **Justification:** With 4 test organizations and 3 levels, the performance difference is negligible, but the simpler code is easier to understand and maintain during the challenge timeframe

### Frontend/Backend Code Separation

- **Problem:** The initial setup caused the Angular frontend to import backend-only libraries (`typeorm`, `class-validator`) through the shared `libs/data` entities. This led to build warnings and application instability.
- **Solution:** A separate, browser-safe entry point (`libs/data/src/browser.ts`) was created. This file exports only DTOs, enums, and plain interfaces, ensuring no backend code is ever included in the frontend build.
- **Architecture:** The `tsconfig.base.json` was updated with a new path alias (`@task-management-take-home/data/browser`) for the frontend to use, while the backend continues to use the main `@task-management-take-home/data` import which includes the TypeORM entities. This enforces a clean separation of concerns.

## Risk Mitigation

1. **Time Management**

   - Strict phase time limits with buffer
   - Hierarchy logic is critical - implement and test early
   - Skip optional UI features if behind schedule
   - Focus on working code over perfect code

2. **Technical Risks**

   - Test hierarchy access logic early to catch issues
   - Use NestJS/Angular CLI generators for boilerplate
   - Reference official documentation when stuck
   - Seed database with realistic data for testing

3. **Quality Assurance**
   - Manual testing throughout development
   - Focus tests on critical paths (auth, RBAC, hierarchy)
   - Ensure proper error messages and HTTP status codes
