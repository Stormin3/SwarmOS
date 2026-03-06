import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Settings,
  UserPlus,
  Plug,
  Menu,
  X,
  FolderKanban,
  Bell,
  Palette
} from "lucide-react";
import { cn } from "../lib/utils";
import { NotificationsPanel } from "./NotificationsPanel";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Directory", href: "/directory", icon: Users },
  { name: "HR Expert", href: "/hr", icon: UserPlus },
  { name: "Comms", href: "/chat", icon: MessageSquare },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Brand Kit", href: "/brand-kit", icon: Palette },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a192f] via-[#173a5e] to-[#ffedd5] text-neutral-900 font-sans overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl border-r border-white/20 flex flex-col transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              S
            </span>
            SwarmOS
          </h1>
          <button 
            className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-4">
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
            Agentic Orchestra
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-indigo-600" : "text-neutral-400",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200/50">
          <div className="flex items-center gap-3">
            <img
              src="https://picsum.photos/seed/admin/100/100"
              alt="Admin"
              className="w-10 h-10 rounded-full border border-neutral-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-neutral-500">Enterprise Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-neutral-800 truncate">
              {NAV_ITEMS.find((i) => i.href === location.pathname)?.name ||
                "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="hidden sm:inline">System Operational</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
}
