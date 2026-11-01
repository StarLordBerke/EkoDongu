export interface ScoreEntry {
  id: string;
  score: number;
  levelName: string;
  levelId: number; // 0 for Endless Mode, 1-100 for campaign levels
  date: string;
  accuracy: number;
  stars?: number;
  correctCount: number;
}

const LEADERBOARD_KEY = 'ekodongu_leaderboard_top10';

export function getTop10Scores(): ScoreEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.score - a.score).slice(0, 10);
    }
  } catch {
    // fallback
  }
  return [];
}

export function addScoreToLeaderboard(entry: {
  score: number;
  levelName: string;
  levelId: number;
  accuracy: number;
  stars?: number;
  correctCount: number;
}): { isTop10: boolean; rank: number } {
  if (typeof window === 'undefined' || entry.score <= 0) {
    return { isTop10: false, rank: -1 };
  }

  try {
    const currentList = getTop10Scores();
    const newEntry: ScoreEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const combined = [...currentList, newEntry].sort((a, b) => b.score - a.score);
    const top10 = combined.slice(0, 10);
    const rank = top10.findIndex((item) => item.id === newEntry.id) + 1;

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
    return { isTop10: rank > 0, rank };
  } catch {
    return { isTop10: false, rank: -1 };
  }
}

export function clearLeaderboard(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LEADERBOARD_KEY);
  }
}
