import React from 'react';
import { createVisualizer } from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import './styles.css';

interface MilkDropVisualizerProps {
  audioElement: HTMLAudioElement | HTMLVideoElement;
  width?: number;
  height?: number;
  presetName?: string;
}

interface VisualizerSettings {
  brightness: number;
  contrast: number;
  speed: number;
  bassSensitivity: number;
  trebleSensitivity: number;
  quality: 'low' | 'medium' | 'high';
  size: 'fullscreen' | 'windowed';
}

class MilkDropVisualizer implements VisualizerInterface {
  private canvas: HTMLCanvasElement;
  private visualizer: any;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode;
  private animationId: number | null = null;
  private isPlaying = false;
  private settings: VisualizerSettings;

  // Audio-reactive features
  private frequencyData: Uint8Array;
  private timeData: Uint8Array;
  private beatDetector: BeatDetector;
  private audioReactiveEnabled = true;

  constructor(props: MilkDropVisualizerProps) {
    const { audioElement, width = window.innerWidth, height = window.innerHeight, presetName } = props;

    // Default settings with saved overrides
    const savedVisualizerSettings = savedSettings?.visualizerSettings;
    this.settings = {
      brightness: savedVisualizerSettings?.brightness ?? 1.0,
      contrast: savedVisualizerSettings?.contrast ?? 1.0,
      speed: savedVisualizerSettings?.speed ?? 1.0,
      bassSensitivity: savedVisualizerSettings?.bassSensitivity ?? 1.0,
      trebleSensitivity: savedVisualizerSettings?.trebleSensitivity ?? 1.0,
      quality: savedVisualizerSettings?.quality ?? 'high',
      size: savedVisualizerSettings?.size ?? 'fullscreen'
    };

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'milkdrop-visualizer-canvas';
    this.canvas.style.display = 'none'; // Start hidden

    // Initialize Web Audio API
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(audioElement);

    // Connect audio nodes
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Configure analyser based on quality
    this.updateQualitySettings();

    // Initialize audio analysis arrays
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.frequencyBinCount);

    // Initialize beat detector
    this.beatDetector = new BeatDetector();

    // Create visualizer
    this.visualizer = createVisualizer(this.audioContext, this.canvas, {
      width,
      height,
      pixelRatio: window.devicePixelRatio || 1
    });

    // Load preset
    const preset = butterchurnPresets.get(presetName || 'Flexi + Krash - Molecule V2');
    this.visualizer.loadPreset(preset, 2.0);

    // Add canvas to DOM
    document.body.appendChild(this.canvas);

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private updateQualitySettings() {
    switch (this.settings.quality) {
      case 'low':
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.9;
        break;
      case 'medium':
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        break;
      case 'high':
        this.analyser.fftSize = 4096;
        this.analyser.smoothingTimeConstant = 0.6;
        break;
    }
  }

  private handleResize() {
    if (this.visualizer) {
      const width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
      const height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
      this.visualizer.setRendererSize(width, height);
      this.updateCanvasSize();
    }
  }

  private updateCanvasSize() {
    if (this.settings.size === 'fullscreen') {
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
    } else {
      this.canvas.style.width = '80vw';
      this.canvas.style.height = '80vh';
      this.canvas.style.top = '10vh';
      this.canvas.style.left = '10vw';
      this.canvas.style.maxWidth = '1200px';
      this.canvas.style.maxHeight = '800px';
    }
  }

  public show() {
    this.canvas.style.display = 'block';
    this.canvas.classList.add('active');
    this.start();
  }

  public hide() {
    this.canvas.style.display = 'none';
    this.canvas.classList.remove('active');
    this.stop();
  }

  public toggle() {
    if (this.canvas.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  private start() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.animate();
  }

  private stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.isPlaying) return;

    // Get audio data for analysis
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeData);

    // Detect beats and analyze audio
    const audioAnalysis = this.beatDetector.detectBeat(this.frequencyData, this.timeData);

    // Apply audio-reactive effects if enabled
    if (this.audioReactiveEnabled) {
      this.applyAudioReactiveEffects(audioAnalysis);
    }

    this.visualizer.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  private applyAudioReactiveEffects(audioAnalysis: { beat: boolean; energy: number; bass: number; mid: number; treble: number }) {
    const { beat, energy, bass, mid, treble } = audioAnalysis;

    // Beat-reactive brightness boost
    if (beat) {
      const beatBrightness = Math.min(1.0 + energy * 2.0, 3.0);
      if (this.visualizer) {
        // Apply temporary brightness boost (this would be visualizer-specific)
        // For now, we'll store it and let the settings system handle it
        this.settings.brightness = Math.max(this.settings.brightness, beatBrightness * 0.8);
      }
    }

    // Bass-reactive speed adjustment
    const bassSpeedMultiplier = 0.5 + bass * 1.5; // 0.5x to 2.0x
    this.settings.speed = Math.max(0.1, Math.min(3.0, bassSpeedMultiplier));

    // Energy-reactive contrast (if supported by visualizer)
    const energyContrast = 0.8 + energy * 0.4; // 0.8x to 1.2x
    this.settings.contrast = energyContrast;

    // Treble-reactive brightness (subtle)
    const trebleBrightness = 0.9 + treble * 0.3; // 0.9x to 1.2x
    this.settings.brightness = Math.max(0.1, Math.min(3.0, trebleBrightness));
  }

  public changePreset(presetName: string) {
    const preset = butterchurnPresets.get(presetName);
    if (preset) {
      this.visualizer.loadPreset(preset, this.settings.speed);
    }
  }

  public updateSettings(newSettings: Partial<VisualizerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.updateQualitySettings();
    this.handleResize();

    // Apply visual settings
    if (this.visualizer) {
      // These would be applied to the butterchurn visualizer if supported
      // For now, we just update our internal settings
    }
  }

  public getSettings(): VisualizerSettings {
    return { ...this.settings };
  }

  public isActive(): boolean {
    return this.canvas.style.display !== 'none';
  }

  public setAudioReactive(enabled: boolean) {
    this.audioReactiveEnabled = enabled;
  }

  public isAudioReactive(): boolean {
    return this.audioReactiveEnabled;
  }

  public destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

// Global visualizer instance and UI elements
let globalVisualizer: VisualizerInterface | null = null;
let controlsPanel: HTMLElement | null = null;
let isControlsVisible = false;
let currentVisualizationMode = 'milkdrop';

// Enhanced MilkDrop presets organized by categories
const PRESET_CATEGORIES = {
  'Classic': [
    'Flexi + Krash - Molecule V2',
    'Rovastar + Geiss - Dynamic Swirls 3',
    'Geiss + Rovastar - Notions Of Tonality',
    'Unchained + Aderrasi - From The Shadows'
  ],
  'Fractal': [
    'Geiss - Feedback',
    'Rovastar - Fractal Interference',
    'Flexi + Martin - Heavenly Eye',
    'Rovastar + Unchained - Wormhole'
  ],
  'Geometric': [
    'Geiss - Tokamak',
    'Rovastar - Fractal Drop',
    'Flexi - Mad Mind',
    'Unchained - Whispers of the Wind'
  ],
  'Organic': [
    'Rovastar - Liquid',
    'Geiss - Bioluminescence',
    'Flexi - Flowing Form',
    'Unchained - Organic',
    'Aderrasi - Anchor Pulse'
  ],
  'Abstract': [
    'Rovastar - Altars of Madness',
    'Geiss - Spiral Movement',
    'Flexi - Solar Flare',
    'Unchained - Matrix',
    'Aderrasi - Analoguous Android'
  ],
  'Psychedelic': [
    'Rovastar + Geiss - Hallucinogenic',
    'Flexi + Rovastar - Hypnotic',
    'Unchained + Martin - Chaotic Angel',
    'Geiss + Aderrasi - Kaleidoscope'
  ]
};

// Flatten presets for dropdown
const PRESETS = Object.values(PRESET_CATEGORIES).flat();

// Category mapping for organization
const PRESET_TO_CATEGORY = Object.entries(PRESET_CATEGORIES).reduce((acc, [category, presets]) => {
  presets.forEach(preset => {
    acc[preset] = category;
  });
  return acc;
}, {} as Record<string, string>);

// Global saved settings
let savedSettings: any = null;

// Common visualizer interface
interface VisualizerInterface {
  show(): void;
  hide(): void;
  toggle(): void;
  changePreset(presetName: string): void;
  updateSettings(settings: Partial<VisualizerSettings>): void;
  getSettings(): VisualizerSettings;
  isActive(): boolean;
  setAudioReactive(enabled: boolean): void;
  isAudioReactive(): boolean;
  destroy(): void;
}

// Theme management
let currentTheme = 'default';
let accentColor = '#667eea';

const themes = {
  default: {
    background: 'rgba(0, 0, 0, 0.95)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.9)',
    accent: '#667eea',
    glow: false
  },
  dark: {
    background: 'rgba(10, 10, 10, 0.98)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: 'rgba(255, 255, 255, 0.95)',
    accent: '#ff6b6b',
    glow: false
  },
  neon: {
    background: 'rgba(0, 0, 0, 0.9)',
    border: 'rgba(255, 0, 255, 0.3)',
    text: 'rgba(255, 255, 255, 1)',
    accent: '#00ffff',
    glow: true
  },
  minimal: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(0, 0, 0, 0.1)',
    text: 'rgba(0, 0, 0, 0.9)',
    accent: '#333333',
    glow: false
  }
};

function applyTheme(themeName: string, customAccent?: string) {
  currentTheme = themeName;
  const theme = themes[themeName as keyof typeof themes];
  if (!theme) return;

  accentColor = customAccent || theme.accent;

  // Apply theme to controls panel
  if (controlsPanel) {
    controlsPanel.style.setProperty('--theme-background', theme.background);
    controlsPanel.style.setProperty('--theme-border', theme.border);
    controlsPanel.style.setProperty('--theme-text', theme.text);
    controlsPanel.style.setProperty('--theme-accent', accentColor);

    if (theme.glow) {
      controlsPanel.style.setProperty('--theme-shadow', `0 20px 40px rgba(255, 0, 255, 0.3)`);
    } else {
      controlsPanel.style.setProperty('--theme-shadow', `0 20px 40px rgba(0, 0, 0, 0.5)`);
    }
  }

  // Update button styles
  const buttons = document.querySelectorAll('.milkdrop-toggle-btn, .milkdrop-settings-btn, .milkdrop-random-preset-btn, .milkdrop-reset-btn');
  buttons.forEach((button: any) => {
    if (themeName === 'minimal') {
      button.style.background = 'rgba(255, 255, 255, 0.9)';
      button.style.borderColor = 'rgba(0, 0, 0, 0.2)';
      button.style.color = 'rgba(0, 0, 0, 0.8)';
    } else {
      button.style.background = theme.background;
      button.style.borderColor = theme.border;
      button.style.color = theme.text;
    }
  });
}

// Beat detection and audio analysis
class BeatDetector {
  private history: number[] = [];
  private historySize = 43; // ~1 second at 60fps
  private beatThreshold = 1.3;
  private beatCooldown = 0;
  private cooldownFrames = 30; // ~0.5 seconds at 60fps

  detectBeat(frequencyData: Uint8Array, timeData: Uint8Array): { beat: boolean; energy: number; bass: number; mid: number; treble: number } {
    // Calculate overall energy
    const energy = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length / 255;

    // Calculate frequency bands
    const bassEnd = Math.floor(frequencyData.length * 0.1); // 0-10%
    const midEnd = Math.floor(frequencyData.length * 0.4); // 10-40%

    const bass = frequencyData.slice(0, bassEnd).reduce((sum, val) => sum + val, 0) / bassEnd / 255;
    const mid = frequencyData.slice(bassEnd, midEnd).reduce((sum, val) => sum + val, 0) / (midEnd - bassEnd) / 255;
    const treble = frequencyData.slice(midEnd).reduce((sum, val) => sum + val, 0) / (frequencyData.length - midEnd) / 255;

    // Maintain history for beat detection
    this.history.push(energy);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }

    // Detect beats using statistical approach
    let beat = false;
    if (this.history.length >= this.historySize && this.beatCooldown <= 0) {
      const recent = this.history.slice(-10); // Last 10 frames
      const older = this.history.slice(0, -10); // Everything before that

      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

      if (recentAvg > olderAvg * this.beatThreshold) {
        beat = true;
        this.beatCooldown = this.cooldownFrames;
      }
    }

    if (this.beatCooldown > 0) {
      this.beatCooldown--;
    }

    return { beat, energy, bass, mid, treble };
  }
}

// Alternative Visualizer Classes
class SpectrumVisualizer implements VisualizerInterface {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode;
  private animationId: number | null = null;
  private isPlaying = false;
  private frequencyData: Uint8Array;
  private timeData: Uint8Array;
  private beatDetector: BeatDetector;
  private audioReactiveEnabled = true;
  private settings: VisualizerSettings;

  constructor(props: MilkDropVisualizerProps) {
    const { audioElement, width = window.innerWidth, height = window.innerHeight } = props;

    // Initialize canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'milkdrop-visualizer-canvas';
    this.canvas.style.display = 'none';
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    // Default settings
    this.settings = {
      brightness: 1.0,
      contrast: 1.0,
      speed: 1.0,
      bassSensitivity: 1.0,
      trebleSensitivity: 1.0,
      quality: 'high',
      size: 'fullscreen'
    };

    // Initialize Web Audio API
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(audioElement);

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Configure analyser
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
    this.beatDetector = new BeatDetector();

    // Add canvas to DOM
    document.body.appendChild(this.canvas);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
    this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
  }

  show() {
    this.canvas.style.display = 'block';
    this.canvas.classList.add('active');
    this.start();
  }

  hide() {
    this.canvas.style.display = 'none';
    this.canvas.classList.remove('active');
    this.stop();
  }

  toggle() {
    if (this.canvas.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  private start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  private stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeData);
    const audioAnalysis = this.beatDetector.detectBeat(this.frequencyData, this.timeData);

    this.renderSpectrum(audioAnalysis);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private renderSpectrum(audioAnalysis: { beat: boolean; energy: number; bass: number; mid: number; treble: number }) {
    const { beat, energy, bass } = audioAnalysis;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw spectrum bars
    const barCount = Math.min(this.frequencyData.length / 2, 256);
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (this.frequencyData[i] / 255) * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;

      // Color based on frequency and audio reactivity
      const hue = (i / barCount) * 360;
      const saturation = 70 + (beat ? 30 : 0);
      const lightness = 40 + energy * 20;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      // Add glow effect on beats
      if (beat && barHeight > height * 0.3) {
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        ctx.shadowBlur = 0;
      }
    }
  }

  changePreset(presetName: string) {
    // Spectrum visualizer doesn't use presets
  }

  updateSettings(newSettings: Partial<VisualizerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.handleResize();
  }

  getSettings(): VisualizerSettings {
    return { ...this.settings };
  }

  isActive(): boolean {
    return this.canvas.style.display !== 'none';
  }

  setAudioReactive(enabled: boolean) {
    this.audioReactiveEnabled = enabled;
  }

  isAudioReactive(): boolean {
    return this.audioReactiveEnabled;
  }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

class WaveformVisualizer implements VisualizerInterface {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode;
  private animationId: number | null = null;
  private isPlaying = false;
  private frequencyData: Uint8Array;
  private timeData: Uint8Array;
  private beatDetector: BeatDetector;
  private audioReactiveEnabled = true;
  private settings: VisualizerSettings;

  constructor(props: MilkDropVisualizerProps) {
    const { audioElement, width = window.innerWidth, height = window.innerHeight } = props;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'milkdrop-visualizer-canvas';
    this.canvas.style.display = 'none';
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.settings = {
      brightness: 1.0,
      contrast: 1.0,
      speed: 1.0,
      bassSensitivity: 1.0,
      trebleSensitivity: 1.0,
      quality: 'high',
      size: 'fullscreen'
    };

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(audioElement);

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
    this.beatDetector = new BeatDetector();

    document.body.appendChild(this.canvas);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
    this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
  }

  show() {
    this.canvas.style.display = 'block';
    this.canvas.classList.add('active');
    this.start();
  }

  hide() {
    this.canvas.style.display = 'none';
    this.canvas.classList.remove('active');
    this.stop();
  }

  toggle() {
    if (this.canvas.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  private start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  private stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.isPlaying) return;

    this.analyser.getByteTimeDomainData(this.timeData);
    const audioAnalysis = this.beatDetector.detectBeat(this.frequencyData, this.timeData);

    this.renderWaveform(audioAnalysis);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private renderWaveform(audioAnalysis: { beat: boolean; energy: number; bass: number; mid: number; treble: number }) {
    const { beat, energy } = audioAnalysis;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.strokeStyle = beat ? '#ff6b6b' : '#4ecdc4';
    ctx.lineWidth = beat ? 3 : 2;
    ctx.beginPath();

    const sliceWidth = width / this.timeData.length;
    let x = 0;

    for (let i = 0; i < this.timeData.length; i++) {
      const v = this.timeData[i] / 128.0;
      const y = v * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Add center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  changePreset(presetName: string) {}
  updateSettings(newSettings: Partial<VisualizerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.handleResize();
  }
  getSettings(): VisualizerSettings { return { ...this.settings }; }
  isActive(): boolean { return this.canvas.style.display !== 'none'; }
  setAudioReactive(enabled: boolean) { this.audioReactiveEnabled = enabled; }
  isAudioReactive(): boolean { return this.audioReactiveEnabled; }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

class CircularSpectrumVisualizer implements VisualizerInterface {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode;
  private animationId: number | null = null;
  private isPlaying = false;
  private frequencyData: Uint8Array;
  private timeData: Uint8Array;
  private beatDetector: BeatDetector;
  private audioReactiveEnabled = true;
  private settings: VisualizerSettings;
  private rotation = 0;

  constructor(props: MilkDropVisualizerProps) {
    const { audioElement, width = window.innerWidth, height = window.innerHeight } = props;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'milkdrop-visualizer-canvas';
    this.canvas.style.display = 'none';
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.settings = {
      brightness: 1.0,
      contrast: 1.0,
      speed: 1.0,
      bassSensitivity: 1.0,
      trebleSensitivity: 1.0,
      quality: 'high',
      size: 'fullscreen'
    };

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(audioElement);

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
    this.beatDetector = new BeatDetector();

    document.body.appendChild(this.canvas);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
    this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
  }

  show() {
    this.canvas.style.display = 'block';
    this.canvas.classList.add('active');
    this.start();
  }

  hide() {
    this.canvas.style.display = 'none';
    this.canvas.classList.remove('active');
    this.stop();
  }

  toggle() {
    if (this.canvas.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  private start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  private stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeData);
    const audioAnalysis = this.beatDetector.detectBeat(this.frequencyData, this.timeData);

    this.renderCircularSpectrum(audioAnalysis);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private renderCircularSpectrum(audioAnalysis: { beat: boolean; energy: number; bass: number; mid: number; treble: number }) {
    const { beat, energy } = audioAnalysis;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw circular spectrum
    const barCount = Math.min(this.frequencyData.length / 4, 128);
    const angleStep = (Math.PI * 2) / barCount;

    // Rotate based on energy
    this.rotation += energy * 0.01;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);

    for (let i = 0; i < barCount; i++) {
      const barHeight = (this.frequencyData[i] / 255) * radius * 0.8;
      const angle = i * angleStep;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + barHeight);
      const y2 = Math.sin(angle) * (radius + barHeight);

      // Color based on frequency
      const hue = (i / barCount) * 360;
      const saturation = 70 + (beat ? 30 : 0);
      const lightness = 50 + energy * 20;

      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = beat ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Add glow effect on beats
      if (beat && barHeight > radius * 0.4) {
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();

    // Draw center circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  changePreset(presetName: string) {}
  updateSettings(newSettings: Partial<VisualizerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.handleResize();
  }
  getSettings(): VisualizerSettings { return { ...this.settings }; }
  isActive(): boolean { return this.canvas.style.display !== 'none'; }
  setAudioReactive(enabled: boolean) { this.audioReactiveEnabled = enabled; }
  isAudioReactive(): boolean { return this.audioReactiveEnabled; }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

// Plugin registration
const MilkDropPlugin = {
  name: 'MilkDrop Visualizer',
  id: 'milkdrop-visualizer',
  version: '1.0.0',

  init() {
    console.log('MilkDrop Visualizer plugin initialized');

    // Load saved settings
    this.loadSettings();

    // Apply saved theme
    applyTheme(currentTheme, accentColor);

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Wait for Jellyfin to load
    const checkJellyfinReady = () => {
      if ((window as any).AppController && (window as any).MediaController) {
        this.setupVisualizer();
      } else {
        setTimeout(checkJellyfinReady, 1000);
      }
    };

    checkJellyfinReady();
  },

  loadSettings() {
    try {
      const saved = localStorage.getItem('milkdrop-visualizer-settings');
      if (saved) {
        const settings = JSON.parse(saved);

        // Apply saved settings to default settings
        if (settings.selectedCategory) {
          savedSettings = savedSettings || {};
          savedSettings.selectedCategory = settings.selectedCategory;
        }
        if (settings.selectedPreset) {
          savedSettings = savedSettings || {};
          savedSettings.selectedPreset = settings.selectedPreset;
        }
        if (settings.visualizerSettings) {
          savedSettings = savedSettings || {};
          savedSettings.visualizerSettings = settings.visualizerSettings;
        }

        // Load theme settings
        if (settings.theme) {
          currentTheme = settings.theme;
        }
        if (settings.accentColor) {
          accentColor = settings.accentColor;
        }
        if (settings.visualizationMode) {
          currentVisualizationMode = settings.visualizationMode;
        }
      }
    } catch (error) {
      console.warn('Failed to load MilkDrop visualizer settings:', error);
    }
  },

  saveSettings() {
    try {
      const settings: any = {};

      // Save current category and preset
      if (controlsPanel) {
        const categorySelect = controlsPanel.querySelector('.milkdrop-category-select') as HTMLSelectElement;
        const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select') as HTMLSelectElement;

        if (categorySelect) {
          settings.selectedCategory = categorySelect.value;
        }
        if (presetSelect && presetSelect.selectedOptions[0]) {
          settings.selectedPreset = presetSelect.selectedOptions[0].value;
        }
      }

      // Save visualization mode
      settings.visualizationMode = currentVisualizationMode;

      // Save theme settings
      settings.theme = currentTheme;
      settings.accentColor = accentColor;

      // Save audio reactive setting
      if (globalVisualizer) {
        settings.audioReactive = globalVisualizer.isAudioReactive();
      }

      // Save visualizer settings
      if (globalVisualizer) {
        settings.visualizerSettings = globalVisualizer.getSettings();
      }

      localStorage.setItem('milkdrop-visualizer-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save MilkDrop visualizer settings:', error);
    }
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if user is typing in an input field
      if ((e.target as HTMLElement)?.tagName === 'INPUT' ||
          (e.target as HTMLElement)?.tagName === 'SELECT' ||
          (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (globalVisualizer) {
            globalVisualizer.toggle();
          }
          break;

        case 'KeyV':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (globalVisualizer) {
              globalVisualizer.toggle();
            }
          }
          break;

        case 'KeyS':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.toggleControlsPanel();
          }
          break;

        case 'ArrowLeft':
          if (globalVisualizer && controlsPanel) {
            e.preventDefault();
            const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select') as HTMLSelectElement;
            if (presetSelect) {
              const currentIndex = Array.from(presetSelect.options).findIndex(option => option.selected);
              const visibleOptions = Array.from(presetSelect.options).filter(option => option.style.display !== 'none');
              const currentVisibleIndex = visibleOptions.indexOf(presetSelect.options[currentIndex]);
              const prevIndex = currentVisibleIndex > 0 ? visibleOptions[currentVisibleIndex - 1].index : visibleOptions[visibleOptions.length - 1].index;
              presetSelect.selectedIndex = prevIndex;
              presetSelect.dispatchEvent(new Event('change'));
            }
          }
          break;

        case 'ArrowRight':
          if (globalVisualizer && controlsPanel) {
            e.preventDefault();
            const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select') as HTMLSelectElement;
            if (presetSelect) {
              const currentIndex = Array.from(presetSelect.options).findIndex(option => option.selected);
              const visibleOptions = Array.from(presetSelect.options).filter(option => option.style.display !== 'none');
              const currentVisibleIndex = visibleOptions.indexOf(presetSelect.options[currentIndex]);
              const nextIndex = currentVisibleIndex < visibleOptions.length - 1 ? visibleOptions[currentVisibleIndex + 1].index : visibleOptions[0].index;
              presetSelect.selectedIndex = nextIndex;
              presetSelect.dispatchEvent(new Event('change'));
            }
          }
          break;

        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (controlsPanel) {
              const randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn') as HTMLElement;
              if (randomBtn) {
                randomBtn.click();
              }
            }
          }
          break;

        case 'Escape':
          if (isControlsVisible) {
            e.preventDefault();
            this.hideControlsPanel();
          }
          break;

        case 'KeyQ':
          if (globalVisualizer) {
            e.preventDefault();
            globalVisualizer.updateSettings({ quality: globalVisualizer.getSettings().quality === 'high' ? 'medium' : 'high' });
            // Update UI
            if (controlsPanel) {
              const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select') as HTMLSelectElement;
              if (qualitySelect) {
                qualitySelect.value = globalVisualizer.getSettings().quality;
              }
            }
          }
          break;
      }
    });
  },

  addToggleButton() {
    const addButton = () => {
      const playerControls = document.querySelector('.playerControls');
      if (!playerControls) {
        setTimeout(addButton, 1000);
        return;
      }

      // Check if buttons already exist
      if (document.querySelector('.milkdrop-controls-container')) return;

      const container = document.createElement('div');
      container.className = 'milkdrop-controls-container';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '5px';

      // Visualizer toggle button
      const toggleButton = document.createElement('button');
      toggleButton.className = 'milkdrop-toggle-btn playerControlButton';
      toggleButton.innerHTML = '🎵';
      toggleButton.title = 'Toggle MilkDrop Visualizer';

      toggleButton.addEventListener('click', () => {
        if (globalVisualizer) {
          globalVisualizer.toggle();
          toggleButton.classList.toggle('active', globalVisualizer.isActive());
        } else {
          // Try to create visualizer if it doesn't exist
          const mediaElement = document.querySelector('audio, video') as HTMLAudioElement | HTMLVideoElement;
          if (mediaElement) {
            globalVisualizer = new MilkDropVisualizer({
              audioElement: mediaElement,
              width: window.innerWidth,
              height: window.innerHeight
            });
            globalVisualizer.show();
            toggleButton.classList.add('active');
          }
        }
      });

      // Settings button
      const settingsButton = document.createElement('button');
      settingsButton.className = 'milkdrop-settings-btn playerControlButton';
      settingsButton.innerHTML = '⚙️';
      settingsButton.title = 'MilkDrop Visualizer Settings';

      settingsButton.addEventListener('click', () => {
        this.toggleControlsPanel();
      });

      container.appendChild(toggleButton);
      container.appendChild(settingsButton);
      playerControls.appendChild(container);
    };

    addButton();
  },

  createControlsPanel() {
    if (controlsPanel) return;

    controlsPanel = document.createElement('div');
    controlsPanel.className = 'milkdrop-controls-panel';
    controlsPanel.innerHTML = `
      <div class="milkdrop-controls-header">
        <h3>MilkDrop Visualizer</h3>
        <button class="milkdrop-close-btn">×</button>
      </div>
      <div class="milkdrop-controls-content">
        <div class="milkdrop-control-group">
          <label>Preset Category:</label>
          <select class="milkdrop-category-select">
            ${Object.keys(PRESET_CATEGORIES).map(category => `<option value="${category}">${category}</option>`).join('')}
          </select>
        </div>
        <div class="milkdrop-control-group">
          <label>Preset:</label>
          <select class="milkdrop-preset-select">
            ${PRESETS.map(preset => `<option value="${preset}" data-category="${PRESET_TO_CATEGORY[preset]}">${preset}</option>`).join('')}
          </select>
        </div>

        <div class="milkdrop-control-group">
          <label>Quality:</label>
          <select class="milkdrop-quality-select">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high" selected>High</option>
          </select>
        </div>

        <div class="milkdrop-control-group">
          <label>Size:</label>
          <select class="milkdrop-size-select">
            <option value="fullscreen" selected>Fullscreen</option>
            <option value="windowed">Windowed</option>
          </select>
        </div>

        <div class="milkdrop-control-group">
          <label>Visualization Mode:</label>
          <select class="milkdrop-mode-select">
            <option value="milkdrop" selected>MilkDrop</option>
            <option value="spectrum">Spectrum Analyzer</option>
            <option value="waveform">Waveform</option>
            <option value="circular">Circular Spectrum</option>
          </select>
        </div>

        <div class="milkdrop-control-group">
          <label>
            <input type="checkbox" class="milkdrop-reactive-checkbox" checked>
            Audio Reactive
          </label>
        </div>

        <div class="milkdrop-control-group">
          <label>UI Theme:</label>
          <select class="milkdrop-theme-select">
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <div class="milkdrop-control-group">
          <label>Accent Color:</label>
          <input type="color" class="milkdrop-accent-color" value="#667eea">
        </div>

        <div class="milkdrop-control-group">
          <label>Brightness: <span class="milkdrop-value">1.0</span></label>
          <input type="range" class="milkdrop-brightness-slider" min="0.1" max="3.0" step="0.1" value="1.0">
        </div>

        <div class="milkdrop-control-group">
          <label>Speed: <span class="milkdrop-value">1.0</span></label>
          <input type="range" class="milkdrop-speed-slider" min="0.1" max="3.0" step="0.1" value="1.0">
        </div>

        <div class="milkdrop-control-group">
          <label>Bass Sensitivity: <span class="milkdrop-value">1.0</span></label>
          <input type="range" class="milkdrop-bass-slider" min="0.1" max="3.0" step="0.1" value="1.0">
        </div>

        <div class="milkdrop-control-group">
          <label>Treble Sensitivity: <span class="milkdrop-value">1.0</span></label>
          <input type="range" class="milkdrop-treble-slider" min="0.1" max="3.0" step="0.1" value="1.0">
        </div>

        <div class="milkdrop-control-group">
          <button class="milkdrop-random-preset-btn">🎲 Random Preset</button>
          <button class="milkdrop-reset-btn">🔄 Reset Settings</button>
        </div>

        <div class="milkdrop-keyboard-shortcuts">
          <h4>Keyboard Shortcuts:</h4>
          <div class="milkdrop-shortcuts-grid">
            <div><kbd>Space</kbd> Toggle Visualizer</div>
            <div><kbd>Ctrl+V</kbd> Toggle Visualizer</div>
            <div><kbd>Ctrl+S</kbd> Settings Panel</div>
            <div><kbd>←/→</kbd> Previous/Next Preset</div>
            <div><kbd>Ctrl+R</kbd> Random Preset</div>
            <div><kbd>Q</kbd> Toggle Quality</div>
            <div><kbd>Esc</kbd> Close Panel</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(controlsPanel);

    // Initialize theme
    applyTheme(currentTheme, accentColor);

    // Add event listeners
    this.setupControlListeners();
  },

  setupControlListeners() {
    if (!controlsPanel) return;

    // Close button
    const closeBtn = controlsPanel.querySelector('.milkdrop-close-btn') as HTMLElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideControlsPanel());
    }

    // Category selector
    const categorySelect = controlsPanel.querySelector('.milkdrop-category-select') as HTMLSelectElement;
    const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select') as HTMLSelectElement;

    if (categorySelect && presetSelect) {
      categorySelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.filterPresetsByCategory(target.value, presetSelect);
        this.saveSettings(); // Save when category changes
      });

      // Set initial category and filter (use saved or default)
      const savedCategory = savedSettings?.selectedCategory;
      const initialCategory = savedCategory && Object.keys(PRESET_CATEGORIES).includes(savedCategory)
        ? savedCategory
        : Object.keys(PRESET_CATEGORIES)[0];

      categorySelect.value = initialCategory;
      this.filterPresetsByCategory(initialCategory, presetSelect);

      // Set saved preset if available
      if (savedSettings?.selectedPreset) {
        setTimeout(() => {
          const presetOption = Array.from(presetSelect.options).find(option =>
            option.value === savedSettings.selectedPreset &&
            option.style.display !== 'none'
          );
          if (presetOption) {
            presetSelect.value = savedSettings.selectedPreset;
            if (globalVisualizer) {
              globalVisualizer.changePreset(savedSettings.selectedPreset);
            }
          }
        }, 100);
      }
    }

    // Preset selector
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        if (globalVisualizer) {
          globalVisualizer.changePreset(target.value);
        }
        this.saveSettings(); // Save when preset changes
      });
    }

    // Quality selector
    const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select') as HTMLSelectElement;
    if (qualitySelect) {
      qualitySelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        if (globalVisualizer) {
          globalVisualizer.updateSettings({ quality: target.value as 'low' | 'medium' | 'high' });
        }
        this.saveSettings(); // Save when quality changes
      });
    }

    // Size selector
    const sizeSelect = controlsPanel.querySelector('.milkdrop-size-select') as HTMLSelectElement;
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        if (globalVisualizer) {
          globalVisualizer.updateSettings({ size: target.value as 'fullscreen' | 'windowed' });
        }
        this.saveSettings(); // Save when size changes
      });
    }

    // Mode selector (event listener added above)
    const modeSelectElement = controlsPanel.querySelector('.milkdrop-mode-select') as HTMLSelectElement;
    if (modeSelectElement) {
      modeSelectElement.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.switchVisualizationMode(target.value);
        this.saveSettings(); // Save when mode changes
      });
    }

    // Audio reactive checkbox
    const reactiveCheckbox = controlsPanel.querySelector('.milkdrop-reactive-checkbox') as HTMLInputElement;
    if (reactiveCheckbox && globalVisualizer) {
      reactiveCheckbox.checked = globalVisualizer.isAudioReactive();
      reactiveCheckbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (globalVisualizer) {
          globalVisualizer.setAudioReactive(target.checked);
        }
        this.saveSettings(); // Save when reactive setting changes
      });
    }

    // Theme selector
    const themeSelect = controlsPanel.querySelector('.milkdrop-theme-select') as HTMLSelectElement;
    if (themeSelect) {
      themeSelect.value = currentTheme;
      themeSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        applyTheme(target.value);
        this.saveSettings(); // Save when theme changes
      });
    }

    // Accent color picker
    const accentColorPicker = controlsPanel.querySelector('.milkdrop-accent-color') as HTMLInputElement;
    if (accentColorPicker) {
      accentColorPicker.value = accentColor;
      accentColorPicker.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        applyTheme(currentTheme, target.value);
        this.saveSettings(); // Save when accent color changes
      });
    }

    // Mode selector already configured above

    // Sliders
    const sliders = [
      { class: '.milkdrop-brightness-slider', property: 'brightness' },
      { class: '.milkdrop-speed-slider', property: 'speed' },
      { class: '.milkdrop-bass-slider', property: 'bassSensitivity' },
      { class: '.milkdrop-treble-slider', property: 'trebleSensitivity' }
    ];

    sliders.forEach(({ class: className, property }) => {
      if (!controlsPanel) return;
      const slider = controlsPanel.querySelector(className) as HTMLInputElement;
      if (slider) {
        const valueSpan = slider.parentElement?.querySelector('.milkdrop-value') as HTMLElement | null;

        slider.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          const value = parseFloat(target.value);
          if (valueSpan) valueSpan.textContent = value.toFixed(1);
          if (globalVisualizer) {
            globalVisualizer.updateSettings({ [property]: value });
          }
          this.saveSettings(); // Save when sliders change
        });
      }
    });

    // Random preset button
    const randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn') as HTMLElement;
    if (randomBtn && presetSelect && categorySelect) {
      randomBtn.addEventListener('click', () => {
        const currentCategory = categorySelect.value;
        const categoryPresets = PRESET_CATEGORIES[currentCategory as keyof typeof PRESET_CATEGORIES] || PRESETS;
        const randomPreset = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];
        presetSelect.value = randomPreset;
        if (globalVisualizer) {
          globalVisualizer.changePreset(randomPreset);
        }
      });
    }

    // Reset button
    const resetBtn = controlsPanel.querySelector('.milkdrop-reset-btn') as HTMLElement;
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSettings();
      });
    }
  },

  toggleControlsPanel() {
    if (isControlsVisible) {
      this.hideControlsPanel();
    } else {
      this.showControlsPanel();
    }
  },

  showControlsPanel() {
    if (controlsPanel) {
      controlsPanel.classList.add('visible');
      isControlsVisible = true;
    }
  },

  hideControlsPanel() {
    if (controlsPanel) {
      controlsPanel.classList.remove('visible');
      isControlsVisible = false;
    }
  },

  filterPresetsByCategory(category: string, presetSelect: HTMLSelectElement) {
    const options = presetSelect.querySelectorAll('option');
    let firstVisiblePreset = '';

    options.forEach((option: any) => {
      const presetCategory = option.getAttribute('data-category');
      if (presetCategory === category) {
        option.style.display = 'block';
        if (!firstVisiblePreset) firstVisiblePreset = option.value;
      } else {
        option.style.display = 'none';
      }
    });

    // Set first visible preset as selected
    if (firstVisiblePreset) {
      presetSelect.value = firstVisiblePreset;
      if (globalVisualizer) {
        globalVisualizer.changePreset(firstVisiblePreset);
      }
    }
  },

  resetSettings() {
    if (!controlsPanel || !globalVisualizer) return;

    // Reset sliders
    const sliders = controlsPanel.querySelectorAll('input[type="range"]');
    sliders.forEach((slider: any) => {
      slider.value = '1.0';
      const valueSpan = slider.parentElement?.querySelector('.milkdrop-value') as HTMLElement;
      if (valueSpan) valueSpan.textContent = '1.0';
    });

    // Reset selects
    const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select') as HTMLSelectElement;
    const sizeSelect = controlsPanel.querySelector('.milkdrop-size-select') as HTMLSelectElement;
    qualitySelect.value = 'high';
    sizeSelect.value = 'fullscreen';

    // Reset category and preset
    const categorySelect = controlsPanel.querySelector('.milkdrop-category-select') as HTMLSelectElement;
    const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select') as HTMLSelectElement;
    if (categorySelect && presetSelect) {
      const firstCategory = Object.keys(PRESET_CATEGORIES)[0];
      categorySelect.value = firstCategory;
      this.filterPresetsByCategory(firstCategory, presetSelect);
    }

    // Apply reset settings
    globalVisualizer.updateSettings({
      brightness: 1.0,
      contrast: 1.0,
      speed: 1.0,
      bassSensitivity: 1.0,
      trebleSensitivity: 1.0,
      quality: 'high',
      size: 'fullscreen'
    });
  },

  switchVisualizationMode(mode: string) {
    currentVisualizationMode = mode;

    if (!globalVisualizer) return;

    // Reinitialize visualizer with new mode
    const audioElement = globalVisualizer['audioElement'];
    const width = globalVisualizer['canvas'].width;
    const height = globalVisualizer['canvas'].height;

    // Destroy current visualizer
    globalVisualizer.destroy();

    // Create new visualizer based on mode
    switch (mode) {
      case 'milkdrop':
        globalVisualizer = new MilkDropVisualizer({
          audioElement,
          width,
          height
        });
        break;
      case 'spectrum':
        globalVisualizer = new SpectrumVisualizer({
          audioElement,
          width,
          height
        });
        break;
      case 'waveform':
        globalVisualizer = new WaveformVisualizer({
          audioElement,
          width,
          height
        });
        break;
      case 'circular':
        globalVisualizer = new CircularSpectrumVisualizer({
          audioElement,
          width,
          height
        });
        break;
    }

    if (globalVisualizer) {
      globalVisualizer.show();
    }
  },

  setupVisualizer() {
    // Hook into media playback
    const originalPlay = (window as any).MediaController.play.bind((window as any).MediaController);

    (window as any).MediaController.play = async (options: any) => {
      const result = await originalPlay(options);

      // Get the current media element
      setTimeout(() => {
        const mediaElement = document.querySelector('audio, video') as HTMLAudioElement | HTMLVideoElement;
        if (mediaElement && !globalVisualizer) {
          globalVisualizer = new MilkDropVisualizer({
            audioElement: mediaElement,
            width: window.innerWidth,
            height: window.innerHeight
          });
        }
      }, 1000);

      return result;
    };

    // Add toggle button and controls panel to player controls
    this.addToggleButton();
    this.createControlsPanel();
  },

  destroy() {
    if (globalVisualizer) {
      globalVisualizer.destroy();
      globalVisualizer = null;
    }
    if (controlsPanel) {
      controlsPanel.remove();
      controlsPanel = null;
    }
  }
};

// Register plugin when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MilkDropPlugin.init());
} else {
  MilkDropPlugin.init();
}

// Export for potential external use
(window as any).MilkDropPlugin = MilkDropPlugin;

export default MilkDropPlugin;
