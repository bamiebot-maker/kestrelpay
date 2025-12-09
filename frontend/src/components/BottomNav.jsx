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
      icon: <Home size={22} />, 
      label: 'Home' 
    },
    { 
      path: '/create-intent', 
      icon: <PlusCircle size={22} />, 
      label: 'Create' 
    },
    { 
      path: '/active-intents', 
      icon: <FileText size={22} />, 
      label: 'Intents' 
    },
    { 
      path: '/analytics', 
      icon: <BarChart3 size={22} />, 
      label: 'Analytics' 
    },
    { 
      path: '/profile', 
      icon: <User size={22} />, 
      label: 'Profile' 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-aqua-emerald border-opacity-20 backdrop-blur-lg z-50">
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
              <div className="mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
