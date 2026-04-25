import { useState } from 'react';
import { useGetPostsQuery, useDeletePostMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Trash2, MessageSquare, Image as ImageIcon, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';

export function PostManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'replies'>('all');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, isLoading } = useGetPostsQuery({ 
    limit: 50,
    search: debouncedSearch,
    type: filterType
  }, {
    pollingInterval: 10000,
  });
  const [deletePost] = useDeletePostMutation();

  const posts = data?.posts || [];

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
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
                  <MessageSquare className="w-3 h-3" /> {post.repliesCount || 0}
                </span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
