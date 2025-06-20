import React, { useState } from 'react';
import './RoleSelector.css';

const RoleSelector = ({ setRole }) => {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      setRole(selected);
    }
  };

  return (
    <div className="role-selector-wrapper">
      <div className="role-selector-content">
        <span className="badge">Intervue Poll</span>
        <h1 className="title">Welcome to the Live Polling System</h1>
        <p className="subtitle">Please select the role that best describes you to begin using the live polling system</p>

        <div className="role-cards">
          <div
            className={`role-card ${selected === 'student' ? 'selected' : ''}`}
            onClick={() => setSelected('student')}
          >
            <h3>I'm a Student</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          </div>
          <div
            className={`role-card ${selected === 'teacher' ? 'selected' : ''}`}
            onClick={() => setSelected('teacher')}
          >
            <h3>I'm a Teacher</h3>
            <p>Submit answers and view live poll results in real-time.</p>
          </div>
        </div>

        <button
          className={`continue-btn ${!selected ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
