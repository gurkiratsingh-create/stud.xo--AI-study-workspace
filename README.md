# Stud.xo

> **AI Workspace — Free Learning for Everyone**

Stud.xo is an AI-powered learning workspace designed to bring **AI chat, notes, documents, research, and AI memory** into one unified environment.

Instead of switching between separate applications for studying, documentation, AI assistance, and research, Stud.xo organizes everything inside isolated workspaces for subjects, courses, projects, and research topics.

---

## ✨ Vision

Stud.xo aims to become a personal AI learning environment that understands the user's learning material and helps them:

- Learn concepts
- Ask questions
- Organize notes
- Understand documents
- Research topics
- Remember important context
- Build projects
- Revise more effectively

The long-term goal is not simply to build another AI chatbot, but a **complete AI workspace for learning and knowledge work**.

---

# 🚀 Current Features

## 🔐 Authentication

- User registration
- User login
- Argon2 password hashing
- JWT authentication
- Protected backend routes
- Authenticated frontend sessions

## 🏢 Workspaces

- Create workspaces
- View workspaces
- Workspace-specific navigation
- Workspace membership
- Workspace-level data isolation
- Direct workspace switching

## 📝 Notes

- Create notes
- View notes
- Update notes
- Delete notes
- Workspace-specific notes

## 💬 AI Chat

- Create multiple chats per workspace
- Persistent conversation history
- User message persistence
- AI response persistence
- Markdown AI response rendering
- Local LLM inference
- FastAPI AI service
- Ollama integration
- Llama 3.2 support

## 🎨 Frontend

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Lucide icons
- Responsive workspace interface
- Dark-mode-first design
- Loading and error states

---

# 🧠 Architecture

```text
                           USER
                            │
                            ▼
                  ┌───────────────────┐
                  │   React Frontend  │
                  │ TypeScript + Vite │
                  └─────────┬─────────┘
                            │
                         REST API
                            │
                            ▼
                  ┌───────────────────┐
                  │    Express API    │
                  │     Node.js       │
                  └───────┬─────┬─────┘
                          │     │
                     Database   │ AI Request
                          │     │
                          ▼     ▼
                  ┌──────────┐ ┌──────────────┐
                  │PostgreSQL│ │FastAPI AI    │
                  │ + Drizzle│ │Service       │
                  └──────────┘ └──────┬───────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │   Ollama    │
                               │  Llama 3.2  │
                               └─────────────┘
```

---

# 🤖 AI Request Flow

```text
User enters message
        │
        ▼
React Chat UI
        │
        ▼
Express API
        │
        ├── Validate request
        ├── Verify workspace membership
        └── Save user message
                │
                ▼
          FastAPI AI Service
                │
                ▼
              Ollama
                │
                ▼
            Llama 3.2
                │
                ▼
          AI generated response
                │
                ▼
          Express API
                │
                ├── Save assistant message
                │
                ▼
            React UI
```

---

# 📚 Planned RAG Architecture

```text
             PDF / Document
                    │
                    ▼
              File Upload
                    │
                    ▼
             Text Extraction
                    │
                    ▼
                Chunking
                    │
                    ▼
              Embeddings
                    │
                    ▼
               ChromaDB
                    │
                    │
User Question ──────┘
        │
        ▼
Semantic Retrieval
        │
        ▼
Relevant Document Context
        │
        ▼
       Llama
        │
        ▼
Context-aware Answer
```

This will allow users to upload study material and ask questions about their own documents.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Frontend tooling |
| React Router | Application routing |
| TanStack Query | Server state management |
| Axios | API communication |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Markdown | Markdown rendering |
| remark-gfm | GitHub-Flavored Markdown |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | REST API |
| TypeScript | Type safety |
| Drizzle ORM | Database access |
| PostgreSQL | Relational database |
| Zod | Request validation |
| Argon2 | Password hashing |
| JWT | Authentication |
| Axios | AI service communication |

## AI Service

| Technology | Purpose |
|---|---|
| Python | AI service runtime |
| FastAPI | AI API |
| HTTPX | Ollama communication |
| Ollama | Local LLM runtime |
| Llama 3.2 | Language model |

## Planned AI Infrastructure

| Technology | Purpose |
|---|---|
| ChromaDB | Vector database |
| Embeddings | Semantic search |
| RAG | Document-aware generation |
| Docker | Containerization |

---

# 🗂️ Project Structure

```text
studxo/
│
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── features/
│   │       ├── routes/
│   │       ├── services/
│   │       └── lib/
│   │
│   ├── api/
│   │   └── src/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── db/
│   │       ├── middleware/
│   │       ├── routes/
│   │       ├── schemas/
│   │       └── services/
│   │
│   └── ai/
│       ├── app/
│       │   ├── routes/
│       │   └── services/
│       ├── requirements.txt
│       └── .env.example
│
├── docs/
│   ├── architecture.md
│   ├── api-design.md
│   ├── database-design.md
│   ├── roadmap.md
│   ├── ui-design.md
│   ├── requirements.md
│   └── decisions.md
│
├── assets/
├── scripts/
├── docker/
├── .github/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── README.md
└── LICENSE
```

---

# 🗃️ Database Design

Stud.xo uses PostgreSQL with UUID-based primary keys.

```text
User
│
└── Workspace
     │
     ├── Workspace Members
     │
     ├── Chats
     │    └── Messages
     │
     ├── Notes
     │
     ├── Documents
     │
     ├── Memories
     │
     └── Tags
```

## Current Tables

```text
users
workspaces
workspace_members
notes
chats
messages
```

## Planned Tables

```text
documents
memories
tags
```

---

# 🌐 API Design

The backend uses REST APIs.

```text
/api/auth
/api/users
/api/workspaces
/api/workspaces/:workspaceId/chats
/api/workspaces/:workspaceId/documents
/api/workspaces/:workspaceId/notes
/api/workspaces/:workspaceId/research
/api/workspaces/:workspaceId/memories
/api/ai
```

---

# 🔒 Security

Current security mechanisms include:

- JWT authentication
- Argon2 password hashing
- Protected API routes
- Workspace membership verification
- Workspace-scoped database queries
- Zod request validation
- Environment variables for secrets
- `.env` files excluded from Git

Workspace isolation is enforced by the backend and is not dependent only on frontend routing.

---

# 🏢 Workspace Model

Workspace isolation is a core architectural decision.

```text
User
 │
 ├── Workspace A
 │    ├── Chats
 │    ├── Notes
 │    ├── Documents
 │    └── Memory
 │
 └── Workspace B
      ├── Chats
      ├── Notes
      ├── Documents
      └── Memory
```

Workspaces can represent:

- College subjects
- Personal learning
- Software projects
- Research
- Exam preparation
- Different courses

---

# 🖥️ Workspace Routes

```text
/dashboard

/workspaces/:workspaceId/chat
/workspaces/:workspaceId/documents
/workspaces/:workspaceId/notes
/workspaces/:workspaceId/research
```

The `workspaceId` in the URL is the source of truth for the active workspace.

---

# ⚙️ Getting Started

## Prerequisites

Install:

- Node.js
- pnpm
- PostgreSQL
- Python 3.10+
- Ollama
- Git

Verify:

```bash
node --version
pnpm --version
python --version
ollama --version
```

## Installation

```bash
git clone <your-repository-url>
cd studxo
pnpm install
```

---

# 🔑 Environment Variables

Create these files locally:

```text
apps/api/.env
apps/web/.env
apps/ai/.env
```

## API

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
```

## Frontend

```env
VITE_API_URL=http://localhost:4000/api
```

## AI Service

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
AI_SERVICE_PORT=8000
```

Never commit real `.env` files.

---

# 🐍 AI Service Setup

```bash
cd apps/ai
python -m venv .venv
```

### Windows

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Health endpoint:

```text
GET /health
```

---

# 🦙 Ollama Setup

Check installed models:

```bash
ollama list
```

Pull Llama 3.2 if required:

```bash
ollama pull llama3.2
```

Run the model:

```bash
ollama run llama3.2
```

Ollama normally runs at:

```text
http://localhost:11434
```

---

# 🟢 Start Express API

```bash
cd apps/api
pnpm dev
```

The API currently runs at:

```text
http://localhost:4000
```

---

# 🌐 Start Frontend

```bash
cd apps/web
pnpm dev
```

Open the Vite development URL shown in the terminal.

---

# 🧪 AI Pipeline

The current AI pipeline can be tested through:

```text
POST /api/workspaces/:workspaceId/chats/:chatId/messages
```

Example request:

```json
{
  "content": "Explain convolutional neural networks in simple terms."
}
```

The backend:

1. Validates the request.
2. Checks workspace membership.
3. Saves the user message.
4. Sends the message to FastAPI.
5. FastAPI calls Ollama.
6. Llama 3.2 generates the response.
7. Express saves the assistant response.
8. Both messages are returned to the client.

---

# 🗺️ Roadmap

## Phase 1 — Foundation

- [x] Monorepo setup
- [x] React frontend
- [x] Express backend
- [x] PostgreSQL
- [x] Authentication
- [x] JWT middleware
- [x] Workspace management
- [x] Workspace membership

## Phase 2 — Learning Workspace

- [x] Notes
- [x] Chat schema
- [x] Message schema
- [x] Chat API
- [x] Chat frontend
- [x] Message persistence
- [x] FastAPI AI service
- [x] Ollama integration
- [x] Llama 3.2 integration
- [x] Express → FastAPI AI pipeline
- [x] Markdown AI responses
- [ ] Streaming responses

## Phase 3 — Document Intelligence

- [ ] Document schema
- [ ] File upload
- [ ] PDF processing
- [ ] Text extraction
- [ ] Text chunking
- [ ] Embeddings
- [ ] ChromaDB
- [ ] Semantic search
- [ ] RAG pipeline
- [ ] Document Q&A
- [ ] Document summaries

## Phase 4 — AI Learning System

- [ ] AI Memory
- [ ] Context-aware conversations
- [ ] AI-generated notes
- [ ] Learning assistance
- [ ] Document-aware conversations
- [ ] Research Assistant

## Phase 5 — Advanced Platform

- [ ] Collaboration
- [ ] Tasks
- [ ] Notifications
- [ ] Voice interaction
- [ ] Mobile application
- [ ] Advanced AI agents

---

# 📈 Current Status

| Feature | Status |
|---|---|
| Authentication | ✅ Working |
| Workspaces | ✅ Working |
| Workspace isolation | ✅ Working |
| Notes | ✅ Working |
| Chat creation | ✅ Working |
| Message persistence | ✅ Working |
| Chat frontend | ✅ Working |
| FastAPI AI service | ✅ Working |
| Ollama | ✅ Working |
| Llama 3.2 | ✅ Working |
| Express → FastAPI | ✅ Working |
| AI response persistence | ✅ Working |
| Markdown responses | ✅ Working |
| Document RAG | 🚧 Next |

---

# 🎯 Development Principles

### Modular

Features should remain independently maintainable.

### Secure

Authentication and authorization are enforced server-side.

### Workspace-first

Learning content belongs to a workspace rather than existing as unrelated global resources.

### AI as a Service

AI functionality is isolated from the main API so models and AI infrastructure can evolve independently.

### Type-safe

TypeScript is used throughout the frontend and backend wherever appropriate.

### Scalable

The architecture is designed so new AI capabilities can be added without rewriting the core application.

---

# 📖 Documentation

Technical documentation is maintained in:

```text
docs/
├── architecture.md
├── api-design.md
├── database-design.md
├── roadmap.md
├── ui-design.md
├── requirements.md
└── decisions.md
```

---

# 🤝 Contributing

Stud.xo is currently under active development.

When adding a feature:

1. Understand the existing architecture.
2. Create a feature branch.
3. Keep frontend, backend, and AI responsibilities separated.
4. Validate API input.
5. Enforce workspace authorization.
6. Test locally.
7. Update documentation when necessary.
8. Commit with a meaningful message.

Example:

```bash
git checkout -b feat/document-rag
```

---

# 📜 License

This project is licensed under the terms specified in the `LICENSE` file.

---

# 🌟 Stud.xo

**AI Workspace**

### Free Learning for Everyone.

The vision is to build a complete AI environment where students and self-learners can bring together:

```text
                 STUD.XO
                    │
        ┌───────────┼───────────┐
        │           │           │
       Chat       Notes      Documents
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
                AI Memory
                    │
                    ▼
             Research Assistant
                    │
                    ▼
            Personalized Learning
```

**Learn. Organize. Research. Build.**
