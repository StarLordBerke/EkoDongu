import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { LevelMap } from './components/LevelMap';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { LevelWinModal } from './components/LevelWinModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GameDifficulty, LevelDefinition, UserLevelProgress } from './types/game';
import { LEVELS_CONFIG, ENDLESS_LEVEL_CONFIG } from './utils/educationalData';
import { soundManager } from './utils/audio';
import { addScoreToLeaderboard } from './utils/leaderboard';

export default function App() {
  const [gameState, setGameState] = useState<'START' | 'MAP' | 'PLAYING' | 'LEVEL_WIN' | 'GAMEOVER'>('START');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('NORMAL');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const maxLives = 3;
  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Level Progression State
  const [currentLevel, setCurrentLevel] = useState<LevelDefinition>(LEVELS_CONFIG[0]);
  const [levelProgressMap, setLevelProgressMap] = useState<Record<number, UserLevelProgress>>({
    1: { stars: 0, highScore: 0, isUnlocked: true },
  });

  // Audio states
  const [isMusicOn, setIsMusicOn] = useState<boolean>(soundManager.isMusicOn());
  const [isSfxOn, setIsSfxOn] = useState<boolean>(soundManager.isSfxOn());
  const [musicVolume, setMusicVolume] = useState<number>(soundManager.getMusicVolume());

  // Modals & Notifications
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showCodeViewer, setShowCodeViewer] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [feedbackTip, setFeedbackTip] = useState<{ message: string; isError: boolean } | null>(null);
  const [feedbackTimeout, setFeedbackTimeout] = useState<number | null>(null);

  // Victory / Win Modal State
  const [winStats, setWinStats] = useState<{
    score: number;
    stars: number;
    accuracy: number;
    correctCount: number;
    wrongCount: number;
    isNewRecord: boolean;
  }>({
    score: 0,
    stars: 1,
    accuracy: 100,
    correctCount: 0,
    wrongCount: 0,
    isNewRecord: false,
  });

  // Game Over summary stats
  const [finalStats, setFinalStats] = useState<{
    score: number;
    level: number;
    accuracy: number;
    correctCount: number;
    wrongCount: number;
  }>({
    score: 0,
    level: 1,
    accuracy: 100,
    correctCount: 0,
    wrongCount: 0,
  });

  // Restore saved level progress and high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('ekodongu_high_score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10) || 0);
    }

    const savedLevels = localStorage.getItem('ekodongu_levels_progress');
    if (savedLevels) {
      try {
        const parsed = JSON.parse(savedLevels);
        if (parsed && typeof parsed === 'object') {
          // Always guarantee Level 1 is unlocked
          parsed[1] = { ...parsed[1], isUnlocked: true };
          setLevelProgressMap(parsed);
        }
      } catch {
        // fallback
      }
    }

    const unsubscribe = soundManager.subscribe(() => {
      setIsMusicOn(soundManager.isMusicOn());
      setIsSfxOn(soundManager.isSfxOn());
      setMusicVolume(soundManager.getMusicVolume());
    });

    return () => unsubscribe();
  }, []);

  // Save level progress helper
  const saveLevelProgress = (levelId: number, earnedStars: number, levelScore: number) => {
    setLevelProgressMap((prev) => {
      const current = prev[levelId] || { stars: 0, highScore: 0, isUnlocked: true };
      const updatedStars = Math.max(current.stars, earnedStars);
      const updatedHighScore = Math.max(current.highScore, levelScore);

      const nextId = levelId + 1;
      const nextLevelExists = LEVELS_CONFIG.some((l) => l.id === nextId);

      const updated = {
        ...prev,
        [levelId]: {
          ...current,
          stars: updatedStars,
          highScore: updatedHighScore,
          isUnlocked: true,
          completedAt: new Date().toISOString(),
        },
        ...(nextLevelExists
          ? {
              [nextId]: {
                stars: prev[nextId]?.stars || 0,
                highScore: prev[nextId]?.highScore || 0,
                isUnlocked: true,
              },
            }
          : {}),
      };

      localStorage.setItem('ekodongu_levels_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const totalStars = Object.values(levelProgressMap).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  const handleToggleMusic = () => {
    soundManager.toggleMusic();
  };

  const handleToggleSfx = () => {
    soundManager.toggleSfx();
  };

  const handleChangeMusicVolume = (val: number) => {
    soundManager.setMusicVolume(val);
  };

  const startLevelSession = (level: LevelDefinition) => {
    setCurrentLevel(level);
    setScore(0);
    setLives(maxLives);
    setLevelProgress(0);
    setCombo(0);
    setIsPaused(false);
    setFeedbackTip(null);
    setGameState('PLAYING');
    soundManager.startBGM();
  };

  const handleStartGameFromStartScreen = () => {
    // Starts Endless Mode with all 7 recycling categories and all 7 bins active!
    startLevelSession(ENDLESS_LEVEL_CONFIG);
  };

  const handleLevelWin = (stats: {
    score: number;
    levelId: number;
    stars: number;
    accuracy: number;
    totalSorted: number;
    correctCount: number;
    wrongCount: number;
  }) => {
    soundManager.stopBGM();

    const previousRecord = levelProgressMap[stats.levelId]?.highScore || 0;
    const isNew = stats.score > previousRecord;

    saveLevelProgress(stats.levelId, stats.stars, stats.score);

    setWinStats({
      score: stats.score,
      stars: stats.stars,
      accuracy: stats.accuracy,
      correctCount: stats.correctCount,
      wrongCount: stats.wrongCount,
      isNewRecord: isNew,
    });

    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('ekodongu_high_score', stats.score.toString());
    }

    setGameState('LEVEL_WIN');
  };

  const handleNextLevel = () => {
    const nextIdx = LEVELS_CONFIG.findIndex((l) => l.id === currentLevel.id) + 1;
    if (nextIdx < LEVELS_CONFIG.length) {
      startLevelSession(LEVELS_CONFIG[nextIdx]);
    } else {
      setGameState('MAP');
    }
  };

  const handleReplayCurrentLevel = () => {
    startLevelSession(currentLevel);
  };

  const handleQuitToMenu = () => {
    soundManager.stopBGM();
    setIsPaused(false);
    setGameState('START');
  };

  const handleBackToMap = () => {
    soundManager.stopBGM();
    setIsPaused(false);
    setGameState('MAP');
  };

  const handleGameOver = (stats: {
    score: number;
    level: number;
    accuracy: number;
    totalSorted: number;
    correctCount: number;
    wrongCount: number;
  }) => {
    soundManager.stopBGM();
    setFinalStats(stats);

    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('ekodongu_high_score', stats.score.toString());
    }

    setGameState('GAMEOVER');
  };

  const handleItemFeedback = (tip: string, isError: boolean) => {
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }
    setFeedbackTip({ message: tip, isError });
    const timer = window.setTimeout(() => {
      setFeedbackTip(null);
    }, 2200);
    setFeedbackTimeout(timer);
  };

  const nextLevelDef = LEVELS_CONFIG.find((l) => l.id === currentLevel.id + 1) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none">
      {/* 1. START SCREEN */}
      {gameState === 'START' && (
        <StartScreen
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartGame={handleStartGameFromStartScreen}
          onOpenLevelMap={() => setGameState('MAP')}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenCodeViewer={() => setShowCodeViewer(true)}
          highScore={highScore}
          totalStars={totalStars}
          isMusicOn={isMusicOn}
          isSfxOn={isSfxOn}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          musicVolume={musicVolume}
          onChangeMusicVolume={handleChangeMusicVolume}
        />
      )}

      {/* 2. SEVİYE HARİTASI (LEVEL MAP) */}
      {gameState === 'MAP' && (
        <LevelMap
          levelProgressMap={levelProgressMap}
          currentLevel={currentLevel}
          onSelectLevel={startLevelSession}
          onBackToMenu={() => setGameState('START')}
          isMusicOn={isMusicOn}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* 3. PLAYING SCREEN (GAME LOOP) */}
      {gameState === 'PLAYING' && (
        <div className="relative w-full h-full">
          <GameHUD
            score={score}
            lives={lives}
            maxLives={maxLives}
            level={currentLevel.id}
            levelProgress={levelProgress}
            combo={combo}
            isPaused={isPaused}
            isMusicOn={isMusicOn}
            isSfxOn={isSfxOn}
            musicVolume={musicVolume}
            feedbackTip={feedbackTip}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onToggleMusic={handleToggleMusic}
            onToggleSfx={handleToggleSfx}
            onChangeMusicVolume={handleChangeMusicVolume}
            onQuitToMenu={handleBackToMap}
          />

          <GameCanvas
            difficulty={difficulty}
            currentLevel={currentLevel}
            score={score}
            lives={lives}
            levelProgress={levelProgress}
            combo={combo}
            isPaused={isPaused}
            onScoreUpdate={setScore}
            onLivesUpdate={setLives}
            onComboUpdate={setCombo}
            onLevelProgressUpdate={setLevelProgress}
            onLevelWin={handleLevelWin}
            onGameOver={handleGameOver}
            onItemFeedback={handleItemFeedback}
          />
        </div>
      )}

      {/* 4. LEVEL WIN / STARS MODAL */}
      {gameState === 'LEVEL_WIN' && (
        <LevelWinModal
          currentLevel={currentLevel}
          nextLevel={nextLevelDef}
          score={winStats.score}
          stars={winStats.stars}
          accuracy={winStats.accuracy}
          correctCount={winStats.correctCount}
          wrongCount={winStats.wrongCount}
          isNewRecord={winStats.isNewRecord}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayCurrentLevel}
          onBackToMap={handleBackToMap}
        />
      )}

      {/* 5. GAME OVER MODAL */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          score={finalStats.score}
          highScore={highScore}
          level={finalStats.level}
          accuracy={finalStats.accuracy}
          correctCount={finalStats.correctCount}
          wrongCount={finalStats.wrongCount}
          onRestart={handleReplayCurrentLevel}
          onHome={handleBackToMap}
        />
      )}

      {/* 6. HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* 7. STANDALONE CODE VIEWER & EXPORT */}
      {showCodeViewer && (
        <CodeViewerModal onClose={() => setShowCodeViewer(false)} />
      )}
    </div>
  );
}
