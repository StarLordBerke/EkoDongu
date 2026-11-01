import React, { useState, useEffect, useRef } from 'react';
import { Star, Lock, Play, ArrowLeft, Music, Trophy, Sparkles, Infinity as InfinityIcon, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { LevelDefinition, UserLevelProgress } from '../types/game';
import { LEVELS_CONFIG, ENDLESS_LEVEL_CONFIG, WASTE_CATEGORIES_INFO } from '../utils/educationalData';
import { getBgmZoneInfo } from '../utils/audio';

interface LevelMapProps {
  levelProgressMap: Record<number, UserLevelProgress>;
  currentLevel?: LevelDefinition;
  onSelectLevel: (level: LevelDefinition) => void;
  onBackToMenu: () => void;
  onResetAllLevels: () => void;
  onOpenLeaderboard: () => void;
  isMusicOn: boolean;
  onToggleMusic: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  levelProgressMap,
  currentLevel,
  onSelectLevel,
  onBackToMenu,
  onResetAllLevels,
  onOpenLeaderboard,
  isMusicOn,
  onToggleMusic,
}) => {
  const [selectedPreviewLevel, setSelectedPreviewLevel] = useState<LevelDefinition | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const levelNodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Total stars accumulated
  const totalStars = Object.values(levelProgressMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const maxPossibleStars = LEVELS_CONFIG.length * 3;

  // Find the highest unlocked level to focus and scroll to
  const unlockedLevels = LEVELS_CONFIG.filter(
    (l) => l.id === 1 || levelProgressMap[l.id]?.isUnlocked
  );
  const highestUnlockedId = unlockedLevels.length > 0 ? unlockedLevels[unlockedLevels.length - 1].id : 1;
  const currentActiveLevel =
    (currentLevel && currentLevel.id > 0 ? currentLevel : null) ||
    LEVELS_CONFIG.find((l) => l.id === highestUnlockedId) ||
    LEVELS_CONFIG[0];

  // Smooth scroll down animation to the newly unlocked level upon entering the map
  useEffect(() => {
    setHighlightedId(highestUnlockedId);

    const timer = setTimeout(() => {
      const targetElement = levelNodeRefs.current[highestUnlockedId];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [highestUnlockedId]);

  const handleNodeClick = (level: LevelDefinition) => {
    const progress = levelProgressMap[level.id];
    const isUnlocked = level.id === 1 || (progress && progress.isUnlocked);
    if (!isUnlocked) return;
    setSelectedPreviewLevel(level);
  };

  return (
    <div className="relative w-full h-screen overflow-y-scroll overflow-x-hidden flex flex-col bg-gradient-to-b from-slate-950 via-teal-950 to-slate-950 text-white select-none pb-28 custom-scrollbar">
      {/* Ambient background glows */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 w-full px-3 sm:px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-xl gap-2">
        {/* Left Nav Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="Ana Menüye Dön"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Ana Menü</span>
          </button>

          {/* Oyuna Dön / Başla Butonu */}
          <button
            onClick={() => onSelectLevel(currentActiveLevel)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            title={`Seviye ${currentActiveLevel.id} (${currentActiveLevel.title}) Oyna`}
          >
            <Play className="w-4 h-4 fill-current text-slate-950" />
            <span>Oyuna Dön</span>
          </button>
        </div>

        {/* Center / Right Info */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Skor Tablosu Trigger */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
            title="Skor Tablosunu Gör"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Skorlar</span>
          </button>

          {/* Tüm Seviyeleri Sıfırla Trigger */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-red-950/60 hover:text-red-300 border border-slate-700 hover:border-red-500/50 text-slate-400 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
            title="Tüm Seviyeleri ve Puanları Sıfırla"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span className="hidden md:inline">Sıfırla</span>
          </button>

          {/* Stars Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-inner">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>
              {totalStars} / {maxPossibleStars}
              <span className="hidden sm:inline"> Yıldız</span>
            </span>
          </div>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
              isMusicOn
                ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-300'
                : 'bg-white/10 border-white/10 text-slate-400'
            }`}
            title="Müzik Aç/Kapat"
          >
            <Music className="w-4 h-4" />
            <span className="hidden md:inline">{isMusicOn ? 'Müzik Açık' : 'Müzik Kapalı'}</span>
          </button>
        </div>
      </header>

      {/* Hero Title Section */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 pt-6 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>100 Seviyeli Büyük Macera • 5 Farklı Müzik Bölgesi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          EkoDöngü 100 Seviye Haritası
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-lg mx-auto">
          Her 20 seviyede değişen tematik fon müzikleriyle 300 yıldız topla, Sıfır Atık Gezegen Şampiyonu ol!
        </p>

        {/* Quick Launch Endless Mode Card */}
        <div className="mt-5 max-w-xl mx-auto p-4 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border border-emerald-500/40 shadow-xl flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <InfinityIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Sonsuz Mod (Arcade)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  7 Kategori
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kağıt, Plastik, Cam, Organik, Metal, Pil ve E-Atık aynı anda!
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectLevel(ENDLESS_LEVEL_CONFIG)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Oyna</span>
          </button>
        </div>
      </div>

      {/* 
        MAP TIMELINE ROAD:
        The central glowing road line is strictly contained inside its own middle spine column (on desktop)
        or left spine column (on mobile), completely separated from level cards so it NEVER crosses over
        or under card text!
      */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="relative flex flex-col gap-10">
          {LEVELS_CONFIG.map((level, idx) => {
            const progress = levelProgressMap[level.id];
            const isUnlocked = level.id === 1 || (progress && progress.isUnlocked);
            const stars = progress?.stars || 0;
            const highScore = progress?.highScore || 0;
            const isHighestUnlocked = level.id === highestUnlockedId;
            const isTargetHighlight = level.id === highlightedId;
            const isCompleted = stars > 0;
            const isLeft = idx % 2 === 0;
            const isZoneStart = level.id % 20 === 1;
            const zoneInfo = getBgmZoneInfo(level.id);

            return (
              <React.Fragment key={level.id}>
                {/* Zone Biome & Music Transition Banner (Every 20 Levels) */}
                {isZoneStart && (
                  <div className="w-full my-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-teal-950/90 border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shrink-0">
                        {zoneInfo.zone}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            Bölge {zoneInfo.zone} (Seviyeler {zoneInfo.levelsRange})
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {zoneInfo.theme}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white mt-0.5 flex items-center gap-1.5">
                          <span>🎵 {zoneInfo.title}</span>
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/30 shrink-0 hidden sm:inline">
                      ⚡ {zoneInfo.bpm} BPM
                    </span>
                  </div>
                )}

                <div
                  ref={(el) => {
                    levelNodeRefs.current[level.id] = el;
                  }}
                  className="relative w-full"
                >
                {/* === DESKTOP LAYOUT (md and up): 3-Column Grid (Left Card | Center Spine Road | Right Card) === */}
                <div className="hidden md:grid md:grid-cols-[1fr_80px_1fr] md:items-center md:gap-4 w-full">
                  {/* Left Column */}
                  <div className="flex justify-end items-center">
                    {isLeft ? (
                      <div className="flex items-center w-full max-w-[340px]">
                        {/* The Level Card */}
                        <div
                          onClick={() => handleNodeClick(level)}
                          className={`w-full rounded-3xl p-5 border-2 transition-all duration-300 ${
                            isUnlocked
                              ? isHighestUnlocked
                                ? 'cursor-pointer bg-slate-900/95 border-amber-400 shadow-2xl shadow-amber-400/20 hover:scale-[1.02]'
                                : 'cursor-pointer bg-slate-900/90 hover:bg-slate-850 border-emerald-500/40 hover:border-emerald-400 shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02]'
                              : 'cursor-not-allowed bg-slate-950/70 border-slate-800/80 opacity-60'
                          } ${isTargetHighlight ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                        >
                          <LevelCardContent
                            level={level}
                            isUnlocked={isUnlocked}
                            isHighestUnlocked={isHighestUnlocked}
                            isCompleted={isCompleted}
                            stars={stars}
                            highScore={highScore}
                          />
                        </div>

                        {/* Horizontal Bridge connecting Left Card to Center Spine Pin */}
                        <div
                          className={`w-6 h-1 rounded-r-full transition-colors shrink-0 ${
                            isUnlocked ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm' : 'bg-slate-700'
                          }`}
                        />
                      </div>
                    ) : (
                      /* Scenery marker / spacer on left */
                      <div className="pr-4 text-right opacity-40">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Bölge {level.id} • {level.region}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Center Column: The Road Spine & Checkpoint Pin */}
                  <div className="relative flex flex-col items-center justify-center h-full min-h-[140px]">
                    {/* Vertical Connecting Road Line (runs strictly between checkpoints, never touching cards!) */}
                    {idx < LEVELS_CONFIG.length - 1 && (
                      <div className="absolute top-1/2 bottom-[-40px] w-2 bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30 pointer-events-none z-0" />
                    )}
                    {idx > 0 && (
                      <div className="absolute top-[-40px] bottom-1/2 w-2 bg-gradient-to-b from-teal-500 via-emerald-400 to-teal-600 rounded-full shadow-lg shadow-emerald-500/30 pointer-events-none z-0" />
                    )}

                    {/* Circular Checkpoint Pin */}
                    <div
                      onClick={() => handleNodeClick(level)}
                      className={`relative z-20 w-16 h-16 rounded-full flex flex-col items-center justify-center font-black transition-all duration-300 shadow-2xl cursor-pointer ${
                        isUnlocked
                          ? isCompleted
                            ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 border-4 border-emerald-300 shadow-emerald-500/40 hover:scale-110'
                            : isHighestUnlocked
                            ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 border-4 border-white shadow-amber-400/50 hover:scale-110 ring-4 ring-amber-400/60 ring-offset-2 ring-offset-slate-950 animate-pulse'
                            : 'bg-emerald-600 text-white border-4 border-emerald-400 shadow-emerald-600/30 hover:scale-110'
                          : 'bg-slate-800 text-slate-500 border-4 border-slate-700 cursor-not-allowed'
                      }`}
                      title={isUnlocked ? `Seviye ${level.id} (${level.title})` : 'Kilitli Seviye'}
                    >
                      {isUnlocked ? (
                        <>
                          <span className="text-xl leading-none">{level.id}</span>
                          {stars > 0 && (
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: stars }).map((_, s) => (
                                <Star key={s} className="w-2.5 h-2.5 fill-current text-slate-950" />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}

                      {/* Newly Unlocked Alert Pill */}
                      {isHighestUnlocked && isUnlocked && stars === 0 && (
                        <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap animate-bounce">
                          YENİ!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex justify-start items-center">
                    {!isLeft ? (
                      <div className="flex items-center w-full max-w-[340px]">
                        {/* Horizontal Bridge connecting Right Card to Center Spine Pin */}
                        <div
                          className={`w-6 h-1 rounded-l-full transition-colors shrink-0 ${
                            isUnlocked ? 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-sm' : 'bg-slate-700'
                          }`}
                        />

                        {/* The Level Card */}
                        <div
                          onClick={() => handleNodeClick(level)}
                          className={`w-full rounded-3xl p-5 border-2 transition-all duration-300 ${
                            isUnlocked
                              ? isHighestUnlocked
                                ? 'cursor-pointer bg-slate-900/95 border-amber-400 shadow-2xl shadow-amber-400/20 hover:scale-[1.02]'
                                : 'cursor-pointer bg-slate-900/90 hover:bg-slate-850 border-emerald-500/40 hover:border-emerald-400 shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02]'
                              : 'cursor-not-allowed bg-slate-950/70 border-slate-800/80 opacity-60'
                          } ${isTargetHighlight ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                        >
                          <LevelCardContent
                            level={level}
                            isUnlocked={isUnlocked}
                            isHighestUnlocked={isHighestUnlocked}
                            isCompleted={isCompleted}
                            stars={stars}
                            highScore={highScore}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Scenery marker / spacer on right */
                      <div className="pl-4 text-left opacity-40">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Bölge {level.id} • {level.region}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* === MOBILE & TABLET LAYOUT (< md): Left Spine Road + Right Card (Line NEVER crosses Card!) === */}
                <div className="flex md:hidden items-center gap-3 w-full">
                  {/* Left Spine with Checkpoint Pin & Vertical Road */}
                  <div className="relative w-16 shrink-0 flex flex-col items-center justify-center min-h-[130px]">
                    {/* Vertical connecting line */}
                    {idx < LEVELS_CONFIG.length - 1 && (
                      <div className="absolute top-1/2 bottom-[-40px] left-1/2 -translate-x-1/2 w-2 bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-600 rounded-full shadow-lg pointer-events-none z-0" />
                    )}
                    {idx > 0 && (
                      <div className="absolute top-[-40px] bottom-1/2 left-1/2 -translate-x-1/2 w-2 bg-gradient-to-b from-teal-500 via-emerald-400 to-teal-600 rounded-full shadow-lg pointer-events-none z-0" />
                    )}

                    {/* Circular Pin */}
                    <div
                      onClick={() => handleNodeClick(level)}
                      className={`relative z-20 w-14 h-14 rounded-full flex flex-col items-center justify-center font-black transition-transform shadow-xl cursor-pointer ${
                        isUnlocked
                          ? isCompleted
                            ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 border-3 border-emerald-300 shadow-emerald-500/40'
                            : isHighestUnlocked
                            ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 border-3 border-white shadow-amber-400/50 ring-4 ring-amber-400/50'
                            : 'bg-emerald-600 text-white border-3 border-emerald-400 shadow-emerald-600/30'
                          : 'bg-slate-800 text-slate-500 border-3 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <span className="text-lg leading-none">{level.id}</span>
                          {stars > 0 && (
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: stars }).map((_, s) => (
                                <Star key={s} className="w-2 h-2 fill-current text-slate-950" />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Horizontal Connector Arm */}
                  <div
                    className={`w-3 h-1 shrink-0 ${
                      isUnlocked ? 'bg-emerald-400/70' : 'bg-slate-700'
                    }`}
                  />

                  {/* Right Level Card (Completely beside the road!) */}
                  <div
                    onClick={() => handleNodeClick(level)}
                    className={`flex-1 min-w-0 rounded-2xl p-4 border-2 transition-all ${
                      isUnlocked
                        ? isHighestUnlocked
                          ? 'cursor-pointer bg-slate-900/95 border-amber-400 shadow-xl shadow-amber-400/20'
                          : 'cursor-pointer bg-slate-900/90 border-emerald-500/40 shadow-lg'
                        : 'cursor-not-allowed bg-slate-950/70 border-slate-800/80 opacity-60'
                    } ${isTargetHighlight ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                  >
                    <LevelCardContent
                      level={level}
                      isUnlocked={isUnlocked}
                      isHighestUnlocked={isHighestUnlocked}
                      isCompleted={isCompleted}
                      stars={stars}
                      highScore={highScore}
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        </div>
      </div>

      {/* Floating Bottom Quick Play Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
        <button
          onClick={() => onSelectLevel(currentActiveLevel)}
          className="px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-emerald-500/40 border border-white/30 transition-transform active:scale-95 hover:scale-105"
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          <span>Hemen Oyna ({currentActiveLevel.title})</span>
        </button>
      </div>

      {/* Reset All Progress Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-sm w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-1">Tüm Seviyeleri Sıfırla?</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              100 seviyedeki tüm ilerlemeniz, topladığınız yıldızlar ve rekor skorlarınız sıfırlanacaktır. Bu işlem geri alınamaz!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllLevels();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                Evet, Sıfırla
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Preview / Launch Modal */}
      {selectedPreviewLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col text-left overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Seviye {selectedPreviewLevel.id} • {selectedPreviewLevel.region}
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {selectedPreviewLevel.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedPreviewLevel.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewLevel(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2">
              {selectedPreviewLevel.description}
            </p>

            {/* Target & Star Thresholds */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 my-3">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Yıldız Hedefleri (Kazanılacak Yıldızlar)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-center text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-white">
                    {selectedPreviewLevel.starThresholds[0]} P
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-center text-amber-400 mb-1 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-white">
                    {selectedPreviewLevel.starThresholds[1]} P
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-center text-amber-400 mb-1 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300">
                    {selectedPreviewLevel.starThresholds[2]} P
                  </span>
                </div>
              </div>
            </div>

            {/* Atık Kutuları */}
            <div className="mb-5">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Bu Seviyedeki Geri Dönüşüm Kutuları
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPreviewLevel.allowedCategories.map((cat) => {
                  const info = WASTE_CATEGORIES_INFO[cat];
                  return (
                    <div
                      key={cat}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                      style={{ backgroundColor: info.hex }}
                    >
                      <span>{info.iconSymbol}</span>
                      <span>{info.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Eco Fact */}
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-200 mb-5 leading-relaxed">
              <strong>🌿 Bilgi:</strong> {selectedPreviewLevel.ecoFact}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const lvl = selectedPreviewLevel;
                  setSelectedPreviewLevel(null);
                  onSelectLevel(lvl);
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Seviyeyi Başlat</span>
              </button>

              <button
                onClick={() => setSelectedPreviewLevel(null)}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Reusable Level Card Content Component */
interface LevelCardContentProps {
  level: LevelDefinition;
  isUnlocked: boolean;
  isHighestUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  highScore: number;
}

const LevelCardContent: React.FC<LevelCardContentProps> = ({
  level,
  isUnlocked,
  isHighestUnlocked,
  isCompleted,
  stars,
  highScore,
}) => {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            <span>{level.region}</span>
            <span>•</span>
            <span>{level.targetItems} Atık</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white truncate group-hover:text-emerald-300 transition-colors">
            {level.title}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {level.subtitle}
          </p>
        </div>

        {/* Quick play action icon or checkmark */}
        {isUnlocked && (
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Play className="w-4 h-4 fill-current text-amber-400" />
            )}
          </div>
        )}
      </div>

      {/* Categories Mini-Pills with vibrant colors and icons */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {level.allowedCategories.map((cat) => {
          const info = WASTE_CATEGORIES_INFO[cat];
          return (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 shadow-xs"
              style={{ backgroundColor: info.hex }}
              title={info.name}
            >
              <span>{info.iconSymbol}</span>
              <span>{info.shortName || info.name.split(' ')[0]}</span>
            </span>
          );
        })}
      </div>

      {/* Stars & High Score Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((starIdx) => {
            const earned = starIdx <= stars;
            return (
              <Star
                key={starIdx}
                className={`w-4 h-4 transition-all ${
                  earned
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow'
                    : 'text-slate-700'
                }`}
              />
            );
          })}
        </div>

        {highScore > 0 ? (
          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{highScore}</span>
          </span>
        ) : isUnlocked ? (
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span>{isHighestUnlocked ? 'Şimdi Oyna' : 'Oyna'}</span>
          </span>
        ) : (
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Kilitli</span>
          </span>
        )}
      </div>
    </>
  );
};
