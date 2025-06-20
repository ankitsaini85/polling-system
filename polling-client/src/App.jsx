import React, { useState } from 'react';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import RoleSelector from './components/RoleSelector';
import './index.css';

const App = () => {
  const [role, setRole] = useState(null);
  return (
    <div className="app-container">
      {!role ? <RoleSelector setRole={setRole} /> : role === 'teacher' ? <TeacherPanel /> : <StudentPanel />}
    </div>
  );
};

export default App;
