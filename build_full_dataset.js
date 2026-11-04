const fs = require('fs');

const rawContent = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/brain/70a8c8dd-e6d5-432b-9bc5-72bcf1c450e8/.system_generated/steps/62/content.md', 'utf8');
const lines = rawContent.split('\n');

// Parse raw TSV into lesson groups
const lessonNames = {
    1: { zh: '歡迎你來臺灣', pinyin: 'Huānyíng Nǐ Lái Táiwān', id: 'Selamat Datang di Taiwan!', en: 'Welcome to Taiwan!', location: '桃園國際機場 (Taoyuan Airport)', landmark: '✈️ Bandara Taoyuan & Ruang Teh', bgGradient: 'from-amber-700 to-red-900', color: '#e63946' },
    2: { zh: '我的家人', pinyin: 'Wǒ de Jiārén', id: 'Keluargaku', en: 'My Family', location: '台北家庭公寓 (Taipei Home)', landmark: '🏡 Rumah Tradisional & Ruang Keluarga', bgGradient: 'from-orange-700 to-amber-900', color: '#f4a261' },
    3: { zh: '週末做什麼', pinyin: 'Zhōumò Zuò Shénme', id: 'Akhir Pekan Mau Ngapain?', en: 'What to Do on the Weekend?', location: '大安森林公園 (Daan Park & Cinema)', landmark: '🌳 Taman Daan & Bioskop Taipei', bgGradient: 'from-emerald-700 to-teal-900', color: '#2a9d8f' },
    4: { zh: '請問一共多少錢', pinyin: 'Qǐngwèn Yígòng Duōshǎo Qián', id: 'Permisi, Totalnya Berapa?', en: 'How Much in Total?', location: '士林夜市 (Shilin Night Market)', landmark: '🏮 Pasar Malam Shilin & Boba Tea', bgGradient: 'from-rose-700 to-pink-900', color: '#e76f51' },
    5: { zh: '牛肉麵真好吃', pinyin: 'Niúròumiàn Zhēn Hǎochī', id: 'Mie Sapi Enak Banget!', en: 'Beef Noodles Are So Delicious', location: '永康街 (Yongkang Gourmet Street)', landmark: '🍜 Restoran Mie Sapi Yongkang', bgGradient: 'from-amber-600 to-orange-900', color: '#e9c46a' },
    6: { zh: '他們學校在山上', pinyin: 'Tāmen Xuéxiào Zài Shānshàng', id: 'Sekolah Mereka di Atas Gunung', en: 'Their School is on the Mountain', location: '陽明山 (Yangmingshan Campus)', landmark: '⛰️ Kampus Gunung Yangmingshan', bgGradient: 'from-teal-700 to-cyan-900', color: '#264653' },
    7: { zh: '早上九點去KTV', pinyin: 'Zǎoshang Jiǔdiǎn Qù KTV', id: 'Pukul 9 Pagi Pergi ke KTV', en: 'Going to KTV at 9 AM', location: '西門町 (Ximending Party Zone)', landmark: '🎤 KTV Ximending & Belanja', bgGradient: 'from-purple-700 to-indigo-900', color: '#7209b7' },
    8: { zh: '坐火車去臺南', pinyin: 'Zuò Huǒchē Qù Táinán', id: 'Naik Kereta Api ke Tainan', en: 'Take the Train to Tainan', location: '臺灣鐵路與臺南 (Taiwan Railway & Tainan)', landmark: '🚂 Stasiun Kereta Api TRA Tainan', bgGradient: 'from-blue-700 to-indigo-900', color: '#3a0ca3' },
    9: { zh: '放假去哪裡玩', pinyin: 'Fàngjià Qù Nǎlǐ Wán', id: 'Liburan Mau Jalan-jalan ke Mana?', en: 'Where to Go for Vacation?', location: '花蓮太魯閣 (Taroko Gorge Hualien)', landmark: '🏞️ Ngarai Alam Taroko Gorge', bgGradient: 'from-cyan-700 to-sky-900', color: '#4cc9f0' },
    10: { zh: '臺灣的水果很好吃', pinyin: 'Táiwān de Shuǐguǒ Hěn Hǎochī', id: 'Buah-buahan Taiwan Sangat Manis', en: 'Taiwanese Fruits Are Delicious', location: '屏東與夜市果汁攤 (Pingtung & Fruit Stands)', landmark: '🥭 Mangga Aiwen & Toko Buah Segar', bgGradient: 'from-yellow-600 to-amber-900', color: '#f77f00' },
    11: { zh: '我要租房子', pinyin: 'Wǒ Yào Zū Fángzi', id: 'Saya Mau Sewa Kamar / Rumah', en: 'I Want to Rent an Apartment', location: '公館師大商圈 (Gongguan / Shida Area)', landmark: '🏢 Sewa Kamar Dekat Kampus Shida', bgGradient: 'from-stone-700 to-zinc-900', color: '#4a4e69' },
    12: { zh: '你在臺灣學多久的中文', pinyin: 'Nǐ Zài Táiwān Xué Duōjiǔ de Zhōngwén', id: 'Sudah Berapa Lama Belajar Bahasa Mandarin?', en: 'How Long Have You Studied in Taiwan?', location: '國立臺灣師範大學國語中心 (MTC NTNU)', landmark: '🎓 Pusat Bahasa Mandarin NTNU (MTC)', bgGradient: 'from-indigo-700 to-slate-900', color: '#3d5a80' },
    13: { zh: '生日快樂', pinyin: 'Shēngrì Kuàilè', id: 'Selamat Ulang Tahun!', en: 'Happy Birthday!', location: '信義區餐酒館 (Xinyi Taipei 101 Bistro)', landmark: '🎂 Pesta Ultah Menghadap Taipei 101', bgGradient: 'from-rose-600 to-red-900', color: '#d90429' },
    14: { zh: '天氣這麼冷', pinyin: 'Tiānqì Zhème Lěng', id: 'Cuaca Dingin Sekali', en: 'The Weather is So Cold', location: '北投溫泉 (Beitou Hot Springs)', landmark: '♨️ Pemandian Air Panas Beitou', bgGradient: 'from-sky-700 to-blue-900', color: '#0077b6' },
    15: { zh: '我很不舒服', pinyin: 'Wǒ Hěn Bù Shūfú', id: 'Badanku Kurang Enak Badan / Sakit', en: 'I Do Not Feel Well', location: '臺大醫院診所與藥局 (NTU Hospital Clinic)', landmark: '🏥 Klinik & Apotek Tradisional Taiwan', bgGradient: 'from-red-800 to-rose-950', color: '#9b2226' }
};

let currentLessonCode = '';
let entries = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('//當代中文/Book 2/')) break;
    if (line.startsWith('//當代中文/Book 1/')) {
        currentLessonCode = line.replace('//當代中文/Book 1/', '').trim();
        continue;
    }
    if (!line || line.startsWith('Title:') || line.startsWith('Description:') || line.startsWith('Source:') || line.startsWith('---')) continue;
    
    const parts = line.split('\t').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
        entries.push({
            lessonCode: currentLessonCode,
            lessonNum: parseInt(currentLessonCode.substring(1, 3)),
            part: currentLessonCode.substring(4),
            hanzi: parts[0],
            pinyin: parts[1],
            def_en: parts[2] || ''
        });
    }
}

console.log(`Parsed ${entries.length} vocabulary entries across 15 lessons.`);
fs.writeFileSync('parsed_entries.json', JSON.stringify(entries, null, 2));
