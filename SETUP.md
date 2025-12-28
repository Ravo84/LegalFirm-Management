# Legal Firm Dashboard - Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with default users
npx ts-node prisma/seed.ts

# Start backend server
npm run dev
```

Backend will run on `http://localhost:4000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default Login Credentials

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@legal.com`
- Password: `password123`

**Employee Account:**
- Email: `employee@legal.com`
- Password: `password123`

## Features Overview

### Admin Dashboard
- View all cases and their status
- Track employee tasks and workload
- Monitor case statistics
- View all documents

### Employee Dashboard
- View assigned cases
- Upload documents (all file types supported)
- Update case details
- Manage assigned tasks

### Document Management
- Upload PDF, Images, Videos, Audio, and any file format
- Associate documents with cases
- Download and delete documents
- Filter by type and case

### Case Management
- Create and manage legal cases
- Assign cases to employees
- Track case status and priority
- View case documents and tasks

## Troubleshooting

### Database Issues
If you encounter database errors:
```bash
cd backend
rm -rf prisma/dev.db
npm run prisma:migrate
npx ts-node prisma/seed.ts
```

### Port Already in Use
If port 4000 or 5173 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

### File Upload Issues
Make sure the `uploads` directory exists:
```bash
cd backend
mkdir -p uploads
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a static server
```

## API Documentation

All API endpoints require authentication (except `/api/auth/login` and `/api/auth/register`).

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Cases
- `GET /api/cases` - List cases
- `POST /api/cases` - Create case
- `GET /api/cases/:id` - Get case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

