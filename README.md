# HaiVuiLam Application Setup Guide

This guide explains how to run the HaiVuiLam application using Docker and Docker Compose.

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432


### Using Docker Swarm or Kubernetes

The Dockerfiles are compatible with orchestration platforms. You can:
- Use `docker stack deploy` with Docker Swarm
- Use Kubernetes manifests (create from docker-compose.yml)
- Deploy to cloud platforms (AWS ECS, Google Cloud Run, Azure Container Instances)

## Troubleshooting

### Backend not starting
- Check backend logs: `docker-compose logs backend`
- Verify environment variables are set correctly
- Ensure database is healthy before backend starts

### Frontend not connecting to backend
- Verify `NEXT_PUBLIC_API_URL` in `.env` file
- Check if backend is running: `docker-compose ps`
- Check network connectivity: `docker-compose exec frontend ping backend`

### Port conflicts
If ports are already in use, change them in `.env`:
- `POSTGRES_PORT` - Default: 5432
- `BACKEND_PORT` - Default: 3001
- `FRONTEND_PORT` - Default: 3000

### Volume permissions
If you encounter permission issues with uploads:
```bash
docker-compose exec backend chown -R nodejs:nodejs /app/uploads
```

## Architecture

```
┌─────────────┐
│  Frontend   │ (Port 3000)
│  Next.js    │
└──────┬──────┘
       │
       │ HTTP
       │
┌──────▼──────┐
│   Backend   │ (Port 3001)
│  Express.js │
└──────┬──────┘
       │
       │ PostgreSQL
       │
┌──────▼──────┐
│  PostgreSQL │ (Port 5432)
│  Database   │
└─────────────┘
```

