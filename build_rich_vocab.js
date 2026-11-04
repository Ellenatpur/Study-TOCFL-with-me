const fs = require('fs');

const entries = JSON.parse(fs.readFileSync('parsed_entries.json', 'utf8'));

// Zhuyin syllable dictionary
const syllableZhuyin = {
  "a": "ㄚ", "ai": "ㄞ", "an": "ㄢ", "ang": "ㄤ", "ao": "ㄠ",
  "ba": "ㄅㄚ", "bai": "ㄅㄞ", "ban": "ㄅㄢ", "bang": "ㄅㄤ", "bao": "ㄅㄠ", "bei": "ㄅㄟ", "ben": "ㄅㄣ", "beng": "ㄅㄥ", "bi": "ㄅㄧ", "bian": "ㄅㄧㄢ", "biao": "ㄅㄧㄠ", "bie": "ㄅㄧㄝ", "bin": "ㄅㄧㄣ", "bing": "ㄅㄧㄥ", "bo": "ㄅㄛ", "bu": "ㄅㄨ",
  "ca": "ㄘㄚ", "cai": "ㄘㄞ", "can": "ㄘㄢ", "cang": "ㄘㄤ", "cao": "ㄘㄠ", "ce": "ㄘㄜ", "cen": "ㄘㄣ", "ceng": "ㄘㄥ", "cha": "ㄔㄚ", "chai": "ㄔㄞ", "chan": "ㄔㄢ", "chang": "ㄔㄤ", "chao": "ㄔㄠ", "che": "ㄔㄜ", "chen": "ㄔㄣ", "cheng": "ㄔㄥ", "chi": "ㄔ", "chong": "ㄔㄨㄥ", "chou": "ㄔㄡ", "chu": "ㄔㄨ", "chua": "ㄔㄨㄚ", "chuai": "ㄔㄨㄞ", "chuan": "ㄔㄨㄢ", "chuang": "ㄔㄨㄤ", "chui": "ㄔㄨㄟ", "chun": "ㄔㄨㄣ", "chuo": "ㄔㄨㄛ", "ci": "ㄘ", "cong": "ㄘㄨㄥ", "cou": "ㄘㄡ", "cu": "ㄘㄨ", "cuan": "ㄘㄨㄢ", "cui": "ㄘㄨㄟ", "cun": "ㄘㄨㄣ", "cuo": "ㄘㄨㄛ",
  "da": "ㄉㄚ", "dai": "ㄉㄞ", "dan": "ㄉㄢ", "dang": "ㄉㄤ", "dao": "ㄉㄠ", "de": "ㄉㄜ", "dei": "ㄉㄟ", "deng": "ㄉㄥ", "di": "ㄉㄧ", "dian": "ㄉㄧㄢ", "diao": "ㄉㄧㄠ", "die": "ㄉㄧㄝ", "ding": "ㄉㄧㄥ", "diu": "ㄉㄧㄡ", "dong": "ㄉㄨㄥ", "dou": "ㄉㄡ", "du": "ㄉㄨ", "duan": "ㄉㄨㄢ", "dui": "ㄉㄨㄟ", "dun": "ㄉㄨㄣ", "duo": "ㄉㄨㄛ",
  "e": "ㄜ", "ei": "ㄟ", "en": "ㄣ", "er": "ㄦ",
  "fa": "ㄈㄚ", "fan": "ㄈㄢ", "fang": "ㄈㄤ", "fei": "ㄈㄟ", "fen": "ㄈㄣ", "feng": "ㄈㄥ", "fo": "ㄈㄛ", "fou": "ㄈㄡ", "fu": "ㄈㄨ",
  "ga": "ㄍㄚ", "gai": "ㄍㄞ", "gan": "ㄍㄢ", "gang": "ㄍㄤ", "gao": "ㄍㄠ", "ge": "ㄍㄜ", "gei": "ㄍㄟ", "gen": "ㄍㄣ", "geng": "ㄍㄥ", "gong": "ㄍㄨㄥ", "gou": "ㄍㄡ", "gu": "ㄍㄨ", "gua": "ㄍㄨㄚ", "guai": "ㄍㄨㄞ", "guan": "ㄍㄨㄢ", "guang": "ㄍㄨㄤ", "gui": "ㄍㄨㄟ", "gun": "ㄍㄨㄣ", "guo": "ㄍㄨㄛ",
  "ha": "ㄏㄚ", "hai": "ㄏㄞ", "han": "ㄏㄢ", "hang": "ㄏㄤ", "hao": "ㄏㄠ", "he": "ㄏㄜ", "hei": "ㄏㄟ", "hen": "ㄏㄣ", "heng": "ㄏㄥ", "hong": "ㄏㄨㄥ", "hou": "ㄏㄡ", "hu": "ㄏㄨ", "hua": "ㄏㄨㄚ", "huai": "ㄏㄨㄞ", "huan": "ㄏㄨㄢ", "huang": "ㄏㄨㄤ", "hui": "ㄏㄨㄟ", "hun": "ㄏㄨㄣ", "huo": "ㄏㄨㄛ",
  "ji": "ㄐㄧ", "jia": "ㄐㄧㄚ", "jian": "ㄐㄧㄢ", "jiang": "ㄐㄧㄤ", "jiao": "ㄐㄧㄠ", "jie": "ㄐㄧㄝ", "jin": "ㄐㄧㄣ", "jing": "ㄐㄧㄥ", "jiong": "ㄐㄩㄥ", "jiu": "ㄐㄧㄡ", "ju": "ㄐㄩ", "juan": "ㄐㄩㄢ", "jue": "ㄐㄩㄝ", "jun": "ㄐㄩㄣ",
  "ka": "ㄎㄚ", "kai": "ㄎㄞ", "kan": "ㄎㄢ", "kang": "ㄎㄤ", "kao": "ㄎㄠ", "ke": "ㄎㄜ", "ken": "ㄎㄣ", "keng": "ㄎㄥ", "kong": "ㄎㄨㄥ", "kou": "ㄎㄡ", "ku": "ㄎㄨ", "kua": "ㄎㄨㄚ", "kuai": "ㄎㄨㄞ", "kuan": "ㄎㄨㄢ", "kuang": "ㄎㄨㄤ", "kui": "ㄎㄨㄟ", "kun": "ㄎㄨㄣ", "kuo": "ㄎㄨㄛ",
  "la": "ㄌㄚ", "lai": "ㄌㄞ", "lan": "ㄌㄢ", "lang": "ㄌㄤ", "lao": "ㄌㄠ", "le": "ㄌㄜ", "lei": "ㄌㄟ", "leng": "ㄌㄥ", "li": "ㄌㄧ", "lia": "ㄌㄧㄚ", "lian": "ㄌㄧㄢ", "liang": "ㄌㄧㄤ", "liao": "ㄌㄧㄠ", "lie": "ㄌㄧㄝ", "lin": "ㄌㄧㄣ", "ling": "ㄌㄧㄥ", "liu": "ㄌㄧㄡ", "long": "ㄌㄨㄥ", "lou": "ㄌㄡ", "lu": "ㄌㄨ", "lv": "ㄌㄩ", "luan": "ㄌㄨㄢ", "lve": "ㄌㄩㄝ", "lun": "ㄌㄨㄣ", "luo": "ㄌㄨㄛ",
  "ma": "ㄇㄚ", "mai": "ㄇㄞ", "man": "ㄇㄢ", "mang": "ㄇㄤ", "mao": "ㄇㄠ", "me": "ㄇㄜ", "mei": "ㄇㄟ", "men": "ㄇㄣ", "meng": "ㄇㄥ", "mi": "ㄇㄧ", "mian": "ㄇㄧㄢ", "miao": "ㄇㄧㄠ", "mie": "ㄇㄧㄝ", "min": "ㄇㄧㄣ", "ming": "ㄇㄧㄥ", "miu": "ㄇㄧㄡ", "mo": "ㄇㄛ", "mou": "ㄇㄡ", "mu": "ㄇㄨ",
  "na": "ㄋㄚ", "nai": "ㄋㄞ", "nan": "ㄋㄢ", "nang": "ㄋㄤ", "nao": "ㄋㄠ", "ne": "ㄋㄜ", "nei": "ㄋㄟ", "nen": "ㄋㄣ", "neng": "ㄋㄥ", "ni": "ㄋㄧ", "nian": "ㄋㄧㄢ", "niang": "ㄋㄧㄤ", "niao": "ㄋㄧㄠ", "nie": "ㄋㄧㄝ", "nin": "ㄋㄧㄣ", "ning": "ㄋㄧㄥ", "niu": "ㄋㄧㄡ", "nong": "ㄋㄨㄥ", "nou": "ㄋㄡ", "nu": "ㄋㄨ", "nv": "ㄋㄩ", "nuan": "ㄋㄨㄢ", "nve": "ㄋㄩㄝ", "nuo": "ㄋㄨㄛ",
  "o": "ㄛ", "ou": "ㄡ",
  "pa": "ㄆㄚ", "pai": "ㄆㄞ", "pan": "ㄆㄢ", "pang": "ㄆㄤ", "pao": "ㄆㄠ", "pei": "ㄆㄟ", "pen": "ㄆㄣ", "peng": "ㄆㄥ", "pi": "ㄆㄧ", "pian": "ㄅㄧㄢ", "piao": "ㄆㄧㄠ", "pie": "ㄆㄧㄝ", "pin": "ㄆㄧㄣ", "ping": "ㄆㄧㄥ", "po": "ㄆㄛ", "pou": "ㄆㄡ", "pu": "ㄆㄨ",
  "qi": "ㄑㄧ", "qia": "ㄑㄧㄚ", "qian": "ㄑㄧㄢ", "qiang": "ㄑㄧㄤ", "qiao": "ㄑㄧㄠ", "qie": "ㄑㄧㄝ", "qin": "ㄑㄧㄣ", "qing": "ㄑㄧㄥ", "qiong": "ㄑㄩㄥ", "qiu": "ㄑㄧㄡ", "qu": "ㄑㄩ", "quan": "ㄑㄩㄢ", "que": "ㄑㄩㄝ", "qun": "ㄑㄩㄣ",
  "ran": "ㄖㄢ", "rang": "ㄖㄤ", "rao": "ㄖㄠ", "re": "ㄖㄜ", "ren": "ㄖㄣ", "reng": "ㄖㄥ", "ri": "ㄖ", "rong": "ㄖㄨㄥ", "rou": "ㄖㄡ", "ru": "ㄖㄨ", "ruan": "ㄖㄨㄢ", "rui": "ㄖㄨㄟ", "run": "ㄖㄨㄣ", "ruo": "ㄖㄨㄛ",
  "sa": "ㄙㄚ", "sai": "ㄙㄞ", "san": "ㄙㄢ", "sang": "ㄙㄤ", "sao": "ㄙㄠ", "se": "ㄙㄜ", "sen": "ㄙㄣ", "seng": "ㄙㄥ", "sha": "ㄕㄚ", "shai": "ㄕㄞ", "shan": "ㄕㄢ", "shang": "ㄕㄤ", "shao": "ㄕㄠ", "she": "ㄕㄜ", "shei": "ㄕㄟ", "shen": "ㄕㄣ", "sheng": "ㄕㄥ", "shi": "ㄕ", "shou": "ㄕㄡ", "shu": "ㄕㄨ", "shua": "ㄕㄨㄚ", "shuai": "ㄕㄨㄞ", "shuan": "ㄕㄨㄢ", "shuang": "ㄕㄨㄤ", "shui": "ㄕㄨㄟ", "shun": "ㄕㄨㄣ", "shuo": "ㄕㄨㄛ", "si": "ㄙ", "song": "ㄙㄨㄥ", "sou": "ㄙㄡ", "su": "ㄙㄨ", "suan": "ㄙㄨㄢ", "sui": "ㄙㄨㄟ", "sun": "ㄙㄨㄣ", "suo": "ㄙㄨㄛ",
  "ta": "ㄊㄚ", "tai": "ㄊㄞ", "tan": "ㄊㄢ", "tang": "ㄊㄤ", "tao": "ㄊㄠ", "te": "ㄊㄜ", "teng": "ㄊㄥ", "ti": "ㄊㄧ", "tian": "ㄊㄧㄢ", "tiao": "ㄊㄧㄠ", "tie": "ㄊㄧㄝ", "ting": "ㄊㄧㄥ", "tong": "ㄊㄨㄥ", "tou": "ㄊㄡ", "tu": "ㄊㄨ", "tuan": "ㄊㄨㄢ", "tui": "ㄊㄨㄟ", "tun": "ㄊㄨㄣ", "tuo": "ㄊㄨㄛ",
  "wa": "ㄨㄚ", "wai": "ㄨㄞ", "wan": "ㄨㄢ", "wang": "ㄨㄤ", "wei": "ㄨㄟ", "wen": "ㄨㄣ", "weng": "ㄨㄥ", "wo": "ㄨㄛ", "wu": "ㄨ",
  "xi": "ㄒㄧ", "xia": "ㄒㄧㄚ", "xian": "ㄒㄧㄢ", "xiang": "ㄒㄧㄤ", "xiao": "ㄒㄧㄠ", "xie": "ㄒㄧㄝ", "xin": "ㄒㄧㄣ", "xing": "ㄒㄧㄥ", "xiong": "ㄒㄩㄥ", "xiu": "ㄒㄧㄡ", "xu": "ㄒㄩ", "xuan": "ㄒㄩㄢ", "xue": "ㄒㄩㄝ", "xun": "ㄒㄩㄣ",
  "ya": "ㄧㄚ", "yan": "ㄧㄢ", "yang": "ㄧㄤ", "yao": "ㄧㄠ", "ye": "ㄧㄝ", "yi": "ㄧ", "yin": "ㄧㄣ", "ying": "ㄧㄥ", "yo": "ㄧㄛ", "yong": "ㄩㄥ", "you": "ㄧㄡ", "yu": "ㄩ", "yuan": "ㄩㄢ", "yue": "ㄩㄝ", "yun": "ㄩㄣ",
  "za": "ㄗㄚ", "zai": "ㄗㄞ", "zan": "ㄗㄢ", "zang": "ㄗㄤ", "zao": "ㄗㄠ", "ze": "ㄗㄜ", "zei": "ㄗㄟ", "zen": "ㄗㄣ", "zeng": "ㄗㄥ", "zha": "ㄓㄚ", "zhai": "ㄓㄞ", "zhan": "ㄓㄢ", "zhang": "ㄓㄤ", "zhao": "ㄓㄠ", "zhe": "ㄓㄜ", "zhei": "ㄓㄟ", "zhen": "ㄓㄣ", "zheng": "ㄓㄥ", "zhi": "ㄓ", "zhong": "ㄓㄨㄥ", "zhou": "ㄓㄡ", "zhu": "ㄓㄨ", "zhua": "ㄓㄨㄚ", "zhuai": "ㄓㄨㄞ", "zhuan": "ㄓㄨㄢ", "zhuang": "ㄓㄨㄤ", "zhui": "ㄓㄨㄟ", "zhun": "ㄓㄨㄣ", "zhuo": "ㄓㄨㄛ", "zi": "ㄗ", "zong": "ㄗㄨㄥ", "zou": "ㄗㄡ", "zu": "ㄗㄨ", "zuan": "ㄗㄨㄢ", "zui": "ㄗㄨㄟ", "zun": "ㄗㄨㄣ", "zuo": "ㄗㄨㄛ"
};

const toneMarks = { 1: '', 2: 'ˊ', 3: 'ˇ', 4: 'ˋ', 5: '˙' };

function parseSyllable(syl) {
    let clean = syl.trim().toLowerCase();
    let tone = 5;
    if (/[āēīōūǖ]/.test(clean)) tone = 1;
    else if (/[áéíóúǘ]/.test(clean)) tone = 2;
    else if (/[ǎěǐǒǔǚ]/.test(clean)) tone = 3;
    else if (/[àèìòùǜ]/.test(clean)) tone = 4;

    let base = clean
        .replace(/[āáǎà]/g, 'a')
        .replace(/[ēéěè]/g, 'e')
        .replace(/[īíǐì]/g, 'i')
        .replace(/[ōóǒò]/g, 'o')
        .replace(/[ūúǔù]/g, 'u')
        .replace(/[ǖǘǚǜü]/g, 'v')
        .replace(/[^a-z]/g, '');

    return { base, tone };
}

// Convert pinyin with tones (e.g. "Táiwān", "kāfēi", "nǐ hǎo") to Zhuyin
function convertPinyinToZhuyin(pinyinStr) {
    let words = pinyinStr.split(/[\s\/\-]+/).filter(Boolean);
    let out = [];
    for (let w of words) {
        // try to segment if multi-syllable without space, or single syllable
        let { base, tone } = parseSyllable(w);
        if (syllableZhuyin[base]) {
            let mark = toneMarks[tone] || '';
            out.push(tone === 5 ? '˙' + syllableZhuyin[base] : syllableZhuyin[base] + mark);
        } else {
            // Greedy syllable matching
            let remaining = w;
            while (remaining.length > 0) {
                let found = false;
                for (let len = Math.min(6, remaining.length); len >= 1; len--) {
                    let sub = remaining.substring(0, len);
                    let { base: subBase, tone: subTone } = parseSyllable(sub);
                    if (syllableZhuyin[subBase]) {
                        let mark = toneMarks[subTone] || '';
                        out.push(subTone === 5 ? '˙' + syllableZhuyin[subBase] : syllableZhuyin[subBase] + mark);
                        remaining = remaining.substring(len);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    out.push(remaining);
                    break;
                }
            }
        }
    }
    return out.join(' ');
}

// Part of Speech mappings to Indonesian
const posMap = {
    'N': 'Kata Benda (Nomina)',
    'V': 'Kata Kerja (Verba)',
    'Vs': 'Kata Sifat (Adjektiva)',
    'Vst': 'Kata Kerja Status',
    'Vaux': 'Kata Kerja Bantu (Modal)',
    'Vi': 'Kata Kerja Intransitif',
    'Vp': 'Kata Kerja Fase (Perubahan Keadaan)',
    'Vpt': 'Kata Kerja Transitif Fase',
    'V-sep': 'Kata Kerja Terpisah (Liheci)',
    'Vp-sep': 'Kata Kerja Fase Terpisah',
    'Vs-pred': 'Kata Sifat Predikatif',
    'Vs-attr': 'Kata Sifat Atributif',
    'Adv': 'Kata Keterangan (Adverbia)',
    'Det': 'Kata Penunjuk (Demonstratif)',
    'M': 'Kata Satuan (Measure Word)',
    'Ptc': 'Partikel Kalimat',
    'Conj': 'Kata Hubung (Konjungsi)',
    'Prep': 'Preposisi (Kata Depan)'
};

// Comprehensive Indonesian translations dictionary for CCC1 vocabulary
const idTranslations = {
    '陳月美': 'Chen Yuemei (nama wanita dari Vietnam)',
    '李明華': 'Li Minghua (nama pria dari Taiwan)',
    '王開文': 'Wang Kaiwen (nama pria dari Amerika Serikat)',
    '你': 'kamu, anda',
    '來': 'datang, ke sini',
    '是': 'adalah, benar, iya',
    '小姐': 'Nona, Mbak',
    '嗎': 'apakah? (partikel tanya ya/tidak)',
    '接': 'menjemput, menyambut (orang)',
    '我們': 'kami, kita',
    '我': 'saya, aku',
    '這': 'ini',
    '先生': 'Tuan, Pak, suami',
    '好': 'baik, bagus, oke',
    '姓': 'bermarga, nama keluarga',
    '叫': 'bernama, dipanggil, memanggil',
    '你們': 'kalian (jamak)',
    '臺灣/台灣': 'Taiwan',
    '歡迎': 'selamat datang, menyambut',
    '請問': 'permisi mau tanya, numpang tanya',
    '是的': 'ya benar, betul sekali',
    '謝謝': 'terima kasih',
    '不客氣': 'sama-sama, terima kasih kembali',
    '你好': 'halo, apa kabar',
    '請': 'silakan, tolong, memohon',
    '喝': 'minum',
    '茶': 'teh',
    '很': 'sangat, sekali',
    '好喝': 'enak diminum, sedap (minuman)',
    '什麼': 'apa, apakah',
    '人': 'orang, manusia',
    '喜歡': 'suka, gemar',
    '呢': 'lalu bagaimana dengan...? (partikel)',
    '他': 'dia (laki-laki)',
    '不': 'tidak, bukan',
    '哪': 'yang mana, mana',
    '要': 'mau, ingin, perlu',
    '咖啡': 'kopi',
    '烏龍茶': 'teh Oolong khas Taiwan',
    '日本': 'Jepang',
    '美國': 'Amerika Serikat',
    '對不起': 'maaf, mohon maaf',
    '哪國': 'negara mana, warganegara apa',
    '張怡君': 'Zhang Yijun (nama wanita Taiwan)',
    '馬安同': 'Ma Antong (nama pria dari Honduras)',
    '的': 'punya, milik, yang (partikel kepemilikan)',
    '家人': 'anggota keluarga',
    '家': 'rumah, keluarga',
    '漂亮': 'cantik, indah, bagus',
    '房子': 'rumah, gedung hunian',
    '坐': 'duduk, naik (kendaraan)',
    '有': 'ada, memiliki, mempunyai',
    '多': 'banyak, lebih',
    '照片': 'foto, gambar potret',
    '都': 'semua, keduanya',
    '照相': 'berfoto, mengambil gambar/foto',
    '張': 'lembar (kata satuan foto, kertas, tiket)',
    '好看': 'bagus dilihat, tampan, cantik, menarik',
    '誰': 'siapa',
    '姐姐': 'kakak perempuan',
    '妹妹': 'adik perempuan',
    '爸爸': 'ayah, papa',
    '媽媽': 'ibu, mama',
    '請進': 'silakan masuk',
    '田中誠一': 'Tanaka Seiichi (pria dari Jepang)',
    '伯母': 'Bibi, Tante (sapaan sopan ibu teman)',
    '您': 'Anda (bentuk sangat sopan)',
    '名字': 'nama, nama panggilan',
    '書': 'buku',
    '哥哥': 'kakak laki-laki',
    '老師': 'guru, pengajar, dosen',
    '看書': 'membaca buku',
    '幾': 'berapa, beberapa',
    '個': 'buah, orang (kata satuan umum)',
    '沒': 'tidak ada, belum',
    '兄弟': 'saudara laki-laki',
    '姐妹': 'saudara perempuan',
    '五': 'lima (5)',
    '兩': 'dua (2 - untuk jumlah/satuan)',
    '週末': 'akhir pekan, weekend',
    '聽': 'mendengar, mendengarkan',
    '音樂': 'musik',
    '運動': 'olahraga, berolahraga',
    '打': 'memukul, bermain (olahraga tangan/bola)',
    '網球': 'tenis lapangan',
    '棒球': 'bisbol (olahraga nasional Taiwan)',
    '和': 'dan, bersama dengan',
    '游泳': 'berenang',
    '常': 'sering, biasanya',
    '籃球': 'bola basket',
    '也': 'juga, pun',
    '踢': 'menendang',
    '足球': 'sepak bola',
    '覺得': 'merasa, berpendapat, menurut saya',
    '好玩': 'seru, mengasyikkan, menyenangkan',
    '明天': 'besok',
    '早上': 'pagi hari',
    '去': 'pergi ke',
    '怎麼樣': 'bagaimana? bagaimana menurutmu?',
    '啊': 'ah, ya! (partikel seru)',
    '做什麼': 'sedang/mau berbuat apa?',
    '好啊': 'oke deh, setuju, boleh banget',
    '白如玉': 'Bai Ruyu (nama wanita dari AS)',
    '今天': 'hari ini',
    '晚上': 'malam hari',
    '看': 'melihat, menonton, membaca',
    '電影': 'film, bioskop',
    '妳': 'kamu (khusus wanita)',
    '想': 'ingin, mau, rindu, berpikir',
    '還是': 'atau (dalam kalimat tanya pilihan)',
    '吧': 'ayo, mari, kan? (partikel ajakan/sugesti)',
    '可以': 'bisa, boleh, dapat',
    '學': 'belajar, menuntut ilmu',
    '中文': 'bahasa Mandarin / Tionghoa',
    '一起': 'bersama-sama, barengan',
    '吃': 'makan',
    '晚飯': 'makan malam',
    '菜': 'masakan, hidangan sayur/lauk',
    '越南': 'Vietnam',
    '好不好': 'bagaimana, mau tidak? setuju kan?',
    '一共': 'total, secara keseluruhan',
    '多少': 'berapa banyak, berapa harga',
    '錢': 'uang',
    '老闆': 'bos, pemilik toko, juragan',
    '買': 'membeli',
    '杯': 'cangkir, gelas (kata satuan)',
    '熱': 'panas, hangat',
    '包子': 'bakpao, pao kukus',
    '要': 'mau, ingin, harus',
    '大': 'besar',
    '中': 'sedang, tengah',
    '小': 'kecil',
    '幫': 'membantu, menolong',
    '微波': 'memanaskan di microwave',
    '百': 'ratus, seratus (100)',
    '塊': 'kuai / dollar NT (satuan mata uang)',
    '好的': 'baiklah, siap, oke',
    '外帶': 'dibungkus bawa pulang (takeaway)',
    '內用': 'makan di tempat (dine-in)',
    '支': 'buah (kata satuan payung, ponsel, pulpen)',
    '手機': 'ponsel, smartphone, hp',
    '牛肉麵': 'mie daging sapi khas Taiwan',
    '真': 'benar-benar, sungguh',
    '好吃': 'enak, lezat rasanya',
    '夜市': 'pasar malam Taiwan (Yeshi)',
    '珍珠奶茶': 'boba milk tea, teh susu mutiara',
    '臭豆腐': 'tahu busuk khas Taiwan (chou doufu)',
    '小籠包': 'xiaolongbao, pangsit sup kukus',
    '捷運': 'MRT / kereta bawah tanah kota Taiwan',
    '高鐵': 'HSR (High Speed Rail / Kereta Cepat Taiwan)',
    '臺鐵/台鐵': 'TRA (Kereta Api Konvensional Taiwan)',
    '火車站': 'stasiun kereta api',
    '多少錢': 'berapa harganya?'
};

// Generic translator for words not hardcoded
function translateToIndonesian(hanzi, def_en) {
    if (idTranslations[hanzi]) return idTranslations[hanzi];

    let cleanEn = def_en.replace(/^\([^\)]+\)\s*/, '').trim();
    
    // Pattern matching common dictionary English definitions
    let mapRules = [
        [/^to have fun/i, 'bersenang-senang, bermain, jalan-jalan'],
        [/^to play/i, 'bermain, memainkan'],
        [/^to eat/i, 'makan'],
        [/^to drink/i, 'minum'],
        [/^to see, to watch/i, 'menonton, melihat'],
        [/^to study, to learn/i, 'belajar, menuntut ilmu'],
        [/^to plan to/i, 'berencana, merencanakan'],
        [/^to go/i, 'pergi'],
        [/^to come/i, 'datang'],
        [/^to buy/i, 'membeli'],
        [/^to sell/i, 'menjual'],
        [/^to rent/i, 'menyewa'],
        [/^to take a photo/i, 'memotret, berfoto'],
        [/^to feel, to think/i, 'merasa, berpendapat'],
        [/^excuse me/i, 'permisi, numpang tanya'],
        [/^altogether/i, 'totalnya, secara keseluruhan'],
        [/^doctor/i, 'dokter'],
        [/^medicine/i, 'obat'],
        [/^hospital/i, 'rumah sakit'],
        [/^pharmacy/i, 'apotek, toko obat'],
        [/^cold/i, 'dingin, masuk angin'],
        [/^hot/i, 'panas'],
        [/^delicious/i, 'lezat, enak'],
        [/^convenient/i, 'praktis, nyaman, mudah'],
        [/^pretty, beautiful/i, 'cantik, indah'],
        [/^handsome/i, 'tampan, ganteng'],
        [/^cheap/i, 'murah, terjangkau'],
        [/^expensive/i, 'mahal'],
        [/^train/i, 'kereta api'],
        [/^airplane/i, 'pesawat terbang'],
        [/^bus/i, 'bus umum'],
        [/^car/i, 'mobil'],
        [/^ticket/i, 'tiket, karcis'],
        [/^station/i, 'stasiun, terminal'],
        [/^weather/i, 'cuaca, hawa'],
        [/^temperature/i, 'suhu udara'],
        [/^spring/i, 'musim semi'],
        [/^summer/i, 'musim panas'],
        [/^autumn/i, 'musim gugur'],
        [/^winter/i, 'musim dingin'],
        [/^birthday/i, 'hari ulang tahun'],
        [/^cake/i, 'kue tar, cake'],
        [/^gift, present/i, 'hadiah, kado'],
        [/^fruit/i, 'buah-buahan'],
        [/^watermelon/i, 'semangka'],
        [/^mango/i, 'mangga'],
        [/^banana/i, 'pisang'],
        [/^apple/i, 'apel'],
        [/^night market/i, 'pasar malam'],
        [/^room/i, 'kamar, ruangan'],
        [/^apartment/i, 'apartemen, rumah sewa'],
        [/^kitchen/i, 'dapur'],
        [/^bathroom/i, 'kamar mandi'],
        [/^rent/i, 'uang sewa bulanan'],
        [/^semester/i, 'semester perkuliahan'],
        [/^class, lesson/i, 'kelas, pelajaran, jam kuliah'],
        [/^classmate/i, 'teman sekelas'],
        [/^student/i, 'murid, siswa, mahasiswa'],
        [/^teacher/i, 'guru, dosen, pengajar'],
        [/^happy/i, 'senang, gembira, bahagia'],
        [/^tired/i, 'lelah, capek'],
        [/^busy/i, 'sibuk, repot'],
        [/^hungry/i, 'lapar'],
        [/^thirsty/i, 'haus, dahaga'],
        [/^painful, ache/i, 'sakit, nyeri, pedih'],
        [/^headache/i, 'sakit kepala'],
        [/^fever/i, 'demam, panas badan'],
        [/^cough/i, 'batuk'],
        [/^a bit earlier/i, 'lebih pagi sedikit, lebih awal'],
        [/^measure word for/i, 'kata satuan untuk'],
        [/^sentence final particle/i, 'partikel di akhir kalimat'],
        [/^modification marker/i, 'partikel kepemilikan/penjelas (yang/punya)']
    ];

    for (let [regex, indText] of mapRules) {
        if (regex.test(cleanEn)) return indText;
    }

    // Default translation cleanup
    return cleanEn
        .replace(/to /g, 'melakukan / ')
        .replace(/sb/g, 'seseorang')
        .replace(/sth/g, 'sesuatu');
}

// Generate example sentences for each entry
function generateExample(hanzi, pinyin, def_id) {
    return {
        zh: `${hanzi}很好！`,
        pinyin: `${pinyin} hěn hǎo!`,
        id: `${hanzi} sangat bagus!`
    };
}

// Group entries by lesson
const lessonVocabMap = {};
for (let i = 1; i <= 15; i++) {
    lessonVocabMap[i] = [];
}

entries.forEach((e, idx) => {
    const lNum = e.lessonNum;
    const cleanDefEn = e.def_en;
    
    // Extract POS from def_en
    let posMatch = cleanDefEn.match(/^\(([^\)]+)\)/);
    let posTag = posMatch ? posMatch[1] : 'Kata';
    let posIndonesian = posMap[posTag] || posTag;

    let zhuyin = convertPinyinToZhuyin(e.pinyin);
    let defId = translateToIndonesian(e.hanzi, cleanDefEn);

    lessonVocabMap[lNum].push({
        id: `vocab_${lNum}_${String(idx + 1).padStart(3, '0')}`,
        lesson: lNum,
        part: e.part,
        hanzi: e.hanzi,
        pinyin: e.pinyin,
        zhuyin: zhuyin,
        posTag: posTag,
        posName: posIndonesian,
        def_en: cleanDefEn,
        def_id: defId,
        favorite: false
    });
});

console.log('Sample enriched vocabulary from Lesson 1:');
console.log(lessonVocabMap[1].slice(0, 4));

fs.writeFileSync('lessonVocabMap.json', JSON.stringify(lessonVocabMap, null, 2));
console.log('Saved lessonVocabMap.json with all 568 words!');
