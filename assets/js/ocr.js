// Habib-summary — OCR Module
// ============================================================
// wrapper برای Tesseract.js با پشتیبانی از زبان فارسی
// ============================================================

const OCR = {
    async recognize(imageUrl, lang = 'fas') {
        const result = await Tesseract.recognize(imageUrl, lang, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    this.onProgress?.(m.progress);
                }
            }
        });
        return {
            text: result.data.text,
            confidence: result.data.confidence,
            words: result.data.words,
            paragraphs: result.data.paragraphs
        };
    },

    onProgress: null
};
