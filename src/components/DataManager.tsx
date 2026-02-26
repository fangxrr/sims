import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Upload, Trash2, X, Database, Lock, KeyRound } from 'lucide-react';
import { exportTemplate } from '../utils/excel';

export const DataManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Check if already authenticated in this session
  useEffect(() => {
    const auth = localStorage.getItem('sims_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default password is 'admin123', can be overridden by env var
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || '88888888';

    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('sims_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('sims_admin_auth');
  };

  const handleExport = () => {
    exportTemplate();
  };



  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer"
      >
        <span>DATA</span>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Database size={20} className="text-white/80" />
                    </div>
                    <h2 className="text-lg font-semibold text-white tracking-wide">Data Manager</h2>
                  </div>
                  {isAuthenticated && (
                    <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white transition-colors">
                      Lock
                    </button>
                  )}
                </div>

                {!isAuthenticated ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                        <Lock size={24} className="text-white/80" />
                      </div>
                      <h3 className="text-sm font-medium text-white mb-2">Admin Access Required</h3>
                      <p className="text-xs text-white/50 mb-6">
                        Please enter the admin password to manage site data.
                      </p>

                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound size={16} className="text-white/40" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password..."
                          className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                          autoFocus
                        />
                      </div>

                      {authError && <p className="text-xs text-red-400 mb-4">{authError}</p>}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-white text-black hover:bg-white/90 text-sm font-medium rounded-lg transition-colors"
                      >
                        Unlock
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h3 className="text-sm font-medium text-white mb-2">1. Export Template</h3>
                      <p className="text-xs text-white/50 mb-4">
                        Download the current data as an Excel file. You can edit this file to add or modify your Sims data.
                      </p>
                      <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
                      >
                        <Download size={16} />
                        Download Excel Template
                      </button>
                    </div>


                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
