"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var butterchurn_1 = require("butterchurn");
var butterchurn_presets_1 = __importDefault(require("butterchurn-presets"));
require("./styles.css");
var MilkDropVisualizer = /** @class */ (function () {
    function MilkDropVisualizer(props) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        this.animationId = null;
        this.isPlaying = false;
        this.audioReactiveEnabled = true;
        this.animate = function () {
            if (!_this.isPlaying)
                return;
            // Get audio data for analysis
            _this.analyser.getByteFrequencyData(_this.frequencyData);
            _this.analyser.getByteTimeDomainData(_this.timeData);
            // Detect beats and analyze audio
            var audioAnalysis = _this.beatDetector.detectBeat(_this.frequencyData, _this.timeData);
            // Apply audio-reactive effects if enabled
            if (_this.audioReactiveEnabled) {
                _this.applyAudioReactiveEffects(audioAnalysis);
            }
            _this.visualizer.render();
            _this.animationId = requestAnimationFrame(_this.animate);
        };
        var audioElement = props.audioElement, _h = props.width, width = _h === void 0 ? window.innerWidth : _h, _j = props.height, height = _j === void 0 ? window.innerHeight : _j, presetName = props.presetName;
        // Default settings with saved overrides
        var savedVisualizerSettings = savedSettings === null || savedSettings === void 0 ? void 0 : savedSettings.visualizerSettings;
        this.settings = {
            brightness: (_a = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.brightness) !== null && _a !== void 0 ? _a : 1.0,
            contrast: (_b = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.contrast) !== null && _b !== void 0 ? _b : 1.0,
            speed: (_c = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.speed) !== null && _c !== void 0 ? _c : 1.0,
            bassSensitivity: (_d = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.bassSensitivity) !== null && _d !== void 0 ? _d : 1.0,
            trebleSensitivity: (_e = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.trebleSensitivity) !== null && _e !== void 0 ? _e : 1.0,
            quality: (_f = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.quality) !== null && _f !== void 0 ? _f : 'high',
            size: (_g = savedVisualizerSettings === null || savedVisualizerSettings === void 0 ? void 0 : savedVisualizerSettings.size) !== null && _g !== void 0 ? _g : 'fullscreen'
        };
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'milkdrop-visualizer-canvas';
        this.canvas.style.display = 'none'; // Start hidden
        // Initialize Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        this.visualizer = (0, butterchurn_1.createVisualizer)(this.audioContext, this.canvas, {
            width: width,
            height: height,
            pixelRatio: window.devicePixelRatio || 1
        });
        // Load preset
        var preset = butterchurn_presets_1.default.get(presetName || 'Flexi + Krash - Molecule V2');
        this.visualizer.loadPreset(preset, 2.0);
        // Add canvas to DOM
        document.body.appendChild(this.canvas);
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    MilkDropVisualizer.prototype.updateQualitySettings = function () {
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
    };
    MilkDropVisualizer.prototype.handleResize = function () {
        if (this.visualizer) {
            var width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
            var height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
            this.visualizer.setRendererSize(width, height);
            this.updateCanvasSize();
        }
    };
    MilkDropVisualizer.prototype.updateCanvasSize = function () {
        if (this.settings.size === 'fullscreen') {
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
        }
        else {
            this.canvas.style.width = '80vw';
            this.canvas.style.height = '80vh';
            this.canvas.style.top = '10vh';
            this.canvas.style.left = '10vw';
            this.canvas.style.maxWidth = '1200px';
            this.canvas.style.maxHeight = '800px';
        }
    };
    MilkDropVisualizer.prototype.show = function () {
        this.canvas.style.display = 'block';
        this.canvas.classList.add('active');
        this.start();
    };
    MilkDropVisualizer.prototype.hide = function () {
        this.canvas.style.display = 'none';
        this.canvas.classList.remove('active');
        this.stop();
    };
    MilkDropVisualizer.prototype.toggle = function () {
        if (this.canvas.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };
    MilkDropVisualizer.prototype.start = function () {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        this.animate();
    };
    MilkDropVisualizer.prototype.stop = function () {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    };
    MilkDropVisualizer.prototype.applyAudioReactiveEffects = function (audioAnalysis) {
        var beat = audioAnalysis.beat, energy = audioAnalysis.energy, bass = audioAnalysis.bass, mid = audioAnalysis.mid, treble = audioAnalysis.treble;
        // Beat-reactive brightness boost
        if (beat) {
            var beatBrightness = Math.min(1.0 + energy * 2.0, 3.0);
            if (this.visualizer) {
                // Apply temporary brightness boost (this would be visualizer-specific)
                // For now, we'll store it and let the settings system handle it
                this.settings.brightness = Math.max(this.settings.brightness, beatBrightness * 0.8);
            }
        }
        // Bass-reactive speed adjustment
        var bassSpeedMultiplier = 0.5 + bass * 1.5; // 0.5x to 2.0x
        this.settings.speed = Math.max(0.1, Math.min(3.0, bassSpeedMultiplier));
        // Energy-reactive contrast (if supported by visualizer)
        var energyContrast = 0.8 + energy * 0.4; // 0.8x to 1.2x
        this.settings.contrast = energyContrast;
        // Treble-reactive brightness (subtle)
        var trebleBrightness = 0.9 + treble * 0.3; // 0.9x to 1.2x
        this.settings.brightness = Math.max(0.1, Math.min(3.0, trebleBrightness));
    };
    MilkDropVisualizer.prototype.changePreset = function (presetName) {
        var preset = butterchurn_presets_1.default.get(presetName);
        if (preset) {
            this.visualizer.loadPreset(preset, this.settings.speed);
        }
    };
    MilkDropVisualizer.prototype.updateSettings = function (newSettings) {
        this.settings = __assign(__assign({}, this.settings), newSettings);
        this.updateQualitySettings();
        this.handleResize();
        // Apply visual settings
        if (this.visualizer) {
            // These would be applied to the butterchurn visualizer if supported
            // For now, we just update our internal settings
        }
    };
    MilkDropVisualizer.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    MilkDropVisualizer.prototype.isActive = function () {
        return this.canvas.style.display !== 'none';
    };
    MilkDropVisualizer.prototype.setAudioReactive = function (enabled) {
        this.audioReactiveEnabled = enabled;
    };
    MilkDropVisualizer.prototype.isAudioReactive = function () {
        return this.audioReactiveEnabled;
    };
    MilkDropVisualizer.prototype.destroy = function () {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        window.removeEventListener('resize', this.handleResize);
    };
    return MilkDropVisualizer;
}());
// Global visualizer instance and UI elements
var globalVisualizer = null;
var controlsPanel = null;
var isControlsVisible = false;
var currentVisualizationMode = 'milkdrop';
// Enhanced MilkDrop presets organized by categories
var PRESET_CATEGORIES = {
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
var PRESETS = Object.values(PRESET_CATEGORIES).flat();
// Category mapping for organization
var PRESET_TO_CATEGORY = Object.entries(PRESET_CATEGORIES).reduce(function (acc, _a) {
    var category = _a[0], presets = _a[1];
    presets.forEach(function (preset) {
        acc[preset] = category;
    });
    return acc;
}, {});
// Global saved settings
var savedSettings = null;
// Theme management
var currentTheme = 'default';
var accentColor = '#667eea';
var themes = {
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
function applyTheme(themeName, customAccent) {
    currentTheme = themeName;
    var theme = themes[themeName];
    if (!theme)
        return;
    accentColor = customAccent || theme.accent;
    // Apply theme to controls panel
    if (controlsPanel) {
        controlsPanel.style.setProperty('--theme-background', theme.background);
        controlsPanel.style.setProperty('--theme-border', theme.border);
        controlsPanel.style.setProperty('--theme-text', theme.text);
        controlsPanel.style.setProperty('--theme-accent', accentColor);
        if (theme.glow) {
            controlsPanel.style.setProperty('--theme-shadow', "0 20px 40px rgba(255, 0, 255, 0.3)");
        }
        else {
            controlsPanel.style.setProperty('--theme-shadow', "0 20px 40px rgba(0, 0, 0, 0.5)");
        }
    }
    // Update button styles
    var buttons = document.querySelectorAll('.milkdrop-toggle-btn, .milkdrop-settings-btn, .milkdrop-random-preset-btn, .milkdrop-reset-btn');
    buttons.forEach(function (button) {
        if (themeName === 'minimal') {
            button.style.background = 'rgba(255, 255, 255, 0.9)';
            button.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            button.style.color = 'rgba(0, 0, 0, 0.8)';
        }
        else {
            button.style.background = theme.background;
            button.style.borderColor = theme.border;
            button.style.color = theme.text;
        }
    });
}
// Beat detection and audio analysis
var BeatDetector = /** @class */ (function () {
    function BeatDetector() {
        this.history = [];
        this.historySize = 43; // ~1 second at 60fps
        this.beatThreshold = 1.3;
        this.beatCooldown = 0;
        this.cooldownFrames = 30; // ~0.5 seconds at 60fps
    }
    BeatDetector.prototype.detectBeat = function (frequencyData, timeData) {
        // Calculate overall energy
        var energy = frequencyData.reduce(function (sum, val) { return sum + val; }, 0) / frequencyData.length / 255;
        // Calculate frequency bands
        var bassEnd = Math.floor(frequencyData.length * 0.1); // 0-10%
        var midEnd = Math.floor(frequencyData.length * 0.4); // 10-40%
        var bass = frequencyData.slice(0, bassEnd).reduce(function (sum, val) { return sum + val; }, 0) / bassEnd / 255;
        var mid = frequencyData.slice(bassEnd, midEnd).reduce(function (sum, val) { return sum + val; }, 0) / (midEnd - bassEnd) / 255;
        var treble = frequencyData.slice(midEnd).reduce(function (sum, val) { return sum + val; }, 0) / (frequencyData.length - midEnd) / 255;
        // Maintain history for beat detection
        this.history.push(energy);
        if (this.history.length > this.historySize) {
            this.history.shift();
        }
        // Detect beats using statistical approach
        var beat = false;
        if (this.history.length >= this.historySize && this.beatCooldown <= 0) {
            var recent = this.history.slice(-10); // Last 10 frames
            var older = this.history.slice(0, -10); // Everything before that
            var recentAvg = recent.reduce(function (a, b) { return a + b; }, 0) / recent.length;
            var olderAvg = older.reduce(function (a, b) { return a + b; }, 0) / older.length;
            if (recentAvg > olderAvg * this.beatThreshold) {
                beat = true;
                this.beatCooldown = this.cooldownFrames;
            }
        }
        if (this.beatCooldown > 0) {
            this.beatCooldown--;
        }
        return { beat: beat, energy: energy, bass: bass, mid: mid, treble: treble };
    };
    return BeatDetector;
}());
// Alternative Visualizer Classes
var SpectrumVisualizer = /** @class */ (function () {
    function SpectrumVisualizer(props) {
        var _this = this;
        this.animationId = null;
        this.isPlaying = false;
        this.audioReactiveEnabled = true;
        this.animate = function () {
            if (!_this.isPlaying)
                return;
            _this.analyser.getByteFrequencyData(_this.frequencyData);
            _this.analyser.getByteTimeDomainData(_this.timeData);
            var audioAnalysis = _this.beatDetector.detectBeat(_this.frequencyData, _this.timeData);
            _this.renderSpectrum(audioAnalysis);
            _this.animationId = requestAnimationFrame(_this.animate);
        };
        var audioElement = props.audioElement, _a = props.width, width = _a === void 0 ? window.innerWidth : _a, _b = props.height, height = _b === void 0 ? window.innerHeight : _b;
        // Initialize canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'milkdrop-visualizer-canvas';
        this.canvas.style.display = 'none';
        this.canvas.width = width;
        this.canvas.height = height;
        var ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error('Could not get canvas context');
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
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    SpectrumVisualizer.prototype.handleResize = function () {
        this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
        this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
    };
    SpectrumVisualizer.prototype.show = function () {
        this.canvas.style.display = 'block';
        this.canvas.classList.add('active');
        this.start();
    };
    SpectrumVisualizer.prototype.hide = function () {
        this.canvas.style.display = 'none';
        this.canvas.classList.remove('active');
        this.stop();
    };
    SpectrumVisualizer.prototype.toggle = function () {
        if (this.canvas.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };
    SpectrumVisualizer.prototype.start = function () {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        this.animate();
    };
    SpectrumVisualizer.prototype.stop = function () {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    };
    SpectrumVisualizer.prototype.renderSpectrum = function (audioAnalysis) {
        var beat = audioAnalysis.beat, energy = audioAnalysis.energy, bass = audioAnalysis.bass;
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        // Draw spectrum bars
        var barCount = Math.min(this.frequencyData.length / 2, 256);
        var barWidth = width / barCount;
        for (var i = 0; i < barCount; i++) {
            var barHeight = (this.frequencyData[i] / 255) * height * 0.8;
            var x = i * barWidth;
            var y = height - barHeight;
            // Color based on frequency and audio reactivity
            var hue = (i / barCount) * 360;
            var saturation = 70 + (beat ? 30 : 0);
            var lightness = 40 + energy * 20;
            ctx.fillStyle = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
            ctx.fillRect(x, y, barWidth - 1, barHeight);
            // Add glow effect on beats
            if (beat && barHeight > height * 0.3) {
                ctx.shadowColor = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
                ctx.shadowBlur = 10;
                ctx.fillRect(x, y, barWidth - 1, barHeight);
                ctx.shadowBlur = 0;
            }
        }
    };
    SpectrumVisualizer.prototype.changePreset = function (presetName) {
        // Spectrum visualizer doesn't use presets
    };
    SpectrumVisualizer.prototype.updateSettings = function (newSettings) {
        this.settings = __assign(__assign({}, this.settings), newSettings);
        this.handleResize();
    };
    SpectrumVisualizer.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    SpectrumVisualizer.prototype.isActive = function () {
        return this.canvas.style.display !== 'none';
    };
    SpectrumVisualizer.prototype.setAudioReactive = function (enabled) {
        this.audioReactiveEnabled = enabled;
    };
    SpectrumVisualizer.prototype.isAudioReactive = function () {
        return this.audioReactiveEnabled;
    };
    SpectrumVisualizer.prototype.destroy = function () {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        window.removeEventListener('resize', this.handleResize);
    };
    return SpectrumVisualizer;
}());
var WaveformVisualizer = /** @class */ (function () {
    function WaveformVisualizer(props) {
        var _this = this;
        this.animationId = null;
        this.isPlaying = false;
        this.audioReactiveEnabled = true;
        this.animate = function () {
            if (!_this.isPlaying)
                return;
            _this.analyser.getByteTimeDomainData(_this.timeData);
            var audioAnalysis = _this.beatDetector.detectBeat(_this.frequencyData, _this.timeData);
            _this.renderWaveform(audioAnalysis);
            _this.animationId = requestAnimationFrame(_this.animate);
        };
        var audioElement = props.audioElement, _a = props.width, width = _a === void 0 ? window.innerWidth : _a, _b = props.height, height = _b === void 0 ? window.innerHeight : _b;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'milkdrop-visualizer-canvas';
        this.canvas.style.display = 'none';
        this.canvas.width = width;
        this.canvas.height = height;
        var ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error('Could not get canvas context');
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
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    WaveformVisualizer.prototype.handleResize = function () {
        this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
        this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
    };
    WaveformVisualizer.prototype.show = function () {
        this.canvas.style.display = 'block';
        this.canvas.classList.add('active');
        this.start();
    };
    WaveformVisualizer.prototype.hide = function () {
        this.canvas.style.display = 'none';
        this.canvas.classList.remove('active');
        this.stop();
    };
    WaveformVisualizer.prototype.toggle = function () {
        if (this.canvas.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };
    WaveformVisualizer.prototype.start = function () {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        this.animate();
    };
    WaveformVisualizer.prototype.stop = function () {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    };
    WaveformVisualizer.prototype.renderWaveform = function (audioAnalysis) {
        var beat = audioAnalysis.beat, energy = audioAnalysis.energy;
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        // Draw waveform
        ctx.strokeStyle = beat ? '#ff6b6b' : '#4ecdc4';
        ctx.lineWidth = beat ? 3 : 2;
        ctx.beginPath();
        var sliceWidth = width / this.timeData.length;
        var x = 0;
        for (var i = 0; i < this.timeData.length; i++) {
            var v = this.timeData[i] / 128.0;
            var y = v * height / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
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
    };
    WaveformVisualizer.prototype.changePreset = function (presetName) { };
    WaveformVisualizer.prototype.updateSettings = function (newSettings) {
        this.settings = __assign(__assign({}, this.settings), newSettings);
        this.handleResize();
    };
    WaveformVisualizer.prototype.getSettings = function () { return __assign({}, this.settings); };
    WaveformVisualizer.prototype.isActive = function () { return this.canvas.style.display !== 'none'; };
    WaveformVisualizer.prototype.setAudioReactive = function (enabled) { this.audioReactiveEnabled = enabled; };
    WaveformVisualizer.prototype.isAudioReactive = function () { return this.audioReactiveEnabled; };
    WaveformVisualizer.prototype.destroy = function () {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        window.removeEventListener('resize', this.handleResize);
    };
    return WaveformVisualizer;
}());
var CircularSpectrumVisualizer = /** @class */ (function () {
    function CircularSpectrumVisualizer(props) {
        var _this = this;
        this.animationId = null;
        this.isPlaying = false;
        this.audioReactiveEnabled = true;
        this.rotation = 0;
        this.animate = function () {
            if (!_this.isPlaying)
                return;
            _this.analyser.getByteFrequencyData(_this.frequencyData);
            _this.analyser.getByteTimeDomainData(_this.timeData);
            var audioAnalysis = _this.beatDetector.detectBeat(_this.frequencyData, _this.timeData);
            _this.renderCircularSpectrum(audioAnalysis);
            _this.animationId = requestAnimationFrame(_this.animate);
        };
        var audioElement = props.audioElement, _a = props.width, width = _a === void 0 ? window.innerWidth : _a, _b = props.height, height = _b === void 0 ? window.innerHeight : _b;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'milkdrop-visualizer-canvas';
        this.canvas.style.display = 'none';
        this.canvas.width = width;
        this.canvas.height = height;
        var ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error('Could not get canvas context');
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
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    CircularSpectrumVisualizer.prototype.handleResize = function () {
        this.canvas.width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
        this.canvas.height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
    };
    CircularSpectrumVisualizer.prototype.show = function () {
        this.canvas.style.display = 'block';
        this.canvas.classList.add('active');
        this.start();
    };
    CircularSpectrumVisualizer.prototype.hide = function () {
        this.canvas.style.display = 'none';
        this.canvas.classList.remove('active');
        this.stop();
    };
    CircularSpectrumVisualizer.prototype.toggle = function () {
        if (this.canvas.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };
    CircularSpectrumVisualizer.prototype.start = function () {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        this.animate();
    };
    CircularSpectrumVisualizer.prototype.stop = function () {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    };
    CircularSpectrumVisualizer.prototype.renderCircularSpectrum = function (audioAnalysis) {
        var beat = audioAnalysis.beat, energy = audioAnalysis.energy;
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var centerX = width / 2;
        var centerY = height / 2;
        var radius = Math.min(width, height) / 4;
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        // Draw circular spectrum
        var barCount = Math.min(this.frequencyData.length / 4, 128);
        var angleStep = (Math.PI * 2) / barCount;
        // Rotate based on energy
        this.rotation += energy * 0.01;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        for (var i = 0; i < barCount; i++) {
            var barHeight = (this.frequencyData[i] / 255) * radius * 0.8;
            var angle = i * angleStep;
            var x1 = Math.cos(angle) * radius;
            var y1 = Math.sin(angle) * radius;
            var x2 = Math.cos(angle) * (radius + barHeight);
            var y2 = Math.sin(angle) * (radius + barHeight);
            // Color based on frequency
            var hue = (i / barCount) * 360;
            var saturation = 70 + (beat ? 30 : 0);
            var lightness = 50 + energy * 20;
            ctx.strokeStyle = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
            ctx.lineWidth = beat ? 4 : 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            // Add glow effect on beats
            if (beat && barHeight > radius * 0.4) {
                ctx.shadowColor = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
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
    };
    CircularSpectrumVisualizer.prototype.changePreset = function (presetName) { };
    CircularSpectrumVisualizer.prototype.updateSettings = function (newSettings) {
        this.settings = __assign(__assign({}, this.settings), newSettings);
        this.handleResize();
    };
    CircularSpectrumVisualizer.prototype.getSettings = function () { return __assign({}, this.settings); };
    CircularSpectrumVisualizer.prototype.isActive = function () { return this.canvas.style.display !== 'none'; };
    CircularSpectrumVisualizer.prototype.setAudioReactive = function (enabled) { this.audioReactiveEnabled = enabled; };
    CircularSpectrumVisualizer.prototype.isAudioReactive = function () { return this.audioReactiveEnabled; };
    CircularSpectrumVisualizer.prototype.destroy = function () {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        window.removeEventListener('resize', this.handleResize);
    };
    return CircularSpectrumVisualizer;
}());
// Plugin registration
var MilkDropPlugin = {
    name: 'MilkDrop Visualizer',
    id: 'milkdrop-visualizer',
    version: '1.0.0',
    init: function () {
        var _this = this;
        console.log('MilkDrop Visualizer plugin initialized');
        // Load saved settings
        this.loadSettings();
        // Apply saved theme
        applyTheme(currentTheme, accentColor);
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        // Wait for Jellyfin to load
        var checkJellyfinReady = function () {
            if (window.AppController && window.MediaController) {
                _this.setupVisualizer();
            }
            else {
                setTimeout(checkJellyfinReady, 1000);
            }
        };
        checkJellyfinReady();
    },
    loadSettings: function () {
        try {
            var saved = localStorage.getItem('milkdrop-visualizer-settings');
            if (saved) {
                var settings = JSON.parse(saved);
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
        }
        catch (error) {
            console.warn('Failed to load MilkDrop visualizer settings:', error);
        }
    },
    saveSettings: function () {
        try {
            var settings = {};
            // Save current category and preset
            if (controlsPanel) {
                var categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
                var presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
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
        }
        catch (error) {
            console.warn('Failed to save MilkDrop visualizer settings:', error);
        }
    },
    setupKeyboardShortcuts: function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            var _a, _b, _c;
            // Don't trigger shortcuts if user is typing in an input field
            if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName) === 'INPUT' ||
                ((_b = e.target) === null || _b === void 0 ? void 0 : _b.tagName) === 'SELECT' ||
                ((_c = e.target) === null || _c === void 0 ? void 0 : _c.tagName) === 'TEXTAREA') {
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
                        _this.toggleControlsPanel();
                    }
                    break;
                case 'ArrowLeft':
                    if (globalVisualizer && controlsPanel) {
                        e.preventDefault();
                        var presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
                        if (presetSelect) {
                            var currentIndex = Array.from(presetSelect.options).findIndex(function (option) { return option.selected; });
                            var visibleOptions = Array.from(presetSelect.options).filter(function (option) { return option.style.display !== 'none'; });
                            var currentVisibleIndex = visibleOptions.indexOf(presetSelect.options[currentIndex]);
                            var prevIndex = currentVisibleIndex > 0 ? visibleOptions[currentVisibleIndex - 1].index : visibleOptions[visibleOptions.length - 1].index;
                            presetSelect.selectedIndex = prevIndex;
                            presetSelect.dispatchEvent(new Event('change'));
                        }
                    }
                    break;
                case 'ArrowRight':
                    if (globalVisualizer && controlsPanel) {
                        e.preventDefault();
                        var presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
                        if (presetSelect) {
                            var currentIndex = Array.from(presetSelect.options).findIndex(function (option) { return option.selected; });
                            var visibleOptions = Array.from(presetSelect.options).filter(function (option) { return option.style.display !== 'none'; });
                            var currentVisibleIndex = visibleOptions.indexOf(presetSelect.options[currentIndex]);
                            var nextIndex = currentVisibleIndex < visibleOptions.length - 1 ? visibleOptions[currentVisibleIndex + 1].index : visibleOptions[0].index;
                            presetSelect.selectedIndex = nextIndex;
                            presetSelect.dispatchEvent(new Event('change'));
                        }
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (controlsPanel) {
                            var randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn');
                            if (randomBtn) {
                                randomBtn.click();
                            }
                        }
                    }
                    break;
                case 'Escape':
                    if (isControlsVisible) {
                        e.preventDefault();
                        _this.hideControlsPanel();
                    }
                    break;
                case 'KeyQ':
                    if (globalVisualizer) {
                        e.preventDefault();
                        globalVisualizer.updateSettings({ quality: globalVisualizer.getSettings().quality === 'high' ? 'medium' : 'high' });
                        // Update UI
                        if (controlsPanel) {
                            var qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
                            if (qualitySelect) {
                                qualitySelect.value = globalVisualizer.getSettings().quality;
                            }
                        }
                    }
                    break;
            }
        });
    },
    addToggleButton: function () {
        var _this = this;
        var addButton = function () {
            var playerControls = document.querySelector('.playerControls');
            if (!playerControls) {
                setTimeout(addButton, 1000);
                return;
            }
            // Check if buttons already exist
            if (document.querySelector('.milkdrop-controls-container'))
                return;
            var container = document.createElement('div');
            container.className = 'milkdrop-controls-container';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '5px';
            // Visualizer toggle button
            var toggleButton = document.createElement('button');
            toggleButton.className = 'milkdrop-toggle-btn playerControlButton';
            toggleButton.innerHTML = '🎵';
            toggleButton.title = 'Toggle MilkDrop Visualizer';
            toggleButton.addEventListener('click', function () {
                if (globalVisualizer) {
                    globalVisualizer.toggle();
                    toggleButton.classList.toggle('active', globalVisualizer.isActive());
                }
                else {
                    // Try to create visualizer if it doesn't exist
                    var mediaElement = document.querySelector('audio, video');
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
            var settingsButton = document.createElement('button');
            settingsButton.className = 'milkdrop-settings-btn playerControlButton';
            settingsButton.innerHTML = '⚙️';
            settingsButton.title = 'MilkDrop Visualizer Settings';
            settingsButton.addEventListener('click', function () {
                _this.toggleControlsPanel();
            });
            container.appendChild(toggleButton);
            container.appendChild(settingsButton);
            playerControls.appendChild(container);
        };
        addButton();
    },
    createControlsPanel: function () {
        if (controlsPanel)
            return;
        controlsPanel = document.createElement('div');
        controlsPanel.className = 'milkdrop-controls-panel';
        controlsPanel.innerHTML = "\n      <div class=\"milkdrop-controls-header\">\n        <h3>MilkDrop Visualizer</h3>\n        <button class=\"milkdrop-close-btn\">\u00D7</button>\n      </div>\n      <div class=\"milkdrop-controls-content\">\n        <div class=\"milkdrop-control-group\">\n          <label>Preset Category:</label>\n          <select class=\"milkdrop-category-select\">\n            ".concat(Object.keys(PRESET_CATEGORIES).map(function (category) { return "<option value=\"".concat(category, "\">").concat(category, "</option>"); }).join(''), "\n          </select>\n        </div>\n        <div class=\"milkdrop-control-group\">\n          <label>Preset:</label>\n          <select class=\"milkdrop-preset-select\">\n            ").concat(PRESETS.map(function (preset) { return "<option value=\"".concat(preset, "\" data-category=\"").concat(PRESET_TO_CATEGORY[preset], "\">").concat(preset, "</option>"); }).join(''), "\n          </select>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Quality:</label>\n          <select class=\"milkdrop-quality-select\">\n            <option value=\"low\">Low</option>\n            <option value=\"medium\">Medium</option>\n            <option value=\"high\" selected>High</option>\n          </select>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Size:</label>\n          <select class=\"milkdrop-size-select\">\n            <option value=\"fullscreen\" selected>Fullscreen</option>\n            <option value=\"windowed\">Windowed</option>\n          </select>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Visualization Mode:</label>\n          <select class=\"milkdrop-mode-select\">\n            <option value=\"milkdrop\" selected>MilkDrop</option>\n            <option value=\"spectrum\">Spectrum Analyzer</option>\n            <option value=\"waveform\">Waveform</option>\n            <option value=\"circular\">Circular Spectrum</option>\n          </select>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>\n            <input type=\"checkbox\" class=\"milkdrop-reactive-checkbox\" checked>\n            Audio Reactive\n          </label>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>UI Theme:</label>\n          <select class=\"milkdrop-theme-select\">\n            <option value=\"default\">Default</option>\n            <option value=\"dark\">Dark</option>\n            <option value=\"neon\">Neon</option>\n            <option value=\"minimal\">Minimal</option>\n          </select>\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Accent Color:</label>\n          <input type=\"color\" class=\"milkdrop-accent-color\" value=\"#667eea\">\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Brightness: <span class=\"milkdrop-value\">1.0</span></label>\n          <input type=\"range\" class=\"milkdrop-brightness-slider\" min=\"0.1\" max=\"3.0\" step=\"0.1\" value=\"1.0\">\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Speed: <span class=\"milkdrop-value\">1.0</span></label>\n          <input type=\"range\" class=\"milkdrop-speed-slider\" min=\"0.1\" max=\"3.0\" step=\"0.1\" value=\"1.0\">\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Bass Sensitivity: <span class=\"milkdrop-value\">1.0</span></label>\n          <input type=\"range\" class=\"milkdrop-bass-slider\" min=\"0.1\" max=\"3.0\" step=\"0.1\" value=\"1.0\">\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <label>Treble Sensitivity: <span class=\"milkdrop-value\">1.0</span></label>\n          <input type=\"range\" class=\"milkdrop-treble-slider\" min=\"0.1\" max=\"3.0\" step=\"0.1\" value=\"1.0\">\n        </div>\n\n        <div class=\"milkdrop-control-group\">\n          <button class=\"milkdrop-random-preset-btn\">\uD83C\uDFB2 Random Preset</button>\n          <button class=\"milkdrop-reset-btn\">\uD83D\uDD04 Reset Settings</button>\n        </div>\n\n        <div class=\"milkdrop-keyboard-shortcuts\">\n          <h4>Keyboard Shortcuts:</h4>\n          <div class=\"milkdrop-shortcuts-grid\">\n            <div><kbd>Space</kbd> Toggle Visualizer</div>\n            <div><kbd>Ctrl+V</kbd> Toggle Visualizer</div>\n            <div><kbd>Ctrl+S</kbd> Settings Panel</div>\n            <div><kbd>\u2190/\u2192</kbd> Previous/Next Preset</div>\n            <div><kbd>Ctrl+R</kbd> Random Preset</div>\n            <div><kbd>Q</kbd> Toggle Quality</div>\n            <div><kbd>Esc</kbd> Close Panel</div>\n          </div>\n        </div>\n      </div>\n    ");
        document.body.appendChild(controlsPanel);
        // Initialize theme
        applyTheme(currentTheme, accentColor);
        // Add event listeners
        this.setupControlListeners();
    },
    setupControlListeners: function () {
        var _this = this;
        if (!controlsPanel)
            return;
        // Close button
        var closeBtn = controlsPanel.querySelector('.milkdrop-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () { return _this.hideControlsPanel(); });
        }
        // Category selector
        var categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
        var presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
        if (categorySelect && presetSelect) {
            categorySelect.addEventListener('change', function (e) {
                var target = e.target;
                _this.filterPresetsByCategory(target.value, presetSelect);
                _this.saveSettings(); // Save when category changes
            });
            // Set initial category and filter (use saved or default)
            var savedCategory = savedSettings === null || savedSettings === void 0 ? void 0 : savedSettings.selectedCategory;
            var initialCategory = savedCategory && Object.keys(PRESET_CATEGORIES).includes(savedCategory)
                ? savedCategory
                : Object.keys(PRESET_CATEGORIES)[0];
            categorySelect.value = initialCategory;
            this.filterPresetsByCategory(initialCategory, presetSelect);
            // Set saved preset if available
            if (savedSettings === null || savedSettings === void 0 ? void 0 : savedSettings.selectedPreset) {
                setTimeout(function () {
                    var presetOption = Array.from(presetSelect.options).find(function (option) {
                        return option.value === savedSettings.selectedPreset &&
                            option.style.display !== 'none';
                    });
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
            presetSelect.addEventListener('change', function (e) {
                var target = e.target;
                if (globalVisualizer) {
                    globalVisualizer.changePreset(target.value);
                }
                _this.saveSettings(); // Save when preset changes
            });
        }
        // Quality selector
        var qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
        if (qualitySelect) {
            qualitySelect.addEventListener('change', function (e) {
                var target = e.target;
                if (globalVisualizer) {
                    globalVisualizer.updateSettings({ quality: target.value });
                }
                _this.saveSettings(); // Save when quality changes
            });
        }
        // Size selector
        var sizeSelect = controlsPanel.querySelector('.milkdrop-size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', function (e) {
                var target = e.target;
                if (globalVisualizer) {
                    globalVisualizer.updateSettings({ size: target.value });
                }
                _this.saveSettings(); // Save when size changes
            });
        }
        // Mode selector (event listener added above)
        var modeSelectElement = controlsPanel.querySelector('.milkdrop-mode-select');
        if (modeSelectElement) {
            modeSelectElement.addEventListener('change', function (e) {
                var target = e.target;
                _this.switchVisualizationMode(target.value);
                _this.saveSettings(); // Save when mode changes
            });
        }
        // Audio reactive checkbox
        var reactiveCheckbox = controlsPanel.querySelector('.milkdrop-reactive-checkbox');
        if (reactiveCheckbox && globalVisualizer) {
            reactiveCheckbox.checked = globalVisualizer.isAudioReactive();
            reactiveCheckbox.addEventListener('change', function (e) {
                var target = e.target;
                if (globalVisualizer) {
                    globalVisualizer.setAudioReactive(target.checked);
                }
                _this.saveSettings(); // Save when reactive setting changes
            });
        }
        // Theme selector
        var themeSelect = controlsPanel.querySelector('.milkdrop-theme-select');
        if (themeSelect) {
            themeSelect.value = currentTheme;
            themeSelect.addEventListener('change', function (e) {
                var target = e.target;
                applyTheme(target.value);
                _this.saveSettings(); // Save when theme changes
            });
        }
        // Accent color picker
        var accentColorPicker = controlsPanel.querySelector('.milkdrop-accent-color');
        if (accentColorPicker) {
            accentColorPicker.value = accentColor;
            accentColorPicker.addEventListener('input', function (e) {
                var target = e.target;
                applyTheme(currentTheme, target.value);
                _this.saveSettings(); // Save when accent color changes
            });
        }
        // Mode selector already configured above
        // Sliders
        var sliders = [
            { class: '.milkdrop-brightness-slider', property: 'brightness' },
            { class: '.milkdrop-speed-slider', property: 'speed' },
            { class: '.milkdrop-bass-slider', property: 'bassSensitivity' },
            { class: '.milkdrop-treble-slider', property: 'trebleSensitivity' }
        ];
        sliders.forEach(function (_a) {
            var _b;
            var className = _a.class, property = _a.property;
            if (!controlsPanel)
                return;
            var slider = controlsPanel.querySelector(className);
            if (slider) {
                var valueSpan_1 = (_b = slider.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('.milkdrop-value');
                slider.addEventListener('input', function (e) {
                    var _a;
                    var target = e.target;
                    var value = parseFloat(target.value);
                    if (valueSpan_1)
                        valueSpan_1.textContent = value.toFixed(1);
                    if (globalVisualizer) {
                        globalVisualizer.updateSettings((_a = {}, _a[property] = value, _a));
                    }
                    _this.saveSettings(); // Save when sliders change
                });
            }
        });
        // Random preset button
        var randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn');
        if (randomBtn && presetSelect && categorySelect) {
            randomBtn.addEventListener('click', function () {
                var currentCategory = categorySelect.value;
                var categoryPresets = PRESET_CATEGORIES[currentCategory] || PRESETS;
                var randomPreset = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];
                presetSelect.value = randomPreset;
                if (globalVisualizer) {
                    globalVisualizer.changePreset(randomPreset);
                }
            });
        }
        // Reset button
        var resetBtn = controlsPanel.querySelector('.milkdrop-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                _this.resetSettings();
            });
        }
    },
    toggleControlsPanel: function () {
        if (isControlsVisible) {
            this.hideControlsPanel();
        }
        else {
            this.showControlsPanel();
        }
    },
    showControlsPanel: function () {
        if (controlsPanel) {
            controlsPanel.classList.add('visible');
            isControlsVisible = true;
        }
    },
    hideControlsPanel: function () {
        if (controlsPanel) {
            controlsPanel.classList.remove('visible');
            isControlsVisible = false;
        }
    },
    filterPresetsByCategory: function (category, presetSelect) {
        var options = presetSelect.querySelectorAll('option');
        var firstVisiblePreset = '';
        options.forEach(function (option) {
            var presetCategory = option.getAttribute('data-category');
            if (presetCategory === category) {
                option.style.display = 'block';
                if (!firstVisiblePreset)
                    firstVisiblePreset = option.value;
            }
            else {
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
    resetSettings: function () {
        if (!controlsPanel || !globalVisualizer)
            return;
        // Reset sliders
        var sliders = controlsPanel.querySelectorAll('input[type="range"]');
        sliders.forEach(function (slider) {
            var _a;
            slider.value = '1.0';
            var valueSpan = (_a = slider.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.milkdrop-value');
            if (valueSpan)
                valueSpan.textContent = '1.0';
        });
        // Reset selects
        var qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
        var sizeSelect = controlsPanel.querySelector('.milkdrop-size-select');
        qualitySelect.value = 'high';
        sizeSelect.value = 'fullscreen';
        // Reset category and preset
        var categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
        var presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
        if (categorySelect && presetSelect) {
            var firstCategory = Object.keys(PRESET_CATEGORIES)[0];
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
    switchVisualizationMode: function (mode) {
        currentVisualizationMode = mode;
        if (!globalVisualizer)
            return;
        // Reinitialize visualizer with new mode
        var audioElement = globalVisualizer['audioElement'];
        var width = globalVisualizer['canvas'].width;
        var height = globalVisualizer['canvas'].height;
        // Destroy current visualizer
        globalVisualizer.destroy();
        // Create new visualizer based on mode
        switch (mode) {
            case 'milkdrop':
                globalVisualizer = new MilkDropVisualizer({
                    audioElement: audioElement,
                    width: width,
                    height: height
                });
                break;
            case 'spectrum':
                globalVisualizer = new SpectrumVisualizer({
                    audioElement: audioElement,
                    width: width,
                    height: height
                });
                break;
            case 'waveform':
                globalVisualizer = new WaveformVisualizer({
                    audioElement: audioElement,
                    width: width,
                    height: height
                });
                break;
            case 'circular':
                globalVisualizer = new CircularSpectrumVisualizer({
                    audioElement: audioElement,
                    width: width,
                    height: height
                });
                break;
        }
        if (globalVisualizer) {
            globalVisualizer.show();
        }
    },
    setupVisualizer: function () {
        var _this = this;
        // Hook into media playback
        var originalPlay = window.MediaController.play.bind(window.MediaController);
        window.MediaController.play = function (options) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, originalPlay(options)];
                    case 1:
                        result = _a.sent();
                        // Get the current media element
                        setTimeout(function () {
                            var mediaElement = document.querySelector('audio, video');
                            if (mediaElement && !globalVisualizer) {
                                globalVisualizer = new MilkDropVisualizer({
                                    audioElement: mediaElement,
                                    width: window.innerWidth,
                                    height: window.innerHeight
                                });
                            }
                        }, 1000);
                        return [2 /*return*/, result];
                }
            });
        }); };
        // Add toggle button and controls panel to player controls
        this.addToggleButton();
        this.createControlsPanel();
    },
    destroy: function () {
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
    document.addEventListener('DOMContentLoaded', function () { return MilkDropPlugin.init(); });
}
else {
    MilkDropPlugin.init();
}
// Export for potential external use
window.MilkDropPlugin = MilkDropPlugin;
exports.default = MilkDropPlugin;
