/**
 * EkoDöngü - Sıfır Atık Oyunu Profesyonel Ses & Müzik Motoru
 * 
 * Özellikler:
 * 1. Telifsiz Tematik Fon Müziği (BGM):
 *    - Dahili çok enstrümanlı (Kalimba/Marimba, Akustik Bas, Yumuşak Akorlar, Perküsyon)
 *      neşe dolu, doğa temalı procedural müzik motoru. (Sıfır gecikme, telifsiz, %100 kesintisiz)
 *    - Harici telifsiz parçalar (assets/bgm.mp3 ve online akış) desteği.
 * 2. Bağımsız Müzik (BGM) ve Efekt (SFX) Kontrolleri:
 *    - Müzik Aç / Kapat butonu
 *    - Ses Efektleri Aç / Kapat butonu
 *    - Ses seviyesi (volume) ayarı
 * 3. Gerçekçi Geri Dönüşüm Ses Efektleri:
 *    - Doğru kutu: Parlak kristal çan (Ding / Chime)
 *    - Yanlış kutu / Düşme: Çift tonlu uyarıcı hata (Buzzer)
 *    - Game Over: Melankolik minör bitiş melodisi
 *    - Seviye atlama: Çoşkulu zafer fanfarı
 */

export type MusicTrackId = 'eco-nature' | 'playful-groove' | 'custom-file';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private musicVolume: number = 0.55;
  private sfxVolume: number = 0.8;

  // External audio elements
  private externalBgmAudio: HTMLAudioElement | null = null;
  private sfxAudios: Record<string, HTMLAudioElement | null> = {};
  private activeTrackId: MusicTrackId = 'eco-nature';

  // Procedural BGM state
  private isBgmRunning: boolean = false;
  private musicTimerId: number | null = null;
  private currentStep: number = 0;
  private currentBar: number = 0;
  private currentZone: number = 1; // 1: 1-20, 2: 21-40, 3: 41-60, 4: 61-80, 5: 81-100
  private masterMusicGain: GainNode | null = null;
  private masterSfxGain: GainNode | null = null;

  // Listeners for UI state reactivity
  private listeners: Array<() => void> = [];

  constructor() {
    // LocalStorage restore
    if (typeof window !== 'undefined') {
      const savedMusicMute = localStorage.getItem('ekodongu_music_muted');
      if (savedMusicMute !== null) {
        this.isMusicMuted = savedMusicMute === 'true';
      }
      const savedSfxMute = localStorage.getItem('ekodongu_sfx_muted');
      if (savedSfxMute !== null) {
        this.isSfxMuted = savedSfxMute === 'true';
      }
      const savedVol = localStorage.getItem('ekodongu_music_vol');
      if (savedVol !== null) {
        this.musicVolume = parseFloat(savedVol) || 0.55;
      }
    }

    this.initExternalAudios();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private initExternalAudios() {
    if (typeof window === 'undefined') return;

    // Check custom assets/bgm.mp3
    try {
      const bgm = new Audio('assets/bgm.mp3');
      bgm.loop = true;
      bgm.volume = this.musicVolume;
      bgm.addEventListener('canplaythrough', () => {
        this.externalBgmAudio = bgm;
      });
      bgm.addEventListener('error', () => {
        this.externalBgmAudio = null;
      });
    } catch {
      this.externalBgmAudio = null;
    }

    // SFX paths
    const sfxMap: Record<string, string> = {
      success: 'assets/success.wav',
      error: 'assets/error.wav',
      gameover: 'assets/gameover.wav',
    };

    for (const [key, path] of Object.entries(sfxMap)) {
      try {
        const audio = new Audio(path);
        audio.volume = this.sfxVolume;
        audio.addEventListener('canplaythrough', () => {
          this.sfxAudios[key] = audio;
        });
        audio.addEventListener('error', () => {
          this.sfxAudios[key] = null;
        });
      } catch {
        this.sfxAudios[key] = null;
      }
    }
  }

  public getAudioContext(): AudioContext {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gains
      this.masterMusicGain = this.ctx.createGain();
      this.masterMusicGain.gain.setValueAtTime(
        this.isMusicMuted ? 0 : this.musicVolume,
        this.ctx.currentTime
      );
      this.masterMusicGain.connect(this.ctx.destination);

      this.masterSfxGain = this.ctx.createGain();
      this.masterSfxGain.gain.setValueAtTime(
        this.isSfxMuted ? 0 : this.sfxVolume,
        this.ctx.currentTime
      );
      this.masterSfxGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx!;
  }

  // --- Getters & Setters ---

  public isMusicOn(): boolean {
    return !this.isMusicMuted;
  }

  public isSfxOn(): boolean {
    return !this.isSfxMuted;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setBgmZoneForLevel(levelId: number): void {
    const newZone = levelId === 0 ? 5 : Math.min(5, Math.max(1, Math.ceil(levelId / 20)));
    if (newZone !== this.currentZone) {
      this.currentZone = newZone;
      if (this.isBgmRunning && !this.isMusicMuted) {
        this.startProceduralMusic();
      }
      this.notify();
    }
  }

  public getBgmZone(): number {
    return this.currentZone;
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    localStorage.setItem('ekodongu_music_muted', this.isMusicMuted ? 'true' : 'false');

    if (this.ctx && this.masterMusicGain) {
      this.masterMusicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterMusicGain.gain.setValueAtTime(
        this.isMusicMuted ? 0 : this.musicVolume,
        this.ctx.currentTime
      );
    }

    if (this.externalBgmAudio) {
      this.externalBgmAudio.muted = this.isMusicMuted;
    }

    if (!this.isMusicMuted && this.isBgmRunning) {
      this.startBGM();
    } else if (this.isMusicMuted) {
      this.stopProceduralMusic();
    }

    this.notify();
    return !this.isMusicMuted;
  }

  public toggleSfx(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    localStorage.setItem('ekodongu_sfx_muted', this.isSfxMuted ? 'true' : 'false');

    if (this.ctx && this.masterSfxGain) {
      this.masterSfxGain.gain.setValueAtTime(
        this.isSfxMuted ? 0 : this.sfxVolume,
        this.ctx.currentTime
      );
    }

    this.notify();
    return !this.isSfxMuted;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    localStorage.setItem('ekodongu_music_vol', this.musicVolume.toString());

    if (this.ctx && this.masterMusicGain && !this.isMusicMuted) {
      this.masterMusicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    if (this.externalBgmAudio) {
      this.externalBgmAudio.volume = this.musicVolume;
    }
    this.notify();
  }

  // Backwards compatibility toggle
  public getMuted(): boolean {
    return this.isMusicMuted && this.isSfxMuted;
  }

  public toggleMute(): boolean {
    // Toggles both
    const newState = !this.isMusicMuted;
    if (newState) {
      this.isMusicMuted = true;
      this.isSfxMuted = true;
    } else {
      this.isMusicMuted = false;
      this.isSfxMuted = false;
    }
    localStorage.setItem('ekodongu_music_muted', this.isMusicMuted ? 'true' : 'false');
    localStorage.setItem('ekodongu_sfx_muted', this.isSfxMuted ? 'true' : 'false');

    if (this.ctx) {
      if (this.masterMusicGain) {
        this.masterMusicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      }
      if (this.masterSfxGain) {
        this.masterSfxGain.gain.setValueAtTime(this.isSfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      }
    }

    if (this.isMusicMuted) {
      this.stopProceduralMusic();
    } else if (this.isBgmRunning) {
      this.startBGM();
    }

    this.notify();
    return this.isMusicMuted;
  }

  // --- Background Music (BGM) Engine ---

  public startBGM(): void {
    this.isBgmRunning = true;
    if (this.isMusicMuted) return;

    // Check if user has an external bgm.mp3 file
    if (this.externalBgmAudio && this.activeTrackId === 'custom-file') {
      this.externalBgmAudio.play().catch(() => {
        this.startProceduralMusic();
      });
      return;
    }

    // Play procedural dynamic theme music
    this.startProceduralMusic();
  }

  public stopBGM(): void {
    this.isBgmRunning = false;
    if (this.externalBgmAudio) {
      try {
        this.externalBgmAudio.pause();
        this.externalBgmAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.stopProceduralMusic();
  }

  /**
   * Procedural Multi-Zone Music Generator (Changes Every 20 Levels!):
   * Zone 1 (Levels 1-20): "Yeşil Doğa & Kalimba" - C Major Pentatonic, 112 BPM
   * Zone 2 (Levels 21-40): "Mavi Sahil & Karayip Esintisi" - G Major Tropical, 120 BPM
   * Zone 3 (Levels 41-60): "Sanayi & Tesis Elektro Nabzı" - E Minor Synth Pulse, 128 BPM
   * Zone 4 (Levels 61-80): "Siber Bilişim & Geleceğin Şehri" - D Dorian Synthwave, 132 BPM
   * Zone 5 (Levels 81-100): "Büyük Zirve & Zafer Marşı" - A Major Triumphant Anthem, 138 BPM
   */
  private startProceduralMusic(): void {
    this.stopProceduralMusic();
    if (this.isMusicMuted) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const zone = this.currentZone;
    let bpm = 112;
    let chordProgressions: Array<{ bass: number; notes: number[] }>;

    if (zone === 2) {
      // Zone 2 (Levels 21-40): G Major Tropical Breeze (120 BPM)
      bpm = 120;
      chordProgressions = [
        { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G Major (G2, G3-B3-D4-G4)
        { bass: 82.41,  notes: [164.81, 196.00, 246.94, 329.63] }, // E Minor (E2, E3-G3-B3-E4)
        { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C Major (C3, C4-E4-G4-C5)
        { bass: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }, // D Major (D3, D4-F#4-A4-D5)
      ];
    } else if (zone === 3) {
      // Zone 3 (Levels 41-60): E Minor Industrial Pulse (128 BPM)
      bpm = 128;
      chordProgressions = [
        { bass: 82.41,  notes: [164.81, 196.00, 246.94, 329.63] }, // E Minor
        { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] }, // C Major
        { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G Major
        { bass: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }, // D Major
      ];
    } else if (zone === 4) {
      // Zone 4 (Levels 61-80): D Dorian Future Cyber Synth (132 BPM)
      bpm = 132;
      chordProgressions = [
        { bass: 73.42,  notes: [146.83, 174.61, 220.00, 293.66] }, // D Minor
        { bass: 87.31,  notes: [174.61, 220.00, 261.63, 349.23] }, // F Major
        { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G Major
        { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C Major
      ];
    } else if (zone === 5) {
      // Zone 5 (Levels 81-100 & Final): A Major Triumphant Anthem (138 BPM)
      bpm = 138;
      chordProgressions = [
        { bass: 110.00, notes: [220.00, 277.18, 329.63, 440.00] }, // A Major
        { bass: 92.50,  notes: [185.00, 220.00, 277.18, 369.99] }, // F# Minor
        { bass: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }, // D Major
        { bass: 82.41,  notes: [164.81, 207.65, 246.94, 329.63] }, // E Major
      ];
    } else {
      // Zone 1 (Levels 1-20): C Major Eco Nature & Kalimba (112 BPM)
      bpm = 112;
      chordProgressions = [
        { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] }, // C Major
        { bass: 110.00, notes: [220.00, 261.63, 329.63, 392.00] }, // A Minor
        { bass: 87.31,  notes: [174.61, 220.00, 261.63, 329.63] }, // F Major
        { bass: 98.00,  notes: [196.00, 246.94, 293.66, 349.23] }, // G Major
      ];
    }

    const stepTimeMs = (60 / bpm / 4) * 1000;
    this.currentStep = 0;
    this.currentBar = 0;

    const tick = () => {
      if (this.isMusicMuted || !this.isBgmRunning) return;

      const barIdx = Math.floor(this.currentStep / 16) % chordProgressions.length;
      const stepInBar = this.currentStep % 16;
      const chord = chordProgressions[barIdx];
      const now = ctx.currentTime;

      // 1. Warm Pad / Synth Chords
      if (stepInBar === 0 || stepInBar === 8) {
        this.playSoftChordPad(chord.notes, now, stepInBar === 0 ? 1.6 : 1.1);
      }

      // 2. Bassline
      if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
        const bassFreq = stepInBar === 10 ? chord.bass * 1.5 : chord.bass;
        this.playPluckBass(bassFreq, now);
      }

      // 3. Melodic lead note variations depending on zone
      if (stepInBar % 2 === 0) {
        const noteIdx = (stepInBar / 2) % chord.notes.length;
        const baseFreq = chord.notes[noteIdx];
        const oct = zone >= 4 ? 2 : 1;
        this.playKalimbaNote(baseFreq * oct, now);
      }

      // 4. Percussion / Rhythm
      if (stepInBar % 2 === 0) {
        this.playNatureShaker(now, stepInBar % 4 === 0 ? 0.045 : 0.02);
      }
      if (stepInBar === 4 || stepInBar === 12) {
        this.playSoftWoodblock(now);
      }

      this.currentStep++;
    };

    tick();
    this.musicTimerId = window.setInterval(tick, stepTimeMs);
  }

  private stopProceduralMusic(): void {
    if (this.musicTimerId !== null) {
      clearInterval(this.musicTimerId);
      this.musicTimerId = null;
    }
  }

  // --- Procedural Synthesis Instruments ---

  /** Kalimba / Marimba wooden bell timbre */
  private playKalimbaNote(freq: number, time: number): void {
    if (!this.ctx || !this.masterMusicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.09, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  /** Soft warm acoustic chord pad */
  private playSoftChordPad(notes: number[], time: number, duration: number): void {
    if (!this.ctx || !this.masterMusicGain) return;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.018 / notes.length, time + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain!);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
  }

  /** Plucked Acoustic Bass */
  private playPluckBass(freq: number, time: number): void {
    if (!this.ctx || !this.masterMusicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  /** Gentle white noise shaker */
  private playNatureShaker(time: number, vol: number): void {
    if (!this.ctx || !this.masterMusicGain) return;

    // Buffer noise
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.038);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(time);
    noise.stop(time + 0.04);
  }

  /** Soft woodblock / nature click */
  private playSoftWoodblock(time: number): void {
    if (!this.ctx || !this.masterMusicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(400, time + 0.04);

    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // --- Sound Effects (SFX) ---

  public playSuccess(): void {
    if (this.isSfxMuted) return;

    const custom = this.sfxAudios['success'];
    if (custom && custom.readyState >= 2) {
      custom.currentTime = 0;
      custom.play().catch(() => this.synthSuccess());
      return;
    }
    this.synthSuccess();
  }

  private synthSuccess(): void {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;
    const now = ctx.currentTime;

    // Harmonic bell chime: E5, G#5, B5, E6
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const startTime = now + idx * 0.06;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.masterSfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  public playError(): void {
    if (this.isSfxMuted) return;

    const custom = this.sfxAudios['error'];
    if (custom && custom.readyState >= 2) {
      custom.currentTime = 0;
      custom.play().catch(() => this.synthError());
      return;
    }
    this.synthError();
  }

  private synthError(): void {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;
    const now = ctx.currentTime;

    // Rich dual buzzer
    [130, 138].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.32);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterSfxGain!);

      osc.start(now);
      osc.stop(now + 0.33);
    });
  }

  public playGameOver(): void {
    if (this.isSfxMuted) return;

    const custom = this.sfxAudios['gameover'];
    if (custom && custom.readyState >= 2) {
      custom.currentTime = 0;
      custom.play().catch(() => this.synthGameOver());
      return;
    }
    this.synthGameOver();
  }

  private synthGameOver(): void {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;
    const now = ctx.currentTime;

    // Melancholy descending resolve: A4 -> F4 -> D4 -> C#4
    const notes = [440, 349.23, 293.66, 277.18];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      const startTime = now + idx * 0.18;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(this.masterSfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  }

  public playGrab(): void {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.masterSfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /** Star pop sound for level completion (stars 1, 2, 3) */
  public playStarSound(starIndex: number): void {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;

    const baseFreqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    const freq = baseFreqs[Math.min(starIndex, 2)] * (starIndex === 2 ? 1.33 : 1.0);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterSfxGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playLevelUp(): void {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterSfxGain) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      const startTime = now + idx * 0.09;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);

      osc.connect(gain);
      gain.connect(this.masterSfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }
}

export const soundManager = new SoundEngine();

export function getBgmZoneInfo(levelId: number): {
  zone: number;
  title: string;
  theme: string;
  bpm: number;
  levelsRange: string;
} {
  const zone = levelId === 0 ? 5 : Math.min(5, Math.max(1, Math.ceil(levelId / 20)));
  const zones: Record<number, { zone: number; title: string; theme: string; bpm: number; levelsRange: string }> = {
    1: { zone: 1, title: 'Yeşil Doğa & Kalimba Ritimleri', theme: 'Akustik Doğa', bpm: 112, levelsRange: '1 - 20' },
    2: { zone: 2, title: 'Mavi Sahil & Karayip Esintisi', theme: 'Tropik Sahil', bpm: 120, levelsRange: '21 - 40' },
    3: { zone: 3, title: 'Sanayi & Tesis Elektro Nabzı', theme: 'Elektro Tesis', bpm: 128, levelsRange: '41 - 60' },
    4: { zone: 4, title: 'Siber Bilişim & Akıllı Şehir', theme: 'Synthwave Metropol', bpm: 132, levelsRange: '61 - 80' },
    5: { zone: 5, title: 'Büyük Zirve & Zafer Marşı', theme: 'Epik Gezegen Şampiyonası', bpm: 138, levelsRange: '81 - 100' },
  };
  return zones[zone] || zones[1];
}
