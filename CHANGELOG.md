# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-30

### Added
- Audio-reactive features with beat detection and dynamic parameter adjustment
- Multiple visualization modes: MilkDrop, Spectrum Analyzer, Waveform, Circular Spectrum
- Theme customization with 4 UI themes (Default, Dark, Neon, Minimal) and accent color picker
- Enhanced audio analysis with frequency band separation (bass/mid/treble)
- Smart parameter adjustment based on music characteristics
- Improved performance with optimized audio processing and rendering

### Changed
- Updated target ABI to 10.10.0.0 for latest Jellyfin compatibility
- Enhanced UI with glassmorphism design and smooth animations
- Improved keyboard shortcuts and accessibility

## [1.1.0] - 2025-10-20

### Added
- Expanded preset library with 24+ presets organized in 6 categories
- Full keyboard shortcuts support (Space, Ctrl+V, arrows, etc.)
- Settings persistence with automatic saving/loading of user preferences
- Category filtering for browsing presets by visual style
- Improved responsive design and accessibility

### Changed
- Enhanced UI with glassmorphism design and smooth animations
- Better controls and user experience
- Updated target ABI to 10.9.0.0

## [1.0.0] - 2025-10-10

### Added
- Initial release with basic MilkDrop visualization
- 24 carefully selected MilkDrop presets
- Real-time audio visualization using Web Audio API
- WebGL rendering with hardware acceleration
- Player control integration with Jellyfin's web player
- Customizable parameters: brightness, speed, bass/treble sensitivity
- Quality settings (Low/Medium/High) for performance optimization
- Fullscreen or windowed display modes

### Technical
- Built with Butterchurn (MilkDrop 2.0 implementation for web)
- React integration with Jellyfin's UI
- TypeScript for type safety
- Webpack bundling for optimized delivery

---

**Legend:**
- 🎵 Audio-reactive features
- 🎨 Visual enhancements
- ⚙️ Settings and controls
- 🐛 Bug fixes
- 📚 Documentation
- 🔧 Technical improvements
