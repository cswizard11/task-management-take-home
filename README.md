# Secure Task Management System

This project is a full-stack task management application built for a take-home challenge. It features a NestJS backend with a sophisticated role-based access control (RBAC) system and a lightweight Angular frontend.

## Core Features

- **Authentication:** Secure JWT-based authentication.
- **N-Level Organization Hierarchy:** Supports complex, multi-level organizational structures.
- **Role-Based Access Control (RBAC):** Three distinct user roles (Admin, Owner, Viewer) with granular permissions.
- **Hierarchical Permissions:** A user's access to tasks is determined by their role and their position within the organization hierarchy.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Drag-and-Drop UI:** Users can update task statuses by dragging cards between columns.

## Architecture

This project is structured as an Nx monorepo to facilitate code sharing and maintain a clean separation of concerns between the frontend and backend.

- `apps/api`: The NestJS backend application.
- `apps/dashboard`: The Angular frontend application.
- `libs/data`: A shared library containing DTOs, enums, and interfaces used by both the frontend and backend.

### Architectural Decision: Frontend/Backend Code Separation

A key architectural challenge was preventing backend-only dependencies (like `typeorm`) from being included in the frontend build. This was solved by creating a browser-safe entry point in the shared data library (`libs/data/src/browser.ts`). This file exports only the DTOs, enums, and plain interfaces needed by the frontend, ensuring a clean and stable build.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd task-management-take-home
npm install
```

### 2. Environment Setup

Create a `.env` file in the `apps/api/` directory with the following content:

```env
JWT_SECRET=a-secure-secret-for-development
DATABASE_PATH=./database.sqlite
NODE_ENV=development
PORT=3000
```

### 3. Seed the Database

Run the seed script to populate the database with test data, including a pre-defined organization hierarchy and users with different roles:

```bash
npm run seed
```

This will create a `database.sqlite` file in the root of the project.

### 4. Run the Application

You will need two separate terminals to run the backend and frontend servers.

**Terminal 1: Start the Backend API**

```bash
npx nx serve api
```

The API will be running at `http://localhost:3000/api`.

**Terminal 2: Start the Frontend Dashboard**

```bash
npx nx serve dashboard
```

The frontend will be running at `http://localhost:4200`.

## Test Users

You can log in with the following credentials (passwords are included in the seed script's console output):

- **`admin@acme.com`** (Role: `ADMIN` at `Acme Corporation`) - Can see and modify all tasks.
- **`ceo@acme.com`** (Role: `OWNER` at `Acme Corporation`) - Can see all tasks, but can only modify tasks in their own organization.
- **`eng.manager@acme.com`** (Role: `ADMIN` at `Engineering`) - Can see and modify tasks in `Engineering` and `Frontend Team`.
- **`dev@acme.com`** (Role: `OWNER` at `Frontend Team`) - Can see and modify tasks in `Frontend Team` only.
- **`viewer@acme.com`** (Role: `VIEWER` at `Sales`) - Can only view tasks in the `Sales` organization.

## API Endpoints

All endpoints under `/api/tasks` are protected and require a valid JWT.

- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/tasks`: Get all tasks accessible to the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task.
