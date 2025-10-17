import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MenuItemsPage from './pages/MenuItemsPage';
import CategoriesPage from './pages/CategoriesPage';
import { onAuthChanged, logoutUser } from './services/authService';
import './App.css';

function AppLayout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Redirect to dashboard if on root or unknown route
  useEffect(() => {
    if (location.pathname === '/' || 
        (!location.pathname.includes('/menu-items') && 
         !location.pathname.includes('/categories') && 
         !location.pathname.includes('/dashboard'))) {
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="d-flex" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div 
        style={{ 
          marginLeft: sidebarOpen && window.innerWidth >= 992 ? '250px' : '0',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          width: '100%',
          paddingTop: '56px'
        }}
      >
        <Navbar user={user} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/menu-items" element={<MenuItemsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center" 
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="text-center">
          <div 
            className="spinner-border text-light" 
            role="status" 
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/*" 
          element={user ? <AppLayout user={user} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;