import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Image as ImageIcon, FileText, ShieldCheck, BookOpen, Upload, Plus, Download, Trash2, Edit2 } from "lucide-react";
import { cn } from "../lib/utils";

const TABS = [
  { id: "persona", label: "Brand Persona", icon: Palette },
  { id: "assets", label: "Logos & Assets", icon: ImageIcon },
  { id: "mission", label: "Mission & Slogans", icon: BookOpen },
  { id: "compliance", label: "Compliance & Legal", icon: ShieldCheck },
];

export function BrandKit() {
  const [activeTab, setActiveTab] = useState("persona");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Brand Kit</h1>
          <p className="text-neutral-500 mt-1">
            Manage your brand identity, assets, and compliance documents for agents to use.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium text-sm shadow-sm shadow-indigo-200 cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <Upload className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              )}
            >
              <tab.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-neutral-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "persona" && <PersonaTab />}
        {activeTab === "assets" && <AssetsTab />}
        {activeTab === "mission" && <MissionTab />}
        {activeTab === "compliance" && <ComplianceTab />}
      </motion.div>
    </div>
  );
}

function PersonaTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Voice & Tone</h3>
          <button aria-label="Edit Voice & Tone" title="Edit Voice & Tone" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Primary Voice</label>
            <p className="mt-1 text-neutral-900">Professional, authoritative, yet approachable and helpful.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Key Traits</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Innovative", "Trustworthy", "Clear", "Empathetic"].map(trait => (
                <span key={trait} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Guidelines for Agents</label>
            <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
              Always address the user respectfully. Avoid jargon unless communicating with technical stakeholders. Be concise but thorough in explanations.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Color Palette</h3>
          <button aria-label="Add Color Palette" title="Add Color Palette" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Primary", hex: "#4F46E5", class: "bg-indigo-600" },
            { name: "Secondary", hex: "#10B981", class: "bg-emerald-500" },
            { name: "Dark", hex: "#0F172A", class: "bg-slate-900" },
            { name: "Light", hex: "#F8FAFC", class: "bg-slate-50 border border-neutral-200" },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div className={cn("w-full aspect-square rounded-xl shadow-inner", color.class)} />
              <div>
                <p className="text-sm font-medium text-neutral-900">{color.name}</p>
                <p className="text-xs text-neutral-500 font-mono">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssetsTab() {
  const assets = [
    { id: 1, name: "Primary Logo (Dark)", type: "PNG", size: "245 KB", url: "https://picsum.photos/seed/logo1/400/200" },
    { id: 2, name: "Primary Logo (Light)", type: "SVG", size: "12 KB", url: "https://picsum.photos/seed/logo2/400/200" },
    { id: 3, name: "App Icon", type: "PNG", size: "85 KB", url: "https://picsum.photos/seed/icon/200/200" },
    { id: 4, name: "Email Header", type: "JPG", size: "1.2 MB", url: "https://picsum.photos/seed/header/800/200" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Logos & Images</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {assets.map(asset => (
          <div key={asset.id} className="group relative border border-neutral-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors">
            <div className="aspect-video bg-neutral-100 p-4 flex items-center justify-center">
              <img loading="lazy" src={asset.url} /* ⚡ Bolt Optimization: Lazy load off-screen assets to improve initial page load */  alt={asset.name} className="max-w-full max-h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            </div>
            <div className="p-3 bg-white border-t border-neutral-200">
              <p className="text-sm font-medium text-neutral-900 truncate">{asset.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{asset.type} • {asset.size}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex gap-1">
              <button aria-label="Download Asset" title="Download Asset" className="p-1.5 bg-white text-neutral-600 hover:text-indigo-600 rounded-md shadow-sm border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button aria-label="Delete Asset" title="Delete Asset" className="p-1.5 bg-white text-neutral-600 hover:text-red-600 rounded-md shadow-sm border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MissionTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Company Mission</h3>
          <button aria-label="Edit Company Mission" title="Edit Company Mission" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-neutral-700 text-lg leading-relaxed italic">
          "To empower organizations through intelligent, autonomous agentic workflows that amplify human potential and drive unprecedented operational efficiency."
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Slogans & Catchphrases</h3>
          <button aria-label="Add Slogan" title="Add Slogan" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-3">
          {[
            "Orchestrating the Future of Work.",
            "Your Agentic Orchestra.",
            "Amplify Human Potential.",
          ].map((slogan, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-neutral-800 font-medium">{slogan}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ComplianceTab() {
  const docs = [
    { id: 1, name: "Terms and Conditions", updated: "Oct 12, 2025", status: "Active" },
    { id: 2, name: "Privacy Policy", updated: "Nov 05, 2025", status: "Active" },
    { id: 3, name: "Data Processing Agreement (DPA)", updated: "Jan 20, 2026", status: "Active" },
    { id: 4, name: "Security Whitepaper", updated: "Feb 15, 2026", status: "Draft" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Legal & Compliance Documents</h3>
        <button className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700">
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>
      <div className="divide-y divide-neutral-100">
        {docs.map(doc => (
          <div key={doc.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Last updated: {doc.updated}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                doc.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {doc.status}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button aria-label="Edit Document" title="Edit Document" className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button aria-label="Delete Document" title="Delete Document" className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
