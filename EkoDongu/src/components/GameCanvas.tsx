import React, { useRef, useEffect, useCallback } from 'react';
import {
  ActiveWasteItem,
  FloatingNotification,
  LevelDefinition,
  Particle,
  RecyclingBin,
  WasteCategory,
} from '../types/game';
import {
  drawBackground,
  drawRecyclingBins,
  drawWasteItem,
  drawParticles,
  drawFloatingTexts,
  createInitialBackgroundState,
} from '../utils/canvasRenderer';
import { WASTE_CATEGORIES_INFO, WASTE_TEMPLATES } from '../utils/educationalData';
import { soundManager } from '../utils/audio';

interface GameCanvasProps {
  difficulty: 'KOLAY' | 'NORMAL' | 'ZOR';
  currentLevel: LevelDefinition;
  score: number;
  lives: number;
  levelProgress: number;
  combo: number;
  isPaused: boolean;
  onScoreUpdate: (newScore: number) => void;
  onLivesUpdate: (newLives: number) => void;
  onComboUpdate: (newCombo: number) => void;
  onLevelProgressUpdate: (progress: number) => void;
  onLevelWin: (winStats: {
    score: number;
    levelId: number;
    stars: number;
    accuracy: number;
    totalSorted: number;
    correctCount: number;
    wrongCount: number;
  }) => void;
  onGameOver: (finalStats: {
    score: number;
    level: number;
    accuracy: number;
    totalSorted: number;
    correctCount: number;
    wrongCount: number;
  }) => void;
  onItemFeedback: (tip: string, isError: boolean) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  difficulty,
  currentLevel,
  score,
  lives,
  levelProgress,
  combo,
  isPaused,
  onScoreUpdate,
  onLivesUpdate,
  onComboUpdate,
  onLevelProgressUpdate,
  onLevelWin,
  onGameOver,
  onItemFeedback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable refs for 60fps performance
  const itemsRef = useRef<ActiveWasteItem[]>([]);
  const binsRef = useRef<RecyclingBin[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatTextsRef = useRef<FloatingNotification[]>([]);
  const bgStateRef = useRef(createInitialBackgroundState(800));

  const grabbedItemIdRef = useRef<string | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const screenShakeRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const totalSortedRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const wrongCountRef = useRef<number>(0);
  const isLevelCompletedRef = useRef<boolean>(false);

  // Sync props to refs
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const comboRef = useRef(combo);
  comboRef.current = combo;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const currentLevelRef = useRef(currentLevel);
  currentLevelRef.current = currentLevel;

  // Initialize or Resize canvas and bins for the current level's allowed categories
  const updateBinsPosition = useCallback((canvasWidth: number, canvasHeight: number) => {
    const categories: WasteCategory[] = currentLevelRef.current.allowedCategories;
    const totalBins = categories.length;
    const marginX = Math.max(8, canvasWidth * 0.015);
    const spacing = Math.max(6, canvasWidth * 0.01);
    const availableWidth = canvasWidth - marginX * 2 - spacing * (totalBins - 1);
    const maxBinW = totalBins > 5 ? 120 : totalBins > 4 ? 140 : 170;
    const binWidth = Math.min(maxBinW, availableWidth / totalBins);
    const binHeight = Math.min(130, Math.max(85, canvasHeight * 0.18));
    const startX = (canvasWidth - (binWidth * totalBins + spacing * (totalBins - 1))) / 2;
    const binY = canvasHeight - binHeight - 14;

    const previousBins = binsRef.current;

    binsRef.current = categories.map((cat, i) => {
      const info = WASTE_CATEGORIES_INFO[cat];
      const prevBin = previousBins.find((b) => b.category === cat);
      return {
        category: cat,
        name: info.shortName || info.name,
        code: cat,
        color: info.hex,
        accentColor: info.badgeHex,
        darkColor: info.borderHex,
        x: startX + i * (binWidth + spacing),
        y: binY,
        width: binWidth,
        height: binHeight,
        bounceScale: prevBin ? prevBin.bounceScale : 1.0,
        isHighlighted: false,
        acceptedCount: prevBin ? prevBin.acceptedCount : 0,
      };
    });
  }, []);

  // Handle Resize & level change
  useEffect(() => {
    isLevelCompletedRef.current = false;
    correctCountRef.current = 0;
    wrongCountRef.current = 0;
    totalSortedRef.current = 0;
    itemsRef.current = [];

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }

      updateBinsPosition(width, height);
      bgStateRef.current = createInitialBackgroundState(width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentLevel, updateBinsPosition]);

  // Particle explosion helper
  const spawnParticles = (x: number, y: number, color: string, isSuccess: boolean) => {
    const count = isSuccess ? 18 : 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isSuccess ? 2 : 0),
        color: isSuccess && i % 3 === 0 ? '#22c55e' : color,
        radius: Math.random() * 4 + 2,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 25 + 25,
        isLeaf: isSuccess && i % 4 === 0,
      });
    }
  };

  // Floating text helper
  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    floatTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      alpha: 1,
      scale: 1.2,
      vy: -1.6,
    });
  };

  // Spawn new waste item matching the level's allowed categories
  const spawnWasteItem = (canvasWidth: number) => {
    const allowed = currentLevelRef.current.allowedCategories;
    const candidates = WASTE_TEMPLATES.filter((t) => allowed.includes(t.category));
    if (candidates.length === 0) return;

    const template = candidates[Math.floor(Math.random() * candidates.length)];
    const radius = 28;
    const margin = radius + 20;
    const spawnX = Math.random() * (canvasWidth - margin * 2) + margin;

    // Difficulty multiplier
    let diffMult = 1.0;
    if (difficulty === 'KOLAY') diffMult = 0.85;
    if (difficulty === 'ZOR') diffMult = 1.25;

    const speed = currentLevelRef.current.baseSpeed * diffMult;
    const speedVariation = (Math.random() - 0.5) * 0.4;

    const newItem: ActiveWasteItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: template.name,
      category: template.category,
      ecoTip: template.ecoTip,
      icon: template.icon,
      primaryColor: template.primaryColor,
      x: spawnX,
      y: -radius - 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: speed + speedVariation,
      radius,
      width: radius * 2,
      height: radius * 2,
      rotation: (Math.random() - 0.5) * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      isGrabbed: false,
      grabOffsetX: 0,
      grabOffsetY: 0,
      scale: 1,
    };

    itemsRef.current.push(newItem);
  };

  // Evaluate item dropped into bin or missed
  const handleWasteSorting = (item: ActiveWasteItem, targetBin: RecyclingBin | null) => {
    if (isLevelCompletedRef.current) return;
    totalSortedRef.current += 1;

    if (targetBin && targetBin.category === item.category) {
      // SUCCESS!
      correctCountRef.current += 1;
      targetBin.acceptedCount += 1;
      targetBin.bounceScale = 1.25;

      const newCombo = comboRef.current + 1;
      onComboUpdate(newCombo);

      const comboMultiplier = Math.min(5, 1 + Math.floor(newCombo / 3));
      const addedPoints = 100 * comboMultiplier;
      const newScore = scoreRef.current + addedPoints;
      onScoreUpdate(newScore);

      soundManager.playSuccess();
      spawnParticles(item.x, item.y, targetBin.color, true);

      const comboText = comboMultiplier > 1 ? ` (${comboMultiplier}x KOMBO!)` : '';
      spawnFloatingText(item.x, item.y - 10, `+${addedPoints}${comboText}`, '#16a34a');

      onItemFeedback(`Harika! "${item.name}" doğru şekilde ${targetBin.name} kutusuna atıldı.`, false);

      // Check level progress & victory
      const isEndless = currentLevelRef.current.id === 0;
      if (isEndless) {
        // Endless arcade loop: every 10 correct items, increase arcade speed
        const cycleCount = correctCountRef.current % 10;
        const progressPct = cycleCount === 0 && correctCountRef.current > 0 ? 100 : cycleCount * 10;
        onLevelProgressUpdate(progressPct);

        if (cycleCount === 0 && correctCountRef.current > 0) {
          soundManager.playLevelUp();
          spawnFloatingText(item.x, item.y - 20, '⚡ TEMPO ARTTI!', '#f59e0b');
        }
      } else {
        const goal = currentLevelRef.current.targetItems;
        const currentCorrect = correctCountRef.current;
        const progressPct = Math.min(100, Math.round((currentCorrect / goal) * 100));
        onLevelProgressUpdate(progressPct);

        // CAMPAIGN LEVEL COMPLETED VICTORY!
        if (currentCorrect >= goal && !isLevelCompletedRef.current) {
          isLevelCompletedRef.current = true;
          soundManager.playLevelUp();

          // Calculate stars based on score
          const thresholds = currentLevelRef.current.starThresholds;
          let earnedStars = 1;
          if (newScore >= thresholds[2]) {
            earnedStars = 3;
          } else if (newScore >= thresholds[1]) {
            earnedStars = 2;
          }

          const totalAttempts = correctCountRef.current + wrongCountRef.current;
          const accuracy = totalAttempts > 0 ? Math.round((correctCountRef.current / totalAttempts) * 100) : 100;

          // Trigger level victory modal after slight delay
          setTimeout(() => {
            onLevelWin({
              score: newScore,
              levelId: currentLevelRef.current.id,
              stars: earnedStars,
              accuracy,
              totalSorted: totalSortedRef.current,
              correctCount: correctCountRef.current,
              wrongCount: wrongCountRef.current,
            });
          }, 600);
        }
      }
    } else {
      // WRONG BIN OR MISSED
      wrongCountRef.current += 1;
      screenShakeRef.current = 14;
      onComboUpdate(0);

      const newLives = Math.max(0, livesRef.current - 1);
      onLivesUpdate(newLives);

      soundManager.playError();
      spawnParticles(item.x, item.y, '#ef4444', false);

      const correctCatInfo = WASTE_CATEGORIES_INFO[item.category];
      if (targetBin) {
        spawnFloatingText(item.x, item.y, 'Yanlış Kutu! (-1 Can)', '#ef4444');
        onItemFeedback(
          `Dikkat! "${item.name}" ${targetBin.name} değil, ${correctCatInfo.name} kutusuna aittir!`,
          true
        );
      } else {
        spawnFloatingText(item.x, item.y, 'Yere Düştü! (-1 Can)', '#ef4444');
        onItemFeedback(`"${item.name}" yere düştü! ${item.ecoTip}`, true);
      }

      if (newLives <= 0) {
        soundManager.playGameOver();
        const total = correctCountRef.current + wrongCountRef.current;
        const accuracy = total > 0 ? Math.round((correctCountRef.current / total) * 100) : 0;
        onGameOver({
          score: scoreRef.current,
          level: currentLevelRef.current.id,
          accuracy,
          totalSorted: totalSortedRef.current,
          correctCount: correctCountRef.current,
          wrongCount: wrongCountRef.current,
        });
      }
    }

    // Remove item
    itemsRef.current = itemsRef.current.filter((i) => i.id !== item.id);
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const delta = Math.min(50, currentTime - lastTime);
      lastTime = currentTime;

      // Screen Shake
      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 0.8 * (delta / 16));
      }

      // Draw Background
      drawBackground(ctx, width, height, bgStateRef.current, delta);

      // Spawn Logic
      if (!isPausedRef.current && livesRef.current > 0 && !isLevelCompletedRef.current) {
        const spawnDelay = currentLevelRef.current.spawnInterval;
        if (currentTime - lastSpawnTimeRef.current > spawnDelay) {
          const maxAllowed = currentLevelRef.current.maxItemsOnScreen;
          if (itemsRef.current.length < maxAllowed) {
            spawnWasteItem(width);
            lastSpawnTimeRef.current = currentTime;
          }
        }
      }

      // Update & Draw Bins
      binsRef.current.forEach((bin) => {
        if (bin.bounceScale > 1.0) {
          bin.bounceScale = Math.max(1.0, bin.bounceScale - 0.02 * (delta / 16));
        }
      });
      drawRecyclingBins(ctx, binsRef.current, isDraggingRef.current);

      // Update & Draw Items
      const items = itemsRef.current;
      const bins = binsRef.current;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        if (!isPausedRef.current && livesRef.current > 0 && !isLevelCompletedRef.current) {
          if (item.isGrabbed) {
            const targetX = mousePosRef.current.x - item.grabOffsetX;
            const targetY = mousePosRef.current.y - item.grabOffsetY;
            item.x += (targetX - item.x) * 0.45;
            item.y += (targetY - item.y) * 0.45;
            item.scale = Math.min(1.2, item.scale + 0.05);

            bins.forEach((bin) => {
              const inX = item.x >= bin.x && item.x <= bin.x + bin.width;
              const inY = item.y >= bin.y - 20 && item.y <= bin.y + bin.height;
              bin.isHighlighted = inX && inY;
            });
          } else {
            item.y += item.vy * (delta / 16);
            item.x += item.vx * (delta / 16);
            item.rotation += item.rotationSpeed * (delta / 16);
            item.scale = Math.max(1.0, item.scale - 0.05);

            // Wall bounce
            if (item.x - item.radius < 10) {
              item.x = item.radius + 10;
              item.vx = Math.abs(item.vx);
            } else if (item.x + item.radius > width - 10) {
              item.x = width - item.radius - 10;
              item.vx = -Math.abs(item.vx);
            }

            // Fall into bin directly
            let hitBin: RecyclingBin | null = null;
            bins.forEach((bin) => {
              if (
                item.x >= bin.x &&
                item.x <= bin.x + bin.width &&
                item.y + item.radius >= bin.y + 10 &&
                item.y <= bin.y + bin.height * 0.5
              ) {
                hitBin = bin;
              }
            });

            if (hitBin) {
              handleWasteSorting(item, hitBin);
              continue;
            }

            // Missed item dropped to ground
            if (item.y + item.radius >= height - 32) {
              handleWasteSorting(item, null);
              continue;
            }
          }
        }

        drawWasteItem(ctx, item);
      }

      // Update Particles
      for (let pIdx = particlesRef.current.length - 1; pIdx >= 0; pIdx--) {
        const p = particlesRef.current[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(pIdx, 1);
        }
      }
      drawParticles(ctx, particlesRef.current);

      // Update Floating Texts
      for (let tIdx = floatTextsRef.current.length - 1; tIdx >= 0; tIdx--) {
        const t = floatTextsRef.current[tIdx];
        t.y += t.vy;
        t.alpha = Math.max(0, t.alpha - 0.02);
        if (t.alpha <= 0) {
          floatTextsRef.current.splice(tIdx, 1);
        }
      }
      drawFloatingTexts(ctx, floatTextsRef.current);

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [difficulty]);

  // Pointer & Touch event handlers with robust mobile / tablet support
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPausedRef.current || livesRef.current <= 0 || isLevelCompletedRef.current) return;
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current = { x, y };

    // Generous touch hit detection radius (+24px) for mobile / tablet fingers
    for (let i = itemsRef.current.length - 1; i >= 0; i--) {
      const item = itemsRef.current[i];
      const dist = Math.hypot(item.x - x, item.y - y);
      if (dist <= item.radius + 24) {
        item.isGrabbed = true;
        item.grabOffsetX = x - item.x;
        item.grabOffsetY = y - item.y;
        grabbedItemIdRef.current = item.id;
        isDraggingRef.current = true;
        soundManager.playGrab();
        break;
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current = { x, y };
  };

  const handlePointerUp = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      const { x, y } = getCanvasCoords(e);
      mousePosRef.current = { x, y };
    }

    if (!isDraggingRef.current || !grabbedItemIdRef.current) {
      isDraggingRef.current = false;
      grabbedItemIdRef.current = null;
      return;
    }

    const grabbedItem = itemsRef.current.find((i) => i.id === grabbedItemIdRef.current);
    if (grabbedItem) {
      grabbedItem.isGrabbed = false;

      let matchedBin: RecyclingBin | null = null;
      binsRef.current.forEach((bin) => {
        bin.isHighlighted = false;
        const inX = grabbedItem.x >= bin.x - 10 && grabbedItem.x <= bin.x + bin.width + 10;
        const inY = grabbedItem.y >= bin.y - 30 && grabbedItem.y <= bin.y + bin.height + 20;
        if (inX && inY) {
          matchedBin = bin;
        }
      });

      if (matchedBin) {
        handleWasteSorting(grabbedItem, matchedBin);
      }
    }

    isDraggingRef.current = false;
    grabbedItemIdRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden touch-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
