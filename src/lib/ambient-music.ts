// Relaxed, Catchy & Sophisticated Ambient Lounge Audio Engine
// Maintains a slow relaxed tempo while adding an engaging, catchy melodic motif

class LoungeAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  // Rich Victorian & Lounge Chord Voicings (E♭maj9, Cm9, A♭maj7, B♭13sus)
  private chords = [
    {
      pad: [155.56, 233.08, 311.13, 392.00], // E♭maj9
      melody: [587.33, 698.46, 523.25, 466.16], // D5 -> F5 -> C5 -> B♭4
    },
    {
      pad: [130.81, 196.00, 261.63, 311.13], // Cm9
      melody: [466.16, 587.33, 523.25, 392.00], // B♭4 -> D5 -> C5 -> G4
    },
    {
      pad: [103.83, 155.56, 207.65, 261.63], // A♭maj7
      melody: [523.25, 659.25, 587.33, 392.00], // C5 -> E5 -> D5 -> G4
    },
    {
      pad: [116.54, 174.61, 233.08, 293.66], // B♭13sus
      melody: [466.16, 523.25, 587.33, 698.46], // B♭4 -> C5 -> D5 -> F5
    },
  ];

  public async play(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startCatchyLounge();
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopCatchyLounge();
  }

  private startCatchyLounge(): void {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === "suspended") {
        void this.ctx.resume();
      }

      let step = 0;

      const playLoungeMeasure = () => {
        if (!this.isPlaying || !this.ctx) return;

        const currentPart = this.chords[step % this.chords.length];
        step++;

        const now = this.ctx.currentTime;

        // 1. Warm Soft Chord Pad (Rich, soothing felt piano soundboard)
        currentPart.pad.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450 + idx * 30, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.025, now + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 5.5);
        });

        // 2. Catchy, Sophisticated Lead Melody Line (Rhodes / Nylon Bell tone)
        currentPart.melody.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(950, now);

          // Syncopated catchy melody timing across the 5.2-second measure
          const noteDelay = idx * 1.1 + (idx % 2 === 1 ? 0.25 : 0);
          const noteStart = now + noteDelay;

          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(0.03, noteStart + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + 2.4);
        });
      };

      playLoungeMeasure();
      // Catchy relaxed lounge tempo (5,200 ms per measure)
      this.timer = window.setInterval(playLoungeMeasure, 5200);
    } catch (e) {
      console.warn("Catchy Lounge Audio Context unavailable", e);
    }
  }

  private stopCatchyLounge(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      try {
        void this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

export const loungeAudio = new LoungeAudioEngine();
