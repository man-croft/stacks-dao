"use client";

import { useEffect, useState } from "react";
import { getDAOStats, type DAOStats } from "@/lib/daoClient";

export function DAOStatsPanel() {
  const [stats, setStats] = useState<DAOStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDAOStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Treasury Balance",
      value: `${(stats?.treasuryBalance || 0) / 1_000_000} STX`,
      icon: "💰",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    },
    {
      label: "Active Proposals",
      value: stats?.activeProposals || 0,
      icon: "📊",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    },
    {
      label: "Total Proposals",
      value: stats?.totalProposals || 0,
      icon: "📋",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    },
    {
      label: "Total Votes",
      value: stats?.totalVotes || 0,
      icon: "🗳️",
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${stat.color} backdrop-blur-sm p-6 transition-all hover:scale-105 hover:shadow-xl`}
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/60 mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
