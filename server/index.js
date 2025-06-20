// // const express = require('express');
// // const http = require('http');
// // const { Server } = require('socket.io');
// // const cors = require('cors');

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: 'http://localhost:5174',
// //     methods: ['GET', 'POST']
// //   }
// // });

// // app.use(cors());
// // app.use(express.json());

// // let currentPoll = null;
// // let studentAnswers = {};
// // let students = new Set();

// // io.on('connection', (socket) => {
// //   console.log('New client connected');

// //   socket.on('student_join', ({ name }) => {
// //     students.add(name);
// //   });

// //   socket.on('create_poll', ({ question, options }) => {
// //     currentPoll = {
// //       question,
// //       options,
// //       votes: Array(options.length).fill(0),
// //       totalStudents: students.size
// //     };
// //     studentAnswers = {};
// //     io.emit('new_poll', currentPoll);

// //     // Timeout after 60s
// //     setTimeout(() => {
// //       if (Object.keys(studentAnswers).length < currentPoll.totalStudents) {
// //         io.emit('poll_results', currentPoll);
// //       }
// //     }, 60000);
// //   });

// //   socket.on('submit_answer', ({ name, answer }) => {
// //     if (!currentPoll || studentAnswers[name]) return;
// //     const index = currentPoll.options.indexOf(answer);
// //     if (index !== -1) {
// //       currentPoll.votes[index] += 1;
// //       studentAnswers[name] = true;
// //     }
// //     if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
// //       io.emit('poll_results', currentPoll);
// //     }
// //   });

// //   socket.on('timeout', ({ name }) => {
// //     if (!studentAnswers[name]) {
// //       studentAnswers[name] = true;
// //     }
// //     if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
// //       io.emit('poll_results', currentPoll);
// //     }
// //   });

// //   socket.on('disconnect', () => {
// //     console.log('Client disconnected');
// //   });
// // });

// // app.get('/', (req, res) => {
// //   res.send('Polling server is running');
// // });

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5174',
//     methods: ['GET', 'POST']
//   }
// });

// app.use(cors());
// app.use(express.json());

// let currentPoll = null;
// let studentAnswers = {};
// let students = {};

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('student_join', ({ name }) => {
//     students[socket.id] = name;

//     // Send updated list to teachers
//     io.emit('update_students', Object.values(students));
//   });

//   socket.on('create_poll', ({ question, options }) => {
//     currentPoll = {
//       question,
//       options,
//       votes: Array(options.length).fill(0),
//       totalStudents: Object.keys(students).length
//     };
//     studentAnswers = {};
//     io.emit('new_poll', currentPoll);

//     // Timeout after 60s
//     setTimeout(() => {
//       if (Object.keys(studentAnswers).length < currentPoll.totalStudents) {
//         io.emit('poll_results', currentPoll);
//       }
//     }, 60000);
//   });

//   socket.on('submit_answer', ({ name, answer }) => {
//     if (!currentPoll || studentAnswers[name]) return;
//     const index = currentPoll.options.indexOf(answer);
//     if (index !== -1) {
//       currentPoll.votes[index] += 1;
//       studentAnswers[name] = true;
//     }
//     if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
//       io.emit('poll_results', currentPoll);
//     }
//   });

//   socket.on('timeout', ({ name }) => {
//     if (!studentAnswers[name]) {
//       studentAnswers[name] = true;
//     }
//     if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
//       io.emit('poll_results', currentPoll);
//     }
//   });

//   socket.on('kick_student', ({ name }) => {
//     const idToKick = Object.keys(students).find(id => students[id] === name);
//     if (idToKick) {
//       io.to(idToKick).emit('kicked');
//       delete students[idToKick];
//       io.emit('update_students', Object.values(students));
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     delete students[socket.id];
//     io.emit('update_students', Object.values(students));
//   });
// });

// app.get('/', (req, res) => {
//   res.send('Polling server is running');
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5174', // Update if needed
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let currentPoll = null;
let studentAnswers = {};
let students = {}; // socket.id => name

io.on('connection', (socket) => {
  console.log('New client connected');

  // 1. Track student join
  socket.on('student_join', ({ name }) => {
    students[socket.id] = name;
    io.emit('update_students', Object.values(students));
  });

  // 2. Create poll
  socket.on('create_poll', ({ question, options }) => {
    currentPoll = {
      question,
      options,
      votes: Array(options.length).fill(0),
      totalStudents: Object.keys(students).length
    };
    studentAnswers = {};
    io.emit('new_poll', currentPoll);

    // timeout fallback (60s)
    setTimeout(() => {
      if (Object.keys(studentAnswers).length < currentPoll.totalStudents) {
        io.emit('poll_results', currentPoll);
      }
    }, 60000);
  });

  // 3. Submit answer
  socket.on('submit_answer', ({ name, answer }) => {
    if (!currentPoll || studentAnswers[name]) return;
    const index = currentPoll.options.indexOf(answer);
    if (index !== -1) {
      currentPoll.votes[index] += 1;
      studentAnswers[name] = true;
    }
    if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
      io.emit('poll_results', currentPoll);
    }
  });

  // 4. Handle timeout
  socket.on('timeout', ({ name }) => {
    if (!studentAnswers[name]) {
      studentAnswers[name] = true;
    }
    if (Object.keys(studentAnswers).length === currentPoll.totalStudents) {
      io.emit('poll_results', currentPoll);
    }
  });

  // 5. Kick student
  socket.on('kick_student', ({ name }) => {
    const idToKick = Object.keys(students).find(id => students[id] === name);
    if (idToKick) {
      io.to(idToKick).emit('kicked');
      delete students[idToKick];
      io.emit('update_students', Object.values(students));
    }
  });

  // 6. Chat messages
  socket.on('chat_message', ({ name, message }) => {
    io.emit('chat_message', { name, message });
  });

  // 7. Disconnect cleanup
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    delete students[socket.id];
    io.emit('update_students', Object.values(students));
  });
});

// Basic server check
app.get('/', (req, res) => {
  res.send('Polling server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
