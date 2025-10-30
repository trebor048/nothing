/**
 * Jellyfin MilkDrop Visualizer Plugin
 * Adds a MilkDrop-style music visualizer to the Jellyfin web player
 */

import { createVisualizer } from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import './styles.css';

// Global visualizer instance and UI elements
let globalVisualizer = null;
let controlsPanel = null;
let isControlsVisible = false;

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
}, {});

/**
 * MilkDrop Visualizer Class
 */
class MilkDropVisualizer {
  constructor(props) {
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
    this.canvas.style.display = 'none';

    // Initialize Web Audio API
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaElementSource(audioElement);

      // Connect audio nodes
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Configure analyser based on quality
      this.updateQualitySettings();

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

      console.log('MilkDrop Visualizer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MilkDrop Visualizer:', error);
    }
  }

  updateQualitySettings() {
    if (!this.analyser) return;

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

  handleResize() {
    if (this.visualizer) {
      const width = this.settings.size === 'fullscreen' ? window.innerWidth : Math.min(window.innerWidth * 0.8, 1200);
      const height = this.settings.size === 'fullscreen' ? window.innerHeight : Math.min(window.innerHeight * 0.8, 800);
      this.visualizer.setRendererSize(width, height);
      this.updateCanvasSize();
    }
  }

  updateCanvasSize() {
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

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate = () => {
    if (!this.isPlaying) return;
    this.visualizer.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  changePreset(presetName) {
    const preset = butterchurnPresets.get(presetName);
    if (preset) {
      this.visualizer.loadPreset(preset, this.settings.speed);
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.updateQualitySettings();
    this.handleResize();
  }

  isActive() {
    return this.canvas.style.display !== 'none';
  }

  filterPresetsByCategory(category, presetSelect) {
    const options = presetSelect.querySelectorAll('option');
    let firstVisiblePreset = '';

    options.forEach((option) => {
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

/**
 * Plugin Registration
 */
// Global saved settings
let savedSettings = null;

// Theme management
let currentTheme = 'default';
let accentColor = '#667eea';

const themes = {
  default: {
    background: 'rgba(0, 0, 0, 0.95)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.9)',
    accent: '#667eea'
  },
  dark: {
    background: 'rgba(10, 10, 10, 0.98)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: 'rgba(255, 255, 255, 0.95)',
    accent: '#ff6b6b'
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
    accent: '#333333'
  }
};

function applyTheme(themeName, customAccent) {
  currentTheme = themeName;
  const theme = themes[themeName];
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
  buttons.forEach((button) => {
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

const MilkDropPlugin = {
  name: 'MilkDrop Visualizer',
  id: 'milkdrop-visualizer',
  version: '1.0.0',

  init() {
    console.log('MilkDrop Visualizer plugin initialized');

    // Load saved settings
    this.loadSettings();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Wait for Jellyfin to load
    const checkJellyfinReady = () => {
      if (window.AppController && window.MediaController) {
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

        // Apply saved settings
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
      }
    } catch (error) {
      console.warn('Failed to load MilkDrop visualizer settings:', error);
    }
  },

  saveSettings() {
    try {
      const settings = {};

      // Save current category and preset
      if (controlsPanel) {
        const categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
        const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');

        if (categorySelect) {
          settings.selectedCategory = categorySelect.value;
        }
        if (presetSelect && presetSelect.selectedOptions[0]) {
          settings.selectedPreset = presetSelect.selectedOptions[0].value;
        }
      }

      // Save visualizer settings
      if (globalVisualizer) {
        settings.visualizerSettings = globalVisualizer.settings;
      }

      localStorage.setItem('milkdrop-visualizer-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save MilkDrop visualizer settings:', error);
    }
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
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
            const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
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
            const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
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
              const randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn');
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
            const currentQuality = globalVisualizer.settings.quality;
            globalVisualizer.updateSettings({ quality: currentQuality === 'high' ? 'medium' : 'high' });
            // Update UI
            if (controlsPanel) {
              const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
              if (qualitySelect) {
                qualitySelect.value = globalVisualizer.settings.quality;
              }
            }
          }
          break;
      }
    });
  },

  setupVisualizer() {
    // Hook into media playback
    const originalPlay = window.MediaController.play.bind(window.MediaController);

    window.MediaController.play = async (options) => {
      const result = await originalPlay(options);

      // Get the current media element
      setTimeout(() => {
        const mediaElement = document.querySelector('audio, video');
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
          const mediaElement = document.querySelector('audio, video');
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
    this.setupControlListeners();
  },

  setupControlListeners() {
    if (!controlsPanel) return;

    // Close button
    const closeBtn = controlsPanel.querySelector('.milkdrop-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideControlsPanel());
    }

    // Category selector
    const categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
    const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');

    if (categorySelect && presetSelect) {
      categorySelect.addEventListener('change', (e) => {
        this.filterPresetsByCategory(e.target.value, presetSelect);
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
        if (globalVisualizer) {
          globalVisualizer.changePreset(e.target.value);
        }
        this.saveSettings(); // Save when preset changes
      });
    }

    // Quality selector
    const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
    if (qualitySelect) {
      qualitySelect.addEventListener('change', (e) => {
        if (globalVisualizer) {
          globalVisualizer.updateSettings({ quality: e.target.value });
        }
        this.saveSettings(); // Save when quality changes
      });
    }

    // Size selector
    const sizeSelect = controlsPanel.querySelector('.milkdrop-size-select');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        if (globalVisualizer) {
          globalVisualizer.updateSettings({ size: e.target.value });
        }
        this.saveSettings(); // Save when size changes
      });
    }

    // Sliders
    const sliders = [
      { class: '.milkdrop-brightness-slider', property: 'brightness' },
      { class: '.milkdrop-speed-slider', property: 'speed' },
      { class: '.milkdrop-bass-slider', property: 'bassSensitivity' },
      { class: '.milkdrop-treble-slider', property: 'trebleSensitivity' }
    ];

    sliders.forEach(({ class: className, property }) => {
      const slider = controlsPanel.querySelector(className);
      if (slider) {
        const valueSpan = slider.parentElement?.querySelector('.milkdrop-value');

        slider.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value);
          if (valueSpan) valueSpan.textContent = value.toFixed(1);
          if (globalVisualizer) {
            globalVisualizer.updateSettings({ [property]: value });
          }
          this.saveSettings(); // Save when sliders change
        });
      }
    });

    // Random preset button
    const randomBtn = controlsPanel.querySelector('.milkdrop-random-preset-btn');
    if (randomBtn && presetSelect && categorySelect) {
      randomBtn.addEventListener('click', () => {
        const currentCategory = categorySelect.value;
        const categoryPresets = PRESET_CATEGORIES[currentCategory] || PRESETS;
        const randomPreset = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];
        presetSelect.value = randomPreset;
        if (globalVisualizer) {
          globalVisualizer.changePreset(randomPreset);
        }
      });
    }

    // Reset button
    const resetBtn = controlsPanel.querySelector('.milkdrop-reset-btn');
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

  resetSettings() {
    if (!controlsPanel || !globalVisualizer) return;

    // Reset sliders
    const sliders = controlsPanel.querySelectorAll('input[type="range"]');
    sliders.forEach((slider) => {
      slider.value = '1.0';
      const valueSpan = slider.parentElement?.querySelector('.milkdrop-value');
      if (valueSpan) valueSpan.textContent = '1.0';
    });

    // Reset selects
    const qualitySelect = controlsPanel.querySelector('.milkdrop-quality-select');
    const sizeSelect = controlsPanel.querySelector('.milkdrop-size-select');
    if (qualitySelect) qualitySelect.value = 'high';
    if (sizeSelect) sizeSelect.value = 'fullscreen';

    // Reset category and preset
    const categorySelect = controlsPanel.querySelector('.milkdrop-category-select');
    const presetSelect = controlsPanel.querySelector('.milkdrop-preset-select');
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
window.MilkDropPlugin = MilkDropPlugin;

export default MilkDropPlugin;
