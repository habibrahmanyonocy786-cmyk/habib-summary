// Habib-summary — DOCX Viewer Module
// ============================================================
// استفاده از Mammoth.js برای تبدیل DOCX به HTML
// ============================================================

const DOCXViewer = {
    async convertToHtml(arrayBuffer) {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        return {
            html: result.value,
            messages: result.messages
        };
    },

    render(container, html) {
        container.innerHTML = html;
    }
};
