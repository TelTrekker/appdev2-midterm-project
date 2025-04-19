## 📘 Simple Todo API using Node.js Core Modules

This is a lightweight RESTful API built **without any frameworks**, using only **Node.js core modules** like `http`, `fs`, `url`, and `events`.
It supports basic **CRUD operations** (Create, Read, Update, Delete) for managing a list of todos, and saves the data to a local `todos.json` file. 
It also includes **simple logging** via `logs.txt`.

---
## 🚀 Features
- ✅ `GET /todos` – Get all todos  
- ✅ `GET /todos/:id` – Get a single todo by ID  
- ✅ `POST /todos` – Create a new todo (requires `title`)  
- ✅ `PUT /todos/:id` – Update a todo’s title or status  
- ✅ `DELETE /todos/:id` – Delete a todo by ID  
- 🗃️ Data stored in `todos.json`  
- 📄 Request logs written to `logs.txt` via EventEmitter
---

## 📁 File Overview
- `server.js` – Main server logic  
- `todos.json` – Stores todo items (created automatically)  
- `logs.txt` – Logs request method and endpoint with timestamps  
---

## 🔧 Tech Used
- Node.js (No frameworks)
  - `http` – for server setup
  - `fs` – for file system read/write
  - `url` – to parse request URLs
  - `events` – to log requests
---

## 🧪 Testing
You can test the endpoints using:

### Thunder Client / Postman:

- **GET**: `http://localhost:3000/todos`
- **POST**: Add a todo with JSON body:
```json
{
  "title": "Finish project",
  "completed": false
}
```
- **PUT**: Update a todo:
```json
{
  "title": "Updated task",
  "completed": true
}
```
- **DELETE**: `http://localhost:3000/todos/1`

### Or using curl:
```bash
curl http://localhost:3000/todos
curl http://localhost:3000/todos/1
curl -X POST -H "Content-Type: application/json" -d '{"title":"Study"}' http://localhost:3000/todos
curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/todos/1
curl -X DELETE http://localhost:3000/todos/1
```
---

## ⚠️ Notes

- If `todos.json` doesn't exist, you'll need to create a list in an empty array manually `[]`.
- All requests are logged automatically to what so called "log Book" `logs.txt` with timestamps.
- The server listens on `http://localhost:3000`.
  
---

## 📚 Why This Project?

This project aims to understand the following:
- How HTTP servers work under the hood
- Handling Route Structure manually
- Handling file I/O in Node.js
- Create a logging without external libraries

## 🎬 [Video Wrap Up - ]
---
