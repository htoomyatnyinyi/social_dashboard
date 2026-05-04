import { useState } from "react"
import { useGetReportQuery, useGetOnlineUsersQuery } from "@/store/api/dashboardApi"
import { GlassCard } from "./GlassCard"
import {
  FileBarChart,
  Users,
  MessageSquare,
  Heart,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  Wifi,
  Clock,
  Calendar,
  Trophy,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export function ReportGeneration() {
  const [period, setPeriod] = useState("7d")
  const { data: report, isLoading, isFetching, refetch } = useGetReportQuery({ period })
  const { data: onlineData } = useGetOnlineUsersQuery(undefined, {
    pollingInterval: 10000,
  })

  const summary = report?.summary
  const dailyData = report?.dailyData || []
  const topUsers = report?.topUsers || []
  const onlineUsers = onlineData?.onlineUsers || []

  const handleExportJSON = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `platform-report-${period}-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
            <FileBarChart className="w-7 h-7 text-cyan-400" />
            Platform Report
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate comprehensive platform analytics and export reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-300 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleExportJSON}
            disabled={!report}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 animate-pulse">
          Generating report...
        </div>
      ) : (
        <>
          {/* Online Status Banner */}
          <GlassCard className="p-6 border-l-4 border-l-emerald-500/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Wifi className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-light text-white">
                    {onlineData?.onlineNow ?? summary?.onlineNow ?? 0}
                  </div>
                  <div className="text-sm text-slate-400">Users Online Now</div>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                    <Clock className="w-3 h-3" /> Last Hour
                  </div>
                  <div className="text-xl font-light text-white">
                    {onlineData?.activeLastHour ?? "—"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                    <Calendar className="w-3 h-3" /> Today
                  </div>
                  <div className="text-xl font-light text-white">
                    {onlineData?.activeToday ?? "—"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                    <Users className="w-3 h-3" /> Total
                  </div>
                  <div className="text-xl font-light text-white">
                    {onlineData?.totalUsers ?? summary?.totalUsers ?? "—"}
                  </div>
                </div>
              </div>

              {/* Online Users Avatars */}
              {onlineUsers.length > 0 && (
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 8).map((u: any) => (
                      <div
                        key={u.id}
                        className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800"
                        title={`@${u.username}`}
                      >
                        <img
                          src={
                            u.image ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                          }
                          alt={u.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {onlineUsers.length > 8 && (
                      <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                        +{onlineUsers.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              {
                label: "New Users",
                value: summary?.newUsers ?? 0,
                total: summary?.totalUsers ?? 0,
                icon: Users,
                color: "cyan",
              },
              {
                label: "New Posts",
                value: summary?.newPosts ?? 0,
                total: summary?.totalPosts ?? 0,
                icon: MessageSquare,
                color: "purple",
              },
              {
                label: "New Likes",
                value: summary?.newLikes ?? 0,
                total: summary?.totalLikes ?? 0,
                icon: Heart,
                color: "rose",
              },
              {
                label: "New Reports",
                value: summary?.newReports ?? 0,
                total: summary?.totalReports ?? 0,
                icon: AlertTriangle,
                color: "amber",
              },
              {
                label: "New Messages",
                value: summary?.newMessages ?? 0,
                total: summary?.totalMessages ?? 0,
                icon: MessageSquare,
                color: "emerald",
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <GlassCard key={stat.label} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 bg-${stat.color}-500/10 rounded-lg`}>
                      <Icon
                        className={`w-4 h-4 text-${stat.color}-400`}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-light text-white mb-1">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <TrendingUp className="w-3 h-3" />
                    of {stat.total.toLocaleString()} total
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Daily Activity Trend
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                      }}
                      itemStyle={{ color: "#F8FAFC" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="newPosts"
                      name="Posts"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPosts)"
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      name="Users"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Engagement Breakdown
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#F8FAFC" }}
                    />
                    <Bar
                      dataKey="newLikes"
                      name="Likes"
                      fill="#F43F5E"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                    <Bar
                      dataKey="newPosts"
                      name="Posts"
                      fill="#06B6D4"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Top Users & Recent Audit Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Top Active Users
              </h3>
              <div className="space-y-4">
                {topUsers.map((u: any, i: number) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 w-5 text-right">
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                      <img
                        src={
                          u.image ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                        }
                        alt={u.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-200 truncate">
                        {u.name || u.username}
                      </div>
                      <div className="text-xs text-cyan-400/70">@{u.username}</div>
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span>
                        <span className="text-slate-300">{u._count?.posts || 0}</span>{" "}
                        posts
                      </span>
                      <span>
                        <span className="text-slate-300">
                          {u._count?.followers || 0}
                        </span>{" "}
                        followers
                      </span>
                    </div>
                  </div>
                ))}
                {topUsers.length === 0 && (
                  <div className="text-sm text-slate-500 text-center py-4">
                    No user data available
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Platform Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Follows", value: summary?.totalFollows ?? 0 },
                  { label: "Total Replies", value: summary?.totalReplies ?? 0 },
                  { label: "New Replies", value: summary?.newReplies ?? 0 },
                  { label: "Audit Actions", value: summary?.auditActions ?? 0 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/3 rounded-xl p-4 border border-white/5"
                  >
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className="text-xl font-light text-white">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              {report?.generatedAt && (
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-600 text-center">
                  Report generated at{" "}
                  {new Date(report.generatedAt).toLocaleString()}
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  )
}
