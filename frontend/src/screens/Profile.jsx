import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Profile = () => {
  const { state } = useContext(AppContext);
  const { user } = state;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-300">
          Manage your account settings and view your statistics.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-aqua-emerald to-neon-mint rounded-full flex items-center justify-center">
            <span className="text-dark-abyss text-2xl font-bold">U</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">User Profile</h2>
            <p className="text-gray-400">{user.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
              <div className="font-mono text-sm bg-dark-abyss p-3 rounded-lg">
                {user.address}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Balance</label>
              <div className="text-lg font-semibold text-aqua-emerald">
                {user.balance}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            
            <div className="flex items-center justify-between p-3 bg-dark-abyss rounded-lg">
              <span>Dark Theme</span>
              <div className="w-12 h-6 bg-aqua-emerald rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-abyss rounded-lg">
              <span>Swarm Notifications</span>
              <div className="w-12 h-6 bg-aqua-emerald rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-aqua-emerald border-opacity-20">
          <button className="btn-liquid w-full py-3 font-semibold">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
