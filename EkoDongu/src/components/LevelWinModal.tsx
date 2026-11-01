import React, { useEffect } from 'react';
import { Star, ArrowRight, RotateCcw, Map, Trophy, Sparkles } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { soundManager } from '../utils/audio';

interface LevelWinModalProps {
  currentLevel: LevelDefinition;
  nextLevel: LevelDefinition | null;
  score: number;
  stars: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  isNewRecord: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export const LevelWinModal: React.FC<LevelWinModalProps> = ({
  currentLevel,
  nextLevel,
  score,
  stars,
  accuracy,
  correctCount,
  wrongCount,
  isNewRecord,
  onNextLevel,
  onReplay,
  onBackToMap,
}) => {
  // Play star fanfare sequence on mount
  useEffect(() => {
    for (let i = 0; i < stars; i++) {
      setTimeout(() => {
        soundManager.playStarSound(i);
      }, 350 + i * 280);
    }
  }, [stars]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white flex flex-col items-center text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Level Tag */}
        <div className="mb-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Seviye {currentLevel.id} Tamamlandı!</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          {currentLevel.title}
        </h2>
        <p className="text-emerald-300 text-xs sm:text-sm font-medium">
          {stars === 3
            ? 'Kusursuz Ayrıştırma! Tam Puan!'
            : stars === 2
            ? 'Harika İş Çıkardın!'
            : 'Başarıyla Tamamlandı!'}
        </p>

        {/* Animated 3 Stars Banner */}
        <div className="flex items-center justify-center gap-3 my-5 py-2">
          {[1, 2, 3].map((starIdx) => {
            const earned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`relative transform transition-all duration-500 ${
                  earned ? 'scale-110 animate-bounce' : 'scale-90 opacity-30'
                }`}
                style={{ animationDelay: `${starIdx * 200}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    earned
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-amber-500/30 text-amber-950'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Score & Record Display */}
        <div className="w-full mb-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Kazanılan Skor
          </span>
          <span className="text-4xl font-black text-emerald-400 my-0.5">
            {score}
          </span>
          {isNewRecord && (
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Yeni Seviye Rekoru!</span>
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block">Doğruluk</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">%{accuracy}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block">Kurtarılan Atık</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">{correctCount} Adet</span>
          </div>
        </div>

        {/* Next level unlock alert */}
        {nextLevel && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              {nextLevel.id}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Sonraki Seviye Açıldı!
              </span>
              <span className="text-xs font-bold text-white truncate block">
                {nextLevel.title} ({nextLevel.subtitle})
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {nextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <span>Sonraki Seviye</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onBackToMap}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <span>Haritayı Tamamladın!</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
            </button>

            <button
              onClick={onBackToMap}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Map className="w-4 h-4 text-emerald-400" />
              <span>Haritaya Dön</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
