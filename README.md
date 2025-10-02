# Secure Task Management System

This project is a full-stack task management application built for a take-home challenge. It features a NestJS backend with a sophisticated role-based access control (RBAC) system and a lightweight Angular frontend.

## Core Features

- **Authentication:** Secure JWT-based authentication.
- **N-Level Organization Hierarchy:** Supports complex, multi-level organizational structures.
- **Role-Based Access Control (RBAC):** Three distinct user roles (Admin, Owner, Viewer) with granular, hierarchy-aware permissions.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Drag-and-Drop UI:** Users can update task statuses by dragging cards between columns.
- **Dockerized Environment:** A one-command `docker-compose up` setup for easy evaluation.

## Getting Started (Docker - Recommended)

The easiest way to run the entire application is with Docker Compose.

### Prerequisites

- Docker & Docker Compose

### 1. Environment Setup

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

You can customize the `DASHBOARD_PORT` in this file if needed.

### 2. Run the Application

From the root of the project, run:

```bash
docker-compose up
```

This command builds the production images, starts both services, and automatically seeds the database. Once running, access the application at **http://localhost:8080** (or your custom port).

### 3. Shutting Down

Press `Ctrl+C` in the terminal, and then run `docker-compose down` to clean up.

## Test Users & Passwords

You can log in with the following credentials to test the different permission levels:

| Email                      | Password                 | Role   | Organization     |
| -------------------------- | ------------------------ | ------ | ---------------- |
| `admin@acme.com`           | `rootAdminPassword`      | ADMIN  | Acme Corporation |
| `ceo@acme.com`             | `ceoPassword`            | OWNER  | Acme Corporation |
| `eng.manager@acme.com`     | `engPassword`            | ADMIN  | Engineering      |
| `dev@acme.com`             | `devPassword`            | OWNER  | Frontend Team    |
| `sales.owner@acme.com`     | `salesOwnerPassword`     | OWNER  | Sales            |
| `viewer@acme.com`          | `viewerPassword`         | VIEWER | Sales            |
| `frontend.viewer@acme.com` | `frontendViewerPassword` | VIEWER | Frontend Team    |

## Role Permissions Explained

The application uses a hierarchical RBAC system where a user's access is determined by their role and their position in the organization tree.

- **Viewer:**

  - Can only view tasks within their **own** organization.
  - Cannot create, update, or delete any tasks.

- **Owner:**

  - Can view tasks within their **own** organization and all **descendant** organizations.
  - Can only create, update, or delete tasks within their **own** organization.

- **Admin:**
  - Can view tasks within their **own** organization and all **descendant** organizations.
  - Can create, update, or delete tasks in their **own** organization and any **descendant** organization.

---

## Getting Started (Local Development)

### 1. Prerequisites

- Node.js (v24 or later recommended)
- npm

### 2. Installation & Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create .env file for the API
cp apps/api/.env.example apps/api/.env

# Seed the database
npm run seed
```

### 3. Run the Application

You will need two separate terminals.

**Terminal 1: Start Backend API**

```bash
npx nx serve api
```

**Terminal 2: Start Frontend Dashboard**

```bash
npx nx serve dashboard
```

The frontend will be available at `http://localhost:4200`.

## API Endpoints

- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/tasks`: Get all tasks accessible to the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task.
