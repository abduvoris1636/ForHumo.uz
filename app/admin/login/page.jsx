'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Muvaffaqiyatli kirish!');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        toast.error(data.error || 'Kirish muvaffaqiyatsiz');
      }
    } catch (error) {
      toast.error('Server xatosi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="glass-panel p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panelga Kirish</h1>
          <p className="text-gray-400 mt-2">
            Humo eSport turnirlarini boshqarish tizimi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-4 h-4 mr-2" />
              Foydalanuvchi nomi
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="input-field"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Parol
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Kirilmoqda...
              </span>
            ) : (
              'Kirish'
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            <p>Kirish ma'lumotlari:</p>
            <p>Username: <span className="text-cyan-400">abduvoris</span></p>
            <p>Password: <span className="text-cyan-400">Abduvoris-2006</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}
