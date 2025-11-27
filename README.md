# -Backend-System-for-a-Virtual-Event-Management-Platform📌 Virtual Event Management Backend (In-Memory Storage)

This project is a Node.js + Express.js backend for a Virtual Event Management Platform.
It supports user authentication, event management, and participant registration, all stored using in-memory data structures.

The system uses:

bcrypt for password hashing

JWT for authentication

Nodemailer + Ethereal for email notifications

Jest + Supertest for testing

🚀 Features
🔐 User Authentication

Register new users (organizer / attendee)

Login with JWT-based authentication

Passwords securely hashed using bcrypt

🎫 Event Management (Organizer only)

Create events

Update events

Delete events

View all events

Each event stores:

Title

Date

Time

Description

Organizer ID

Participant list

👥 Participant Management

Attendees can register for events

Email sent on successful registration (via Ethereal test SMTP)

🧪 Testing

Full API testing using Jest + Supertest

Auth tests

Event CRUD tests

Registration tests

📁 Project Structure
project/
 ├── src/
 │   ├── app.js
 │   ├── routes/
 │   ├── controllers/
 │   ├── middlewares/
 │   ├── services/
 │   ├── data/
 ├── tests/
 ├── package.json
 ├── README.md

🔧 Installation & Setup
1️⃣ Install dependencies
npm install


If you face a supertest version error, use:

npm install supertest@6.3.3 --save-dev

2️⃣ Start the server
npm run dev


Server runs at:

http://localhost:3000

🔐 Authentication Flow

User registers → password hashed

User logs in → receives JWT token

Token must be sent in Authorization header:

Authorization: Bearer <JWT_TOKEN>

📌 API Endpoints
👤 Authentication
POST /api/register

Registers a new user.

POST /api/login

Returns a JWT token.

🎫 Events
GET /api/events

Public — View all events.

POST /api/events (Organizer only)

Create a new event.

PUT /api/events/:id (Organizer only)

Update event details.

DELETE /api/events/:id (Organizer only)

Delete an event.

👥 Participants
POST /api/events/:id/register (Attendee only)

Register for an event.
Triggers email notification.

📧 Email Sending (Nodemailer + Ethereal)

No SMTP configuration is required.

If no SMTP credentials are found, the app auto-creates a test inbox using Ethereal.

After registration, check your terminal output:

Preview URL: https://ethereal.email/message/abc123


Click the link to view the email.

🧪 Running Tests
npm run test


Tests included:

User registration & login

Event CRUD

Event registration workflow

All tests should pass before submission.

