/**
 * Taiwan Mandarin Adventure - Flashcard Game Module
 * Full 3D Interactive SRS Flashcards with Zhuyin, Pinyin, Audio, and Indonesian translations.
 */

class FlashcardGame {
    constructor() {
        this.deck = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.autoPlayTimer = null;
        this.autoPlayIntervalSeconds = 4;
        this.isAutoPlaying = false;
        this.showPinyin = true;
        this.showZhuyin = true;
        this.favorites = new Set(JSON.parse(localStorage.getItem('fav_vocab') || '[]'));
        this.mastered = new Set(JSON.parse(localStorage.getItem('mastered_vocab') || '[]'));
    }

    init(lessonNum = 1) {
        this.currentLessonNum = lessonNum;
        this.loadDeck(lessonNum);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.render();
    }

    loadDeck(lessonNum = 'all', filterType = 'all') {
        let allVocab = [];
        if (lessonNum === 'all') {
            window.MANDARIN_DATABASE.forEach(l => {
                allVocab = allVocab.concat(l.vocabularies);
            });
        } else {
            const lesson = window.MANDARIN_DATABASE.find(l => l.num === parseInt(lessonNum));
            if (lesson) allVocab = [...lesson.vocabularies];
        }

        if (filterType === 'favorites') {
            this.deck = allVocab.filter(v => this.favorites.has(v.id));
        } else if (filterType === 'learning') {
            this.deck = allVocab.filter(v => !this.mastered.has(v.id));
        } else if (filterType === 'mastered') {
            this.deck = allVocab.filter(v => this.mastered.has(v.id));
        } else {
            this.deck = allVocab;
        }

        if (this.deck.length === 0) {
            this.deck = allVocab; // Fallback to all if empty
        }

        this.currentIndex = 0;
        this.isFlipped = false;
    }

    shuffle() {
        if (window.soundEngine) window.soundEngine.playFlip();
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.renderCard();
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        if (window.soundEngine) window.soundEngine.playFlip();
        const cardInner = document.getElementById('flashcard-inner');
        if (cardInner) {
            cardInner.classList.toggle('flipped', this.isFlipped);
        }
    }

    nextCard() {
        if (this.deck.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.deck.length;
        this.isFlipped = false;
        this.renderCard();
    }

    prevCard() {
        if (this.deck.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.deck.length) % this.deck.length;
        this.isFlipped = false;
        this.renderCard();
    }

    rate(status) {
        const currentItem = this.deck[this.currentIndex];
        if (!currentItem) return;

        if (status === 'mastered') {
            if (window.soundEngine) window.soundEngine.playCorrect();
            if (window.soundEngine) window.soundEngine.playCoin();
            this.mastered.add(currentItem.id);
            localStorage.setItem('mastered_vocab', JSON.stringify([...this.mastered]));

            // Award XP and NT$
            window.gameApp.addXP(15);
            window.gameApp.addCoins(10);
            window.mascot.say('correct');
        } else if (status === 'doubt') {
            if (window.soundEngine) window.soundEngine.playClick();
            window.gameApp.addXP(5);
            window.gameApp.addCoins(3);
        } else {
            // Repeat
            if (window.soundEngine) window.soundEngine.playWrong();
            window.mascot.say('wrong');
            // Put it 3 cards ahead for spaced repetition
            const repeatCard = this.deck.splice(this.currentIndex, 1)[0];
            const insertIdx = Math.min(this.deck.length, this.currentIndex + 3);
            this.deck.splice(insertIdx, 0, repeatCard);
            this.isFlipped = false;
            this.renderCard();
            return;
        }

        this.nextCard();
    }

    toggleFavorite(vocabId) {
        if (this.favorites.has(vocabId)) {
            this.favorites.delete(vocabId);
        } else {
            this.favorites.add(vocabId);
            if (window.soundEngine) window.soundEngine.playCoin();
        }
        localStorage.setItem('fav_vocab', JSON.stringify([...this.favorites]));
        this.renderCard();
    }

    speakCurrent() {
        const item = this.deck[this.currentIndex];
        if (item && window.speechEngine) {
            window.speechEngine.speak(item.hanzi);
        }
    }

    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        const btn = document.getElementById('autoplay-btn');
        if (this.isAutoPlaying) {
            if (btn) btn.classList.add('active');
            this.runAutoPlayStep();
        } else {
            if (btn) btn.classList.remove('active');
            if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
        }
    }

    runAutoPlayStep() {
        if (!this.isAutoPlaying) return;

        // Step 1: Pronounce front
        this.speakCurrent();

        // Step 2: Flip to back after 1.8s
        this.autoPlayTimer = setTimeout(() => {
            if (!this.isAutoPlaying) return;
            if (!this.isFlipped) this.flip();

            // Step 3: Advance to next card after 2.2s
            this.autoPlayTimer = setTimeout(() => {
                if (!this.isAutoPlaying) return;
                this.nextCard();
                this.runAutoPlayStep();
            }, 2200);
        }, 1800);
    }

    render() {
        const container = document.getElementById('flashcard-view');
        if (!container) return;

        const currentLesson = window.MANDARIN_DATABASE.find(l => l.num === parseInt(this.currentLessonNum)) || window.MANDARIN_DATABASE[0];

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge">🎴 MODE 1</span>
                    <h2>單詞卡冒險 (Flashcard Master)</h2>
                    <p class="section-subtitle">${currentLesson.landmark_icon} Pelajaran ${currentLesson.num}: ${currentLesson.title_zh} (${currentLesson.title_id})</p>
                </div>

                <div class="deck-controls">
                    <select id="lesson-select" class="taiwan-select" onchange="window.flashcardGame.onLessonChange(this.value)">
                        <option value="all">🏮 Semua Kosakata (568 Kata - CCC 1)</option>
                        ${window.MANDARIN_DATABASE.map(l => `
                            <option value="${l.num}" ${l.num === parseInt(this.currentLessonNum) ? 'selected' : ''}>
                                ${l.landmark_icon} Bab ${l.num}: ${l.title_zh} (${l.vocabCount} Kata)
                            </option>
                        `).join('')}
                    </select>

                    <div class="filter-tabs">
                        <button class="filter-btn active" onclick="window.flashcardGame.onFilterChange('all', this)">Semua</button>
                        <button class="filter-btn" onclick="window.flashcardGame.onFilterChange('learning', this)">Belum Hafal</button>
                        <button class="filter-btn" onclick="window.flashcardGame.onFilterChange('mastered', this)">Sudah Hafal</button>
                        <button class="filter-btn" onclick="window.flashcardGame.onFilterChange('favorites', this)">⭐ Favorit</button>
                    </div>
                </div>
            </div>

            <!-- Flashcard Display Area -->
            <div class="flashcard-container">
                <div class="card-progress-bar">
                    <div class="progress-fill" id="card-progress-fill" style="width: 0%;"></div>
                </div>

                <div class="card-meta-bar">
                    <span id="card-counter" class="card-counter-tag">1 / ${this.deck.length}</span>
                    <div class="card-toggles">
                        <label class="toggle-switch" title="Tampilkan Pinyin">
                            <input type="checkbox" id="toggle-pinyin" ${this.showPinyin ? 'checked' : ''} onchange="window.flashcardGame.togglePinyin(this.checked)">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">Pinyin</span>
                        </label>
                        <label class="toggle-switch" title="Tampilkan Zhuyin (Bopomofo)">
                            <input type="checkbox" id="toggle-zhuyin" ${this.showZhuyin ? 'checked' : ''} onchange="window.flashcardGame.toggleZhuyin(this.checked)">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">注音 (Zhuyin)</span>
                        </label>
                        <button class="icon-control-btn" id="autoplay-btn" onclick="window.flashcardGame.toggleAutoPlay()" title="Auto Play Slideshow">
                            ▶️ Putar Otomatis
                        </button>
                        <button class="icon-control-btn" onclick="window.flashcardGame.shuffle()" title="Acak Kartu">
                            🔀 Acak
                        </button>
                    </div>
                </div>

                <!-- 3D Flippable Card -->
                <div class="card-stage" onclick="window.flashcardGame.flip()">
                    <div class="flashcard-inner" id="flashcard-inner">
                        <!-- FRONT SIDE -->
                        <div class="card-face card-front" id="card-front">
                            <!-- Card Content injected here -->
                        </div>

                        <!-- BACK SIDE -->
                        <div class="card-face card-back" id="card-back">
                            <!-- Card Back injected here -->
                        </div>
                    </div>
                </div>

                <!-- Card Action Controls -->
                <div class="card-action-bar">
                    <button class="rate-btn btn-danger" onclick="window.flashcardGame.rate('repeat')" title="Belum hafal, ulangi lagi nanti">
                        <span class="btn-icon">❌</span>
                        <div class="btn-text">
                            <strong>Ulangi</strong>
                            <small>Belum Ingat</small>
                        </div>
                    </button>

                    <button class="rate-btn btn-warning" onclick="window.flashcardGame.rate('doubt')" title="Agak ragu (+5 XP)">
                        <span class="btn-icon">⚠️</span>
                        <div class="btn-text">
                            <strong>Agak Ragu</strong>
                            <small>+5 XP</small>
                        </div>
                    </button>

                    <button class="rate-btn btn-success" onclick="window.flashcardGame.rate('mastered')" title="Sudah hafal lancar (+15 XP)">
                        <span class="btn-icon">✅</span>
                        <div class="btn-text">
                            <strong>Sudah Hafal!</strong>
                            <small>+15 XP & 10 NT$</small>
                        </div>
                    </button>
                </div>

                <!-- Navigation Arrow Buttons -->
                <div class="nav-arrows">
                    <button class="arrow-btn" onclick="window.flashcardGame.prevCard()" title="Sebelumnya (Panah Kiri)">⬅️ Kartu Sebelumnya</button>
                    <button class="flip-hint-btn" onclick="window.flashcardGame.flip()">🔄 Ketuk Kartu Untuk Membalik</button>
                    <button class="arrow-btn" onclick="window.flashcardGame.nextCard()" title="Selanjutnya (Panah Kanan)">Kartu Selanjutnya ➡️</button>
                </div>
            </div>
        `;

        this.renderCard();
    }

    renderCard() {
        const item = this.deck[this.currentIndex];
        if (!item) return;

        // Update progress bar & counter
        const progressFill = document.getElementById('card-progress-fill');
        const counter = document.getElementById('card-counter');
        if (progressFill) {
            const percent = ((this.currentIndex + 1) / this.deck.length) * 100;
            progressFill.style.width = `${percent}%`;
        }
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.deck.length}`;
        }

        const isFav = this.favorites.has(item.id);
        const isMastered = this.mastered.has(item.id);

        // Front Face
        const frontEl = document.getElementById('card-front');
        if (frontEl) {
            frontEl.innerHTML = `
                <div class="card-header-bar">
                    <span class="card-lesson-tag">Bab ${item.lesson} • Bagian ${item.part}</span>
                    <span class="card-pos-tag">${item.posName}</span>
                    <button class="fav-star-btn ${isFav ? 'starred' : ''}" onclick="event.stopPropagation(); window.flashcardGame.toggleFavorite('${item.id}')">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>

                <div class="card-main-content">
                    <div class="zhuyin-text ${this.showZhuyin ? '' : 'hidden'}">${item.zhuyin}</div>
                    <div class="hanzi-text traditional-font">${item.hanzi}</div>
                    <div class="pinyin-text ${this.showPinyin ? '' : 'hidden'}">${item.pinyin}</div>
                </div>

                <div class="card-footer-bar">
                    <button class="audio-pronounce-btn" onclick="event.stopPropagation(); window.flashcardGame.speakCurrent()" title="Dengarkan Pelafalan Bahasa Mandarin Taiwan">
                        🔊 Dengarkan Taiwan Pronunciation
                    </button>
                    <div class="click-hint">Ketuk kartu untuk melihat arti ➔</div>
                </div>
            `;
        }

        // Back Face
        const backEl = document.getElementById('card-back');
        if (backEl) {
            backEl.innerHTML = `
                <div class="card-header-bar">
                    <span class="card-lesson-tag">Arti Kosakata</span>
                    <span class="card-pos-tag">${item.posTag}</span>
                    <span class="status-indicator ${isMastered ? 'badge-mastered' : 'badge-learning'}">
                        ${isMastered ? '✅ Sudah Dikuasai' : '📖 Sedang Dipelajari'}
                    </span>
                </div>

                <div class="card-back-content">
                    <div class="hanzi-small traditional-font">${item.hanzi} <span class="pinyin-inline">(${item.pinyin})</span></div>
                    
                    <div class="meaning-indonesia-box">
                        <div class="meaning-label">🇮🇩 Arti Bahasa Indonesia:</div>
                        <div class="meaning-id-text">${item.def_id}</div>
                    </div>

                    <div class="meaning-english-box">
                        <div class="meaning-label">🇬🇧 English Definition:</div>
                        <div class="meaning-en-text">${item.def_en}</div>
                    </div>

                    <div class="taiwan-usage-tip">
                        💡 <strong>Catatan Taiwan:</strong> Kosakata resmi buku 당대중문 (A Course in Contemporary Chinese) - Bab ${item.lesson}.
                    </div>
                </div>

                <div class="card-footer-bar">
                    <button class="audio-pronounce-btn" onclick="event.stopPropagation(); window.flashcardGame.speakCurrent()">
                        🔊 Ulangi Suara
                    </button>
                    <div class="click-hint">Ketuk untuk kembali ke depan</div>
                </div>
            `;
        }

        // Ensure not flipped when new card renders
        const cardInner = document.getElementById('flashcard-inner');
        if (cardInner) {
            cardInner.classList.toggle('flipped', this.isFlipped);
        }
    }

    togglePinyin(show) {
        this.showPinyin = show;
        const els = document.querySelectorAll('.pinyin-text');
        els.forEach(el => el.classList.toggle('hidden', !show));
    }

    toggleZhuyin(show) {
        this.showZhuyin = show;
        const els = document.querySelectorAll('.zhuyin-text');
        els.forEach(el => el.classList.toggle('hidden', !show));
    }

    onLessonChange(val) {
        if (window.soundEngine) window.soundEngine.playTaiwanTrain();
        this.loadDeck(val);
        this.render();
    }

    onFilterChange(type, btn) {
        if (window.soundEngine) window.soundEngine.playClick();
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadDeck(this.currentLessonNum, type);
        this.renderCard();
    }
}

// Global Flashcard Instance
window.flashcardGame = new FlashcardGame();
