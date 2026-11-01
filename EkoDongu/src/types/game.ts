export type WasteCategory =
  | 'KAGIT'
  | 'PLASTIK'
  | 'CAM'
  | 'ORGANIK'
  | 'METAL'
  | 'PIL'
  | 'ELEKTRONIK';

export interface WasteItemTemplate {
  name: string;
  category: WasteCategory;
  description: string;
  ecoTip: string;
  icon: string;
  primaryColor: string;
}

export interface ActiveWasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  ecoTip: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  isGrabbed: boolean;
  grabOffsetX: number;
  grabOffsetY: number;
  primaryColor: string;
  icon: string;
  scale: number;
}

export interface RecyclingBin {
  category: WasteCategory;
  name: string;
  code: string;
  color: string;
  accentColor: string;
  darkColor: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bounceScale: number;
  isHighlighted: boolean;
  acceptedCount: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
  isLeaf?: boolean;
}

export interface FloatingNotification {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

export type GameDifficulty = 'KOLAY' | 'NORMAL' | 'ZOR';

export interface LevelDefinition {
  id: number;
  title: string;
  subtitle: string;
  region: string;
  description: string;
  targetItems: number;
  starThresholds: [number, number, number]; // [1 star, 2 stars, 3 stars]
  allowedCategories: WasteCategory[];
  spawnInterval: number; // ms
  baseSpeed: number;
  maxItemsOnScreen: number;
  ecoFact: string;
  bgTheme: 'garden' | 'school' | 'park' | 'beach' | 'factory' | 'tech' | 'metropolis' | 'summit' | 'space' | 'earth_hero';
}

export interface UserLevelProgress {
  stars: number; // 0, 1, 2, or 3
  highScore: number;
  isUnlocked: boolean;
  completedAt?: string;
}
