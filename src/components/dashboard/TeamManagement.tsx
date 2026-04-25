import { useState } from 'react';
import { useGetTeamQuery, useAddTeamMemberMutation, useRemoveTeamMemberMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { UserPlus, Shield, Trash2, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TeamManagement() {
  const { data: team, isLoading } = useGetTeamQuery();
  const [addTeamMember] = useAddTeamMemberMutation();
  const [removeTeamMember] = useRemoveTeamMemberMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'MODERATOR',
    level: 2
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTeamMember(formData).unwrap();
      setShowAddForm(false);
      setFormData({ email: '', username: '', password: '', name: '', role: 'MODERATOR', level: 2 });
    } catch (err) {
      alert('Failed to add team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white">Team Management</h2>
          <p className="text-slate-400 text-sm">Manage internal company access levels</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input 
                  type="text" 
                  placeholder="Username" 
                  required
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                >
                  <option value="SUPPORT">Support</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">SuperAdmin</option>
                </select>
                <button type="submit" className="bg-cyan-500 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-cyan-400">
                  Save Member
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 animate-pulse">Loading team...</div>
        ) : team?.map((member: any) => (
          <GlassCard key={member.id} className="relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <button 
                onClick={() => {
                  if (confirm(`Remove ${member.name}?`)) removeTeamMember(member.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-white font-medium">{member.name}</h3>
            <p className="text-cyan-400/70 text-xs mb-3">@{member.username}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-3 h-3" /> {member.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-3 h-3" /> {member.role} (Lvl {member.level})
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
