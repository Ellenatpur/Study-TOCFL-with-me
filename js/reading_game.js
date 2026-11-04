/**
 * Taiwan Mandarin Adventure - Reading Game Module
 * 閱讀冒險 (Reading Quest)
 * Sentence Scramble (Susun Kalimat), Memory Match, and Dialogue Reading Comprehension.
 */

class ReadingGame {
    constructor() {
        this.activeSubMode = 'scramble'; // 'scramble', 'memory', 'dialogue'
        this.activeLesson = 1;
        this.scrambleQuestions = [];
        this.currentScrambleIdx = 0;
        this.userSentence = [];
        this.availableTiles = [];
        this.score = 0;

        // Memory game state
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
    }

    init(lessonNum = 1, subMode = 'scramble') {
        this.activeLesson = parseInt(lessonNum);
        this.activeSubMode = subMode;
        this.score = 0;
        this.currentScrambleIdx = 0;
        this.prepareScrambleData();
        this.render();
    }

    prepareScrambleData() {
        // Build sentence scramble challenges from lesson dialogues and vocabulary
        const sentences = [
            {
                lesson: 1,
                id: "Bolehkah saya tanya, apakah Anda Nona Chen Yuemei?",
                targetTokens: ["請問", "你是", "陳月美", "小姐", "嗎？"],
                pinyin: "Qǐngwèn nǐ shì Chén Yuèměi xiǎojiě ma?"
            },
            {
                lesson: 1,
                id: "Selamat datang di Taiwan, kami sangat senang bertemu denganmu!",
                targetTokens: ["歡迎", "你", "來", "臺灣！"],
                pinyin: "Huānyíng nǐ lái Táiwān!"
            },
            {
                lesson: 1,
                id: "Orang Taiwan paling suka minum teh Oolong.",
                targetTokens: ["臺灣人", "最", "喜歡", "喝", "烏龍茶。"],
                pinyin: "Táiwān rén zuì xǐhuān hē Wūlóng chá."
            },
            {
                lesson: 2,
                id: "Rumahmu sangat indah, silakan masuk dan duduk!",
                targetTokens: ["你的家", "真漂亮，", "請進！", "請坐！"],
                pinyin: "Nǐ de jiā zhēn piàoliang, qǐng jìn! Qǐng zuò!"
            },
            {
                lesson: 2,
                id: "Ini adalah foto anggota keluargaku.",
                targetTokens: ["這是我", "家人的", "照片。"],
                pinyin: "Zhè shì wǒ jiārén de zhàopiàn."
            },
            {
                lesson: 3,
                id: "Malam ini kita pergi menonton film bersama, mau tidak?",
                targetTokens: ["今天晚上", "我們", "一起去看電影，", "好不好？"],
                pinyin: "Jīntiān wǎnshàng wǒmen yìqǐ qù kàn diànyǐng, hǎo bù hǎo?"
            },
            {
                lesson: 4,
                id: "Satu gelas besar teh susu panas, totalnya berapa harganya?",
                targetTokens: ["一大杯", "熱奶茶，", "一共", "多少錢？"],
                pinyin: "Yí dà bēi rè nǎichá, yígòng duōshǎo qián?"
            },
            {
                lesson: 5,
                id: "Mie daging sapi di kedai restoran ini sungguh lezat!",
                targetTokens: ["這家餐廳的", "牛肉麵", "真好吃！"],
                pinyin: "Zhè jiā cāntīng de niúròumiàn zhēn hǎochī!"
            },
            {
                lesson: 7,
                id: "Besok pagi jam sembilan kita pergi ke KTV bernyanyi yuk!",
                targetTokens: ["明天早上", "九點", "去KTV", "唱歌吧！"],
                pinyin: "Míngtiān zǎoshang jiǔ diǎn qù KTV chànggē ba!"
            },
            {
                lesson: 8,
                id: "Naik kereta cepat HSR ke Tainan hanya perlu satu setengah jam.",
                targetTokens: ["坐高鐵", "去臺南", "只要", "一個半小時。"],
                pinyin: "Zuò gāotiě qù Táinán zhǐ yào yí ge bàn xiǎoshí."
            },
            {
                lesson: 10,
                id: "Buah mangga Taiwan sangat manis dan lezat.",
                targetTokens: ["臺灣的", "芒果", "非常甜，", "很好吃！"],
                pinyin: "Táiwān de mángguǒ fēicháng tián, hěn hǎochī!"
            },
            {
                lesson: 13,
                id: "Selamat ulang tahun, ini kado yang kami berikan untukmu!",
                targetTokens: ["祝你", "生日快樂，", "這是送你的", "禮物！"],
                pinyin: "Zhù nǐ shēngrì kuàilè, zhè shì sòng nǐ de lǐwù!"
            },
            {
                lesson: 14,
                id: "Cuaca hari ini begitu dingin, kita pergi berendam air panas yuk!",
                targetTokens: ["今天天氣", "這麼冷，", "我們去", "泡溫泉吧！"],
                pinyin: "Jīntiān tiānqì zhème lěng, wǒmen qù pào wēnquán ba!"
            },
            {
                lesson: 15,
                id: "Badan saya kurang enak, dari tadi hidung meler dan kepala sakit.",
                targetTokens: ["我很不舒服，", "一直流鼻水，", "頭也很痛。"],
                pinyin: "Wǒ hěn bù shūfú, yìzhí liú bíshuǐ, tóu yě hěn tòng."
            }
        ];

        // Filter for active lesson if available, or use all
        const matching = sentences.filter(s => s.lesson === this.activeLesson);
        this.scrambleQuestions = matching.length > 0 ? matching : sentences;
        this.loadScrambleQuestion(this.currentScrambleIdx);
    }

    loadScrambleQuestion(idx) {
        if (idx >= this.scrambleQuestions.length) {
            this.renderScrambleDone();
            return;
        }

        const q = this.scrambleQuestions[idx];
        this.userSentence = [];

        // Shuffle tokens
        const tokens = [...q.targetTokens];
        for (let i = tokens.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
        }

        this.availableTiles = tokens.map((token, tIdx) => ({
            id: `tile_${tIdx}`,
            text: token,
            used: false
        }));

        this.renderScrambleArea();
    }

    pickTile(tileId) {
        const tile = this.availableTiles.find(t => t.id === tileId);
        if (!tile || tile.used) return;

        if (window.soundEngine) window.soundEngine.playClick();
        tile.used = true;
        this.userSentence.push(tile);
        this.renderScrambleArea();
    }

    unpickTile(index) {
        if (index < 0 || index >= this.userSentence.length) return;
        if (window.soundEngine) window.soundEngine.playFlip();

        const removed = this.userSentence.splice(index, 1)[0];
        removed.used = false;
        this.renderScrambleArea();
    }

    checkScramble() {
        const q = this.scrambleQuestions[this.currentScrambleIdx];
        const userText = this.userSentence.map(t => t.text).join('');
        const targetText = q.targetTokens.join('');

        const feedbackEl = document.getElementById('scramble-feedback');

        if (userText === targetText) {
            if (window.soundEngine) {
                window.soundEngine.playCorrect();
                window.soundEngine.playCoin();
            }
            window.gameApp.addXP(25);
            window.gameApp.addCoins(15);
            window.mascot.say('correct');

            if (feedbackEl) {
                feedbackEl.innerHTML = `
                    <div class="feedback-box success-box">
                        <div class="fb-title">🎉 Susunan Kalimat Tepat Sekali!</div>
                        <div class="fb-pinyin">${q.pinyin}</div>
                        <button class="taiwan-btn btn-primary" onclick="window.readingGame.nextScramble()">Lanjut Kalimat Berikutnya ➔</button>
                    </div>
                `;
            }
        } else {
            if (window.soundEngine) window.soundEngine.playWrong();
            window.mascot.say('wrong');
            if (feedbackEl) {
                feedbackEl.innerHTML = `
                    <div class="feedback-box error-box">
                        <div class="fb-title">⚠️ Urutan belum tepat. Coba ketuk kata yang salah untuk mengubah susunan!</div>
                    </div>
                `;
            }
        }
    }

    nextScramble() {
        this.currentScrambleIdx++;
        this.loadScrambleQuestion(this.currentScrambleIdx);
    }

    // --- MEMORY MATCH MINI GAME ---
    initMemoryGame() {
        const lesson = window.MANDARIN_DATABASE.find(l => l.num === this.activeLesson) || window.MANDARIN_DATABASE[0];
        const vocabPool = [...lesson.vocabularies].sort(() => 0.5 - Math.random()).slice(0, 6); // 6 pairs = 12 cards

        const cards = [];
        vocabPool.forEach((v, idx) => {
            cards.push({ id: `card_${idx}_hanzi`, pairId: idx, type: 'hanzi', content: v.hanzi, sub: v.zhuyin, flipped: false, matched: false });
            cards.push({ id: `card_${idx}_def`, pairId: idx, type: 'def', content: v.def_id, sub: v.pinyin, flipped: false, matched: false });
        });

        // Shuffle cards
        cards.sort(() => 0.5 - Math.random());
        this.memoryCards = cards;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.renderMemoryGrid();
    }

    flipMemoryCard(cardId) {
        if (this.flippedCards.length >= 2) return;
        const card = this.memoryCards.find(c => c.id === cardId);
        if (!card || card.flipped || card.matched) return;

        if (window.soundEngine) window.soundEngine.playFlip();
        card.flipped = true;
        this.flippedCards.push(card);
        this.renderMemoryGrid();

        if (this.flippedCards.length === 2) {
            const [c1, c2] = this.flippedCards;
            if (c1.pairId === c2.pairId) {
                // Match!
                setTimeout(() => {
                    if (window.soundEngine) {
                        window.soundEngine.playCorrect();
                        window.soundEngine.playCoin();
                    }
                    c1.matched = true;
                    c2.matched = true;
                    this.flippedCards = [];
                    this.matchedPairs++;
                    window.gameApp.addXP(20);
                    window.gameApp.addCoins(10);
                    this.renderMemoryGrid();

                    if (this.matchedPairs === 6) {
                        if (window.soundEngine) window.soundEngine.playLevelUp();
                        window.mascot.say('correct', { zh: "太神啦！記憶配對全部過關！", pinyin: "Tài shén la! Jìyì pèiduì quánbù guòguān!", id: "Gila keren banget! Semua pasangan berhasil dicocokkan!" });
                    }
                }, 500);
            } else {
                // Mismatch
                setTimeout(() => {
                    if (window.soundEngine) window.soundEngine.playWrong();
                    c1.flipped = false;
                    c2.flipped = false;
                    this.flippedCards = [];
                    this.renderMemoryGrid();
                }, 1000);
            }
        }
    }

    render() {
        const container = document.getElementById('reading-view');
        if (!container) return;

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge badge-read">📖 MODE 3</span>
                    <h2>閱讀冒險 (Reading Quest)</h2>
                    <p class="section-subtitle">Tantang pemahaman kalimat, tata bahasa, dan dialog asli Taiwan Mandarin!</p>
                </div>

                <div class="deck-controls">
                    <select class="taiwan-select" onchange="window.readingGame.init(this.value, window.readingGame.activeSubMode)">
                        ${window.MANDARIN_DATABASE.map(l => `
                            <option value="${l.num}" ${l.num === this.activeLesson ? 'selected' : ''}>
                                ${l.landmark_icon} Bab ${l.num}: ${l.title_zh} (${l.title_id})
                            </option>
                        `).join('')}
                    </select>

                    <div class="filter-tabs">
                        <button class="filter-btn ${this.activeSubMode === 'scramble' ? 'active' : ''}" onclick="window.readingGame.setSubMode('scramble', this)">
                            🧩 Susun Kalimat
                        </button>
                        <button class="filter-btn ${this.activeSubMode === 'memory' ? 'active' : ''}" onclick="window.readingGame.setSubMode('memory', this)">
                            🃏 Kartu Memori
                        </button>
                        <button class="filter-btn ${this.activeSubMode === 'dialogue' ? 'active' : ''}" onclick="window.readingGame.setSubMode('dialogue', this)">
                            💬 Baca Dialog Asli
                        </button>
                    </div>
                </div>
            </div>

            <!-- Dynamic Reading Subview Container -->
            <div id="reading-sub-container"></div>
        `;

        if (this.activeSubMode === 'scramble') {
            this.renderScrambleArea();
        } else if (this.activeSubMode === 'memory') {
            this.initMemoryGame();
        } else {
            this.renderDialogueViewer();
        }
    }

    setSubMode(mode, btn) {
        if (window.soundEngine) window.soundEngine.playClick();
        this.activeSubMode = mode;
        document.querySelectorAll('.filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
    }

    renderScrambleArea() {
        const sub = document.getElementById('reading-sub-container');
        if (!sub) return;

        const q = this.scrambleQuestions[this.currentScrambleIdx];
        if (!q) {
            this.renderScrambleDone();
            return;
        }

        sub.innerHTML = `
            <div class="scramble-arena">
                <div class="scramble-target-box">
                    <div class="target-flag">🇮🇩 Arti Kalimat Target:</div>
                    <div class="target-meaning-text">"${q.id}"</div>
                </div>

                <div class="scramble-dropzone">
                    <div class="dropzone-label">Ketuk kata di bawah untuk menyusun kalimat:</div>
                    <div class="user-sentence-tiles">
                        ${this.userSentence.length === 0 ? `
                            <span class="placeholder-text">(Kalimat masih kosong... Pilih kata di bawah)</span>
                        ` : this.userSentence.map((t, idx) => `
                            <button class="word-tile chosen" onclick="window.readingGame.unpickTile(${idx})" title="Ketuk untuk membatalkan">
                                ${t.text}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="scramble-source-tiles">
                    ${this.availableTiles.map(t => `
                        <button class="word-tile ${t.used ? 'used' : ''}" onclick="window.readingGame.pickTile('${t.id}')" ${t.used ? 'disabled' : ''}>
                            ${t.text}
                        </button>
                    `).join('')}
                </div>

                <div id="scramble-feedback"></div>

                <div class="scramble-actions">
                    <button class="taiwan-btn btn-secondary" onclick="window.readingGame.loadScrambleQuestion(${this.currentScrambleIdx})">
                        🔄 Reset Pilihan
                    </button>
                    <button class="taiwan-btn btn-primary" onclick="window.readingGame.checkScramble()" ${this.userSentence.length === 0 ? 'disabled' : ''}>
                        ✨ Periksa Jawaban
                    </button>
                </div>
            </div>
        `;
    }

    renderScrambleDone() {
        const sub = document.getElementById('reading-sub-container');
        if (!sub) return;
        sub.innerHTML = `
            <div class="game-over-card">
                <div class="trophy-bounce">🎉</div>
                <h2>Semua Kalimat Berhasil Disusun!</h2>
                <p>Tata bahasa Mandarin Taiwan kamu semakin mantap!</p>
                <button class="taiwan-btn btn-primary" onclick="window.readingGame.init(window.readingGame.activeLesson, 'scramble')">
                    🔄 Main Lagi
                </button>
            </div>
        `;
    }

    renderMemoryGrid() {
        const sub = document.getElementById('reading-sub-container');
        if (!sub) return;

        sub.innerHTML = `
            <div class="memory-game-arena">
                <div class="memory-status-bar">
                    <span>Pasangan Cocok: <strong>${this.matchedPairs} / 6</strong></span>
                    <span>Tingkat Bab: <strong>Bab ${this.activeLesson}</strong></span>
                </div>

                <div class="memory-grid">
                    ${this.memoryCards.map(c => `
                        <div class="memory-card ${c.flipped ? 'flipped' : ''} ${c.matched ? 'matched' : ''}" onclick="window.readingGame.flipMemoryCard('${c.id}')">
                            <div class="mem-card-face mem-front">
                                <span class="mem-lantern">🏮</span>
                            </div>
                            <div class="mem-card-face mem-back ${c.type}">
                                <div class="mem-text ${c.type === 'hanzi' ? 'traditional-font font-bold' : ''}">${c.content}</div>
                                <div class="mem-sub">${c.sub || ''}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${this.matchedPairs === 6 ? `
                    <div class="memory-win-banner">
                        <h3>🎊 Luar Biasa! Semua Kartu Cocok! (+120 XP)</h3>
                        <button class="taiwan-btn btn-primary" onclick="window.readingGame.initMemoryGame()">Main Babak Baru</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderDialogueViewer() {
        const sub = document.getElementById('reading-sub-container');
        if (!sub) return;

        const lesson = window.MANDARIN_DATABASE.find(l => l.num === this.activeLesson) || window.MANDARIN_DATABASE[0];

        sub.innerHTML = `
            <div class="dialogue-reader-arena">
                <div class="dialogue-meta-header">
                    <h3>${lesson.landmark_icon} 課文對話 (Teks Dialog Bab ${lesson.num}: ${lesson.title_zh})</h3>
                    <p class="dialogue-setting">Lokasi: ${lesson.location} • ${lesson.landmark_desc}</p>
                    <div class="culture-tip-card">
                        🏮 <strong>Nuansa Taiwan:</strong> ${lesson.fun_fact}
                    </div>
                </div>

                <div class="dialogue-bubbles-stream">
                    ${lesson.dialogue.map((line, idx) => `
                        <div class="dialogue-row ${idx % 2 === 0 ? 'speaker-a' : 'speaker-b'}">
                            <div class="speaker-avatar">
                                <span class="avatar-initial">${line.speaker[0]}</span>
                            </div>
                            <div class="bubble-content">
                                <div class="speaker-name">${line.speaker}</div>
                                <div class="bubble-zh traditional-font">${line.zh}</div>
                                <div class="bubble-pinyin">${line.pinyin}</div>
                                <div class="bubble-id">🇮🇩 ${line.id}</div>
                                <button class="bubble-audio-btn" onclick="window.speechEngine.speak('${line.zh}')">
                                    🔊 Putar Suara Baris Ini
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Global Reading Instance
window.readingGame = new ReadingGame();
