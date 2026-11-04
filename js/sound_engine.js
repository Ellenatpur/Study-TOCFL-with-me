/**
 * Taiwan Mandarin Adventure - Sound Engine
 * Procedural Web Audio API Sound Generator & Synthesizer
 * 100% self-contained, no external audio files required!
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('sound_muted') === 'true';
        this.bgmMuted = localStorage.getItem('bgm_muted') !== 'false'; // default BGM off until user enables
        this.volume = parseFloat(localStorage.getItem('sound_volume') || '0.7');
        this.bgmVolume = 0.25;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.currentNoteIndex = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(mute) {
        this.muted = mute;
        localStorage.setItem('sound_muted', mute);
    }

    setBgmMuted(mute) {
        this.bgmMuted = mute;
        localStorage.setItem('bgm_muted', mute);
        if (mute) {
            this.stopBgm();
        } else {
            this.startBgm();
        }
    }

    // --- PROCEDURAL SOUND EFFECTS ---

    // 1. Crisp Bamboo / Wood Tap Click
    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // 2. Card Flip / Whoosh Sound
    playFlip() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.17);
    }

    // 3. Cheerful Success Chime (Pentatonic Arpeggio)
    playCorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Pentatonic bright notes: C5 (523), E5 (659), G5 (784), C6 (1046)
        const notes = [523.25, 659.25, 783.99, 1046.50];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const startTime = now + idx * 0.07;
            const duration = 0.28;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.35 * this.volume, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.01);
        });
    }

    // 4. Gentle Wrong Tone (Encouraging cartoon thud)
    playWrong() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.22);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // 5. Streak Multiplier Combo (Pitch scales with streak!)
    playStreak(streakCount = 1) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const baseFreq = 440; // A4
        const multiplier = Math.min(streakCount, 10);
        const pitchFactor = 1 + (multiplier * 0.08);

        const chord = [baseFreq * pitchFactor, baseFreq * pitchFactor * 1.25, baseFreq * pitchFactor * 1.5];

        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.3 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.36);
        });
    }

    // 6. NT$ Coin Pickup / XP Ping
    playCoin() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [987.77, 1318.51]; // B5 then E6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.3 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.26);
        });
    }

    // 7. Cute Boba Pop / Bubble Tap
    playBobaPop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06);

        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // 8. Level Up / Victory Fanfare
    playLevelUp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Glorious fanfare notes: C5, E5, G5, C6, G5, C6 (extended victory flourish)
        const notes = [
            { f: 523.25, d: 0.12, t: 0.0 },
            { f: 659.25, d: 0.12, t: 0.12 },
            { f: 783.99, d: 0.12, t: 0.24 },
            { f: 1046.50, d: 0.28, t: 0.36 },
            { f: 783.99, d: 0.12, t: 0.64 },
            { f: 1046.50, d: 0.60, t: 0.76 }
        ];

        notes.forEach(({ f, d, t }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + t;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.4 * this.volume, start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, start + d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + d + 0.05);
        });
    }

    // 9. Taiwan Railway (臺鐵 TRA) Nostalgic Departure Melody
    playTaiwanTrain() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Classic Taiwanese station chime notes: G4 -> E4 -> G4 -> C5
        const melody = [
            { f: 392.00, t: 0.00, d: 0.20 },
            { f: 329.63, t: 0.22, d: 0.20 },
            { f: 392.00, t: 0.44, d: 0.20 },
            { f: 523.25, t: 0.66, d: 0.45 }
        ];

        melody.forEach(({ f, t, d }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + t;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.3 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + d + 0.05);
        });
    }

    // 10. Microphone Listening Tone
    playMicStart() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // 11. Speaking Accuracy High Score Chime
    playSpeakingSuccess() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.04;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.28 * this.volume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.42);
        });
    }

    // --- PROCEDURAL TAIWAN NIGHT MARKET / JIUFEN AMBIENT BGM ---
    // Gentle relaxing pentatonic Taiwanese melody with soft marimba synth
    startBgm() {
        if (this.bgmPlaying || this.bgmMuted) return;
        this.init();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        // Taiwanese traditional pentatonic scale (Gong, Shang, Jiao, Zhi, Yu)
        // C4, D4, E4, G4, A4, C5, D5, E5, G5
        const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
        // Melodic pattern that evokes Taiwanese folk atmosphere (like "Wàng Chūn Fēng" vibes)
        const sequence = [
            4, 3, 2, 3, 4, 6, 5, 4,
            3, 2, 1, 2, 3, 4, 3, 1,
            5, 6, 7, 6, 5, 4, 3, 2,
            3, 4, 2, 1, 0, 1, 2, 0
        ];

        let seqIdx = 0;

        const playNextNote = () => {
            if (!this.bgmPlaying || this.bgmMuted || !this.ctx) return;

            const now = this.ctx.currentTime;
            const noteIdx = sequence[seqIdx % sequence.length];
            seqIdx++;

            const freq = pentatonicScale[noteIdx];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.07 * this.bgmVolume, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.75);
        };

        this.bgmInterval = setInterval(playNextNote, 480);
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

// Global Sound Engine Instance
window.soundEngine = new SoundEngine();
