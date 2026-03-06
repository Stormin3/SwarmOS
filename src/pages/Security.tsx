import { Shield, Key, Lock, Server, CheckCircle2 } from "lucide-react";

export function Security() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-white">
          <h1 className="text-2xl font-bold tracking-tight">
            Security & Infrastructure
          </h1>
          <p className="text-indigo-100 mt-1">
            Enterprise-grade controls for your Agentic Swarm.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
          System Secure
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-neutral-900">
              <Shield className="w-5 h-5 text-indigo-500" /> Role-Based Access
              Control (RBAC)
            </h3>

            <div className="space-y-4">
              {["Administrators", "HR Managers", "Developers", "Viewers"].map(
                (role, i) => (
                  <div
                    key={role}
                    className="flex items-center justify-between p-3 border border-neutral-200/50 rounded-xl hover:bg-white/50 transition-colors cursor-pointer bg-white/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {role}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {i === 0 ? "Full access" : "Restricted access"}
                      </p>
                    </div>
                    <button className="text-xs text-indigo-600 font-medium">
                      Edit Permissions
                    </button>
                  </div>
                ),
              )}
            </div>
            <button className="mt-4 w-full py-2 border border-dashed border-neutral-300 rounded-xl text-sm font-medium text-neutral-600 hover:bg-white/50 transition-colors">
              + Create Custom Role
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-neutral-900">
              <Key className="w-5 h-5 text-amber-500" /> API Keys & Secrets
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Manage the credentials your agents use to interact with external
              services.
            </p>

            <div className="space-y-3">
              {["OpenAI API", "Stripe Live Key", "AWS Access Key"].map(
                (key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-neutral-200/50"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-700">
                        {key}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      ••••••••••••
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-neutral-900">
              <Server className="w-5 h-5 text-emerald-500" /> Infrastructure
              Roadmap
            </h3>

            <div className="relative border-l-2 border-neutral-100 ml-3 space-y-8">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white"></span>
                <h4 className="text-sm font-bold text-neutral-900">
                  Phase 1: Personal Swarm (Current)
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Local execution, basic RBAC, single-tenant architecture.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </div>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white"></span>
                <h4 className="text-sm font-bold text-neutral-900">
                  Phase 2: Team Collaboration
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Multi-user workspaces, shared agent memory, advanced audit
                  logs.
                </p>
                <div className="mt-2 text-xs text-indigo-600 font-medium">
                  In Progress (Q3)
                </div>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-300 border-4 border-white"></span>
                <h4 className="text-sm font-bold text-neutral-900">
                  Phase 3: Enterprise Scale
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  VPC peering, SSO integration, dedicated compute clusters, SOC2
                  compliance.
                </p>
                <div className="mt-2 text-xs text-neutral-400 font-medium">
                  Planned (Q4)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/90 backdrop-blur-xl text-white p-6 rounded-2xl shadow-xl border border-neutral-800">
            <h3 className="text-lg font-semibold mb-2">Enterprise Upgrade</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Need dedicated infrastructure and HIPAA compliance for your swarm?
            </p>
            <button className="w-full py-2.5 bg-white text-neutral-900 rounded-xl text-sm font-bold hover:bg-neutral-100 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
