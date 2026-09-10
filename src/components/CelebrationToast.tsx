import React, { useEffect } from 'react';
import { Star, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CelebrationData {
  id: string;
  type: 'line' | 'mission';
  title: string;
  message: string;
}

interface CelebrationToastProps {
  celebration: CelebrationData | null;
  onDismiss: () => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({ celebration, onDismiss }) => {
  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, celebration.type === 'mission' ? 5000 : 3500);

    return () => clearTimeout(timer);
  }, [celebration, onDismiss]);

  if (!celebration) return null;

  const isMission = celebration.type === 'mission';

  return (
    <aside
      aria-label="Notificação de conquista"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-md animate-bounce"
    >
      <div
        className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border-2 flex items-center gap-3.5 backdrop-blur-md transition-all transform ${
          isMission
            ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 border-yellow-200 text-white shadow-amber-500/40 scale-105'
            : 'bg-white/95 border-amber-300 text-slate-800 shadow-amber-200/50'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
            isMission
              ? 'bg-white text-amber-600 text-2xl animate-spin'
              : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
          }`}
          style={{ animationDuration: isMission ? '3s' : '0s' }}
        >
          {isMission ? <Trophy className="w-7 h-7 fill-amber-500" /> : <Star className="w-7 h-7 fill-yellow-300" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isMission ? 'bg-amber-900/30 text-yellow-100' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isMission ? '🏆 Missão Completa!' : '+1 Estrela Conquistada! ⭐'}
            </span>
            <Sparkles className={`w-3.5 h-3.5 ${isMission ? 'text-yellow-200' : 'text-amber-500'}`} />
          </div>
          <h4
            className={`text-sm sm:text-base font-bold truncate mt-0.5 ${
              isMission ? 'text-white' : 'text-slate-900'
            }`}
          >
            {celebration.title}
          </h4>
          <p
            className={`text-xs truncate ${
              isMission ? 'text-amber-100 font-medium' : 'text-slate-600'
            }`}
          >
            {celebration.message}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className={`p-1.5 rounded-lg transition-colors shrink-0 text-xs font-bold ${
            isMission
              ? 'text-yellow-200 hover:text-white hover:bg-white/10'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Fechar"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
