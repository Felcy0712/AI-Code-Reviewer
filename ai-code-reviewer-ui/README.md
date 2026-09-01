# AI Code Reviewer

AI Code Reviewer is a web application that analyzes uploaded codebases and generates AI-powered code reviews.

Users authenticate with Google, upload a ZIP project, and receive an AI-generated review based on retrieved code context.

## Architecture

```text
React + Vite
     ↓
FastAPI
     ↓
Google OAuth / Session
     ↓
PostgreSQL
     ↓
Code Processing
     ↓
Embeddings
     ↓
ChromaDB
     ↓
RAG Retrieval
     ↓
Google Gemini
     ↓
AI Code Review

Features :
Google OAuth authentication
Session-based authentication
ZIP project upload
Source-code extraction and processing
Code chunking
Embedding generation
ChromaDB vector storage
Project-specific RAG retrieval
Gemini-powered code review
PostgreSQL project and review persistence
Dashboard with project/review statistics
Review history
Protected project/review APIs
Dockerized FastAPI backend
Tech Stack
Frontend
React
Vite
React Router
Axios
JavaScript
CSS
Lucide React
Backend
Python 3.11
FastAPI
Uvicorn
Pydantic
SQLAlchemy
Authlib
Starlette SessionMiddleware
Database / AI
PostgreSQL
ChromaDB
Sentence Transformers
Google Gemini
Deployment
Docker
Vercel for frontend
Azure for backend/cloud infrastructure
Kubernetes planned for container orchestration
Project Structure
AI-Code-Reviewer/
│
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── upload.py
│   │   ├── project.py
│   │   └── review.py
│   │
│   ├── dependencies/
│   │   └── auth.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── project.py
│   │   └── review.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── project.py
│   │   └── review.py
│   │
│   ├── services/
│   │   ├── file_service.py
│   │   ├── code_reader.py
│   │   ├── code_loader.py
│   │   ├── chunker.py
│   │   ├── embedding_service.py
│   │   └── llm_service.py
│   │
│   ├── rag/
│   │   ├── vector_store.py
│   │   └── retriever.py
│   │
│   ├── config.py
│   ├── database.py
│   └── main.py
│
├── Dockerfile
├── .dockerignore
├── requirements.txt
└── README.md
Authentication Flow
React
  ↓
Google Login
  ↓
FastAPI OAuth callback
  ↓
Find/Create user in PostgreSQL
  ↓
Session created
  ↓
Signed session cookie
  ↓
Protected API access

The application uses Google OAuth/OIDC with session-based authentication.

JWT is not used in the current architecture.

Upload and Review Flow
User
 ↓
Upload ZIP
 ↓
POST /upload
 ↓
Authenticate current user
 ↓
Create Project
 ↓
Extract ZIP
 ↓
Read source files
 ↓
Chunk code
 ↓
Generate embeddings
 ↓
Store vectors in ChromaDB
 ↓
Retrieve project-specific chunks
 ↓
Send retrieved context to Gemini
 ↓
Generate review
 ↓
Save Review in PostgreSQL
 ↓
Mark Project completed
 ↓
Return project_id + review_id
 ↓
React opens /review/{review_id}
Project Isolation

Every ChromaDB chunk contains project metadata:

project_id
file_name
chunk_index

Retrieval is filtered using the current project ID so code from another project is not returned during review.

Database Model
users
  │
  └── projects
          │
          └── reviews
Users

Stores authenticated application users.

Projects

Stores uploaded project information and processing status.

Reviews

Stores AI-generated review results associated with a project.

Local Development
Backend

Create and activate the virtual environment:

python -m venv .venv
.\.venv\Scripts\Activate.ps1

Install dependencies:

python -m pip install -r requirements.txt

Run FastAPI:

python -m uvicorn app.main:app --reload

Backend:

http://localhost:8000

Swagger:

http://localhost:8000/docs
Frontend

From the React project directory:

npm install
npm run dev

Frontend:

http://localhost:5173
Environment Variables

Backend .env:

DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=
GEMINI_API_KEY=
FRONTEND_URL=http://localhost:5173

Frontend:

VITE_API_URL=http://localhost:8000

Docker : 
Build the backend image:

docker build -t ai-code-reviewer .

Run it:

docker run --name ai-code-reviewer `
  --env-file .env `
  -p 8000:8000 `
  -v ai-code-reviewer-chroma:/app/data/chroma `
  ai-code-reviewer

The Docker image contains the FastAPI application and Python dependencies.

ChromaDB data is stored in a persistent Docker volume.

API Endpoints
Authentication
GET  /auth/google/login
GET  /auth/google/callback
GET  /auth/me
POST /auth/logout
Projects
GET /projects
GET /dashboard/stats
Upload
POST /upload
Reviews
GET /review/{review_id}
GET /reviews
Health
GET /health
Deployment

Planned production architecture:

User
 ↓
Vercel
 ↓
React frontend
 ↓ HTTPS
Azure Container Apps
 ↓
FastAPI Docker container
 ├── Azure PostgreSQL
 ├── Persistent Chroma storage
 └── Gemini API

