# Real-Time Chat Application with Next.js and Express

A full-stack real-time chat application that enables users to communicate through individual and group conversations with secure authentication and file sharing capabilities.

The application combines a Next.js frontend for a responsive user interface with an Express.js backend for real-time message handling using Socket.IO. It features user authentication with JWT tokens, persistent message storage in MongoDB, and support for file attachments and avatars.

## Repository Structure
```
.
├── backend/                      # Express.js server application
│   ├── config/                   # Database configuration
│   ├── middleware/              # Authentication middleware
│   ├── models/                  # MongoDB schemas (User, Message, Conversation)
│   ├── routes/                  # API routes for auth and chat
│   └── server.js               # Main server entry point with Socket.IO setup
├── frontend/                    # Next.js client application
│   ├── src/
│   │   └── app/
│   │       ├── components/     # React components for chat interface
│   │       ├── utils/         # Socket.IO client setup
│   │       └── chat/         # Chat room pages and routing
│   └── Dockerfile            # Frontend container configuration
├── docker-compose.yaml       # Multi-container orchestration
└── README.MD
```

## Usage Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18 or later
- MongoDB (if running locally without Docker)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-time-chat
```

2. Using Docker (recommended):
```bash
docker-compose up --build
```

3. Manual installation:

Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Quick Start

1. Access the application at `http://localhost:3000`
2. Register a new account or login with existing credentials
3. Start a new conversation by selecting a user or creating a group
4. Begin sending messages in real-time

### More Detailed Examples

1. Creating a group conversation:
```typescript
// Frontend component example
const createGroup = async (name: string, users: string[]) => {
  const response = await fetch('/api/chat/group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, users })
  });
  return response.json();
};
```

2. Sending messages with attachments:
```typescript
const sendMessageWithAttachment = (conversationId: string, text: string, file: File) => {
  const formData = new FormData();
  formData.append('text', text);
  formData.append('attachment', file);
  socket.emit('send_message', {
    conversationId,
    text,
    attachments: [file.name]
  });
};
```

### Troubleshooting

1. Connection Issues
- Problem: Unable to connect to WebSocket server
- Solution: 
```bash
# Check if backend is running
docker ps | grep backend
# Check backend logs
docker logs backend
```

2. Authentication Errors
- Problem: "Unauthorized" error when accessing chat
- Solution: Verify token in localStorage and check expiration:
```javascript
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expiration:', new Date(payload.exp * 1000));
```

## Data Flow

The application uses WebSocket connections for real-time message delivery while maintaining message persistence in MongoDB.

```ascii
Client (Next.js) ←→ WebSocket (Socket.IO) ←→ Server (Express)
     ↑                                           ↑
     |                                           ↓
     └─────────── REST API ──────────────→ MongoDB
```

Key component interactions:
1. Client establishes WebSocket connection on login
2. Messages are sent through Socket.IO events
3. Server validates messages and broadcasts to conversation participants
4. Messages are persisted to MongoDB for history
5. REST API handles user authentication and conversation management
6. File uploads are processed through multipart form data
7. Real-time events trigger UI updates through React state

## Infrastructure

![Infrastructure diagram](./docs/infra.svg)

### MongoDB
- Type: Container
- Image: mongo:6
- Ports: 27017:27017
- Volumes: mongodb_data for persistence

### Backend Service
- Type: Container
- Base: Node.js 18 Alpine
- Ports: 5000:5000
- Dependencies: MongoDB
- Environment Variables:
  - MONGO_URI: MongoDB connection string

### Frontend Service
- Type: Container
- Base: Node.js 18 Alpine
- Ports: 3000:3000
- Dependencies: Backend service
- Environment Variables:
  - API_URL: Backend service URL

## Deployment

Prerequisites:
- Docker and Docker Compose installed
- Available ports: 3000, 5000, 27017

Deployment steps:
1. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

2. Build and start containers:
```bash
docker-compose up -d
```

3. Monitor deployment:
```bash
docker-compose logs -f
```