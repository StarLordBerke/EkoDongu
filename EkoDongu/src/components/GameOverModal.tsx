import React from 'react';
import { RotateCcw, Home, Trophy, Target, Award, Sparkles, BookOpen } from 'lucide-react';
import { ZERO_WASTE_EDUCATIONAL_TIPS } from '../utils/educationalData';

interface GameOverModalProps {
  score: number;
  highScore: number;
  level: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  level,
  accuracy,
  correctCount,
  wrongCount,
  onRestart,
  onHome,
}) => {
  const isNewRecord = score > 0 && score >= highScore;

  // Pick an educational tip based on score or random
  const tipIndex = Math.abs(score + level) % ZERO_WASTE_EDUCATIONAL_TIPS.length;
  const ecoTip = ZERO_WASTE_EDUCATIONAL_TIPS[tipIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white flex flex-col items-center text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Record Badge */}
        {isNewRecord && (
          <div className="mb-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Yeni Rekor!</span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          Oyun Bitti!
        </h2>
        <p className="text-emerald-300 text-sm font-medium">
          Bugün doğayı korumak için harika bir çaba gösterdin!
        </p>

        {/* Score Display Card */}
        <div className="w-full my-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Toplam Skor
          </span>
          <span className="text-4xl sm:text-5xl font-black text-emerald-400 my-1">
            {score}
          </span>
          {highScore > 0 && (
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>En Yüksek: {Math.max(score, highScore)}</span>
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mb-5">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center">
            <span className="text-[11px] font-semibold text-slate-400">Seviye</span>
            <span className="text-lg font-bold text-white mt-0.5">{level}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center">
            <span className="text-[11px] font-semibold text-slate-400">Doğruluk</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5">%{accuracy}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center">
            <span className="text-[11px] font-semibold text-slate-400">Ayrıştırılan</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5">{correctCount}</span>
          </div>
        </div>

        {/* Educational Zero Waste Tip Box */}
        <div className="w-full mb-6 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-left flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-0.5">
              Sıfır Atık Bilgisi
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {ecoTip}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tekrar Oyna</span>
          </button>

          <button
            onClick={onHome}
            className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            <span>Ana Menü</span>
          </button>
        </div>
      </div>
    </div>
  );
};
