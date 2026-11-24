// Browser-native Web Audio API sound synthesizer (no external MP3s required!)

class DisneySoundFX {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined" || this.isMuted) return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    // Browsers suspend AudioContext until the user's first tap
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    return this.ctx;
  }

  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.18
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Smooth bell-like fade in and fade out so there are no harsh clicks
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /** Sparkling ascending fairy-dust arpeggio for Daily Check-In */
  playPixieDust() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // C Major 9th ascending sparkle notes (C5, E5, G5, B5, D6, G6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
    notes.forEach((freq, index) => {
      this.playTone(freq, now + index * 0.065, 0.45, "sine", 0.16);
    });
  }

  /** Happy 4-note fanfare when completing Today's Quest */
  playQuestComplete() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Ta-da-da-DAA! (C5 -> E5 -> G5 -> C6)
    this.playTone(523.25, now, 0.14, "triangle", 0.2);
    this.playTone(659.25, now + 0.11, 0.14, "triangle", 0.2);
    this.playTone(783.99, now + 0.22, 0.14, "triangle", 0.2);
    this.playTone(1046.5, now + 0.34, 0.55, "triangle", 0.24);
  }

  /** Cute bubbly pop when packing or unpacking suitcase items */
  playPopSound(isPacking: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pitch slides upward when packing, downward when unpacking
    if (isPacking) {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
    } else {
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);
    }

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  /** Quick magical twinkle when tapping the castle or star jar */
  playMagicWand() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    this.playTone(880, now, 0.25, "sine", 0.15);
    this.playTone(1318.51, now + 0.08, 0.35, "sine", 0.15);
  }
}

export const soundFX = new DisneySoundFX();