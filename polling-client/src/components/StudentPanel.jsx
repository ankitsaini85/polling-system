import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './StudentPanel.css';
import ChatBox from './ChatBox';

const socket = io('https://polling-system-wkyf.onrender.com');

const StudentPanel = () => {
  const [name, setName] = useState(sessionStorage.getItem('studentName') || '');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    if (name) {
      socket.emit('student_join', { name });
    }

    socket.on('new_poll', (data) => {
      setQuestion(data);
      setAnswer(null);
      setResults(null);
      setTimer(60);
    });

    socket.on('poll_results', (data) => {
      setResults(data);
    });

    socket.on('kicked', () => {
      setKicked(true);
      setQuestion(null);
      setResults(null);
      setTimer(0);
    });
  }, [name]);

  useEffect(() => {
    if (question && timer > 0 && answer === null) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !results) {
      socket.emit('timeout', { name });
    }
  }, [question, timer, answer]);

  const submitAnswer = () => {
    if (answer !== null) {
      socket.emit('submit_answer', { name, answer });
    }
  };

  if (!sessionStorage.getItem('studentName')) {
    return (
      <div className="student-wrapper">
        <div className="student-content">
          <span className="badge">Intervue Poll</span>
          <h1 className="title">Let’s Get Started</h1>
          <p className="subtitle">You’ll be able to submit your answers, participate in live polls, and compare your responses with your classmates.</p>
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            className="continue-btn"
            onClick={() => {
              sessionStorage.setItem('studentName', name);
              window.location.reload();
            }}
            disabled={!name.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (kicked) {
    return (
      <div className="student-wrapper">
        <div className="student-content">
          <span className="badge">Intervue Poll</span>
          <h1 className="title">You’ve been Kicked out!</h1>
          <p className="subtitle">Looks like the teacher had removed you from the poll system. Please try again sometime.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-wrapper">
      <div className="student-content">
        <span className="badge">Intervue Poll</span>
        <h1 className="title">Let’s Get Started</h1>
        <p className="subtitle">Welcome, {name}. Get ready to answer the poll questions from your teacher.</p>

        {question && !results ? (
          <div className="poll-box">
            <h2 className="poll-question">{question.question}</h2>
            <div className="poll-options">
              {question.options.map((opt, idx) => (
                <div key={idx} className={`poll-option ${answer === opt ? 'selected' : ''}`} onClick={() => setAnswer(opt)}>
                  <input
                    type="radio"
                    name="opt"
                    checked={answer === opt}
                    onChange={() => setAnswer(opt)}
                  />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
            <p className="timer">Time left: {timer}s</p>
            <button className="continue-btn" onClick={submitAnswer} disabled={!answer}>Submit</button>
          </div>
        ) : results ? (
          <div className="results-box">
            <h2 className="poll-question">Results</h2>
            {results.options.map((opt, idx) => {
              const total = results.votes.reduce((a, b) => a + b, 0);
              const percent = total > 0 ? Math.round((results.votes[idx] / total) * 100) : 0;
              return (
                <div key={idx} className="result-bar">
                  <span>{opt}</span>
                  <strong>{results.votes[idx]} votes • {percent}%</strong>z
                </div>
              );
            })}
          </div>
        ) : (
          <p className="waiting-text">Waiting for the teacher to ask a question...</p>
        )}
        <ChatBox username={name} />
      </div>
    </div>
  );
};

export default StudentPanel;
