import { useState } from "react";
import { 
  Building, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Sliders,
  Key,
  Globe,
  Database,
  Save,
  CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";

type Tab = "general" | "notifications" | "security" | "billing" | "advanced";

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your enterprise workspace preferences and configurations.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <TabButton 
            active={activeTab === "general"} 
            onClick={() => setActiveTab("general")} 
            icon={Building} 
            label="General" 
          />
          <TabButton 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")} 
            icon={Bell} 
            label="Notifications" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={ShieldCheck} 
            label="Security & Access" 
          />
          <TabButton 
            active={activeTab === "billing"} 
            onClick={() => setActiveTab("billing")} 
            icon={CreditCard} 
            label="Billing & Usage" 
          />
          <div className="pt-4 mt-4 border-t border-neutral-200/50">
            <TabButton 
              active={activeTab === "advanced"} 
              onClick={() => setActiveTab("advanced")} 
              icon={Sliders} 
              label="Advanced Settings" 
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden min-h-[500px]">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "advanced" && <AdvancedSettings />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        active 
          ? "bg-indigo-50 text-indigo-700 shadow-sm" 
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "text-indigo-600" : "text-neutral-400")} />
      {label}
    </button>
  );
}

function GeneralSettings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Workspace Details</h2>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Workspace Name</label>
            <input 
              type="text" 
              defaultValue="Acme Corp" 
              className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Workspace URL</label>
            <div className="flex items-center">
              <span className="px-4 py-2 bg-neutral-100 border border-r-0 border-neutral-200/50 rounded-l-xl text-neutral-500 text-sm">
                swarmos.com/
              </span>
              <input 
                type="text" 
                defaultValue="acme-corp" 
                className="flex-1 px-4 py-2 rounded-r-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200/50">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Localization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Timezone</label>
            <select className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option>Pacific Time (PT)</option>
              <option>Eastern Time (ET)</option>
              <option>Coordinated Universal Time (UTC)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Language</label>
            <select className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option>English (US)</option>
              <option>Spanish (ES)</option>
              <option>French (FR)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Alert Preferences</h2>
        <div className="space-y-4">
          <ToggleRow 
            title="System Alerts" 
            description="Get notified about critical system updates and maintenance."
            defaultChecked={true}
          />
          <ToggleRow 
            title="Agent Activity" 
            description="Receive digests of agent task completions and escalations."
            defaultChecked={true}
          />
          <ToggleRow 
            title="Security Events" 
            description="Alerts for new sign-ins, failed attempts, and role changes."
            defaultChecked={true}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200/50">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Channels</h2>
        <div className="space-y-4">
          <ToggleRow 
            title="Email Notifications" 
            description="Send alerts to your registered email address."
            defaultChecked={true}
          />
          <ToggleRow 
            title="Slack Integration" 
            description="Route notifications to your connected Slack workspace."
            defaultChecked={false}
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Authentication</h2>
        <div className="space-y-4">
          <ToggleRow 
            title="Require Two-Factor Authentication (2FA)" 
            description="Mandate 2FA for all users in this workspace."
            defaultChecked={false}
          />
          <ToggleRow 
            title="Single Sign-On (SSO)" 
            description="Allow users to authenticate via SAML or Google Workspace."
            defaultChecked={true}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200/50">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Session Management</h2>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Idle Session Timeout</label>
            <select className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
              <option>4 Hours</option>
              <option>Never</option>
            </select>
            <p className="text-xs text-neutral-500 mt-2">Automatically log out users after a period of inactivity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Current Plan</h2>
        <div className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-900">Enterprise Orchestration</h3>
            <p className="text-sm text-indigo-700 mt-1">Unlimited agents, priority support, custom models.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-900">$2,499<span className="text-sm font-normal text-indigo-700">/mo</span></p>
            <button className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">Manage Plan</button>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200/50">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Compute Usage (This Month)</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Agent Inferences</span>
              <span className="text-neutral-500">8.4M / 10M</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Storage</span>
              <span className="text-neutral-500">420GB / 1TB</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedSettings() {
  return (
    <div className="p-8 space-y-8">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Sliders className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-amber-900">Advanced Configuration</h3>
          <p className="text-sm text-amber-700 mt-1">These settings can significantly alter the behavior of your SwarmOS instance. Proceed with caution.</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">API & Webhooks</h2>
        <div className="space-y-4">
          <div className="p-4 border border-neutral-200/50 rounded-xl bg-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">API Keys</p>
                <p className="text-sm text-neutral-500">Manage keys for external integrations.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">Manage</button>
          </div>
          <div className="p-4 border border-neutral-200/50 rounded-xl bg-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Webhooks</p>
                <p className="text-sm text-neutral-500">Configure event-driven callbacks.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">Manage</button>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200/50">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Data Management</h2>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Data Retention Policy</label>
            <select className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option>30 Days</option>
              <option>90 Days</option>
              <option>1 Year</option>
              <option>Indefinite</option>
            </select>
          </div>
          <div className="pt-4">
            <button className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2">
              <Database className="w-4 h-4" /> Purge Cache & Temporary Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200/50 rounded-xl bg-white/50">
      <div>
        <p className="font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          checked ? "bg-indigo-600" : "bg-neutral-200"
        )}
      >
        <span 
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
