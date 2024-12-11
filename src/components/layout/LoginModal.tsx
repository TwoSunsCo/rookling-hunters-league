import React, { useState } from 'react';
import { LogIn, Mail, Lock, Shield } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useStore } from '../../store/useStore';
import type { Team } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState<Team>('red');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await register(email, password, username, team);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-red-500" />
          <h2 className="text-xl font-medieval font-bold text-gray-200">
            {isRegistering ? 'Join the Hunt' : 'Return to Battle'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                       text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                       text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                           text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  Choose Your Guild
                </label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value as Team)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                           text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="red">Red Guild</option>
                  <option value="blue">Blue Guild</option>
                  <option value="green">Green Guild</option>
                  <option value="yellow">Yellow Guild</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600
                     text-white rounded-lg hover:from-red-600 hover:to-red-700
                     transition-all duration-300 font-semibold flex items-center
                     justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-5 h-5" />
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : 'Need an account? Create one'}
          </button>
        </form>
      </div>
    </Modal>
  );
}