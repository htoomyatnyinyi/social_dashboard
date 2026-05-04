import { useState } from 'react';
import { useGetPostsQuery, useDeletePostMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Trash2, MessageSquare, Image as ImageIcon, Search, ChevronLeft, ChevronRight, ShieldCheck, AlertCircle, Sparkles, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';

export function PostManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'replies'>('all');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useGetPostsQuery({ 
    limit,
    skip: (page - 1) * limit,
    search: debouncedSearch,
    type: filterType
  }, {
    pollingInterval: 10000,
  });
  const [deletePost] = useDeletePostMutation();

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light text-white">Post Moderation</h2>
          <p className="text-slate-400 text-sm">Review and moderate community content</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value as any); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Content</option>
            <option value="posts">Original Posts</option>
            <option value="replies">Replies Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-500 animate-pulse">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">No posts found.</div>
          ) : posts.map((post: any) => (
            <GlassCard 
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xs">
                    <div className="text-slate-200 font-medium">{post.author.name}</div>
                    <div className="text-cyan-400/70">@{post.author.username}</div>
                  </div>
                </div>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-300 mb-4 line-clamp-3 font-light leading-relaxed">
                {post.content || <span className="italic text-slate-500">No content</span>}
              </p>

              {post.image && (
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4 border border-white/5">
                  <img src={post.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Post content" />
                  <div className="absolute top-2 right-2">
                    <ImageIcon className="w-4 h-4 text-white/50" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {post.replyCount || 0}
                </span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              {/* AI Insights Bar */}
              <div className="mt-4 flex flex-wrap gap-2">
                {post.aiModerated && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider ${
                    post.aiModerationResult === 'SAFE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    AI: {post.aiModerationResult}
                  </div>
                )}
                
                {post.aiFactChecked && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider ${
                    post.aiFactCheckResult === 'VERIFIED' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : post.aiFactCheckResult === 'MISLEADING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    Fact: {post.aiFactCheckResult}
                  </div>
                )}

                {post.aiSentiment !== null && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider ${
                    post.aiSentiment > 0.3 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : post.aiSentiment < -0.3
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    Sentiment: {post.aiSentiment.toFixed(1)}
                  </div>
                )}
              </div>

              {post.aiFactCheckSummary && (
                <div className="mt-3 p-2 bg-white/5 rounded-lg text-[10px] text-slate-400 border border-white/5 italic">
                  <div className="flex items-center gap-1 mb-1 font-semibold not-italic text-blue-400 uppercase tracking-tight">
                    <Info className="w-3 h-3" /> AI Context
                  </div>
                  "{post.aiFactCheckSummary}"
                </div>
              )}
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-slate-400">
            Showing <span className="text-slate-200">{(page - 1) * limit + 1}</span> to <span className="text-slate-200">{Math.min(page * limit, total)}</span> of <span className="text-slate-200">{total}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
