import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  FileText,
  BarChart3,
  User
} from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: <Home size={20} />,
      label: 'Home'
    },
    {
      path: '/create-intent',
      icon: <PlusCircle size={20} />,
      label: 'Create'
    },
    {
      path: '/active-intents',
      icon: <FileText size={20} />,
      label: 'Intents'
    },
    {
      path: '/analytics',
      icon: <BarChart3 size={20} />,
      label: 'Analytics'
    },
    {
      path: '/profile',
      icon: <User size={20} />,
      label: 'Profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-aqua-emerald border-opacity-20 backdrop-blur-lg z-50 safe-area-bottom">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all flex-1 min-w-0 bottom-nav-item ${
                location.pathname === item.path
                  ? 'bg-aqua-emerald bg-opacity-20 text-aqua-emerald'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium bottom-nav-label truncate px-1">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;