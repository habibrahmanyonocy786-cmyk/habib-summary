// Habib-summary — Text Extraction Utility
// ============================================================
// استخراج متن از PDF, DOCX, و تصویر با یک API واحد
// ============================================================

const TextExtractor = {
    async fromPDF(file, onProgress) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
            onProgress?.(i / pdf.numPages);
        }
        return text;
    },

    async fromDOCX(file) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    },

    async fromImage(file, onProgress) {
        const url = URL.createObjectURL(file);
        const { data } = await Tesseract.recognize(url, 'fas', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    onProgress?.(m.progress);
                }
            }
        });
        URL.revokeObjectURL(url);
        return data.text;
    }
};
