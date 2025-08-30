import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AppHeader from './components/AppHeader';
import { useEffect, useState } from 'react';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null for loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    const token = localStorage.getItem('token');
    console.log('App mounted. Token found:', !!token);
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  console.log('Rendering App. isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated && <AppHeader />}
        <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analytics" 
              element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;