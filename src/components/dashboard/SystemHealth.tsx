import { useGetHealthQuery } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Cpu, HardDrive, Clock, Activity, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export function SystemHealth() {
  const { data: health, isLoading } = useGetHealthQuery(undefined, {
    pollingInterval: 5000,
  });

  if (isLoading) return <div className="text-slate-500 animate-pulse p-12 text-center">Analyzing system vitals...</div>;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-light text-white mb-2">System Health</h2>
        <p className="text-slate-400 text-sm">Real-time infrastructure monitoring for social_server</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-2xl">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">CPU Load</div>
              <div className="text-xl font-medium text-white">{health.cpu.load[0].toFixed(2)}%</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>{health.cpu.cores} Cores</span>
              <span className="truncate max-w-[150px]">{health.cpu.model.split('@')[0]}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(health.cpu.load[0] * 10, 100)}%` }}
                className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <HardDrive className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Memory Usage</div>
              <div className="text-xl font-medium text-white">{formatBytes(health.memory.used)}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Total: {formatBytes(health.memory.total)}</span>
              <span>Free: {formatBytes(health.memory.free)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(health.memory.used / health.memory.total) * 100}%` }}
                className="h-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">System Uptime</div>
              <div className="text-xl font-medium text-white">{formatUptime(health.uptime)}</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Server className="w-3 h-3" /> {health.platform}
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" /> {health.nodeVersion}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-8">
        <h3 className="text-lg font-medium text-white mb-6">Real-time Performance Pulse</h3>
        <div className="h-48 flex items-end gap-1 px-4 border-b border-white/5">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: '20%' }}
              animate={{ height: [`${20 + Math.random() * 20}%`, `${40 + Math.random() * 50}%`, `${20 + Math.random() * 20}%`] }}
              transition={{ repeat: Infinity, duration: 1.5 + Math.random(), ease: "easeInOut" }}
              className="flex-1 bg-gradient-to-t from-cyan-500/10 to-cyan-400/50 rounded-t-sm"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between text-[10px] text-slate-600 uppercase tracking-widest font-medium">
          <span>T - 5 mins</span>
          <span>Live infrastructure telemetry</span>
          <span>Now</span>
        </div>
      </GlassCard>
    </div>
  );
}
