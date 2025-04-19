const http = require('http');
const fs = require('fs');
const url = require('url');
const EventEmitter = require('events');

const port = 3000;
const logEmitter = new EventEmitter();

// Logging setup
logEmitter.on('log', (message) => {
    const log = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile('logs.txt', log, (err) => {
        if (err) throw err;
    });
});

// Read todos
function getTodos(callback) {
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) throw err;
        callback(JSON.parse(data));
    });
}

// Save todos
function saveTodos(todos, callback) {
    fs.writeFile('todos.json', JSON.stringify(todos, null, 2), (err) => {
        if (err) throw err;
        callback();
    });
}

// Get request body
function getBody(req, callback) {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => callback(JSON.parse(body || '{}')));
}

// HTTP Server
const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    logEmitter.emit('log', `${method} ${parsed.pathname}`);

    // GET /todos or /todos/:id
    if (method === 'GET' && pathParts[0] === 'todos') {
        getTodos((todos) => {
            if (pathParts.length === 1) {
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify(todos));
            } else {
                const id = parseInt(pathParts[1]);
                const todo = todos.find(t => t.id === id);
                if (todo) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(todo));
                } else {
                    res.writeHead(404);
                    res.end('Todo not found');
                }
            }
        });
    }

    // POST /todos
    else if (method === 'POST' && pathParts[0] === 'todos') {
        getBody(req, (body) => {
            if (!body.title) {
                res.writeHead(400);
                return res.end('Title is required');
            }

            getTodos((todos) => {
                const newTodo = {
                    id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
                    title: body.title,
                    completed: body.completed || false,
                };
                todos.push(newTodo);
                saveTodos(todos, () => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newTodo));
                });
            });
        });
    }

    // PUT /todos/:id
    else if (method === 'PUT' && pathParts[0] === 'todos' && pathParts[1]) {
        const id = parseInt(pathParts[1]);
        getBody(req, (body) => {
            getTodos((todos) => {
                const index = todos.findIndex(t => t.id === id);
                if (index === -1) {
                    res.writeHead(404);
                    return res.end('Todo not found');
                }
                todos[index].title = body.title || todos[index].title;
                todos[index].completed = body.completed ?? todos[index].completed;

                saveTodos(todos, () => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(todos[index]));
                });
            });
        });
    }

    // DELETE /todos/:id
    else if (method === 'DELETE' && pathParts[0] === 'todos' && pathParts[1]) {
        const id = parseInt(pathParts[1]);
        getTodos((todos) => {
            const newTodos = todos.filter(t => t.id !== id);
            if (newTodos.length === todos.length) {
                res.writeHead(404);
                return res.end('Todo not found');
            }

            saveTodos(newTodos, () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Todo deleted' }));
            });
        });
    }

    // Unknown route
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
