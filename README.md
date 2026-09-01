**AI Code Reviewer**
AI Code Reviewer is a web application that analyzes uploaded codebases and generates AI-powered code reviews.
Users authenticate with Google, upload a ZIP project, and receive an AI-generated review based on retrieved code context.

**Architecture**
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

**Features :**
  •	Google OAuth authentication
  •	Session-based authentication
  •	ZIP project upload
  •	Source-code extraction and processing
  •	Code chunking
  •	Embedding generation
  •	ChromaDB vector storage
  •	Project-specific RAG retrieval
  •	Gemini-powered code review
  •	PostgreSQL project and review persistence
  •	Dashboard with project/review statistics
  •	Review history
  •	Protected project/review APIs
  •	Dockerized FastAPI backend
  
**Tech Stack : **
  1. Frontend
     •	React
     •	Vite
     •	React Router
     •	Axios
     •	JavaScript
     •	CSS
     •	Lucide React
2. Backend
     •	Python 3.11
     •	FastAPI
     •	Uvicorn
     •	Pydantic
     •	SQLAlchemy
     •	Authlib
     •	Starlette SessionMiddleware
3. Database / AI
     •	PostgreSQL
     •	ChromaDB
     •	Sentence Transformers
     •	Google Gemini
     •	Deployment
     •	Docker
     •	Vercel for frontend
Azure for backend/cloud infrastructure, Kubernetes planned for container orchestration
