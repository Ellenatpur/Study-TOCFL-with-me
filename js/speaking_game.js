/**
 * Taiwan Mandarin Adventure - Speaking Game Module
 * 口說發音特訓 (Speaking Arena)
 * Interactive Speech Recognition, Visual Tone Diagrams, and Pronunciation Scoring.
 */

class SpeakingGame {
    constructor() {
        this.activeLesson = 1;
        this.currentIndex = 0;
        this.items = [];
        this.isRecording = false;
        this.lastResult = null;
    }

    init(lessonNum = 1) {
        this.activeLesson = parseInt(lessonNum);
        this.currentIndex = 0;
        this.lastResult = null;
        this.loadItems();
        this.render();
    }

    loadItems() {
        const lesson = window.MANDARIN_DATABASE.find(l => l.num === this.activeLesson) || window.MANDARIN_DATABASE[0];
        // Select key vocabulary and useful phrases from the lesson
        this.items = lesson.vocabularies.slice(0, 15);
    }

    playNative() {
        const item = this.items[this.currentIndex];
        if (!item || !window.speechEngine) return;
        if (window.soundEngine) window.soundEngine.playBobaPop();
        window.speechEngine.speak(item.hanzi);
    }

    toggleMic() {
        if (this.isRecording) {
            window.speechEngine.stopListening();
            this.isRecording = false;
            this.updateMicUI();
            return;
        }

        const item = this.items[this.currentIndex];
        if (!item) return;

        this.isRecording = true;
        this.updateMicUI();

        const resultBox = document.getElementById('speaking-result-box');
        if (resultBox) {
            resultBox.innerHTML = `
                <div class="listening-pulse-banner">
                    <span class="mic-wave">🎙️</span>
                    <span>Sedang mendengarkan... Silakan ucapkan: <strong>"${item.hanzi}"</strong></span>
                </div>
            `;
            resultBox.classList.remove('hidden');
        }

        window.speechEngine.startListening(
            item.hanzi,
            (res) => {
                this.isRecording = false;
                this.lastResult = res;
                this.updateMicUI();
                this.displayResult(res);
            },
            (err) => {
                this.isRecording = false;
                this.updateMicUI();
                this.displayError(err);
            }
        );
    }

    updateMicUI() {
        const micBtn = document.getElementById('speaking-mic-btn');
        if (micBtn) {
            if (this.isRecording) {
                micBtn.classList.add('mic-active');
                micBtn.innerHTML = `
                    <div class="mic-icon-pulse">🔴</div>
                    <div class="mic-label">Sedang Merekam... Ketuk untuk Selesai</div>
                `;
            } else {
                micBtn.classList.remove('mic-active');
                micBtn.innerHTML = `
                    <div class="mic-icon-pulse">🎙️</div>
                    <div class="mic-label">Tekan & Ucapkan Sekarang</div>
                `;
            }
        }
    }

    displayResult(res) {
        const resultBox = document.getElementById('speaking-result-box');
        if (!resultBox) return;

        const isGood = res.accuracy >= 65;

        if (isGood) {
            if (window.soundEngine) {
                window.soundEngine.playSpeakingSuccess();
                window.soundEngine.playCoin();
            }
            window.gameApp.addXP(30);
            window.gameApp.addCoins(15);
            window.mascot.say('correct', {
                zh: "發音超標準！水啦！",
                pinyin: "Fāyīn chāo biāozhǔn! Suí la!",
                id: "Pelafalanmu mantap dan sangat akurat!"
            });
        } else {
            if (window.soundEngine) window.soundEngine.playWrong();
            window.mascot.say('wrong', {
                zh: "快接近了！再聽一次試試看！",
                pinyin: "Kuài jiējìn le! Zài tīng yí cì shìshikàn!",
                id: "Sudah hampir tepat! Dengarkan contoh lalu ulangi lagi ya!"
            });
        }

        resultBox.innerHTML = `
            <div class="speaking-feedback-card ${isGood ? 'good-score' : 'low-score'}">
                <div class="score-circle-wrap">
                    <div class="score-number">${res.accuracy}%</div>
                    <div class="score-text">${isGood ? '🌟 Pelafalan Sangat Bagus!' : '💪 Terus Berlatih!'}</div>
                </div>

                <div class="transcript-comparison">
                    <div class="transcript-row">
                        <span class="t-label">Suara yang Terdeteksi:</span>
                        <span class="t-val user-spoken">"${res.transcript || '(Belum terdengar jelas)'}"</span>
                    </div>
                    <div class="transcript-row">
                        <span class="t-label">Kata Target:</span>
                        <span class="t-val target-spoken traditional-font">${res.target}</span>
                    </div>
                </div>

                <div class="feedback-action-row">
                    <button class="taiwan-btn btn-secondary" onclick="window.speakingGame.playNative()">
                        🔊 Dengar Ulang Contoh
                    </button>
                    <button class="taiwan-btn btn-primary" onclick="window.speakingGame.nextItem()">
                        Kata Selanjutnya ➔
                    </button>
                </div>
            </div>
        `;
    }

    displayError(err) {
        const resultBox = document.getElementById('speaking-result-box');
        if (!resultBox) return;

        resultBox.innerHTML = `
            <div class="speaking-fallback-card">
                <div class="fallback-icon">🎧</div>
                <div class="fallback-title">Mode Shadowing Mandiri</div>
                <p class="fallback-desc">Jika izin mikrofon browser terblokir atau browser belum mengaktifkan input suara, kamu tetap bisa berlatih berbicara secara mandiri!</p>
                <div class="self-rate-row">
                    <span>Bagaimana pelafalanmu barusan?</span>
                    <div class="self-rate-buttons">
                        <button class="taiwan-btn btn-warning" onclick="window.speakingGame.selfRate(10)">Agak Kaku (+10 XP)</button>
                        <button class="taiwan-btn btn-success" onclick="window.speakingGame.selfRate(25)">Lancar & Jelas (+25 XP)</button>
                    </div>
                </div>
            </div>
        `;
    }

    selfRate(xp) {
        if (window.soundEngine) {
            window.soundEngine.playCorrect();
            window.soundEngine.playCoin();
        }
        window.gameApp.addXP(xp);
        window.gameApp.addCoins(10);
        window.mascot.say('correct');
        this.nextItem();
    }

    nextItem() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.lastResult = null;
            this.render();
        } else {
            this.renderDone();
        }
    }

    prevItem() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.lastResult = null;
            this.render();
        }
    }

    render() {
        const container = document.getElementById('speaking-view');
        if (!container) return;

        const item = this.items[this.currentIndex];
        if (!item) return;

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge badge-speak">🎤 MODE 4</span>
                    <h2>口說發音特訓 (Speaking Arena)</h2>
                    <p class="section-subtitle">Latih pita suara mengucapkan Mandarin Taiwan dengan intonasi dan nada akurat!</p>
                </div>

                <div class="deck-controls">
                    <select class="taiwan-select" onchange="window.speakingGame.init(this.value)">
                        ${window.MANDARIN_DATABASE.map(l => `
                            <option value="${l.num}" ${l.num === this.activeLesson ? 'selected' : ''}>
                                ${l.landmark_icon} Bab ${l.num}: ${l.title_zh} (${l.title_id})
                            </option>
                        `).join('')}
                    </select>

                    <div class="speaking-counter-tag">
                        Kata ${this.currentIndex + 1} dari ${this.items.length}
                    </div>
                </div>
            </div>

            <!-- Speaking Practice Card -->
            <div class="speaking-practice-stage">
                <div class="prompt-target-card">
                    <div class="target-zhuyin-tag">${item.zhuyin}</div>
                    <div class="target-hanzi-huge traditional-font">${item.hanzi}</div>
                    <div class="target-pinyin-huge">${item.pinyin}</div>
                    <div class="target-meaning-tag">🇮🇩 ${item.def_id}</div>

                    <button class="taiwan-btn btn-secondary listen-sample-btn" onclick="window.speakingGame.playNative()">
                        🔊 Dengarkan Pelafalan Asli Taiwan
                    </button>
                </div>

                <!-- Taiwan Mandarin Tone Guide Visual -->
                <div class="tone-pitch-guide">
                    <div class="tone-guide-title">📈 Panduan 4 Nada Mandarin Taiwan (四聲調):</div>
                    <div class="tones-row">
                        <div class="tone-box tone-1">
                            <span class="tone-symbol">ˉ (Nada 1)</span>
                            <span class="tone-curve">———— 高平 (55)</span>
                            <small>Tinggi & Datar</small>
                        </div>
                        <div class="tone-box tone-2">
                            <span class="tone-symbol">ˊ (Nada 2)</span>
                            <span class="tone-curve">／ 中升 (35)</span>
                            <small>Menaik Seperti Tanya</small>
                        </div>
                        <div class="tone-box tone-3">
                            <span class="tone-symbol">ˇ (Nada 3)</span>
                            <span class="tone-curve">＼／ 曲折 (214)</span>
                            <small>Turun Lalu Naik</small>
                        </div>
                        <div class="tone-box tone-4">
                            <span class="tone-symbol">ˋ (Nada 4)</span>
                            <span class="tone-curve">＼ 全降 (51)</span>
                            <small>Tegas Menurun Cepat</small>
                        </div>
                    </div>
                </div>

                <!-- Big Interactive Microphone Button -->
                <div class="mic-trigger-container">
                    <button class="huge-mic-btn" id="speaking-mic-btn" onclick="window.speakingGame.toggleMic()">
                        <div class="mic-icon-pulse">🎙️</div>
                        <div class="mic-label">Tekan & Ucapkan Sekarang</div>
                    </button>
                </div>

                <!-- Speech Recognition Feedback Result Area -->
                <div id="speaking-result-box" class="hidden"></div>

                <!-- Navigation between speaking words -->
                <div class="speaking-nav-bar">
                    <button class="arrow-btn" onclick="window.speakingGame.prevItem()" ${this.currentIndex === 0 ? 'disabled' : ''}>
                        ⬅️ Kata Sebelumnya
                    </button>
                    <button class="arrow-btn" onclick="window.speakingGame.nextItem()">
                        Kata Berikutnya ➡️
                    </button>
                </div>
            </div>
        `;
    }

    renderDone() {
        const container = document.getElementById('speaking-view');
        if (!container) return;

        if (window.soundEngine) window.soundEngine.playLevelUp();

        container.innerHTML = `
            <div class="game-over-card">
                <div class="trophy-bounce">🌟</div>
                <h2>Sesi Pelafalan Selesai!</h2>
                <p>Mulut dan lidahmu semakin terbiasa dengan nada dan irama bahasa Mandarin Taiwan!</p>
                <div class="game-over-actions">
                    <button class="taiwan-btn btn-primary" onclick="window.speakingGame.init(window.speakingGame.activeLesson)">
                        🔄 Ulangi Latihan Bab Ini
                    </button>
                    <button class="taiwan-btn btn-secondary" onclick="window.gameApp.switchTab('flashcards')">
                        🎴 Kembali ke Flashcard
                    </button>
                </div>
            </div>
        `;
    }
}

// Global Speaking Instance
window.speakingGame = new SpeakingGame();
