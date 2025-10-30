// Type declarations for external modules and global objects

declare module 'butterchurn' {
  export function createVisualizer(
    audioContext: AudioContext,
    canvas: HTMLCanvasElement,
    options: {
      width: number;
      height: number;
      pixelRatio: number;
    }
  ): any;
}

declare module 'butterchurn-presets' {
  export function get(presetName: string): any;
  export const presets: Record<string, any>;
}

// Jellyfin global objects
declare global {
  interface Window {
    AppController: any;
    MediaController: any;
  }
}
