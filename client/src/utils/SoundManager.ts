// client/src/utils/SoundManager.ts
import { Howl, Howler } from 'howler';

interface SoundConfig {
  volume?: number;
  loop?: boolean;
  rate?: number;
}

class SoundManagerClass {
  private sounds: Map<string, Howl> = new Map();
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private currentMusic: Howl | null = null;
  private isMuted: boolean = false;
  
  private readonly SOUND_DEFINITIONS: Record<string, { path: string; config?: SoundConfig }> = {
    // Music
    'music-menu': { path: '/assets/audio/music/menu.mp3', config: { loop: true, volume: 0.4 } },
    'music-lobby': { path: '/assets/audio/music/lobby.mp3', config: { loop: true, volume: 0.4 } },
    'music-game': { path: '/assets/audio/music/game.mp3', config: { loop: true, volume: 0.3 } },
    'music-meeting': { path: '/assets/audio/music/meeting.mp3', config: { loop: true, volume: 0.5 } },
    'music-victory': { path: '/assets/audio/music/victory.mp3', config: { loop: false, volume: 0.6 } },
    'music-defeat': { path: '/assets/audio/music/defeat.mp3', config: { loop: false, volume: 0.6 } },
    
    // UI SFX
    'sfx-button-click': { path: '/assets/audio/sfx/button-click.mp3', config: { volume: 0.5 } },
    'sfx-button-hover': { path: '/assets/audio/sfx/button-hover.mp3', config: { volume: 0.3 } },
    'sfx-join': { path: '/assets/audio/sfx/join.mp3', config: { volume: 0.6 } },
    'sfx-leave': { path: '/assets/audio/sfx/leave.mp3', config: { volume: 0.6 } },
    
    // Game SFX
    'sfx-game-start': { path: '/assets/audio/sfx/game-start.mp3', config: { volume: 0.8 } },
    'sfx-kill': { path: '/assets/audio/sfx/kill.mp3', config: { volume: 0.9 } },
    'sfx-report': { path: '/assets/audio/sfx/report.mp3', config: { volume: 1.0 } },
    'sfx-emergency': { path: '/assets/audio/sfx/emergency.mp3', config: { volume: 1.0 } },
    'sfx-vote': { path: '/assets/audio/sfx/vote.mp3', config: { volume: 0.6 } },
    'sfx-eject': { path: '/assets/audio/sfx/eject.mp3', config: { volume: 0.8 } },
    'sfx-task-complete': { path: '/assets/audio/sfx/task-complete.mp3', config: { volume: 0.7 } },
    'sfx-sabotage': { path: '/assets/audio/sfx/sabotage.mp3', config: { volume: 0.9 } },
    'sfx-vent': { path: '/assets/audio/sfx/vent.mp3', config: { volume: 0.6 } },
    'sfx-footstep': { path: '/assets/audio/sfx/footstep.mp3', config: { volume: 0.2 } },
    'sfx-bomb': { path: '/assets/audio/sfx/bomb.mp3', config: { volume: 1.0 } },
    'sfx-chat': { path: '/assets/audio/sfx/chat.mp3', config: { volume: 0.4 } },
    'sfx-role-reveal': { path: '/assets/audio/sfx/role-reveal.mp3', config: { volume: 0.8 } },
    'sfx-timer-tick': { path: '/assets/audio/sfx/timer-tick.mp3', config: { volume: 0.3 } },
    'sfx-timer-end': { path: '/assets/audio/sfx/timer-end.mp3', config: { volume: 0.7 } }
  };
  
  public async initialize(onProgress?: (progress: number) => void): Promise<void> {
    const entries = Object.entries(this.SOUND_DEFINITIONS);
    let loaded = 0;
    
    const promises = entries.map(([key, def]) => {
      return new Promise<void>((resolve) => {
        const sound = new Howl({
          src: [def.path],
          volume: def.config?.volume ?? 0.5,
          loop: def.config?.loop ?? false,
          rate: def.config?.rate ?? 1.0,
          preload: true,
          onload: () => {
            this.sounds.set(key, sound);
            loaded++;
            onProgress?.(loaded / entries.length);
            resolve();
          },
          onloaderror: () => {
            console.warn(`Failed to load sound: ${def.path}`);
            loaded++;
            onProgress?.(loaded / entries.length);
            resolve();
          }
        });
      });
    });
    
    await Promise.all(promises);
  }
  
  public play(key: string, config?: SoundConfig): number | null {
    if (this.isMuted) return null;
    
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound not found: ${key}`);
      return null;
    }
    
    if (config?.volume !== undefined) {
      sound.volume(config.volume * (key.startsWith('music') ? this.musicVolume : this.sfxVolume));
    }
    
    if (config?.rate !== undefined) {
      sound.rate(config.rate);
    }
    
    return sound.play();
  }
  
  public playMusic(key: string): void {
    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
      setTimeout(() => {
        this.currentMusic?.stop();
      }, 500);
    }
    
    const music = this.sounds.get(key);
    if (music) {
      this.currentMusic = music;
      music.volume(0);
      music.play();
      music.fade(0, this.musicVolume * (this.SOUND_DEFINITIONS[key]?.config?.volume ?? 0.5), 500);
    }
  }
  
  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
      setTimeout(() => {
        this.currentMusic?.stop();
        this.currentMusic = null;
      }, 500);
    }
  }
  
  public stop(key: string): void {
    const sound = this.sounds.get(key);
    sound?.stop();
  }
  
  public stopAll(): void {
    Howler.stop();
    this.currentMusic = null;
  }
  
  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume(this.musicVolume);
    }
  }
  
  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
  
  public mute(): void {
    this.isMuted = true;
    Howler.mute(true);
  }
  
  public unmute(): void {
    this.isMuted = false;
    Howler.mute(false);
  }
  
  public toggleMute(): boolean {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }
  
  public getMusicVolume(): number {
    return this.musicVolume;
  }
  
  public getSfxVolume(): number {
    return this.sfxVolume;
  }
  
  public isMutedState(): boolean {
    return this.isMuted;
  }
}

export const SoundManager = new SoundManagerClass();
export default SoundManager;