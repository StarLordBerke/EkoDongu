import { ActiveWasteItem, Particle, RecyclingBin, FloatingNotification } from '../types/game';

interface BackgroundState {
  clouds: Array<{ x: number; y: number; speed: number; scale: number; opacity: number }>;
  windOffset: number;
}

export function createInitialBackgroundState(width: number): BackgroundState {
  return {
    clouds: [
      { x: width * 0.1, y: 40, speed: 0.25, scale: 0.9, opacity: 0.8 },
      { x: width * 0.45, y: 70, speed: 0.35, scale: 1.2, opacity: 0.9 },
      { x: width * 0.8, y: 35, speed: 0.2, scale: 0.75, opacity: 0.75 },
    ],
    windOffset: 0,
  };
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgState: BackgroundState,
  delta: number
) {
  // 1. Sky Gradient (Clean eco sky)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#bae6fd'); // Light sky blue
  skyGrad.addColorStop(0.55, '#e0f2fe');
  skyGrad.addColorStop(0.85, '#f0fdf4'); // Soft mint meadow transition
  skyGrad.addColorStop(1, '#dcfce7');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Sunlight rays (subtle ambient)
  ctx.save();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
  ctx.beginPath();
  ctx.arc(width * 0.88, 30, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.88, 30, 140, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
  ctx.fill();
  ctx.restore();

  // 3. Animated Clouds
  bgState.clouds.forEach((cloud) => {
    cloud.x += cloud.speed * (delta / 16);
    if (cloud.x > width + 120 * cloud.scale) {
      cloud.x = -150 * cloud.scale;
    }
    drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.opacity);
  });

  // 4. Distant Green Hills
  ctx.save();
  ctx.fillStyle = '#86efac'; // Mint green
  ctx.beginPath();
  ctx.moveTo(0, height - 140);
  ctx.bezierCurveTo(width * 0.25, height - 190, width * 0.5, height - 110, width, height - 160);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Fore-hills
  ctx.fillStyle = '#4ade80'; // Emerald green
  ctx.beginPath();
  ctx.moveTo(0, height - 110);
  ctx.bezierCurveTo(width * 0.35, height - 80, width * 0.7, height - 145, width, height - 95);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 5. Stylized trees on hills
  drawStylizedTree(ctx, width * 0.12, height - 135, 24);
  drawStylizedTree(ctx, width * 0.16, height - 130, 18);
  drawStylizedTree(ctx, width * 0.85, height - 125, 26);
  drawStylizedTree(ctx, width * 0.91, height - 120, 20);

  // 6. Ground Base Platform (where bins sit)
  ctx.fillStyle = '#15803d'; // Deep lush green ground line
  ctx.fillRect(0, height - 30, width, 30);
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, height - 8, width, 8);

  ctx.restore();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(x, y, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y - 10 * scale, 26 * scale, 0, Math.PI * 2);
  ctx.arc(x + 42 * scale, y - 6 * scale, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 58 * scale, y + 4 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 20 * scale, y + 10 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStylizedTree(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
  ctx.save();
  // Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 2, y, 4, height);

  // Canopy
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(x, y - height * 0.4, height * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(x + 3, y - height * 0.35, height * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Draws the 4 large recycling bins with responsive layout and juicy bounce */
export function drawRecyclingBins(
  ctx: CanvasRenderingContext2D,
  bins: RecyclingBin[],
  isDragging: boolean
) {
  bins.forEach((bin) => {
    ctx.save();

    const centerX = bin.x + bin.width / 2;
    const centerY = bin.y + bin.height / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(bin.bounceScale, bin.bounceScale);
    ctx.translate(-centerX, -centerY);

    const bx = bin.x;
    const by = bin.y;
    const bw = bin.width;
    const bh = bin.height;
    const radius = 14;

    // Drop Shadow
    ctx.shadowColor = bin.isHighlighted ? bin.color : 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = bin.isHighlighted ? 22 : 8;
    ctx.shadowOffsetY = bin.isHighlighted ? 2 : 4;

    // Bin Body
    ctx.fillStyle = bin.color;
    ctx.strokeStyle = bin.isHighlighted ? '#ffffff' : bin.darkColor;
    ctx.lineWidth = bin.isHighlighted ? 4 : 2;

    ctx.beginPath();
    ctx.roundRect(bx, by + 12, bw, bh - 12, [0, 0, radius, radius]);
    ctx.fill();
    ctx.stroke();

    // Reset shadow for details
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Subtle 3D glossy highlight on left side
    const glossGrad = ctx.createLinearGradient(bx, by, bx + bw * 0.35, by);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = glossGrad;
    ctx.beginPath();
    ctx.roundRect(bx + 4, by + 16, bw * 0.25, bh - 22, 6);
    ctx.fill();

    // Bin Top Rim / Lid (opens slightly if highlighted)
    const lidLift = bin.isHighlighted ? 8 : 0;
    ctx.fillStyle = bin.accentColor;
    ctx.strokeStyle = bin.darkColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(bx - 4, by - lidLift, bw + 8, 16, 6);
    ctx.fill();
    ctx.stroke();

    // Drop Slot
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(bx + bw * 0.18, by + 4 - lidLift, bw * 0.64, 8, 4);
    ctx.fill();

    // Bin Icon or Recycle Symbol
    const symSize = Math.min(bw * 0.16, 15);
    if (bin.category === 'PIL') {
      // Battery icon
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(centerX - 6, by + bh * 0.38, 12, 16);
      ctx.fillRect(centerX - 3, by + bh * 0.38 - 3, 6, 3);
      ctx.fillStyle = bin.color;
      ctx.fillRect(centerX - 4, by + bh * 0.38 + 2, 8, 12);
    } else if (bin.category === 'ELEKTRONIK') {
      // Tech microchip icon
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(centerX - 7, by + bh * 0.38, 14, 14);
      ctx.fillStyle = bin.color;
      ctx.fillRect(centerX - 4, by + bh * 0.38 + 3, 8, 8);
    } else if (bin.category === 'METAL') {
      // Metal Can / Magnet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(centerX - 6, by + bh * 0.38, 12, 15, 3);
      ctx.fill();
      ctx.fillStyle = bin.color;
      ctx.fillRect(centerX - 5, by + bh * 0.38 + 4, 10, 7);
    } else {
      // Recycle Symbol (Möbius arrows)
      drawRecycleSymbol(ctx, centerX, by + bh * 0.44, symSize, '#ffffff');
    }

    // Bin Text Label
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, Math.min(13, bw * 0.14))}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bin.name, centerX, by + bh * 0.72);

    // Accepted Count Badge
    if (bin.acceptedCount > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.roundRect(centerX - 18, by + bh * 0.85, 36, 14, 7);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${bin.acceptedCount}`, centerX, by + bh * 0.85 + 7);
    }

    // Active drag indicator beacon
    if (isDragging && bin.isHighlighted) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(bx - 6, by - lidLift - 4, bw + 12, bh + lidLift + 8);
      ctx.setLineDash([]);
    }

    ctx.restore();
  });
}

/** Draws high-detail vector graphic for each waste item */
export function drawWasteItem(ctx: CanvasRenderingContext2D, item: ActiveWasteItem) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.scale(item.scale, item.scale);
  ctx.rotate(item.rotation);

  // If item is grabbed, draw soft pulsing glow
  if (item.isGrabbed) {
    ctx.shadowColor = item.primaryColor;
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fill();
  } else {
    // Normal subtle drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
  }

  // Draw specific item vector based on template icon
  renderVectorItem(ctx, item.icon, item.radius, item.primaryColor);

  ctx.restore();

  // Draw floating item label (always horizontal, not rotated)
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';

  const textY = item.y - item.radius - 12;
  const metrics = ctx.measureText(item.name);
  const pillWidth = metrics.width + 16;

  // Background pill for label
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(item.x - pillWidth / 2, textY - 9, pillWidth, 18, 9);
  ctx.fill();

  // White text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(item.name, item.x, textY + 4);

  // Grab handle icon / indicator if not grabbed
  if (!item.isGrabbed) {
    ctx.fillStyle = item.primaryColor;
    ctx.beginPath();
    ctx.arc(item.x, item.y + item.radius + 8, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** Vector graphic drawing functions for waste items */
function renderVectorItem(
  ctx: CanvasRenderingContext2D,
  icon: string,
  r: number,
  primaryColor: string
) {
  switch (icon) {
    // --- KAĞIT ---
    case 'newspaper': {
      // Newspaper sheets
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-r * 0.85, -r * 0.65, r * 1.7, r * 1.3, 3);
      ctx.fill();
      ctx.stroke();

      // Fold effect
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-r * 0.85, -r * 0.65, r * 0.8, r * 1.3);

      // Newspaper header
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-r * 0.7, -r * 0.45, r * 0.6, 3);
      ctx.fillRect(r * 0.05, -r * 0.45, r * 0.65, 3);

      // Article lines
      ctx.fillStyle = '#64748b';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-r * 0.7, -r * 0.2 + i * 5, r * 0.5, 2);
        ctx.fillRect(r * 0.05, -r * 0.2 + i * 5, r * 0.65, 2);
      }
      break;
    }

    case 'box': {
      // Cardboard box
      ctx.fillStyle = '#d97706'; // Cardboard brown
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-r * 0.8, -r * 0.7, r * 1.6, r * 1.4, 4);
      ctx.fill();
      ctx.stroke();

      // Flaps & Tape
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-r * 0.15, -r * 0.7, r * 0.3, r * 1.4);

      // Fragile / Recycle stamp
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-r * 0.55, -r * 0.2, r * 0.3, r * 0.3);
      break;
    }

    case 'book': {
      // Notebook with spine and lines
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-r * 0.75, -r * 0.9, r * 1.5, r * 1.8, 4);
      ctx.fill();

      // Pages edge
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-r * 0.65, -r * 0.8, r * 1.3, r * 1.6);

      // Bookmark / spiral
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(-r * 0.65, -r * 0.8, 5, r * 1.6);
      break;
    }

    case 'package': {
      // Egg carton
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-r * 0.9, -r * 0.5, r * 1.8, r * 1.0, 5);
      ctx.fill();
      ctx.stroke();

      // Egg indentation bumps
      ctx.fillStyle = '#f8fafc';
      [-r * 0.5, 0, r * 0.5].forEach((gx) => {
        ctx.beginPath();
        ctx.arc(gx, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // --- PLASTİK ---
    case 'bottle': {
      // PET Plastic Bottle
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;

      // Cap
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-r * 0.2, -r * 0.95, r * 0.4, r * 0.2);

      // Neck & Body
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.beginPath();
      ctx.moveTo(-r * 0.15, -r * 0.75);
      ctx.lineTo(-r * 0.4, -r * 0.45);
      ctx.lineTo(-r * 0.4, r * 0.8);
      ctx.lineTo(r * 0.4, r * 0.8);
      ctx.lineTo(r * 0.4, -r * 0.45);
      ctx.lineTo(r * 0.15, -r * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-r * 0.4, -r * 0.1, r * 0.8, r * 0.45);
      break;
    }

    case 'flask': {
      // Detergent Jug
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-r * 0.6, -r * 0.75, r * 1.2, r * 1.5, 8);
      ctx.fill();
      ctx.stroke();

      // Spout
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(r * 0.1, -r * 0.95, r * 0.35, r * 0.25);

      // Handle hole
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-r * 0.25, 0, 4, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cup': {
      // Yogurt / plastic cup
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.6);
      ctx.lineTo(r * 0.55, -r * 0.6);
      ctx.lineTo(r * 0.4, r * 0.7);
      ctx.lineTo(-r * 0.4, r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Colorful band
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-r * 0.45, -r * 0.2, r * 0.9, r * 0.4);
      break;
    }

    case 'droplet': {
      // Shampoo bottle
      ctx.fillStyle = '#f43f5e';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-r * 0.45, -r * 0.8, r * 0.9, r * 1.6, 12);
      ctx.fill();
      ctx.stroke();

      // Pump cap
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-r * 0.2, -r * 1.05, r * 0.4, r * 0.3);
      ctx.fillRect(-r * 0.4, -r * 1.1, r * 0.5, 4);
      break;
    }

    // --- CAM ---
    case 'wine':
    case 'glass-bottle': {
      // Sleek glass bottle
      ctx.fillStyle = 'rgba(34, 197, 94, 0.75)'; // Emerald glass
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;

      ctx.beginPath();
      // Long neck
      ctx.moveTo(-r * 0.15, -r * 0.95);
      ctx.lineTo(r * 0.15, -r * 0.95);
      ctx.lineTo(r * 0.18, -r * 0.4);
      // Broad shoulders
      ctx.lineTo(r * 0.45, -r * 0.15);
      // Body
      ctx.lineTo(r * 0.45, r * 0.85);
      ctx.lineTo(-r * 0.45, r * 0.85);
      ctx.lineTo(-r * 0.45, -r * 0.15);
      ctx.lineTo(-r * 0.18, -r * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glass specular reflection highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, -r * 0.05);
      ctx.lineTo(-r * 0.3, r * 0.7);
      ctx.stroke();
      break;
    }

    case 'jar': {
      // Jam Glass Jar
      ctx.fillStyle = 'rgba(74, 222, 128, 0.75)';
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-r * 0.65, -r * 0.55, r * 1.3, r * 1.3, 6);
      ctx.fill();
      ctx.stroke();

      // Checkered Jar Lid
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-r * 0.75, -r * 0.8, r * 1.5, r * 0.28, 4);
      ctx.fill();

      // Specular shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.roundRect(-r * 0.5, -r * 0.35, 4, r * 0.8, 2);
      ctx.fill();
      break;
    }

    case 'soda': {
      // Soda glass bottle
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.4, r * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Metal crown cap
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-r * 0.2, -r * 0.9, r * 0.4, 4);
      break;
    }

    // --- ORGANİK ---
    case 'apple': {
      // Apple core (yenmiş elma koçanı)
      ctx.fillStyle = '#fef08a'; // Apple flesh
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.6);
      ctx.quadraticCurveTo(0, -r * 0.4, r * 0.6, -r * 0.6); // top curvature
      ctx.quadraticCurveTo(r * 0.15, 0, r * 0.6, r * 0.6); // right bitten indentation
      ctx.quadraticCurveTo(0, r * 0.4, -r * 0.6, r * 0.6); // bottom curvature
      ctx.quadraticCurveTo(-r * 0.15, 0, -r * 0.6, -r * 0.6); // left bitten indentation
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Stem & Leaf
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(0, -r * 0.9);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(4, -r * 0.85, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Tiny seeds
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(-2, -2, 1.5, 3, 0.2, 0, Math.PI * 2);
      ctx.ellipse(2, 2, 1.5, 3, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'banana': {
      // Banana peel
      ctx.fillStyle = '#facc15'; // Banana yellow
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 2;

      // 3 peeled parts
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.bezierCurveTo(-r * 0.8, -r * 0.2, -r * 0.8, r * 0.7, -r * 0.2, r * 0.7);
      ctx.bezierCurveTo(-r * 0.1, r * 0.2, 0, 0, 0, -r * 0.8);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.bezierCurveTo(r * 0.8, -r * 0.2, r * 0.8, r * 0.7, r * 0.2, r * 0.7);
      ctx.bezierCurveTo(r * 0.1, r * 0.2, 0, 0, 0, -r * 0.8);
      ctx.fill();
      ctx.stroke();

      // Brown stalk tip
      ctx.fillStyle = '#713f12';
      ctx.fillRect(-3, -r * 0.9, 6, 6);
      break;
    }

    case 'tomato': {
      // Spoiled tomato
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 2, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Soft bruise patch
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(r * 0.2, 4, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Green star calyx
      ctx.fillStyle = '#15803d';
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 8, -r * 0.65 + Math.sin(ang) * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'egg': {
      // Cracked egg shells
      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(-r * 0.2, 0, r * 0.45, 0, Math.PI);
      ctx.lineTo(-r * 0.6, -r * 0.1);
      ctx.lineTo(-r * 0.4, 0);
      ctx.lineTo(-r * 0.2, -r * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r * 0.3, 2, r * 0.4, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'coffee': {
      // Tea bag / coffee grounds filter
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-r * 0.6, -r * 0.7, r * 1.2, r * 1.4, 3);
      ctx.fill();
      ctx.stroke();

      // Brown tea stain
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.45, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // String
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(-r * 0.3, -r * 1.1);
      ctx.stroke();
      break;
    }

    // --- METAL ---
    case 'can': {
      // Aluminum beverage can (Teneke İçecek Kutusu)
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;

      // Rim top & bottom
      ctx.beginPath();
      ctx.roundRect(-r * 0.5, -r * 0.8, r * 1.0, r * 1.6, 5);
      ctx.fill();
      ctx.stroke();

      // Colored soda stripe
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-r * 0.48, -r * 0.35, r * 0.96, r * 0.7);

      // Shiny metal specularity
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(-r * 0.35, -r * 0.75, 3, r * 1.5);

      // Pull tab on top
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.8, r * 0.25, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'tin': {
      // Food tin can (Konserve Kutusu)
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-r * 0.6, -r * 0.6, r * 1.2, r * 1.2, 4);
      ctx.fill();
      ctx.stroke();

      // Corrugated ridges
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.55, i * 6);
        ctx.lineTo(r * 0.55, i * 6);
        ctx.stroke();
      }

      // Yellow/Red label
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-r * 0.55, -r * 0.2, r * 1.1, r * 0.4);
      break;
    }

    case 'metal-cap': {
      // Crown bottle cap
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      // Fluted circle
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner stamp
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // --- PIL ---
    case 'battery-aa': {
      // AA Cylinder Battery
      ctx.fillStyle = '#1e293b'; // Battery dark body
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(-r * 0.4, -r * 0.85, r * 0.8, r * 1.7, 4);
      ctx.fill();
      ctx.stroke();

      // Positive bump (+)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-r * 0.15, -r * 1.05, r * 0.3, r * 0.2);

      // Red / Gold warning band
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-r * 0.38, -r * 0.8, r * 0.76, r * 0.7);

      // Gold tip
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-r * 0.38, -r * 0.1, r * 0.76, 3);

      // Plus sign
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', 0, -r * 0.3);
      break;
    }

    case 'battery-9v': {
      // 9V Block Battery
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-r * 0.55, -r * 0.7, r * 1.1, r * 1.4, 5);
      ctx.fill();
      ctx.stroke();

      // Snap terminals on top
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-r * 0.4, -r * 0.95, r * 0.3, r * 0.25);
      ctx.beginPath();
      ctx.arc(r * 0.25, -r * 0.85, r * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Text 9V
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('9V', 0, 4);
      break;
    }

    case 'battery-button': {
      // Button coin battery (Düğme saat pili)
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Metallic rim
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', 0, 3);
      break;
    }

    // --- ELEKTRONIK (E-ATIK) ---
    case 'smartphone': {
      // Smartphone with cracked / tech screen
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-r * 0.45, -r * 0.85, r * 0.9, r * 1.7, 6);
      ctx.fill();
      ctx.stroke();

      // Screen
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-r * 0.38, -r * 0.7, r * 0.76, r * 1.35, 3);
      ctx.fill();

      // E-Waste recycle mark on screen
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, 0);
      ctx.lineTo(r * 0.2, 0);
      ctx.moveTo(0, -r * 0.2);
      ctx.lineTo(0, r * 0.2);
      ctx.stroke();
      break;
    }

    case 'mouse': {
      // Computer mouse
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-r * 0.45, -r * 0.7, r * 0.9, r * 1.4, 12);
      ctx.fill();
      ctx.stroke();

      // Scroll wheel
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -r * 0.5, 4, 8);

      // Button split line
      ctx.strokeStyle = '#5b21b6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(0, -r * 0.1);
      ctx.stroke();
      break;
    }

    case 'chip': {
      // Integrated Circuit / PCB
      ctx.fillStyle = '#065f46'; // Green circuit board
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4, 4);
      ctx.fill();
      ctx.stroke();

      // Black microchip in center
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-r * 0.35, -r * 0.35, r * 0.7, r * 0.7);

      // Gold pins on edges
      ctx.fillStyle = '#facc15';
      [-r * 0.45, 0, r * 0.45].forEach((px) => {
        ctx.fillRect(px - 1.5, -r * 0.7, 3, 3);
        ctx.fillRect(px - 1.5, r * 0.7 - 3, 3, 3);
        ctx.fillRect(-r * 0.7, px - 1.5, 3, 3);
        ctx.fillRect(r * 0.7 - 3, px - 1.5, 3, 3);
      });
      break;
    }

    case 'usb': {
      // USB Flash Drive
      ctx.fillStyle = '#7c3aed';
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 1.5;

      // Body
      ctx.beginPath();
      ctx.roundRect(-r * 0.35, -r * 0.4, r * 0.7, r * 1.2, 4);
      ctx.fill();
      ctx.stroke();

      // Metal USB plug
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.fillRect(-r * 0.25, -r * 0.85, r * 0.5, r * 0.45);
      ctx.strokeRect(-r * 0.25, -r * 0.85, r * 0.5, r * 0.45);

      // Holes in plug
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-r * 0.15, -r * 0.75, 3, 3);
      ctx.fillRect(r * 0.05, -r * 0.75, 3, 3);
      break;
    }

    default: {
      // Fallback clean circle with icon badge
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

/** Draws standard 3-arrow recycling icon */
function drawRecycleSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  angles.forEach((ang) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);

    // Arrow curve
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.8, -Math.PI * 0.35, Math.PI * 0.15);
    ctx.stroke();

    // Arrow head
    const headX = Math.cos(Math.PI * 0.15) * size * 0.8;
    const headY = -size * 0.2 + Math.sin(Math.PI * 0.15) * size * 0.8;

    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - 4, headY - 5);
    ctx.lineTo(headX + 4, headY - 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

/** Draws sparkling particles and floating leaves */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.isLeaf) {
      // Swirling eco green leaf
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.radius * 1.5, p.radius * 0.8, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Glowing star / spark
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

/** Draws floating score and combo notifications */
export function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingNotification[]) {
  texts.forEach((item) => {
    ctx.save();
    ctx.globalAlpha = item.alpha;
    ctx.translate(item.x, item.y);
    ctx.scale(item.scale, item.scale);

    ctx.font = '900 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Stroke outline for contrast
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeText(item.text, 0, 0);

    // Fill
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, 0, 0);

    ctx.restore();
  });
}
