import React from "react";

export default function StatCard({ title, value, icon, color }) {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-400 to-yellow-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`text-4xl bg-gradient-to-br ${gradients[color]} text-white p-4 rounded-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
