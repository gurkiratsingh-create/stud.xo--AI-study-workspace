# API Design

> Project: **Stud.xo**
>
> Version: **1.0**
>
> Status: Draft

---

# Overview

Stud.xo follows a **RESTful API architecture**.

The backend is responsible for:

- Authentication & Authorization
- Business Logic
- Database Operations
- AI Service Orchestration
- File Management

The frontend communicates **only** through the API layer.

---

# API Architecture

```text
React Client
      │
      ▼
Express REST API
      │
 ┌────┴─────────────┐
 │                  │
 ▼                  ▼
PostgreSQL      FastAPI AI Service
```

The Express server acts as the primary backend service while the AI Service handles AI-specific processing such as chat completion, code explanation, document understanding, and memory generation.

---

# API Base URL

```
/api
```

Example:

```
http://localhost:5000/api
```

---

# Response Format

Every endpoint returns a standardized JSON response.

## Success Response

```json
{
    "success": true,
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "error": {
        "code": "RESOURCE_NOT_FOUND",
        "message": "Requested resource does not exist."
    }
}
```

---

# Authentication

Authentication is based on **JWT (JSON Web Tokens)**.

Protected endpoints require:

```
Authorization: Bearer <access_token>
```

---

# API Modules

```
/api
│
├── auth
├── users
├── workspaces
├── chats
├── messages
├── documents
├── notes
├── memories
├── dashboard
└── ai
```

---

# Authentication APIs

## Register

```
POST /api/auth/register
```

Creates a new user account.

---

## Login

```
POST /api/auth/login
```

Authenticates a user and returns access tokens.

---

## Logout

```
POST /api/auth/logout
```

Logs out the current user.

---

## Refresh Token

```
POST /api/auth/refresh-token
```

Issues a new access token.

---

## Current User

```
GET /api/auth/me
```

Returns the authenticated user's profile.

---

## Update Profile

```
PATCH /api/auth/profile
```

Updates profile information.

---

## Change Password

```
PATCH /api/auth/password
```

Updates the user's password.

---

# User APIs

## Get User Profile

```
GET /api/users/:id
```

---

## Delete User

```
DELETE /api/users/:id
```

---

# Workspace APIs

## Get All Workspaces

```
GET /api/workspaces
```

---

## Get Workspace

```
GET /api/workspaces/:id
```

---

## Create Workspace

```
POST /api/workspaces
```

---

## Update Workspace

```
PATCH /api/workspaces/:id
```

---

## Delete Workspace

```
DELETE /api/workspaces/:id
```

---

# Chat APIs

## Get Chats

```
GET /api/chats
```

---

## Get Chat

```
GET /api/chats/:id
```

---

## Create Chat

```
POST /api/chats
```

---

## Rename Chat

```
PATCH /api/chats/:id
```

---

## Delete Chat

```
DELETE /api/chats/:id
```

---

# Message APIs

Messages always belong to a chat.

## Get Messages

```
GET /api/chats/:chatId/messages
```

---

## Send Message

```
POST /api/chats/:chatId/messages
```

---

## Delete Message

```
DELETE /api/chats/:chatId/messages/:messageId
```

---

## Regenerate AI Response

```
POST /api/chats/:chatId/regenerate
```

---

# Document APIs

## Get Documents

```
GET /api/documents
```

---

## Upload Document

```
POST /api/documents/upload
```

---

## Get Document

```
GET /api/documents/:id
```

---

## Delete Document

```
DELETE /api/documents/:id
```

---

## Ask Questions About a Document

```
POST /api/documents/:id/query
```

Returns an AI-generated answer based on the uploaded document.

---

# Note APIs

## Get Notes

```
GET /api/notes
```

---

## Create Note

```
POST /api/notes
```

---

## Update Note

```
PATCH /api/notes/:id
```

---

## Delete Note

```
DELETE /api/notes/:id
```

---

# Memory APIs

## Get Memories

```
GET /api/memories
```

---

## Create Memory

```
POST /api/memories
```

---

## Update Memory

```
PATCH /api/memories/:id
```

---

## Delete Memory

```
DELETE /api/memories/:id
```

---

# Dashboard APIs

## Dashboard Summary

```
GET /api/dashboard
```

Returns statistics for the authenticated user.

Example:

```json
{
    "workspaces": 5,
    "documents": 18,
    "notes": 42,
    "chats": 23,
    "messages": 640
}
```

---

# AI APIs

The Express server communicates with the dedicated FastAPI AI Service through these endpoints.

## AI Chat

```
POST /api/ai/chat
```

---

## Summarize Text

```
POST /api/ai/summarize
```

---

## Explain Code

```
POST /api/ai/explain-code
```

---

## Research Assistant

```
POST /api/ai/research
```

---

## AI Memory Processing

```
POST /api/ai/memory
```

---

## Document Question Answering

```
POST /api/ai/document-query
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# API Design Principles

- RESTful resource-based endpoints
- Consistent request and response structure
- JWT-based authentication
- Modular route organization
- Proper HTTP status codes
- Clear error messages
- Separation of backend and AI service responsibilities
- Version-ready architecture for future expansion

---

# Future API Modules (Version 2)

The following APIs are planned for future releases:

- `/api/projects`
- `/api/tasks`
- `/api/folders`
- `/api/tags`
- `/api/search`
- `/api/activity`
- `/api/notifications`
- `/api/integrations`
- `/api/team`
- `/api/agents`
- `/api/admin`

---

# API Development Goals

- Simple to understand
- Easy to maintain
- Scalable architecture
- Secure by default
- Consistent naming conventions
- Frontend-friendly responses
- Optimized for AI-powered workflows