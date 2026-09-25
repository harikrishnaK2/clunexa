class SoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggle() { this.muted = !this.muted; return this.muted; }
  isMuted() { return this.muted; }

  victory() {
    if (this.muted) return;
    const ctx = this.getCtx();

    // Chord progression: C major → F major → G major → C major
    const chords = [
      [261, 329, 392], // C
      [349, 440, 523], // F
      [392, 494, 587], // G
      [523, 659, 784], // C high
    ];

    // Play chords with reverb-like decay
    chords.forEach((chord, ci) => {
      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        const t = ctx.currentTime + ci * 0.4;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.start(t); osc.stop(t + 0.6);
      });
    });

    // Triumphant melody on top (plays over chords)
    const melody = [523, 659, 784, 1047, 988, 1047, 784, 880, 1047];
    const durations = [0.15, 0.15, 0.15, 0.3, 0.15, 0.4, 0.15, 0.15, 0.6];
    let t = ctx.currentTime + 0.1;
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i] - 0.02);
      osc.start(t); osc.stop(t + durations[i]);
      t += durations[i];
    });

    // Bass drum hits at start and middle
    [0, 0.4, 0.8, 1.2].forEach(delay => {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      const startT = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.5, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.15);
      source.start(startT); source.stop(startT + 0.2);
    });
  }

  ding() {
    if (this.muted) return;
    const ctx = this.getCtx();
    [440, 550, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t); osc.stop(t + 0.18);
    });
  }

  success() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // Rising glide sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'sine';
    sweep.connect(sweepGain); sweepGain.connect(ctx.destination);
    sweep.frequency.setValueAtTime(300, ctx.currentTime);
    sweep.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    sweepGain.gain.setValueAtTime(0.15, ctx.currentTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    sweep.start(ctx.currentTime); sweep.stop(ctx.currentTime + 0.4);

    // Victory chord after sweep
    [[523, 'triangle'], [659, 'sine'], [784, 'sine'], [1047, 'sine']].forEach(([freq, type], i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type as OscillatorType;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq as number;
      const t = ctx.currentTime + 0.25 + i * 0.06;
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.55);
    });
  }

  fail() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // Two womp notes
    [220, 160].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq + 40, ctx.currentTime + i * 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + i * 0.3 + 0.35);
      gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.4);
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.45);
    });
  }

  tick() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // White noise click filtered to wood-block
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    source.start(ctx.currentTime); source.stop(ctx.currentTime + 0.05);
  }

  urgentTick() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // Two quick pulses like a heartbeat
    [0, 0.1].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 120;
      osc.connect(gain); gain.connect(ctx.destination);
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t); osc.stop(t + 0.14);
    });
  }

  reveal() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // Snare drum roll (accelerating noise bursts)
    for (let i = 0; i < 12; i++) {
      const interval = 0.09 - i * 0.005; // accelerates
      const startT = ctx.currentTime + i * interval;
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 + i * 0.015, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.05);
      source.connect(gain); gain.connect(ctx.destination);
      source.start(startT); source.stop(startT + 0.06);
    }
    // Ta-da brass stab after roll
    const offset = ctx.currentTime + 0.75;
    [[392, 'sawtooth'], [523, 'sawtooth'], [659, 'sawtooth'], [784, 'square']].forEach(([freq, type], i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type as OscillatorType;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq as number;
      gain.gain.setValueAtTime(0.12, offset + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, offset + 0.6);
      osc.start(offset + i * 0.05); osc.stop(offset + 0.7);
    });
  }

  gameStart() {
    if (this.muted) return;
    const ctx = this.getCtx();
    // Rocket launch sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
    // Power chord after sweep
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + 0.45;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t); o.stop(t + 0.45);
    });
  }
}

export const sounds = new SoundManager();
