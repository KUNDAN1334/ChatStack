import React from "react";

export default function QuickActionButton({
  title,
  description,
  icon,
  gradient,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-left p-6 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-all duration-300`}
      ></div>

      <div className="relative z-10">
        <div className="text-3xl mb-3">{icon}</div>
        <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </button>
  );
}
