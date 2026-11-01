import React, { useState } from 'react';
import { X, Trophy, Medal, Star, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { getTop10Scores, clearLeaderboard, ScoreEntry } from '../utils/leaderboard';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [scores, setScores] = useState<ScoreEntry[]>(getTop10Scores());
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);

  const handleClear = () => {
    clearLeaderboard();
    setScores([]);
    setShowConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-lg w-full max-h-[90vh] bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Skor Tablosu</h3>
              <p className="text-xs text-amber-300/90 font-medium">En Yüksek 10 Sıfır Atık Skoru</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scores List Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 custom-scrollbar pr-1">
          {scores.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
                <Trophy className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Henüz Kayıtlı Skor Yok</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Seviyeleri tamamlayarak veya Sonsuz Mod oynayarak ilk rekorunu kır ve skor tablosunda yerini al!
              </p>
            </div>
          ) : (
            scores.map((entry, index) => {
              const rank = index + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;

              return (
                <div
                  key={entry.id || index}
                  className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isTop1
                      ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-amber-400/60 shadow-lg shadow-amber-500/10'
                      : isTop2
                      ? 'bg-gradient-to-r from-slate-800/80 via-slate-900 to-slate-800/50 border-slate-400/50'
                      : isTop3
                      ? 'bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-800/50 border-amber-700/50'
                      : 'bg-slate-850/80 border-slate-800'
                  }`}
                >
                  {/* Left Rank & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        isTop1
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/30 font-black'
                          : isTop2
                          ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950'
                          : isTop3
                          ? 'bg-gradient-to-tr from-amber-600 to-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : rank}
                    </div>

                    {/* Level Name & Date */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-white truncate">
                          {entry.levelId === 0 ? 'Sonsuz Mod' : `Seviye ${entry.levelId}`}
                        </span>
                        {entry.levelName && (
                          <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                            • {entry.levelName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{entry.date}</span>
                        </span>
                        {entry.accuracy !== undefined && (
                          <span className="text-emerald-400 font-bold">
                            %{entry.accuracy} Doğruluk
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Score */}
                  <div className="text-right shrink-0">
                    <span className="text-lg sm:text-xl font-black text-amber-300 block leading-tight">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Puan
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          {scores.length > 0 && !showConfirmClear && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/50 hover:text-red-400 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Skor tablosunu temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}

          {showConfirmClear && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-300 font-bold">Tüm skorlar silinsin mi?</span>
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Evet
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold"
              >
                İptal
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
