import { useState } from "react"
import { useGetAuditLogsQuery } from "@/store/api/dashboardApi"
import { GlassCard } from "./GlassCard"
import {
  ScrollText,
  UserMinus,
  UserCog,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle,
  UserPlus,
  Settings,
  Bell,
  LogIn,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const ACTION_CONFIG: Record<
  string,
  { icon: any; color: string; bgColor: string; label: string }
> = {
  USER_DELETED: {
    icon: UserMinus,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "User Deleted",
  },
  USER_UPDATED: {
    icon: UserCog,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "User Updated",
  },
  USER_VERIFIED: {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "User Verified",
  },
  USER_ADMIN_TOGGLED: {
    icon: ShieldAlert,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Admin Toggled",
  },
  POST_DELETED: {
    icon: Trash2,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "Post Deleted",
  },
  REPORT_DISMISSED: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Report Dismissed",
  },
  REPORT_ACTIONED: {
    icon: ShieldAlert,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    label: "Report Actioned",
  },
  TEAM_MEMBER_ADDED: {
    icon: UserPlus,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    label: "Team Added",
  },
  TEAM_MEMBER_REMOVED: {
    icon: UserMinus,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "Team Removed",
  },
  SETTINGS_UPDATED: {
    icon: Settings,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "Settings Changed",
  },
  BROADCAST_SENT: {
    icon: Bell,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    label: "Broadcast Sent",
  },
  ADMIN_LOGIN: {
    icon: LogIn,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Admin Login",
  },
  ADMIN_LOGOUT: {
    icon: LogOut,
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    label: "Admin Logout",
  },
  SYSTEM_EVENT: {
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    label: "System Event",
  },
}

const FILTER_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "USER_DELETED", label: "User Deleted" },
  { value: "USER_UPDATED", label: "User Updated" },
  { value: "POST_DELETED", label: "Post Deleted" },
  { value: "REPORT_DISMISSED", label: "Report Dismissed" },
  { value: "TEAM_MEMBER_ADDED", label: "Team Added" },
  { value: "TEAM_MEMBER_REMOVED", label: "Team Removed" },
  { value: "SETTINGS_UPDATED", label: "Settings Changed" },
  { value: "BROADCAST_SENT", label: "Broadcast Sent" },
  { value: "ADMIN_LOGIN", label: "Admin Login" },
]

export function ActivityLogs() {
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState("")
  const limit = 20

  const { data, isLoading } = useGetAuditLogsQuery(
    {
      limit,
      skip: (page - 1) * limit,
      action: actionFilter || undefined,
    },
    { pollingInterval: 15000 }
  )

  const logs = data?.logs || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
            <ScrollText className="w-7 h-7 text-cyan-400" />
            Activity Logs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track all admin actions and system events in real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400">
            {total} entries
          </div>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="px-6 py-16 text-center text-slate-500 animate-pulse">
                Loading activity logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="px-6 py-16 text-center text-slate-500">
                <ScrollText className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                <p>No activity logs found.</p>
                <p className="text-xs mt-1">Actions will appear here as they happen.</p>
              </div>
            ) : (
              logs.map((log: any, index: number) => {
                const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.SYSTEM_EVENT
                const Icon = config.icon

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="px-6 py-4 hover:bg-white/2 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-xl ${config.bgColor} shrink-0 mt-0.5`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${config.bgColor} ${config.color} border border-current/10`}
                          >
                            {config.label}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(log.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="font-medium text-slate-200">
                            {log.actorName || "System"}
                          </span>
                          {log.targetType && (
                            <>
                              <span className="text-slate-500">→</span>
                              <span className="text-slate-400">
                                {log.targetType}
                                {log.targetId && (
                                  <span className="text-cyan-400/60 ml-1 font-mono text-xs">
                                    #{log.targetId.slice(-6)}
                                  </span>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        {log.details && (
                          <div className="mt-1.5 text-xs text-slate-500 font-mono bg-white/3 px-3 py-1.5 rounded-lg max-w-lg truncate">
                            {typeof log.details === "string"
                              ? log.details
                              : JSON.stringify(log.details).slice(0, 120)}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="text-slate-200">{(page - 1) * limit + 1}</span> to{" "}
              <span className="text-slate-200">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="text-slate-200">{total}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 text-slate-300" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
