import React from 'react';
import { Music, Volume2, VolumeX, Pause, Play, Heart, Flame, Home, Sliders } from 'lucide-react';

interface GameHUDProps {
  score: number;
  lives: number;
  maxLives: number;
  level: number;
  levelProgress: number;
  combo: number;
  isPaused: boolean;
  isMusicOn: boolean;
  isSfxOn: boolean;
  musicVolume: number;
  feedbackTip: { message: string; isError: boolean } | null;
  onTogglePause: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onChangeMusicVolume: (vol: number) => void;
  onQuitToMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  lives,
  maxLives,
  level,
  levelProgress,
  combo,
  isPaused,
  isMusicOn,
  isSfxOn,
  musicVolume,
  feedbackTip,
  onTogglePause,
  onToggleMusic,
  onToggleSfx,
  onChangeMusicVolume,
  onQuitToMenu,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none z-30 gap-2">
        {/* Left Stats: Score & Level */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex flex-col items-start px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-white shadow-lg">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
              SKOR
            </span>
            <span className="text-xl sm:text-2xl font-black text-white leading-none">
              {score}
            </span>
          </div>

          <div className="flex flex-col items-center px-3 py-1.5 sm:py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-white shadow-lg">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              {level === 0 ? 'MOD' : 'SEVİYE'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 leading-none">
              {level === 0 ? 'Sonsuz' : level}
            </span>
          </div>
        </div>

        {/* Center: Level Progress Bar & Active Combo */}
        <div className="flex flex-col items-center pointer-events-auto max-w-[160px] sm:max-w-xs w-full">
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 shadow-lg">
            <span className="text-[10px] font-bold text-slate-300 uppercase whitespace-nowrap hidden sm:inline">
              {level === 0 ? 'Tempo' : 'Hedef'}
            </span>
            <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-emerald-300">
              {level === 0 ? `⚡%${Math.round(levelProgress)}` : `%${Math.round(levelProgress)}`}
            </span>
          </div>

          {/* Combo Multiplier Banner */}
          {combo >= 2 && (
            <div className="mt-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{combo}x KOMBO!</span>
            </div>
          )}
        </div>

        {/* Right: Hearts & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Hearts Container */}
          <div className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 shadow-lg">
            {Array.from({ length: maxLives }).map((_, i) => {
              const active = i < lives;
              return (
                <Heart
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                    active
                      ? 'text-red-500 fill-red-500 scale-100 drop-shadow'
                      : 'text-slate-600 scale-90 opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* Dedicated Music Toggle Button */}
          <button
            onClick={onToggleMusic}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl backdrop-blur-md border transition-all active:scale-95 shadow-lg flex items-center gap-1.5 ${
              isMusicOn
                ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/35'
                : 'bg-slate-900/85 border-white/15 text-slate-400 hover:bg-slate-800'
            }`}
            title={isMusicOn ? 'Fon Müziğini Kapat' : 'Fon Müziğini Aç'}
          >
            <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${isMusicOn ? 'text-emerald-300' : 'text-slate-400'}`} />
            {isMusicOn && (
              <span className="hidden sm:flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 bg-emerald-300 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </button>

          {/* SFX Toggle */}
          <button
            onClick={onToggleSfx}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white transition-all active:scale-95 shadow-lg hidden sm:flex"
            title={isSfxOn ? 'Ses Efektlerini Kapat' : 'Ses Efektlerini Aç'}
          >
            {isSfxOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
          </button>

          {/* Pause button */}
          <button
            onClick={onTogglePause}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white transition-all active:scale-95 shadow-lg"
            title={isPaused ? 'Devam Et' : 'Duraklat'}
          >
            {isPaused ? (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
            ) : (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
            )}
          </button>

          {/* Menu button */}
          <button
            onClick={onQuitToMenu}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white transition-all active:scale-95 shadow-lg hidden md:flex"
            title="Ana Menüye Dön"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Floating Educational Feedback Toast */}
      {feedbackTip && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-[90%] pointer-events-none transition-all">
          <div
            className={`px-4 py-2.5 rounded-2xl backdrop-blur-md text-xs sm:text-sm font-bold shadow-xl border flex items-center justify-center text-center ${
              feedbackTip.isError
                ? 'bg-red-950/90 text-red-200 border-red-500/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
            }`}
          >
            {feedbackTip.message}
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-center text-white shadow-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
              <Pause className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Oyun Duraklatıldı</h3>
            <p className="text-xs text-slate-400 mb-5">Bir nefes al ve doğayı kurtarmaya devam et!</p>

            {/* Music & Sound Controls inside Pause menu */}
            <div className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-5 text-left flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>Telifsiz Fon Müziği</span>
                </span>
                <button
                  onClick={onToggleMusic}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    isMusicOn
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {isMusicOn ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {isMusicOn && (
                <div className="pt-2 border-t border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span>Müzik Seviyesi</span>
                    <span className="text-emerald-300">%{Math.round(musicVolume * 100)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Ses Efektleri</span>
                </span>
                <button
                  onClick={onToggleSfx}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    isSfxOn
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSfxOn ? 'Açık' : 'Kapalı'}
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={onTogglePause}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Devam Et</span>
              </button>

              <button
                onClick={onQuitToMenu}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Ana Menüye Dön</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
