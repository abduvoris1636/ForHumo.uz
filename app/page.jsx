'use client';

import { Trophy, Users, Clock, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    registeredToday: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Professional Turnirlar',
      description: 'O\'zbekistonning eng yirik eSport musobaqalari'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Jamoaviy Ro\'yxatdan O\'tish',
      description: 'Oson va tez jamoa ro\'yxatdan o\'tish tizimi'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Go\'zal Sovg\'alar',
      description: 'G\'oliblar uchun qimmatbaho sovg\'alar va mukofotlar'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Qo\'llab-quvvatlash',
      description: 'Doimiy texnik yordam va maslahat'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300">O'zbekistonning eng yirik eSport turniri</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Mobile Legends
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Bang Bang Championship
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Humo eSport bilan birga bo'ling. Professional gamer bo'ling.
              Katta sovg'alarni qo'lga kiriting!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Hoziroq Ro'yxatdan O'ting</span>
                <Trophy className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-colors">
                Turnir Qoidalari
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              <div className="glass-panel p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {stats.totalTeams}+
                </div>
                <div className="text-gray-300">Ro'yxatdan O'tgan Jamoalar</div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {stats.registeredToday}+
                </div>
                <div className="text-gray-300">Bugun Ro'yxatdan O'tgan</div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  $10,000
                </div>
                <div className="text-gray-300">Umumiy Mukofot Jamg'armasi</div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  30+
                </div>
                <div className="text-gray-300">Faol O'yinchi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nega <span className="text-cyan-400">Humo eSport?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-panel p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Turnir Boshlanishiga Qolgan Vaqt
              </h2>
              <div className="grid grid-cols-4 gap-4 mb-10 max-w-md mx-auto">
                {[15, 23, 42, 18].map((time, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white py-4 rounded-xl">
                      {time}
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                      {['Kun', 'Soat', 'Daqiqa', 'Soniya'][index]}
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>Jamoangizni Ro'yxatdan O'tkazing</span>
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
