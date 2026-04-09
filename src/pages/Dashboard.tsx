import { MOCK_AGENTS } from "../data/mockAgents";
import { Activity, Users, Zap, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function Dashboard() {
  const activeAgents = MOCK_AGENTS.filter((a) => a.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-white">
          <h1 className="text-2xl font-bold tracking-tight">Swarm Overview</h1>
          <p className="text-indigo-100 mt-1">Monitor your agentic workforce performance and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Agents"
          value={MOCK_AGENTS.length}
          icon={Users}
          trend="+2 this week"
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          icon={Activity}
          trend="Optimal"
        />
        <StatCard
          title="Tasks Completed"
          value="1,284"
          icon={Zap}
          trend="+14% vs last week"
        />
        <StatCard
          title="Security Status"
          value="Secure"
          icon={ShieldCheck}
          trend="Enterprise Grade"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">
              Recent Swarm Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  time: "10:42 AM",
                  agent: "Eleanor Vance",
                  action:
                    "Adjusted parameters for Marcus Chen to optimize code review speed.",
                },
                {
                  time: "09:15 AM",
                  agent: "Marcus Chen",
                  action: "Deployed new authentication microservice.",
                },
                {
                  time: "08:30 AM",
                  agent: "Sarah Jenkins",
                  action: "Closed deal with Acme Corp.",
                },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-16 text-xs text-neutral-400 font-mono pt-1">
                    {activity.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-indigo-600">
                        {activity.agent}
                      </span>{" "}
                      {activity.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Agent Status</h3>
            <div className="space-y-4">
              {MOCK_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.role}</p>
                    </div>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      agent.status === "active"
                        ? "bg-emerald-500"
                        : agent.status === "idle"
                          ? "bg-amber-500"
                          : "bg-neutral-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
      </div>
      <p className="text-xs text-neutral-500 mt-2">{trend}</p>
    </motion.div>
  );
}
