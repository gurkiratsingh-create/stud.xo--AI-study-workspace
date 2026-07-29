# System Architecture

> Project: **Stud.xo**
>
> Version: **1.0**
>
> Status: Draft

---

# Overview

Stud.xo follows a **Microservice-Oriented Architecture** where the application logic and AI logic are separated into independent services.

This architecture improves maintainability, scalability, and allows AI components to evolve independently without affecting the main application.

---

# Architecture Goals

- Separation of Concerns
- Modular Design
- High Maintainability
- Scalable AI Infrastructure
- Secure Authentication
- Easy Deployment
- Future-ready Architecture

---

# High-Level Architecture

```text
                           User
                             │
                             ▼
                     React Frontend
                             │
                    HTTPS REST Requests
                             │
                             ▼
                    Express Backend API
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
  PostgreSQL Database   FastAPI AI Service   File Storage
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
                 ChromaDB          Ollama LLM
```

---

# System Components

## 1. React Frontend

The frontend is responsible for providing the user interface and communicating with the backend.

### Responsibilities

- User Interface
- Authentication Flow
- State Management
- API Requests
- Routing
- Theme Management
- File Upload Interface
- Dashboard
- Chat Interface

The frontend **never communicates directly** with the database or AI services.

---

## 2. Express Backend

The Express backend serves as the central orchestrator of the application.

It is responsible for all business logic and communication between different services.

### Responsibilities

- Authentication
- Authorization
- User Management
- Workspace Management
- Chat Management
- Database Operations
- File Management
- Request Validation
- Calling the AI Service
- Returning API Responses

---

# Internal Backend Architecture

The backend follows a layered architecture.

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
PostgreSQL
```

---

## Layer Responsibilities

### Routes

- Define API endpoints
- Apply middleware
- Forward requests to controllers

---

### Controllers

- Receive HTTP requests
- Validate request data
- Call services
- Return HTTP responses

Controllers should contain **minimal business logic**.

---

### Services

The service layer contains all business logic.

Examples:

- Register User
- Create Workspace
- Upload Document
- Start Chat
- Save Memory

This is the core of the backend.

---

### Repositories

Responsible for database interaction.

Responsibilities include:

- Querying PostgreSQL
- Creating records
- Updating records
- Deleting records
- Returning database results

Repositories should never contain business logic.

---

## 3. PostgreSQL Database

Stores all structured application data.

### Stores

- Users
- Workspaces
- Chats
- Messages
- Documents
- Notes
- Memories
- Tags

PostgreSQL is the single source of truth for application data.

---

## 4. FastAPI AI Service

The AI Service is an independent Python application.

It performs all AI-related tasks while remaining isolated from the backend.

### Responsibilities

- Chat Completion
- Document Question Answering
- Research Assistance
- Code Explanation
- Text Summarization
- Embedding Generation
- Memory Extraction

The AI Service has no authentication or user management responsibilities.

---

## 5. ChromaDB

ChromaDB stores vector embeddings used for semantic search.

### Stores

- Document Embeddings
- Chunk Embeddings
- Semantic Metadata

ChromaDB is optimized for similarity search and Retrieval-Augmented Generation (RAG).

---

## 6. Ollama

Ollama hosts the local Large Language Model (LLM).

Initially supported models may include:

- Qwen
- Phi
- Gemma
- Llama

The architecture allows replacing Ollama with cloud providers in the future without changing the frontend or backend APIs.

Possible future providers:

- OpenAI
- Google Gemini
- Anthropic Claude

---

# Request Flow

## Standard API Request

```text
User
   │
   ▼
React Frontend
   │
HTTP Request
   │
   ▼
Express Backend
   │
Authentication
   │
Business Logic
   │
Repository
   │
PostgreSQL
   │
Response
   │
React
```

---

# AI Request Flow

```text
User
   │
   ▼
React Frontend
   │
HTTP Request
   │
   ▼
Express Backend
   │
Authentication
   │
Validation
   │
Call FastAPI
   │
FastAPI
   │
Embedding Search (if required)
   │
ChromaDB
   │
LLM (Ollama)
   │
AI Response
   │
Express Backend
   │
Save Chat
   │
Return Response
   │
React Frontend
```

---

# Document Processing Flow

```text
User Uploads Document
          │
          ▼
Express Backend
          │
Store File
          │
Save Metadata
          │
Send to FastAPI
          │
Extract Text
          │
Chunk Document
          │
Generate Embeddings
          │
Store in ChromaDB
          │
Ready for AI Search
```

---

# Authentication Flow

```text
User Login
      │
      ▼
Express Backend
      │
Verify Credentials
      │
Generate JWT
      │
Return Access Token
      │
React Stores Token
      │
Future Requests
      │
Authorization Header
```

---

# Design Principles

## Separation of Concerns

Each service has a single responsibility.

- React → UI
- Express → Business Logic
- PostgreSQL → Structured Data
- FastAPI → AI Processing
- ChromaDB → Vector Storage
- Ollama → Language Model

---

## Scalability

Each component can scale independently.

Examples:

- Multiple Express instances
- Dedicated AI server
- Cloud-hosted database
- Distributed vector database

---

## Maintainability

The layered backend architecture ensures:

- Easy debugging
- Easier testing
- Cleaner code
- Lower coupling
- Better readability

---

## Security

Authentication is handled only by the Express backend.

The AI Service is never exposed directly to clients.

All requests pass through authenticated backend APIs.

---

## Extensibility

The architecture is designed to support future features such as:

- Team Workspaces
- AI Agents
- Real-Time Collaboration
- Cloud AI Providers
- Mobile Applications
- Plugin System
- Background Jobs
- Analytics

without major architectural changes.

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Service | FastAPI |
| Vector Database | ChromaDB |
| LLM Runtime | Ollama |
| Authentication | JWT |
| Containerization | Docker |
| Version Control | Git + GitHub |

---

# Architecture Summary

Stud.xo is built using a modular, microservice-oriented architecture that separates application logic from AI processing. The Express backend acts as the central orchestrator, PostgreSQL manages structured data, FastAPI handles AI workflows, ChromaDB powers semantic search, and Ollama provides local LLM capabilities. This design emphasizes scalability, maintainability, and flexibility while providing a strong foundation for future enhancements.