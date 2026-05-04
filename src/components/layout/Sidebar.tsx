import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, Settings, Activity, Hexagon, Server, LogOut, AlertTriangle, ShieldCheck, ScrollText, FileBarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export type ViewType = 'dashboard' | 'users' | 'posts' | 'ai-audit' | 'reports' | 'team' | 'settings' | 'analytics' | 'health' | 'activity' | 'reports-gen';

const navItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analytics' as ViewType, icon: Activity, label: 'Analytics' },
  { id: 'users' as ViewType, icon: Users, label: 'Users' },
  { id: 'posts' as ViewType, icon: MessageSquare, label: 'Posts' },
  { id: 'ai-audit' as ViewType, icon: ShieldCheck, label: 'AI Audit Center' },
  { id: 'reports' as ViewType, icon: AlertTriangle, label: 'Reports' },
  { id: 'activity' as ViewType, icon: ScrollText, label: 'Activity Logs' },
  { id: 'reports-gen' as ViewType, icon: FileBarChart, label: 'Reports & Online' },
  { id: 'team' as ViewType, icon: ShieldCheck, label: 'Team' },
  { id: 'health' as ViewType, icon: Server, label: 'Health' },
  { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const dispatch = useAppDispatch();

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed left-6 top-6 bottom-6 w-20 flex flex-col items-center py-8 glass-panel rounded-3xl z-50"
    >
      <div className="mb-12 relative group cursor-pointer" onClick={() => onViewChange('dashboard')}>
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <Hexagon className="w-10 h-10 text-cyan-400 relative z-10" strokeWidth={1.5} />
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onViewChange(item.id)}
            className={cn(
              "p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative",
              activeView === item.id ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "text-muted-foreground hover:text-cyan-400 hover:bg-white/5"
            )}
            title={item.label}
          >
            <item.icon className="w-6 h-6" strokeWidth={activeView === item.id ? 2 : 1.5} />
            {activeView === item.id && (
              <motion.div 
                layoutId="active-nav" 
                className="absolute inset-0 border border-cyan-400/30 rounded-2xl pointer-events-none"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}

        <div 
          onClick={() => dispatch(logout())}
          className="p-3 rounded-2xl cursor-pointer transition-all duration-300 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 mt-auto"
          title="Logout"
        >
          <LogOut className="w-6 h-6" strokeWidth={1.5} />
        </div>
      </nav>
      
      <div className="mt-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-[2px] cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-shadow">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Antigravity" alt="User" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

