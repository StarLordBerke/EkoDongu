import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Layers } from 'lucide-react';

interface CodeViewerModalProps {
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState<boolean>(false);

  const htmlCode = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EkoDöngü - Sıfır Atık 2D Web Oyunu</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Oyun Konteynırı -->
  <div id="game-container">
    <!-- 2D Canvas -->
    <canvas id="gameCanvas"></canvas>

    <!-- Üst Arayüz (HUD) -->
    <header id="hud" class="hidden">
      <div class="hud-left">
        <div class="score-pill">
          <span class="label">SKOR</span>
          <span id="scoreDisplay" class="value">0</span>
        </div>
        <div class="level-pill">
          <span class="label">SEVİYE</span>
          <span id="levelDisplay" class="value">1</span>
        </div>
      </div>

      <div class="hud-center">
        <!-- İlerleme Çubuğu -->
        <div class="progress-bar-container">
          <div id="levelProgress" class="progress-fill" style="width: 0%;"></div>
        </div>
        <div id="comboBanner" class="combo-badge hidden">2x KOMBO!</div>
      </div>

      <div class="hud-right">
        <!-- Can Kalpleri -->
        <div id="livesContainer" class="lives-box">
          <span class="heart active">❤️</span>
          <span class="heart active">❤️</span>
          <span class="heart active">❤️</span>
        </div>
        <button id="hudMusicBtn" class="icon-btn" title="Müziği Aç/Kapat">🎵</button>
        <button id="hudMuteBtn" class="icon-btn" title="Efekt Sesi Aç/Kapat">🔊</button>
        <button id="pauseBtn" class="icon-btn" title="Duraklat">⏸️</button>
      </div>
    </header>

    <!-- Bildirim ve Eğitim Mesajı -->
    <div id="toastMessage" class="toast hidden"></div>

    <!-- Başlangıç Ekranı (Start Screen) -->
    <div id="startScreen" class="overlay active">
      <div class="menu-card">
        <div class="logo-badge">🌱</div>
        <h1 class="game-title">Eko<span>Döngü</span></h1>
        <p class="subtitle">Sıfır Atık & Geri Dönüşüm 2D Web Oyunu</p>

        <div id="highScoreBadge" class="high-score-badge hidden">
          🏆 En Yüksek Skor: <span id="highScoreVal">0</span>
        </div>

        <div class="bins-preview">
          <div class="bin-tag blue">📄 Kağıt</div>
          <div class="bin-tag yellow">🧴 Plastik</div>
          <div class="bin-tag green">🍾 Cam</div>
          <div class="bin-tag brown">🍎 Organik</div>
        </div>

        <div class="difficulty-select">
          <label>Zorluk Seçimi:</label>
          <div class="diff-buttons">
            <button class="diff-btn" data-diff="KOLAY">🌱 Kolay</button>
            <button class="diff-btn active" data-diff="NORMAL">⚡ Normal</button>
            <button class="diff-btn" data-diff="ZOR">🔥 Zor</button>
          </div>
        </div>

        <button id="startBtn" class="primary-btn">🎮 Oyuna Başla</button>
        <button id="howToPlayBtn" class="secondary-btn">❓ Nasıl Oynanır?</button>
        
        <div class="audio-toggle-row">
          <button id="startMusicBtn" class="text-btn">🎵 Müzik: Açık</button>
          <span style="color: rgba(255,255,255,0.4); margin: 0 4px;">•</span>
          <button id="startMuteBtn" class="text-btn">🔊 Efektler: Açık</button>
        </div>
      </div>
    </div>

    <!-- Nasıl Oynanır Modalı -->
    <div id="helpModal" class="overlay hidden">
      <div class="menu-card help-card">
        <h2>Nasıl Oynanır?</h2>
        <p class="help-desc">Yukarıdan düşen atıkları farenizle veya parmağınızla tutarak en alttaki doğru renkteki geri dönüşüm kutusuna sürükleyip bırakın.</p>
        <ul class="rules-list">
          <li><strong>Mavi Kutu:</strong> Kağıt, Karton, Gazete, Kitap</li>
          <li><strong>Sarı Kutu:</strong> Plastik Şişe, Deterjan Kutusu, Naylon</li>
          <li><strong>Yeşil Kutu:</strong> Cam Şişe, Kavanoz, Cam Bardak</li>
          <li><strong>Kahverengi Kutu:</strong> Meyve kabukları, Çay, Organik gıda</li>
        </ul>
        <p class="tip">💡 Her doğru atık +100 puan ve kombo çarpanı kazandırır. Yanlış kutulama veya yere düşen atık can kaybettirir!</p>
        <button id="closeHelpBtn" class="primary-btn">Tamam, Hazırım!</button>
      </div>
    </div>

    <!-- Oyun Bitti Ekranı (Game Over Screen) -->
    <div id="gameOverScreen" class="overlay hidden">
      <div class="menu-card game-over-card">
        <h2>Oyun Bitti!</h2>
        <p class="summary-text">Doğayı korumak için harika bir mücadele verdin!</p>

        <div class="final-score-box">
          <span class="lbl">TOPLAM SKOR</span>
          <span id="finalScore" class="val">0</span>
          <div id="newRecordNotice" class="record-text hidden">🎉 YENİ REKOR!</div>
        </div>

        <div class="stats-row">
          <div class="stat-item"><span class="t">Seviye</span><span id="statLevel">1</span></div>
          <div class="stat-item"><span class="t">Doğruluk</span><span id="statAccuracy">%100</span></div>
          <div class="stat-item"><span class="t">Ayrıştırılan</span><span id="statCount">0</span></div>
        </div>

        <!-- Sıfır Atık Eğitici Mesaj -->
        <div class="eco-fact-box">
          <strong>🌿 Sıfır Atık Bilgisi:</strong>
          <p id="ecoFactText">1 ton kağıt geri dönüştürüldüğünde 17 yetişkin ağaç kesilmekten kurtulur!</p>
        </div>

        <div class="btn-group">
          <button id="restartBtn" class="primary-btn">🔄 Tekrar Oyna</button>
          <button id="homeBtn" class="secondary-btn">🏠 Ana Menü</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Ses Dosyaları (Kendi MP3/WAV dosyalarınız için yer tutucular) -->
  <audio id="bgmAudio" src="assets/bgm.mp3" loop preload="auto"></audio>
  <audio id="successAudio" src="assets/success.wav" preload="auto"></audio>
  <audio id="errorAudio" src="assets/error.wav" preload="auto"></audio>
  <audio id="gameoverAudio" src="assets/gameover.wav" preload="auto"></audio>

  <script src="script.js"></script>
</body>
</html>`;

  const cssCode = `/* EkoDöngü: Sıfır Atık Web Oyunu - Modern Stil Dosyası */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #064e3b;
}

#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #065f46 0%, #0f172a 100%);
}

#gameCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}

/* Üst Başlık (HUD) */
#hud {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  pointer-events: none;
}

.hud-left, .hud-right, .hud-center {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-pill, .level-pill {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.score-pill .label, .level-pill .label {
  font-size: 9px;
  font-weight: 800;
  color: #a7f3d0;
  letter-spacing: 0.5px;
}

.score-pill .value {
  font-size: 18px;
  font-weight: 900;
  color: #34d399;
}

.level-pill .value {
  font-size: 18px;
  font-weight: 900;
  color: #fbbf24;
}

.progress-bar-container {
  width: 140px;
  height: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  transition: width 0.3s ease;
}

.combo-badge {
  background: #f59e0b;
  color: #451a03;
  font-size: 11px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.lives-box {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 999px;
  display: flex;
  gap: 4px;
  font-size: 16px;
}

.heart {
  transition: transform 0.2s, opacity 0.2s;
}

.heart.lost {
  opacity: 0.2;
  transform: scale(0.8);
}

.icon-btn {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(15, 23, 42, 0.95);
  transform: scale(1.05);
}

/* Toast Bildirim */
.toast {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
  border: 1px solid #10b981;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  z-index: 30;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

/* Overlay & Modallar */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 16px;
}

.menu-card {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 28px;
  padding: 32px 28px;
  max-width: 440px;
  width: 100%;
  color: white;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.logo-badge {
  font-size: 40px;
  margin-bottom: 8px;
}

.game-title {
  font-size: 38px;
  font-weight: 900;
  color: white;
}

.game-title span {
  color: #34d399;
}

.subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.bins-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin: 16px 0;
}

.bin-tag {
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.bin-tag.blue { background: #2563eb; }
.bin-tag.yellow { background: #ca8a04; }
.bin-tag.green { background: #16a34a; }
.bin-tag.brown { background: #854d0e; }

.difficulty-select {
  margin: 16px 0;
}

.difficulty-select label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.diff-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: rgba(15, 23, 42, 0.6);
  padding: 4px;
  border-radius: 14px;
}

.diff-btn {
  background: transparent;
  border: none;
  color: #cbd5e1;
  padding: 8px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-btn.active {
  background: #10b981;
  color: #064e3b;
}

.primary-btn, .secondary-btn {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  margin-top: 10px;
}

.primary-btn {
  background: linear-gradient(90deg, #10b981, #34d399);
  color: #022c22;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.audio-toggle-row {
  margin-top: 14px;
}

.text-btn {
  background: transparent;
  border: none;
  color: #a7f3d0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.hidden {
  display: none !important;
}

/* Game Over İstatistikleri */
.final-score-box {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #34d399;
  border-radius: 16px;
  padding: 16px;
  margin: 16px 0;
}

.final-score-box .lbl {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 800;
}

.final-score-box .val {
  display: block;
  font-size: 38px;
  font-weight: 900;
  color: #34d399;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.stat-item {
  background: rgba(15, 23, 42, 0.5);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
}

.stat-item .t {
  display: block;
  font-size: 10px;
  color: #94a3b8;
}

.stat-item span:last-child {
  font-size: 16px;
  font-weight: 800;
  color: white;
}

.eco-fact-box {
  background: rgba(6, 78, 59, 0.4);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 14px;
  padding: 12px;
  text-align: left;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 16px;
  line-height: 1.4;
}`;

  const jsCode = `/**
 * EkoDöngü - Sıfır Atık 2D Web Oyunu
 * HTML5 Canvas, CSS3 ve Vanilla JavaScript Mimarisi
 */

(function () {
  'use strict';

  // --- 1. SES YÖNETİCİSİ (Audio & Web Audio API Fallback) ---
  class SoundController {
    constructor() {
      this.isMuted = false;
      this.ctx = null;
      this.bgmAudio = document.getElementById('bgmAudio');
      this.successAudio = document.getElementById('successAudio');
      this.errorAudio = document.getElementById('errorAudio');
      this.gameoverAudio = document.getElementById('gameoverAudio');
      this.synthInterval = null;
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

    setMuted(muted) {
      this.isMuted = muted;
      if (this.bgmAudio) this.bgmAudio.muted = muted;
      if (muted && this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }

    playBGM() {
      if (this.isMuted) return;
      if (this.bgmAudio) {
        this.bgmAudio.play().catch(() => this.startSynthBGM());
      } else {
        this.startSynthBGM();
      }
    }

    stopBGM() {
      if (this.bgmAudio) {
        try { this.bgmAudio.pause(); this.bgmAudio.currentTime = 0; } catch (e) {}
      }
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }

    startSynthBGM() {
      if (this.isMuted || this.synthInterval) return;
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
    ORGANIK: { name: 'Organik', color: '#854D0E', dark: '#713F12' }
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
    const cats = ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK'];
    const total = cats.length;
    const spacing = 12;
    const margin = 20;
    const available = canvas.width - margin * 2 - spacing * (total - 1);
    const binW = Math.min(160, available / total);
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
      showToast(\`Harika! \${item.name} doğru kutuya atıldı.\`);
      
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
      showToast(bin ? \`Yanlış Kutu! \${item.name} \${CATEGORIES[item.cat].name} kutusuna aitti.\` : \`\${item.name} yere düştü!\`);

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
    document.getElementById('levelProgress').style.width = \`\${state.progress}%\`;

    const hearts = document.querySelectorAll('#livesContainer .heart');
    hearts.forEach((h, idx) => {
      if (idx < state.lives) h.classList.remove('lost');
      else h.classList.add('lost');
    });

    const comboBanner = document.getElementById('comboBanner');
    if (state.combo >= 2) {
      comboBanner.innerText = \`\${state.combo}x KOMBO!\`;
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
    document.getElementById('statAccuracy').innerText = total > 0 ? \`%\${Math.round((state.stats.correct / total) * 100)}\` : '%0';
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

  document.getElementById('startMuteBtn').addEventListener('click', () => {
    sound.setMuted(!sound.isMuted);
    document.getElementById('startMuteBtn').innerText = sound.isMuted ? '🔇 Ses: Kapalı' : '🔊 Ses: Açık';
  });

  document.getElementById('hudMuteBtn').addEventListener('click', () => {
    sound.setMuted(!sound.isMuted);
    document.getElementById('hudMuteBtn').innerText = sound.isMuted ? '🔇' : '🔊';
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
})();`;

  const currentCode =
    activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;
  const currentFileName =
    activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-4xl w-full h-[88vh] bg-slate-900 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>EkoDöngü Bağımsız Mimari Kodları</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Vanilla HTML5/CSS3/JS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tek sayfa veya harici projenize kopyala-yapıştır yapıp çalıştırabileceğiniz modüler kodlar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80 shrink-0 flex-wrap gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>index.html</span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'css'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>style.css</span>
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'js'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>script.js</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : `${currentFileName} Kopyala`}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>İndir</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 overflow-auto rounded-xl bg-slate-950 p-4 border border-slate-800 text-left font-mono text-xs text-emerald-100/90 leading-relaxed select-text mt-3">
          <pre className="whitespace-pre-wrap">{currentCode}</pre>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Klasör yapısı: <code>index.html</code>, <code>style.css</code>, <code>script.js</code> ve <code>assets/</code> klasörü.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all text-xs"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
