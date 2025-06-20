import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './TeacherPanel.css';
import ChatBox from './ChatBox';

const socket = io('https://polling-system-wkyf.onrender.com');

const TeacherPanel = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [canAsk, setCanAsk] = useState(true);
  const [results, setResults] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);

  const createPoll = () => {
    if (question && options.every(opt => opt.trim() !== '')) {
      socket.emit('create_poll', { question, options });
      setCanAsk(false);
    }
  };

  useEffect(() => {
    socket.on('poll_results', (data) => {
  setResults(data);
  setPollHistory(prev => {
    const exists = prev.some(p => p.question === data.question);
    return exists ? prev : [...prev, data];
  });
  setCanAsk(false);
});


    socket.on('update_students', (students) => {
      setStudentList(students);
    });
  }, []);

  const resetPoll = () => {
    setQuestion('');
    setOptions(['', '']);
    setResults(null);
    setCanAsk(true);
  };

  return (
    <div className="teacher-wrapper">
      <div className="teacher-content">
        <span className="badge">Intervue Poll</span>
        <h1 className="title">Let’s Get Started</h1>
        <p className="subtitle">You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.</p>

        {canAsk ? (
          <div className="form-section">
            <label className="form-label">Enter your question</label>
            <input
              className="form-input"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g., What is the capital of France?"
            />

            <div className="options-list">
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  className="form-input"
                  value={opt}
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[idx] = e.target.value;
                    setOptions(newOpts);
                  }}
                  placeholder={`Option ${idx + 1}`}
                />
              ))}
              <button
                className="add-option-btn"
                onClick={() => setOptions([...options, ''])}
              >
                + Add new option
              </button>
            </div>

            <button className="continue-btn" onClick={createPoll}>Continue</button>
          </div>
        ) : results ? (
          <div className="results-card">
            <h3 className="results-title">Poll Results</h3>
            {results.options.map((opt, idx) => {
              const total = results.votes.reduce((a, b) => a + b, 0);
              const percent = total > 0 ? Math.round((results.votes[idx] / total) * 100) : 0;
              return (
                <p key={idx}>{opt}: {results.votes[idx]} votes • {percent}%</p>
              );
            })}
            <button
              className="continue-btn"
              style={{ marginTop: '20px' }}
              onClick={resetPoll}
            >
              Ask Another Question
            </button>
          </div>
        ) : (
          <p className="waiting-text">Waiting for all students to answer...</p>
        )}

        {pollHistory.length > 0 && (
          <div className="history-section">
            <h3 className="results-title">Poll History</h3>
            {pollHistory.map((poll, index) => (
              <div key={index} className="results-card">
                <h4 className="poll-question">{poll.question}</h4>
                {poll.options.map((opt, idx) => {
                  const total = poll.votes.reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? Math.round((poll.votes[idx] / total) * 100) : 0;
                  return (
                    <p key={idx}>{opt}: {poll.votes[idx]} votes • {percent}%</p>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <button className="floating-btn" onClick={() => setShowStudentList(!showStudentList)}>👥</button>

        {showStudentList && (
          <div className="student-list-modal">
            <h3>Participants</h3>
            <ul>
  {studentList.map((s, i) => (
    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{s}</span>
      <button
        className="kick-btn"
        onClick={() => socket.emit('kick_student', { name: s })}
      >
        Kick
      </button>
    </li>
  ))}
</ul>
            <button onClick={() => setShowStudentList(false)} className="close-btn">Close</button>
          </div>
        )}
        <ChatBox username="Teacher" />
      </div>
    </div>
  );
};

export default TeacherPanel;
