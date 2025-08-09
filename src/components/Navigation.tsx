import React from 'react';
import { Home, Package, MessageSquare, Star, Settings, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    ...(isAdmin ? [{ id: 'admin', icon: Shield, label: 'Admin' }] : [{ id: 'admin', icon: LogIn, label: 'Login' }]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-700 z-40">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 mobile-button ${
              activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-green-500 to-green-600 shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
