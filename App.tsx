
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AcademicStrategist } from './components/AcademicStrategist';
import { TransitScout } from './components/TransitScout';
import { CareerLaunchpad } from './components/CareerLaunchpad';
import { CampusMap } from './components/CampusMap';
import { LiveMentor } from './components/LiveMentor';
import { IdeaGenerator } from './components/IdeaGenerator';
import { ProjectCanvas } from './components/ProjectCanvas';
import { BrandingStudio } from './components/BrandingStudio';
import { TechScout } from './components/TechScout';
import { Login } from './components/Login';

interface UserData {
  name: string;
  email: string;
  branch: string;
  batch: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('nexus_user');
      }
    }
    setIsReady(true);
  }, []);

  const handleLogin = (data: UserData) => {
    setUser(data);
    localStorage.setItem('nexus_user', JSON.stringify(data));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  if (!isReady) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/academics" element={<AcademicStrategist user={user} />} />
          <Route path="/transit" element={<TransitScout />} />
          <Route path="/career" element={<CareerLaunchpad />} />
          <Route path="/maps" element={<CampusMap />} />
          <Route path="/mentor" element={<LiveMentor />} />
          <Route path="/ideas" element={<IdeaGenerator />} />
          <Route path="/canvas" element={<ProjectCanvas />} />
          <Route path="/branding" element={<BrandingStudio />} />
          <Route path="/scout" element={<TechScout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
