# AI Code Reviewer — Project Overview

AI Code Reviewer is a web application where a developer uploads a ZIP of source code, and the system analyzes the code and generates an AI-powered code review covering bugs, code quality, and improvements.

# Tech Stack
Frontend - React, Vite, React Router, Axios
Backend -	Python 3.11, FastAPI, Pydantic
Database - PostgreSQL, SQLAlchemy
Authentication - Google OAuth/OIDC, session cookies
RAG - LangChain, ChromaDB
Embeddings - Hugging Face all-MiniLM-L6-v2
LLM - Google Gemini
Container - Docker
Cloud/K8s	Planned

# Product Flow
User
 ↓
React UI
 ↓
Google Login
 ↓
FastAPI
 ↓
Session authentication
 ↓
Upload ZIP
 ↓
Extract + read source files
 ↓
LangChain splits code into chunks
 ↓
Hugging Face creates embeddings
 ↓
ChromaDB stores chunks + vectors + project_id
 ↓
Retriever gets relevant project chunks
 ↓
LangChain Prompt
 ↓
Gemini
 ↓
AI Review
 ↓
PostgreSQL stores review
 ↓
review_id returned to React
 ↓
React requests /review/{review_id}
 ↓
Review displayed in UI

# How to Test Locally

1. Start PostgreSQL.

2. Start backend: python -m uvicorn app.main:app --reload

Backend: http://localhost:8000

Swagger: http://localhost:8000/docs

3. Start frontend:

npm install
npm run dev

Frontend:

http://localhost:5173

4. Test the product: 
Open:  http://localhost:5173
Then:

# Google Login
→ Dashboard
→ Upload sample_project.zip
→ AI review generated
→ Review page
→ History

# Docker Test
Build: 
docker build -t ai-code-reviewer .

Run:
docker run --name ai-code-reviewer `
  --env-file .env `
  -p 8000:8000 `
  -v ai-code-reviewer-chroma:/app/data/chroma `
  ai-code-reviewer

Then use the same frontend at:
http://localhost:5173

# Key Architecture Concept

PostgreSQL stores application data such as users, projects, and reviews.

ChromaDB stores code chunks, embeddings, and metadata for semantic retrieval.

LangChain connects the RAG components; Hugging Face creates embeddings, and Gemini generates the final review.