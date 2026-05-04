import { useState } from 'react';
import { useGetReportsQuery, useDismissReportMutation, useDeletePostMutation } from '@/store/api/dashboardApi';
import { GlassCard } from './GlassCard';
import { AlertTriangle, CheckCircle, Trash2, User, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReportManagement() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useGetReportsQuery({ 
    limit,
    skip: (page - 1) * limit
  }, {
    pollingInterval: 10000,
  });
  const [dismissReport] = useDismissReportMutation();
  const [deletePost] = useDeletePostMutation();

  const reports = data?.reports || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light text-white">Report Management</h2>
          <p className="text-slate-400 text-sm">Review flagged content and maintain community standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center text-slate-500 animate-pulse">Loading reports...</div>
          ) : reports.length === 0 ? (
            <GlassCard className="py-20 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
              <p>No pending reports. Great job!</p>
            </GlassCard>
          ) : reports.map((report: any) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-wider">
                        {report.reason.replace('_', ' ')}
                      </div>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                        <User className="w-3 h-3" />
                        <span className="font-medium text-slate-300">@{report.post.author.username}</span>
                        <span>•</span>
                        <span>Post ID: {report.post.id}</span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-3 italic">
                        "{report.post.content || 'No text content'}"
                      </p>
                      {report.post.image && (
                        <div className="mt-2 text-[10px] text-cyan-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Post contains image
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Reporter: <span className="text-slate-300">@{report.reporter.username}</span></span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-end">
                    <button
                      onClick={() => dismissReport(report.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-400 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this post? This will also remove all associated reports.')) {
                          deletePost(report.post.id);
                        }
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
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
