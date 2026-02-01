# Lokia AI - Product Requirements Document

## Overview

Lokia is an intelligent AI assistant platform that provides conversational AI capabilities through a modern web interface. The platform consists of a FastAPI backend for AI processing and a Next.js frontend for user interaction.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for session management
- **AI Integration**: OpenAI API / Anthropic Claude API
- **Authentication**: JWT tokens

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (production)

## Features

### MVP Features
1. **User Authentication**
   - Sign up / Sign in
   - JWT-based authentication
   - Password reset

2. **Chat Interface**
   - Real-time messaging with AI
   - Conversation history
   - Markdown rendering

3. **Conversation Management**
   - Create new conversations
   - View conversation history
   - Delete conversations

### Future Features
- Multi-model support
- File uploads
- Voice input/output
- Team workspaces

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Conversations
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/{id}` - Get conversation
- `DELETE /api/v1/conversations/{id}` - Delete conversation

### Messages
- `POST /api/v1/conversations/{id}/messages` - Send message
- `GET /api/v1/conversations/{id}/messages` - Get messages

### Health
- `GET /api/v1/health` - Health check

## Project Structure

```
lokia-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       └── router.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` in both backend and frontend
3. Run `docker-compose up -d`
4. Access frontend at `http://localhost:3000`
5. Access backend API at `http://localhost:8000`
