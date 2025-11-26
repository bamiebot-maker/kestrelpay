import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: '??', label: 'Home' },
    { path: '/create', icon: '?', label: 'Create' },
    { path: '/intents', icon: '??', label: 'Intents' },
    { path: '/analytics', icon: '??', label: 'Analytics' },
    { path: '/profile', icon: '??', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-aqua-emerald border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-aqua-emerald bg-opacity-20 text-aqua-emerald'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
