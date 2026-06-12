// Habib-summary — Extractive Summarization Engine
// ============================================================
// الگوریتم خلاصه‌سازی extractive مبتنی بر امتیازدهی جملات
// ============================================================

const Summarizer = {
    generate(text) {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [];
        const clean = sentences.map(s => s.trim()).filter(s => s.length > 20);

        if (clean.length === 0) {
            return { text: text.substring(0, 500), words: Math.min(wordCount, 80), ratio: 1 };
        }

        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const freq = {};
        words.forEach(w => { freq[w] = (freq[w] || 0) + 1 });
        const maxFreq = Math.max(...Object.values(freq), 1);

        const scored = clean.map((s, i) => {
            const sWords = s.toLowerCase().split(/\s+/).filter(w => w.length > 2);
            let score = 0;
            sWords.forEach(w => { if (freq[w]) score += freq[w] / maxFreq });
            score = score / (sWords.length || 1);
            const posScore = i < clean.length * 0.2 ? 0.3 : i > clean.length * 0.8 ? 0.1 : 0.2;
            const lenScore = Math.min(sWords.length / 30, 0.2);
            return { sentence: s, score: score + posScore + lenScore, idx: i };
        });

        let summaryLen;
        if (wordCount < 500) summaryLen = Math.min(3, clean.length);
        else if (wordCount < 3000) summaryLen = Math.min(5, clean.length);
        else if (wordCount < 10000) summaryLen = Math.min(8, clean.length);
        else summaryLen = Math.min(12, clean.length);

        const top = scored.sort((a, b) => b.score - a.score).slice(0, summaryLen);
        top.sort((a, b) => a.idx - b.idx);
        const text = top.map(s => s.sentence).join(' ');

        return {
            text,
            words: text.split(/\s+/).filter(w => w.length > 0).length,
            ratio: wordCount > 0 ? (text.split(/\s+/).filter(w => w.length > 0).length / wordCount) : 0
        };
    }
};
