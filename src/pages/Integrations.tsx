import React, { useState } from "react";
import { Plug, CheckCircle2, Search, ArrowUpRight, Database, Globe, MessageSquare, Code, FileText, Mail, Calendar, FileSpreadsheet, Presentation, Plus, X, Box } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Plug, Database, Globe, MessageSquare, Code, FileText, Mail, Calendar, FileSpreadsheet, Presentation, Box
};

const INTEGRATIONS = [
  {
    id: "mcp-email",
    name: "Email",
    category: "Communication",
    icon: Mail,
    description: "Enable agents to send and receive emails directly.",
    status: "disconnected",
    color: "bg-amber-500",
  },
  {
    id: "mcp-calendar",
    name: "Google Calendar",
    category: "Productivity",
    icon: Calendar,
    description: "Manage schedules, create events, and check availability.",
    status: "disconnected",
    color: "bg-blue-500",
  },
  {
    id: "mcp-docs",
    name: "Google Docs",
    category: "Knowledge",
    icon: FileText,
    description: "Create, read, and edit documents collaboratively.",
    status: "disconnected",
    color: "bg-blue-600",
  },
  {
    id: "mcp-sheets",
    name: "Google Sheets",
    category: "Data",
    icon: FileSpreadsheet,
    description: "Analyze data, update spreadsheets, and create charts.",
    status: "disconnected",
    color: "bg-emerald-600",
  },
  {
    id: "mcp-slides",
    name: "Google Slides",
    category: "Presentation",
    icon: Presentation,
    description: "Generate and modify presentation decks.",
    status: "disconnected",
    color: "bg-amber-500",
  },
  {
    id: "mcp-github",
    name: "GitHub",
    category: "Development",
    icon: Code,
    description: "Allow agents to read repositories, create PRs, and review code.",
    status: "connected",
    color: "bg-neutral-900",
  },
  {
    id: "mcp-slack",
    name: "Slack",
    category: "Communication",
    icon: MessageSquare,
    description: "Agents can read channels, send messages, and summarize threads.",
    status: "connected",
    color: "bg-rose-600",
  },
  {
    id: "mcp-notion",
    name: "Notion",
    category: "Knowledge",
    icon: FileText,
    description: "Read and write to Notion databases and pages.",
    status: "disconnected",
    color: "bg-neutral-800",
  },
  {
    id: "mcp-postgres",
    name: "PostgreSQL",
    category: "Database",
    icon: Database,
    description: "Execute queries and analyze data from your Postgres databases.",
    status: "disconnected",
    color: "bg-blue-600",
  },
  {
    id: "mcp-jira",
    name: "Jira",
    category: "Project Management",
    icon: Globe,
    description: "Manage issues, sprints, and epics directly via agents.",
    status: "disconnected",
    color: "bg-blue-500",
  },
  {
    id: "mcp-google-drive",
    name: "Google Drive",
    category: "Knowledge",
    icon: FileText,
    description: "Search, read, and organize files in Google Drive.",
    status: "disconnected",
    color: "bg-emerald-500",
  }
];

export function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    category: "",
    description: "",
    icon: "Plug",
    status: "disconnected",
  });

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `custom-${Date.now()}`;
    const integrationToAdd = {
      id: newId,
      name: newIntegration.name,
      category: newIntegration.category,
      description: newIntegration.description,
      icon: iconMap[newIntegration.icon] || Plug,
      status: newIntegration.status,
      color: "bg-indigo-500",
    };
    
    setIntegrations([integrationToAdd, ...integrations]);
    setIsAddModalOpen(false);
    setNewIntegration({
      name: "",
      category: "",
      description: "",
      icon: "Plug",
      status: "disconnected",
    });
  };

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: "connected" } : i));
      setConnecting(null);
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: "disconnected" } : i));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-white">
          <h1 className="text-2xl font-bold tracking-tight">Integrations (MCPs)</h1>
          <p className="text-indigo-100 mt-1">Connect Model Context Protocols to give your agents access to external tools and data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search integrations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Custom</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration, i) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm", integration.color)}>
                  <integration.icon className="w-6 h-6" />
                </div>
                {integration.status === "connected" ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                    <Plug className="w-3.5 h-3.5" /> Available
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-neutral-900">{integration.name}</h3>
              <p className="text-xs text-indigo-600 font-medium mb-2">{integration.category}</p>
              <p className="text-sm text-neutral-500 line-clamp-2">{integration.description}</p>
            </div>
            
            <div className="p-4 border-t border-neutral-200/50 bg-white/50 flex items-center justify-between">
              <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                View Docs <ArrowUpRight className="w-3 h-3" />
              </button>
              
              {integration.status === "connected" ? (
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 228, 230, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDisconnect(integration.id)}
                  className="text-sm font-semibold text-rose-600 bg-rose-50 px-5 py-2 rounded-xl transition-colors border border-rose-200 flex items-center gap-2 group"
                >
                  <Plug className="w-3.5 h-3.5 group-hover:-rotate-12 transition-transform" />
                  Disconnect
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect(integration.id)}
                  disabled={connecting === integration.id}
                  className="relative text-sm font-semibold text-white bg-indigo-600 px-5 py-2 rounded-xl transition-all disabled:opacity-70 flex items-center gap-2 group overflow-hidden shadow-sm hover:shadow-indigo-500/50"
                >
                  {/* Shimmer effect */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  
                  {connecting === integration.id ? (
                    <span className="relative z-10 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center gap-2">
                      <Plug className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                      Connect
                    </span>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Custom Integration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900">Add Custom Integration</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddIntegration} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input required type="text" value={newIntegration.name} onChange={e => setNewIntegration({...newIntegration, name: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Internal API" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                <input required type="text" value={newIntegration.category} onChange={e => setNewIntegration({...newIntegration, category: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Development" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea required value={newIntegration.description} onChange={e => setNewIntegration({...newIntegration, description: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20" placeholder="Briefly describe what this integration does..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Icon</label>
                  <select value={newIntegration.icon} onChange={e => setNewIntegration({...newIntegration, icon: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    {Object.keys(iconMap).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                  <select value={newIntegration.status} onChange={e => setNewIntegration({...newIntegration, status: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option value="disconnected">Disconnected</option>
                    <option value="connected">Connected</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Add Integration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
