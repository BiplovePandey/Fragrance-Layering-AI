import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Sparkles } from 'lucide-react';

export interface SocietyComment {
  id: string;
  targetId: string;
  author: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
}

interface SocietyCommentsModalProps {
  title: string;
  subtitle?: string;
  targetId: string;
  comments: SocietyComment[];
  onAddComment: (targetId: string, content: string, author: string) => void;
  onClose: () => void;
}

export const SocietyCommentsModal: React.FC<SocietyCommentsModalProps> = ({
  title,
  subtitle,
  targetId,
  comments,
  onAddComment,
  onClose,
}) => {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('Atelier Connoisseur');

  const filteredComments = comments.filter((c) => c.targetId === targetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(targetId, newComment.trim(), authorName.trim() || 'Atelier Connoisseur');
    setNewComment('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comments-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-7 text-[#F8F5EE] shadow-2xl shadow-black/80 flex flex-col max-h-[85vh]"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(217, 119, 6, 0.12)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Salon Reflection</span>
            </div>
            <h3 id="comments-modal-title" className="font-serif text-xl sm:text-2xl font-medium text-[#F8F5EE] mt-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reflections"
            className="p-1.5 rounded-xl text-stone-400 hover:text-[#F8F5EE] hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Conversation Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 my-2">
          {filteredComments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <Sparkles className="w-6 h-6 text-amber-400/50 mx-auto" />
              <p className="font-serif text-base text-stone-300">
                The conversation has just begun.
              </p>
              <p className="text-xs text-stone-400">
                Share how this fragrance accord opens or rests upon your skin.
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-amber-300">
                    <span className="text-sm">{comment.authorBadge || '✨'}</span>
                    <span>{comment.author}</span>
                  </div>
                  <span className="text-[10px] font-mono-lab text-stone-400">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Connoisseur Name"
              className="text-[11px] font-mono-lab bg-transparent border-none text-stone-300 focus:outline-none placeholder:text-stone-600"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add an olfactory reflection..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              aria-label="Send reflection"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
