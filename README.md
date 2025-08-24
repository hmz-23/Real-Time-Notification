Real-Time Notifications App

This is a simple web application built with Node.js, Express, and Socket.io to demonstrate a real-time notification system. The app simulates an issue tracker where users can view issues and add comments, with new comments being instantly broadcast to all active users on the same issue page.

Key Features
Real-Time Comments: Instantly push new comments to all clients without needing to refresh the page.

Simple API: Provides a RESTful API to manage and retrieve issues and their comments.

Client-Side Reconnect: The Socket.io client automatically attempts to reconnect if the server connection is lost.

Modular Project Structure: Separates the frontend (index.html) from the backend server logic (app.js).

Prerequisites
To run this application, you need to have the following installed on your machine:

Node.js (LTS version recommended)

npm (Node Package Manager), which is included with Node.js

Installation
Follow these steps to get the project running on your local machine.

Clone the repository or download the project files.

Navigate to the root directory of the project in your terminal.

Initialize the project and install dependencies by running the following commands:

First, initialize a package.json file.

npm init -y

Then, install the required packages: express and socket.io.

npm install express socket.io

Running the App
Ensure you have the app.js file and the public folder (containing index.html) in the same directory.

To start the server, run this command in your terminal:

node app.js

Once the server is running, you will see a confirmation message in the terminal. Open your web browser and navigate to http://localhost:3000.

Project Structure
app.js: This is the backend server file. It handles the API routes, serves the static frontend files, and manages the real-time WebSocket connections with Socket.io.

public/index.html: This is the frontend file that contains all the HTML, CSS, and JavaScript for the user interface.

API Endpoints
The server provides the following endpoints:

GET /health: A simple health check to verify the server is running.

GET /issues: Returns a list of all available issues.

GET /issues/:issueId: Returns a single issue and its comments by ID.

POST /issues/:issueId/comments: Adds a new comment to a specified issue.

Real-Time Functionality
This application uses Socket.io to enable real-time communication.

When a client opens an issue page, it "joins" a WebSocket room for that specific issue.

When a new comment is posted via the POST /issues/:issueId/comments endpoint, the server broadcasts the new comment data to all clients in that issue's room.

Clients receive the newComment event and instantly render the comment on the page, creating a dynamic, real-time experience.
