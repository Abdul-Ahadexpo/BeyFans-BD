import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'admin' && !isAdmin) {
      setShowLogin(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setActiveTab('admin');
  };

  if (showLogin) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;