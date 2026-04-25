import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Settings, Lock, UserPlus, Brain, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsManagement() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const handleToggle = (key: string, value: boolean) => {
    updateSettings({ [key]: value });
  };

  if (isLoading) return <div className="py-12 text-center text-slate-500 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-white">System Settings</h2>
        <p className="text-slate-400 text-sm">Configure global platform behavior and security</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard className="p-8">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-red-500/10 rounded-2xl">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-medium text-white">Maintenance Mode</h3>
                <div 
                  onClick={() => handleToggle('maintenanceMode', !settings?.maintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${settings?.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.maintenanceMode ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
              <p className="text-sm text-slate-400">If enabled, the platform will be inaccessible to regular users. Admins can still log in.</p>
              {settings?.maintenanceMode && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-400/10 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  System is currently in lockdown.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-cyan-500/10 rounded-2xl">
              <UserPlus className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-medium text-white">Public Registration</h3>
                <div 
                  onClick={() => handleToggle('registrationOpen', !settings?.registrationOpen)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${settings?.registrationOpen ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.registrationOpen ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
              <p className="text-sm text-slate-400">Allow new users to create accounts on the platform.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-medium text-white">AI Content Moderation</h3>
                <div 
                  onClick={() => handleToggle('aiModerationEnabled', !settings?.aiModerationEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${settings?.aiModerationEnabled ? 'bg-purple-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.aiModerationEnabled ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
              <p className="text-sm text-slate-400">Use AI to automatically flag potentially harmful content in real-time.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="pt-4 flex justify-end">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Save className="w-4 h-4" />
          Settings are saved automatically on change.
        </div>
      </div>
    </div>
  );
}
