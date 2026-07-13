# Taskboard

A full-stack task management application built with React (frontend) and Express + PostgreSQL (backend).

## Project Structure

```
packages/
├── frontend/   — React + Vite + TypeScript
├── backend/    — Express + PostgreSQL + TypeScript
└── shared/     — Shared TypeScript types used by both
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (see `.env` for connection config)

### Setup

```bash
# Install all dependencies (root + all workspaces)
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start both frontend and backend dev servers
npm run dev
```

### Individual Commands

```bash
# Frontend only (Vite dev server on port 5173)
npm run dev:frontend

# Backend only (Express server on port 3000)
npm run dev:backend

# Type-check all packages
npm run typecheck
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5431
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=taskboard_dev
```
