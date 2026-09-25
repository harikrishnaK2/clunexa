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
  
    // Rapid ascending sparkle arpeggio
    const sparkleFreqs = [523, 659, 784, 1047, 1319, 1568];
    sparkleFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.28);
    });
  
    // Big triumph chord burst after arpeggio
    const chordTime = ctx.currentTime + 0.42;
    [[523, 'triangle'], [659, 'sine'], [784, 'sine'], [1047, 'sine'], [1319, 'sine']].forEach(([freq, type]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type as OscillatorType;
      osc.frequency.value = freq as number;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.22, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.8);
      osc.start(chordTime); osc.stop(chordTime + 0.9);
    });
  
    // Glitter shimmer on top
    [2093, 2637, 3136].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain); gain.connect(ctx.destination);
      const t = chordTime + i * 0.1;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.35);
    });
  }

  fail() {
    if (this.muted) return;
    const ctx = this.getCtx();
  
    // Classic game-over descending tones
    [440, 370, 311, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.13);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, ctx.currentTime + i * 0.13 + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.18);
      osc.start(ctx.currentTime + i * 0.13);
      osc.stop(ctx.currentTime + i * 0.13 + 0.2);
    });
  
    // Low thud at the end
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    const gain = ctx.createGain();
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    const thudTime = ctx.currentTime + 0.55;
    gain.gain.setValueAtTime(0.6, thudTime);
    gain.gain.exponentialRampToValueAtTime(0.001, thudTime + 0.2);
    source.start(thudTime); source.stop(thudTime + 0.25);
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

  roundResult() {
    if (this.muted) return;
    const ctx = this.getCtx();
  
    // Stadium crowd roar simulation (layered noise bursts)
    for (let i = 0; i < 5; i++) {
      const bufSize = ctx.sampleRate * 0.3;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) d[j] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800 + i * 200;
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      src.start(t); src.stop(t + 0.55);
    }
  
    // Punchy horn fanfare
    const hornFreqs = [392, 523, 659, 784, 659, 784, 1047];
    const hornDurations = [0.12, 0.12, 0.12, 0.25, 0.1, 0.12, 0.5];
    let t = ctx.currentTime + 0.3;
    hornFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.setValueAtTime(0.18, t + hornDurations[i] - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + hornDurations[i]);
      osc.start(t); osc.stop(t + hornDurations[i] + 0.02);
      t += hornDurations[i] + 0.02;
    });
  
    // Bass kicks on the beat
    [0, 0.25, 0.5, 0.75].forEach(delay => {
      const bufSize = ctx.sampleRate * 0.1;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufSize, 2);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      const gain = ctx.createGain();
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      const startT = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.7, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.12);
      src.start(startT); src.stop(startT + 0.15);
    });
  }
}

export const sounds = new SoundManager();
