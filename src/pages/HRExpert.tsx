import { useState } from "react";
import { Users, Sparkles, SlidersHorizontal, X, CheckCircle2, ShieldAlert, Target, Zap } from "lucide-react";
import { MOCK_AGENTS_MAP } from "../data/mockAgents";
import { motion, AnimatePresence } from "motion/react";

const PRECONFIGURED_TEMPLATES = [
  {
    id: "template-cs-l1",
    name: "Customer Support L1",
    role: "Support Agent",
    department: "Customer Success",
    skills: ["Empathy", "Troubleshooting", "Knowledge Base Navigation", "Multi-lingual Translation", "Sentiment Analysis"],
    parameters: { temperature: 0.3, topP: 0.85, topK: 40 },
    expectations: ["Resolve Tier 1 tickets within 15 mins", "Maintain 95% CSAT", "Identify upsell opportunities"],
    restrictions: ["Cannot issue refunds over $50", "Must escalate technical bugs to L2"],
  },
  {
    id: "template-devops",
    name: "Senior DevOps",
    role: "DevOps Engineer",
    department: "Engineering",
    skills: ["CI/CD", "Kubernetes", "AWS", "Infrastructure as Code", "Automated Remediation"],
    parameters: { temperature: 0.1, topP: 0.9, topK: 20 },
    expectations: ["Maintain 99.99% uptime", "Automate deployment pipelines", "Zero-downtime migrations"],
    restrictions: ["Cannot delete production databases", "Must require manual approval for prod deployments"],
  },
  {
    id: "template-copywriter",
    name: "Copywriter",
    role: "Content Creator",
    department: "Marketing",
    skills: ["SEO", "Creative Writing", "Brand Voice", "A/B Testing", "Conversion Optimization"],
    parameters: { temperature: 0.8, topP: 0.95, topK: 60 },
    expectations: ["Write 3 blog posts per week", "Optimize content for target keywords", "Maintain consistent brand tone"],
    restrictions: ["Cannot publish without editorial review", "Must adhere to brand guidelines"],
  },
  {
    id: "template-legal",
    name: "Legal Assistant",
    role: "Paralegal",
    department: "Legal",
    skills: ["Contract Review", "Compliance", "Legal Research", "Risk Assessment", "Document Summarization"],
    parameters: { temperature: 0.0, topP: 1.0, topK: 10 },
    expectations: ["Review NDAs within 24 hours", "Highlight potential compliance risks", "Draft standard agreements"],
    restrictions: ["Cannot provide final legal advice", "Must flag non-standard clauses to General Counsel"],
  },
  {
    id: "template-data-scientist",
    name: "Data Scientist",
    role: "Machine Learning Engineer",
    department: "Data",
    skills: ["Predictive Modeling", "Python", "TensorFlow", "Statistical Analysis", "Data Cleansing"],
    parameters: { temperature: 0.2, topP: 0.9, topK: 30 },
    expectations: ["Build predictive churn models", "Optimize recommendation algorithms", "Present findings to stakeholders"],
    restrictions: ["Cannot train models on unanonymized PII", "Must validate models against holdout sets"],
  },
  {
    id: "template-sales-engineer",
    name: "Sales Engineer",
    role: "Technical Sales",
    department: "Sales",
    skills: ["Solution Architecture", "Technical Demos", "Objection Handling", "API Integration", "Proposal Writing"],
    parameters: { temperature: 0.4, topP: 0.85, topK: 40 },
    expectations: ["Deliver customized technical demos", "Answer complex security questionnaires", "Assist in closing enterprise deals"],
    restrictions: ["Cannot promise unreleased features", "Must adhere to approved pricing matrices"],
  }
];

export function HRExpert() {
  const hrAgent = MOCK_AGENTS_MAP.get("hr-expert-001");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PRECONFIGURED_TEMPLATES[0] | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState<string[]>([]);

  const handleDeploy = (id: string) => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(prev => [...prev, id]);
      setTimeout(() => setSelectedTemplate(null), 1000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div className="flex items-center justify-between mb-8">
        <div className="text-white">
          <h1 className="text-2xl font-bold tracking-tight">HR Expert Configuration</h1>
          <p className="text-indigo-100 mt-1">Automate your agent hiring and parameter tuning.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl text-center">
            <img src={hrAgent?.avatarUrl} alt={hrAgent?.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-50 shadow-md" referrerPolicy="no-referrer" />
            <h2 className="text-xl font-bold text-neutral-900">{hrAgent?.name}</h2>
            <p className="text-indigo-600 font-medium text-sm mb-4">{hrAgent?.role}</p>
            <p className="text-sm text-neutral-600 text-left bg-white/50 p-4 rounded-xl border border-neutral-200/50">
              "I monitor the performance of all agents in the swarm and dynamically adjust their parameters to ensure optimal output and compliance with company policies."
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-neutral-900"><SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Auto-Tuning Settings</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Performance Monitoring</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Auto-Adjust Temperature</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Strict Policy Enforcement</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-900"><Sparkles className="w-5 h-5 text-amber-500" /> Recent HR Actions</h3>
              <button className="text-sm text-indigo-600 font-medium hover:underline">View All Logs</button>
            </div>
            
            <div className="space-y-4">
              {[
                { agent: "Marcus Chen", action: "Decreased temperature from 0.4 to 0.2", reason: "High syntax error rate detected in recent PRs." },
                { agent: "Sarah Jenkins", action: "Updated system prompt", reason: "New Q3 sales targets required adjustment in tone." },
                { agent: "David Kim", action: "Enforced new restriction", reason: "Added 'Cannot access raw PII' per new security policy." },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/50 border border-neutral-200/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Target: {log.agent}</p>
                    <p className="text-sm text-neutral-700 mt-1"><span className="font-semibold">Action:</span> {log.action}</p>
                    <p className="text-xs text-neutral-500 mt-1"><span className="font-semibold">Reason:</span> {log.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900">Preconfigured Hires</h3>
            <p className="text-sm text-neutral-600 mb-6">Instantly deploy new agents with pre-tuned parameters, skills, and restrictions for specific roles.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRECONFIGURED_TEMPLATES.map((template) => (
                <div 
                  key={template.id} 
                  onClick={() => setSelectedTemplate(template)}
                  className="p-5 border border-neutral-200/50 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white/50 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">{template.name}</h4>
                    {deployed.includes(template.id) && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Deployed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mb-4">{template.department} • {template.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="text-[10px] font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                        {skill}
                      </span>
                    ))}
                    {template.skills.length > 2 && (
                      <span className="text-[10px] font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                        +{template.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Details Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedTemplate.name}</h2>
                  <p className="text-sm text-neutral-500">{selectedTemplate.role} • {selectedTemplate.department}</p>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                {/* Skills & Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Core Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.skills.map(skill => (
                        <span key={skill} className="text-xs font-medium px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Parameters
                    </h3>
                    <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Temperature</span>
                        <span className="font-medium text-neutral-900">{selectedTemplate.parameters.temperature}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Top P</span>
                        <span className="font-medium text-neutral-900">{selectedTemplate.parameters.topP}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Top K</span>
                        <span className="font-medium text-neutral-900">{selectedTemplate.parameters.topK}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expectations & Restrictions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Expectations
                    </h3>
                    <ul className="space-y-2">
                      {selectedTemplate.expectations.map((exp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> Restrictions
                    </h3>
                    <ul className="space-y-2">
                      {selectedTemplate.restrictions.map((res, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          {res}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-100 bg-white flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeploy(selectedTemplate.id)}
                  disabled={isDeploying || deployed.includes(selectedTemplate.id)}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deploying...
                    </>
                  ) : deployed.includes(selectedTemplate.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Deployed
                    </>
                  ) : (
                    "Deploy Agent"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
