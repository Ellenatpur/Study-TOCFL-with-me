/**
 * Taiwan Mandarin Adventure - Core App Controller & Gamification Engine
 * Handles XP, Levels, Coins (NT$), Streaks, Taiwan Travel Map, and Night Market Shop.
 */

class GameApp {
    constructor() {
        this.xp = parseInt(localStorage.getItem('user_xp') || '0');
        this.coins = parseInt(localStorage.getItem('user_coins') || '50'); // Starter 50 NT$
        this.streak = parseInt(localStorage.getItem('user_streak') || '1');
        this.lastStudyDate = localStorage.getItem('last_study_date') || '';
        this.unlockedLevels = new Set(JSON.parse(localStorage.getItem('unlocked_levels') || '[1]'));
        this.unlockedSouvenirs = new Set(JSON.parse(localStorage.getItem('unlocked_souvenirs') || '[]'));
        this.activeTab = 'map'; // 'map', 'flashcard', 'listening', 'reading', 'speaking', 'shop', 'dictionary'

        this.levelTitles = [
            { level: 1, title: '觀光客 (Turis Pemula)', minXp: 0 },
            { level: 2, title: '悠遊卡達人 (Pengguna EasyCard)', minXp: 100 },
            { level: 3, title: '夜市小吃貨 (Pecinta Kuliner Malam)', minXp: 250 },
            { level: 4, title: '捷運通 (Ahli Kereta MRT)', minXp: 450 },
            { level: 5, title: '珍珠奶茶大師 (Master Boba)', minXp: 700 },
            { level: 6, title: '九份旅人 (Penjelajah Jiufen)', minXp: 1000 },
            { level: 7, title: '西門町潮人 (Bintang KTV Ximending)', minXp: 1400 },
            { level: 8, title: '臺鐵慢活家 (Penikmat Kereta Tainan)', minXp: 1900 },
            { level: 9, title: '太魯閣勇士 (Petualang Taroko)', minXp: 2500 },
            { level: 10, title: '水果王國通 (Ahli Buah Taiwan)', minXp: 3200 },
            { level: 12, title: '華語高材生 (Pelajar Unggulan MTC)', minXp: 4200 },
            { level: 15, title: '臺灣國語宗師 (Grandmaster Guoyu)', minXp: 6000 }
        ];

        this.souvenirs = [
            { id: 'boba', name: '珍珠奶茶 (Boba Milk Tea)', icon: '🧋', cost: 50, desc: 'Teh susu mutiara kenyal manis khas pasar malam Taiwan.' },
            { id: 'lantern', name: '平溪天燈 (Lentera Langit Pingxi)', icon: '🏮', cost: 80, desc: 'Lentera tradisional pembuat harapan terbang ke angkasa.' },
            { id: 'xiaolongbao', name: '鼎泰豐小籠包 (Xiaolongbao Sup)', icon: '🥟', cost: 100, desc: 'Pangsit kukus 18 lipatan dengan kuah sup gurih panas.' },
            { id: 'mangoice', name: '芒果雪花冰 (Es Serut Mangga)', icon: '🥭', cost: 120, desc: 'Gunung es serut susu dengan potongan mangga Aiwen legit.' },
            { id: 'pineapple', name: '臺灣鳳梨酥 (Pineapple Cake)', icon: '🍍', cost: 150, desc: 'Kue nastar khas Taiwan pembawa rejeki dan keberuntungan.' },
            { id: 'taipei101', name: '臺北101紀念塔 (Replika Taipei 101)', icon: '🏙️', cost: 250, desc: 'Monumen kebanggaan Taiwan yang menjulang megah menembus awan.' },
            { id: 'bear_badge', name: '黑熊金牌榮譽勳章 (Medali Xiong Bao)', icon: '🏅', cost: 400, desc: 'Tanda kehormatan tertinggi dari Beruang Hitam Taiwan.' }
        ];

        this.checkStreak();
    }

    checkStreak() {
        const today = new Date().toISOString().slice(0, 10);
        if (this.lastStudyDate) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            if (this.lastStudyDate === yesterday) {
                // Streak maintained!
            } else if (this.lastStudyDate !== today) {
                // Streak reset if missed more than 1 day
                const diffDays = Math.round((new Date(today) - new Date(this.lastStudyDate)) / 86400000);
                if (diffDays > 1) {
                    this.streak = 1;
                    localStorage.setItem('user_streak', '1');
                }
            }
        }
        this.lastStudyDate = today;
        localStorage.setItem('last_study_date', today);
    }

    getCurrentLevelInfo() {
        let current = this.levelTitles[0];
        let next = this.levelTitles[1];

        for (let i = 0; i < this.levelTitles.length; i++) {
            if (this.xp >= this.levelTitles[i].minXp) {
                current = this.levelTitles[i];
                next = this.levelTitles[i + 1] || { level: current.level + 1, title: '國語傳奇', minXp: current.minXp + 2000 };
            }
        }

        const xpInLevel = this.xp - current.minXp;
        const xpRequired = next.minXp - current.minXp;
        const progress = Math.min(100, Math.max(0, Math.round((xpInLevel / xpRequired) * 100)));

        return { current, next, progress, xpInLevel, xpRequired };
    }

    addXP(amount) {
        const prevLevel = this.getCurrentLevelInfo().current.level;
        this.xp += amount;
        localStorage.setItem('user_xp', this.xp);

        const newLevelInfo = this.getCurrentLevelInfo();
        if (newLevelInfo.current.level > prevLevel) {
            // Level Up Event!
            if (window.soundEngine) window.soundEngine.playLevelUp();
            this.showLevelUpModal(newLevelInfo.current);
        }

        this.updateHUD();
    }

    addCoins(amount) {
        this.coins += amount;
        localStorage.setItem('user_coins', this.coins);
        this.updateHUD();
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            localStorage.setItem('user_coins', this.coins);
            this.updateHUD();
            return true;
        }
        return false;
    }

    unlockLevel(lvl) {
        this.unlockedLevels.add(lvl);
        localStorage.setItem('unlocked_levels', JSON.stringify([...this.unlockedLevels]));
        this.renderMap();
    }

    buySouvenir(souvenirId) {
        const item = this.souvenirs.find(s => s.id === souvenirId);
        if (!item || this.unlockedSouvenirs.has(souvenirId)) return;

        if (this.spendCoins(item.cost)) {
            if (window.soundEngine) {
                window.soundEngine.playCoin();
                window.soundEngine.playBobaPop();
            }
            this.unlockedSouvenirs.add(souvenirId);
            localStorage.setItem('unlocked_souvenirs', JSON.stringify([...this.unlockedSouvenirs]));
            this.renderShop();
            window.mascot.say('correct', {
                zh: `太棒了！獲得紀念品：${item.name}！`,
                pinyin: `Tài bàng le! Huòdé jǐniànpǐn: ${item.name}!`,
                id: `Selamat! Kamu berhasil mengoleksi ${item.name}!`
            });
        } else {
            if (window.soundEngine) window.soundEngine.playWrong();
            alert(`Koin NT$ kamu belum cukup. Ayo selesaikan kuis untuk mendapatkan lebih banyak NT$!`);
        }
    }

    updateHUD() {
        const xpVal = document.getElementById('hud-xp-val');
        const levelVal = document.getElementById('hud-level-val');
        const levelTitle = document.getElementById('hud-level-title');
        const coinsVal = document.getElementById('hud-coins-val');
        const streakVal = document.getElementById('hud-streak-val');
        const xpProgress = document.getElementById('hud-xp-bar');

        const lvlInfo = this.getCurrentLevelInfo();

        if (xpVal) xpVal.textContent = `${this.xp} XP`;
        if (levelVal) levelVal.textContent = `Lv.${lvlInfo.current.level}`;
        if (levelTitle) levelTitle.textContent = lvlInfo.current.title;
        if (coinsVal) coinsVal.textContent = `${this.coins} NT$`;
        if (streakVal) streakVal.textContent = `${this.streak} Hari 🔥`;
        if (xpProgress) xpProgress.style.width = `${lvlInfo.progress}%`;
    }

    showLevelUpModal(levelObj) {
        const modal = document.createElement('div');
        modal.className = 'taiwan-modal-overlay';
        modal.innerHTML = `
            <div class="level-up-dialog animate-pop">
                <div class="modal-lantern-decor">🏮 恭喜升級！ 🏮</div>
                <div class="level-badge-large">Lv.${levelObj.level}</div>
                <h2>Selamat Naik Level!</h2>
                <h3 class="level-award-title">${levelObj.title}</h3>
                <p>Kemampuan Mandarin Taiwanmu semakin matang dan mengagumkan!</p>
                <div class="modal-rewards">
                    <span class="reward-chip">+100 NT$ Bonus Koin! 🪙</span>
                    <span class="reward-chip">+1 Boba Point 🧋</span>
                </div>
                <button class="taiwan-btn btn-primary" onclick="this.closest('.taiwan-modal-overlay').remove()">
                    Lanjutkan Petualangan ➔
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        this.addCoins(100);
    }

    switchTab(tabName) {
        if (window.soundEngine) window.soundEngine.playClick();
        this.activeTab = tabName;

        // Update nav pills
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Hide all views
        const views = ['map-view', 'flashcard-view', 'listening-view', 'reading-view', 'speaking-view', 'shop-view', 'dictionary-view'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.classList.add('hidden');
        });

        // Show active view
        const targetView = document.getElementById(`${tabName}-view`);
        if (targetView) targetView.classList.remove('hidden');

        // Init target game
        if (tabName === 'map') this.renderMap();
        else if (tabName === 'flashcard') window.flashcardGame.init(window.flashcardGame.currentLessonNum || 1);
        else if (tabName === 'listening') window.listeningGame.init(window.listeningGame.activeLesson || 'all');
        else if (tabName === 'reading') window.readingGame.init(window.readingGame.activeLesson || 1);
        else if (tabName === 'speaking') window.speakingGame.init(window.speakingGame.activeLesson || 1);
        else if (tabName === 'shop') this.renderShop();
        else if (tabName === 'dictionary') this.renderDictionary();
    }

    startLesson(lessonNum) {
        if (window.soundEngine) window.soundEngine.playTaiwanTrain();
        this.unlockLevel(lessonNum);
        window.flashcardGame.init(lessonNum);
        this.switchTab('flashcard');
    }

    renderMap() {
        const container = document.getElementById('map-view');
        if (!container) return;

        container.innerHTML = `
            <div class="map-view-header">
                <div class="map-banner">
                    <span class="map-tag">🚂 JELAJAH TAIWAN</span>
                    <h1>臺灣鐵道華語大冒險 (Taiwan Railway Mandarin Tour)</h1>
                    <p>Mulai dari Bandara Taoyuan melintasi 15 bab penuh petualangan kuliner, budaya, dan obrolan sehari-hari!</p>
                </div>
            </div>

            <!-- Taiwan Journey Route Stations Grid -->
            <div class="railway-route-grid">
                ${window.MANDARIN_DATABASE.map(lesson => {
                    const isUnlocked = this.unlockedLevels.has(lesson.num) || lesson.num === 1;
                    return `
                        <div class="station-card ${isUnlocked ? 'station-open' : 'station-locked'}" onclick="window.gameApp.startLesson(${lesson.num})">
                            <div class="station-number">Bab ${lesson.num}</div>
                            <div class="station-icon-wrap">
                                <span class="station-icon">${lesson.landmark_icon}</span>
                            </div>
                            <div class="station-content">
                                <h3 class="station-zh traditional-font">${lesson.title_zh}</h3>
                                <div class="station-pinyin">${lesson.title_pinyin}</div>
                                <div class="station-id">${lesson.title_id}</div>
                                <div class="station-landmark">📍 ${lesson.location}</div>
                            </div>
                            <div class="station-meta">
                                <span class="badge-vocab-count">${lesson.vocabCount} Kosakata</span>
                                <span class="station-action-btn">${isUnlocked ? 'Mulai Babak ➔' : '🔒 Terkunci'}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderShop() {
        const container = document.getElementById('shop-view');
        if (!container) return;

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge badge-shop">🏮 PASAR MALAM TAIWAN</span>
                    <h2>夜市紀念品專賣店 (Night Market Souvenirs)</h2>
                    <p class="section-subtitle">Tukarkan koin NT$ hasil belajarmu dengan suvenir dan jajanan legendaris Taiwan!</p>
                </div>
                <div class="shop-wallet-box">
                    <span>Dompet Kamu:</span>
                    <strong class="highlight-gold">${this.coins} NT$</strong>
                </div>
            </div>

            <div class="souvenirs-grid">
                ${this.souvenirs.map(s => {
                    const owned = this.unlockedSouvenirs.has(s.id);
                    return `
                        <div class="souvenir-card ${owned ? 'souvenir-owned' : ''}">
                            <div class="souvenir-icon-box">
                                <span class="souvenir-emoji">${s.icon}</span>
                                ${owned ? '<span class="owned-seal">Terbeli ✨</span>' : ''}
                            </div>
                            <div class="souvenir-info">
                                <h3>${s.name}</h3>
                                <p class="souvenir-desc">${s.desc}</p>
                            </div>
                            <div class="souvenir-price-row">
                                <span class="souvenir-cost">💰 ${s.cost} NT$</span>
                                <button class="taiwan-btn ${owned ? 'btn-secondary' : 'btn-primary'}" onclick="window.gameApp.buySouvenir('${s.id}')" ${owned ? 'disabled' : ''}>
                                    ${owned ? 'Sudah Dimiliki' : 'Beli Suvenir'}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderDictionary(searchQuery = '') {
        const container = document.getElementById('dictionary-view');
        if (!container) return;

        // Flatten all 568 words
        let allWords = [];
        window.MANDARIN_DATABASE.forEach(l => {
            allWords = allWords.concat(l.vocabularies);
        });

        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            allWords = allWords.filter(w => 
                w.hanzi.includes(q) || 
                w.pinyin.toLowerCase().includes(q) || 
                w.zhuyin.includes(q) || 
                w.def_id.toLowerCase().includes(q) ||
                w.def_en.toLowerCase().includes(q)
            );
        }

        container.innerHTML = `
            <div class="game-section-header">
                <div class="section-title-wrap">
                    <span class="section-badge badge-dict">📚 KAMUS BUKU</span>
                    <h2>當代中文課程1 總生詞庫 (Daftar Lengkap 568 Kosakata)</h2>
                    <p class="section-subtitle">Seluruh kosakata resmi Buku 1 lengkap dengan Hanzi Tradisional, Zhuyin, Pinyin, dan Bahasa Indonesia.</p>
                </div>
                <div class="dictionary-search-box">
                    <input type="text" id="dict-search-input" class="dict-input" placeholder="🔍 Cari kata: Hanzi, Pinyin, atau Arti Indonesia..." value="${searchQuery}" oninput="window.gameApp.onDictSearch(this.value)">
                    <span class="dict-results-count">Ditemukan ${allWords.length} kata</span>
                </div>
            </div>

            <div class="dictionary-table-wrap">
                <table class="taiwan-dict-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Bab</th>
                            <th>Aksara Hanzi (繁體)</th>
                            <th>注音 (Zhuyin)</th>
                            <th>Pinyin</th>
                            <th>Jenis Kata</th>
                            <th>Arti Bahasa Indonesia</th>
                            <th>English</th>
                            <th>Audio</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allWords.slice(0, 150).map((w, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td><span class="table-lesson-pill">Bab ${w.lesson}</span></td>
                                <td class="dict-hanzi traditional-font font-bold">${w.hanzi}</td>
                                <td class="dict-zhuyin">${w.zhuyin}</td>
                                <td class="dict-pinyin">${w.pinyin}</td>
                                <td><span class="pos-badge">${w.posName}</span></td>
                                <td class="dict-def-id"><strong>${w.def_id}</strong></td>
                                <td class="dict-def-en">${w.def_en}</td>
                                <td>
                                    <button class="table-sound-btn" onclick="window.speechEngine.speak('${w.hanzi}')" title="Putar Pelafalan">
                                        🔊
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${allWords.length > 150 ? `
                    <div class="dict-load-more">Menampilkan 150 kata pertama dari ${allWords.length} kata. Gunakan kotak pencarian di atas untuk memfilter kata tertentu.</div>
                ` : ''}
            </div>
        `;
    }

    onDictSearch(val) {
        this.renderDictionary(val);
    }
}

// Global App Instance
window.gameApp = new GameApp();
