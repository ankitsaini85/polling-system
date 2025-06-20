# Live Polling System

A real-time classroom polling system built with React, Vite, Express, and Socket.IO. Teachers can create live polls, students can join, answer questions, and everyone can chat in real-time.

## Features

- **Role Selection:** Choose to join as a Teacher or Student.
- **Teacher Panel:**
  - Create and manage polls with multiple options.
  - View live results and poll history.
  - See and manage the list of student participants (kick students if needed).
  - Real-time chat with students.
- **Student Panel:**
  - Join with your name.
  - Answer live poll questions with a countdown timer.
  - View poll results after submission.
  - Real-time chat with teacher and classmates.
- **Real-time Communication:** Powered by Socket.IO for instant updates.

## Project Structure

```
polling-system/
  polling-client/   # React frontend (Vite)
  server/           # Express + Socket.IO backend
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

#### 1. Start the Server

```sh
cd server
npm install
npm start
```

The server runs on [http://localhost:5000](http://localhost:5000).

#### 2. Start the Client

```sh
cd polling-client
npm install
npm run dev
```

The client runs on [http://localhost:5174](http://localhost:5174) (default Vite port).

> **Note:** Make sure the server is running before starting the client.

## Usage

1. Open the client URL in your browser.
2. Select your role (Teacher or Student).
3. Teachers can create polls; students can join and answer.
4. Use the chat feature for real-time communication.

## Technologies Used

- **Frontend:** React, Vite, Socket.IO Client
- **Backend:** Express, Socket.IO, CORS

## License

MIT

---

Made with ❤️ for interactive