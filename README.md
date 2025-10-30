# Jellyfin MilkDrop Visualizer Plugin

A Jellyfin web client plugin that adds a MilkDrop-style music visualizer overlay to your media playback experience.

## Features

- 🎵 Real-time audio visualization using Web Audio API
- 🎨 MilkDrop-style effects with 24+ built-in presets organized by categories
- ⚙️ Advanced settings panel with glassmorphism design and live controls
- 🎛️ Adjustable parameters: brightness, speed, bass/treble sensitivity
- 📐 Multiple quality settings (Low/Medium/High)
- 🖥️ Fullscreen or windowed display modes
- 🎲 Random preset generator with category filtering
- 🔄 One-click settings reset
- ⌨️ Full keyboard shortcuts support (Space, Ctrl+V, ←/→, etc.)
- 💾 Automatic settings persistence with localStorage
- ✨ Smooth animations and modern glassmorphism UI
- 🔄 Seamless integration with Jellyfin's web player
- 📱 Responsive design that works on desktop and mobile
- 🎯 Preset categories: Classic, Fractal, Geometric, Organic, Abstract, Psychedelic
- 🎵 **Audio-reactive features**: Beat detection, dynamic parameter adjustment
- 🎼 **Multiple visualization modes**: MilkDrop, Spectrum Analyzer, Waveform, Circular Spectrum
- 🎨 **Theme customization**: 4 UI themes (Default, Dark, Neon, Minimal) with accent color picker

## Installation

### Quick Install (Recommended)

1. **Download the built plugin**
   - Download `jellyfin-plugin-milkdropvisualizer.js` from the `dist/` folder
   - Download `manifest.json` from the root folder

2. **Deploy to Jellyfin**
   ```bash
   # Copy files to Jellyfin web plugins directory
   cp jellyfin-plugin-milkdropvisualizer.js /path/to/jellyfin-web/plugins/
   cp manifest.json /path/to/jellyfin-web/plugins/
   ```

3. **Restart Jellyfin**
   ```bash
   sudo systemctl restart jellyfin
   ```

### Development Setup

1. **Clone or download this repository**
   ```bash
   cd MilkDropVisualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```

4. **Deploy to Jellyfin**
   - Copy `dist/jellyfin-plugin-milkdropvisualizer.js` to `jellyfin-web/plugins/`
   - Copy `manifest.json` to `jellyfin-web/plugins/`

### Production Installation

1. Download the latest release from the releases page
2. Extract the files to your Jellyfin web client's plugins directory
3. Restart your Jellyfin server

## Usage

1. **Start playing music or video** in Jellyfin's web client
2. **Look for the visualizer controls** in the player controls:
   - 🎵 **Toggle Button**: Turn the visualizer on/off
   - ⚙️ **Settings Button**: Open the advanced controls panel

3. **Customize your experience** using the settings panel:
   - **Visualization Mode**: Choose from MilkDrop, Spectrum Analyzer, Waveform, or Circular Spectrum
   - **Preset Categories**: Choose from 6 categories (Classic, Fractal, Geometric, etc.)
   - **Preset Selector**: Choose from 24+ MilkDrop presets within categories
   - **Quality Settings**: Adjust performance (Low/Medium/High)
   - **Display Mode**: Fullscreen or windowed overlay
   - **Audio Reactive**: Toggle beat-detection and dynamic parameter adjustment
   - **Parameter Sliders**: Fine-tune brightness, speed, and audio sensitivity
   - **UI Theme**: Choose from Default, Dark, Neon, or Minimal themes
   - **Accent Color**: Pick your preferred accent color
   - **Random Preset**: 🎲 Generate a random preset (filtered by category)
   - **Reset Settings**: 🔄 Restore default settings

4. **Use keyboard shortcuts** for quick control:
   - **Space/Ctrl+V**: Toggle visualizer on/off
   - **Ctrl+S**: Open/close settings panel
   - **←/→ arrows**: Navigate through presets
   - **Ctrl+R**: Generate random preset
   - **Q**: Toggle quality settings
   - **Esc**: Close settings panel

5. **Enjoy the audio-reactive visuals!** 🎶✨

   The visualizer now responds to your music with:
   - **Beat Detection**: Automatic brightness boosts on beats
   - **Bass-Reactive Speed**: Tempo adjusts to bass frequencies
   - **Dynamic Contrast**: Visual intensity follows music energy
   - **Treble Brightness**: Subtle brightness changes with treble content

## Configuration

### Built-in Presets

The plugin includes 24 carefully selected MilkDrop presets organized into 6 categories:

#### 🎯 **Classic** (4 presets)
1. **Flexi + Krash - Molecule V2** (default) - Classic swirling molecules
2. **Rovastar + Geiss - Dynamic Swirls 3** - Hypnotic swirling patterns
3. **Geiss + Rovastar - Notions Of Tonality** - Musical waveform visualizations
4. **Unchained + Aderrasi - From The Shadows** - Dark, mysterious effects

#### 🌌 **Fractal** (4 presets)
5. **Geiss - Feedback** - Recursive feedback patterns
6. **Rovastar - Fractal Interference** - Fractal-based interference patterns
7. **Flexi + Martin - Heavenly Eye** - Ethereal, cosmic visuals
8. **Rovastar + Unchained - Wormhole** - Deep space wormhole effect

#### 📐 **Geometric** (4 presets)
9. **Geiss - Tokamak** - Nuclear fusion-inspired patterns
10. **Rovastar - Fractal Drop** - Droplet fractal formations
11. **Flexi - Mad Mind** - Chaotic geometric madness
12. **Unchained - Whispers of the Wind** - Flowing geometric forms

#### 🌿 **Organic** (5 presets)
13. **Rovastar - Liquid** - Fluid, organic movements
14. **Geiss - Bioluminescence** - Living light patterns
15. **Flexi - Flowing Form** - Organic shape morphing
16. **Unchained - Organic** - Natural growth patterns
17. **Aderrasi - Anchor Pulse** - Pulsing organic forms

#### 🎨 **Abstract** (5 presets)
18. **Rovastar - Altars of Madness** - Chaotic abstract art
19. **Geiss - Spiral Movement** - Hypnotic spiral dynamics
20. **Flexi - Solar Flare** - Explosive energy patterns
21. **Unchained - Matrix** - Digital matrix aesthetics
22. **Aderrasi - Analoguous Android** - Mechanical-organic hybrids

#### 🌈 **Psychedelic** (4 presets)
23. **Rovastar + Geiss - Hallucinogenic** - Mind-bending visuals
24. **Flexi + Rovastar - Hypnotic** - Deep trance states
25. **Unchained + Martin - Chaotic Angel** - Angelic chaos
26. **Geiss + Aderrasi - Kaleidoscope** - Fractured reality

### Visualization Modes

- **MilkDrop**: Classic psychedelic visualizations with 24+ presets
- **Spectrum Analyzer**: Traditional frequency bars with beat-reactive glow effects
- **Waveform**: Raw audio waveform display with center line reference
- **Circular Spectrum**: Radial frequency display with energy-based rotation

### Settings Panel Options

- **Quality**: Affects audio analysis precision and visual detail
  - Low: 1024 FFT, best performance
  - Medium: 2048 FFT, balanced
  - High: 4096 FFT, maximum detail

- **Size Mode**:
  - Fullscreen: Covers entire viewport
  - Windowed: 80% viewport with borders

- **Audio Reactive**: Enables intelligent visual responses to music
  - Beat Detection: Brightness boosts on percussion
  - Bass Speed: Tempo syncs with low frequencies
  - Dynamic Contrast: Intensity follows energy levels

- **UI Themes**: Complete visual style transformations
  - Default: Clean, professional appearance
  - Dark: Enhanced contrast for low-light environments
  - Neon: Vibrant purple glow effects
  - Minimal: Simplified, light-themed interface

- **Parameter Controls**:
  - Brightness: 0.1x - 3.0x
  - Speed: 0.1x - 3.0x
  - Bass Sensitivity: 0.1x - 3.0x
  - Treble Sensitivity: 0.1x - 3.0x

## Technical Details

- **Web Audio API**: Captures real-time audio data from Jellyfin's player
- **WebGL**: Renders visualizations using hardware acceleration
- **Butterchurn**: MilkDrop 2.0 implementation for the web
- **React Integration**: Seamlessly integrates with Jellyfin's React-based UI

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+

## Development

### Project Structure

```
MilkDropVisualizer/
├── src/
│   ├── index.ts          # Main plugin entry point
│   └── styles.css        # Plugin styles
├── dist/                 # Built plugin files
├── manifest.json         # Jellyfin plugin manifest
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── webpack.config.js     # Build configuration
```

### Building

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Visualizer not appearing
- Ensure you're using a modern browser with WebGL support
- Check browser console for JavaScript errors
- Make sure audio is playing when toggling the visualizer

### Performance issues
- The visualizer uses WebGL for hardware acceleration
- Lower quality settings may help on slower devices
- Consider updating your graphics drivers

### Audio not captured
- The plugin hooks into Jellyfin's HTML5 audio/video elements
- Some media formats may not be compatible
- Check that Web Audio API is enabled in your browser

## Publishing to Plugin Repositories

This plugin is designed to be published to Jellyfin plugin repositories like the [Universal Plugin Repository](https://github.com/0belous/universal-plugin-repo).

### Release Process

1. **Update Version**: Increment version in `manifest.json` and update changelog
2. **Create Release**:
   ```bash
   # PowerShell (Windows)
   .\release.ps1 -Version "1.2.0" -GitHubUsername "yourusername"

   # Or manually:
   npm run build
   # Generate checksum of dist/jellyfin-plugin-milkdropvisualizer.js
   # Create zip with manifest.json and built plugin
   ```
3. **GitHub Release**: Create a new release on GitHub with the generated zip file
4. **Update Repository Manifest**: Submit a PR to the plugin repository with your updated manifest

### Repository Manifest Format

The `manifest.json` follows the standard Jellyfin plugin repository format with:
- Unique GUID for the plugin
- Multiple version support with checksums
- Proper categorization and metadata
- Direct download links from GitHub releases

## License

MIT License - see LICENSE file for details

## Credits

- **Butterchurn**: MilkDrop implementation for the web
- **Jellyfin**: Amazing media server platform
- **MilkDrop**: Original Winamp visualization plugin by Ryan Geiss

## Changelog

### v1.2.0 - Audio-Reactive & Multi-Mode
- ✅ **Audio-Reactive Features**: Beat detection, bass-speed sync, dynamic contrast
- ✅ **Multiple Visualization Modes**: Spectrum Analyzer, Waveform, Circular Spectrum
- ✅ **Theme Customization**: 4 UI themes (Default, Dark, Neon, Minimal) with accent colors
- ✅ **Enhanced Audio Analysis**: Frequency band separation (bass/mid/treble)
- ✅ **Smart Parameter Adjustment**: Visuals respond intelligently to music characteristics
- ✅ **Improved Performance**: Optimized audio processing and rendering

### v1.1.0 - Enhanced Experience
- ✅ **Expanded Preset Library**: Added 24+ presets organized in 6 categories
- ✅ **Keyboard Shortcuts**: Full keyboard control support (Space, Ctrl+V, arrows, etc.)
- ✅ **Settings Persistence**: Automatic saving/loading of user preferences
- ✅ **Enhanced UI**: Glassmorphism design with smooth animations
- ✅ **Category Filtering**: Browse presets by visual style categories
- ✅ **Improved Controls**: Better responsive design and accessibility

### v1.0.0
- Initial release
- Basic MilkDrop visualization
- Player control integration
- Web Audio API integration
