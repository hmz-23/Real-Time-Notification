const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// --- Express & Socket.io Server Setup ---

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
// Serves the index.html file and other static assets.
app.use(express.static(path.join(__dirname, 'public')));

// --- In-Memory "Database" for Issues and Comments ---
// In a production app, you would use a real database like PostgreSQL or MongoDB.
const issues = {
    'issue-1': {
        'id': 'issue-1',
        'title': 'Bug in the login form',
        'description': 'The login button is not clickable on mobile devices.',
        'comments': [],
    },
    'issue-2': {
        'id': 'issue-2',
        'title': 'New feature request: Dark Mode',
        'description': 'Users want a dark theme for better visibility at night.',
        'comments': [],
    }
};

// --- Backend API Endpoints ---

app.get('/health', (req, res) => {
    /**
     * A simple health check endpoint.
     * Returns 200 OK if the server is running.
     */
    res.json({ status: 'ok' });
});

app.get('/issues', (req, res) => {
    /**
     * Returns a list of all issues.
     */
    res.json(Object.values(issues));
});

app.get('/issues/:issueId', (req, res) => {
    /**
     * Returns a single issue by its ID.
     */
    const issue = issues[req.params.issueId];
    if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
});

app.post('/issues/:issueId/comments', (req, res) => {
    /**
     * Adds a new comment to an issue and broadcasts it via WebSocket.
     */
    const issue = issues[req.params.issueId];
    if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
    }

    const commentText = req.body.comment;
    if (!commentText) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = {
        id: new Date().getTime(),
        author: 'Anonymous',
        text: commentText,
        timestamp: Date.now(),
    };
    issue.comments.push(comment);

    // Broadcast the new comment to all clients listening for this issue's room
    io.to(req.params.issueId).emit('newComment', comment);

    res.status(201).json(comment);
});

// --- Socket.io Connection Logic ---

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Join the specified issue "room" when the client requests it
    socket.on('joinIssue', (issueId) => {
        socket.join(issueId);
        console.log(`User ${socket.id} joined room: ${issueId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// --- Start the server ---
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
