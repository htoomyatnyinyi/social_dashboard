import { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Trash2, Search, CheckCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import { UserProfileModal } from './UserProfileModal';

// Quick interface for better DX
interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  isVerified: boolean;
  lastSeen: string;
  createdAt: string;
  _count?: {
    posts: number;
    followers: number;
  };
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useGetUsersQuery({ 
    limit: 50, 
    search: debouncedSearch 
  }, {
    pollingInterval: 10000,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users: User[] = data?.users || [];

  const handleToggleAdmin = (user: User) => {
    updateUser({ id: user.id, data: { isAdmin: !user.isAdmin } });
  };

  const handleToggleVerified = (user: User) => {
    updateUser({ id: user.id, data: { isVerified: !user.isVerified } });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {selectedUserId && (
          <UserProfileModal 
            userId={selectedUserId} 
            onClose={() => setSelectedUserId(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light text-white">User Management</h2>
          <p className="text-slate-400 text-sm">Audit and manage platform participants</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading users...</td>
                  </tr>
                ) : users.map((user) => {
                  const lastSeenDate = new Date(user.lastSeen);
                  const diffMinutes = Math.floor((Date.now() - lastSeenDate.getTime()) / (1000 * 60));
                  const isOnline = diffMinutes < 5;

                  return (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      {/* USER INFO */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 cursor-pointer hover:border-cyan-500/50 transition-colors relative"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <img 
                              src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                              alt={user.username} 
                              className="w-full h-full object-cover"
                            />
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            )}
                          </div>
                          <div>
                            <div 
                              className="text-sm font-medium text-slate-200 flex items-center gap-1 cursor-pointer hover:text-cyan-400 transition-colors"
                              onClick={() => setSelectedUserId(user.id)}
                            >
                              {user.name || user.username}
                              {user.isVerified && <CheckCircle className="w-3 h-3 text-cyan-400 fill-cyan-400/10" />}
                            </div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* ACTIVITY */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isOnline ? 'Online Now' : 'Last Active'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {isOnline ? 'Active on platform' : 
                             diffMinutes < 60 ? `${diffMinutes}m ago` : 
                             diffMinutes < 1440 ? `${Math.floor(diffMinutes/60)}h ago` : 
                             `${Math.floor(diffMinutes/1440)}d ago`}
                          </span>
                        </div>
                      </td>

                      {/* PERMISSIONS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleVerified(user)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              user.isVerified 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                            }`}
                          >
                            {user.isVerified ? 'Verified' : 'Verify'}
                          </button>
                          <button 
                            onClick={() => handleToggleAdmin(user)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              user.isAdmin 
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                            }`}
                          >
                            {user.isAdmin ? 'Admin' : 'Make Admin'}
                          </button>
                        </div>
                      </td>

                      {/* JOINED */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* STATS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span title="Posts"><span className="text-slate-200">{user._count?.posts || 0}</span> P</span>
                          <span title="Followers"><span className="text-slate-200">{user._count?.followers || 0}</span> F</span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedUserId(user.id)}
                            className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user @${user.username}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
// import { useState } from 'react';
// import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '@/store/api/dashboardApi';
// import { GlassCard } from './GlassCard';
// import { Trash2, Shield, Search, Filter, CheckCircle, XCircle, Eye } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useDebounce } from '@/hooks/use-debounce';
// import { UserProfileModal } from './UserProfileModal';

// export function UserManagement() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const debouncedSearch = useDebounce(searchTerm, 500);
//   const { data, isLoading } = useGetUsersQuery({ 
//     limit: 50, 
//     search: debouncedSearch 
//   }, {
//     pollingInterval: 10000,
//   });
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUser] = useUpdateUserMutation();

//   const users = data?.users || [];

//   const handleToggleAdmin = (user: any) => {
//     updateUser({ id: user.id, data: { isAdmin: !user.isAdmin } });
//   };

//   const handleToggleVerified = (user: any) => {
//     updateUser({ id: user.id, data: { isVerified: !user.isVerified } });
//   };

//   return (
//     <div className="space-y-6">
//       <AnimatePresence>
//         {selectedUserId && (
//           <UserProfileModal 
//             userId={selectedUserId} 
//             onClose={() => setSelectedUserId(null)} 
//           />
//         )}
//       </AnimatePresence>

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-light text-white">User Management</h2>
//           <p className="text-slate-400 text-sm">Audit and manage platform participants</p>
//         </div>
        
//         <div className="flex gap-3 w-full md:w-auto">
//           <div className="relative flex-1 md:w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//             <input 
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       <GlassCard className="overflow-hidden p-0">
//         <div className="overflow-x-auto custom-scrollbar">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-white/5 bg-white/2">
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Activity</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Permissions</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
//                 <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               <AnimatePresence mode="popLayout">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading users...</td>
//                   </tr>
//                 ) : users.map((user: any) => {
//                   const lastSeenDate = new Date(user.lastSeen);
//                   const now = new Date();
//                   const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
//                   const isOnline = diffMinutes < 5;

//                   return (
//                     <motion.tr 
//                       key={user.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0, x: -20 }}
//                       className="hover:bg-white/2 transition-colors group"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-3">
//                           <div 
//                             className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 cursor-pointer hover:border-cyan-500/50 transition-colors relative"
//                             onClick={() => setSelectedUserId(user.id)}
//                           >
//                             <img 
//                               src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
//                               alt={user.username} 
//                               className="w-full h-full object-cover"
//                             />
//                             {isOnline && (
//                               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Online" />
//                             )}
//                           </div>
//                           <div>
//                             <div 
//                               className="text-sm font-medium text-slate-200 flex items-center gap-1 cursor-pointer hover:text-cyan-400 transition-colors"
//                               onClick={() => setSelectedUserId(user.id)}
//                             >
//                               {user.name || user.username}
//                               {user.isVerified && <CheckCircle className="w-3 h-3 text-cyan-400 fill-cyan-400/10" />}
//                             </div>
//                             <div className="text-xs text-slate-500">{user.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
//                             {isOnline ? 'Online Now' : 'Last Active'}
//                           </span>
//                           <span className="text-xs text-slate-400">
//                             {isOnline ? 'Active on platform' : 
//                              diffMinutes < 60 ? `${diffMinutes}m ago` : 
//                              diffMinutes < 1440 ? `${Math.floor(diffMinutes/60)}h ago` : 
//                              `${Math.floor(diffMinutes/1440)}d ago`}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex gap-2">
//                           <button 
//                             onClick={() => handleToggleVerified(user)}
//                             className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
//                               user.isVerified 
//                                 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
//                                 : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
//                             }`}
//                           >
//                             {user.isVerified ? 'Verified' : 'Verify'}
//                           </button>
//                           <button 
//                             onClick={() => handleToggleAdmin(user)}
//                             className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
//                               user.isAdmin 
//                                 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
//                                 : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
//                             }`}
//                           >
//                             {user.isAdmin ? 'Admin' : 'Make Admin'}
//                           </button>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
//                         {new Date(user.createdAt).toLocaleDateString()}
//                       </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex gap-4 text-xs text-slate-400">
//                         <span title="Posts"><span className="text-slate-200">{user._count.posts}</span> P</span>
//                         <span title="Followers"><span className="text-slate-200">{user._count.followers}</span> F</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right">
//                       <div className="flex justify-end gap-2">
//                         <button 
//                           onClick={() => setSelectedUserId(user.id)}
//                           className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
//                           title="View Profile"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button 
//                           onClick={() => {
//                             if (confirm(`Are you sure you want to delete user @${user.username}?`)) {
//                               deleteUser(user.id);
//                             }
//                           }}
//                           className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
//                           title="Delete User"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       </GlassCard>
//     </div>
//   );
// }

