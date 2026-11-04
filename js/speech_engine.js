/**
 * Taiwan Mandarin Adventure - Speech Engine
 * Web Speech API (Synthesis & Recognition) tailored for Taiwan Mandarin (zh-TW)
 */

class SpeechEngine {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.taiwanVoice = null;
        this.rate = parseFloat(localStorage.getItem('speech_rate') || '1.0');
        this.isSpeaking = false;
        this.isListening = false;
        this.recognition = null;
        this.initVoiceList();
        this.initRecognition();
    }

    initVoiceList() {
        if (!this.synth) return;

        const updateVoices = () => {
            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return;

            // Prioritize Taiwan Mandarin voices
            this.taiwanVoice = voices.find(v => 
                (v.lang === 'zh-TW' || v.lang === 'zh_TW' || v.lang === 'cmn-Hant-TW')
            ) || voices.find(v => 
                v.name.includes('Taiwan') || v.name.includes('臺灣') || v.name.includes('台灣') || v.name.includes('Mei-Jia') || v.name.includes('Yating')
            ) || voices.find(v => 
                v.lang.startsWith('zh')
            );
        };

        updateVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = updateVoices;
        }
    }

    setRate(newRate) {
        this.rate = newRate;
        localStorage.setItem('speech_rate', newRate);
    }

    speak(text, onEndCallback = null) {
        if (!this.synth) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Cancel previous speech to avoid overlapping
        this.synth.cancel();

        // Clean text (strip ruby annotations or tone marks if needed)
        const cleanText = text.replace(/[\(\)\[\]（）]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        utterance.lang = 'zh-TW';
        if (this.taiwanVoice) {
            utterance.voice = this.taiwanVoice;
        }
        utterance.rate = this.rate;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            this.isSpeaking = true;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (onEndCallback) onEndCallback();
        };

        utterance.onerror = (e) => {
            console.warn('TTS error:', e);
            this.isSpeaking = false;
            if (onEndCallback) onEndCallback();
        };

        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
    }

    // --- SPEECH RECOGNITION (STT) FOR SPEAKING MODE ---
    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            try {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = 'zh-TW';
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.maxAlternatives = 3;
            } catch (err) {
                console.warn('SpeechRecognition initialization error:', err);
                this.recognition = null;
            }
        }
    }

    hasRecognitionSupport() {
        return !!this.recognition;
    }

    startListening(targetHanzi, onResult, onError) {
        if (!this.recognition) {
            if (onError) onError('Browser tidak mendukung SpeechRecognition secara langsung. Beralih ke Mode Shadowing Mandiri.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        }

        this.isListening = true;
        if (window.soundEngine) window.soundEngine.playMicStart();

        this.recognition.onstart = () => {
            this.isListening = true;
        };

        this.recognition.onresult = (event) => {
            this.isListening = false;
            const transcript = event.results[0][0].transcript.trim();
            const confidence = event.results[0][0].confidence || 0.8;

            // Analyze accuracy
            const score = this.calculateSimilarity(transcript, targetHanzi);
            if (onResult) {
                onResult({
                    transcript,
                    confidence,
                    accuracy: score,
                    target: targetHanzi,
                    isSuccess: score >= 60
                });
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            if (onError) onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        try {
            this.recognition.start();
        } catch (e) {
            console.warn('Recognition start error:', e);
            this.isListening = false;
            if (onError) onError('Gagal memulai mikrofon. Silakan coba lagi atau berikan izin mikrofon.');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    // Levenshtein & character overlap similarity calculation
    calculateSimilarity(str1, str2) {
        const clean1 = str1.replace(/[^\u4e00-\u9fa5]/g, '');
        const clean2 = str2.replace(/[^\u4e00-\u9fa5]/g, '');

        if (!clean1 || !clean2) return 50;
        if (clean1 === clean2) return 100;

        let matches = 0;
        const set2 = new Set(clean2.split(''));
        for (let char of clean1) {
            if (set2.has(char)) matches++;
        }

        const maxLen = Math.max(clean1.length, clean2.length);
        const ratio = Math.round((matches / maxLen) * 100);
        return Math.min(100, Math.max(20, ratio));
    }
}

// Global Speech Engine Instance
window.speechEngine = new SpeechEngine();
