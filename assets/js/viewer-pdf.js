// Habib-summary — PDF Viewer Module
// ============================================================
// wrapper برای PDF.js با قابلیت pagination، zoom و دانلود
// ============================================================

const PDFViewer = {
    currentPdf: null,
    currentPage: 1,
    totalPages: 0,
    scale: 1.5,

    async load(url_or_data) {
        // بارگذاری PDF از URL یا ArrayBuffer
        const loadingTask = pdfjsLib.getDocument(url_or_data);
        this.currentPdf = await loadingTask.promise;
        this.totalPages = this.currentPdf.numPages;
        this.currentPage = 1;
        return this.currentPdf;
    },

    async renderPage(canvas, pageNum) {
        if (!this.currentPdf) return;
        const page = await this.currentPdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: this.scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
    },

    async renderAll(canvas) {
        for (let i = 1; i <= this.totalPages; i++) {
            await this.renderPage(canvas, i);
        }
    }
};
