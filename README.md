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

## Getting Started (Docker - Recommended)

The easiest way to run the entire application is with Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### 1. Environment Setup

Before running the application, you need to create a `.env` file. You can do this by copying the example file:

```bash
cp .env.example .env
```

You can customize the `DASHBOARD_PORT` in this file if needed.

### 2. Run the Application

From the root of the project, run:

```bash
docker-compose up --build
```

This command will:

- Build the production images for both the backend and frontend.
- Start both services using the configuration from your `.env` file.
- Automatically seed the database on the first run.

Once the containers are running, you can access the application at **http://localhost:8080** (or the custom port you set in `.env`).

### 3. Shutting Down

To stop the application, press `Ctrl+C` in the terminal, and then run:

```bash
docker-compose down
```

This command will:

- Build the production images for both the backend and frontend.
- Start both services.
- Automatically seed the database on the first run.

Once the containers are running, you can access the application at **[http://localhost:8080](http://localhost:8080)**.

### 2. Shutting Down

To stop the application, press `Ctrl+C` in the terminal, and then run:

```bash
docker-compose down
```

---

## Getting Started (Local Development)

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
