import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen gradient-dark flex items-center justify-center p-4">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              The app encountered an error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleBackToProducts = () => {
    setSelectedProductId(null);
    setActiveTab('products');
  };

  if (showLogin) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (selectedProductId) {
    return <ProductDetailsPage productId={selectedProductId} onBack={handleBackToProducts} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={handleTabChange} />; // ✅ pass handleTabChange
      case 'products':
        return <ProductsPage onProductSelect={handleProductSelect} />;
      case 'reviews':
        return <ReviewsPage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage onTabChange={handleTabChange} />;
      default:
        return <HomePage onTabChange={handleTabChange} />;
    }
  };

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {renderContent()}
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </AppErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppErrorBoundary>
  );
};

export default App;
