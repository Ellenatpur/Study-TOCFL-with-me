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
  "pa": "ㄆㄚ", "pai": "ㄆㄞ", "pan": "ㄆㄢ", "pang": "ㄆㄤ", "pao": "ㄆㄠ", "pei": "ㄆㄟ", "pen": "ㄆㄣ", "peng": "ㄆㄥ", "pi": "ㄆㄧ", "pian": "ㄆㄧㄢ", "piao": "ㄆㄧㄠ", "pie": "ㄆㄧㄝ", "pin": "ㄆㄧㄣ", "ping": "ㄆㄧㄥ", "po": "ㄆㄛ", "pou": "ㄆㄡ", "pu": "ㄆㄨ",
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

function convertPinyinToZhuyin(pinyinStr) {
    let words = pinyinStr.split(/[\s\/\-]+/).filter(Boolean);
    let out = [];
    for (let w of words) {
        let { base, tone } = parseSyllable(w);
        if (syllableZhuyin[base]) {
            let mark = toneMarks[tone] || '';
            out.push(tone === 5 ? '˙' + syllableZhuyin[base] : syllableZhuyin[base] + mark);
        } else {
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

// Master Indonesian translations dictionary for all CCC1 words
const masterIdDict = {
    // Lesson 1
    '陳月美': 'Chen Yuemei (nama tokoh wanita dari Vietnam)',
    '李明華': 'Li Minghua (nama tokoh pria dari Taiwan)',
    '王開文': 'Wang Kaiwen (nama tokoh pria dari Amerika Serikat)',
    '你': 'kamu, anda',
    '來': 'datang, ke mari',
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
    '好喝': 'enak diminum, segar sedap (minuman)',
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
    '哪國': 'warganegara apa, negara mana',

    // Lesson 2
    '張怡君': 'Zhang Yijun (nama tokoh wanita Taiwan)',
    '馬安同': 'Ma Antong (nama pria dari Honduras)',
    '的': 'punya, milik, yang (partikel kepemilikan)',
    '家人': 'anggota keluarga',
    '家': 'rumah, keluarga',
    '漂亮': 'cantik, indah, molek',
    '房子': 'rumah, tempat tinggal',
    '坐': 'duduk, naik (kendaraan)',
    '有': 'ada, memiliki, mempunyai',
    '多': 'banyak',
    '照片': 'foto, gambar potret',
    '都': 'semua, keduanya',
    '照相': 'berfoto, mengambil gambar/foto',
    '張': 'lembar (kata satuan foto, kertas, meja)',
    '好看': 'bagus dilihat, menarik, cantik, tampan',
    '誰': 'siapa',
    '姐姐': 'kakak perempuan',
    '妹妹': 'adik perempuan',
    '爸爸': 'ayah, bapak, papa',
    '媽媽': 'ibu, mama',
    '請進': 'silakan masuk!',
    '田中誠一': 'Tanaka Seiichi (nama tokoh pria dari Jepang)',
    '伯母': 'Bibi, Tante (sapaan sopan untuk ibu teman)',
    '您': 'Anda (sapaan sangat sopan)',
    '名字': 'nama lengkap, nama panggilan',
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

    // Lesson 3
    '週末': 'akhir pekan, weekend',
    '聽': 'mendengar, menyimak',
    '音樂': 'musik',
    '運動': 'olahraga, berolahraga',
    '打': 'bermain (olahraga tangan/bola), memukul',
    '網球': 'tenis lapangan',
    '棒球': 'bisbol (olahraga nasional populer di Taiwan)',
    '和': 'dan, bersama dengan',
    '游泳': 'berenang',
    '常': 'sering, kerap kali',
    '籃球': 'bola basket',
    '也': 'juga, pun',
    '踢': 'menendang',
    '足球': 'sepak bola',
    '覺得': 'merasa, berpendapat, menurut saya',
    '好玩': 'seru, asyik, menyenangkan',
    '明天': 'besok, esok hari',
    '早上': 'pagi hari',
    '去': 'pergi, berangkat ke',
    '怎麼樣': 'bagaimana? bagaimana menurutmu?',
    '啊': 'ah! ya! (partikel seru penegas)',
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
    '一起': 'bersama-sama, bareng-bareng',
    '吃': 'makan',
    '晚飯': 'makan malam',
    '菜': 'masakan, hidangan lauk/sayur',
    '越南': 'Vietnam',
    '好不好': 'bagaimana, mau tidak? setuju kan?',

    // Lesson 4
    '一共': 'total, secara keseluruhan',
    '多少': 'berapa banyak, berapa harganya',
    '錢': 'uang',
    '老闆': 'bos, pemilik toko, juragan',
    '買': 'membeli',
    '杯': 'cangkir, gelas (kata satuan minuman)',
    '熱': 'panas, hangat',
    '包子': 'bakpao, roti kukus isi daging/kacang',
    '大': 'besar',
    '中': 'sedang, medium, tengah',
    '小': 'kecil',
    '幫': 'membantu, tolong bantu',
    '微波': 'memanaskan di microwave (kebiasaan minimarket Taiwan)',
    '百': 'ratus, seratus (100)',
    '塊': 'kuai / dollar NT (satuan mata uang sehari-hari Taiwan)',
    '好的': 'baiklah, siap, oke',
    '外帶': 'dibungkus bawa pulang (takeaway)',
    '內用': 'makan di tempat (dine-in)',
    '支': 'buah, batang (kata satuan payung, ponsel, pulpen)',
    '枝': 'buah, batang (kata satuan pena, bunga)',
    '手機': 'ponsel, smartphone, telepon genggam',
    '能': 'bisa, mampu, sanggup',
    '上網': 'browsing internet, akses internet',
    '貴': 'mahal, berharga tinggi',
    '賣': 'menjual',
    '便宜': 'murah, terjangkau, ekonomis',
    '要': 'mau, ingin, perlu',
    '萬': 'sepuluh ribu (10.000)',
    '千': 'seribu (1.000)',
    '太': 'terlalu, sangat',
    '了': 'sudah (partikel perubahan keadaan)',
    '太...了': 'terlalu...!',
    '買東西': 'berbelanja barang',

    // Lesson 5
    '牛肉麵': 'mie daging sapi khas Taiwan (Niuroumian)',
    '牛肉': 'daging sapi',
    '麵': 'mie',
    '真': 'sungguh, benar-benar',
    '好吃': 'enak, lezat, sedap rasanya',
    '說': 'berbicara, mengatakan',
    '少': 'sedikit, jarang',
    '有名': 'terkenal, termasyhur, populer',
    '小吃': 'jajanan khas, cemilan tradisional Taiwan',
    '最': 'paling, ter-',
    '湯': 'kuah, sup',
    '這麼': 'sebegitu, sangat demikian',
    '知道': 'tahu, mengetahui, paham',
    '家': 'buah (kata satuan toko/restoran)',
    '店': 'toko, kedai, warung makan',
    '一定': 'pasti, tentu saja',
    '點': 'memesan (makanan/minuman)',
    '碗': 'mangkuk (kata satuan makanan kuah)',
    '是啊': 'iya betul, setuju!',
    '餐廳': 'restoran, rumah makan',
    '這裏/這裡': 'di sini',
    '飲料': 'minuman',
    '味道': 'rasa, aroma, kelezatan',
    '次': 'kali (frekuensi: satu kali, dua kali)',
    '以前': 'dulu, sebelumnya, zaman dulu',
    '時候': 'saat, ketika, waktu',
    '快': 'cepat, lekas',
    '等': 'menunggu',

    // Lesson 6
    '學校': 'sekolah, universitas, kampus',
    '在': 'di, berada di',
    '山上': 'di atas gunung',
    '哪裡/哪裏': 'di mana, ke mana',
    '遠': 'jauh',
    '那裡/那裏': 'di sana',
    '風景': 'pemandangan alam',
    '美': 'indah, elok, mempesona',
    '前面': 'depan, bagian depan',
    '後面': 'belakang, bagian belakang',
    '上面': 'atas, bagian atas',
    '下面': 'bawah, bagian bawah',
    '裡面/裏面': 'dalam, bagian dalam',
    '外面': 'luar, bagian luar',
    '海': 'laut, lautan',
    '山': 'gunung',
    '左邊': 'sebelah kiri',
    '右邊': 'sebelah kanan',
    '旁邊': 'sebelah, di samping',
    '高': 'tinggi',
    '樓': 'lantai, gedung bertingkat',
    '大樓': 'gedung pencakar langit, gedung besar',
    '宿舍': 'asrama mahasiswa/pekerja',
    '圖書館': 'perpustakaan',
    '便利商店': 'minimarket 24 jam (seperti 7-Eleven / FamilyMart di Taiwan)',
    '地圖': 'peta',
    '找': 'mencari',
    '中間': 'tengah, di antara',

    // Lesson 7
    '點': 'pukul, jam (waktu)',
    'KTV': 'karaoke KTV (hiburan favorit di Taiwan)',
    '唱歌': 'menyanyi, bernyanyi',
    '分': 'menit',
    '見面': 'bertemu, berjumpa',
    '從': 'dari (waktu/tempat awal)',
    '中午': 'siang hari (pukul 12:00)',
    '得': 'harus, mesti',
    '銀行': 'bank',
    '開門': 'buka pintu, jam buka toko/kantor',
    '關門': 'tutup pintu, tutup toko/kantor',
    '時候': 'saat, waktu',
    '有事': 'ada urusan, ada keperluan',
    '沒事': 'tidak apa-apa, tidak ada masalah, sedang senggang',
    '下午': 'sore hari, siang menjelang petang',
    '半': 'setengah, setengah jam (30 menit)',
    '刻': 'seperempat jam (15 menit)',
    '差': 'kurang (dalam jam: kurang sekian menit)',
    '走': 'berjalan, pergi, berangkat',
    '走路': 'berjalan kaki',
    '開車': 'mengemudikan mobil, menyetir',
    '騎車': 'mengendarai sepeda motor/sepeda',
    '腳踏車/自行車': 'sepeda',
    '機車': 'sepeda motor (alat transportasi utama di Taiwan)',
    '捷運': 'MRT (Mass Rapid Transit / Kereta Bawah Tanah Taiwan)',
    '站': 'stasiun, halte perhentian',

    // Lesson 8
    '坐': 'naik, menaiki (kendaraan umum)',
    '火車': 'kereta api (TRA)',
    '跟': 'bersama dengan, mengikuti',
    '玩': 'bermain, berlibur, jalan-jalan',
    '怎麼': 'bagaimana cara, mengapa',
    '慢': 'lambat, pelan',
    '鐘頭': 'jam (durasi waktu)',
    '比較': 'lebih, dibandingkan',
    '高鐵': 'HSR (High Speed Rail / Kereta Cepat Taiwan)',
    '票': 'tiket, karcis',
    '車票': 'tiket kereta/bus',
    '非常': 'sangat, amat sangat',
    '方便': 'praktis, nyaman, mudah aksesnya',
    '臺南/台南': 'Tainan (kota budaya dan kuliner bersejarah di selatan Taiwan)',
    '臺北/台北': 'Taipei (ibu kota Taiwan)',
    '車': 'mobil, kendaraan bermotor',
    '開': 'mengendarai, mengemudikan, membuka',
    '到': 'sampai, tiba di, menuju',
    '計程車': 'taksi (taksi kuning ciri khas Taiwan)',
    '差不多': 'hampir sama, kira-kira, mirip',

    // Lesson 9
    '放假': 'liburan, mendapat hari libur',
    '去哪裡': 'pergi ke mana?',
    '帶': 'membawa, mengajak (orang)',
    '打算': 'berencana, bermaksud',
    '聽說': 'kabarnya, konon katanya',
    '花蓮': 'Hualien (daerah wisata alam pantai timur Taiwan)',
    '太魯閣': 'Taroko Gorge (ngarai marmer megah di Taiwan timur)',
    '日出': 'matahari terbit (sunrise)',
    '有名': 'terkenal, kondang',
    '拍照': 'mengambil foto, memotret',
    '別': 'jangan',
    '忘記': 'lupa',
    '行李': 'koper, barang bawaan, bagasi',
    '衣服': 'pakaian, baju',
    '件': 'potong, helai (kata satuan baju)',
    '準備': 'mempersiapkan, bersiap-siap',
    '相機': 'kamera foto',
    '開車': 'menyetir mobil',
    '民宿': 'Minshuku / B&B (penginapan homestay khas Taiwan)',

    // Lesson 10
    '水果': 'buah-buahan',
    '黃色': 'warna kuning',
    '芒果': 'buah mangga (mangga Aiwen Taiwan sangat manis)',
    '給': 'memberi, memberikan, untuk',
    '甜': 'manis (rasanya)',
    '西瓜': 'buah semangka',
    '香蕉': 'buah pisang',
    '鳳梨': 'buah nanas (bahan utama nastar Fengli Su khas Taiwan)',
    '斤': 'jin / kati (satuan berat pasar Taiwan = 600 gram)',
    '公斤': 'kilogram (kg)',
    '紅': 'merah',
    '綠': 'hijau',
    '白': 'putih',
    '黑': 'hitam',
    '顏色': 'warna',
    '種': 'macam, jenis',
    '試吃': 'mencicipi gratis (kebiasaan ramah di pasar Taiwan)',
    '送': 'memberi hadiah, mengantar, bonus cuma-cuma',

    // Lesson 11
    '租': 'menyewa, kontrak',
    '房子': 'rumah, kamar hunian',
    '房租': 'uang sewa bulanan',
    '房東': 'pemilik rumah / kos (landlord)',
    '客廳': 'ruang tamu, ruang keluarga',
    '廚房': 'dapur',
    '臥房/臥室': 'kamar tidur',
    '浴室': 'kamar mandi',
    '套房': 'kamar studio (kamar tidur dengan kamar mandi dalam)',
    '雅房': 'kamar kos standar (kamar mandi luar/bersama)',
    '冷氣': 'AC (pendingin ruangan)',
    '冰箱': 'kulkas, lemari es',
    '洗衣機': 'mesin cuci',
    '網路': 'koneksi internet, Wi-Fi',
    '押金': 'uang deposit / jaminan sewa (biasanya 2 bulan di Taiwan)',
    '簽約': 'menandatangani kontrak sewa',
    '電費': 'tagihan listrik',
    '水費': 'tagihan air',
    '環境': 'lingkungan sekitar, suasana daerah',
    '安靜': 'tenang, sunyi, tidak bising',
    '熱鬧': 'ramai, meriah, hidup suasananya',

    // Lesson 12
    '學': 'belajar, menuntut ilmu',
    '多久': 'berapa lama? (durasi)',
    '中文': 'bahasa Mandarin / Tionghoa',
    '年': 'tahun (durasi waktu)',
    '月': 'bulan (kalender)',
    '天': 'hari',
    '時間': 'waktu, kesempatan',
    '進步': 'kemajuan, berkembang pesat, makin mahir',
    '發音': 'pelafalan nada dan bunyi kata',
    '聲調': 'nada bunyi Mandarin (nada 1, 2, 3, 4, netral)',
    '聽力': 'kemampuan mendengar (listening skill)',
    '口說': 'kemampuan berbicara (speaking skill)',
    '閱讀': 'kemampuan membaca (reading skill)',
    '寫字': 'menulis karakter Hanzi',
    '繁體字': 'Karakter Hanzi Tradisional (resmi di Taiwan)',
    '簡體字': 'Karakter Hanzi Sederhana',
    '注音符號': 'Zhuyin / Bopomofo (sistem fonetik resmi Taiwan)',
    '漢語拼音': 'Hanyu Pinyin',
    '練習': 'berlatih, latihan',
    '認真': 'sungguh-sungguh, tekun, rajin',
    '容易': 'mudah, gampang',
    '難': 'sulit, susah',

    // Lesson 13
    '生日': 'hari ulang tahun',
    '快樂': 'selamat, bahagia, gembira',
    '生日快樂': 'Selamat Ulang Tahun!',
    '蛋糕': 'kue tar, cake ulang tahun',
    '禮物': 'kado, bingkisan, hadiah',
    '送禮物': 'memberikan kado',
    '慶祝': 'merayakan, memperingati',
    '派對': 'pesta, party',
    '卡片': 'kartu ucapan',
    '請客': 'mentraktir makan/minum',
    '乾杯': 'bersulang! (tos gelas)',
    '壽喜燒': 'sukiyaki / hotpot',
    '火鍋': 'hotpot kuah pedas/kaldu khas Taiwan',
    '長壽麵': 'mie panjang umur (tradisi ulang tahun)',
    '許願': 'membuat permohonan / wish saat tiup lilin',
    '蠟燭': 'lilin ulang tahun',
    '吹蠟燭': 'meniup lilin',

    // Lesson 14
    '天氣': 'cuaca, hawa',
    '這麼': 'begitu, sangat demikian',
    '冷': 'dingin (suhu cuaca)',
    '度': 'derajat celsius (°C)',
    '下雪': 'turun salju',
    '下雨': 'turun hujan',
    '帶傘': 'membawa payung',
    '刮風': 'berangin kencang',
    '溫暖': 'hangat, nyaman suhunya',
    '涼快': 'sejuk, adem',
    '四季': 'empat musim',
    '春天': 'musim semi',
    '夏天': 'musim panas',
    '秋天': 'musim gugur',
    '冬天': 'musim dingin',
    '泡溫泉': 'berendam air panas belerang (wisata Beitou / Jiaoxi di Taiwan)',
    '外套': 'jaket tebal, mantel dingin',
    '毛衣': 'baju hangat rajut, sweter',

    // Lesson 15
    '舒服': 'nyaman, enak badan',
    '很不舒服': 'sangat tidak enak badan / meriang',
    '生病': 'jatuh sakit, sedang sakit',
    '看病': 'berobat, periksa ke dokter',
    '醫生': 'dokter',
    '一直': 'terus-menerus, dari tadi tiada henti',
    '流': 'mengalir, keluar terus',
    '鼻水': 'ingus, hidung meler',
    '頭': 'kepala',
    '痛': 'sakit, nyeri, berdenyut nyeri',
    '胃口': 'nafsu makan, selera makan',
    '差': 'buruk, jelek, kurang baik',
    '喉嚨': 'tenggorokan',
    '發炎': 'radang, mengalami inflamasi',
    '發燒': 'demam tinggi, panas badan',
    '感冒': 'flu, batuk pilek, masuk angin',
    '藥': 'obat medis',
    '藥局': 'apotek, toko obat resmi',
    '拿藥': 'mengambil obat dengan resep dokter',
    '水': 'air putih, air minum',
    '休息': 'beristirahat, istirahat',
    '睡覺': 'tidur, beristirahat tidur',
    '早一點': 'lebih awal sedikit, jangan terlalu larut',
    '健保卡': 'kartu asuransi kesehatan nasional Taiwan (NHI Card)',
    '肚子': 'perut',
    '吐': 'muntah'
};

// Generic translator for any edge words
function getIndonesian(hanzi, def_en) {
    if (masterIdDict[hanzi]) return masterIdDict[hanzi];
    let clean = def_en.replace(/^\([^\)]+\)\s*/, '').trim();
    return clean;
}

const posMap = {
    'N': 'Kata Benda (Nomina)',
    'V': 'Kata Kerja (Verba)',
    'Vs': 'Kata Sifat (Adjektiva Keadaan)',
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

// Lesson titles and cultural stories
const lessonMetadata = [
    {
        num: 1,
        title_zh: "歡迎你來臺灣",
        title_pinyin: "Huānyíng Nǐ Lái Táiwān",
        title_id: "Selamat Datang di Taiwan!",
        title_en: "Welcome to Taiwan",
        location: "桃園國際機場 (Taoyuan Airport)",
        landmark_icon: "✈️",
        landmark_desc: "Gerbang kedatangan Taiwan & Kedai Teh Oolong Bandara Taoyuan",
        fun_fact: "Teh Oolong (烏龍茶) adalah minuman selamat datang kebanggaan Taiwan! Saat menyapa di Taiwan, orang lokal sering menyajikan secangkir teh hangat.",
        dialogue: [
            { speaker: "李明華", zh: "你好！請問你是陳月美小姐嗎？", pinyin: "Nǐ hǎo! Qǐngwèn nǐ shì Chén Yuèměi xiǎojiě ma?", id: "Halo! Numpang tanya apakah Anda Nona Chen Yuemei?" },
            { speaker: "陳月美", zh: "是的。請問你是...？", pinyin: "Shì de. Qǐngwèn nǐ shì...?", id: "Ya, betul. Permisi Anda adalah...?" },
            { speaker: "李明華", zh: "我是李明華。這是王開文先生。歡迎你來臺灣！", pinyin: "Wǒ shì Lǐ Mínghuá. Zhè shì Wáng Kāiwén xiānshēng. Huānyíng nǐ lái Táiwān!", id: "Saya Li Minghua. Ini Tuan Wang Kaiwen. Selamat datang di Taiwan!" },
            { speaker: "陳月美", zh: "謝謝你們來接我！很高興認識你們。", pinyin: "Xièxie nǐmen lái jiē wǒ! Hěn gāoxìng rènshì nǐmen.", id: "Terima kasih kalian sudah datang menjemput saya! Senang berkenalan dengan kalian." },
            { speaker: "李明華", zh: "請喝茶。這是臺灣的烏龍茶，很好喝！", pinyin: "Qǐng hē chá. Zhè shì Táiwān de Wūlóng chá, hěn hǎohē!", id: "Silakan minum teh. Ini teh Oolong Taiwan, enak sekali!" },
            { speaker: "王開文", zh: "我不喝咖啡，我最喜歡喝臺灣茶。", pinyin: "Wǒ bù hē kāfēi, wǒ zuì xǐhuān hē Táiwān chá.", id: "Saya tidak minum kopi, saya paling suka minum teh Taiwan." }
        ]
    },
    {
        num: 2,
        title_zh: "我的家人",
        title_pinyin: "Wǒ de Jiārén",
        title_id: "Keluargaku",
        title_en: "My Family",
        location: "臺北家庭公寓 (Taipei Home Apartment)",
        landmark_icon: "🏡",
        landmark_desc: "Ruang Tamu Keluarga Tradisional Taipei dengan Album Foto",
        fun_fact: "Di Taiwan, menyapa '請進' (Silakan masuk) dan melepas sepatu di pintu masuk (玄關) adalah etiket rumah tangga yang sangat penting.",
        dialogue: [
            { speaker: "張怡君", zh: "安同，請進！請坐！", pinyin: "Āntóng, qǐng jìn! Qǐng zuò!", id: "Antong, silakan masuk! Silakan duduk!" },
            { speaker: "馬安同", zh: "謝謝。怡君，你的家真漂亮！", pinyin: "Xièxie. Yíjūn, nǐ de jiā zhēn piàoliang!", id: "Terima kasih. Yijun, rumahmu sungguh indah!" },
            { speaker: "張怡君", zh: "這是我家的客廳。你看，這是我家人的照片。", pinyin: "Zhè shì wǒ jiā de kètīng. Nǐ kàn, zhè shì wǒ jiārén de zhàopiàn.", id: "Ini ruang tamu rumah saya. Coba lihat, ini foto anggota keluarga saya." },
            { speaker: "馬安同", zh: "這張照片很好看。這是誰？", pinyin: "Zhè zhāng zhàopiàn hěn hǎokàn. Zhè shì shéi?", id: "Foto lembar ini bagus sekali. Ini siapa?" },
            { speaker: "張怡君", zh: "這是我爸爸、媽媽，還有我哥哥和妹妹。", pinyin: "Zhè shì wǒ bàba, māma, hái yǒu wǒ gēge hàn mèimei.", id: "Ini ayahku, ibuku, dan juga kakak laki-laki serta adik perempuanku." }
        ]
    },
    {
        num: 3,
        title_zh: "週末做什麼",
        title_pinyin: "Zhōumò Zuò Shénme",
        title_id: "Akhir Pekan Mau Ngapain?",
        title_en: "What to Do on the Weekend",
        location: "大安森林公園與影城 (Daan Park & Cinema)",
        landmark_icon: "🌳",
        landmark_desc: "Taman Hutan Daan & Bioskop Kota Taipei",
        fun_fact: "Bisbol (棒球) adalah olahraga nasional Taiwan! Warga Taipei gemar bersepeda YouBike dan menonton pertandingan bisbol di akhir pekan.",
        dialogue: [
            { speaker: "白如玉", zh: "今天晚上我們去看電影，好不好？", pinyin: "Jīntiān wǎnshàng wǒmen qù kàn diànyǐng, hǎo bù hǎo?", id: "Malam ini kita pergi nonton bioskop yuk, bagaimana?" },
            { speaker: "陳月美", zh: "好啊！妳想看美國電影還是臺灣電影？", pinyin: "Hǎo a! Nǐ xiǎng kàn Měiguó diànyǐng háishì Táiwān diànyǐng?", id: "Boleh banget! Kamu mau nonton film Amerika atau film Taiwan?" },
            { speaker: "白如玉", zh: "我們看臺灣電影吧！看電影可以學中文。", pinyin: "Wǒmen kàn Táiwān diànyǐng ba! Kàn diànyǐng kěyǐ xué Zhōngwén.", id: "Ayo kita nonton film Taiwan saja! Nonton film bisa sambil belajar bahasa Mandarin." },
            { speaker: "陳月美", zh: "太好了！明天早上我們再去打網球跟游泳。", pinyin: "Tài hǎo le! Míngtiān zǎoshang wǒmen zài qù dǎ wǎngqiú gēn yóuyǒng.", id: "Keren sekali! Besok pagi kita pergi main tenis dan berenang lagi." }
        ]
    },
    {
        num: 4,
        title_zh: "請問一共多少錢",
        title_pinyin: "Qǐngwèn Yígòng Duōshǎo Qián",
        title_id: "Permisi, Totalnya Berapa?",
        title_en: "How Much in Total?",
        location: "士林夜市與便利商店 (Shilin Night Market)",
        landmark_icon: "🏮",
        landmark_desc: "Pasar Malam Shilin, Kios Boba & Toko 24 Jam",
        fun_fact: "Di Taiwan, satuan mata uang sehari-hari disebut '塊' (kuai) atau NTD. Di minimarket, kasir akan selalu bertanya '需要微波嗎？' (Perlu dihangatkan di microwave?).",
        dialogue: [
            { speaker: "李明華", zh: "老闆，請問這杯熱奶茶多少錢？", pinyin: "Lǎobǎn, qǐngwèn zhè bēi rè nǎichá duōshǎo qián?", id: "Bos, permisi segelas teh susu panas ini berapa harganya?" },
            { speaker: "老闆", zh: "大杯五十塊，小杯三十五塊。", pinyin: "Dà bēi wǔshí kuài, xiǎo bēi sānshíwǔ kuài.", id: "Gelas besar 50 kuai, gelas kecil 35 kuai." },
            { speaker: "李明華", zh: "我要一杯大杯的，再要兩個包子。一共多少錢？", pinyin: "Wǒ yào yì bēi dà bēi de, zài yào liǎng ge bāozi. Yígòng duōshǎo qián?", id: "Saya mau satu gelas besar, lalu mau dua buah bakpao. Totalnya berapa?" },
            { speaker: "老闆", zh: "一共九十塊。要內用還是外帶？", pinyin: "Yígòng jiǔshí kuài. Yào nèiyòng háishì wàidài?", id: "Totalnya 90 kuai. Mau makan di tempat atau dibungkus pulang?" },
            { speaker: "李明華", zh: "我要外帶，謝謝老闆！", pinyin: "Wǒ yào wàidài, xièxie lǎobǎn!", id: "Saya mau bungkus bawa pulang, terima kasih Bos!" }
        ]
    },
    {
        num: 5,
        title_zh: "牛肉麵真好吃",
        title_pinyin: "Niúròumiàn Zhēn Hǎochī",
        title_id: "Mie Daging Sapi Enak Banget!",
        title_en: "Beef Noodles Are Delicious",
        location: "永康街美食街 (Yongkang Gourmet Street)",
        landmark_icon: "🍜",
        landmark_desc: "Kedai Mie Sapi Yongkang Legendaris Taipei",
        fun_fact: "Taiwanese Beef Noodles (臺灣牛肉麵) memiliki festival tahunan sendiri di Taipei! Kuahnya gurih kaya rempah dengan daging empuk yang meleleh di lidah.",
        dialogue: [
            { speaker: "王開文", zh: "月美，這家餐廳的牛肉麵很有名，真好吃！", pinyin: "Yuèměi, zhè jiā cāntīng de niúròumiàn hěn yǒumíng, zhēn hǎochī!", id: "Yuemei, mie sapi di restoran ini sangat terkenal, enak sekali!" },
            { speaker: "陳月美", zh: "是啊！湯的味道真香。你要大碗還是小碗？", pinyin: "Shì a! Tāng de wèidào zhēn xiāng. Nǐ yào dà wǎn háishì xiǎo wǎn?", id: "Iya benar! Aroma kuahnya wangi banget. Kamu mau mangkuk besar atau kecil?" },
            { speaker: "王開文", zh: "我很餓，我要一大碗！你常來這裡吃嗎？", pinyin: "Wǒ hěn è, wǒ yào yí dà wǎn! Nǐ cháng lái zhèlǐ chī ma?", id: "Saya sangat lapar, saya mau satu mangkuk besar! Kamu sering makan di sini?" },
            { speaker: "陳月美", zh: "我每個星期都來一次。這裡的小菜也很讚！", pinyin: "Wǒ měi ge xīngqí dōu lái yí cì. Zhèlǐ de xiǎocài yě hěn zàn!", id: "Saya setiap pekan datang sekali. Lauk cemilannya di sini juga mantap sekali!" }
        ]
    },
    {
        num: 6,
        title_zh: "他們學校在山上",
        title_pinyin: "Tāmen Xuéxiào Zài Shānshàng",
        title_id: "Sekolah Mereka di Atas Gunung",
        title_en: "Their School is on the Mountain",
        location: "陽明山國立大學 (Yangmingshan Campus)",
        landmark_icon: "⛰️",
        landmark_desc: "Kampus Indah di Kaki Gunung Yangmingshan",
        fun_fact: "Banyak kampus di Taiwan memiliki lanskap pegunungan yang asri. Pemandangan bunga sakura mekar di Yangmingshan saat musim semi sangat memesona.",
        dialogue: [
            { speaker: "馬安同", zh: "請問師範大學在哪裡？離這裡遠不遠？", pinyin: "Qǐngwèn Shīfàn Dàxué zài nǎlǐ? Lí zhèlǐ yuǎn bù yuǎn?", id: "Numpang tanya Universitas Normal (NTNU) di mana? Dari sini jauh tidak?" },
            { speaker: "張怡君", zh: "不遠，就在捷運站前面。大樓旁邊就是圖書館。", pinyin: "Bù yuǎn, jiù zài jiéyùn zhàn qiánmiàn. Dàlóu pángbiān jiù shì túshūguǎn.", id: "Tidak jauh, persis di depan stasiun MRT. Di samping gedung adalah perpustakaan." },
            { speaker: "馬安同", zh: "他們學校在山上嗎？風景是不是很美？", pinyin: "Tāmen xuéxiào zài shānshàng ma? Fēngjǐng shì bu shì hěn měi?", id: "Apakah sekolah mereka di atas gunung? Pemandangannya indah sekali bukan?" },
            { speaker: "張怡君", zh: "文化大學在陽明山上，前面可以看到海，後面是山，風景太美了！", pinyin: "Wénhuà Dàxué zài Yángmíngshān shàng, qiánmiàn kěyǐ kàndào hǎi, hòumiàn shì shān, fēngjǐng tài měi le!", id: "Universitas Budaya ada di atas Gunung Yangming, bagian depannya bisa melihat laut, belakangnya gunung, pemandangannya sungguh indah!" }
        ]
    },
    {
        num: 7,
        title_zh: "早上九點去KTV",
        title_pinyin: "Zǎoshang Jiǔdiǎn Qù KTV",
        title_id: "Pukul 9 Pagi Pergi ke KTV",
        title_en: "Going to KTV at 9 AM",
        location: "西門町錢櫃KTV (Ximending KTV)",
        landmark_icon: "🎤",
        landmark_desc: "Gemerlap Ximending & Ruang Karaoke Megah Taiwan",
        fun_fact: "Budaya KTV di Taiwan sangat unik: harga pagi hari (晨唱) jauh lebih murah dan sudah termasuk prasmanan makanan lezat!",
        dialogue: [
            { speaker: "田中誠一", zh: "開文，明天早上九點去KTV唱歌，好不好？", pinyin: "Kāiwén, míngtiān zǎoshang jiǔ diǎn qù KTV chànggē, hǎo bù hǎo?", id: "Kaiwen, besok pagi jam 9 pergi ke KTV bernyanyi yuk, mau tidak?" },
            { speaker: "王開文", zh: "早上九點？那麼早！下午去怎麼樣？", pinyin: "Zǎoshang jiǔ diǎn? Nàme zǎo! Xiàwǔ qù zěnmeyàng?", id: "Jam 9 pagi? Pagi banget! Bagaimana kalau perginya sore hari?" },
            { speaker: "田中誠一", zh: "早上去比較便宜，而且還可以吃早餐。", pinyin: "Zǎoshang qù bǐjiào piányí, érqiě hái kěyǐ chī zǎocān.", id: "Pagi hari lebih murah, lagipula kita juga bisa sekalian sarapan." },
            { speaker: "王開文", zh: "好！我們明天早上八點半在捷運站見面！", pinyin: "Hǎo! Wǒmen míngtiān zǎoshang bā diǎn bàn zài jiéyùn zhàn jiànmiàn!", id: "Baiklah! Besok pagi jam 8.30 kita ketemuan di stasiun MRT ya!" }
        ]
    },
    {
        num: 8,
        title_zh: "坐火車去臺南",
        title_pinyin: "Zuò Huǒchē Qù Táinán",
        title_id: "Naik Kereta Api ke Tainan",
        title_en: "Take the Train to Tainan",
        location: "臺灣高鐵與臺南古都 (Taiwan High Speed Rail & Tainan)",
        landmark_icon: "🚂",
        landmark_desc: "Kereta Cepat HSR & Kota Tua Kuliner Tainan",
        fun_fact: "Kereta Cepat Taiwan (高鐵 / HSR) melesat dengan kecepatan 300 km/jam! Perjalanan dari Taipei ke Tainan hanya memakan waktu 1,5 jam.",
        dialogue: [
            { speaker: "白如玉", zh: "月美，這個週末我想坐火車去臺南玩。", pinyin: "Yuèměi, zhè ge zhōumò wǒ xiǎng zuò huǒchē qù Táinán wán.", id: "Yuemei, akhir pekan ini saya ingin naik kereta pergi liburan ke Tainan." },
            { speaker: "陳月美", zh: "坐火車要三個多小時，坐高鐵比較快，只要一個半小時！", pinyin: "Zuò huǒchē yào sān ge duō xiǎoshí, zuò gāotiě bǐjiào kuài, zhǐ yào yí ge bàn xiǎoshí!", id: "Naik kereta biasa perlu 3 jam lebih, naik HSR lebih cepat, hanya perlu 1,5 jam!" },
            { speaker: "白如玉", zh: "高鐵票貴不貴？怎麼買票？", pinyin: "Gāotiě piào guì bu guì? Zěnme mǎi piào?", id: "Tiket HSR mahal tidak? Bagaimana cara beli tiketnya?" },
            { speaker: "陳月美", zh: "便利商店就可以買票，非常方便！我跟妳一起去吃臺南小吃！", pinyin: "Biànlì shāngdiàn jiù kěyǐ mǎi piào, fēicháng fāngbiàn! Wǒ gēn nǐ yìqǐ qù chī Táinán xiǎochī!", id: "Di minimarket sudah bisa beli tiket, praktis banget! Aku ikut kamu makan jajanan Tainan!" }
        ]
    },
    {
        num: 9,
        title_zh: "放假去哪裡玩",
        title_pinyin: "Fàngjià Qù Nǎlǐ Wán",
        title_id: "Liburan Mau Jalan-jalan ke Mana?",
        title_en: "Where to Go for Vacation",
        location: "花蓮太魯閣國家公園 (Taroko Gorge Hualien)",
        landmark_icon: "🏞️",
        landmark_desc: "Ngarai Marmer Megah Taroko & Pantai Qixingtan",
        fun_fact: "Taroko Gorge (太魯閣) di pantai timur Taiwan terkenal dengan tebing marmer raksasa dan jembatan gantung alami di atas sungai toska.",
        dialogue: [
            { speaker: "李明華", zh: "放假你們打算去哪裡玩？", pinyin: "Fàngjià nǐmen dǎsuàn qù nǎlǐ wán?", id: "Waktu liburan kalian berencana liburan ke mana?" },
            { speaker: "馬安同", zh: "我打算帶相機去花蓮太魯閣，聽說那裡風景最美！", pinyin: "Wǒ dǎsuàn dài xiàngjī qù Huālián Tàilǔgé, tīngshuō nàlǐ fēngjǐng zuì měi!", id: "Saya berencana bawa kamera pergi ke Taroko Hualien, katanya pemandangan di sana paling indah!" },
            { speaker: "李明華", zh: "太魯閣的日出很有名！你們要住飯店還是民宿？", pinyin: "Tàilǔgé de rìchū hěn yǒumíng! Nǐmen yào zhù fàndiàn háishì mínsù?", id: "Matahari terbit Taroko sangat terkenal! Kalian mau menginap di hotel atau homestay (minshuku)?" },
            { speaker: "馬安同", zh: "我們要住民宿，老闆很客氣，還會幫我們準備早餐。", pinyin: "Wǒmen yào zhù mínsù, lǎobǎn hěn kèqì, hái huì bāng wǒmen zhǔnbèi zǎocān.", id: "Kami mau menginap di homestay, pemiliknya sangat ramah dan akan menyiapkan sarapan buat kami." }
        ]
    },
    {
        num: 10,
        title_zh: "臺灣的水果很好吃",
        title_pinyin: "Táiwān de Shuǐguǒ Hěn Hǎochī",
        title_id: "Buah-buahan Taiwan Sangat Enak",
        title_en: "Taiwanese Fruits Are Delicious",
        location: "屏東果園與傳統果菜市場 (Pingtung Fruit Market)",
        landmark_icon: "🥭",
        landmark_desc: "Pasar Buah Tropis: Mangga Aiwen, Nanas, dan Semangka",
        fun_fact: "Taiwan dijuluki 'Kerajaan Buah' (水果王國). Mangga Aiwen (愛文芒果) yang manis legit disajikan di atas gunung es serut susu (芒果冰) adalah favorit dunia!",
        dialogue: [
            { speaker: "張怡君", zh: "開文，你喜歡吃什麼臺灣水果？", pinyin: "Kāiwén, nǐ xǐhuān chī shénme Táiwān shuǐguǒ?", id: "Kaiwen, kamu suka makan buah Taiwan apa?" },
            { speaker: "王開文", zh: "我最喜歡黃色的芒果和紅色的西瓜，都好甜！", pinyin: "Wǒ zuì xǐhuān huángsè de mángguǒ hàn hóngsè de xīguā, dōu hǎo tián!", id: "Saya paling suka mangga yang kuning dan semangka yang merah, semuanya manis banget!" },
            { speaker: "張怡君", zh: "老闆，請問這個芒果一斤多少錢？可以試吃嗎？", pinyin: "Lǎobǎn, qǐngwèn zhè ge mángguǒ yì jīn duōshǎo qián? Kěyǐ shìchī ma?", id: "Bos, numpang tanya mangga ini satu kati (jin) berapa? Boleh cicipi dulu?" },
            { speaker: "老闆", zh: "來！試吃不用錢！甜得很，一斤八十塊！", pinyin: "Lái! Shìchī bú yòng qián! Tián de hěn, yì jīn bāshí kuài!", id: "Sini cicipi gratis! Manis banget, satu kati 80 kuai!" }
        ]
    },
    {
        num: 11,
        title_zh: "我要租房子",
        title_pinyin: "Wǒ Yào Zū Fángzi",
        title_id: "Saya Mau Sewa Kamar/Rumah",
        title_en: "I Want to Rent an Apartment",
        location: "師大商圈學生套房 (Shida Student Studios)",
        landmark_icon: "🏢",
        landmark_desc: "Kamar Kos Mahasiswa Dekat Kampus Shida & Gongguan",
        fun_fact: "Di Taiwan, '套房' (taofang) berarti kamar kos lengkap dengan kamar mandi pribadi, sedangkan '雅房' (yafang) menggunakan kamar mandi bersama.",
        dialogue: [
            { speaker: "馬安同", zh: "房東先生您好，我在網路上看到租屋的廣告。", pinyin: "Fángdōng xiānshēng nín hǎo, wǒ zài wǎnglù shàng kàndào zūwū de guǎnggào.", id: "Halo Tuan Pemilik Rumah, saya melihat iklan sewa kamar di internet." },
            { speaker: "房東", zh: "你好！這間套房一個月房租八千塊，有冷氣、洗衣機和冰箱。", pinyin: "Nǐ hǎo! Zhè jiān tàofáng yí ge yuè fángzū bāqiān kuài, yǒu lěngqì, xǐyījī hàn bīngxiāng.", id: "Halo! Kamar studio ini uang sewa sebulan 8.000 kuai, ada AC, mesin cuci, dan kulkas." },
            { speaker: "馬安同", zh: "請問這裡環境安靜嗎？押金要幾個月？", pinyin: "Qǐngwèn zhèlǐ huánjìng ānjìng ma? Yājīn yào jǐ ge yuè?", id: "Numpang tanya apakah lingkungannya tenang? Uang jaminan (deposit) berapa bulan?" },
            { speaker: "房東", zh: "這裡很安靜，離捷運站只要走路五分鐘。押金兩個月。", pinyin: "Zhèlǐ hěn ānjìng, lí jiéyùn zhàn zhǐ yào zǒulù wǔ fēnzhōng. Yājīn liǎng ge yuè.", id: "Di sini sangat tenang, jalan kaki ke stasiun MRT cuma 5 menit. Deposit 2 bulan." }
        ]
    },
    {
        num: 12,
        title_zh: "你在臺灣學多久的中文",
        title_pinyin: "Nǐ Zài Táiwān Xué Duōjiǔ de Zhōngwén",
        title_id: "Sudah Berapa Lama Belajar Mandarin?",
        title_en: "How Long Have You Studied Mandarin in Taiwan?",
        location: "師大國語中心 (MTC Mandarin Training Center)",
        landmark_icon: "🎓",
        landmark_desc: "Pusat Bahasa Mandarin NTNU (Pusat Pembelajaran Mandarin Terbesar)",
        fun_fact: "Di Taiwan, siswa diajarkan Aksara Tradisional (繁體字) dan sistem Zhuyin (注音 ㄅㄆㄇㄈ). Bentuk aksara tradisional mempertahankan filosofi dan keindahan kaligrafi ribuan tahun!",
        dialogue: [
            { speaker: "陳月美", zh: "開文，你在臺灣學多久的中文了？", pinyin: "Kāiwén, nǐ zài Táiwān xué duōjiǔ de Zhōngwén le?", id: "Kaiwen, sudah berapa lama kamu belajar bahasa Mandarin di Taiwan?" },
            { speaker: "王開文", zh: "我已經學了半年了。你的中文真流利！", pinyin: "Wǒ yǐjīng xué le bàn nián le. Nǐ de Zhōngwén zhēn liúlì!", id: "Saya sudah belajar selama setengah tahun. Bahasa Mandarinmu lancar sekali!" },
            { speaker: "陳月美", zh: "謝謝！我覺得聲調最難，但是多練習就會進步很快。", pinyin: "Xièxie! Wǒ juéde shēngdiào zuì nán, dànshì duō liànxí jiù huì jìnbù hěn kuài.", id: "Terima kasih! Menurutku nada bunyi adalah yang paling sulit, tetapi sering berlatih akan cepat maju." },
            { speaker: "王開文", zh: "我也覺得寫繁體字很有意思，我們一起加油！", pinyin: "Wǒ yě juéde xiě fántǐzì hěn yǒu yìsi, wǒmen yìqǐ jiāyóu!", id: "Aku juga merasa menulis aksara tradisional sangat menarik, ayo kita sama-sama semangat!" }
        ]
    },
    {
        num: 13,
        title_zh: "生日快樂",
        title_pinyin: "Shēngrì Kuàilè",
        title_id: "Selamat Ulang Tahun!",
        title_en: "Happy Birthday",
        location: "信義區火鍋餐廳 (Xinyi Taipei 101 Hotpot)",
        landmark_icon: "🎂",
        landmark_desc: "Pesta Makan Hotpot Menghadap Menara Taipei 101",
        fun_fact: "Masyarakat Taiwan merayakan ulang tahun dengan makan kue dan sering kali menyantap mie panjang umur (長壽麵) agar panjang umur dan sehat selalu!",
        dialogue: [
            { speaker: "張怡君", zh: "安同，祝你生日快樂！這是我們送給你的禮物！", pinyin: "Āntóng, zhù nǐ shēngrì kuàilè! Zhè shì wǒmen sòng gěi nǐ de lǐwù!", id: "Antong, selamat ulang tahun untukmu! Ini kado yang kami berikan untukmu!" },
            { speaker: "馬安同", zh: "哇！太謝謝你們了！這個蛋糕看起來真美味！", pinyin: "Wa! Tài xièxie nǐmen le! Zhè ge dàngāo kàn qǐlái zhēn měiwèi!", id: "Wah! Terima kasih banyak kalian! Kue tar ini kelihatannya enak sekali!" },
            { speaker: "李明華", zh: "快許願、吹蠟燭！今天晚上我請客！", pinyin: "Kuài xǔyuàn, chuī làzhú! Jīntiān wǎnshàng wǒ qǐngkè!", id: "Ayo cepat buat permohonan dan tiup lilin! Malam ini aku yang traktir!" },
            { speaker: "馬安同", zh: "謝謝大家！祝我們中文都越學越好，乾杯！", pinyin: "Xièxie dàjiā! Zhù wǒmen Zhōngwén dōu yuè xué yuè hǎo, gānbēi!", id: "Terima kasih semuanya! Semoga Mandarin kita semua makin hebat, bersulang!" }
        ]
    },
    {
        num: 14,
        title_zh: "天氣這麼冷",
        title_pinyin: "Tiānqì Zhème Lěng",
        title_id: "Cuaca Dingin Sekali",
        title_en: "The Weather is So Cold",
        location: "北投溫泉鄉 (Beitou Hot Springs Valley)",
        landmark_icon: "♨️",
        landmark_desc: "Pemandian Air Panas Belerang Alami Beitou",
        fun_fact: "Di musim dingin (冬天), berendam di pemandian air panas alami Beitou (北投溫泉) adalah tradisi relaksasi paling favorit bagi warga Taiwan.",
        dialogue: [
            { speaker: "白如玉", zh: "今天天氣怎麼這麼冷！只有十二度！", pinyin: "Jīntiān tiānqì zěnme zhème lěng! Zhǐ yǒu shí'èr dù!", id: "Hari ini kenapa cuaca dingin sekali! Cuma ada 12 derajat!" },
            { speaker: "陳月美", zh: "臺北冬天常常下雨又刮風，你要多穿一件外套。", pinyin: "Táiběi dōngtiān chángcháng xiàyǔ yòu guāfēng, nǐ yào duō chuān yí jiàn wàitào.", id: "Musim dingin di Taipei sering hujan dan berangin kencang, kamu harus pakai satu jaket lagi." },
            { speaker: "白如玉", zh: "這麼冷的天氣，我們去北投泡溫泉好不好？", pinyin: "Zhème lěng de tiānqì, wǒmen qù Běitóu pào wēnquán hǎo bu hǎo?", id: "Cuaca sedingin ini, kita pergi ke Beitou berendam air panas yuk?" },
            { speaker: "陳月美", zh: "好主意！泡溫泉身體會很溫暖，非常舒服！", pinyin: "Hǎo zhǔyì! Pào wēnquán shēntǐ huì hěn wēnnuǎn, fēicháng shūfú!", id: "Ide bagus! Berendam air panas badan akan jadi sangat hangat dan rileks nyaman!" }
        ]
    },
    {
        num: 15,
        title_zh: "我很不舒服",
        title_pinyin: "Wǒ Hěn Bù Shūfú",
        title_id: "Badanku Kurang Enak / Sakit",
        title_en: "I Do Not Feel Well",
        location: "診所與健保藥局 (Taiwan NHI Clinic & Pharmacy)",
        landmark_icon: "🏥",
        landmark_desc: "Klinik Dokter Taiwan & Apotek Asuransi Kesehatan NHI",
        fun_fact: "Sistem Asuransi Kesehatan Nasional Taiwan (全民健保 / NHI) diakui sebagai salah satu layanan medis terbaik di dunia. Berobat dan mengambil obat di apotek sangat efisien dan terjangkau.",
        dialogue: [
            { speaker: "醫生", zh: "白小姐，你哪裡不舒服？", pinyin: "Bái xiǎojiě, nǐ nǎlǐ bù shūfú?", id: "Nona Bai, di bagian mana yang tidak enak badan?" },
            { speaker: "白如玉", zh: "我一直流鼻水，頭也很痛，喉嚨有點發炎。", pinyin: "Wǒ yìzhí liú bíshuǐ, tóu yě hěn tòng, hóulóng yǒudiǎn fāyán.", id: "Saya terus meler ingusan, kepala juga sakit berdenyut, tenggorokan agak radang." },
            { speaker: "醫生", zh: "你有點發燒，是感冒了。不用擔心，吃藥多休息就會好。", pinyin: "Nǐ yǒudiǎn fāshāo, shì gǎnmào le. Búyòng dānxīn, chī yào duō xiūxí jiù huì hǎo.", id: "Anda agak demam, ini flu masuk angin. Jangan cemas, minum obat dan banyak istirahat akan sembuh." },
            { speaker: "白如玉", zh: "謝謝醫生。請問一天要吃幾次藥？", pinyin: "Xièxie yīshēng. Qǐngwèn yì tiān yào chī jǐ cì yào?", id: "Terima kasih dokter. Numpang tanya sehari perlu minum obat berapa kali?" },
            { speaker: "醫生", zh: "一天三次，飯後吃。多喝溫水，早一點睡覺！", pinyin: "Yì tiān sān cì, fàn hòu chī. Duō hē wēnshuǐ, zǎo yidǐan shuìjiào!", id: "Sehari 3 kali, diminum sesudah makan. Banyak minum air hangat dan tidurlah lebih awal!" }
        ]
    }
];

// Enrich each lesson with vocabulary
const fullLessonsData = lessonMetadata.map(meta => {
    const lNum = meta.num;
    const lessonEntries = entries.filter(e => e.lessonNum === lNum);

    const vocabList = lessonEntries.map((e, idx) => {
        let zhuyin = convertPinyinToZhuyin(e.pinyin);
        let posMatch = e.def_en.match(/^\(([^\)]+)\)/);
        let posTag = posMatch ? posMatch[1] : 'Kata';
        let posName = posMap[posTag] || posTag;
        let defId = getIndonesian(e.hanzi, e.def_en);

        return {
            id: `L${String(lNum).padStart(2, '0')}_${String(idx + 1).padStart(3, '0')}`,
            lesson: lNum,
            part: e.part,
            hanzi: e.hanzi,
            pinyin: e.pinyin,
            zhuyin: zhuyin,
            posTag: posTag,
            posName: posName,
            def_en: e.def_en,
            def_id: defId
        };
    });

    return {
        ...meta,
        vocabCount: vocabList.length,
        vocabularies: vocabList
    };
});

console.log(`Generated all ${fullLessonsData.length} lessons data.`);
console.log(`Total vocabulary items: ${fullLessonsData.reduce((acc, l) => acc + l.vocabularies.length, 0)}`);

// Write as JSON
fs.writeFileSync('lessons_database.json', JSON.stringify(fullLessonsData, null, 2));

// Also generate browser-ready JavaScript bundle
const jsContent = `/**
 * TAIWAN MANDARIN VOCABULARY DATABASE
 * A Course in Contemporary Chinese Book 1 (當代中文課程 1)
 * Complete official dataset with 568 vocabulary items, Zhuyin, Pinyin, and Indonesian translations.
 */
window.MANDARIN_DATABASE = ${JSON.stringify(fullLessonsData, null, 2)};
`;

fs.writeFileSync('lessons_database.js', jsContent, 'utf8');
console.log('Successfully saved lessons_database.json and lessons_database.js!');
