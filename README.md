# Legal Firm Dashboard

A comprehensive web application for legal firms to manage cases, documents, and employee tasks. Built with React, TypeScript, Node.js, Express, and Prisma.

## Features

### Admin View
- View all cases and their status
- Track employee tasks and workload
- Monitor case progress and statistics
- Manage users and assignments

### Employee View
- Upload documents (PDF, Images, Videos, Audio, and any file format)
- Update case details and status
- Manage assigned tasks
- View assigned cases

### Document Management
- Upload multiple file types (PDF, Images, Videos, Audio, Documents, etc.)
- Associate documents with cases
- Download and delete documents
- Filter documents by type and case

### Case Management
- Create and manage legal cases
- Assign cases to employees
- Track case status and priority
- View case documents and tasks

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite
- JWT Authentication
- Multer for file uploads
- Zod for validation

### Frontend
- React 18 with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional, defaults are fine for development):
```bash
cp .env.example .env
```

4. **IMPORTANT: Setup database and seed users:**
```bash
# This will generate Prisma client, create database, and seed default users
npm run setup
```

Or manually:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

**⚠️ Important:** Make sure to run `npm run seed` to create the default users!

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Credentials

**⚠️ You must run `npm run seed` in the backend directory first!**

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@legal.com`
- Password: `password123`

**Employee Account:**
- Email: `employee@legal.com`
- Password: `password123`

If login doesn't work, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [QUICK_FIX.md](./QUICK_FIX.md)

## Project Structure

```
legal-firm-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth and upload middlewares
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── uploads/            # Uploaded files directory
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Cases
- `GET /api/cases` - List all cases
- `GET /api/cases/:id` - Get case details
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `POST /api/cases/:id/assign` - Assign case to user

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Features in Detail

### Document Upload
- Supports all file types (PDF, Images, Videos, Audio, Documents, etc.)
- File size limit: 100MB per file
- Documents can be associated with cases
- Optional descriptions for documents

### Case Management
- Case statuses: Open, In Progress, Under Review, Pending Client, Settled, Closed, Archived
- Priority levels: Low, Medium, High, Critical
- Case assignments to employees
- Case documents and tasks tracking

### Task Management
- Task statuses: To Do, In Progress, Done, Blocked
- Task assignment to employees
- Task priority levels
- Due dates for tasks

## License

MIT

