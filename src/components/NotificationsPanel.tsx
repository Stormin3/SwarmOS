import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  Wrench, 
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils";

interface Notification {
  id: string;
  type: "critical" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  isResolved?: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "Critical: Needs your attention before we can continue",
    message: "Salesforce integration requires re-authentication to sync new leads. The OAuth token has expired.",
    timestamp: "2 mins ago",
    actionLabel: "Grant Permission",
  },
  {
    id: "2",
    type: "error",
    title: "Bug Fixing Required",
    message: "Data pipeline 'CustomerSync_v2' failed at step 4. Null pointer exception in data transformation.",
    timestamp: "15 mins ago",
    actionLabel: "View Logs & Fix",
  },
  {
    id: "3",
    type: "warning",
    title: "Workflow Paused",
    message: "The 'Q3 Marketing Outreach' workflow was paused due to hitting the daily email sending limit.",
    timestamp: "1 hour ago",
    actionLabel: "Resume Workflow",
  },
  {
    id: "4",
    type: "info",
    title: "App Updates Available",
    message: "Slack integration v2.4 is available with new slash commands and improved latency.",
    timestamp: "3 hours ago",
    actionLabel: "Update Now",
  }
];

export function NotificationsPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const handleAction = (id: string) => {
    // Mark as resolved/processing
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isResolved: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isResolved).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Notifications</h2>
                  <p className="text-sm text-neutral-500">
                    {unreadCount} {unreadCount === 1 ? 'item' : 'items'} need your attention
                  </p>
                </div>
              </div>
              <button 
                aria-label="Close notifications"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.map((notification) => {
                const isResolved = notification.isResolved;
                
                return (
                  <motion.div 
                    layout
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-300",
                      isResolved ? "bg-neutral-50 border-neutral-200 opacity-60" :
                      notification.type === 'critical' ? "bg-red-50/50 border-red-200" :
                      notification.type === 'error' ? "bg-orange-50/50 border-orange-200" :
                      notification.type === 'warning' ? "bg-amber-50/50 border-amber-200" :
                      "bg-blue-50/50 border-blue-200"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        {isResolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : notification.type === 'critical' ? (
                          <ShieldAlert className="w-5 h-5 text-red-600" />
                        ) : notification.type === 'error' ? (
                          <Wrench className="w-5 h-5 text-orange-600" />
                        ) : notification.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        ) : (
                          <RefreshCw className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn(
                            "text-sm font-semibold",
                            isResolved ? "text-neutral-700" :
                            notification.type === 'critical' ? "text-red-900" :
                            notification.type === 'error' ? "text-orange-900" :
                            notification.type === 'warning' ? "text-amber-900" :
                            "text-blue-900"
                          )}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-neutral-500 whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm",
                          isResolved ? "text-neutral-500" : "text-neutral-600"
                        )}>
                          {notification.message}
                        </p>
                        
                        {!isResolved && notification.actionLabel && (
                          <div className="pt-3">
                            <button
                              onClick={() => handleAction(notification.id)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                notification.type === 'critical' ? "bg-red-600 text-white hover:bg-red-700" :
                                notification.type === 'error' ? "bg-orange-600 text-white hover:bg-orange-700" :
                                notification.type === 'warning' ? "bg-amber-600 text-white hover:bg-amber-700" :
                                "bg-blue-600 text-white hover:bg-blue-700"
                              )}
                            >
                              <Play className="w-4 h-4" />
                              {notification.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
