import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Summaries } from './pages/Summaries';
import { Archives } from './pages/Archives';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { MemoryModal } from './components/MemoryModal';
import { INITIAL_MEMORIES, MOCK_USER } from './constants';
import { Memory, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Auth state
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    setUser(MOCK_USER);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddMemory = (newMemoryData: Omit<Memory, 'id'>) => {
    if (editingMemory) {
      // Edit Logic
      setMemories(prev => prev.map(m => m.id === editingMemory.id ? { ...newMemoryData, id: editingMemory.id } : m));
      setEditingMemory(null);
    } else {
      // Create Logic
      const newMemory: Memory = {
        ...newMemoryData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMemories(prev => [newMemory, ...prev]);
    }
  };

  const handleDeleteMemory = (id: string) => {
    if(window.confirm("Bu anıyı silmek istediğinize emin misiniz?")) {
        setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const openEditModal = (memory: Memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout 
        onLogout={handleLogout} 
        user={user} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                memories={memories} 
                onAddMemory={() => setIsModalOpen(true)}
                onDeleteMemory={handleDeleteMemory}
                onEditMemory={openEditModal}
              />
            } 
          />
          <Route path="/summaries" element={<Summaries memories={memories} />} />
          <Route 
            path="/archives" 
            element={
                <Archives 
                    memories={memories} 
                    onDeleteMemory={handleDeleteMemory}
                    onEditMemory={openEditModal}
                />
            } 
          />
          <Route path="/profile" element={<Profile user={user} memories={memories} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      <MemoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleAddMemory}
        initialData={editingMemory}
      />
    </HashRouter>
  );
};

export default App;