/**
 * Taiwan Mandarin Adventure - Mascot Module: "Xiong Bao" (熊寶)
 * The enthusiastic Formosan Black Bear companion!
 */

class TaiwanMascot {
    constructor(containerId = 'mascot-container') {
        this.containerId = containerId;
        this.mood = 'happy';
        this.quotes = {
            welcome: [
                { zh: "歡迎你來臺灣！", pinyin: "Huānyíng nǐ lái Táiwān!", id: "Selamat datang di petualangan Mandarin Taiwan! Ayo semangat belajar!" },
                { zh: "今天想去哪個夜市冒險？", pinyin: "Jīntiān xiǎng qù nǎ ge yèshì màoxiǎn?", id: "Hari ini mau bertualang di stage mana nih?" },
                { zh: "學中文像喝珍奶一樣過癮！", pinyin: "Xué Zhōngwén xiàng hē zhēnnǎi yíyàng guòyǐn!", id: "Belajar Mandarin itu seseru minum boba tea!" }
            ],
            correct: [
                { zh: "水啦！太厲害了！", pinyin: "Suí la! Tài lìhài le!", id: "Mantap jiwa! Benar sekali!" },
                { zh: "讚啦！", pinyin: "Zàn la!", id: "Keren banget! Lanjutkan!" },
                { zh: "太強了吧！", pinyin: "Tài qiáng le ba!", id: "Jago banget kamu!" },
                { zh: "一百分！", pinyin: "Yìbǎi fēn!", id: "Nilai 100 buat kamu!" }
            ],
            wrong: [
                { zh: "沒關係，再試一次！", pinyin: "Méiguānxi, zài shì yí cì!", id: "Nggak apa-apa, ayo coba sekali lagi!" },
                { zh: "加油！熊寶陪你！", pinyin: "Jiāyóu! Xióng Bǎo péi nǐ!", id: "Semangat! Xiong Bao nemenin kamu!" },
                { zh: "多聽幾次就記住了！", pinyin: "Duō tīng jǐ cì jiù jìzhù le!", id: "Dengerin beberapa kali lagi pasti hafal!" }
            ],
            streak: [
                { zh: "太狂了！連勝燃燒中！", pinyin: "Tài kuáng le! Liánshèng ránshāo zhōng!", id: "Gokil! Streak kamu membara!" },
                { zh: "手感發燙！夜市達人就是你！", pinyin: "Shǒugǎn fātàng! Yèshì dárén jiù shì nǐ!", id: "Luar biasa! Master pasar malam nih!" }
            ],
            levelUp: [
                { zh: "恭喜升級！請你喝珍珠奶茶！", pinyin: "Gōngxǐ shēngjí! Qǐng nǐ hē zhēnzhū nǎichá!", id: "Selamat naik level! Xiong Bao traktir boba milk tea!" }
            ]
        };
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="mascot-wrapper" onclick="window.mascot.onClick()">
                <div class="mascot-speech-bubble" id="mascot-bubble">
                    <div class="speech-zh" id="mascot-bubble-zh">歡迎你來臺灣！</div>
                    <div class="speech-pinyin" id="mascot-bubble-pinyin">Huānyíng nǐ lái Táiwān!</div>
                    <div class="speech-id" id="mascot-bubble-id">Selamat datang! Ayo kita mulai belajar! 🧋</div>
                </div>
                <div class="mascot-character" id="mascot-svg-wrap">
                    <!-- Formosan Black Bear SVG with White V and Boba Cup -->
                    <svg viewBox="0 0 160 180" class="mascot-svg" id="bear-svg">
                        <defs>
                            <radialGradient id="bearEarGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#ffb7b2" />
                                <stop offset="100%" stop-color="#212529" />
                            </radialGradient>
                            <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#343a40" />
                                <stop offset="100%" stop-color="#1a1d20" />
                            </linearGradient>
                            <filter id="lanternGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <!-- Ears -->
                        <circle cx="35" cy="40" r="22" fill="#212529" />
                        <circle cx="35" cy="40" r="13" fill="#ffb4a2" opacity="0.8" />
                        <circle cx="125" cy="40" r="22" fill="#212529" />
                        <circle cx="125" cy="40" r="13" fill="#ffb4a2" opacity="0.8" />

                        <!-- Body -->
                        <ellipse cx="80" cy="125" rx="55" ry="48" fill="url(#furGrad)" />

                        <!-- Formosan White 'V' Crescent on Chest -->
                        <path d="M 52 105 Q 80 142 108 105 Q 80 126 52 105 Z" fill="#ffffff" stroke="#e9ecef" stroke-width="1.5" />

                        <!-- Arms -->
                        <ellipse cx="32" cy="120" rx="14" ry="24" transform="rotate(20 32 120)" fill="#212529" />
                        <ellipse cx="128" cy="120" rx="14" ry="24" transform="rotate(-20 128 120)" fill="#212529" />

                        <!-- Boba Cup in Hand -->
                        <g transform="translate(112, 115) scale(0.65)">
                            <!-- Straw -->
                            <rect x="18" y="-18" width="6" height="26" fill="#e63946" rx="2" transform="rotate(12 21 -10)" />
                            <!-- Cup -->
                            <path d="M 6 4 L 10 40 Q 22 45 34 40 L 38 4 Z" fill="#ffffff" opacity="0.9" stroke="#adb5bd" stroke-width="2" />
                            <!-- Milk Tea Liquid -->
                            <path d="M 8 14 L 11 38 Q 22 43 33 38 L 36 14 Z" fill="#e9c46a" opacity="0.9" />
                            <!-- Pearls (Boba) -->
                            <circle cx="16" cy="33" r="3.5" fill="#264653" />
                            <circle cx="24" cy="35" r="3.5" fill="#264653" />
                            <circle cx="28" cy="30" r="3" fill="#264653" />
                            <circle cx="19" cy="27" r="3" fill="#264653" />
                        </g>

                        <!-- Head -->
                        <ellipse cx="80" cy="65" rx="46" ry="40" fill="url(#furGrad)" />

                        <!-- Taiwan Traditional Headband / Ribbon -->
                        <path d="M 37 46 Q 80 32 123 46" stroke="#e63946" stroke-width="6" fill="none" stroke-linecap="round" />
                        <circle cx="80" cy="38" r="5" fill="#ffd166" />

                        <!-- Eyes -->
                        <g id="mascot-eyes">
                            <ellipse cx="62" cy="62" rx="5" ry="7" fill="#ffffff" />
                            <circle cx="63" cy="63" r="4" fill="#111111" />
                            <circle cx="64.5" cy="61" r="1.5" fill="#ffffff" />

                            <ellipse cx="98" cy="62" rx="5" ry="7" fill="#ffffff" />
                            <circle cx="97" cy="63" r="4" fill="#111111" />
                            <circle cx="98.5" cy="61" r="1.5" fill="#ffffff" />
                        </g>

                        <!-- Cheeks (Blushing) -->
                        <circle cx="50" cy="74" r="8" fill="#ff758f" opacity="0.45" />
                        <circle cx="110" cy="74" r="8" fill="#ff758f" opacity="0.45" />

                        <!-- Snout -->
                        <ellipse cx="80" cy="76" rx="18" ry="13" fill="#e9ecef" />
                        <!-- Nose -->
                        <ellipse cx="80" cy="71" rx="8" ry="5.5" fill="#212529" />
                        <!-- Mouth -->
                        <path d="M 74 78 Q 80 83 86 78" stroke="#212529" stroke-width="2" fill="none" stroke-linecap="round" id="bear-mouth" />
                    </svg>
                </div>
            </div>
        `;
    }

    say(category, customText = null) {
        let msg;
        if (customText) {
            msg = customText;
        } else {
            const list = this.quotes[category] || this.quotes.welcome;
            msg = list[Math.floor(Math.random() * list.length)];
        }

        const zhEl = document.getElementById('mascot-bubble-zh');
        const pinyinEl = document.getElementById('mascot-bubble-pinyin');
        const idEl = document.getElementById('mascot-bubble-id');
        const bubble = document.getElementById('mascot-bubble');

        if (zhEl && pinyinEl && idEl && bubble) {
            zhEl.textContent = msg.zh;
            pinyinEl.textContent = msg.pinyin;
            idEl.textContent = msg.id;

            bubble.classList.remove('pop-anim');
            void bubble.offsetWidth; // trigger reflow
            bubble.classList.add('pop-anim');
        }

        // Animate mascot bounce
        const svgWrap = document.getElementById('mascot-svg-wrap');
        if (svgWrap) {
            svgWrap.classList.remove('bounce-anim');
            void svgWrap.offsetWidth;
            svgWrap.classList.add('bounce-anim');
        }
    }

    onClick() {
        if (window.soundEngine) window.soundEngine.playBobaPop();
        const randomQuotes = [
            { zh: "讚啦！喝一口珍珠奶茶！", pinyin: "Zàn la! Hē yì kǒu zhēnzhū nǎichá!", id: "Mantap! Sruput boba tea dulu biar makin fokus!" },
            { zh: "你好！我是臺灣黑熊「熊寶」！", pinyin: "Nǐ hǎo! Wǒ shì Táiwān hēixióng 'Xióng Bǎo'!", id: "Halo! Aku Xiong Bao, beruang hitam khas Taiwan!" },
            { zh: "每天練習，中文一定超厲害！", pinyin: "Měitiān liànxí, Zhōngwén yídìng chāo lìhài!", id: "Latihan setiap hari, Mandarin kamu pasti makin jago!" }
        ];
        const pick = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        this.say(null, pick);
    }
}

// Global Mascot Instance
window.mascot = new TaiwanMascot();
