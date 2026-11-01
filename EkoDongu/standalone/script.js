/**
 * EkoDöngü - Sıfır Atık 2D Web Oyunu
 * HTML5 Canvas, CSS3 ve Vanilla JavaScript Mimarisi
 */

(function () {
  'use strict';

  // --- 1. SES YÖNETİCİSİ (Audio & Web Audio API Fallback) ---
  class SoundController {
    constructor() {
      this.isMusicMuted = false;
      this.isSfxMuted = false;
      this.ctx = null;
      this.bgmAudio = document.getElementById('bgmAudio');
      this.successAudio = document.getElementById('successAudio');
      this.errorAudio = document.getElementById('errorAudio');
      this.gameoverAudio = document.getElementById('gameoverAudio');
      this.synthInterval = null;
      this.isPlaying = false;
    }

    initContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMusic() {
      this.isMusicMuted = !this.isMusicMuted;
      if (this.bgmAudio) this.bgmAudio.muted = this.isMusicMuted;
      if (this.isMusicMuted) {
        this.stopBGM();
      } else {
        this.playBGM();
      }
      return !this.isMusicMuted;
    }

    toggleSfx() {
      this.isSfxMuted = !this.isSfxMuted;
      return !this.isSfxMuted;
    }

    playBGM() {
      this.isPlaying = true;
      if (this.isMusicMuted) return;
      if (this.bgmAudio) {
        this.bgmAudio.play().catch(() => this.startSynthBGM());
      } else {
        this.startSynthBGM();
      }
    }

    stopBGM() {
      this.isPlaying = false;
      if (this.bgmAudio) {
        try { this.bgmAudio.pause(); this.bgmAudio.currentTime = 0; } catch (e) {}
      }
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }

    startSynthBGM() {
      if (this.isMusicMuted || this.synthInterval) return;
      this.initContext();
      if (!this.ctx) return;

      const chords = [
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66], // G
      ];
      let step = 0;

      const playChord = () => {
        if (this.isMuted || !this.ctx) return;
        const notes = chords[step % chords.length];
        step++;
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          const t = this.ctx.currentTime + idx * 0.1;
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.exponentialRampToValueAtTime(0.02, t + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 2.0);
        });
      };

      playChord();
      this.synthInterval = setInterval(playChord, 2200);
    }

    playSuccess() {
      if (this.isMuted) return;
      if (this.successAudio && this.successAudio.readyState >= 2) {
        this.successAudio.currentTime = 0;
        this.successAudio.play().catch(() => this.synthSuccess());
      } else {
        this.synthSuccess();
      }
    }

    synthSuccess() {
      this.initContext();
      if (!this.ctx) return;
      [659.25, 987.77].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.45);
      });
    }

    playError() {
      if (this.isMuted) return;
      if (this.errorAudio && this.errorAudio.readyState >= 2) {
        this.errorAudio.currentTime = 0;
        this.errorAudio.play().catch(() => this.synthError());
      } else {
        this.synthError();
      }
    }

    synthError() {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    }

    playGameOver() {
      if (this.isMuted) return;
      if (this.gameoverAudio && this.gameoverAudio.readyState >= 2) {
        this.gameoverAudio.currentTime = 0;
        this.gameoverAudio.play().catch(() => {});
      }
    }
  }

  // --- 2. ATIK TÜRLERİ VE EĞİTİCİ VERİLER ---
  const CATEGORIES = {
    KAGIT: { name: 'Kağıt', color: '#2563EB', dark: '#1D4ED8' },
    PLASTIK: { name: 'Plastik', color: '#EAB308', dark: '#CA8A04' },
    CAM: { name: 'Cam', color: '#16A34A', dark: '#15803D' },
    ORGANIK: { name: 'Organik', color: '#854D0E', dark: '#713F12' },
    METAL: { name: 'Metal', color: '#64748B', dark: '#475569' },
    PIL: { name: 'Pil', color: '#DC2626', dark: '#B91C1C' },
    ELEKTRONIK: { name: 'E-Atık', color: '#7C3AED', dark: '#6D28D9' }
  };

  const ITEMS = [
    { name: 'Gazete', cat: 'KAGIT', color: '#3B82F6', icon: 'newspaper' },
    { name: 'Koli', cat: 'KAGIT', color: '#60A5FA', icon: 'box' },
    { name: 'Defter', cat: 'KAGIT', color: '#2563EB', icon: 'book' },
    { name: 'Su Şişesi', cat: 'PLASTIK', color: '#EAB308', icon: 'bottle' },
    { name: 'Deterjan', cat: 'PLASTIK', color: '#F59E0B', icon: 'flask' },
    { name: 'Yoğurt Kabı', cat: 'PLASTIK', color: '#FBBF24', icon: 'cup' },
    { name: 'Cam Şişe', cat: 'CAM', color: '#16A34A', icon: 'glass-bottle' },
    { name: 'Kavanoz', cat: 'CAM', color: '#22C55E', icon: 'jar' },
    { name: 'Soda Şişesi', cat: 'CAM', color: '#4ADE80', icon: 'soda' },
    { name: 'Elma Koçanı', cat: 'ORGANIK', color: '#B45309', icon: 'apple' },
    { name: 'Muz Kabuğu', cat: 'ORGANIK', color: '#D97706', icon: 'banana' },
    { name: 'Çürük Domates', cat: 'ORGANIK', color: '#DC2626', icon: 'tomato' },
    { name: 'Teneke Kutu', cat: 'METAL', color: '#94A3B8', icon: 'can' },
    { name: 'Konserve', cat: 'METAL', color: '#64748B', icon: 'tin' },
    { name: 'Kalem Pil (AA)', cat: 'PIL', color: '#DC2626', icon: 'battery-aa' },
    { name: '9V Blok Pil', cat: 'PIL', color: '#EF4444', icon: 'battery-9v' },
    { name: 'Eski Telefon', cat: 'ELEKTRONIK', color: '#7C3AED', icon: 'smartphone' },
    { name: 'Bozuk Fare', cat: 'ELEKTRONIK', color: '#8B5CF6', icon: 'mouse' },
    { name: 'Devre Kartı', cat: 'ELEKTRONIK', color: '#6D28D9', icon: 'chip' }
  ];

  const ECO_FACTS = [
    '1 ton kağıt geri dönüştürüldüğünde 17 yetişkin ağaç ve 26.500 litre su kurtarılır!',
    'Cam ambalaj saflığını hiç kaybetmeden sonsuz kez geri dönüştürülebilir.',
    'Plastik şişelerin doğada kaybolması 450 yıl sürer; geri dönüştürerek petrol tasarrufu sağlarız.',
    'Organik atıkları kompost yaparak toprağa en zengin doğal gübreyi kazandırabilirsiniz.',
    'Tek bir cam şişenin geri dönüşümü ile bir televizyonu 20 dakika çalıştıracak enerji kazanılır.'
  ];

  // --- 3. ANA OYUN MOTORU ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const sound = new SoundController();

  let state = {
    isRunning: false,
    isPaused: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('ekodongu_hs') || '0', 10),
    lives: 3,
    level: 1,
    progress: 0,
    combo: 0,
    difficulty: 'NORMAL',
    items: [],
    bins: [],
    particles: [],
    lastSpawn: 0,
    grabbedItem: null,
    dragOffset: { x: 0, y: 0 },
    stats: { correct: 0, wrong: 0 }
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBins();
  }

  function initBins() {
    const cats = ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK', 'METAL', 'PIL', 'ELEKTRONIK'];
    const total = cats.length;
    const spacing = 8;
    const margin = 12;
    const available = canvas.width - margin * 2 - spacing * (total - 1);
    const binW = Math.min(130, available / total);
    const binH = Math.min(120, canvas.height * 0.18);
    const startX = (canvas.width - (binW * total + spacing * (total - 1))) / 2;
    const binY = canvas.height - binH - 15;

    state.bins = cats.map((cat, idx) => ({
      cat: cat,
      name: CATEGORIES[cat].name,
      color: CATEGORIES[cat].color,
      dark: CATEGORIES[cat].dark,
      x: startX + idx * (binW + spacing),
      y: binY,
      w: binW,
      h: binH,
      highlight: false
    }));
  }

  function spawnItem() {
    const template = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const r = 28;
    const x = Math.random() * (canvas.width - r * 4) + r * 2;
    let speed = state.difficulty === 'KOLAY' ? 1.2 : state.difficulty === 'ZOR' ? 2.4 : 1.7;
    speed += (state.level - 1) * 0.35;

    state.items.push({
      id: Math.random().toString(),
      name: template.name,
      cat: template.cat,
      color: template.color,
      x: x,
      y: -r,
      vy: speed,
      vx: (Math.random() - 0.5) * 0.5,
      r: r,
      isGrabbed: false
    });
  }

  function handleDrop(item, bin) {
    if (bin && bin.cat === item.cat) {
      // Başarı
      state.stats.correct++;
      state.combo++;
      const mult = Math.min(5, 1 + Math.floor(state.combo / 3));
      state.score += 100 * mult;
      sound.playSuccess();
      showToast(`Harika! ${item.name} doğru kutuya atıldı.`);
      
      state.progress += 15;
      if (state.progress >= 100) {
        state.progress = 0;
        state.level++;
      }
    } else {
      // Hata
      state.stats.wrong++;
      state.combo = 0;
      state.lives--;
      sound.playError();
      showToast(bin ? `Yanlış Kutu! ${item.name} ${CATEGORIES[item.cat].name} kutusuna aitti.` : `${item.name} yere düştü!`);

      if (state.lives <= 0) {
        gameOver();
      }
    }

    state.items = state.items.filter(i => i.id !== item.id);
    updateHUD();
  }

  function updateHUD() {
    document.getElementById('scoreDisplay').innerText = state.score;
    document.getElementById('levelDisplay').innerText = state.level;
    document.getElementById('levelProgress').style.width = `${state.progress}%`;

    const hearts = document.querySelectorAll('#livesContainer .heart');
    hearts.forEach((h, idx) => {
      if (idx < state.lives) h.classList.remove('lost');
      else h.classList.add('lost');
    });

    const comboBanner = document.getElementById('comboBanner');
    if (state.combo >= 2) {
      comboBanner.innerText = `${state.combo}x KOMBO!`;
      comboBanner.classList.remove('hidden');
    } else {
      comboBanner.classList.add('hidden');
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toastMessage');
    t.innerText = msg;
    t.classList.remove('hidden');
    clearTimeout(t.timer);
    t.timer = setTimeout(() => t.classList.add('hidden'), 1800);
  }

  function gameOver() {
    state.isRunning = false;
    sound.stopBGM();
    sound.playGameOver();

    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('ekodongu_hs', state.score.toString());
      document.getElementById('newRecordNotice').classList.remove('hidden');
    } else {
      document.getElementById('newRecordNotice').classList.add('hidden');
    }

    document.getElementById('finalScore').innerText = state.score;
    document.getElementById('statLevel').innerText = state.level;
    const total = state.stats.correct + state.stats.wrong;
    document.getElementById('statAccuracy').innerText = total > 0 ? `%${Math.round((state.stats.correct / total) * 100)}` : '%0';
    document.getElementById('statCount').innerText = state.stats.correct;

    const randomFact = ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)];
    document.getElementById('ecoFactText').innerText = randomFact;

    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
  }

  // --- 4. RENDER DÖNGÜSÜ (requestAnimationFrame) ---
  function gameLoop(now) {
    if (state.isRunning && !state.isPaused) {
      // Spawn kontrolü
      const spawnDelay = Math.max(900, 2200 - state.level * 200);
      if (now - state.lastSpawn > spawnDelay && state.items.length < 5) {
        spawnItem();
        state.lastSpawn = now;
      }

      // Güncelle
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        if (!item.isGrabbed) {
          item.y += item.vy;
          item.x += item.vx;
          if (item.x - item.r < 0 || item.x + item.r > canvas.width) item.vx *= -1;

          // Yere düşme kontrolü
          if (item.y + item.r >= canvas.height - 30) {
            handleDrop(item, null);
          }
        }
      }
    }

    // Çizim
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gökyüzü ve Zemin Çizimi
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    // Kutuları Çiz
    state.bins.forEach(bin => {
      ctx.fillStyle = bin.color;
      ctx.strokeStyle = bin.highlight ? '#ffffff' : bin.dark;
      ctx.lineWidth = bin.highlight ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(bin.x, bin.y, bin.w, bin.h, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bin.name, bin.x + bin.w / 2, bin.y + bin.h / 2 + 5);
    });

    // Atıkları Çiz
    state.items.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, item.x, item.y + 4);
    });

    requestAnimationFrame(gameLoop);
  }

  // --- 5. ETKİLEŞİM & OLAY DİNLEYİCİLERİ ---
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }

  function onPointerDown(e) {
    if (!state.isRunning || state.isPaused) return;
    const p = getPos(e);
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];
      if (Math.hypot(it.x - p.x, it.y - p.y) <= it.r + 15) {
        it.isGrabbed = true;
        state.grabbedItem = it;
        state.dragOffset = { x: p.x - it.x, y: p.y - it.y };
        break;
      }
    }
  }

  function onPointerMove(e) {
    if (!state.grabbedItem) return;
    const p = getPos(e);
    state.grabbedItem.x = p.x - state.dragOffset.x;
    state.grabbedItem.y = p.y - state.dragOffset.y;

    state.bins.forEach(bin => {
      bin.highlight = state.grabbedItem.x >= bin.x && state.grabbedItem.x <= bin.x + bin.w &&
                      state.grabbedItem.y >= bin.y - 20 && state.grabbedItem.y <= bin.y + bin.h;
    });
  }

  function onPointerUp() {
    if (!state.grabbedItem) return;
    const item = state.grabbedItem;
    let matchedBin = null;

    state.bins.forEach(bin => {
      bin.highlight = false;
      if (item.x >= bin.x && item.x <= bin.x + bin.w &&
          item.y >= bin.y - 30 && item.y <= bin.y + bin.h + 20) {
        matchedBin = bin;
      }
    });

    if (matchedBin) {
      handleDrop(item, matchedBin);
    }
    item.isGrabbed = false;
    state.grabbedItem = null;
  }

  // Event Listeners
  window.addEventListener('resize', resizeCanvas);
  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  // UI Düğmeleri
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    state.isRunning = true;
    state.score = 0;
    state.lives = 3;
    state.level = 1;
    state.progress = 0;
    state.combo = 0;
    state.items = [];
    state.stats = { correct: 0, wrong: 0 };
    updateHUD();
    sound.playBGM();
  });

  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    state.isRunning = true;
    state.score = 0;
    state.lives = 3;
    state.level = 1;
    state.progress = 0;
    state.combo = 0;
    state.items = [];
    state.stats = { correct: 0, wrong: 0 };
    updateHUD();
    sound.playBGM();
  });

  document.getElementById('homeBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.diff;
    });
  });

  const updateMusicButtons = () => {
    const isMusicOn = !sound.isMusicMuted;
    const startMusicBtn = document.getElementById('startMusicBtn');
    const hudMusicBtn = document.getElementById('hudMusicBtn');
    if (startMusicBtn) startMusicBtn.innerText = isMusicOn ? '🎵 Müzik: Açık' : '🔇 Müzik: Kapalı';
    if (hudMusicBtn) hudMusicBtn.innerText = isMusicOn ? '🎵' : '🔇';
  };

  const updateSfxButtons = () => {
    const isSfxOn = !sound.isSfxMuted;
    const startMuteBtn = document.getElementById('startMuteBtn');
    const hudMuteBtn = document.getElementById('hudMuteBtn');
    if (startMuteBtn) startMuteBtn.innerText = isSfxOn ? '🔊 Efektler: Açık' : '🔇 Efektler: Kapalı';
    if (hudMuteBtn) hudMuteBtn.innerText = isSfxOn ? '🔊' : '🔇';
  };

  document.getElementById('startMusicBtn')?.addEventListener('click', () => {
    sound.toggleMusic();
    updateMusicButtons();
  });

  document.getElementById('hudMusicBtn')?.addEventListener('click', () => {
    sound.toggleMusic();
    updateMusicButtons();
  });

  document.getElementById('startMuteBtn')?.addEventListener('click', () => {
    sound.toggleSfx();
    updateSfxButtons();
  });

  document.getElementById('hudMuteBtn')?.addEventListener('click', () => {
    sound.toggleSfx();
    updateSfxButtons();
  });

  document.getElementById('howToPlayBtn').addEventListener('click', () => {
    document.getElementById('helpModal').classList.remove('hidden');
  });

  document.getElementById('closeHelpBtn').addEventListener('click', () => {
    document.getElementById('helpModal').classList.add('hidden');
  });

  // Başlat
  resizeCanvas();
  requestAnimationFrame(gameLoop);
})();
