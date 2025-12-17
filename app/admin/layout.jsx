'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Trophy, Users, Home, BarChart3, LogOut } from 'lucide-react';
import Snowfall from '@/components/Snowfall';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  const navItems = [
    { href: '/admin', icon: <Home />, label: 'Dashboard' },
    { href: '/admin/teams', icon: <Users />, label: 'Barcha Jamoalar' },
    { href: '/admin/stats', icon: <BarChart3 />, label: 'Statistika' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white">
      <Snowfall />
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 bg-gray-900/90 backdrop-blur-md border-r border-white/10`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Humo eSport</h2>
              <p className="text-sm text-cyan-300">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.href ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white p-2"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            
            <div className="ml-auto">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold">Abduvoris</p>
                  <p className="text-sm text-gray-400">Admin</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
