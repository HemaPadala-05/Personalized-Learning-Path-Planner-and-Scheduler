
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import TaskManager from './components/TaskManager';
import RoadmapGenerator from './components/RoadmapGenerator';
import Planner from './components/Planner';
import ProgressTracker from './components/ProgressTracker';
import ResearchPanel from './components/ResearchPanel';
import Chatbot from './components/Chatbot';
import LearningExperience from './components/LearningExperience';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('smart_learn_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem('smart_learn_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('smart_learn_user');
  };

  const onUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('smart_learn_user', JSON.stringify(updatedUser));
    localStorage.setItem(`user_${updatedUser.email}`, JSON.stringify(updatedUser));
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/roadmap" element={<RoadmapGenerator onUpdateUser={onUpdateUser} />} />
            <Route path="/planner" element={<Planner user={user} />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/performance" element={<ProgressTracker />} />
            <Route path="/research" element={<ResearchPanel />} />
            <Route path="/study" element={<LearningExperience onUpdateUser={onUpdateUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
