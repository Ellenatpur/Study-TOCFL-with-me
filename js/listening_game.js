/**
 * Taiwan Mandarin Adventure - Listening Game Module
 * 聽力修煉道場 (Listening Dojo)
 * Blind Audio Quiz, Hanzi Match, and Tone Trainer with combo multipliers.
 */

class ListeningGame {
    constructor() {
        this.currentRound = 0;
        this.totalRounds = 10;
        this.score = 0;
        this.streak = 0;
        this.highestStreak = 0;
        this.gameMode = 'meaning'; // 'meaning', 'hanzi', 'tones'
        this.currentQuestion = null;
        this.activeLesson = 'all';
        this.hasAnswered = false;
        this.questionsPool = [];
    }

    init(lessonNum = 'all', mode = 'meaning') {
        this.activeLesson = lessonNum;
        this.gameMode = mode;
        this.score = 0;
        this.streak = 0;
        this.currentRound = 0;
        this.buildPool();
        this.render();
        this.nextQuestion();
    }

    buildPool() {
        let pool = [];
        if (this.activeLesson === 'all') {
            window.MANDARIN_DATABASE.forEach(l => {
                pool = pool.concat(l.vocabularies);
            });
        } else {
            const lesson = window.MANDARIN_DATABASE.find(l => l.num === parseInt(this.activeLesson));
            if (lesson) pool = [...lesson.vocabularies];
        }

        // Shuffle pool
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        this.questionsPool = pool;
    }

    playCurrentAudio() {
        if (!this.currentQuestion || !window.speechEngine) return;
        if (window.soundEngine) window.soundEngine.playBobaPop();
        window.speechEngine.speak(this.currentQuestion.target.hanzi);
    }

    nextQuestion() {
        if (this.currentRound >= this.totalRounds || this.questionsPool.length < 4) {
            this.renderGameOver();
            return;
        }

        this.hasAnswered = false;
        this.currentRound++;

        const target = this.questionsPool[(this.currentRound - 1) % this.questionsPool.length];
        
        // Pick 3 distractors
        const others = this.questionsPool.filter(v => v.id !== target.id);
        const distractors = [];
        const usedIdx = new Set();
        while (distractors.length < 3 && distractors.length < others.length) {
            const rand = Math.floor(Math.random() * others.length);
            if (!usedIdx.has(rand)) {
                usedIdx.add(rand);
                distractors.push(others[rand]);
            }
        }

        const choices = [target, ...distractors];
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        this.currentQuestion = { target, choices };
        this.renderQuestion();

        // Auto play audio after 400ms
        setTimeout(() => {
            this.playCurrentAudio();
        }, 400);
    }

    handleAnswer(choiceIndex, btnElement) {
        if (this.hasAnswered) return;
        this.hasAnswered = true;

        const choice = this.currentQuestion.choices[choiceIndex];
        const isCorrect = choice.id === this.currentQuestion.target.id;

        const allButtons = document.querySelectorAll('.listening-opt-btn');
        allButtons.forEach((b, idx) => {
            b.disabled = true;
            if (this.currentQuestion.choices[idx].id === this.currentQuestion.target.id) {
                b.classList.add('correct-answer');
            }
        });

        if (isCorrect) {
            btnElement.classList.add('user-correct');
            this.streak++;
            if (this.streak > this.highestStreak) this.highestStreak = this.streak;

            const comboBonus = Math.min(this.streak, 5) * 5;
            const roundPoints = 20 + comboBonus;
            this.score += roundPoints;

            if (window.soundEngine) {
                window.soundEngine.playCorrect();
                window.soundEngine.playStreak(this.streak);
            }
            window.gameApp.addXP(roundPoints);
            window.gameApp.addCoins(10 + Math.floor(comboBonus / 2));
            window.mascot.say('correct');
        } else {
            btnElement.classList.add('user-wrong');
            this.streak = 0;
            if (window.soundEngine) window.soundEngine.playWrong();
            window.mascot.say('wrong');
        }

        // Show answer reveal card
        const revealBox = document.getElementById('listening-reveal-box');
        if (revealBox) {
            const t = this.currentQuestion.target;
            revealBox.innerHTML = `
                <div class="reveal-content ${isCorrect ? 'reveal-success' : 'reveal-fail'}">
                    <div class="reveal-icon">${isCorrect ? '🎉 Benar Sekali!' : '💡 Jawaban Yang Benar:'}</div>
                    <div class="reveal-hanzi traditional-font">${t.hanzi}</div>
                    <div class="reveal-phonetics">${t.zhuyin} • ${t.pinyin}</div>
                    <div class="reveal-meaning">🇮🇩 ${t.def_id}</div>
                </div>
            `;
            revealBox.classList.remove('hidden');
        }

        // Update streak HUD
        this.updateStatsHUD();

        // Show next button
        const nextBtn = document.getElementById('listening-next-btn');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
        }
    }

    render() {
        const container = document.getElementById('listening-view');
        if (!container) return;

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge badge-listen">🎧 MODE 2</span>
                    <h2>聽力修煉道場 (Listening Dojo)</h2>
                    <p class="section-subtitle">Latih kepekaan telinga mendengar pelafalan Taiwan Mandarin secara alami!</p>
                </div>

                <div class="deck-controls">
                    <select class="taiwan-select" onchange="window.listeningGame.init(this.value, window.listeningGame.gameMode)">
                        <option value="all">🏮 Semua Bab (Pilihan Acak)</option>
                        ${window.MANDARIN_DATABASE.map(l => `
                            <option value="${l.num}" ${l.num === parseInt(this.activeLesson) ? 'selected' : ''}>
                                ${l.landmark_icon} Bab ${l.num}: ${l.title_zh}
                            </option>
                        `).join('')}
                    </select>

                    <div class="filter-tabs">
                        <button class="filter-btn ${this.gameMode === 'meaning' ? 'active' : ''}" onclick="window.listeningGame.setMode('meaning', this)">
                            🎯 Tebak Arti
                        </button>
                        <button class="filter-btn ${this.gameMode === 'hanzi' ? 'active' : ''}" onclick="window.listeningGame.setMode('hanzi', this)">
                            🈳 Tebak Karakter Hanzi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Listening Stage Area -->
            <div class="listening-arena">
                <div class="listening-stats-bar">
                    <div class="stat-pill"><span class="stat-label">Soal:</span> <strong id="listen-round-indicator">1 / 10</strong></div>
                    <div class="stat-pill"><span class="stat-label">Skor:</span> <strong id="listen-score-indicator" class="highlight-gold">0 Pts</strong></div>
                    <div class="stat-pill"><span class="stat-label">🔥 Combo Streak:</span> <strong id="listen-streak-indicator">0x</strong></div>
                </div>

                <div class="audio-play-stage">
                    <div class="sound-wave-rings" onclick="window.listeningGame.playCurrentAudio()">
                        <div class="audio-pulse-btn">
                            <span class="pulse-icon">🔊</span>
                            <span class="pulse-text">Ketuk Untuk Putar Suara</span>
                        </div>
                    </div>
                    <div class="audio-speed-chips">
                        <button class="speed-chip" onclick="window.speechEngine.setRate(0.75); window.listeningGame.playCurrentAudio()">🐢 0.75x Pelan</button>
                        <button class="speed-chip active" onclick="window.speechEngine.setRate(1.0); window.listeningGame.playCurrentAudio()">🚶 1.0x Normal</button>
                    </div>
                </div>

                <div id="listening-question-prompt" class="question-instruction">
                    Dengarkan audio di atas, lalu pilih jawaban yang paling tepat:
                </div>

                <!-- 4 Choices Grid -->
                <div class="listening-options-grid" id="listening-options-grid">
                    <!-- Buttons injected dynamically -->
                </div>

                <!-- Answer Reveal Card -->
                <div id="listening-reveal-box" class="hidden"></div>

                <!-- Next Question Bar -->
                <div class="stage-footer-actions">
                    <button id="listening-next-btn" class="taiwan-btn btn-primary hidden" onclick="window.listeningGame.nextQuestion()">
                        Soal Berikutnya ➔
                    </button>
                </div>
            </div>
        `;
    }

    renderQuestion() {
        if (!this.currentQuestion) return;

        this.updateStatsHUD();

        const grid = document.getElementById('listening-options-grid');
        const revealBox = document.getElementById('listening-reveal-box');
        const nextBtn = document.getElementById('listening-next-btn');

        if (revealBox) {
            revealBox.classList.add('hidden');
            revealBox.innerHTML = '';
        }
        if (nextBtn) nextBtn.classList.add('hidden');

        if (grid) {
            grid.innerHTML = this.currentQuestion.choices.map((c, idx) => {
                let displayText = '';
                if (this.gameMode === 'hanzi') {
                    displayText = `<span class="opt-hanzi traditional-font">${c.hanzi}</span>`;
                } else {
                    displayText = `<span class="opt-meaning">${c.def_id}</span> <span class="opt-en">(${c.def_en})</span>`;
                }

                return `
                    <button class="listening-opt-btn" onclick="window.listeningGame.handleAnswer(${idx}, this)">
                        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                        <div class="opt-text">${displayText}</div>
                    </button>
                `;
            }).join('');
        }
    }

    updateStatsHUD() {
        const roundEl = document.getElementById('listen-round-indicator');
        const scoreEl = document.getElementById('listen-score-indicator');
        const streakEl = document.getElementById('listen-streak-indicator');

        if (roundEl) roundEl.textContent = `${this.currentRound} / ${this.totalRounds}`;
        if (scoreEl) scoreEl.textContent = `${this.score} Pts`;
        if (streakEl) {
            streakEl.textContent = `${this.streak}x`;
            if (this.streak >= 3) {
                streakEl.classList.add('streak-fire');
            } else {
                streakEl.classList.remove('streak-fire');
            }
        }
    }

    setMode(newMode, btn) {
        if (window.soundEngine) window.soundEngine.playClick();
        this.gameMode = newMode;
        document.querySelectorAll('.filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.init(this.activeLesson, newMode);
    }

    renderGameOver() {
        if (window.soundEngine) window.soundEngine.playLevelUp();
        const container = document.getElementById('listening-view');
        if (!container) return;

        const maxScore = this.totalRounds * 35;
        const percentage = Math.round((this.score / maxScore) * 100);

        container.innerHTML = `
            <div class="game-over-card">
                <div class="trophy-bounce">🏆</div>
                <h2>Latihan Mendengar Selesai!</h2>
                <p class="subtitle">Hebat! Kamu telah menaklukkan tantangan pendengaran Taiwan Mandarin!</p>

                <div class="score-summary-grid">
                    <div class="summary-box">
                        <div class="summary-val highlight-gold">${this.score}</div>
                        <div class="summary-lbl">Total Skor</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-val highlight-streak">${this.highestStreak}x</div>
                        <div class="summary-lbl">Streak Tertinggi</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-val">${percentage}%</div>
                        <div class="summary-lbl">Akurasi</div>
                    </div>
                </div>

                <div class="game-over-actions">
                    <button class="taiwan-btn btn-primary" onclick="window.listeningGame.init(window.listeningGame.activeLesson, window.listeningGame.gameMode)">
                        🔄 Main Lagi
                    </button>
                    <button class="taiwan-btn btn-secondary" onclick="window.gameApp.switchTab('reading')">
                        📖 Lanjut ke Latihan Reading ➔
                    </button>
                </div>
            </div>
        `;
    }
}

// Global Listening Instance
window.listeningGame = new ListeningGame();
