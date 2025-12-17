'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, AlertCircle, Trophy, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingTeams: 0,
    approvedTeams: 0,
    todayTeams: 0,
    recentTeams: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, teamsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/teams?limit=5&status=pending')
      ]);

      const statsData = await statsRes.json();
      const teamsData = await teamsRes.json();

      if (statsData.success && teamsData.success) {
        setStats({
          ...statsData.data,
          recentTeams: teamsData.data
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Jami Jamoalar',
      value: stats.totalTeams,
      icon: <Users />,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Bugun Ro\'yxatdan O\'tgan',
      value: stats.todayTeams,
      icon: <Clock />,
      color: 'from-emerald-500 to-green-500',
      change: '+5%'
    },
    {
      title: 'Kutilayotgan',
      value: stats.pendingTeams,
      icon: <AlertCircle />,
      color: 'from-amber-500 to-orange-500',
      change: '+3'
    },
    {
      title: 'Tasdiqlangan',
      value: stats.approvedTeams,
      icon: <CheckCircle />,
      color: 'from-purple-500 to-pink-500',
      change: '+8'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Humo eSport turnir statistikasi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                {stat.icon}
              </div>
              <span className="text-sm text-green-400 font-semibold">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {loading ? '...' : stat.value}
            </div>
            <div className="text-gray-400 text-sm">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">So'nggi Ro'yxatdan O'tganlar</h2>
          <a href="/admin/teams" className="text-cyan-400 hover:underline text-sm">
            Barchasini ko'rish →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4">Jamoa</th>
                <th className="text-left py-3 px-4">Kapiton</th>
                <th className="text-left py-3 px-4">Telegram</th>
                <th className="text-left py-3 px-4">Vaqt</th>
                <th className="text-left py-3 px-4">Holat</th>
                <th className="text-left py-3 px-4">Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : stats.recentTeams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Hozircha ro'yxatdan o'tgan jamoa yo'q
                  </td>
                </tr>
              ) : (
                stats.recentTeams.map((team) => (
                  <tr key={team._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={team.teamLogo} 
                          alt={team.teamName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{team.teamName}</div>
                          <div className="text-sm text-gray-400">{team.mlbbId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{team.captainName}</td>
                    <td className="py-4 px-4">@{team.telegramUsername}</td>
                    <td className="py-4 px-4 text-sm text-gray-400">
                      {new Date(team.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        team.status === 'approved' 
                          ? 'bg-green-500/20 text-green-400'
                          : team.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
