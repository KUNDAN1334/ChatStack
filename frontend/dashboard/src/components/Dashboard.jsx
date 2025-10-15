import React, { useState, useEffect } from "react";
import { listClients } from "../services/api";
import StatCard from "../components/StatCard";
import QuickActionButton from "../components/QuickActionButton";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalConversations: 0,
    totalLeads: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await listClients();
      const clients = response.data;
      setStats({
        totalClients: clients.length,
        activeClients: clients.filter((c) => c.is_active).length,
        totalConversations: 0,
        totalLeads: 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen transition-all">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mt-2">
          A quick summary of your clients and activity insights.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        <StatCard title="Total Clients" value={stats.totalClients} icon="👥" color="blue" />
        <StatCard title="Active Clients" value={stats.activeClients} icon="✅" color="green" />
        <StatCard title="Total Conversations" value={stats.totalConversations} icon="💬" color="purple" />
        <StatCard title="Total Leads" value={stats.totalLeads} icon="📧" color="orange" />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
          ⚡ Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <QuickActionButton
            title="Add New Client"
            description="Create a new chatbot client."
            icon="➕"
            gradient="from-blue-500 to-indigo-600"
            onClick={() => (window.location.hash = "#clients")}
          />
          <QuickActionButton
            title="View Analytics"
            description="Check performance metrics and insights."
            icon="📊"
            gradient="from-green-500 to-emerald-600"
            onClick={() => (window.location.hash = "#analytics")}
          />
          <QuickActionButton
            title="API Documentation"
            description="View API endpoints and usage examples."
            icon="📚"
            gradient="from-orange-400 to-pink-500"
            onClick={() => window.open("http://localhost:8000/docs", "_blank")}
          />
        </div>
      </div>
    </div>
  );
}
