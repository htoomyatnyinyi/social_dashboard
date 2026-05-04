import { useState } from 'react';
import { useGetAiAuditQuery, useDeletePostMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { Trash2, ShieldAlert, Sparkles, TrendingDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function AiAuditCenter() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetAiAuditQuery({ 
    limit,
    skip: (page - 1) * limit 
  }, {
    pollingInterval: 30000,
  });
  
  const [deletePost] = useDeletePostMutation();

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            AI Audit Center
          </h2>
          <p className="text-slate-400 text-sm">Review content flagged by AI for moderation or fact-checking</p>
        </div>
        
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Pending Review</div>
          <div className="text-xl font-light text-white">{total}</div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 animate-pulse">Scanning database...</div>
          ) : posts.length === 0 ? (
            <GlassCard className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <ShieldAlert className="w-12 h-12 text-emerald-500/20" />
                <p className="text-slate-400">All clear! No AI-flagged content pending review.</p>
              </div>
            </GlassCard>
          ) : posts.map((post: any) => (
            <GlassCard 
              key={post.id}
              className="border-l-4 border-l-red-500/50"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {post.author.image ? (
                          <img src={post.author.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs font-bold text-slate-500">{post.author.name[0]}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{post.author.name}</div>
                        <div className="text-xs text-cyan-400/70">@{post.author.username}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {post.aiModerationResult !== 'SAFE' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        Moderation: {post.aiModerationResult}
                        {post.aiModerationReason && <span className="ml-2 font-normal lowercase italic text-red-400/60">— {post.aiModerationReason}</span>}
                      </div>
                    )}
                    
                    {post.aiFactCheckResult === 'MISLEADING' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-400 font-bold uppercase">
                        <Sparkles className="w-3 h-3" />
                        Fact Check: {post.aiFactCheckResult}
                      </div>
                    )}

                    {post.aiSentiment < -0.7 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] text-purple-400 font-bold uppercase">
                        <TrendingDown className="w-3 h-3" />
                        Extreme Toxicity
                      </div>
                    )}
                  </div>
                  
                  {post.aiFactCheckSummary && (
                    <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-300/80 italic">
                      <span className="font-bold not-italic text-blue-400 mr-2 uppercase text-[10px]">AI Context:</span>
                      "{post.aiFactCheckSummary}"
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 pt-6">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 transition-all text-sm text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex items-center px-4 text-sm text-slate-500">
            Page {page} of {totalPages}
          </div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 transition-all text-sm text-slate-300"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
