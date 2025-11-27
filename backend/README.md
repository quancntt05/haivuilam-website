# Backend API - Photo Sharing Application

Backend API built with ExpressJS, TypeScript, Prisma ORM, and PostgreSQL.

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Setup database:
```bash
npm run prisma:generate

npm run prisma:migrate
```

4. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Prisma models (auto-generated)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── prisma/              # Prisma schema and migrations
└── uploads/             # Uploaded files
```

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

The API provides endpoints for:
- **Authentication**: Google OAuth, token refresh, logout
- **Photos**: Upload, list, get by ID, get by user, delete
- **Comments**: Create, list by photo, update, delete

All endpoints use JWT authentication and follow RESTful conventions.

## Testing

This project uses Jest for unit and integration testing.

### Test Structure

```
tests/
├── unit/              # Unit tests for services
│   └── services/
├── integration/       # Integration tests for routes
│   └── *.routes.test.ts
├── helpers/           # Test utilities
└── setup.ts           # Test configuration
```

## License

ISC

