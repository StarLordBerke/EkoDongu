import React, { useState } from 'react';
import { Play, HelpCircle, Music, Volume2, VolumeX, Code, Trophy, Sparkles, Leaf, Sliders, Map, Star } from 'lucide-react';
import { GameDifficulty } from '../types/game';
import { WASTE_CATEGORIES_INFO } from '../utils/educationalData';

interface StartScreenProps {
  difficulty: GameDifficulty;
  onDifficultyChange: (diff: GameDifficulty) => void;
  onStartGame: () => void;
  onOpenLevelMap: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenCodeViewer: () => void;
  highScore: number;
  totalStars: number;
  isMusicOn: boolean;
  isSfxOn: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  musicVolume: number;
  onChangeMusicVolume: (vol: number) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  difficulty,
  onDifficultyChange,
  onStartGame,
  onOpenLevelMap,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onOpenCodeViewer,
  highScore,
  totalStars,
  isMusicOn,
  isSfxOn,
  onToggleMusic,
  onToggleSfx,
  musicVolume,
  onChangeMusicVolume,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white overflow-hidden">
      {/* Decorative background eco circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Top right quick controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        {/* Dedicated Music Toggle Button */}
        <button
          onClick={onToggleMusic}
          className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl backdrop-blur-md transition-all border flex items-center gap-2 text-xs sm:text-sm font-bold shadow-lg active:scale-95 ${
            isMusicOn
              ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/35'
              : 'bg-white/10 border-white/15 text-slate-400 hover:bg-white/20'
          }`}
          title={isMusicOn ? 'Fon Müziğini Kapat' : 'Fon Müziğini Aç'}
        >
          <div className="relative flex items-center">
            <Music className={`w-4 h-4 ${isMusicOn ? 'text-emerald-300' : 'text-slate-400'}`} />
            {isMusicOn && (
              <span className="flex items-end gap-0.5 ml-1.5 h-3">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-emerald-300 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </div>
          <span className="hidden sm:inline">
            {isMusicOn ? 'Müzik: Açık' : 'Müzik: Kapalı'}
          </span>
        </button>

        {/* SFX Toggle */}
        <button
          onClick={onToggleSfx}
          className={`p-2.5 rounded-xl backdrop-blur-md transition-all border flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-lg active:scale-95 ${
            isSfxOn
              ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30'
              : 'bg-white/10 border-white/15 text-red-400 hover:bg-white/20'
          }`}
          title={isSfxOn ? 'Ses Efektlerini Kapat' : 'Ses Efektlerini Aç'}
        >
          {isSfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{isSfxOn ? 'Efektler' : 'Sessiz'}</span>
        </button>

        {/* Volume popover trigger */}
        <button
          onClick={() => setShowVolumeSlider((v) => !v)}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/15 text-slate-300 active:scale-95"
          title="Ses Seviyesi"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Code viewer button */}
        <button
          onClick={onOpenCodeViewer}
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md transition-all border border-emerald-400/30 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-200 shadow-lg active:scale-95"
          title="Vanilla HTML/CSS/JS Kodlarını Gör"
        >
          <Code className="w-4 h-4" />
          <span className="hidden sm:inline">Kaynak Kodlar</span>
        </button>
      </div>

      {/* Floating Volume Slider panel */}
      {showVolumeSlider && (
        <div className="absolute top-16 right-4 z-30 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 shadow-2xl backdrop-blur-md w-64 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
            <span>Müzik Seviyesi</span>
            <span>%{Math.round(musicVolume * 100)}</span>
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
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>🌿 Telifsiz Eko Ritim BGM</span>
            <button
              onClick={() => setShowVolumeSlider(false)}
              className="text-emerald-400 font-bold hover:underline"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="relative z-10 max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Animated Brand Badge */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform rotate-3 animate-pulse-subtle">
            <Leaf className="w-11 h-11 text-white" />
          </div>
          <span className="absolute -top-1 -right-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 rounded-full shadow">
            2D Canvas
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
          Eko<span className="text-emerald-400">Döngü</span>
        </h1>
        <p className="text-emerald-200 text-sm sm:text-base font-medium mt-1">
          Sıfır Atık & Geri Dönüşüm Web Oyunu
        </p>

        {/* Stars & High Score Badges Row */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {totalStars > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-inner">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{totalStars} / 300 Yıldız</span>
            </div>
          )}

          <button
            onClick={onOpenLeaderboard}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-bold shadow-inner transition-transform active:scale-95"
            title="En Yüksek 10 Skoru Gör"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Skor Tablosu {highScore > 0 ? `(En İyi: ${highScore})` : ''}</span>
          </button>
        </div>

        {/* 7 Recycling Categories Preview: 4 on Top, 3 on Bottom */}
        <div className="w-full mt-4 mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2.5 px-1">
            <span className="flex items-center gap-1.5">
              <span>Geri Dönüşüm Kutuları</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">7 Kategori</span>
            </span>
            <span className="text-emerald-300 text-[11px] font-semibold">Doğru kutuya at!</span>
          </div>

          {/* Top Row: 4 Categories (Kağıt, Plastik, Cam, Organik) */}
          <div className="grid grid-cols-4 gap-2 w-full mb-2">
            {(['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK'] as const).map((cat) => {
              const info = WASTE_CATEGORIES_INFO[cat];
              return (
                <div
                  key={cat}
                  className="flex flex-col items-center p-2.5 rounded-2xl border transition-all hover:scale-105 shadow-md"
                  style={{
                    backgroundColor: `${info.hex}22`,
                    borderColor: `${info.hex}66`,
                  }}
                  title={`${info.name} (${info.colorName})`}
                >
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl text-white shadow-md mb-1.5 transition-transform"
                    style={{ backgroundColor: info.hex }}
                  >
                    {info.iconSymbol}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white truncate w-full text-center">
                    {info.shortName || info.name}
                  </span>
                  <span className="text-[10px] font-bold text-white/70 truncate">
                    {info.colorName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: 3 Categories Centered (Metal, Pil, E-Atık) */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[85%] mx-auto">
            {(['METAL', 'PIL', 'ELEKTRONIK'] as const).map((cat) => {
              const info = WASTE_CATEGORIES_INFO[cat];
              return (
                <div
                  key={cat}
                  className="flex flex-col items-center p-2.5 rounded-2xl border transition-all hover:scale-105 shadow-md"
                  style={{
                    backgroundColor: `${info.hex}22`,
                    borderColor: `${info.hex}66`,
                  }}
                  title={`${info.name} (${info.colorName})`}
                >
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl text-white shadow-md mb-1.5 transition-transform"
                    style={{ backgroundColor: info.hex }}
                  >
                    {info.iconSymbol}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white truncate w-full text-center">
                    {info.shortName || info.name}
                  </span>
                  <span className="text-[10px] font-bold text-white/70 truncate">
                    {info.colorName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="w-full mb-4">
          <label className="block text-xs font-semibold text-emerald-200/80 uppercase tracking-wider mb-2">
            Zorluk Seviyesi
          </label>
          <div className="grid grid-cols-3 gap-2 bg-black/25 p-1 rounded-2xl border border-white/10">
            {(['KOLAY', 'NORMAL', 'ZOR'] as GameDifficulty[]).map((diff) => {
              const active = difficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {diff === 'KOLAY' && '🌱 Kolay'}
                  {diff === 'NORMAL' && '⚡ Normal'}
                  {diff === 'ZOR' && '🔥 Zor'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Level Map Button */}
          <button
            onClick={onOpenLevelMap}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-green-500 hover:from-amber-300 hover:to-green-400 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Map className="w-6 h-6 fill-current" />
            <span>🗺️ Seviye Haritası & Başla</span>
          </button>

          {/* Quick Play */}
          <button
            onClick={onStartGame}
            className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Play className="w-5 h-5 text-emerald-300" />
            <span>Hızlı Oyun (Sonsuz Mod)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={onOpenLeaderboard}
              className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Skor Tablosu</span>
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-emerald-300" />
              <span>Nasıl Oynanır?</span>
            </button>
          </div>
        </div>

        {/* Bottom Sound Bar */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-emerald-200/90 font-medium">
          <button
            onClick={onToggleMusic}
            className="hover:underline flex items-center gap-1.5 text-emerald-300"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Müzik: {isMusicOn ? 'Açık' : 'Kapalı'}</span>
          </button>
          <span>•</span>
          <button
            onClick={onToggleSfx}
            className="hover:underline flex items-center gap-1.5 text-emerald-300"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ses Efektleri: {isSfxOn ? 'Açık' : 'Kapalı'}</span>
          </button>
        </div>

        {/* Small eco slogan */}
        <p className="mt-3.5 text-[11px] text-emerald-300/80 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Doğru kutuya atılan her atık geleceğe bir nefestir!</span>
        </p>
      </div>
    </div>
  );
};
