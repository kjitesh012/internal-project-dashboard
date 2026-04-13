# Dashboard API Server

Simple Spring Boot REST API for Project Management Dashboard

## Quick Start

### 1. Build the server
```bash
cd server
build.bat
```

### 2. Run the server
```bash
run-server.bat
```

Server will start on `http://localhost:8080`

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project

### Tasks
- `POST /api/projects/{projectId}/tasks` - Create task
- `PUT /api/projects/{projectId}/tasks/{taskId}` - Update task
- `DELETE /api/projects/{projectId}/tasks/{taskId}` - Delete task

## Example API Calls

### Get All Projects
```bash
curl http://localhost:8080/api/projects
```

### Update Project
```bash
curl -X PUT http://localhost:8080/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed","progress":100}'
```

### Add Task
```bash
curl -X POST http://localhost:8080/api/projects/1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","status":"Pending"}'
```

## Sample Data

The server comes pre-loaded with 3 projects and 9 tasks.

## Environment

- Java 17+
- Maven wrapper included
- Port: 8080
- CORS enabled for http://localhost:5173
