import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, CheckCircle2, Circle, Clock, Send, User, Play, FolderKanban } from "lucide-react";
import { MOCK_AGENTS } from "../data/mockAgents";

type Stage = "Initiated" | "Planning" | "Delegating" | "In Progress" | "Review" | "Completed";

interface Project {
  id: string;
  title: string;
  stage: Stage;
  messages: { id: string; sender: string; role: 'user' | 'agent' | 'system'; text: string; timestamp: Date }[];
}

const agentMap = new Map(MOCK_AGENTS.map(agent => [agent.name, agent]));

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      title: "Q3 Marketing Campaign",
      stage: "In Progress",
      messages: [
        { id: "m1", sender: "Admin User", role: "user", text: "Let's start the Q3 Marketing Campaign. I need copy, a target list, and a landing page.", timestamp: new Date(Date.now() - 3600000) },
        { id: "m2", sender: "Eleanor Vance", role: "agent", text: "Understood. I am delegating the copywriting to Sarah, the target list to David, and the landing page to Marcus.", timestamp: new Date(Date.now() - 3500000) },
        { id: "m3", sender: "System", role: "system", text: "Task delegated to Sarah Jenkins (Copywriter)", timestamp: new Date(Date.now() - 3400000) },
        { id: "m4", sender: "System", role: "system", text: "Task delegated to David Kim (Data Analyst)", timestamp: new Date(Date.now() - 3300000) },
      ]
    }
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>("proj-1");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Performance optimization: Memoize O(N) array lookup to prevent unnecessary re-evaluations during unrelated state updates (e.g., typing in input)
  const activeProject = useMemo(() =>
    projects.find(p => p.id === activeProjectId),
  [projects, activeProjectId]);

  const simulateDelegation = async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          stage: "Planning",
          messages: [...p.messages, { id: `m-${Date.now()}`, sender: "Eleanor Vance", role: "agent", text: "I have received the request. Analyzing requirements and preparing delegation plan...", timestamp: new Date() }]
        };
      }
      return p;
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          stage: "Delegating",
          messages: [...p.messages, { id: `m-${Date.now()}`, sender: "System", role: "system", text: "Delegating tasks to available agents based on skills...", timestamp: new Date() }]
        };
      }
      return p;
    }));
  };

  const handleCreateProject = () => {
    if (!newTaskInput.trim()) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newTaskInput,
      stage: "Initiated",
      messages: [
        { id: `m-${Date.now()}`, sender: "Admin User", role: "user", text: newTaskInput, timestamp: new Date() }
      ]
    };
    setProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
    setNewTaskInput("");

    // Simulate delegation
    simulateDelegation(newProj.id);
  };

  const STAGES: Stage[] = ["Initiated", "Planning", "Delegating", "In Progress", "Review", "Completed"];
  const activeStageIndex = activeProject ? STAGES.indexOf(activeProject.stage) : -1;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Project List */}
      <div className="w-full md:w-80 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-neutral-200/50 bg-white/50">
          <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" /> Projects
          </h2>
        </div>
        <div className="p-4 border-b border-neutral-200/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="New project request..." 
              value={newTaskInput}
              onChange={e => setNewTaskInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
              className="flex-1 bg-white/50 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              aria-label="Create project"
              onClick={handleCreateProject}
              disabled={!newTaskInput.trim()}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map(proj => (
            <button
              key={proj.id}
              onClick={() => setActiveProjectId(proj.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${activeProjectId === proj.id ? 'bg-indigo-50/80 border border-indigo-100 shadow-sm' : 'hover:bg-white/50 border border-transparent'}`}
            >
              <h3 className="font-medium text-sm text-neutral-900 truncate">{proj.title}</h3>
              <p className="text-xs text-indigo-600 mt-1 font-medium">{proj.stage}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Project View */}
      {activeProject ? (
        <div className="flex-1 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header with Stage Dropdown */}
          <div className="h-16 border-b border-neutral-200/50 bg-white/50 flex items-center justify-between px-6">
            <h2 className="font-semibold text-neutral-800 truncate pr-4">{activeProject.title}</h2>
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {activeProject.stage === "Completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-indigo-500" />}
                  Stage: <span className="text-indigo-600">{activeProject.stage}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-10"
                  >
                    {STAGES.map((stage, index) => {
                      const isCurrent = index === activeStageIndex;
                      const isPast = index < activeStageIndex;
                      return (
                        <div key={stage} className={`px-4 py-3 flex items-center gap-3 text-sm ${isCurrent ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-neutral-600'}`}>
                          {isPast || isCurrent ? <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-indigo-600' : 'text-emerald-500'}`} /> : <Circle className="w-4 h-4 text-neutral-300" />}
                          {stage}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat / Delegation Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeProject.messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role !== 'system' && (
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                    {msg.role === 'user' ? <User className="w-4 h-4 text-neutral-500" /> : <img src={agentMap.get(msg.sender)?.avatarUrl || `https://ui-avatars.com/api/?name=${msg.sender}`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                  </div>
                )}
                
                <div className={`max-w-[80%] ${msg.role === 'system' ? 'mx-auto w-full text-center' : ''}`}>
                  {msg.role !== 'system' && (
                    <p className={`text-xs text-neutral-500 mb-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.sender}</p>
                  )}
                  
                  {msg.role === 'system' ? (
                    <div className="inline-flex items-center gap-2 bg-neutral-100/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-neutral-600 border border-neutral-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {msg.text}
                    </div>
                  ) : (
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-neutral-100 text-neutral-900 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200/50 bg-white/50">
            <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm">
              <input 
                type="text" 
                placeholder="Send a message to the team..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1"
              />
              <button
                aria-label="Send message"
                className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl flex items-center justify-center text-neutral-500">
          Select a project or create a new one to start delegating.
        </div>
      )}
    </div>
  );
}
