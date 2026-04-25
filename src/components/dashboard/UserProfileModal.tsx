import { useGetUserDetailsQuery } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { X, MapPin, Link as LinkIcon, Calendar, MessageSquare, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
}

export function UserProfileModal({ userId, onClose }: UserProfileModalProps) {
  const { data: user, isLoading } = useGetUserDetailsQuery(userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <GlassCard className="h-full flex flex-col p-0 relative border-white/10 shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center text-cyan-400/50 animate-pulse">
              Loading intelligence profile...
            </div>
          ) : user ? (
            <div className="overflow-y-auto custom-scrollbar">
              {/* Cover & Avatar */}
              <div className="relative h-32 bg-slate-800">
                {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover opacity-50" />}
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 border-[#0F172A] bg-slate-900 overflow-hidden shadow-xl relative">
                    <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" />
                    {(() => {
                      const diff = Math.floor((Date.now() - new Date(user.lastSeen).getTime()) / (1000 * 60));
                      if (diff < 5) return (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-[#0F172A] rounded-full shadow-lg" title="Online" />
                      );
                      return null;
                    })()}
                  </div>
                </div>
              </div>

              <div className="mt-14 px-6 pb-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
                  <p className="text-cyan-400">@{user.username}</p>
                </div>

                <p className="text-slate-300 text-sm mb-6 leading-relaxed font-light">
                  {user.bio || 'No intelligence briefing available for this operative.'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {user.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" /> {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <LinkIcon className="w-3 h-3" /> 
                      <a href={user.website} target="_blank" rel="noreferrer" className="text-cyan-400 truncate hover:underline">
                        {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-8 mb-8 border-y border-white/5 py-4">
                  <div>
                    <div className="text-xl font-light text-white">{user._count.posts}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-xl font-light text-white">{user._count.followers}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl font-light text-white">{user._count.following}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Following</div>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-slate-200 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {user.posts.length > 0 ? user.posts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex gap-4 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post._count.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post._count.replies}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-slate-500 text-sm italic">No recent posts found.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
             <div className="p-12 text-center text-slate-400">Subject not found in database.</div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
