import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GlassCard } from "@/components/dashboard/GlassCard"
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart"
import { UserManagement } from "@/components/dashboard/UserManagement"
import { PostManagement } from "@/components/dashboard/PostManagement"
import { ReportManagement } from "@/components/dashboard/ReportManagement"
import { TeamManagement } from "@/components/dashboard/TeamManagement"
import { SettingsManagement } from "@/components/dashboard/SettingsManagement"
import { SystemHealth } from "@/components/dashboard/SystemHealth"
import Login from "@/components/Login"
import { useGetStatsQuery, useSendBroadcastMutation } from "@/store/api/dashboardApi"
import { useAppSelector } from "@/store/hooks"
import type { ViewType } from "@/components/layout/Sidebar"
import { Users, Activity, MessageSquare, TrendingUp, Bell, AlertTriangle, ShieldCheck } from "lucide-react"

export function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [sendBroadcast] = useSendBroadcastMutation()
  
  const { data, isLoading } = useGetStatsQuery(undefined, {
    pollingInterval: 5000,
    skip: !isAuthenticated, // Don't fetch if not authenticated
  })

  if (!isAuthenticated) {
    return <Login />
  }

  const stats = data?.metrics
  const recentUsers = data?.recentUsers || []

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'posts':
        return <PostManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'team':
        return <TeamManagement />;
      case 'health':
        return <SystemHealth />;
      case 'settings':
        return <SettingsManagement />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-light tracking-tight text-white">
                    Welcome back, <span className="font-semibold text-gradient-cyan">Admin</span>
                  </h1>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full ml-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-cyan-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <p className="text-slate-400 font-light">Monitoring real-time platform activity.</p>
              </div>
              <div className="flex gap-4">
                <GlassCard 
                  onClick={() => {
                    const content = prompt("Enter broadcast message:");
                    if (content) sendBroadcast({ content });
                  }} 
                  className="p-3 rounded-full cursor-pointer group" 
                  hoverEffect={true}
                >
                  <Bell className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </GlassCard>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard onClick={() => setActiveView('users')} className="cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-xl">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Total Users</h3>
                <div className="text-3xl font-light text-white">
                  {isLoading ? "..." : stats?.totalUsers || 0}
                </div>
              </GlassCard>
              
              <GlassCard onClick={() => setActiveView('posts')} transition={{ delay: 0.1 }} className="cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Total Posts</h3>
                <div className="text-3xl font-light text-white">
                  {isLoading ? "..." : stats?.totalPosts || 0}
                </div>
              </GlassCard>
              
              <GlassCard transition={{ delay: 0.2 }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Total Replies</h3>
                <div className="text-3xl font-light text-white">
                  {isLoading ? "..." : stats?.totalReplies || 0}
                </div>
              </GlassCard>
              
              <GlassCard onClick={() => setActiveView('reports')} transition={{ delay: 0.3 }} className="cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-red-500/10 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Reports</h3>
                <div className="text-3xl font-light text-white">
                  {isLoading ? "..." : stats?.totalReports || 0}
                </div>
              </GlassCard>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2" transition={{ delay: 0.4 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-white">Engagement Overview</h2>
                  <select className="bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg px-3 py-1 text-sm outline-none focus:border-cyan-500 transition-colors">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This Year</option>
                  </select>
                </div>
                <AnalyticsChart />
              </GlassCard>
              
              <GlassCard transition={{ delay: 0.5 }}>
                <h2 className="text-lg font-medium text-white mb-6">Recent Signups</h2>
                <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="text-slate-400 animate-pulse text-sm">Loading recent users...</div>
                  ) : recentUsers.length > 0 ? (
                    recentUsers.map((user: any) => (
                      <div key={user.id} className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                          <img 
                            src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                            alt={user.username} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{user.name || user.username}</p>
                          <p className="text-xs text-cyan-400/70 truncate">@{user.username}</p>
                        </div>
                        <div className="text-xs text-slate-500 shrink-0">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                     <div className="text-slate-500 text-sm">No recent signups.</div>
                  )}
                </div>
                <button 
                  onClick={() => setActiveView('users')}
                  className="w-full mt-6 py-2 text-xs text-cyan-400 border border-cyan-400/20 rounded-xl hover:bg-cyan-400/5 transition-colors"
                >
                  View All Users
                </button>
              </GlassCard>
            </div>
          </>
        );
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </DashboardLayout>
  )
}

export default App
