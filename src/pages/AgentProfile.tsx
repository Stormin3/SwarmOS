import { useParams, useNavigate } from "react-router-dom";
import { MOCK_AGENTS } from "../data/mockAgents";
import { useState } from "react";
import { ArrowLeft, Save, Sliders, ShieldAlert, Target } from "lucide-react";

export function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agentData = MOCK_AGENTS.find((a) => a.id === id);

  const [agent, setAgent] = useState(agentData);

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-indigo-100 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-8 flex items-start gap-6 border-b border-neutral-200/50">
          <img
            src={agent.avatarUrl}
            alt={agent.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{agent.role}</p>
            <p className="text-sm text-neutral-500 mt-1">
              {agent.department} • Voice: {agent.voice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200/50">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold mb-4">
              <Sliders className="w-5 h-5 text-indigo-500" /> Parameters
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-neutral-700 mb-2">
                  Temperature <span>{agent.parameters.temperature}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={agent.parameters.temperature}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      parameters: {
                        ...agent.parameters,
                        temperature: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-indigo-600"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Controls creativity vs precision.
                </p>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-neutral-700 mb-2">
                  Top P <span>{agent.parameters.topP}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={agent.parameters.topP}
                  onChange={(e) =>
                    setAgent({
                      ...agent,
                      parameters: {
                        ...agent.parameters,
                        topP: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold mb-4">
              <Target className="w-5 h-5 text-emerald-500" /> Expectations
            </div>
            <ul className="space-y-3">
              {agent.expectations.map((exp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {exp}
                </li>
              ))}
            </ul>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              + Add Expectation
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold mb-4">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Restrictions
            </div>
            <ul className="space-y-3">
              {agent.restrictions.map((res, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  {res}
                </li>
              ))}
            </ul>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              + Add Restriction
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-neutral-200/50 bg-white/50">
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            System Prompt
          </label>
          <textarea
            value={agent.systemPrompt}
            onChange={(e) =>
              setAgent({ ...agent, systemPrompt: e.target.value })
            }
            className="w-full h-32 p-4 rounded-xl border border-neutral-200/50 bg-white/80 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
