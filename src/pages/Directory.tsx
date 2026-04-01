import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_AGENTS } from "../data/mockAgents";
import { motion } from "motion/react";
import { Settings, MessageSquare, X } from "lucide-react";

export function Directory() {
  const [showToast, setShowToast] = useState(false);

  const handleHireClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-white">
          <h1 className="text-2xl font-bold tracking-tight">Agent Directory</h1>
          <p className="text-indigo-100 mt-1">
            Manage your AI workforce and their configurations.
          </p>
        </div>
        <button onClick={handleHireClick} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Hire New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_AGENTS.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <img
                  src={agent.avatarUrl}
                  alt={agent.name}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    agent.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : agent.status === "idle"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-1">
                {agent.role}
              </p>
              <p className="text-xs text-neutral-500 mb-4">
                {agent.department}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Voice</span>
                  <span className="font-medium">{agent.voice}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Temp</span>
                  <span className="font-medium">
                    {agent.parameters.temperature}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200/50 p-4 bg-white/50 flex gap-2">
              <Link
                to={`/directory/${agent.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                <Settings className="w-4 h-4" /> Config
              </Link>
              <Link
                to={`/chat?agent=${agent.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Chat
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <span>Hiring new agents is currently in beta.</span>
          <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
